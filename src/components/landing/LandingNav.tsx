import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SokrateLogo } from "@/components/auth/SokrateLogo";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#subjects", label: "Subjects" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6 lg:px-8 pointer-events-none [&>*]:pointer-events-auto">
      <div
        className={cn(
          "max-w-6xl mx-auto transition-all duration-normal ease-out-expo",
          "bg-background/75 dark:bg-background/80 backdrop-blur-xl",
          "border border-border/80",
          "shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.06),0_0_0_1px_hsl(var(--background)/0.5),0_4px_24px_-4px_hsl(0_0%_0%/0.12),0_8px_32px_-8px_hsl(0_0%_0%/0.08)]",
          "dark:shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.08),0_0_0_1px_hsl(var(--background)/0.3),0_4px_24px_-4px_hsl(0_0%_0%/0.4),0_8px_40px_-8px_hsl(0_0%_0%/0.25)]",
          isScrolled &&
            "shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.07),0_0_0_1px_hsl(var(--background)/0.6),0_8px_32px_-4px_hsl(0_0%_0%/0.15),0_20px_48px_-12px_hsl(0_0%_0%/0.1)] dark:shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.09),0_0_0_1px_hsl(var(--background)/0.4),0_8px_32px_-4px_hsl(0_0%_0%/0.5),0_24px_56px_-12px_hsl(0_0%_0%/0.35)]",
          isMobileMenuOpen ? "rounded-2xl" : "rounded-full"
        )}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-[4.25rem] px-5 sm:px-6 md:px-8">
          <Link
            to="/"
            className="flex-shrink-0 min-h-[44px] flex items-center"
            aria-label="Sokrate AI home"
          >
            <SokrateLogo className="scale-70 sm:scale-75 md:scale-90 origin-left" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-fast"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button
              asChild
              className="cta-premium glow-primary bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link to="/login">Get Started</Link>
            </Button>
          </div>

          <button
            type="button"
            className={cn(
              "md:hidden p-3 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-fast"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 px-2 pb-5 border-t border-border/80 bg-background/95 backdrop-blur-sm rounded-b-2xl">
            <nav className="flex flex-col gap-0">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground hover:text-primary hover:bg-accent transition-colors py-3 px-2 rounded-lg min-h-[44px] flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-border">
                <Button asChild className="w-full h-11 min-h-[44px] bg-primary text-primary-foreground">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
