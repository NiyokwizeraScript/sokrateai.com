import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { auth } from "@/lib/firebase";
import { setUserProfile } from "@/lib/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Pencil,
  Mail,
  Globe,
  Fingerprint,
  Copy,
  LogOut,
  Crown,
  Sparkles,
  Calendar,
  Check,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUpgradeDialog } from "@/components/billing/UpgradeDialog";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, isPro, isLoading: profileLoading } = useUserProfile();
  const { open: openUpgrade } = useUpgradeDialog();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(user?.displayName ?? "");
  const [isSavingName, setIsSavingName] = useState(false);

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : user?.displayName
      ? user.displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

  const memberSince =
    profile?.createdAt ||
    (user as { metadata?: { creationTime?: string } } | null)?.metadata?.creationTime;
  const memberSinceFormatted = memberSince
    ? new Date(memberSince).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const handleCopyUserId = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      toast({ title: "Copied", description: "User ID copied to clipboard." });
    }
  };

  const startEditName = () => {
    setEditNameValue(user?.displayName ?? "");
    setIsEditingName(true);
  };

  const cancelEditName = () => {
    setIsEditingName(false);
    setEditNameValue(user?.displayName ?? "");
  };

  const saveName = async () => {
    const trimmed = editNameValue.trim();
    if (!user?.uid || !trimmed) {
      cancelEditName();
      return;
    }
    setIsSavingName(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      }
      await setUserProfile(user.uid, { displayName: trimmed });
      toast({ title: "Name updated" });
      setIsEditingName(false);
    } catch (e) {
      toast({ title: "Could not update name", variant: "destructive" });
    } finally {
      setIsSavingName(false);
    }
  };

  const handleLogOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, subscription, and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First card: Profile — vertical layout with purple banner, avatar overlapping, no camera */}
        <Card className="bg-muted/30 border-muted overflow-hidden rounded-lg">
          <CardHeader className="sr-only">
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Purple header banner */}
            <div className="h-20 bg-purple-600 rounded-t-lg" aria-hidden />
            {/* Avatar centered, overlapping banner — shows email initials (no photo/logo) */}
            <div className="flex justify-center -mt-12 px-6">
              <Avatar className="h-24 w-24 border-4 border-card rounded-full shadow-md">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold rounded-full">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Content: name, details, log out — vertical stack */}
            <div className="px-6 pt-4 pb-6 flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2 flex-1 justify-center max-w-[280px]">
                    <Input
                      value={editNameValue}
                      onChange={(e) => setEditNameValue(e.target.value)}
                      className="h-9 flex-1"
                      placeholder="Display name"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveName();
                        if (e.key === "Escape") cancelEditName();
                      }}
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 shrink-0"
                      onClick={saveName}
                      disabled={isSavingName}
                      aria-label="Save name"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 shrink-0"
                      onClick={cancelEditName}
                      disabled={isSavingName}
                      aria-label="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-foreground text-lg truncate">
                      {user?.displayName ?? "—"}
                    </span>
                    <button
                      type="button"
                      className="shrink-0 p-1 rounded-md hover:bg-muted text-muted-foreground"
                      onClick={startEditName}
                      aria-label="Edit name"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>Email</span>
                <span className="truncate ml-auto text-foreground">{user?.email ?? "—"}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 shrink-0" />
                <span>Language</span>
                <span className="ml-auto text-foreground">English</span>
              </div>

              <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2 min-w-0">
                  <Fingerprint className="h-4 w-4 shrink-0" />
                  User ID
                </span>
                <span className="truncate font-mono text-xs max-w-[140px] text-foreground" title={user?.uid ?? ""}>
                  {user?.uid ? `${user.uid.slice(0, 8)}...` : "—"}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="shrink-0 p-1 rounded-md hover:bg-muted text-muted-foreground"
                  aria-label="Copy User ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <Button
                variant="outline"
                className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive mt-2"
                onClick={handleLogOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right panel: Subscription */}
        <Card className="bg-muted/30 border-muted">
          <CardHeader className="relative">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Subscription
                  <Crown className="h-5 w-5 text-primary" />
                </CardTitle>
                <CardDescription>
                  {isPro
                    ? "Full access with all features."
                    : "Basic access with essential features."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileLoading ? (
              <p className="text-sm text-muted-foreground">Loading plan…</p>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Current plan
                    </p>
                    <p className="font-semibold text-foreground text-lg">
                      {isPro ? "Pro" : "Starter"}
                    </p>
                  </div>
                  {!isPro && (
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => openUpgrade()}>
                      <Sparkles className="h-4 w-4" />
                      Upgrade
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>Member since</span>
                  <span className="text-foreground">{memberSinceFormatted}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
