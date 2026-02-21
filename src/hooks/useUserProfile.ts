import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/lib/firestore";
import type { Plan } from "@/lib/firestore";

export function useUserProfile() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: () => getUserProfile(user!.uid),
    enabled: !!user?.uid,
  });

  const plan: Plan = profile?.plan ?? "free";
  const email = user?.email ?? profile?.email ?? "";
  const isProByEmail = email === "athenaaiappp@gmail.com";
  const isPro = isProByEmail || plan === "pro";

  /** Free: only Quizzes + Account. Pro: everything. */
  function canAccess(path: string): boolean {
    const proOnly = ["/dashboard", "/solver", "/synthesizer", "/history", "/feedback"];
    if (proOnly.some((p) => path === p || path.startsWith(p + "/"))) return isPro;
    if (path === "/quizzes" || path === "/account") return true;
    return true;
  }

  return { profile, plan, isPro, isLoading, canAccess };
}
