"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { PowerCircle, Loader2 } from "lucide-react";

export default function LogoutButton() {
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        if (!window.confirm("Apakah Anda yakin ingin keluar?")) return;

        setLoading(true);
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
            alert("Gagal keluar: " + error.message);
            setLoading(false);
            return;
        }

        // Hard redirect: hapus bersih cache klien & state WebSocket browser
        window.location.href = "/login";
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            title="Keluar Akun"
            className="rounded-lg border border-gray-200 dark:border-[#273830] p-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#1a2420] text-gray-600 dark:text-gray-300 disabled:opacity-50 transition-colors cursor-pointer"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
            ) : (
                <PowerCircle className="w-4 h-4 text-red-600" />
            )}
        </button>
    );
}
