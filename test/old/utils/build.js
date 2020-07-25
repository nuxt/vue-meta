import path from 'path'
import fs from 'fs-extra'
import { template } from 'lodash'
import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/lib/plugin'
import { createRenderer } from 'vue-server-renderer'
import stdEnv from 'std-env'

const renderer = createRenderer()

export { default as getPort } from 'get-port'

export function _import(moduleName) {
  return import(moduleName).then(m => m.default || m)
}

export const useDist = stdEnv.test && stdEnv.ci

export function getVueMetaPath(browser) {
  if (useDist) {
    return path.resolve(
      __dirname,
      `../..${browser ? '/dist/vue-meta.min.js' : ''}`
    )
  }

  process.server = !browser
  return path.resolve(__dirname, '../../src')
}

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
  process.env.NODE_ENV = 'test'
  const webpackStats = await webpackRun(webpackConfig)

  // for test debugging
  webpackStats.errors.forEach(e => console.error(e)) // eslint-disable-line no-console
  webpackStats.warnings.forEach(e => console.warn(e)) // eslint-disable-line no-console

  const createApp = await _import(path.resolve(fixturePath, 'server'))
  const vueApp = await createApp()

  const templateFile = await fs.readFile(
    path.resolve(fixturePath, '..', 'app.template.html'),
    { encoding: 'utf8' }
  )
  const compiled = template(templateFile, { interpolate: /{{([\s\S]+?)}}/g })

  const assets = webpackStats.assets.filter(
    asset => !asset.name.includes('load-test')
  )

  const headAssets = assets
    .filter(asset => asset.name.includes('chunk'))
    .reduce((s, asset) => `${s}<script src="./${asset.name}"></script>\n`, '')

  const bodyAssets = assets
    .filter(asset => !asset.name.includes('chunk'))
    .reduce((s, asset) => `${s}<script src="./${asset.name}"></script>\n`, '')

  const app = await renderer.renderToString(vueApp)

  const metaInfo = vueApp.$meta().inject()

  const appFile = path.resolve(webpackStats.outputPath, 'index.html')
  const html = compiled({ app, headAssets, bodyAssets, ...metaInfo })

  await fs.writeFile(appFile, html)

  return {
    url: `file://${appFile}`,
    appFile,
    webpackStats,
    html,
    metaInfo,
  }
}

export function createWebpackConfig(config = {}) {
  const publicPath = '.vue-meta'

  return {
    mode: 'development',
    devtool: 'none',
    output: {
      path: path.join(path.dirname(config.entry), publicPath),
      filename: '[name].js',
      chunkFilename: '[id].chunk.js',
      publicPath: `/${publicPath}/`,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|dist)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: 'core-js@3',
                    targets: { ie: 9, safari: '5.1' },
                  },
                ],
              ],
            },
          },
        },
        { test: /\.vue$/, use: 'vue-loader' },
      ],
    },
    // Expose __dirname to allow automatically setting basename.
    context: __dirname,
    node: {
      __dirname: true,
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          // make sure our simple polyfills are enabled
          NODE_ENV: '"test"',
        },
      }),
      new CopyWebpackPlugin([
        { from: path.join(path.dirname(config.entry), 'static') },
      ]),
    ],
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm.js',
        'vue-meta': getVueMetaPath(true),
      },
    },
    ...config,
  }
}
