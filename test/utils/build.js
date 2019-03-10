import fs from 'fs-extra'
import path from 'path'
import { template } from 'lodash'
import webpack from 'webpack'
import VueLoaderPlugin from 'vue-loader/lib/plugin'
import { createRenderer } from 'vue-server-renderer'

const renderer = createRenderer()

export function webpackRun(config) {
  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err)
      }

      resolve(stats.toJson())
    })
  })
}

export async function buildFixture(fixture, config = {}) {
  if (!fixture) {
    throw new Error('buildFixture should be called with a fixture name')
  }

  const fixturePath = path.resolve(__dirname, '..', 'fixtures', fixture)
  config.entry = path.resolve(fixturePath, 'client.js')

  if (!config.name) {
    config.name = path.basename(path.dirname(config.entry))
  }

  const webpackConfig = createWebpackConfig(config)
  // remove old files
  await fs.remove(webpackConfig.output.path)

  // run webpack
  const webpackStats = await webpackRun(webpackConfig)

  // for test debugging
  webpackStats.errors.forEach(e => console.error(e)) // eslint-disable-line no-console
  webpackStats.warnings.forEach(e => console.warn(e)) // eslint-disable-line no-console

  const vueApp = await import(path.resolve(fixturePath, 'server')).then(m => m.default || m)

  const templateFile = await fs.readFile(path.resolve(fixturePath, '..', 'app.template.html'), { encoding: 'utf8' })
  const compiled = template(templateFile, { interpolate: /{{([\s\S]+?)}}/g })

  const webpackAssets = webpackStats.assets.reduce((s, asset) => `${s}<script src="./${asset.name}"${asset.name.includes('chunk') ? '' : ' defer'}></script>\n`, '')
  const app = await renderer.renderToString(vueApp)
  // !!! run inject after renderToString !!!
  const metaInfo = vueApp.$meta().inject()

  const appFile = path.resolve(webpackStats.outputPath, 'index.html')
  const html = compiled({ app, webpackAssets, ...metaInfo })

  await fs.writeFile(appFile, html)

  return {
    url: `file://${appFile}`,
    appFile,
    webpackStats,
    html,
    metaInfo
  }
}

export function createWebpackConfig(config = {}) {
  const publicPath = '.vue-meta'

  return {
    mode: 'development',
    output: {
      path: path.join(path.dirname(config.entry), publicPath),
      filename: '[name].js',
      chunkFilename: '[id].chunk.js',
      publicPath: `/${publicPath}/`
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
        { test: /\.vue$/, use: 'vue-loader' }
      ]
    },
    // Expose __dirname to allow automatically setting basename.
    context: __dirname,
    node: {
      __dirname: true
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      }
    },
    plugins: [
      new VueLoaderPlugin()
    ],
    resolve: {
      alias: {
        'vue': 'vue/dist/vue.esm.js'
      }
    },
    ...config
  }
}
