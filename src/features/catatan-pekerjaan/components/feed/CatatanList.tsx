"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { MapPin, Paperclip, ExternalLink, Image as ImageIcon, ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import type { Catatan } from "@/types/kegiatan";
import { getDurationInfo } from "@/lib/utils/duration";

export type { Catatan };

export default function CatatanList({
    catatans,
    activeId,
    currentUser,
    onSelect,
}: {
    catatans: Catatan[];
    activeId?: string;
    currentUser: { id: string, role: string; name: string };
    onSelect?: (id: string) => void;
}) {
    const [filter, setFilter] = useState<"semua" | "saya">("semua");
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 5;

    const handleFilterChange = (
        tab: "semua" | "saya"
    ) => {
        setFilter(tab);
        setPage(1);
    }

    const isMyTask = (c: Catatan) => {
        const pj = (c.penanggung_jawab || "").toLowerCase();
        const tag = (c.tag || "").toLowerCase();
        // 1. Jika Seluruh Tim, tertaut ke semua user
        if (pj.includes("seluruh tim") || pj.includes("tim") || tag.includes("tim")) {
            return true;
        }
        // 2. Jika ID penanggung jawab cocok
        if (c.penanggung_jawab_id && c.penanggung_jawab_id === currentUser.id) {
            return true;
        }
        // 3. Jika nama user cocok (lengkap atau nama depan)
        const myName = (currentUser.name || "").toLowerCase().trim();
        const myFirst = myName.split(" ")[0];
        if (myName && pj.includes(myName)) return true;
        if (myFirst && myFirst.length > 2 && pj.includes(myFirst)) return true;
        return false;
    };

    const displayedCatatans = filter === "semua"
        ? catatans
        : catatans.filter(isMyTask);

    const totalPages = Math.ceil(displayedCatatans.length / PAGE_SIZE) || 1;
    const paginatedCatatans = displayedCatatans.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase.channel("realtime-catatan").on(
            "postgres_changes",
            { event: "*", schema: "public", table: "jadwal_kegiatan" },
            () => {
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("app:sync"));
                }
            }
        ).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    return (
        <section className="space-y-3">
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2 px-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, displayedCatatans.length)} dari {displayedCatatans.length} catatan
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="p-1.5 border border-gray-200 dark:border-[#273830] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a2420] disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-[#141c19] text-gray-700 dark:text-gray-300 shadow-2xs transition-colors"
                            title="Halaman Sebelumnya"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setPage(num)}
                                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${page === num
                                        ? "bg-[#1E5E35] text-white shadow-2xs"
                                        : "border border-gray-200 dark:border-[#273830] bg-white dark:bg-[#141c19] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a2420]"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="p-1.5 border border-gray-200 dark:border-[#273830] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a2420] disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-[#141c19] text-gray-700 dark:text-gray-300 shadow-2xs transition-colors"
                            title="Halaman Berikutnya"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#0e1613] p-0.5 rounded-lg border border-gray-200 dark:border-[#273830]">
                    <button
                        type="button"
                        onClick={() => handleFilterChange("semua")}
                        className={`px-3 py-1 rounded-md font-semibold transition-all ${filter === "semua" ? "bg-white text-gray-900 dark:bg-[#1a2e24] dark:text-emerald-300 shadow-2xs" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                    >
                        Semua ({catatans.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterChange("saya")}
                        className={`px-3 py-1 rounded-md font-semibold transition-all ${filter === "saya" ? "bg-white text-gray-900 dark:bg-[#1a2e24] dark:text-emerald-300 shadow-2xs" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                    >
                        Tugas Saya ({catatans.filter(isMyTask).length})
                    </button>

                </div>
            </div>

            {displayedCatatans.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-[#141c19] rounded-xl border border-gray-200 dark:border-[#1e2d27] text-xs text-gray-500 dark:text-gray-400">
                    Tidak ada catatan pekerjaan {filter === "saya" ? "yang ditugaskan ke Anda." : "."}
                </div>
            ) : (
                paginatedCatatans.map((item) => {
                    const isActive = item.id === activeId;
                    const { startStr, endStr, isMultiDay, daysCount } = getDurationInfo(
                        item.tanggal || item.created_at,
                        item.tanggal_selesai
                    );

                    return (
                        <div
                            key={item.id}
                            onClick={() => {
                                onSelect?.(item.id);
                                window.history.replaceState(null, "", `/catatan-pekerjaan?id=${item.id}`);
                            }}
                            className="block"
                        >
                            <article
                                className={`rounded-xl p-4 shadow-xs space-y-2 cursor-pointer transition-all ${isActive
                                    ? "bg-white border-2 border-green-700 dark:bg-[#141c19] dark:border-emerald-500"
                                    : "bg-white border border-gray-200 hover:border-gray-300 dark:bg-[#141c19] dark:border-[#1e2d27] dark:hover:border-[#273830]"
                                    }`}
                            >
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.status === "dikerjakan"
                                            ? "bg-green-100 text-green-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                            }`}>
                                            {item.status}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                                            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                                            {item.penanggung_jawab}
                                        </span>
                                        <time className="text-gray-400 dark:text-gray-500 text-[11px]">
                                            {new Date(item.created_at).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })} WIB
                                        </time>
                                    </div>
                                    {isActive && (
                                        <span className="bg-green-50 text-green-800 border border-green-200 text-[10px] font-semibold px-2 py-0.5 rounded dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                                            Aktif Ditinjau
                                        </span>
                                    )}
                                </div>
                                <h2 className="font-bold text-gray-900 dark:text-white text-sm">{item.judul}</h2>
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{item.deskripsi}</p>
                                <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-gray-200 dark:border-[#1e2d27] text-[11px] text-gray-500 dark:text-gray-400">
                                    {isMultiDay ? (
                                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded text-[10px]">
                                            <Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            <span>{daysCount} hari ({startStr.slice(5)} - {endStr.slice(5)})</span>
                                        </span>
                                    ) : item.waktu_mulai ? (
                                        <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 font-medium">
                                            <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                                            <span>{item.waktu_mulai.slice(0, 5)} - {item.waktu_selesai ? item.waktu_selesai.slice(0, 5) : "10:00"}</span>
                                        </span>
                                    ) : null}

                                    {item.lokasi && (
                                        <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 font-medium">
                                            <MapPin className="w-3 h-3 text-gray-400 shrink-0" /> {item.lokasi}
                                        </span>
                                    )}
                                    {item.lampiran_url && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 dark:bg-[#0e1613] border border-gray-200 dark:border-[#273830] text-gray-700 dark:text-gray-300 rounded font-medium max-w-[200px] truncate">
                                            {item.lampiran_url.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                                                <ImageIcon className="w-3 h-3 text-blue-600 shrink-0" />
                                            ) : (
                                                <Paperclip className="w-3 h-3 text-gray-400 shrink-0" />
                                            )}
                                            <span className="truncate">{item.lampiran_nama || "Bukti Terunggah"}</span>
                                        </span>
                                    )}
                                    {item.tautan_eksternal && !item.tautan_eksternal.startsWith("jadwal:") && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50/60 border border-blue-200 text-blue-700 rounded font-medium">
                                            <ExternalLink className="w-3 h-3 text-blue-500 shrink-0" />
                                            <span>Tautan</span>
                                        </span>
                                    )}
                                </div>

                            </article>
                        </div>
                    );
                })
            )}
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2 px-1 text-xs text-gray-500">
                    <span className="text-[11px] text-gray-400">
                        {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, displayedCatatans.length)} dari {displayedCatatans.length} catatan
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed bg-white shadow-2xs transition-colors"
                            title="Halaman Sebelumnya"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setPage(num)}
                                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${page === num
                                        ? "bg-[#1E5E35] text-white shadow-2xs"
                                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed bg-white shadow-2xs transition-colors"
                            title="Halaman Berikutnya"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
