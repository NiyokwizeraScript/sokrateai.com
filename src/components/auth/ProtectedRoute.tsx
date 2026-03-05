import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getUserProfile } from "@/lib/firestore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const { data: profile, isPending: isProfilePending } = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: () => getUserProfile(user!.uid),
    enabled: !!user?.uid,
  });

  const isPending = loading || (!!user && isProfilePending);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Show onboarding only once: redirect if not yet completed (and not already on onboarding/checkout)
  const isOnOnboardingPage = location.pathname === "/onboarding";
  const isOnCheckoutPage = location.pathname.startsWith("/checkout");
  const needsOnboarding = profile?.onboardingCompleted === false;

  if (needsOnboarding && !isOnOnboardingPage && !isOnCheckoutPage) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
