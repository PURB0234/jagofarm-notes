"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { BULAN_NAMES } from "@/lib/utils/date";
import type { MonthOption } from "@/types/common";
import TimelineFilterBar from "../filter/TimelineFilterBar";
import Select from "@/components/ui/Select";

type KalenderNavProps = {
    monday: Date;
    sunday: Date;
    onPrevWeek: () => void;
    onNextWeek: () => void;
    staffList: { label: string; text: string }[];
    selectedStaff: string;
    onSelectStaff: (staff: string) => void;
    filterStatus: "semua" | "terjadwal" | "selesai";
    onFilterStatusChange: (status: "semua" | "terjadwal" | "selesai") => void;
    activeMonths: MonthOption[];
    selectedMonthKey: string;
    onSelectMonthKey: (key: string) => void;
    completedMonths: MonthOption[];
    selectedCompletedMonthKey: string;
    onSelectCompletedMonthKey: (key: string) => void;
};

export default function KalenderNav({
    monday,
    sunday,
    onPrevWeek,
    onNextWeek,
    staffList,
    selectedStaff,
    onSelectStaff,
    filterStatus,
    onFilterStatusChange,
    activeMonths,
    selectedMonthKey,
    onSelectMonthKey,
    completedMonths,
    selectedCompletedMonthKey,
    onSelectCompletedMonthKey,
}: KalenderNavProps) {
    return (
        <div className="space-y-4">
            {/* Navigasi Tanggal & Filter Petugas */}
            <div className="flex flex-wrap items-center border border-gray-200 justify-between gap-3 p-2.5 rounded-xl bg-white shadow-2xs">
                <div className="flex items-center gap-2 text-xs">
                    <button
                        type="button"
                        onClick={onPrevWeek}
                        className="p-1 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition cursor-pointer"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={onNextWeek}
                        className="p-1 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition cursor-pointer"
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-semibold text-gray-900">
                        {BULAN_NAMES[monday.getMonth()]} {monday.getFullYear()}
                    </span>
                    <span className="text-gray-400 mx-1">•</span>
                    <span className="text-gray-500 font-normal">
                        {monday.getDate()} {BULAN_NAMES[monday.getMonth()].slice(0, 3)} - {sunday.getDate()} {BULAN_NAMES[sunday.getMonth()].slice(0, 3)} {sunday.getFullYear()}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-500 text-[11px]">Petugas:</span>
                    <Select value={selectedStaff} onChange={(e) => onSelectStaff(e.target.value)}>
                        {staffList.map((st) => (
                            <option key={st.label} value={st.label}>
                                {st.text}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Filter Status & Dua Dropdown Bulan via Shared TimelineFilterBar */}
            <TimelineFilterBar
                filterStatus={filterStatus}
                onFilterStatusChange={onFilterStatusChange}
                selectedStaff={selectedStaff}
                onSelectStaff={onSelectStaff}
                staffDisplayMode="none"
                activeMonths={activeMonths}
                selectedMonthKey={selectedMonthKey}
                onSelectMonthKey={(key) => onSelectMonthKey(key)}
                completedMonths={completedMonths}
                selectedCompletedMonthKey={selectedCompletedMonthKey}
                onSelectCompletedMonthKey={(key) => onSelectCompletedMonthKey(key)}
            />
        </div>
    );
}
