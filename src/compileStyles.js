const path = require("path");
const Config = require("./Config");
const { createTimer } = require("log-row");
const { Promise, logger, row, processTasks, writeFile } = require("./utils");
const sassRender = Promise.promisify(require("node-sass").render);

const prefix = "styles";

module.exports = () => {
  const config = Config.get();
  return processTasks({
    prefix,
    items: config.styles,
    async processor(srcPath) {
      const duration = createTimer();
      const { name } = path.parse(srcPath);
      const destPath = path.resolve(`${config.paths.distStyles}/${name}.css`);
      const { css } = await sassRender({
        file: path.resolve(srcPath),
        outputStyle: "compressed"
      });
      logger.debug(
        row({
          prefix,
          srcPath: Config.relativeSrc(srcPath),
          destPath: Config.relativeDist(destPath),
          duration
        })
      );
      await writeFile(destPath, css.toString());
    }
  });
};
