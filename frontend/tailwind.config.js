/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D97706",
        secondary: "#7C2D12",
        accent: "#FB923C",
        background: "#FFF7ED",
      },
    },
  },
  plugins: [],
}