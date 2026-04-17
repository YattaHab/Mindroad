/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F39F6",
        secondary: "#7C86FF",
        third: "#615fff1a",
        fourth: "#101828",
      },
    },
  },
  plugins: [],
};
