const path = require("path");

module.exports = {
  buildConcurrency: 10,
  paths: {
    assets: path.resolve(__dirname, "src", "assets"),
    templates: path.resolve(__dirname, "src", "templates"),
    site: path.resolve(__dirname, "src", "site.js"),
    dist: path.resolve(__dirname, "dist"),
    distAssets: path.resolve(__dirname, "dist", "assets"),
    distStyles: path.resolve(__dirname, "dist", "styles")
  },
  styles: [path.resolve(__dirname, "src", "styles", "main.scss")]
};
