"use client";

import { Check } from "lucide-react";
import type { ProfileMember } from "@/types/common";

type MemberPickerProps = {
    members: ProfileMember[];
    selectedMemberIds: string[];
    isAllTeam: boolean;
    onToggleMember: (id: string) => void;
    onToggleAllTeam: () => void;
};

export default function MemberPicker({
    members,
    selectedMemberIds,
    isAllTeam,
    onToggleMember,
    onToggleAllTeam,
}: MemberPickerProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-gray-800 dark:text-gray-200">
                    Penanggung Jawab <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {selectedMemberIds.length} dipilih
                </span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 dark:bg-[#0e1613] border border-gray-200 dark:border-[#273830] rounded-lg">
                <button
                    type="button"
                    onClick={onToggleAllTeam}
                    className={
                        "px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer " +
                        (isAllTeam
                            ? "bg-[#1E5E35] text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-[#141c19] dark:border-[#273830] dark:text-gray-300 dark:hover:bg-[#1a2420]")
                    }
                >
                    Seluruh Tim
                </button>

                {members.map((m) => {
                    const isSelected = selectedMemberIds.includes(m.id);
                    const name = m.name || m.full_name || m.email?.split("@")[0] || "Anggota";
                    return (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => onToggleMember(m.id)}
                            className={
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer " +
                                (isSelected
                                    ? "bg-[#1E5E35] text-white"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-[#141c19] dark:border-[#273830] dark:text-gray-300 dark:hover:bg-[#1a2420]")
                            }
                        >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span>{name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
