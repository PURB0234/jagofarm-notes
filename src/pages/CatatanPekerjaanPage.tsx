import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import CatatanWorkspace from "@/features/catatan-pekerjaan/components/CatatanWorkspace";
import type { Catatan } from "@/types/kegiatan";
import type { ViewMode } from "@/types/common";
import { Loader2 } from "lucide-react";

export default function CatatanPekerjaanPage() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id") || undefined;
    const view = (searchParams.get("view") as ViewMode) || "catatan";

    const { user, profile } = useAuth();
    const [catatans, setCatatans] = useState<Catatan[]>([]);
    const [loading, setLoading] = useState(true);

    const currentUser = {
        id: user?.id ?? "",
        role: profile?.role ?? "member",
        name: profile?.full_name || profile?.email?.split("@")[0] || user?.email?.split("@")[0] || "Saya",
    };

    const fetchCatatans = useCallback(async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("jadwal_kegiatan")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            const normalized: Catatan[] = data.map((row) => ({
                id: row.id,
                created_at: row.created_at,
                judul: row.nama_kegiatan,
                penanggung_jawab: row.penanggung_jawab_nama,
                penanggung_jawab_id: row.penanggung_jawab_id,
                status: (row.status === "selesai" ? "selesai" : "dikerjakan") as "dikerjakan" | "selesai",
                lokasi: row.lokasi || "Ko+Lab",
                deskripsi: row.catatan || "",
                tautan_eksternal: row.tautan_eksternal || null,
                lampiran_url: row.lampiran_url || null,
                lampiran_nama: row.lampiran_nama || null,
                tag: row.tag || null,
                tanggal: row.tanggal,
                tanggal_selesai: row.tanggal_selesai || row.tanggal,
                waktu_mulai: row.waktu_mulai,
                waktu_selesai: row.waktu_selesai,
            }));
            setCatatans(normalized);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchCatatans();

        const onSync = () => fetchCatatans();
        window.addEventListener("app:sync", onSync);

        const supabase = createClient();
        const channel = supabase
            .channel("realtime-catatan-page")
            .on("postgres_changes", { event: "*", schema: "public", table: "jadwal_kegiatan" }, () => {
                fetchCatatans();
            })
            .subscribe();

        return () => {
            window.removeEventListener("app:sync", onSync);
            supabase.removeChannel(channel);
        };
    }, [fetchCatatans]);

    if (loading && catatans.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin text-[#168052]" />
                    Memuat catatan...
                </div>
            </div>
        );
    }

    return (
        <main className="w-full mx-auto space-y-6">
            <CatatanWorkspace
                catatans={catatans}
                initialId={id}
                initialView={view}
                currentUser={currentUser}
                onRefresh={fetchCatatans}
            />
        </main>
    );
}
