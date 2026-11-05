import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, CheckCircle2, Loader2, AlertCircle, KeyRound, Mail, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
    const supabase = createClient();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user: authUser } = useAuth();

    // Form inputs
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // States
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [hasSession, setHasSession] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [useManualOtp, setUseManualOtp] = useState(false);

    useEffect(() => {
        let isMounted = true;

        // Ambil email dari query params atau sessionStorage jika ada
        const qEmail = searchParams.get("email");
        let storedEmail = "";
        try {
            storedEmail = sessionStorage.getItem("jagofarm_recovery_email") || "";
        } catch {
            // ignore
        }
        if (qEmail || storedEmail) {
            setEmail(qEmail || storedEmail);
        }

        async function verifyRecoveryAuth() {
            // 0. Cek apakah ada error di URL (hash atau query) dari Supabase
            const hash = typeof window !== "undefined" ? window.location.hash.substring(1) : "";
            const hashParams = new URLSearchParams(hash);

            const urlError =
                hashParams.get("error_description") ||
                searchParams.get("error_description") ||
                hashParams.get("error") ||
                searchParams.get("error");

            if (urlError) {
                if (isMounted) {
                    const decoded = decodeURIComponent(urlError.replace(/\+/g, " "));
                    setErrorMsg(decoded);
                    setCheckingSession(false);
                    // Tawarkan mode input kode OTP 6-digit langsung
                    setUseManualOtp(true);
                }
                return;
            }

            // 1. Cek token langsung dari URL Hash (#access_token=... & refresh_token=...)
            const accessToken = hashParams.get("access_token");
            const refreshToken = hashParams.get("refresh_token");
            if (accessToken) {
                try {
                    const { data, error: setSessionErr } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || "",
                    });
                    if (!setSessionErr && data.session && isMounted) {
                        setHasSession(true);
                        setCheckingSession(false);
                        return;
                    }
                } catch (e) {
                    console.error("Gagal setSession dari hash:", e);
                }
            }

            // 2. Cek parameter code (PKCE Auth Code flow)
            const code = searchParams.get("code");
            if (code) {
                try {
                    const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
                    if (!exchangeErr && data.session && isMounted) {
                        setHasSession(true);
                        setCheckingSession(false);
                        return;
                    }
                } catch (e) {
                    console.error("Gagal exchangeCodeForSession:", e);
                }
            }

            // 3. Cek apakah session aktif sudah ada (dari AuthContext atau getSession)
            if (authUser && isMounted) {
                setHasSession(true);
                setCheckingSession(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (session && isMounted) {
                setHasSession(true);
                setCheckingSession(false);
                return;
            }

            // 4. Listener event PASSWORD_RECOVERY
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
                if ((event === "PASSWORD_RECOVERY" || currentSession) && isMounted) {
                    setHasSession(true);
                    setCheckingSession(false);
                }
            });

            // Beri batas waktu toleransi sinkronisasi sesi
            const timer = setTimeout(() => {
                if (isMounted) {
                    setCheckingSession(false);
                    setUseManualOtp(true);
                }
            }, 2000);

            return () => {
                clearTimeout(timer);
                subscription.unsubscribe();
            };
        }

        verifyRecoveryAuth();

        return () => {
            isMounted = false;
        };
    }, [searchParams, supabase, authUser]);

    // Submit mode 1: Sesi sudah tervalidasi via link URL
    async function handleUpdatePasswordDirect(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Kata sandi baru minimal 6 karakter.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Konfirmasi kata sandi tidak cocok.");
            return;
        }

        setLoading(true);

        const { error: updateError } = await supabase.auth.updateUser({
            password: password,
        });

        setLoading(false);

        if (updateError) {
            setError(updateError.message || "Gagal memperbarui kata sandi.");
            return;
        }

        try {
            localStorage.removeItem("jagofarm_remember_login");
            sessionStorage.removeItem("jagofarm_recovery_email");
        } catch {
            // ignore
        }

        setSuccess(true);
    }

    // Submit mode 2: Verifikasi via Kode OTP 6-Digit (Solusi Anti-Gagal dari Scanner Email)
    async function handleVerifyOtpAndReset(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Masukkan email akun Anda.");
            return;
        }

        const cleanOtp = otp.trim().replace(/\s+/g, "");
        if (cleanOtp.length < 6) {
            setError("Masukkan kode OTP 6 digit yang dikirimkan ke email.");
            return;
        }

        if (password.length < 6) {
            setError("Kata sandi baru minimal 6 karakter.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Konfirmasi kata sandi tidak cocok.");
            return;
        }

        setLoading(true);

        // 1. Verifikasi kode OTP dengan type recovery
        const { error: otpError } = await supabase.auth.verifyOtp({
            email: email.trim(),
            token: cleanOtp,
            type: "recovery",
        });

        if (otpError) {
            setLoading(false);
            setError("Kode verifikasi OTP salah atau kedaluwarsa: " + otpError.message);
            return;
        }

        // 2. Perbarui kata sandi setelah sesi berhasil didapatkan
        const { error: updateError } = await supabase.auth.updateUser({
            password: password,
        });

        setLoading(false);

        if (updateError) {
            setError(updateError.message || "Gagal memperbarui kata sandi.");
            return;
        }

        try {
            localStorage.removeItem("jagofarm_remember_login");
            sessionStorage.removeItem("jagofarm_recovery_email");
        } catch {
            // ignore
        }

        setSuccess(true);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0b1110] px-4 text-white">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
                <div className="mb-6">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Halaman Masuk</span>
                    </Link>
                    <p className="mb-2 text-sm font-medium text-green-400">
                        JAGOFARM WORKSPACE
                    </p>
                    <h1 className="text-2xl font-bold tracking-tight">Atur Ulang Kata Sandi</h1>
                    <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                        {hasSession && !useManualOtp
                            ? "Sesi pemulihan terverifikasi. Masukkan kata sandi baru Anda."
                            : "Masukkan email dan kode verifikasi 6 digit dari email untuk membuat kata sandi baru."}
                    </p>
                </div>

                {checkingSession ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                        <span>Memvalidasi token pemulihan...</span>
                    </div>
                ) : success ? (
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs leading-relaxed flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <strong className="font-semibold block text-sm mb-1 text-white">
                                    Kata Sandi Berhasil Diperbarui!
                                </strong>
                                Kata sandi akun Anda telah diperbarui. Silakan masuk menggunakan kata sandi baru.
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="block w-full py-2.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-semibold text-white text-center transition-colors cursor-pointer"
                        >
                            Masuk Sekarang
                        </button>
                    </div>
                ) : hasSession && !useManualOtp ? (
                    /* Form 1: Link URL Berhasil Terbuka Langsung */
                    <form onSubmit={handleUpdatePasswordDirect} className="space-y-4">
                        <div>
                            <label htmlFor="new-pass" className="mb-2 block text-xs font-medium text-gray-300">
                                Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="new-pass"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-green-500"
                                    placeholder="Minimal 6 karakter"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm-pass" className="mb-2 block text-xs font-medium text-gray-300">
                                Konfirmasi Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="confirm-pass"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-green-500"
                                    placeholder="Ulangi kata sandi baru"
                                />
                            </div>
                        </div>

                        {error && (
                            <p role="alert" className="text-xs text-red-400">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-green-600 hover:bg-green-500 px-4 py-2.5 text-xs font-semibold transition disabled:opacity-50 cursor-pointer text-white shadow-2xs"
                        >
                            {loading ? "Memperbarui..." : "Simpan Kata Sandi Baru"}
                        </button>
                    </form>
                ) : (
                    /* Form 2: Mode Kode OTP 6-Digit (Solusi Anti-Gagal dari Scanner Email) */
                    <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
                        {errorMsg && (
                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                                <div className="leading-snug">
                                    <span className="font-semibold text-white block mb-0.5">Tautan otomatis telah terpakai oleh sistem email</span>
                                    Gunakan kode 6 digit dari email di bawah ini untuk membuat kata sandi baru.
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-300">
                                Email Akun Anda
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-green-500"
                                    placeholder="nama@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="otp" className="mb-1.5 block text-xs font-medium text-gray-300">
                                Kode Verifikasi (6 Digit dari Email)
                            </label>
                            <div className="relative">
                                <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="otp"
                                    type="text"
                                    required
                                    maxLength={8}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest text-white outline-none focus:border-green-500 placeholder:text-gray-600"
                                    placeholder="123456"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="new-pass" className="mb-1.5 block text-xs font-medium text-gray-300">
                                Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="new-pass"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-green-500"
                                    placeholder="Minimal 6 karakter"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm-pass" className="mb-1.5 block text-xs font-medium text-gray-300">
                                Konfirmasi Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="confirm-pass"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-green-500"
                                    placeholder="Ulangi kata sandi baru"
                                />
                            </div>
                        </div>

                        {error && (
                            <p role="alert" className="text-xs text-red-400">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-green-600 hover:bg-green-500 px-4 py-2.5 text-xs font-semibold transition disabled:opacity-50 cursor-pointer text-white shadow-2xs mt-2"
                        >
                            {loading ? "Memverifikasi & Menyimpan..." : "Verifikasi & Simpan Sandi Baru"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
