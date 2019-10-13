const Promise = require("bluebird");
const fs = require("fs-extra");
const path = require("path");
const { logRow } = require("log-row");
const Ajv = require("ajv");

const ajv = new Ajv({
  coerceTypes: "array",
  useDefaults: true,
  $data: true
});

const logger = { ...console };
logger.toggleDebug = enable => {
  if (enable) {
    logger.debug = console.debug;
  } else {
    logger.debug = () => {};
  }
};

const row = logRow({
  columns: [
    { key: "prefix", label: null, width: 7, align: "left" },
    { key: "srcPath", label: "src", width: 40, align: "left" },
    { key: "destPath", label: "dest", width: 40, align: "left" },
    {
      key(obj) {
        return `${obj.duration || 0}ms`;
      },
      label: null,
      width: 6
    },
    { key: "error.stack", label: null }
  ]
});

async function processTasks({
  prefix = "",
  items = [],
  showAllErrors = true,
  concurrency = 10,
  processor = async () => {}
}) {
  let success = 0;
  const errors = [];
  await Promise.map(
    items,
    (...inputs) =>
      processor(...inputs)
        .then(() => {
          success += 1;
        })
        .catch(error => errors.push(error)),
    { concurrency }
  );
  if (showAllErrors && errors.length) {
    errors.forEach(error => logger.error(row({ prefix, error })));
  }
  return { success, errors: errors.length };
}

function getValidator(dataVar = "data", schema) {
  const validate = ajv.compile(schema);
  return obj => {
    const isValid = validate(obj);
    if (!isValid) {
      throw new Error(
        `Invalid configs. ${ajv.errorsText(validate.errors, {
          dataVar
        })}`
      );
    }
  };
}

async function writeFile(fileFullPath, content) {
  const { dir } = path.parse(fileFullPath);
  await fs.ensureDir(dir);
  return fs.writeFile(fileFullPath, String(content));
}

async function copyFile(srcPath, destPath) {
  const { dir } = path.parse(destPath);
  await fs.ensureDir(dir);
  await fs.copyFile(srcPath, destPath);
}

module.exports = {
  Promise,
  logger,
  row,
  ajv,
  processTasks,
  getValidator,
  writeFile,
  copyFile
};
