import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Calendar, BarChart3 } from "lucide-react";

// Geometri dan dimensi kurva navbar
const NAV_WIDTH = 342;
const NAV_HEIGHT = 64;
const CORNER_RADIUS = 20;
const NOTCH_RADIUS = 35;
const NOTCH_DEPTH = 29;

// Konstanta aproksimasi Bezier untuk sudut melengkung sempurna (quarter circle arc)
const K_BEZIER = 0.55228475;
const RK = CORNER_RADIUS * (1 - K_BEZIER);

// Titik tengah horizontal untuk setiap tab (jarak antar tab = 78px)
const TAB_CENTERS = [54, 132, 210, 288];

/**
 * Menghasilkan SVG Path yang mulus dan presisi dengan lekukan cekung (concave notch)
 * yang posisinya mengikuti nilai koordinat X secara dinamis.
 */
function getConcaveNavPath(X: number): string {
    const leftNotch = X - NOTCH_RADIUS;
    const rightNotch = X + NOTCH_RADIUS;

    return [
        // Sudut kiri atas
        `M ${CORNER_RADIUS} 0`,
        // Garis datar kiri menuju awal lekukan
        `L ${leftNotch} 0`,
        // Kurva cekung turun membentuk lekukan penyangga (catenary dip)
        `C ${X - 22} 0 ${X - 18} ${NOTCH_DEPTH} ${X} ${NOTCH_DEPTH}`,
        // Kurva cekung naik kembali ke garis datar kanan
        `C ${X + 18} ${NOTCH_DEPTH} ${X + 22} 0 ${rightNotch} 0`,
        // Garis datar kanan menuju sudut kanan atas
        `L ${NAV_WIDTH - CORNER_RADIUS} 0`,
        // Sudut kanan atas
        `C ${NAV_WIDTH - RK} 0 ${NAV_WIDTH} ${RK} ${NAV_WIDTH} ${CORNER_RADIUS}`,
        // Sisi kanan
        `L ${NAV_WIDTH} ${NAV_HEIGHT - CORNER_RADIUS}`,
        // Sudut kanan bawah
        `C ${NAV_WIDTH} ${NAV_HEIGHT - RK} ${NAV_WIDTH - RK} ${NAV_HEIGHT} ${NAV_WIDTH - CORNER_RADIUS} ${NAV_HEIGHT}`,
        // Sisi bawah datar
        `L ${CORNER_RADIUS} ${NAV_HEIGHT}`,
        // Sudut kiri bawah
        `C ${RK} ${NAV_HEIGHT} 0 ${NAV_HEIGHT - RK} 0 ${NAV_HEIGHT - CORNER_RADIUS}`,
        // Sisi kiri
        `L 0 ${CORNER_RADIUS}`,
        // Sudut kiri atas penutup
        `C 0 ${RK} ${RK} 0 ${CORNER_RADIUS} 0`,
        "Z",
    ].join(" ");
}

/**
 * Hook fisika pegas (spring physics) 60/120fps murni dengan requestAnimationFrame
 * Memberikan pergerakan dinamis, elastis, dan bebas dependensi eksternal.
 */
function useSpringPhysics(target: number, stiffness = 320, damping = 26, mass = 1) {
    const [current, setCurrent] = useState<number>(target);
    const currentRef = useRef<number>(target);
    const targetRef = useRef<number>(target);
    const velocityRef = useRef<number>(0);
    const animIdRef = useRef<number | null>(null);

    targetRef.current = target;

    useEffect(() => {
        let lastTime = performance.now();

        const step = (time: number) => {
            const dt = Math.min((time - lastTime) / 1000, 0.032);
            lastTime = time;

            const displacement = currentRef.current - targetRef.current;
            const force = -stiffness * displacement - damping * velocityRef.current;
            const acceleration = force / mass;

            velocityRef.current += acceleration * dt;
            currentRef.current += velocityRef.current * dt;

            setCurrent(currentRef.current);

            if (Math.abs(displacement) > 0.1 || Math.abs(velocityRef.current) > 0.1) {
                animIdRef.current = requestAnimationFrame(step);
            } else {
                currentRef.current = targetRef.current;
                setCurrent(targetRef.current);
                animIdRef.current = null;
            }
        };

        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
        animIdRef.current = requestAnimationFrame(step);

        return () => {
            if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
        };
    }, [target, stiffness, damping, mass]);

    return current;
}

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
    const targetX = TAB_CENTERS[activeIndex] ?? TAB_CENTERS[0];

    // Spring physics murni per-frame
    const springX = useSpringPhysics(targetX, 340, 27, 0.9);

    // SVG path yang terbarui otomatis setiap frame spring
    const navPath = getConcaveNavPath(springX);

    const ActiveIcon = navItems[activeIndex].icon;

    return (
        <nav
            aria-label="Navigasi Bawah Mobile"
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] inset-x-0 mx-auto w-[342px] max-w-[calc(100vw-24px)] z-40 md:hidden select-none"
        >
            <div className="relative w-full h-[64px]">
                {/* 1. Latar Belakang SVG dengan Lekukan Cekung Organik yang Mengikuti Posisi Spring */}
                <svg
                    viewBox={`0 0 ${NAV_WIDTH} ${NAV_HEIGHT}`}
                    className="absolute inset-0 w-full h-full overflow-visible pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
                >
                    <path
                        d={navPath}
                        className="fill-white dark:fill-[#141c19] stroke-gray-200/90 dark:stroke-[#273830]"
                        strokeWidth="1.2"
                    />
                </svg>

                {/* 2. Indikator Lingkaran Aktif Melayang (Elevated Circular Badge) */}
                <div
                    style={{
                        transform: `translate3d(${springX}px, 0, 0)`,
                    }}
                    className="absolute -top-[19px] left-0 pointer-events-none z-20 will-change-transform"
                >
                    {/* Offset -50% agar lingkaran 50px tepat simetris di titik tengah X */}
                    <div className="-translate-x-1/2 flex items-center justify-center">
                        {/* Bulatan aktif dengan aksen visual halus */}
                        <div
                            key={activeIndex}
                            className="relative w-[50px] h-[50px] rounded-full bg-linear-to-b from-[#188d5b] to-[#126b40] dark:from-[#22c55e] dark:to-[#15803d] text-white flex items-center justify-center border-[2.5px] border-white dark:border-[#141c19] ring-2 ring-emerald-500/25 dark:ring-emerald-400/20 shadow-[0_8px_18px_-2px_rgba(22,128,82,0.45)] dark:shadow-[0_8px_20px_-2px_rgba(34,197,94,0.4)] animate-in zoom-in-75 duration-200"
                        >
                            <ActiveIcon className="w-5 h-5 stroke-[2.3]" />
                        </div>
                    </div>
                </div>

                {/* 3. Baris Tombol Tab Navigasi Interaktif */}
                <div className="relative z-10 grid grid-cols-4 h-full px-[15px]">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.active;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => navigate(item.path)}
                                className="relative flex flex-col items-center justify-between h-full pt-3 pb-2 cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-92 focus:outline-hidden"
                            >
                                {/* Ikon Statis: Mengangkat & mengecil halus saat tab menjadi aktif */}
                                <div
                                    className={`transition-all duration-300 ease-out ${
                                        isActive
                                            ? "opacity-0 scale-40 -translate-y-3"
                                            : "opacity-100 scale-100 translate-y-0 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                                >
                                    <Icon className="w-5 h-5 stroke-[1.9]" />
                                </div>

                                {/* Label Teks Menu dengan Micro-Interaction */}
                                <div className="flex flex-col items-center justify-center h-4">
                                    <span
                                        className={`text-[10px] tracking-tight leading-none transition-all duration-200 ${
                                            isActive
                                                ? "font-bold text-[#15803d] dark:text-emerald-400 scale-105 translate-y-0.5"
                                                : "font-medium text-gray-500 dark:text-gray-400"
                                        }`}
                                    >
                                        {item.label}
                                    </span>

                                    {/* Titik Aksen Aktif Kecil */}
                                    {isActive && (
                                        <span className="w-1 h-1 rounded-full bg-[#15803d] dark:bg-emerald-400 mt-1 animate-in zoom-in duration-200" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}