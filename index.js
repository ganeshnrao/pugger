const yargs = require("yargs");
const build = require("./src/build");
const { logger } = require("./src/utils");

if (require.main === module) {
  const { config, debug } = yargs.options({
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
  logger.toggleDebug(debug);
  build(config).catch(error => {
    logger.error(error.stack);
    process.exit(1);
  });
}

module.exports = build;
