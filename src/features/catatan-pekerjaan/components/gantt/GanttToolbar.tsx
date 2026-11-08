"use client";

import {
    Layers,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Maximize2,
    Minimize2,
} from "lucide-react";
import type { MonthOption } from "@/types/common";
import TimelineFilterBar from "../filter/TimelineFilterBar";

type GanttToolbarProps = {
    totalTasks: number;
    totalDays: number;
    zoomLevel: number;
    setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
    isFullscreen: boolean;
    setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
    // Filter props
    filterStatus?: "semua" | "terjadwal" | "selesai";
    onFilterStatusChange?: (status: "semua" | "terjadwal" | "selesai") => void;
    staffList?: { label: string; text: string }[];
    selectedStaff?: string;
    onSelectedStaffChange?: (staff: string) => void;
    activeMonths?: MonthOption[];
    selectedMonthKey?: string;
    onSelectMonth?: (key: string, date?: Date) => void;
    completedMonths?: MonthOption[];
    selectedCompletedMonthKey?: string;
    onSelectCompletedMonth?: (key: string, date?: Date) => void;
};

export default function GanttToolbar({
    totalTasks,
    totalDays,
    zoomLevel,
    setZoomLevel,
    isFullscreen,
    setIsFullscreen,
    filterStatus,
    onFilterStatusChange,
    staffList,
    selectedStaff,
    onSelectedStaffChange,
    activeMonths,
    selectedMonthKey,
    onSelectMonth,
    completedMonths,
    selectedCompletedMonthKey,
    onSelectCompletedMonth,
}: GanttToolbarProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-3 shadow-2xs dark:bg-[#141c19] dark:border-[#1e2d27]">
            {/* Baris 1: Header Judul & Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg">
                            <Layers className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                                {isFullscreen ? "Timeline Gantt Chart (Layar Penuh)" : "Timeline Dinamis"}
                            </h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                {totalTasks} agenda • {totalDays} hari
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sisi Kanan Toolbar: Zoom + Fullscreen Toggle + Legenda */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Zoom Controls (Sumbu Z) */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Zoom:</span>
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#0e1613] p-1 rounded-lg border border-gray-200 dark:border-[#273830]">
                            <button
                                type="button"
                                title="Zoom Out (Sumbu Z)"
                                onClick={() => setZoomLevel((prev) => Math.max(0.6, Number((prev - 0.2).toFixed(1))))}
                                className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 dark:bg-[#141c19] dark:border-[#273830] dark:text-gray-300 dark:hover:bg-[#1a2420] transition cursor-pointer"
                            >
                                <ZoomOut className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 px-2 min-w-[50px] text-center">
                                {Math.round(zoomLevel * 100) + "%"}
                            </span>
                            <button
                                type="button"
                                title="Zoom In (Sumbu Z)"
                                onClick={() => setZoomLevel((prev) => Math.min(1.8, Number((prev + 0.2).toFixed(1))))}
                                className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 dark:bg-[#141c19] dark:border-[#273830] dark:text-gray-300 dark:hover:bg-[#1a2420] transition cursor-pointer"
                            >
                                <ZoomIn className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setZoomLevel(1)}
                                className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
                                title="Reset Zoom ke 100%"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Tombol Mode Layar Penuh */}
                    <button
                        type="button"
                        onClick={() => setIsFullscreen((prev) => !prev)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                            isFullscreen
                                ? "bg-[#17462e] text-white border-[#17462e] shadow-xs hover:bg-[#123824]"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-2xs dark:bg-[#141c19] dark:border-[#273830] dark:text-gray-300 dark:hover:bg-[#1a2420]"
                        }`}
                        title={isFullscreen ? "Keluar Layar Penuh (Tekan Esc)" : "Aktifkan Layar Penuh"}
                    >
                        {isFullscreen ? (
                            <>
                                <Minimize2 className="w-3.5 h-3.5" />
                                <span>Keluar Layar Penuh</span>
                            </>
                        ) : (
                            <>
                                <Maximize2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                                <span>Layar Penuh</span>
                            </>
                        )}
                    </button>

                    {/* Legenda Warna */}
                    <div className="hidden sm:flex items-center gap-2.5 text-[11px] text-gray-600 dark:text-gray-300 pl-2 border-l border-gray-200 dark:border-[#273830]">
                        <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                            <span>Selesai</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-sm bg-green-600"></span>
                            <span>Panen</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></span>
                            <span>Tim</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                            <span>Operasional</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Baris 2: Filtering Terpadu (Tampil di Mode Biasa maupun Layar Penuh) */}
            {filterStatus && (
                <div className="pt-2.5 border-t border-gray-100">
                    <TimelineFilterBar
                        filterStatus={filterStatus}
                        onFilterStatusChange={onFilterStatusChange || (() => {})}
                        staffList={staffList}
                        selectedStaff={selectedStaff || "Semua"}
                        onSelectStaff={onSelectedStaffChange || (() => {})}
                        staffDisplayMode="select"
                        activeMonths={activeMonths}
                        selectedMonthKey={selectedMonthKey}
                        onSelectMonthKey={onSelectMonth}
                        completedMonths={completedMonths}
                        selectedCompletedMonthKey={selectedCompletedMonthKey}
                        onSelectCompletedMonthKey={onSelectCompletedMonth}
                    />
                </div>
            )}
        </div>
    );
}
