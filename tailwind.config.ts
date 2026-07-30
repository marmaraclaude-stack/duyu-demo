import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Antrasit / siyah zemin skalası
        ink: {
          950: "#0A0A0C",
          900: "#111114",
          850: "#17171C",
          800: "#1E1E24",
          700: "#2A2A32",
          600: "#3B3B45",
          500: "#54545F",
          400: "#75757F",
          300: "#9C9CA4",
          200: "#C6C6CC",
          100: "#E4E4E8",
          50: "#F4F4F6",
        },
        // Altın aksan bandı
        gold: {
          50: "#FBF7E9",
          100: "#F5ECCB",
          200: "#EBDCA0",
          300: "#E2CB74",
          400: "#DBBC52",
          500: "#D4AF37",
          600: "#C9A227",
          700: "#A5851F",
          800: "#7F6618",
          900: "#5C4A12",
        },
        // Olumsuz durumlar için kısıtlı kırmızı
        danger: {
          50: "#FBEFED",
          100: "#F6DBD7",
          500: "#C0503F",
          600: "#A83E2E",
          700: "#8A3226",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(10, 10, 12, 0.05), 0 1px 3px rgba(10, 10, 12, 0.06)",
        pop: "0 4px 12px rgba(10, 10, 12, 0.10), 0 12px 32px rgba(10, 10, 12, 0.14)",
      },
    },
  },
  plugins: [],
};
export default config;
