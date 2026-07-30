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
        // Sıcak grafit / antrasit skalası: koyu uçlar sidebar ve vurgular,
        // açık uçlar hafif fildişi esintili yüzeyler
        ink: {
          950: "#0F0F10",
          900: "#17171A",
          850: "#1D1D21",
          800: "#242429",
          700: "#303036",
          600: "#43434A",
          500: "#5B5B63",
          400: "#7D7D85",
          300: "#A3A3AA",
          200: "#DBDAD4",
          100: "#E9E8E3",
          50: "#F6F5F1",
        },
        // Klasik altın (#D4AF37) merkezli, şampanyaya açılan aksan bandı
        gold: {
          50: "#FBF7EA",
          100: "#F7EFD3",
          200: "#EFE2AC",
          300: "#E6D287",
          400: "#DEC167",
          500: "#D4AF37",
          600: "#BF9B2F",
          700: "#9C7E26",
          800: "#77601D",
          900: "#554414",
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
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 15, 16, 0.04), 0 1px 3px rgba(15, 15, 16, 0.06)",
        pop: "0 4px 12px rgba(15, 15, 16, 0.10), 0 12px 32px rgba(15, 15, 16, 0.16)",
      },
      keyframes: {
        "modal-in": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "overlay-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "modal-in": "modal-in 180ms cubic-bezier(0.16, 1, 0.3, 1)",
        "overlay-in": "overlay-in 150ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
