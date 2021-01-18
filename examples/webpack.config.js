import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import WebpackBar from 'webpackbar'
import { VueLoaderPlugin } from 'vue-loader'

// const srcDir = path.join(__dirname, '..', 'src')

export default {
  devtool: 'source-map',
  mode: 'development',
  entry: fs.readdirSync(__dirname)
    .reduce((entries, dir) => {
      const fullDir = path.join(__dirname, dir)

      if (dir === 'ssr') {
        entries[dir] = path.join(fullDir, 'browser.js')
      } else if (dir === 'vue-router') {
        const entry = path.join(fullDir, 'app.js')
        if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
          entries[dir] = entry
        }
      }
      return entries
    }, {}),
  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: '3',
                targets: { ie: 9, safari: '5.1' }
              }]
            ]
          }
        }
      },
      {
        resourceQuery: /blockType=head/,
        loader: require.resolve('./meta-loader.js')
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      // this isn't technically needed, since the default `vue` entry for bundlers
      // is a simple `export * from '@vue/runtime-dom`. However having this
      // extra re-export somehow causes webpack to always invalidate the module
      // on the first HMR update and causes the page to reload.
      vue: 'vue/dist/vue.esm-bundler.js',
      'vue-meta': path.resolve(__dirname, '../src/')
    }
  },
  // Expose __dirname to allow automatically setting basename.
  context: __dirname,
  node: {
    __dirname: true
  },
  plugins: [
    new WebpackBar(),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      __DEV__: process.env.NODE_ENV !== 'production'
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
    })
  ],
  devServer: {
    inline: true,
    hot: true,
    stats: 'minimal',
    contentBase: __dirname,
    overlay: true
  }
}
