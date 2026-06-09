import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Sansan uses sofia-pro (Adobe Fonts). Fall back to a clean,
        // brand-adjacent sans + Japanese stack when the kit isn't loaded.
        sans: [
          "sofia-pro",
          "Helvetica Neue",
          "Arial",
          "Hiragino Kaku Gothic ProN",
          "Hiragino Sans",
          "Meiryo",
          "sans-serif",
        ],
        // AssetSync (SaaS hero) brand font.
        lato: ["var(--font-lato)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        // === Design System セマンティックトークン（単一の真実源） ===
        // 実値は app/globals.css の CSS 変数。light/dark/Brand Kit を同一機構で扱う。
        // 既存の Sansan 系トークンとは名前が衝突しないよう primary-* / surface 等を採用。
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          fg: "rgb(var(--color-primary-fg) / <alpha-value>)",
          accent: "rgb(var(--color-primary-accent) / <alpha-value>)",
          muted: "rgb(var(--color-primary-muted) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          fg: "rgb(var(--color-surface-fg) / <alpha-value>)",
          muted: "rgb(var(--color-surface-muted) / <alpha-value>)",
        },
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          fg: "rgb(var(--color-success-fg) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--color-danger) / <alpha-value>)",
          fg: "rgb(var(--color-danger-fg) / <alpha-value>)",
        },

        // Sansan brand palette（既存・当面併存。撤去は後続Phase）
        canvas: "#f6f7f9",
        ink: "#1a1a1a",
        subtle: "#6b7280",
        accent: {
          DEFAULT: "#004e98", // Sansan blue
          soft: "#e9f0f8", // light blue tint
          ring: "#3b7cc4",
          ink: "#003a71", // darker blue for hovers/headings
        },
        brand: {
          red: "#bf000b",
          redmark: "#d70c18", // logo bar red
        },
        muted: "#f8f8f8",
        // Numeric Sansan-blue scale (600 == #004e98 brand blue) so existing
        // shade-based utilities remap to brand instead of generic indigo.
        sansan: {
          50: "#eef4fb",
          100: "#d9e6f4",
          200: "#b3cce8",
          300: "#7da9d6",
          400: "#4080bf",
          500: "#1a5fa3",
          600: "#004e98",
          700: "#003f7d",
          800: "#003163",
          900: "#00264d",
        },
      },
      boxShadow: {
        // Blue-tinted Sansan shadow
        soft: "0 2px 8px rgba(0, 57, 113, 0.06)",
        card: "8px 8px 30px rgba(0, 57, 113, 0.10)",
        cardhover: "8px 8px 36px rgba(0, 57, 113, 0.16)",
      },
      borderRadius: {
        // Sansan uses small radii (~5–10px) for surfaces, pills for buttons
        lg: "0.375rem", // 6px
        xl: "0.5rem", // 8px
        "2xl": "0.625rem", // 10px
        "3xl": "0.875rem", // 14px
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInSlow: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out both",
        fadeInSlow: "fadeInSlow 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
