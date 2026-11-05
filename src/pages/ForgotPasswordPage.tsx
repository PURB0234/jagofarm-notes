import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@/lib/supabase";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const supabase = createClient();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const redirectUrl =
            typeof window !== "undefined"
                ? `${window.location.origin}/reset-password`
                : "http://localhost:5173/reset-password";

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });

        setLoading(false);

        if (resetError) {
            setError(resetError.message || "Gagal mengirim email pemulihan. Periksa kembali email Anda.");
            return;
        }

        try {
            sessionStorage.setItem("jagofarm_recovery_email", email);
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
                    <h1 className="text-2xl font-bold tracking-tight">Lupa Kata Sandi</h1>
                    <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                        Masukkan email akun tim Anda. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
                    </p>
                </div>

                {success ? (
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs leading-relaxed flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <strong className="font-semibold block text-sm mb-1 text-white">
                                    Tautan & Kode Terkirim!
                                </strong>
                                Silakan periksa kotak masuk email{" "}
                                <span className="font-mono font-semibold text-emerald-300">{email}</span>.
                                Buka tautan di email, atau klik tombol di bawah untuk memasukkan kode verifikasi 6 digit secara langsung.
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                            className="block w-full py-2.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-semibold text-white text-center transition-colors cursor-pointer"
                        >
                            Masukkan Kode / Atur Sandi Baru →
                        </button>

                        <Link
                            to="/login"
                            className="block w-full text-center py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Kembali ke Halaman Masuk
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-xs font-medium text-gray-300">
                                Email Terdaftar
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-green-500"
                                    placeholder="nama@email.com"
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
                            {loading ? "Mengirim Tautan..." : "Kirim Tautan Pemulihan"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
