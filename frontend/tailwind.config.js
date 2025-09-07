/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2563eb", dark: "#1e40af", light: "#60a5fa" },
        secondary: { DEFAULT: "#f97316", dark: "#c2410c", light: "#fdba74" },
        neutral: { DEFAULT: "#f3f4f6", dark: "#374151", light: "#9ca3af" },
      },
    },
  },
  plugins: [],
};