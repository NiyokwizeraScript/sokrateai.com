import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
// Local type definition (originally from backend)
interface CheckOnboardingStatusResponse {
  isNewUser: boolean;
  hasCompletedOnboarding: boolean;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending: isSessionPending } = useSession();
  const location = useLocation();

  // Check onboarding status if user is authenticated
  const { data: onboardingStatus, isPending: isOnboardingPending } = useQuery({
    queryKey: ["onboarding-status"],
    queryFn: async () => {
      const response = await api.get<CheckOnboardingStatusResponse>(
        "/api/subscription/onboarding-status"
      );
      return response;
    },
    enabled: !!session?.user,
  });

  const isPending = isSessionPending || isOnboardingPending;

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-glow" />
            <Loader2 className="relative h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-sm text-gray-600 animate-fade-in">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if user is new (not on onboarding or checkout pages)
  const isOnOnboardingPage = location.pathname === "/onboarding";
  const isOnCheckoutPage = location.pathname.startsWith("/checkout");

  if (
    onboardingStatus &&
    onboardingStatus.isNewUser &&
    !isOnOnboardingPage &&
    !isOnCheckoutPage
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}