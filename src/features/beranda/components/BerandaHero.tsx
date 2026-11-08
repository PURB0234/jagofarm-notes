import { Calendar } from "lucide-react";
import { BULAN_NAMES, HARI_NAMES_ID } from "@/lib/utils/date";

export default function BerandaHero({
    roleLabel,
    activeCount,
    todayCount,
}: {
    roleLabel: string;
    activeCount: number;
    todayCount: number;
}) {
    const now = new Date();
    const dayName = HARI_NAMES_ID[now.getDay()];
    const dateText = `${dayName}, ${now.getDate()} ${BULAN_NAMES[now.getMonth()]} ${now.getFullYear()}`;

    const getGreeting = () => {
        const hour = now.getHours();
        if (hour < 11) return "Selamat pagi";
        if (hour < 15) return "Selamat siang";
        if (hour < 18) return "Selamat sore";
        return "Selamat malam";
    };

    return (
        <header className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs dark:bg-[#141c19] dark:border-[#1e2d27]">
            <div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5 font-medium dark:text-gray-400">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>{dateText}</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-emerald-800 dark:text-emerald-400 font-semibold">Operasional JagoFarm</span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {`${getGreeting()}, ${roleLabel}! 🌾`}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Sistem greenhouse normal. Terdapat <strong className="text-gray-900 dark:text-white font-semibold">{todayCount} agenda hari ini</strong> dan <strong className="text-gray-900 dark:text-white font-semibold">{activeCount} pekerjaan aktif</strong>.
                </p>
            </div>

            {/* Quick Summary Pill Box */}
            <div className="flex items-center border border-gray-200 rounded-lg p-2.5 divide-x divide-gray-200 text-center bg-gray-50/50 self-start md:self-auto dark:border-[#1e2d27] dark:divide-[#1e2d27] dark:bg-[#0e1613]">
                <div className="px-3">
                    <span className="block text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        Agenda Hari Ini
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{todayCount}</span>
                </div>
                <div className="px-3">
                    <span className="block text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        Aktif Berjalan
                    </span>
                    <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400">{activeCount}</span>
                </div>
            </div>
        </header>
    );
}
