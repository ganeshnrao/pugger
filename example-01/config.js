const path = require("path");

module.exports = {
  name: "example-01",
  buildConcurrency: 10,
  paths: {
    src: path.resolve(__dirname),
    assets: path.resolve(__dirname, "assets"),
    templates: path.resolve(__dirname, "templates"),
    site: path.resolve(__dirname, "site.js"),
    dist: path.resolve(__dirname, "../dist"),
    distAssets: path.resolve(__dirname, "../dist/assets"),
    distStyles: path.resolve(__dirname, "../dist/styles")
  },
  styles: [path.resolve(__dirname, "styles", "main.scss")]
};
