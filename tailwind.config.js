/** @type {import('tailwindcss').Config} */

console.log({
  message: "Tailwind.config.js loaded configuration",
  config: {
    primaryColor: process.env["NEXT_PUBLIC_TAILWIND_PRIMARY_COLOR"],
  },
});

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: process.env["NEXT_PUBLIC_TAILWIND_PRIMARY_COLOR"],
      },
    },
  },
  plugins: [],
};
