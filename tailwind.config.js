module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        text: { DEFAULT: "#e3e2ec", dark: "#8b8288" },
        background: {
          DEFAULT: "#1d1b1d",
          light: "#242224",
          lighter: "#353335",
        },
        primary: { DEFAULT: "#8df684", dark: "#2d462a" },
        secondary: { DEFAULT: "#520b9d", dark: "#2d1643" },
        accent: { DEFAULT: "#f0289d", dark: "#9d1b67" },
      },
    },
  },
  plugins: [],
};

// TODO: change to dark mode

// DARK
//  'text': '#f3e2ec',
//  'background': '#1d1b1d',
//  'primary': '#8df684',
//  'secondary': '#520b9d',
//  'accent': '#f0289d',

// LIGHT
// colors: {
//  'text': '#1d0c16',
//  'background': '#e4e2e4',
//  'primary': '#1aa00e',
//  'secondary': '#a862f4',
//  'accent': '#e8118f',
// },
