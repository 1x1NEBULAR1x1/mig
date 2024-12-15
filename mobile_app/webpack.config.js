const withWebConfig = require("expo/webpack-config");

module.exports = withWebConfig({
  webpack: function (config, { isServer }) {
    if (!isServer) {
      config.output.globalObject = "window";
      config.module.rules.push({
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      });
    }
    return config;
  },
});