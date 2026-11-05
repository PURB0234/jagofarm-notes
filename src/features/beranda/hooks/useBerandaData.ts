import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { JadwalRow } from "@/types/kegiatan";
import type { ProfileMember } from "@/types/common";
import { toIsoDate } from "@/lib/utils/date";

export function useBerandaData() {
    const [jadwals, setJadwals] = useState<JadwalRow[]>([]);
    const [members, setMembers] = useState<ProfileMember[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const supabase = createClient();
        const [jadwalRes, profileRes] = await Promise.all([
            supabase
                .from("jadwal_kegiatan")
                .select("*")
                .order("created_at", { ascending: false }),
            supabase
                .from("profiles")
                .select("id, full_name, email, role")
                .order("full_name", { ascending: true }),
        ]);

        if (jadwalRes.data) setJadwals(jadwalRes.data);
        if (profileRes.data) setMembers(profileRes.data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();

        const onSync = () => fetchData();
        window.addEventListener("app:sync", onSync);

        const supabase = createClient();
        const channel = supabase
            .channel("realtime-beranda-page")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "jadwal_kegiatan" },
                () => {
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            window.removeEventListener("app:sync", onSync);
            supabase.removeChannel(channel);
        };
    }, [fetchData]);

    const todayStr = toIsoDate(new Date());

    // 1. Jadwal hari ini
    const jadwalHariIni = jadwals.filter((j) => {
        const start = String(j.tanggal || "").slice(0, 10);
        const end = j.tanggal_selesai ? String(j.tanggal_selesai).slice(0, 10) : start;
        return todayStr >= start && todayStr <= end;
    });

    // 2. Pekerjaan aktif / berjalan
    const tugasBerjalan = jadwals.filter(
        (j) => j.status === "dikerjakan" || j.status === "berjalan" || j.status === "perlu_update"
    );

    // 3. Catatan terbaru (3 entri terakhir)
    const catatanTerbaru = jadwals.slice(0, 3);

    // 4. Ringkasan metrik
    const stats = {
        totalAgenda: jadwals.length,
        selesai: jadwals.filter((j) => j.status === "selesai").length,
        aktif: tugasBerjalan.length,
        hariIni: jadwalHariIni.length,
        panen: jadwals.filter((j) => (j.tag || "").toUpperCase() === "PANEN").length,
    };

    return {
        jadwals,
        members,
        jadwalHariIni,
        tugasBerjalan,
        catatanTerbaru,
        stats,
        loading,
        refresh: fetchData,
    };
}
