import fs from 'fs'
import path from 'path'
import consola from 'consola'
import express from 'express'
import rewrite from 'express-urlrewrite'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import WebpackConfig from './webpack.config.babel'

const app = express()

app.use(webpackDevMiddleware(webpack(WebpackConfig), {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

fs.readdirSync(__dirname)
  .filter(file => file !== 'ssr')
  .forEach((file) => {
    if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
      app.use(rewrite('/' + file + '/*', '/' + file + '/index.html'))
    }
  })

app.use(express.static(__dirname))

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

module.exports = app.listen(port, host, () => {
  consola.info(`Server listening on http://${host}:${port}, Ctrl+C to stop`)
})
