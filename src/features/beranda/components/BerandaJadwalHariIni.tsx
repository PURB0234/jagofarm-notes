import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import type { JadwalRow } from "@/types/kegiatan";
import { formatTime } from "@/lib/utils/date";

export default function BerandaJadwalHariIni({
    jadwal,
}: {
    jadwal: JadwalRow[];
}) {
    return (
        <Card>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    Jadwal Hari Ini & Mendatang
                </h2>
                <Link
                    to="/catatan-pekerjaan?view=kalender"
                    className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
                >
                    Lihat Kalender →
                </Link>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium mb-3 pb-2 border-b border-gray-100 dark:border-[#1e2d27]">
                <span className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Agenda Terjadwal Hari Ini
                </span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{jadwal.length} Agenda</span>
            </div>

            {jadwal.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400 dark:text-gray-500">
                    Tidak ada agenda spesifik yang dijadwalkan hari ini.
                </div>
            ) : (
                <div className="space-y-2.5">
                    {jadwal.slice(0, 4).map((item) => {
                        const isSelesai = item.status === "selesai";
                        return (
                            <div
                                key={item.id}
                                className={`border-l-3 p-3 rounded-r-lg border-y border-r transition text-xs ${
                                    isSelesai
                                        ? "border-l-emerald-600 bg-emerald-50/20 border-gray-200 dark:bg-emerald-950/20 dark:border-[#1e2d27]"
                                        : "border-l-amber-500 bg-amber-50/15 border-gray-200 hover:border-gray-300 dark:bg-amber-950/20 dark:border-[#1e2d27] dark:hover:border-[#273830]"
                                }`}
                            >
                                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-1">
                                    <div className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        <span>
                                            {formatTime(item.waktu_mulai)} - {formatTime(item.waktu_selesai)}
                                        </span>
                                    </div>
                                    <span className="bg-white border border-gray-200 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded truncate max-w-[120px] dark:bg-[#0e1613] dark:border-[#273830] dark:text-gray-300">
                                        {item.penanggung_jawab_nama}
                                    </span>
                                </div>

                                <h3 className="font-bold text-gray-900 dark:text-white text-xs">
                                    {item.nama_kegiatan}
                                </h3>

                                {item.lokasi && (
                                    <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                        <span className="truncate">{item.lokasi}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}
