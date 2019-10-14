const path = require("path");

const src = path.resolve(__dirname);
const dist = path.resolve(__dirname, "..", "dist");

module.exports = {
  paths: {
    src,
    assets: path.resolve(src, "assets"),
    templates: path.resolve(src, "templates"),
    dist,
    distStyles: path.resolve(dist, "styles"),
    distScripts: path.resolve(dist, "scripts")
  },
  site: require("./site"),
  styles: [path.resolve(src, "styles", "main.scss")],
  scripts: [path.resolve(src, "scripts", "app.js")]
};
