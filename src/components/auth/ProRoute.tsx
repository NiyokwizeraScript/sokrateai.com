import { Navigate, useLocation } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Loader2 } from "lucide-react";

interface ProRouteProps {
  children: React.ReactNode;
}

/** Renders children only for Pro users; redirects Free users to pricing. */
export function ProRoute({ children }: ProRouteProps) {
  const location = useLocation();
  const { isPro, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isPro) {
    return <Navigate to="/pricing-selection" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
