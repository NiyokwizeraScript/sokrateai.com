import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, setUserProfile } from "@/lib/firestore";
import type { Plan } from "@/lib/firestore";

const DOWNGRADE_TO_FREE_EMAIL = "athenaaiappp@gmail.com";

export function useUserProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const downgraded = useRef(false);
  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: () => getUserProfile(user!.uid),
    enabled: !!user?.uid,
  });

  // One-time downgrade: make this specific user non-pro (set Firestore plan to "free")
  useEffect(() => {
    if (
      !user?.uid ||
      !profile ||
      downgraded.current ||
      user.email !== DOWNGRADE_TO_FREE_EMAIL ||
      profile.plan !== "pro"
    )
      return;
    downgraded.current = true;
    setUserProfile(user.uid, { plan: "free" }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", user.uid] });
    });
  }, [user?.uid, user?.email, profile, queryClient]);

  const plan: Plan = profile?.plan ?? "free";
  const isPro = plan === "pro";

  /** Free: only Quizzes + Account. Pro: everything. */
  function canAccess(path: string): boolean {
    const proOnly = ["/dashboard", "/solver", "/synthesizer", "/history", "/feedback"];
    if (proOnly.some((p) => path === p || path.startsWith(p + "/"))) return isPro;
    if (path === "/quizzes" || path === "/account") return true;
    return true;
  }

  return { profile, plan, isPro, isLoading, canAccess };
}
