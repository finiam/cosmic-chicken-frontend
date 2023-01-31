/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Anton", "sans-serif"],
        mono: ["DM Mono", "sans-serif"],
      },
      fontSize: {
        small: "18px",
        base: "20px",
        large: "24px",
        huge: "40px",
      },
      colors: {
        offwhite: "#F1EFE6",
        "beige-white": "#E3DDD1",
        black: "#000",
        brown: "#423B3C",
        orange: "#EB9F59",
      },
    },
  },
  plugins: [],
};