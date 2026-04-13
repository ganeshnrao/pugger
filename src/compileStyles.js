const path = require('path')
const sass = require('sass')
const Config = require('./Config')
const { createTimer } = require('log-row')
const { logger, row, processTasks, writeFile } = require('./utils')

const prefix = 'styles'

module.exports = () => {
  const config = Config.get()
  return processTasks({
    prefix,
    items: config.styles,
    async processor(srcPath) {
      const duration = createTimer()
      const { name } = path.parse(srcPath)
      const destPath = path.resolve(`${config.paths.distStyles}/${name}.css`)
      const { css } = await sass.compileAsync(path.resolve(srcPath), { style: 'compressed' })
      logger.debug(
        row({
          prefix,
          srcPath: Config.relativeSrc(srcPath),
          destPath: Config.relativeDist(destPath),
          duration
        })
      )
      await writeFile(destPath, css.toString())
    }
  })
}
