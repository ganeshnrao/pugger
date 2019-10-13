const path = require("path");
const Config = require("./Config");
const { createTimer } = require("log-row");
const { row, logger, processTasks, copyFile } = require("./utils");

const prefix = "scripts";

module.exports = () => {
  const config = Config.get();
  return processTasks({
    prefix,
    items: config.scripts,
    async processor(srcPath) {
      const duration = createTimer();
      const { name } = path.parse(srcPath);
      const destPath = path.resolve(`${config.paths.distScripts}/${name}.js`);
      await copyFile(srcPath, destPath);
      logger.debug(
        row({
          prefix,
          srcPath: Config.relativeSrc(srcPath),
          destPath: Config.relativeDist(destPath),
          duration
        })
      );
    }
  });
};
