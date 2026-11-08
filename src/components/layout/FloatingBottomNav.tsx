import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Calendar, BarChart3 } from "lucide-react";

export default function FloatingBottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const view = searchParams.get("view");

    const isHome = pathname === "/beranda";
    const isNotes = pathname === "/catatan-pekerjaan" && (!view || view === "catatan");
    const isCalendar = pathname === "/catatan-pekerjaan" && view === "kalender";
    const isChart = pathname === "/catatan-pekerjaan" && view === "gantt";

    const navItems = [
        {
            id: "home",
            label: "Home",
            icon: Home,
            active: isHome,
            path: "/beranda",
        },
        {
            id: "notes",
            label: "Notes",
            icon: FileText,
            active: isNotes,
            path: "/catatan-pekerjaan?view=catatan",
        },
        {
            id: "calendar",
            label: "Calender",
            icon: Calendar,
            active: isCalendar,
            path: "/catatan-pekerjaan?view=kalender",
        },
        {
            id: "chart",
            label: "Chart",
            icon: BarChart3,
            active: isChart,
            path: "/catatan-pekerjaan?view=gantt",
        },
    ];

    const getActiveIndex = () => {
        if (isHome) return 0;
        if (isNotes) return 1;
        if (isCalendar) return 2;
        if (isChart) return 3;
        return 0;
    };

    const activeIndex = getActiveIndex();
    const ActiveIcon = navItems[activeIndex].icon;

    return (
        <nav
            aria-label="Navigasi Bawah Mobile"
            className="fixed bottom-4 inset-x-0 mx-auto w-[330px] z-40 md:hidden select-none"
        >
            <div className="relative w-full h-16 bg-white rounded-full border border-gray-200/90 shadow-xl shadow-black/8 px-1">
                {/* Indikator Melayang + Sayap Lengkung Organik (Ikut Geser Halus) */}
                <div
                    className="absolute -top-5 left-0 w-1/4 flex justify-center transition-transform duration-300 ease-out pointer-events-none"
                    style={{ transform: "translateX(" + (activeIndex * 100) + "%)" }}
                >
                    <div className="relative flex items-center justify-center">
                        {/* Sayap Lekukan Kiri (Menyambung garis datar navbar ke bulatan) */}
                        <svg
                            className="absolute top-[4px] -left-[15px] w-4 h-4 text-white pointer-events-none"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                        >
                            <path d="M 0 16 C 8 16, 16 8, 16 0 L 16 16 Z" />
                        </svg>

                        {/* Kerah Lingkaran Penyangga */}
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xs">
                            {/* Tombol Bulat Hijau Aktif */}
                            <div className="w-11 h-11 rounded-full bg-[#1E5E35] text-white flex items-center justify-center shadow-lg shadow-green-950/30 transition-transform duration-200">
                                <ActiveIcon className="w-5 h-5 stroke-[2.2]" />
                            </div>
                        </div>

                        {/* Sayap Lekukan Kanan (Menyambung bulatan kembali ke garis navbar) */}
                        <svg
                            className="absolute top-[4px] -right-[15px] w-4 h-4 text-white pointer-events-none"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                        >
                            <path d="M 16 16 C 8 16, 0 8, 0 0 L 0 16 Z" />
                        </svg>
                    </div>
                </div>

                {/* 4 Kolom Tombol Menu */}
                <div className="grid grid-cols-4 h-full">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => navigate(item.path)}
                                className={
                                    "relative flex flex-col items-center justify-end h-full pb-2 transition-all cursor-pointer " +
                                    (item.active ? "text-[#1E5E35]" : "text-gray-400 hover:text-gray-600")
                                }
                            >
                                {/* Ikon Statis (mengecil & menghilang halus saat tab aktif) */}
                                <div
                                    className={
                                        "transition-all duration-200 mb-1 " +
                                        (item.active ? "opacity-0 scale-50 -translate-y-2" : "opacity-100 scale-100")
                                    }
                                >
                                    <Icon className="w-5 h-5" />
                                </div>

                                {/* Label Teks Menu */}
                                <span
                                    className={
                                        "text-[10px] tracking-tight transition-all duration-200 " +
                                        (item.active ? "font-bold text-[#1E5E35] translate-y-0.5" : "font-medium text-gray-500")
                                    }
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}