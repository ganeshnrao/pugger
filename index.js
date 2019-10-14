const yargs = require("yargs");
const build = require("./src/build");
const initSite = require("./src/init");
const { logger } = require("./src/utils");

if (require.main === module) {
  const { init, config, debug } = yargs.options({
    init: {
      type: "string",
      default: "",
      description: "Name of site to generate"
    },
    config: {
      type: "string",
      description: "Path to the config file",
      default: "pugger.config.js"
    },
    debug: {
      type: "boolean",
      description: "Set to show all debug messages",
      default: false
    }
  }).argv;
  if (init) {
    return initSite(init);
  }
  logger.toggleDebug(debug);
  build(config).catch(error => {
    logger.error(error.stack);
    process.exit(1);
  });
}

module.exports = build;
