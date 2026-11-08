import { useState, type ReactNode } from "react";
import TopBar from "./TopBar";
import MainContent from "./MainContent";
import FloatingBottomNav from "./FloatingBottomNav";
import FloatingAddButton from "./FloatingAddButton";
import ModalTambahKegiatan from "../modal/ModalTambahKegiatan";
import type { UserRole } from "@/lib/auth/permissions";

type AppShellProps = {
    children: ReactNode;
    role?: UserRole;
};

export default function AppShell({
    children,
    role,
}: AppShellProps) {
    const [isTambahOpen, setIsTambahOpen] = useState(false);

    return (
        <div className="app-shell flex flex-col min-h-screen">
            <TopBar role={role} onOpenTambah={() => setIsTambahOpen(true)} />
            <MainContent>{children}</MainContent>

            {/* Mobile Navigation & FAB */}
            <FloatingAddButton onClick={() => setIsTambahOpen(true)} />
            <FloatingBottomNav />

            {/* Modal Tambah Kegiatan Universal */}
            {isTambahOpen && (
                <ModalTambahKegiatan
                    isOpen={isTambahOpen}
                    onClose={() => setIsTambahOpen(false)}
                    onSuccess={() => {
                        window.dispatchEvent(new CustomEvent("app:sync"));
                    }}
                />
            )}
        </div>
    );
}
