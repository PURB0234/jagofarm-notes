import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppShell from "./AppShell";
import { Loader2 } from "lucide-react";

export function WorkspaceLayout() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#168052]" />
          <span className="text-xs text-gray-500 font-medium">Memuat sesi...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell role={role || "member"}>
      <Outlet />
    </AppShell>
  );
}

export function AdminRoute() {
  const { role, loading } = useAuth();

  if (loading) return null;

  if (role !== "admin") {
    return <Navigate to="/beranda" replace />;
  }

  return <Outlet />;
}
