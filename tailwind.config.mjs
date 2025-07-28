import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#1D4ED8",
          700: "#163BA4",
          900: "#0F2871",
        },
        secondary: "#e9c45b",
      },
      fontFamily: {
        sans: ["AeonikPro", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
