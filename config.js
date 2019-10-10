const path = require("path");

module.exports = {
  pageBuildConcurrency: 10,
  paths: {
    assets: path.resolve(__dirname, "src", "assets"),
    templates: path.resolve(__dirname, "src", "templates"),
    site: path.resolve(__dirname, "src", "site.js"),
    dist: path.resolve(__dirname, "dist")
  }
};
