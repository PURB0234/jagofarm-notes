import { supabase } from "../supabase";

export type UserRole = "admin" | "member";

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "admin" && profile.role !== "member")) {
    return null;
  }

  return profile.role as UserRole;
}
