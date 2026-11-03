import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const code = searchParams.get("code");
            const next = searchParams.get("next") || "/beranda";

            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (!error) {
                    navigate(next, { replace: true });
                    return;
                }
            }

            // Supabase client might handle implicit hash auth automatically
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate(next, { replace: true });
            } else {
                navigate("/login?error=auth", { replace: true });
            }
        };

        handleAuthCallback();
    }, [navigate, searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0b1110] text-white">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-green-400" />
                <p className="text-sm text-gray-300">Menyelesaikan autentikasi...</p>
            </div>
        </div>
    );
}
