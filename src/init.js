const path = require("path");
const ncp = require("ncp");

module.exports = siteName =>
  ncp(path.resolve(__dirname, "example"), path.resolve(__dirname, siteName));
