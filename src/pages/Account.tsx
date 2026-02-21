import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Palette, Sparkles, Crown } from "lucide-react";

export default function Account() {
  const { user } = useAuth();
  const { isPro, isLoading: profileLoading } = useUserProfile();

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Account</h1>
        <p className="text-muted-foreground">Manage your profile and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Your account information from Google.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{user?.displayName ?? "—"}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5" />
                {user?.email ?? "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Choose light or dark theme for the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Theme</Label>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Subscription</CardTitle>
          <CardDescription>
            Your current plan and access level.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileLoading ? (
            <p className="text-sm text-muted-foreground">Loading plan…</p>
          ) : (
            <>
              <div className="flex items-center gap-3">
                {isPro ? (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Crown className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Pro</p>
                      <p className="text-sm text-muted-foreground">
                        Full access to Solver, Synthesizer, History, and Feedback.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Free</p>
                      <p className="text-sm text-muted-foreground">
                        Quizzes and Account. Upgrade for Solver, Synthesizer, History, and Feedback.
                      </p>
                    </div>
                  </>
                )}
              </div>
              {!isPro && (
                <Button asChild className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 text-white hover:opacity-95 border-0 shadow-md">
                  <Link to="/pricing-selection" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Upgrade to Pro
                  </Link>
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
