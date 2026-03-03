import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SokrateLogo } from "@/components/auth/SokrateLogo";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Column 1: Logo, motto, Get Started */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-3 text-white [&_span]:!text-white [&_.text-gray-600]:!text-white/80">
              <SokrateLogo className="scale-75 origin-left" />
            </Link>
            <p className="text-sm text-white/70 mb-6">Turn anything into notes, flashcards, and quizzes.</p>
            <Button asChild className="rounded-xl bg-emerald-500 text-white border-0 hover:bg-emerald-400 font-medium">
              <Link to="/login">Get Started – It's Free</Link>
            </Button>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3 text-white">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#how-it-works" className="text-sm text-white/70 hover:text-white transition-colors py-0.5 block">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/for-students" className="text-sm text-white/70 hover:text-white transition-colors py-0.5 block">
                  For Students
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3 text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors py-0.5 block">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors py-0.5 block">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3 text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-white/70 hover:text-white transition-colors py-0.5 block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-white/70 hover:text-white transition-colors py-0.5 block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-white/70 hover:text-white transition-colors py-0.5 block">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-white/60">
            &copy; {new Date().getFullYear()} Sokrate AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
