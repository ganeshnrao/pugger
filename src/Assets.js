const path = require("path");
const replaceAll = require("replaceall");
const Config = require("./Config");

const assetCacheMap = new Map();

function sanitizeName(name, ext) {
  const cleanName = name
    .replace(/[^a-z0-9]/gi, " ")
    .trim()
    .split(/\s+/)
    .join("-");
  return `${cleanName}${ext}`.toLowerCase();
}

function transform(content) {
  const config = Config.get();
  let result = content;
  let nAssets = 0;
  const assets = content.match(config.assetRegex) || [];
  assets.forEach(matched => {
    if (!assetCacheMap.has(matched)) {
      const matchPath = path.resolve(matched);
      const { dir, name, ext } = path.parse(matchPath);
      const cleanName = sanitizeName(name, ext);
      const cleanSrcPath = path.resolve(dir, cleanName);
      const srcPath = path.resolve(`${config.paths.src}/${matched}`);
      const destPath = path.resolve(`${config.paths.dist}/${cleanSrcPath}`);
      assetCacheMap.set(matched, { matched, cleanSrcPath, srcPath, destPath });
      nAssets += 1;
    }
    const { cleanSrcPath } = assetCacheMap.get(matched);
    result = replaceAll(matched, cleanSrcPath, result);
  });
  return { result, nAssets };
}

function getAll() {
  return Array.from(assetCacheMap.values());
}

module.exports = {
  transform,
  getAll
};
