const pug = require("pug");
const path = require("path");
const fs = require("fs-extra");
const Promise = require("bluebird");
const sassRender = Promise.promisify(require("node-sass").render);
const args = require("yargs").options({
  config: {
    type: "string",
    description: "Path to the config file",
    default: "config.js"
  }
}).argv;
const config = require(path.resolve(__dirname, args.config));
const site = require(config.paths.site);

const srcDir = config.paths.src;
const templateDir = config.paths.templates;
const distDir = config.paths.dist;
const indexFileName = "index";
const templateCacheMap = new Map();
const assetRegex = /\/assets\/[a-z0-9-_.]+/gim;
const assetCacheSet = new Set();

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

async function tryCatch(name, fn) {
  try {
    await fn();
    console.log(name);
  } catch (error) {
    console.error(`${name} Failed`, error.stack);
  }
}

function label(name, width = 5) {
  return `${config.name || ""} | ${name.padEnd(width)}`;
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

function scrapeContentForAssets(content) {
  const assets = content.match(assetRegex) || [];
  assets.forEach(src => assetCacheSet.add(src));
}

async function copyAssets() {
  const assets = Array.from(assetCacheSet);
  await Promise.map(assets, async assetSrc =>
    tryCatch(`${label("asset")} | ${assetSrc}`, async () => {
      const srcFilePath = path.resolve(`${srcDir}/${assetSrc}`);
      const destFilePath = path.resolve(`${distDir}/${assetSrc}`);
      const { dir } = path.parse(destFilePath);
      await fs.ensureDir(dir);
      await fs.copyFile(srcFilePath, destFilePath);
    })
  );
}

async function buildStyles(inputPath, outputPath) {
  const result = await sassRender({
    file: path.resolve(inputPath),
    outputStyle: "compressed"
  });
  const css = result.css.toString();
  const { dir } = path.parse(outputPath);
  await fs.ensureDir(dir);
  await fs.writeFile(outputPath, css);
  scrapeContentForAssets(css);
}

async function build() {
  await Promise.map(
    site.pages,
    async page =>
      tryCatch(`${label("page")} | ${page.uri}`, async () => {
        const template = await getTemplate(page.template);
        const { outputFilePath, outputFileDir } = getOutputPathsForPage(
          page.uri
        );
        const html = template({ page, site });
        scrapeContentForAssets(html);
        await fs.ensureDir(outputFileDir);
        await fs.writeFile(outputFilePath, html);
      }),
    { concurrency: config.buildConcurrency }
  );
  await Promise.map(
    config.styles,
    async stylePath =>
      tryCatch(`${label("style")} | ${stylePath}`, async () => {
        const { name } = path.parse(stylePath);
        await buildStyles(
          stylePath,
          path.resolve(config.paths.distStyles, `${name}.css`)
        );
      }),
    { concurrency: config.buildConcurrency }
  );
  await copyAssets();
}

build().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
