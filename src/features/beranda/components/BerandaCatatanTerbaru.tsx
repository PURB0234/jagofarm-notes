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
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    Catatan Terbaru Diperbarui
                </h2>
                <Link
                    to="/catatan-pekerjaan"
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                >
                    Lihat Semua Catatan →
                </Link>
            </div>

            {catatan.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400 border-t border-gray-100">
                    Belum ada riwayat catatan pekerjaan.
                </div>
            ) : (
                <div className="divide-y divide-gray-100 border-t border-gray-100">
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
                                className="block py-3 hover:bg-gray-50/70 -mx-5 px-5 transition group"
                            >
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                                                isSelesai
                                                    ? "bg-gray-100 text-gray-700 border border-gray-200"
                                                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                            }`}
                                        >
                                            {isSelesai ? "SELESAI" : "DIKERJAKAN"}
                                        </span>
                                        <span className="text-[11px] text-gray-500">
                                            oleh <strong className="text-gray-700">{item.penanggung_jawab_nama}</strong> • {dateFormatted}
                                        </span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-700" />
                                </div>

                                <h3 className="font-semibold text-gray-900 text-xs md:text-sm group-hover:text-emerald-800">
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
