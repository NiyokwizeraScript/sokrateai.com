import type { Config } from "tailwindcss"

const config = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "var(--radius-md)",
                sm: "var(--radius-sm)",
                xl: "var(--radius-xl)",
                "2xl": "var(--radius-2xl)",
            },
            fontFamily: {
                heading: ["var(--font-heading)", "system-ui", "sans-serif"],
                body: ["var(--font-inter)", "system-ui", "sans-serif"],
            },
            boxShadow: {
                xs: "var(--shadow-xs)",
                "soft-sm": "var(--shadow-sm)",
                "soft-md": "var(--shadow-md)",
                "soft-lg": "var(--shadow-lg)",
                glow: "var(--shadow-glow)",
            },
            transitionTimingFunction: {
                "out-expo": "var(--ease-out-expo)",
            },
            transitionDuration: {
                fast: "var(--duration-fast)",
                normal: "var(--duration-normal)",
                slow: "var(--duration-slow)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "pulse-glow": {
                    "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
                    "50%": { opacity: "0.8", transform: "scale(1.02)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-6px)" },
                },
                "fade-in": {
                    from: { opacity: "0", transform: "translateY(8px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "fade-up": {
                    from: { opacity: "0", transform: "translateY(16px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                shimmer: {
                    "0%": { opacity: "0.5" },
                    "50%": { opacity: "1" },
                    "100%": { opacity: "0.5" },
                },
                "aurora-drift": {
                    "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
                    "33%": { transform: "translate(5%, -3%) rotate(1.5deg)" },
                    "66%": { transform: "translate(-3%, 4%) rotate(-1deg)" },
                },
                "aurora-opacity": {
                    "0%, 100%": { opacity: "0.5" },
                    "50%": { opacity: "0.85" },
                },
                "doc-upload": {
                    "0%": { transform: "translateY(8px)", opacity: "0.4" },
                    "50%": { transform: "translateY(-2px)", opacity: "1" },
                    "100%": { transform: "translateY(8px)", opacity: "0.4" },
                },
                "link-pulse": {
                    "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
                    "50%": { opacity: "1", transform: "scale(1.08)" },
                },
                "notes-sparkle": {
                    "0%, 100%": { opacity: "0.3", transform: "scale(0.9)" },
                    "50%": { opacity: "0.8", transform: "scale(1.1)" },
                },
                "quiz-check": {
                    "0%": { transform: "scale(0.8)", opacity: "0" },
                    "50%": { transform: "scale(1.1)", opacity: "1" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "pulse-glow": "pulse-glow 4s ease-in-out infinite",
                float: "float 3s ease-in-out infinite",
                "fade-in": "fade-in 0.5s var(--ease-out-expo) forwards",
                "fade-up": "fade-up 0.6s var(--ease-out-expo) forwards",
                shimmer: "shimmer 1.5s ease-in-out infinite",
                "aurora-drift": "aurora-drift 25s ease-in-out infinite",
                "aurora-opacity": "aurora-opacity 12s ease-in-out infinite",
                "doc-upload": "doc-upload 2.2s ease-in-out infinite",
                "link-pulse": "link-pulse 2s ease-in-out infinite",
                "notes-sparkle": "notes-sparkle 2.5s ease-in-out infinite",
                "quiz-check": "quiz-check 2s ease-in-out infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
