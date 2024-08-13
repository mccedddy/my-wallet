module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customWhite: {
          DEFAULT: "#fafbff",
          dark: "#f5f8fd",
          darker: "#dde8f9",
        },
        customBlack: {
          DEFAULT: "#1e355b",
          light: "#4c5f7e",
          lighter: "#5d6e89",
        },

        customBlue: "#0b60d4",
      },
    },
  },
  plugins: [],
};

// TODO: change to dark mode
