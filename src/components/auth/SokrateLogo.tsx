import { cn } from "@/lib/utils";

interface SokrateLogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

// Keep old name as alias for backwards compatibility
export type AthenaLogoProps = SokrateLogoProps;

export function SokrateLogo({
  className,
  iconClassName,
  showText = true,
  size = "md"
}: SokrateLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        {/* Glow effect behind the logo */}
        <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg" />
        <img
          src="/sokrate-ai.png"
          alt="Sokrate AI"
          className={cn(
            "relative object-contain drop-shadow-lg",
            sizeClasses[size],
            iconClassName
          )}
        />
      </div>
      {showText ? (
        <div className="flex flex-col">
          <span className={cn(
            "font-heading font-bold tracking-tight text-green-600",
            textSizeClasses[size]
          )}>Sokrate AI</span>
          <span className="text-xs font-medium text-gray-600">
            AI Learning Assistant
          </span>
        </div>
      ) : null}
    </div>
  );
}

// Alias for backwards compatibility
export const AthenaLogo = SokrateLogo;