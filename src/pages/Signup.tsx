import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SokrateLogo } from "@/components/auth/SokrateLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
export default function Signup() {
  const { signInWithGoogle, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    try {
      await signInWithGoogle();
      navigate("/onboarding");
    } catch (error: unknown) {
      toast({
        title: "Authentication Error",
        description:
          error instanceof Error ? error.message : "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter your email and password.",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingEmail(true);
    try {
      await signUpWithEmail({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      navigate("/onboarding");
    } catch (error: unknown) {
      const code = (error as { code?: string } | null)?.code;
      if (code === "auth/email-already-in-use") {
        toast({
          title: "You already have an account",
          description: "That email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        const message =
          error instanceof Error ? error.message : "Failed to create account";
        toast({
          title: "Sign up failed",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoadingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-foreground overflow-x-hidden">
      {/* Static dark background — no animations to avoid browser lag */}
      <div className="fixed inset-0 -z-10 bg-[#0B0F14]" aria-hidden />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent" aria-hidden />

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block [&_span]:!text-white [&_.text-gray-600]:!text-white/80">
              <SokrateLogo className="scale-90" />
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#161b22]/90 shadow-xl shadow-black/20 p-8 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              Sign Up
            </h1>
            <p className="text-white/80 text-sm mb-6">
              Create notes in minutes. No credit card required.
            </p>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white mb-6"
              onClick={handleGoogleSignIn}
              disabled={isLoadingGoogle}
            >
              {isLoadingGoogle ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <div className="relative flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-xs font-medium text-white/50 uppercase tracking-wider">OR</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-11 rounded-xl border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-emerald-500/50"
                />
                <Input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-11 rounded-xl border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-emerald-500/50"
                />
              </div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-emerald-500/50"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 rounded-xl border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-emerald-500/50"
              />
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold border-0"
                disabled={isLoadingEmail}
              >
                {isLoadingEmail ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Create an account"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-white/70 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-white/50 mt-6 max-w-sm mx-auto">
            By creating or entering an account, you agree to the{" "}
            <Link to="/terms" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-1">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-1">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
