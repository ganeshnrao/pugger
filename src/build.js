const Config = require("./Config");
const compilePages = require("./compilePages");
const compileStyles = require("./compileStyles");
const compileScripts = require("./compileScripts");
const compileAssets = require("./compileAssets");
const { createTimer } = require("log-row");
const { Promise, logger } = require("./utils");

module.exports = async config => {
  Config.init(config);
  const duration = createTimer();
  const result = await Promise.props({
    page: compilePages(),
    style: compileStyles(),
    script: compileScripts()
  });
  const asset = await compileAssets();
  const results = { ...result, asset };
  logger.log("");
  Object.keys(results).forEach(key => {
    const { success, errors } = results[key];
    const errorMessage = errors ? `, ${errors} error(s) occurred.` : "";
    logger.log(`Processed ${success} ${key}(s) ${errorMessage}`);
  });
  logger.log(`Built in ${duration}ms`);
};