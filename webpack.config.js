const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// https://github.com/jantimon/html-webpack-plugin/issues/1372
const HtmlIncludeChunksWebpackPlugin = require('@wishy-gift/html-include-chunks-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

const r = (...paths) => path.resolve(__dirname, 'examples', ...paths)

/** @type {import('webpack').ConfigurationFactory} */
const config = (env = {}) => {
  const extraPlugins = env.prod ? [new BundleAnalyzerPlugin()] : []

  return {
    mode: env.prod ? 'production' : 'development',
    devtool: env.prod ? 'source-map' : 'inline-source-map',

    devServer: {
      contentBase: r(),
      historyApiFallback: true,
      hot: true,
      stats: 'minimal',
    },

    output: {
      path: r('/__build__/'),
      publicPath: '/__build__/',
      filename: '[name].js',
    },

    entry: fs.readdirSync(r())
      .reduce((entries, entryPath) => {
        if (entryPath !== 'vue-router') {
          return entries
        }

        if (entryPath === 'ssr') {
          entries[entryPath] = r(entryPath, 'browser.js')
        } else {
          const entry = r(entryPath, 'app.js')
          if (fs.existsSync(entry)) {
            entries[entryPath] = entry
          }
        }

        extraPlugins.push(
          new HtmlWebpackPlugin({
            entryKey: entryPath,
            filename: r(entryPath, 'index.html')
          })
        )

        return entries
      }, {}),
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
        },
        {
          test: /\.vue$/,
          use: 'vue-loader',
        },
      ],
    },
    resolve: {
      alias: {
        // this isn't technically needed, since the default `vue` entry for bundlers
        // is a simple `export * from '@vue/runtime-dom`. However having this
        // extra re-export somehow causes webpack to always invalidate the module
        // on the first HMR update and causes the page to reload.
        vue: '@vue/runtime-dom',
        vue: 'vue/dist/vue.esm-bundler.js',
      },
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', 'd.ts', '.tsx', '.js', '.vue'],
    },
    plugins: [
      new VueLoaderPlugin(),
      /*new HtmlWebpackPlugin({
        template: r(__dirname, 'examples/index.html'),
      }),*/
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!env.prod),
        __BROWSER__: 'true',
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      ...extraPlugins,
    ],
  }
}

module.exports = config
