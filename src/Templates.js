const fs = require("fs-extra");
const pug = require("pug");

const templateCacheMap = new Map();

async function load(templatePath, compilerOptions) {
  if (!templateCacheMap.has(templatePath)) {
    const templateString = (await fs.readFile(templatePath)).toString();
    const template = pug.compile(templateString, {
      filename: templatePath,
      ...compilerOptions
    });
    templateCacheMap.set(templatePath, template);
  }
  return templateCacheMap.get(templatePath);
}

module.exports = {
  load
};
