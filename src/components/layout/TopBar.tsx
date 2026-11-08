// app/components/layout/TopBar.tsx
"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../ui/Button";
import { RotateCcw, Plus } from "lucide-react";
import LogoutButton from "../LogoutButton";
import { createClient } from "@/lib/supabase";
import ModalTambahKegiatan from "../modal/ModalTambahKegiatan";
import type { UserRole } from "@/lib/auth/permissions";
import JagoFarmIcon from "../ui/JagoFarmIcon";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface OnlineUser {
    id: string;
    name: string;
    avatar?: string;
}

type TopBarProps = {
    role?: UserRole;
    onOpenTambah?: () => void;
};

export default function TopBar({ role, onOpenTambah }: TopBarProps) {
    const location = useLocation();
    const pathname = location.pathname;
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [syncState, setSyncState] = useState<"idle" | "syncing" | "synced">("idle");
    const { theme, toggleTheme } = useTheme();

    const navigation = [
        { label: "Beranda", href: "/beranda" },
        { label: "Catatan Pekerjaan", href: "/catatan-pekerjaan" },
        ...(role === "admin" ? [{ label: "Admin Panel", href: "/admin" }] : []),
    ];

    const handleSync = () => {
        if (syncState === "syncing") return;

        setSyncState("syncing");

        // Broadcast sinyal refresh ke seluruh komponen
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("app:sync"));
        }

        setTimeout(() => {
            setSyncState("synced");
            setTimeout(() => setSyncState("idle"), 1500);
        }, 500);
    };

    useEffect(() => {
        const supabase = createClient();
        let channel: ReturnType<typeof supabase.channel>;

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;

            const name = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Petugas";
            const avatar = user.user_metadata?.avatar_url;

            // Supabase Realtime Presence untuk lacak user online tanpa tabel DB
            channel = supabase.channel("online-presence", {
                config: { presence: { key: user.id } },
            });


            channel
                .on("presence", { event: "sync" }, () => {
                    const state = channel.presenceState<OnlineUser>();
                    const unique = Object.values(state).map((p) => p[0]).filter(Boolean);
                    setOnlineUsers(unique);
                })
                .subscribe(async (status) => {
                    if (status === "SUBSCRIBED") {
                        await channel.track({ id: user.id, name, avatar });
                    }
                });
        });

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, []);

    // Listener perubahan database jadwal & catatan (Auto-Sync)
    useEffect(() => {
        const supabase = createClient();

        const triggerRefresh = () => {
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("app:sync"));
            }
        };

        const globalChannel = supabase
            .channel("global-db-sync")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "jadwal_kegiatan" },
                () => triggerRefresh()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(globalChannel);
        };
    }, []);
    // Maksimal 2 badge ditampilkan, sisanya masuk format +N
    const displayedUsers = onlineUsers.slice(0, 2);
    const remainingCount = onlineUsers.length - 2;

    const colors = [
        "bg-[#F1F5F1] border-green-200 text-green-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300",
        "bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200",
    ];

    return (
        <header className="bg-white/95 dark:bg-[#0b1110]/95 backdrop-blur-xs sticky top-0 z-30 w-full h-14 sm:h-15 border-b border-gray-200 dark:border-[#1e2d27] px-4 sm:px-6 flex flex-row items-center justify-between">
            {/* KIRI: Logo + Nav */}
            <div className="flex flex-row items-center gap-4 sm:gap-8 h-full">
                <div className="flex flex-row items-center gap-2">
                    <JagoFarmIcon className="text-green-800 dark:text-emerald-400 w-5 h-5" />
                    <h3 className="font-bold text-gray-900 dark:text-white tracking-tight text-sm sm:text-base">JagoFarm-Keun</h3>
                </div>

                <nav className="hidden md:flex flex-row gap-2 items-center h-full">
                    {navigation.map((item) => {
                        const active =
                            pathname === item.href ||
                            pathname.startsWith(`${item.href}/`);
                        return (
                            <Button
                                key={item.href}
                                href={item.href}
                                variant="nav"
                                className={`flex items-center gap-2 px-4 h-full text-sm font-semibold border-b-2 transition-colors ${active
                                    ? "border-green-600 text-green-700 dark:border-emerald-500 dark:text-emerald-400"
                                    : "border-transparent text-gray-600 hover:text-black hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/60"
                                    }`}
                            >
                                <span>{item.label}</span>
                            </Button>
                        );
                    })}
                </nav>
            </div>

            {/* KANAN: Aksi + Realtime Badges */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-4">
                <div className="flex flex-row gap-2 sm:gap-3 items-center pr-2.5 sm:pr-4 border-r border-gray-300 dark:border-[#273830]">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
                        className="p-1.5 rounded-lg border border-gray-200 dark:border-[#273830] bg-gray-50 dark:bg-[#141c19] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a2420] transition cursor-pointer select-none"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                            <Moon className="w-3.5 h-3.5 text-gray-600" />
                        )}
                    </button>

                    <Button
                        type="button"
                        onClick={handleSync}
                        disabled={syncState === "syncing"}
                        className="!px-2 sm:!px-2.5 !py-1 !text-xs transition-all cursor-pointer disabled:opacity-60"
                        variant="sync"
                        title="Klik untuk menyinkronkan data terbaru"
                    >
                        <span className="hidden sm:inline">
                            {syncState === "syncing"
                                ? "Menyinkronkan..."
                                : syncState === "synced"
                                    ? "Tersinkron!"
                                    : "Sinkronisasi"}
                        </span>
                        <RotateCcw
                            className={`w-3 h-3 transition-transform ${syncState === "syncing" ? "animate-spin text-green-700" : ""
                                }`}
                        />
                    </Button>

                    <div className="hidden md:block">
                        <Button
                            className="!px-2.5 !py-1 !text-xs"
                            variant="addNote"
                            onClick={onOpenTambah || (() => setIsModalOpen(true))}
                        >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Catatan</span>
                        </Button>
                    </div>
                </div>

                {/* Badge Realtime Akun */}
                <div className="flex flex-row -space-x-2 items-center">
                    {displayedUsers.map((u, idx) => {
                        const initial = (u.name?.[0] ?? "U").toUpperCase();
                        return u.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                key={u.id}
                                src={u.avatar}
                                alt={u.name}
                                referrerPolicy="no-referrer"
                                className="w-7 h-7 rounded-full border-2 border-white object-cover"
                                title={u.name}
                            />
                        ) : (
                            <div
                                key={u.id}
                                className={`flex items-center justify-center w-7 h-7 text-xs font-bold border-2 border-white rounded-full ${colors[idx % colors.length]}`}
                                title={u.name}
                            >
                                {initial}
                            </div>
                        );
                    })}

                    {remainingCount > 0 && (
                        <div
                            className="flex items-center justify-center w-7 h-7 text-xs font-bold border-2 border-white bg-gray-500 text-white rounded-full"
                            title={`${remainingCount} akun lainnya`}
                        >
                            +{remainingCount}
                        </div>
                    )}
                </div>

                <LogoutButton />
            </div>
            {!onOpenTambah && isModalOpen && (
                <ModalTambahKegiatan
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </header>
    );

}
