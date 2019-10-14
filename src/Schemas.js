const { getValidator } = require("./utils");

const uri = { type: "string", format: "uri-reference" };

module.exports = {
  config: getValidator("config", {
    type: "object",
    required: ["paths", "site"],
    properties: {
      paths: {
        type: "object",
        required: [
          "src",
          "templates",
          "dist",
          "distStyles",
          "distScripts"
        ],
        properties: {
          src: uri,
          templates: uri,
          dist: uri,
          distStyles: uri,
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
