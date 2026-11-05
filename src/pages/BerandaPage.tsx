import { useAuth } from "@/contexts/AuthContext";
import { useBerandaData } from "@/features/beranda/hooks/useBerandaData";
import BerandaHero from "@/features/beranda/components/BerandaHero";
import BerandaMetrics from "@/features/beranda/components/BerandaMetrics";
import BerandaTugasAktif from "@/features/beranda/components/BerandaTugasAktif";
import BerandaCatatanTerbaru from "@/features/beranda/components/BerandaCatatanTerbaru";
import BerandaJadwalHariIni from "@/features/beranda/components/BerandaJadwalHariIni";
import BerandaTimOverview from "@/features/beranda/components/BerandaTimOverview";
import { Loader2 } from "lucide-react";

export default function BerandaPage() {
    const { role } = useAuth();
    const roleLabel = role === "admin" ? "Admin" : "Member";

    const {
        members,
        jadwalHariIni,
        tugasBerjalan,
        catatanTerbaru,
        stats,
        loading,
    } = useBerandaData();

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                    Memuat ringkasan operasional...
                </div>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto space-y-6">
            {/* 1. Header Greeting & Dynamic Date */}
            <BerandaHero
                roleLabel={roleLabel}
                activeCount={stats.aktif}
                todayCount={stats.hariIni}
            />

            {/* 2. Metrik Telemetri IoT Greenhouse */}
            <BerandaMetrics panenCount={stats.panen} />

            {/* 3. Grid Workspace Utama: Kiri (Pekerjaan & Catatan) | Kanan (Jadwal & Tim) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Kolom Kiri */}
                <div className="lg:col-span-7 space-y-6">
                    <BerandaTugasAktif tugas={tugasBerjalan} />
                    <BerandaCatatanTerbaru catatan={catatanTerbaru} />
                </div>

                {/* Kolom Kanan */}
                <div className="lg:col-span-5 space-y-6">
                    <BerandaJadwalHariIni jadwal={jadwalHariIni} />
                    <BerandaTimOverview members={members} />
                </div>
            </div>
        </main>
    );
}
