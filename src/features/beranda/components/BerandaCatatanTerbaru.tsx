import { Link } from "react-router-dom";
import { FileText, ExternalLink, Calendar } from "lucide-react";
import Card from "@/components/ui/Card";
import type { JadwalRow } from "@/types/kegiatan";

export default function BerandaCatatanTerbaru({
    catatan,
}: {
    catatan: JadwalRow[];
}) {
    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    Catatan Terbaru Diperbarui
                </h2>
                <Link
                    to="/catatan-pekerjaan"
                    className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
                >
                    Lihat Semua Catatan →
                </Link>
            </div>

            {catatan.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-[#1e2d27]">
                    Belum ada riwayat catatan pekerjaan.
                </div>
            ) : (
                <div className="divide-y divide-gray-100 dark:divide-[#1e2d27] border-t border-gray-100 dark:border-[#1e2d27]">
                    {catatan.map((item) => {
                        const isSelesai = item.status === "selesai";
                        const dateFormatted = item.created_at
                            ? new Date(item.created_at).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                              })
                            : item.tanggal;

                        return (
                            <Link
                                key={item.id}
                                to={`/catatan-pekerjaan?id=${item.id}`}
                                className="block py-3 hover:bg-gray-50/70 dark:hover:bg-[#1a2420]/50 -mx-5 px-5 transition group"
                            >
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                                                isSelesai
                                                    ? "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                                                    : "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
                                            }`}
                                        >
                                            {isSelesai ? "SELESAI" : "DIKERJAKAN"}
                                        </span>
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                            oleh <strong className="text-gray-700 dark:text-gray-200">{item.penanggung_jawab_nama}</strong> • {dateFormatted}
                                        </span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400" />
                                </div>

                                <h3 className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                                    {item.nama_kegiatan}
                                </h3>

                                {item.catatan && (
                                    <blockquote className="mt-2 p-2.5 bg-gray-50/80 border-l-2 border-emerald-600 rounded-r text-xs text-gray-600 line-clamp-2">
                                        {item.catatan}
                                    </blockquote>
                                )}
                            </Link>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}
