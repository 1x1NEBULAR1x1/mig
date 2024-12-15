const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: "./global.css", // Ensure CSS is properly handled
  server: {
    headers: {
      "Content-Type": "application/javascript", // Ensure proper MIME type for web builds
    },
  },
});
