import fs from 'fs'
import path from 'path'
import consola from 'consola'
import express from 'express'
import rewrite from 'express-urlrewrite'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import WebpackConfig from './webpack.config'
import { renderPage } from './ssr/server'

const app = express()

app.use(webpackDevMiddleware(webpack(WebpackConfig), {
  publicPath: '/__build__/',
  writeToDisk: true,
  stats: {
    colors: true,
    chunks: false
  }
}))

fs.readdirSync(__dirname)
  .filter(file => file !== 'ssr')
  .forEach((file) => {
    if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
      app.use(rewrite(`/${file}/*`, `/${file}/index.html`))
    }
  })

app.use(express.static(path.join(__dirname, '_static')))
app.use(express.static(__dirname))

app.use(async (req, res, next) => {
  if (!req.url.startsWith('/ssr')) {
    return next()
  }

  try {
    const context = { url: req.url }
    const html = await renderPage(context)
    res.send(html)
  } catch (e) {
    consola.error('SSR Oops:', e)
    next()
  }
})

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

module.exports = app.listen(port, host, () => {
  consola.info(`Server listening on http://${host}:${port}, Ctrl+C to stop`)
})
