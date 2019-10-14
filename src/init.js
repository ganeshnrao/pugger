const path = require("path");
const { ncp, Promise, logger, sanitizeName } = require("./utils");
const childProcess = require("child_process");

function exec(cmd, options) {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, options, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
}

module.exports = async siteName => {
  const cleanSiteName = sanitizeName(siteName);
  logger.log("Pugger");
  logger.log(`* Initializing ${cleanSiteName}`);
  const cwd = process.cwd();
  const src = path.resolve(__dirname, "..", "example");
  const dest = path.resolve(cwd, cleanSiteName);
  await ncp(src, dest);
  process.chdir(dest);
  logger.log(`* Installing dependencies`);
  await exec("npm install", { cwd: dest }).catch(error => {
    logger.error(
      error,
      `* Failed to install dependencies, please install using "npm install"`
    );
  });
  logger.log(
    `* Pugger site initialized. Use "cd ${cleanSiteName}" to get started.`
  );
};
