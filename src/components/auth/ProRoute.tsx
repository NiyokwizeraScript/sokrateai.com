import { useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Loader2 } from "lucide-react";
import { useUpgradeDialog } from "@/components/billing/UpgradeDialog";

interface ProRouteProps {
  children: React.ReactNode;
}

/** Renders children only for Pro users; opens upgrade dialog for Free users. */
export function ProRoute({ children }: ProRouteProps) {
  const { isPro, isLoading } = useUserProfile();
  const { open: openUpgrade } = useUpgradeDialog();

  useEffect(() => {
    if (!isLoading && !isPro) {
      openUpgrade();
    }
  }, [isLoading, isPro, openUpgrade]);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted-foreground">Upgrade to Pro to access this feature.</p>
        <p className="text-sm text-muted-foreground">The upgrade dialog should be open above.</p>
      </div>
    );
  }

  return <>{children}</>;
}
