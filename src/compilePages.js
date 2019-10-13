const path = require("path");
const Config = require("./Config");
const Templates = require("./Templates");
const { createTimer } = require("log-row");
const { row, logger, processTasks, writeFile } = require("./utils");

const prefix = "pages";
const indexFileName = "index";

function getPageDestPath(distDir, pageUri) {
  const { dir, name } = path.parse(path.resolve(`${distDir}/${pageUri}`));
  const destDir = name === indexFileName ? dir : path.resolve(dir, name);
  return path.resolve(`${destDir}/${indexFileName}.html`);
}

module.exports = () => {
  const config = Config.get();
  return processTasks({
    prefix,
    items: config.site.pages,
    async processor(page) {
      const duration = createTimer();
      const templatePath = path.resolve(
        `${config.paths.templates}/${page.template}`
      );
      const destPath = getPageDestPath(config.paths.dist, page.uri);
      const template = await Templates.load(templatePath);
      const html = template({ page, site: config.site });
      await writeFile(destPath, html);
      const srcPath = `${page.id || page.uri} (${page.template})`;
      logger.debug(
        row({
          prefix,
          srcPath,
          destPath: Config.relativeDist(destPath),
          duration
        })
      );
    }
  });
};
