"use client";

import { MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { formatTime } from "@/lib/utils/date";
import { getDurationInfo } from "@/lib/utils/duration";
import { getDotColor } from "@/lib/utils/colors";
import type { JadwalRow } from "@/types/kegiatan";

type KalenderCardProps = {
    task: JadwalRow;
    onSelect: (task: JadwalRow) => void;
    onDragStart: (e: React.DragEvent, task: JadwalRow) => void;
    onDragEnd: () => void;
    onComplete?: (task: JadwalRow) => void;
    onDelete?: (id: string, nama: string) => void;
};

export default function KalenderCard({
    task,
    onSelect,
    onDragStart,
    onDragEnd,
    onComplete,
    onDelete,
}: KalenderCardProps) {
    const isPanen = task.tag?.toUpperCase() === "PANEN";
    const isTim =
        Boolean(task.tag?.toLowerCase().includes("tim")) &&
        Boolean(
            task.penanggung_jawab_nama?.toLowerCase().includes("tim") ||
            task.penanggung_jawab_nama?.toLowerCase().includes("seluruh tim")
        );
    const isSelesai = task.status === "selesai";

    const { isMultiDay, daysCount } = getDurationInfo(task.tanggal, task.tanggal_selesai);

    return (
        <div
            draggable={true}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(task);
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                if (!isSelesai) {
                    if (confirm('Tandai agenda "' + task.nama_kegiatan + '" sebagai Selesai?')) {
                        onComplete?.(task);
                    }
                } else {
                    if (confirm("Hapus agenda ini secara permanen?")) {
                        onDelete?.(task.id, task.nama_kegiatan);
                    }
                }
            }}
            onDragStart={(e) => onDragStart(e, task)}
            onDragEnd={onDragEnd}
            className={
                "group relative p-2.5 rounded-lg border text-xs shadow-2xs transition-all select-none cursor-grab active:cursor-grabbing " +
                (isSelesai
                    ? "bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800/50"
                    : isPanen
                    ? "bg-green-50/80 border-green-200 hover:border-green-300 dark:bg-[#15271d] dark:border-emerald-800/40"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-xs dark:bg-[#1a2520] dark:border-[#273830] dark:hover:border-emerald-700/50")
            }
        >
            <div className="flex items-center justify-between gap-1">
                {isMultiDay ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                        <Calendar className="w-2.5 h-2.5 shrink-0" />
                        <span>{daysCount} hari</span>
                    </span>
                ) : (
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        {formatTime(task.waktu_mulai)} - {formatTime(task.waktu_selesai)}
                    </span>
                )}

                {task.status === "perlu_update" && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 animate-pulse dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60">
                        PERLU UPDATE
                    </span>
                )}

                {isSelesai ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        SELESAI
                    </span>
                ) : (
                    <>
                        {isPanen && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                PANEN
                            </span>
                        )}
                        {isTim && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                {task.tag}
                            </span>
                        )}
                    </>
                )}
            </div>

            <h4
                className={
                    "font-semibold mt-1 leading-snug " +
                    (isSelesai
                        ? "text-emerald-950 dark:text-emerald-300 line-through opacity-80"
                        : "text-gray-900 dark:text-white group-hover:text-green-800 dark:group-hover:text-emerald-300")
                }
            >
                {task.nama_kegiatan}
            </h4>

            {task.catatan && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {task.catatan}
                </p>
            )}

            <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-[#273830] flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                    <span
                        className={
                            "w-1.5 h-1.5 rounded-full " +
                            getDotColor(task.penanggung_jawab_nama)
                        }
                    />
                    <span className="truncate max-w-[80px] text-gray-700 dark:text-gray-300">
                        {task.penanggung_jawab_nama}
                    </span>
                </div>

                {task.lokasi && (
                    <span className="text-gray-400 dark:text-gray-500 flex items-center gap-0.5 truncate max-w-[70px]">
                        <MapPin className="w-3 h-3 text-gray-400 dark:text-gray-500 shrink-0" />
                        <span className="truncate">{task.lokasi}</span>
                    </span>
                )}
            </div>
        </div>
    );
}
