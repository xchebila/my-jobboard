const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.js*", // Inclut les fichiers JavaScript de Next UI
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};