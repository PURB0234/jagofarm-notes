import { Droplets, Thermometer, Activity, Sprout } from "lucide-react";

export default function BerandaMetrics({
    panenCount,
}: {
    panenCount: number;
}) {
    return (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* 1. Suhu & Kelembaban */}
            <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-gray-400 mb-1.5">
                    <span className="text-[10px] font-bold tracking-wider uppercase">Greenhouse 01</span>
                    <Thermometer className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-base md:text-lg font-bold text-gray-900">27.4°C</span>
                    <span className="text-xs text-gray-400">/ 72% RH</span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">Ventilasi normal</span>
            </div>

            {/* 2. EC Nutrisi */}
            <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-gray-400 mb-1.5">
                    <span className="text-[10px] font-bold tracking-wider uppercase">EC Tandon B</span>
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-base md:text-lg font-bold text-gray-900">1.82</span>
                    <span className="text-xs text-gray-400">mS/cm</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-medium mt-1 block">Sesuai target vegetatif</span>
            </div>

            {/* 3. pH Larutan */}
            <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-gray-400 mb-1.5">
                    <span className="text-[10px] font-bold tracking-wider uppercase">pH Rata-rata</span>
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-base md:text-lg font-bold text-gray-900">6.2</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Optimal
                    </span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">Dosing otomatis stabil</span>
            </div>

            {/* 4. Siklus Panen */}
            <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-gray-400 mb-1.5">
                    <span className="text-[10px] font-bold tracking-wider uppercase">Siklus Panen</span>
                    <Sprout className="w-3.5 h-3.5 text-green-700" />
                </div>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-base md:text-lg font-bold text-gray-900">{panenCount}</span>
                    <span className="text-xs text-gray-400">Agenda</span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">Terdaftar musim ini</span>
            </div>
        </section>
    );
}
