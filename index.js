#!/usr/bin/env node

const yargs = require("yargs");
const build = require("./src/build");
const initSite = require("./src/init");
const { logger } = require("./src/utils");

if (require.main === module) {
  const { init, config, debug } = yargs.options({
    init: {
      type: "string",
      default: "",
      description:
        "Name of site to generate, no spaces alphanumeric with dashes, e.g. give-me-pugger"
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
  logger.toggleDebug(debug);
  const action = init ? initSite(init) : build(config);
  action.catch(error => {
    logger.error(error.stack);
    process.exit(1);
  });
}

module.exports = build;
