import { useLocation } from "react-router-dom";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const LANDING_PATH = "/";

/**
 * Theme rules:
 * - Landing page ("/"): Always dark, no toggle. forcedTheme="dark" ignores system and stored preference.
 * - Dashboard (authenticated): Default dark, user can switch; preference persisted in localStorage.
 */
export function ThemeProviderWithLanding({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isLanding = pathname === LANDING_PATH;

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="theme"
      forcedTheme={isLanding ? "dark" : undefined}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
