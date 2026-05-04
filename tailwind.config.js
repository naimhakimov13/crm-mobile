/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EAF7FF",
          100: "#D6EFFF",
          200: "#A8DFFE",
          300: "#88D6EF",
          400: "#3FBDFF",
          500: "#1FA8FF",
          600: "#1390E0",
        },
        ink: {
          900: "#0E1726",
          700: "#293548",
          500: "#5B6878",
          400: "#8893A4",
          300: "#B4BCC8",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F4F6FA",
          subtle: "#EEF2F7",
        },
        success: "#22C55E",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      borderRadius: {
        card: "10px",
        btn: "10px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(14, 23, 38, 0.04), 0 6px 16px rgba(14, 23, 38, 0.06)",
        nav: "0 -4px 16px rgba(14, 23, 38, 0.08)",
      },
      backgroundImage: {
        "brand-grad":
          "linear-gradient(135deg, #3FBDFF 0%, #1FA8FF 100%)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
