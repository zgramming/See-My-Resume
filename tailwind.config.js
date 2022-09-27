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
        accent: process.env["NEXT_PUBLIC_TAILWIND_ACCENT_COLOR"],
        success: process.env["NEXT_PUBLIC_TAILWIND_SUCCESS_COLOR"],
        info: process.env["NEXT_PUBLIC_TAILWIND_INFO_COLOR"],
        warning: process.env["NEXT_PUBLIC_TAILWIND_WARNING_COLOR"],
        error: process.env["NEXT_PUBLIC_TAILWIND_ERROR_COLOR"],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
