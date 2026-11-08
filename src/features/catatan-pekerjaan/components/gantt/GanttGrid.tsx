"use client";

import React from "react";

export type DateColumn = {
    iso: string;
    day: number;
    month: string;
    dayName: string;
    isToday: boolean;
};

export function GanttHeaderDates({
    totalTimelineWidth,
    finalColWidth,
    dateColumns,
}: {
    totalTimelineWidth: number;
    finalColWidth: number;
    dateColumns: DateColumn[];
}) {
    return (
        <div
            style={{ width: totalTimelineWidth + "px" }}
            className="shrink-0 flex bg-slate-50 dark:bg-[#101915]"
        >
            {dateColumns.map((col) => (
                <div
                    key={col.iso}
                    style={{ width: finalColWidth + "px" }}
                    className={
                        "shrink-0 border-r border-gray-200 dark:border-[#273830] text-center py-2 " +
                        (col.isToday ? "bg-emerald-100/90 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold" : "")
                    }
                >
                    <div className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400">
                        {col.dayName}
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100">{col.day}</div>
                    <div className="text-[9px] text-gray-400 dark:text-gray-500">{col.month}</div>
                </div>
            ))}
        </div>
    );
}

export function GanttRowGrid({
    totalTimelineWidth,
    finalColWidth,
    dateColumns,
    dragOverCol,
    draggedTaskId,
    onDragOverCol,
    onDragLeave,
    onDropOnCol,
    children,
}: {
    totalTimelineWidth: number;
    finalColWidth: number;
    dateColumns: DateColumn[];
    dragOverCol: number | null;
    draggedTaskId: string | null;
    onDragOverCol: (colIdx: number) => void;
    onDragLeave: () => void;
    onDropOnCol: (colIdx: number) => void;
    children?: React.ReactNode;
}) {
    return (
        <div
            style={{ width: totalTimelineWidth + "px" }}
            onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const colIdx = Math.floor(mouseX / finalColWidth);
                const clamped = Math.max(0, Math.min(dateColumns.length - 1, colIdx));
                onDragOverCol(clamped);
            }}
            onDragLeave={onDragLeave}
            onDrop={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const colIdx = Math.floor(mouseX / finalColWidth);
                const clamped = Math.max(0, Math.min(dateColumns.length - 1, colIdx));
                onDropOnCol(clamped);
            }}
            className="shrink-0 relative h-14"
        >
            {/* Background Grid Lines & Highlight Drop Target */}
            <div className="absolute inset-0 flex pointer-events-none">
                {dateColumns.map((col, colIdx) => (
                    <div
                        key={col.iso}
                        style={{ width: finalColWidth + "px" }}
                        className={
                            "shrink-0 border-r border-gray-100 dark:border-[#1e2d27]/70 transition-colors " +
                            (dragOverCol === colIdx && draggedTaskId ? "bg-emerald-100/70 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-600 " : "") +
                            (col.isToday ? "bg-emerald-50/40 dark:bg-emerald-950/20" : "")
                        }
                    />
                ))}
            </div>

            {children}
        </div>
    );
}
