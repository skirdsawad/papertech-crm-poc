import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#1F6C35",
          50: "#E8F5EC",
          100: "#D1EBD9",
          200: "#A3D7B3",
          300: "#75C38D",
          400: "#47AF67",
          500: "#1F6C35",
          600: "#19562A",
          700: "#134120",
          800: "#0D2B15",
          900: "#06160B",
        },
      },
    },
  },
  plugins: [],
};

export default config;
