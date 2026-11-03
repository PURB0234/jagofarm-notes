import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, type UserRole } from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  role: UserRole | null;
  profile: { id: string; role: UserRole; full_name?: string; email?: string } | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<{ id: string; role: UserRole; full_name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, role, full_name, email")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (data && (data.role === "admin" || data.role === "member")) {
        setProfile(data as any);
        setRole(data.role as UserRole);
      } else {
        setProfile(null);
        setRole(null);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfile(null);
      setRole(null);
    }
  };

  const refreshProfile = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);
    if (currentUser) {
      await fetchProfile(currentUser);
    } else {
      setProfile(null);
      setRole(null);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: initialUser } }) => {
      setUser(initialUser);
      if (initialUser) {
        await fetchProfile(initialUser);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        if (sessionUser) {
          await fetchProfile(sessionUser);
        } else {
          setProfile(null);
          setRole(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
