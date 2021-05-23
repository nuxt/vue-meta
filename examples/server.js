const fs = require('fs')
const path = require('path')
const consola = require('consola')
const express = require('express')
const rewrite = require('express-urlrewrite')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config')
const jiti = require('./jiti')

const { renderPage } = jiti('./ssr/server.js')

const app = express()

app.use(
  webpackDevMiddleware(webpack(webpackConfig(true)), {
    publicPath: '/__build__/',
    writeToDisk: true,
    stats: {
      colors: true,
      chunks: false
    }
  })
)

fs.readdirSync(__dirname)
  .filter(file => file[0] !== '_' && file !== 'ssr')
  .forEach((file) => {
    if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
      app.use(rewrite(`/${file}/*`, `/${file}/index.html`))
    }
  })

app.use(express.static(path.join(__dirname, '_static')))
app.use(express.static(__dirname))
app.use('/_static/dist', express.static(path.join(__dirname, '../dist')))

app.use((req, res, next) => {
  // Return empty css/javascript files if the file didnt exists
  // statically. This means we can test/load any js file in
  // the examples without errors in the browser
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript')
    res.send('/* empty */')
  } else if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css')
    res.send('/* empty */')
  } else {
    next()
  }
})

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
