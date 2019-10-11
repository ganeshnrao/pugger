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
const assetRegex = config.assetRegex || /\/assets\/[a-z0-9-_.]+/gim;
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

async function processTasks({
  name = "",
  items = [],
  showAllErrors = false,
  processor = async () => {}
}) {
  let nSuccess = 0;
  let nErrors = 0;
  await Promise.map(
    items,
    item =>
      processor(item)
        .then(() => {
          nSuccess += 1;
        })
        .catch(error => {
          nErrors += 1;
          if (showAllErrors) {
            console.error(error.stack);
          }
        }),
    { concurrency: config.buildConcurrency || 10 }
  );
  console.log(
    [
      `Task ${name.padStart(16)}`,
      `Success ${String(nSuccess).padStart(4)}`,
      `Errors ${String(nErrors).padStart(4)}`
    ].join(" | ")
  );
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

async function build() {
  await processTasks({
    name: "Compile pages",
    items: site.pages,
    async processor(page) {
      const template = await getTemplate(page.template);
      const { outputFilePath, outputFileDir } = getOutputPathsForPage(page.uri);
      const html = template({ page, site });
      scrapeContentForAssets(html);
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
      const outputPath = path.resolve(config.paths.distStyles, `${name}.css`);
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
  });
  await processTasks({
    name: "Copy assets",
    items: Array.from(assetCacheSet),
    async processor(assetSrc) {
      const srcFilePath = path.resolve(`${srcDir}/${assetSrc}`);
      const destFilePath = path.resolve(`${distDir}/${assetSrc}`);
      const { dir } = path.parse(destFilePath);
      await fs.ensureDir(dir);
      await fs.copyFile(srcFilePath, destFilePath);
    }
  });
}

build().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
