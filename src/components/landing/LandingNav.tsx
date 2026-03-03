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
    { href: "#how-it-works", label: "How It Works" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6 lg:px-8 pointer-events-none [&>*]:pointer-events-auto">
      <div
        className={cn(
          "max-w-6xl mx-auto transition-all duration-normal ease-out-expo",
          "bg-emerald-950/15 dark:bg-emerald-950/20 backdrop-blur-md",
          "border border-emerald-500/15",
          "shadow-[inset_0_1px_0_0_hsl(160_50%_50%/0.08),0_4px_24px_-4px_rgba(0,0,0,0.2)]",
          isScrolled && "bg-emerald-950/22 dark:bg-emerald-950/28 shadow-[inset_0_1px_0_0_hsl(160_50%_50%/0.1),0_8px_32px_-4px_rgba(0,0,0,0.25)]",
          isMobileMenuOpen ? "rounded-2xl" : "rounded-full"
        )}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-[4.25rem] px-5 sm:px-6 md:px-8">
          <Link
            to="/"
            className="flex-shrink-0 min-h-[44px] flex items-center lowercase text-white [&_span]:!text-white [&_.text-gray-600]:!text-white/80"
            aria-label="Sokrate AI home"
          >
            <SokrateLogo className="scale-70 sm:scale-75 md:scale-90 origin-left" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/85 hover:text-white transition-colors duration-fast"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/signup"
              className={cn(
                "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium",
                "bg-transparent border border-emerald-500/60 text-white",
                "transition-all duration-200 hover:border-emerald-400 hover:shadow-[0_0_20px_-4px_hsl(160_50%_50%/0.4)]"
              )}
            >
              Start Now
            </Link>
          </div>

          <button
            type="button"
            className={cn(
              "md:hidden p-3 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors duration-fast"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 px-2 pb-5 border-t border-emerald-500/15 bg-emerald-950/15 backdrop-blur-md rounded-b-2xl">
            <nav className="flex flex-col gap-0">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors py-3 px-2 rounded-lg min-h-[44px] flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-white/10">
                <Button asChild className="w-full h-11 min-h-[44px] bg-primary text-primary-foreground">
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
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
