import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkspaceLayout, AdminRoute } from "@/components/layout/WorkspaceLayout";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import BerandaPage from "@/pages/BerandaPage";
import CatatanPekerjaanPage from "@/pages/CatatanPekerjaanPage";
import AdminPage from "@/pages/AdminPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Protected Workspace Routes */}
          <Route element={<WorkspaceLayout />}>
            <Route path="/" element={<Navigate to="/beranda" replace />} />
            <Route path="/beranda" element={<BerandaPage />} />
            <Route path="/catatan-pekerjaan" element={<CatatanPekerjaanPage />} />
            <Route
              path="/jadwal-tim"
              element={<Navigate to="/catatan-pekerjaan?view=kalender" replace />}
            />

            {/* Admin Protected Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/beranda" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
