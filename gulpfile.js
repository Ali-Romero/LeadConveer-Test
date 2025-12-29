const { series, parallel } = require('gulp')

const clean = require('./tasks/clean')
const logger = require('./tasks/logger')
const server = require('./tasks/server')
const stylus = require('./tasks/stylus')
const stylusWatch = require('./tasks/stylusWatch')
const pug = require('./tasks/pug')
const pugWatch = require('./tasks/pugWatch')
const images = require('./tasks/images')
const imagesWatch = require('./tasks/imagesWatch')
const assets = require('./tasks/assets')
const assetsWatch = require('./tasks/assetsWatch')
const js = require('./tasks/js')
const jsWatch = require('./tasks/jsWatch')

const ghPages = require('gh-pages')

/* ===============================
   GH-PAGES DEPLOY
================================ */

function deployGhPages(cb) {
  ghPages.publish(
    'dest',
    {
      branch: 'gh-pages',
      message: 'Deploy to gh-pages',
    },
    cb
  )
}

/* ===============================
   BUILD TASKS
================================ */

const build = series(
  clean,
  parallel(stylus, pug, images, assets, js)
)

/* ===============================
   WATCH / DEV
================================ */

const watch = parallel(
  stylusWatch,
  pugWatch,
  imagesWatch,
  assetsWatch,
  jsWatch
)

const dev = series(
  build,
  watch,
  logger,
  server
)

/* ===============================
   DEPLOY
================================ */

const deploy = series(
  build,
  deployGhPages
)

/* ===============================
   EXPORTS
================================ */

exports.clean = clean
exports.build = build
exports.dev = dev
exports.deploy = deploy

exports.default =
  process.env.NODE_ENV === 'development'
    ? dev
    : build
