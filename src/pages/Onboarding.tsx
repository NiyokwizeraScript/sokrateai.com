import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SokrateLogo } from "@/components/auth/SokrateLogo";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { setUserProfile } from "@/lib/firestore";
import { useQueryClient } from "@tanstack/react-query";

const roleOptions = [
  { id: "undergrad", label: "Undergraduate Student", emoji: "🎓" },
  { id: "grad", label: "Graduate Student", emoji: "📚" },
  { id: "professional", label: "Working Professional", emoji: "💼" },
  { id: "teacher", label: "Teacher / Professor", emoji: "🧑‍🏫" },
  { id: "highschool", label: "High School Student", emoji: "🏫" },
  { id: "middleschool", label: "Middle School Student", emoji: "👩‍🎓" },
  { id: "other-role", label: "Other", emoji: "🙂" },
];

const discoveryOptions = [
  { id: "tiktok", label: "TikTok", emoji: "🎵" },
  { id: "youtube", label: "YouTube", emoji: "▶️" },
  { id: "instagram", label: "Instagram", emoji: "📸" },
  { id: "twitter", label: "Twitter / X", emoji: "🐦" },
  { id: "friend", label: "A Friend", emoji: "🧑‍🤝‍🧑" },
  { id: "search", label: "Google Search", emoji: "🔍" },
  { id: "app-store", label: "App Store", emoji: "📱" },
  { id: "other-source", label: "Other", emoji: "❓" },
];

export default function Onboarding() {
  const [step, setStep] = useState<0 | 1>(0);
  const [roleId, setRoleId] = useState<string | null>(null);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [user, loading, navigate]);

  const markCompletedAndContinue = () => {
    if (user?.uid) {
      setUserProfile(user.uid, { onboardingCompleted: true }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["userProfile", user.uid] });
        navigate("/dashboard");
      });
    } else {
      navigate("/dashboard");
    }
  };

  const handleContinue = () => {
    if (step === 0) {
      setStep(1);
    } else {
      markCompletedAndContinue();
    }
  };

  const handleSkip = () => {
    if (step === 0) {
      setStep(1);
    } else {
      markCompletedAndContinue();
    }
  };

  const isLastStep = step === 1;
  const progress = isLastStep ? 1 : 0.5;
  const canContinue =
    step === 0 ? !!roleId : !!sourceId;

  const options = step === 0 ? roleOptions : discoveryOptions;
  const selectedId = step === 0 ? roleId : sourceId;

  const title =
    step === 0 ? "What describes you best?" : "How did you hear about Sokrate?";
  const subtitle =
    step === 0
      ? "We use this to personalize your experience – should only take 15 seconds 🙂"
      : "This helps us understand how students find us.";

  return (
    <div className="min-h-screen bg-[#0B0F14] text-foreground overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-[#0B0F14]" aria-hidden />
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-b from-emerald-950/25 via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-4 sm:py-6">
        <div className="w-full max-w-3xl">
          <div className="flex justify-center mb-5 sm:mb-6">
            <SokrateLogo className="scale-90 [&_span]:!text-white [&_.text-gray-600]:!text-white/80" />
          </div>

          <Card className="bg-[#050810]/95 border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.65)] rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-4 sm:py-5 text-white max-h-[72vh] sm:max-h-[68vh] flex flex-col">
            {/* Progress bar */}
            <div className="w-full mb-4 sm:mb-5">
              <div className="h-[5px] rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-4 sm:mb-5">
              <h1 className="text-xl sm:text-2xl font-bold font-heading tracking-tight mb-1.5">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-white/70 max-w-xl">
                {subtitle}
              </p>
            </div>

            <div className="mb-4 sm:mb-5 flex-1 overflow-y-auto pr-1">
              <div className="space-y-2 sm:space-y-2.5">
                {options.map((option) => {
                  const isSelected = selectedId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        step === 0 ? setRoleId(option.id) : setSourceId(option.id)
                      }
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border text-left transition-all duration-150",
                        "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]",
                        isSelected &&
                          "border-emerald-500/70 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_14px_40px_rgba(0,0,0,0.7)]"
                      )}
                    >
                      <div className="flex items-center gap-3 sm:gap-3.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-base">
                          <span>{option.emoji}</span>
                        </div>
                        <span className="text-sm sm:text-[0.95rem] font-medium leading-snug">
                          {option.label}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="button"
              className="w-full h-10 sm:h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold border-0 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleContinue}
              disabled={!canContinue}
            >
              {isLastStep ? "Continue to dashboard" : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <button
              type="button"
              onClick={handleSkip}
              className="mt-2.5 w-full text-center text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
            >
              Skip question
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}