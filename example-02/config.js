const path = require("path");

module.exports = {
  name: "and-he",
  buildConcurrency: 10,
  assetRegex: /\/media\/[a-z0-9-_\s.+=%$#@!`~]+/gim,
  paths: {
    site: path.resolve(__dirname, "site.js"),
    src: path.resolve(__dirname),
    assets: path.resolve(__dirname, "media"),
    templates: path.resolve(__dirname, "templates"),
    dist: path.resolve(__dirname, "dist"),
    distAssets: path.resolve(__dirname, "dist", "media"),
    distStyles: path.resolve(__dirname, "dist", "styles"),
    distScripts: path.resolve(__dirname, "dist", "scripts")
  },
  styles: [path.resolve(__dirname, "styles", "styles.scss")],
  scripts: [path.resolve(__dirname, "scripts", "app.js")]
};
