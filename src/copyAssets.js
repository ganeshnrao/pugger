const path = require("path");
const fs = require("fs-extra");
const { Promise, logger } = require("./utils");
const ncp = Promise.promisify(require("ncp").ncp);
const Config = require("./Config");

module.exports = async () => {
  const { paths } = Config.get();
  await fs.ensureDir(paths.dist);
  const assetsRelativePath = path.relative(paths.src, paths.assets);
  await ncp(paths.assets, path.resolve(paths.dist, assetsRelativePath));
  logger.log(`Copied ${assetsRelativePath}`);
  return { success: 1, errors: 0 };
};
