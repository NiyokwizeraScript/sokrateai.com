import { Link } from "react-router-dom";
import { SokrateLogo } from "@/components/auth/SokrateLogo";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 mb-10 sm:mb-12">
          <div className="sm:col-span-2 md:col-span-1">
            <SokrateLogo className="mb-3 scale-75 origin-left" />
            <p className="text-sm text-gray-600">Become Brilliant with Sokrate AI</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3 text-slate-900">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-green-600 transition-colors py-0.5 block">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3 text-slate-900">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-green-600 transition-colors py-0.5 block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Sokrate AI. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Made with precision for scientists and scholars.
          </p>
        </div>
      </div>
    </footer>
  );
}