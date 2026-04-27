const monoStack = [
  '"Atkinson Hyperlegible Mono"',
  "ui-monospace",
  "Menlo",
  "Consolas",
  "monospace",
];

module.exports = {
  darkMode: "class",
  content: ["./*.hbs", "./partials/**/*.hbs", "./assets/js/**/*.js"],
  theme: {
    extend: {
      backgroundColor: {
        dark: "#1d232f",
        darkSecondary: "#181d28",
      },
      textColor: {
        darkText: "#e6e7ea",
        darkMuted: "#a7adb8",
      },
      colors: {
        anthracite: "#292C2F",

        // New slate palette (per redesign brief — dark-mode foundation)
        bg: "#1d232f",
        panel: "#181d28",
        card: "#232936",
        terminal: "#0f1218",
        line: "#2d3340",
        divider: "#232936",

        // Text scale on dark
        textPrimary: "#e6e7ea",
        textDim: "#a7adb8",
        textMute: "#6e7480",

        // Single accent (coral) — keeps the orangeValencia name for backwards
        // compatibility with existing templates and posts; values are the
        // redesign's coral ramp, with 600/DEFAULT = #e9805d.
        orangeValencia: {
          50: "#fdf2ee",
          100: "#fbe5db",
          200: "#f6c8b6",
          300: "#f1ab92",
          400: "#ee9678",
          500: "#ec8a6a",
          600: "#e9805d",
          700: "#c46743",
          800: "#8e4a30",
          900: "#4d281a",
          DEFAULT: "#e9805d",
        },
        accent: "#e9805d",

        // Terminal / status accents
        prompt: "#6dd09a",
        trafficRed: "#ff5f56",
        trafficYellow: "#ffbd2e",
        trafficGreen: "#27c93f",
      },
      fontFamily: {
        body: monoStack,
        heading: monoStack,
        mono: monoStack,
      },
      letterSpacing: {
        labelMono: "0.12em",
      },
      screens: {
        tab: "900px",
      },
      scale: {
        101: "1.01",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
