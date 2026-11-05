import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@/lib/supabase";

const REMEMBER_KEY = "jagofarm_remember_login";

export default function LoginPage() {
    const supabase = createClient();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Ambil data Remember Me saat halaman dibuka
    useEffect(() => {
        try {
            const saved = localStorage.getItem(REMEMBER_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.email) setEmail(parsed.email);
                if (parsed.password) setPassword(parsed.password);
                setRememberMe(Boolean(parsed.remember));
            }
        } catch {
            // Abaikan jika format localStorage tidak valid
        }
    }, []);

    async function handleEmailLogin(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError("");
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError("Login gagal. Periksa email dan password.");
            return;
        }

        // Simpan atau bersihkan data login Remember Me
        if (rememberMe) {
            localStorage.setItem(
                REMEMBER_KEY,
                JSON.stringify({ email, password, remember: true })
            );
        } else {
            localStorage.removeItem(REMEMBER_KEY);
        }

        navigate("/beranda");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0b1110] px-4 text-white">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
                <div className="mb-8">
                    <p className="mb-3 text-sm font-medium text-green-400">
                        JAGOFARM WORKSPACE
                    </p>
                    <h1 className="text-3xl font-bold">Selamat datang</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Masuk untuk melanjutkan pekerjaan tim.
                    </p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-green-500"
                            placeholder="nama@email.com"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="password" className="block text-sm">
                                Password
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-xs text-green-400 hover:text-green-300 transition-colors"
                            >
                                Lupa kata sandi?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-green-500"
                            placeholder="Masukkan password"
                        />
                    </div>

                    {/* Checkbox Ingat Saya (Remember Me) */}
                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-700 bg-black/30 text-green-600 focus:ring-green-500 accent-green-600 cursor-pointer"
                            />
                            <span>Ingat saya di perangkat ini</span>
                        </label>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold transition hover:bg-green-500 disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>

                    <p className="text-center text-xs text-gray-400 pt-2">
                        Belum punya akun?{" "}
                        <Link to="/register" className="text-green-400 hover:underline">
                            Daftar di sini
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
