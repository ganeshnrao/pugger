const Assets = require("./Assets");
const Config = require("./Config");
const { createTimer } = require("log-row");
const { processTasks, copyFile, logger, row } = require("./utils");

const prefix = "assets";

module.exports = () =>
  processTasks({
    prefix,
    items: Assets.getAll(),
    async processor({ srcPath, destPath }) {
      const duration = createTimer();
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
