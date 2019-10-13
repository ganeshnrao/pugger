const { getValidator } = require("./utils");

const uri = { type: "string", format: "uri-reference" };

module.exports = {
  config: getValidator("config", {
    type: "object",
    required: ["paths", "site"],
    properties: {
      buildConcurrency: { type: "number", default: 10 },
      assetRegex: {
        type: "object",
        required: ["pattern", "flags"],
        properties: {
          pattern: {
            type: "string",
            format: "regex",
            default: "\\/assets\\/[a-z0-9-_.\\s]+"
          },
          flags: {
            type: "string",
            default: "igm"
          }
        }
      },
      paths: {
        type: "object",
        required: [
          "src",
          "templates",
          "dist",
          "distStyles",
          "distAssets",
          "distScripts"
        ],
        properties: {
          src: uri,
          templates: uri,
          dist: uri,
          distStyles: uri,
          distAssets: uri,
          distScripts: uri
        }
      },
      styles: {
        type: "array",
        default: [],
        items: uri
      },
      scripts: {
        type: "array",
        default: [],
        items: uri
      },
      site: {
        type: "object",
        required: ["pages"],
        properties: {
          meta: { type: "object" },
          pages: { type: "array", minItems: 1 }
        }
      }
    }
  })
};
