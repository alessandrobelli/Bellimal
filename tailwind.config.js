module.exports = {
  darkMode: "class",
  content: ["./*.hbs", "./partials/**/*.hbs", "./assets/js/**/*.js"],
  theme: {
    extend: {
      backgroundColor: {
        dark: "#121212",
        darkSecondary: "#1e1e1e",
      },
      textColor: {
        darkText: "#e2e2e2",
        darkMuted: "#a0a0a0",
      },
      colors: {
        anthracite: "#292C2F",
        orangeValencia: {
          50: "#FEF4F2",
          100: "#FEEAE6",
          200: "#FDC6BE",
          300: "#FBA296",
          400: "#F97D6E",
          500: "#F75946",
          600: "#D84727", // Default color
          700: "#A0361D",
          800: "#682513",
          900: "#301308",
          DEFAULT: "#D84727",
        },
      },
      fontFamily: {
        body: ['"Cascadia Code"', "monospace"],
        heading: ['"Atkinson Hyperlegible"', "sans-serif"],
      },
      scale: {
        101: "1.01",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
