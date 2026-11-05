import { Users, Info, ShieldCheck } from "lucide-react";
import Card from "@/components/ui/Card";
import type { ProfileMember } from "@/types/common";

export default function BerandaTimOverview({
    members,
}: {
    members: ProfileMember[];
}) {
    return (
        <section className="space-y-4">
            <Card>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-700" />
                        Tim Lapangan JagoFarm
                    </h2>
                    <span className="text-xs text-gray-500 font-medium">
                        {members.length} Petugas
                    </span>
                </div>

                {members.length === 0 ? (
                    <div className="py-4 text-center text-xs text-gray-400">
                        Memuat data tim...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                        {members.map((member) => {
                            const name = member.full_name || member.name || member.email?.split("@")[0] || "Anggota";
                            const initial = name.charAt(0).toUpperCase();

                            return (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-2.5 p-2 bg-gray-50/60 border border-gray-200 rounded-lg text-xs"
                                >
                                    <div className="w-7 h-7 rounded-md bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
                                        {initial}
                                    </div>
                                    <div className="overflow-hidden leading-tight">
                                        <div className="font-semibold text-gray-900 truncate">
                                            {name}
                                        </div>
                                        <div className="text-[10px] text-gray-400 truncate">
                                            {member.email}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            {/* Protocol Standard Note */}
            <div className="flex items-start gap-3 p-3.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <div>
                    <strong className="text-gray-900 block mb-0.5 font-semibold">
                        Standar Operasional Lapangan:
                    </strong>
                    Pencatatan EC dan pengurasan jalur dosing dilakukan rutin pada rotasi pagi. Pastikan seluruh foto bukti dokumentasi terunggah.
                </div>
            </div>
        </section>
    );
}
