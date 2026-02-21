import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Analytics } from "@vercel/analytics/react";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import VerifyOtp from "@/pages/VerifyOtp";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Solver from "@/pages/Solver";
import Synthesizer from "@/pages/Synthesizer";
import Quizzes from "@/pages/Quizzes";
import History from "@/pages/History";
import Feedback from "@/pages/Feedback";
import NotFound from "@/pages/NotFound";
import CheckoutPro from "@/pages/CheckoutPro";
import FAQ from "@/pages/FAQ";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import PricingSelection from "@/pages/PricingSelection";
import Account from "@/pages/Account";

const queryClient = new QueryClient();

import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProRoute } from "@/components/auth/ProRoute";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/checkout-pro" element={<CheckoutPro />} />
            <Route path="/pricing-selection" element={<PricingSelection />} />

            {/* Dashboard routes (with sidebar layout) */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<ProRoute><Dashboard /></ProRoute>} />
              <Route path="/solver" element={<ProRoute><Solver /></ProRoute>} />
              <Route path="/synthesizer" element={<ProRoute><Synthesizer /></ProRoute>} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/history" element={<ProRoute><History /></ProRoute>} />
              <Route path="/feedback" element={<ProRoute><Feedback /></ProRoute>} />
              <Route path="/account" element={<Account />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Analytics />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
