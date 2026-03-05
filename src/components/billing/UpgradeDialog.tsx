import { createContext, useContext, useState, ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SokrateLogo } from "@/components/auth/SokrateLogo";
import { useAuth } from "@/contexts/AuthContext";
import { FileUp, Users, Zap, BookOpen, MessageSquare } from "lucide-react";

interface UpgradeDialogContextValue {
  open: () => void;
}

const UpgradeDialogContext = createContext<UpgradeDialogContextValue | null>(null);

export function useUpgradeDialog() {
  const ctx = useContext(UpgradeDialogContext);
  if (!ctx) {
    throw new Error("useUpgradeDialog must be used within an UpgradeDialogProvider");
  }
  return ctx;
}

export function UpgradeDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleOpen = () => setOpen(true);

  return (
    <UpgradeDialogContext.Provider value={{ open: handleOpen }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl bg-card text-card-foreground border border-border shadow-xl dark:bg-[#050810] dark:text-white dark:border-emerald-500/25 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_0_40px_-8px_rgba(16,185,129,0.25),0_24px_80px_rgba(0,0,0,0.85)]">
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-center mb-3">
              <SokrateLogo showText={false} className="scale-75" />
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-center text-foreground dark:text-white">
              Upgrade to Pro
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base text-muted-foreground dark:text-white/70">
              Sokrate is faster, more intelligent, and unlimited with premium.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <ul className="space-y-3 text-sm text-foreground/90 dark:text-white/85">
              {[
                { icon: FileUp, text: "Unlimited PDF uploads, audio hours, and YouTube videos." },
                { icon: Users, text: "Collaborate with Sokrate on more complex tasks." },
                { icon: Zap, text: "Unlimited faster AI edits." },
                { icon: BookOpen, text: "Unlimited and better quizzes and flashcards." },
                { icon: MessageSquare, text: "Unlimited chat conversations and notes." },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 dark:bg-emerald-500/15 dark:border-emerald-500/25">
                    <Icon className="w-4 h-4 text-primary dark:text-emerald-400" />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl border border-primary/20 bg-muted/50 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-[0_0_20px_-8px_hsl(var(--primary)/0.12)] dark:border-emerald-500/20 dark:bg-white/5 dark:shadow-[0_0_20px_-8px_rgba(16,185,129,0.2)]">
              <div>
                <div className="text-xs font-semibold text-primary dark:text-emerald-300 mb-1">
                  Monthly
                </div>
                <div className="text-foreground dark:text-white text-3xl font-bold leading-tight">
                  $19.99 <span className="text-sm text-muted-foreground dark:text-white/70 font-medium">/ month</span>
                </div>
              </div>
            </div>

            <form
              action="/api/create-checkout-session"
              method="POST"
              className="space-y-4"
            >
              <input
                type="hidden"
                name="lookup_key"
                value={import.meta.env.VITE_STRIPE_PRICE_ID ?? ""}
              />
              {user?.uid && <input type="hidden" name="user_id" value={user.uid} />}

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm sm:text-base"
              >
                ✨ Upgrade to Pro
              </Button>
            </form>

            <p className="text-center text-[11px] sm:text-xs text-muted-foreground dark:text-white/50">
              Join thousands of students working smarter with Sokrate. Secure payment powered by Stripe. Cancel anytime.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </UpgradeDialogContext.Provider>
  );
}

