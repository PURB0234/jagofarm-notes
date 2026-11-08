"use client";

import { Clock, Calendar, MapPin, CheckCircle2, Tag } from "lucide-react";
import type { JadwalRow } from "@/types/kegiatan";

export function GanttHeaderMetadata({
    metaWidth,
    onResizeStart,
}: {
    metaWidth: number;
    onResizeStart: (e: React.MouseEvent) => void;
}) {
    return (
        <div
            style={{ width: metaWidth + "px" }}
            className="sticky left-0 z-40 shrink-0 bg-slate-100 dark:bg-[#101915] border-r border-gray-300 dark:border-[#273830] flex items-center divide-x divide-gray-200 dark:divide-[#273830] text-gray-700 dark:text-gray-200 relative"
        >
            <div className="flex-1 px-3 py-3 min-w-0">Nama Kegiatan</div>
            <div className="w-24 shrink-0 px-2 py-3 text-center">PIC</div>
            <div className="w-24 shrink-0 px-2 py-3 text-center">Status</div>

            {/* Resize Handle pada garis vertikal kanan metadata */}
            <div
                onMouseDown={onResizeStart}
                title="Tarik untuk mengubah lebar kolom Nama Kegiatan | PIC | Status"
                className="resizer-handle absolute top-0 -right-1.5 w-3 h-full cursor-col-resize hover:bg-emerald-500/40 active:bg-emerald-600 transition-colors z-40"
            />
        </div>
    );
}

export function GanttRowMetadata({
    task,
    metaWidth,
    isMultiDay,
    diffDays,
    getDotColor,
    onSelectTask,
}: {
    task: JadwalRow;
    metaWidth: number;
    isMultiDay: boolean;
    diffDays: number;
    getDotColor: (name: string) => string;
    onSelectTask: (task: JadwalRow) => void;
}) {
    return (
        <div
            style={{ width: metaWidth + "px" }}
            className="sticky left-0 z-20 shrink-0 bg-white dark:bg-[#141c19] group-hover:bg-slate-50 dark:group-hover:bg-[#192420] border-r border-gray-300 dark:border-[#273830] flex items-center divide-x divide-gray-100 dark:divide-[#273830] relative shadow-2xs"
        >
            {/* Nama Kegiatan & Waktu */}
            <div
                className="flex-1 min-w-0 px-3 py-2.5 cursor-pointer"
                onClick={() => onSelectTask(task)}
            >
                <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                    {task.nama_kegiatan}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1 shrink-0">
                        {isMultiDay ? (
                            <>
                                <Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{diffDays} hari</span>
                            </>
                        ) : (
                            <>
                                <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                                <span>
                                    {task.waktu_mulai.slice(0, 5)} - {task.waktu_selesai.slice(0, 5)}
                                </span>
                            </>
                        )}
                    </span>
                    {task.lokasi && (
                        <span className="flex items-center gap-0.5 truncate">
                            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate">{task.lokasi}</span>
                        </span>
                    )}
                </div>
            </div>

            {/* PIC */}
            <div className="w-24 shrink-0 px-2 py-2.5 flex items-center justify-center gap-1.5">
                <span
                    className={
                        "w-2 h-2 rounded-full shrink-0 " +
                        getDotColor(task.penanggung_jawab_nama)
                    }
                />
                <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 truncate text-center">
                    {task.penanggung_jawab_nama}
                </span>
            </div>

            {/* Status */}
            <div className="w-24 shrink-0 px-2 py-2.5 flex items-center justify-center">
                {task.status === "selesai" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" /> Selesai
                    </span>
                ) : task.tag?.toUpperCase() === "PANEN" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <Tag className="w-3 h-3" /> Panen
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        Terjadwal
                    </span>
                )}
            </div>
        </div>
    );
}
