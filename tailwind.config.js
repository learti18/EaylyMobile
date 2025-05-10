/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins_400Regular'],
        poppins: ['Poppins_400Regular'],
      },
      colors: {
        primary:{
          100: "#DBD9EE",
          500: "#6C5FBC",
          700: "#5c4eae"
        },
        secondary:{
          100:"#8E97A6",
          500:"#323142"
        },
        background:{
          100:"#f9f9f9",
          500:"#f5f5f5"
        },
      },
    },
  },
  plugins: [],
}

