import { Link } from "react-router-dom";
import { Clock, Paperclip, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import Card from "@/components/ui/Card";
import type { JadwalRow } from "@/types/kegiatan";
import { getDotColor } from "@/lib/utils/colors";

export default function BerandaTugasAktif({
    tugas,
}: {
    tugas: JadwalRow[];
}) {
    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Pekerjaan Berjalan
                </h2>
                <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {tugas.length} Aktif
                </span>
            </div>

            {tugas.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400 border-t border-gray-100">
                    Tidak ada pekerjaan aktif yang sedang dikerjakan saat ini.
                </div>
            ) : (
                <div className="divide-y divide-gray-100 border-t border-gray-100">
                    {tugas.slice(0, 4).map((item) => {
                        const isPerluUpdate = item.status === "perlu_update";
                        return (
                            <Link
                                key={item.id}
                                to={`/catatan-pekerjaan?id=${item.id}`}
                                className="block py-3 hover:bg-gray-50/70 -mx-5 px-5 transition group"
                            >
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                                    <div className="flex items-center gap-2">
                                        {isPerluUpdate ? (
                                            <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> PERLU UPDATE
                                            </span>
                                        ) : (
                                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                                                DIKERJAKAN
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1.5 font-medium text-gray-700">
                                            <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(item.penanggung_jawab_nama)}`}></span>
                                            <span className="truncate max-w-[120px]">{item.penanggung_jawab_nama}</span>
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-700 transition-colors" />
                                </div>

                                <h3 className="font-semibold text-gray-900 text-xs md:text-sm group-hover:text-emerald-800 transition-colors">
                                    {item.nama_kegiatan}
                                </h3>

                                {item.catatan && (
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                                        {item.catatan}
                                    </p>
                                )}

                                {item.lampiran_nama && (
                                    <div className="flex gap-2 mt-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 rounded text-[11px] truncate max-w-[240px]">
                                            <Paperclip className="w-3 h-3 text-gray-400 shrink-0" />
                                            <span className="truncate">{item.lampiran_nama}</span>
                                        </span>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}
