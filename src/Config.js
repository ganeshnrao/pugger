const path = require("path");
const Schemas = require("./Schemas");

let config;

function init(input) {
  if (!config) {
    config = typeof input === "string" ? require(path.resolve(input)) : input;
    Schemas.config(config);
  }
  config.assetRegex = config.assetRegex
    ? new RegExp(config.assetRegex.pattern, config.assetRegex.flags)
    : /\/assets\/[a-z0-9-_.\s]+/gim;
}

function get() {
  return config;
}

function relativeSrc(srcPath) {
  return path.relative(config.paths.src, srcPath);
}

function relativeDist(distPath) {
  return path.relative(config.paths.dist, distPath);
}

module.exports = {
  init,
  get,
  relativeSrc,
  relativeDist
};
