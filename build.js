const pug = require("pug");
const path = require("path");
const fs = require("fs-extra");
const Promise = require("bluebird");
const sassRender = Promise.promisify(require("node-sass").render);
const replaceAll = require("replaceall");
const args = require("yargs").options({
  config: {
    type: "string",
    description: "Path to the config file",
    default: "config.js"
  }
}).argv;
const config = require(path.resolve(args.config));
const site = require(config.paths.site);

const srcDir = config.paths.src;
const templateDir = config.paths.templates;
const distDir = config.paths.dist;
const distStylesDir = config.paths.distStyles;
const distScriptsDir = config.paths.distScripts;
const indexFileName = "index";
const templateCacheMap = new Map();
const assetRegex = config.assetRegex || /\/assets\/[a-z0-9-_.&]+/gim;
const assetCacheMap = new Map();

async function getTemplate(templateName) {
  if (!templateCacheMap.has(templateName)) {
    const templateFilePath = path.resolve(`${templateDir}/${templateName}`);
    const templateString = await fs.readFile(templateFilePath);
    const template = pug.compile(templateString.toString(), {
      filename: templateFilePath
    });
    templateCacheMap.set(templateName, template);
  }
  return templateCacheMap.get(templateName);
}

async function processTasks({
  name = "",
  items = [],
  showAllErrors = true,
  processor = async () => {}
}) {
  const startMs = Date.now();
  let nSuccess = 0;
  const errors = [];
  const taskPrefix = `Task ${name.padStart(16)}`;
  await Promise.map(
    items,
    item =>
      processor(item)
        .then(() => {
          nSuccess += 1;
        })
        .catch(error => errors.push(error)),
    { concurrency: config.buildConcurrency || 10 }
  );
  console.log(
    [
      taskPrefix,
      `Success ${String(nSuccess).padStart(4)}`,
      `Errors ${String(errors.length).padStart(4)}`,
      `Duration ${String(Date.now() - startMs).padStart(6)}ms`
    ].join(" | ")
  );
  if (showAllErrors && errors.length) {
    errors.forEach(error =>
      console.error([taskPrefix, error.stack].join(" | "))
    );
  }
}

function getOutputPathsForPage(uri) {
  const destPath = path.resolve(`${distDir}/${uri}`);
  const { dir, name } = path.parse(destPath);
  const outputFileDir = name === indexFileName ? dir : path.resolve(dir, name);
  return {
    outputFilePath: path.resolve(outputFileDir, `${indexFileName}.html`),
    outputFileDir
  };
}

function sanitizeName(name, ext) {
  const cleanName = name
    .replace(/[^a-z0-9]/gi, " ")
    .trim()
    .split(/\s+/)
    .join("-");
  return `${cleanName}${ext}`.toLowerCase();
}

function scrapeContentForAssets(content) {
  let result = content;
  const assets = content.match(assetRegex) || [];
  assets.forEach(inputPath => {
    if (!assetCacheMap.has(inputPath)) {
      const { dir, name, ext } = path.parse(inputPath);
      const cleanName = sanitizeName(name, ext);
      const outputPath = path.resolve(dir, cleanName);
      assetCacheMap.set(inputPath, outputPath);
    }
    const outputPath = assetCacheMap.get(inputPath);
    result = replaceAll(inputPath, outputPath, result);
  });
  return result;
}

async function build() {
  await processTasks({
    name: "Compile pages",
    items: site.pages,
    async processor(page) {
      if (page.skipCompile) {
        return;
      }
      const template = await getTemplate(page.template);
      const { outputFilePath, outputFileDir } = getOutputPathsForPage(page.uri);
      const html = scrapeContentForAssets(template({ page, site }));
      await fs.ensureDir(outputFileDir);
      await fs.writeFile(outputFilePath, html);
    }
  });
  await processTasks({
    name: "Compile styles",
    items: config.styles,
    async processor(stylePath) {
      const { name } = path.parse(stylePath);
      const inputPath = stylePath;
      const outputPath = path.resolve(`${distStylesDir}/${name}.css`);
      const result = await sassRender({
        file: path.resolve(inputPath),
        outputStyle: "compressed"
      });
      const css = scrapeContentForAssets(result.css.toString());
      const { dir } = path.parse(outputPath);
      await fs.ensureDir(dir);
      await fs.writeFile(outputPath, css);
    }
  });
  await processTasks({
    name: "Compile scripts",
    items: config.scripts,
    async processor(scriptPath) {
      const { name } = path.parse(scriptPath);
      const outputPath = path.resolve(`${distScriptsDir}/${name}.js`);
      const { dir } = path.parse(outputPath);
      await fs.ensureDir(dir);
      await fs.copyFile(scriptPath, outputPath);
    }
  });
  await processTasks({
    name: "Copy assets",
    items: Array.from(assetCacheMap),
    async processor([inputPath, outputPath]) {
      const srcPath = path.resolve(`${srcDir}/${inputPath}`);
      const destPath = path.resolve(`${distDir}/${outputPath}`);
      const { dir } = path.parse(destPath);
      await fs.ensureDir(dir);
      await fs.copyFile(srcPath, destPath);
    }
  });
}

build().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
