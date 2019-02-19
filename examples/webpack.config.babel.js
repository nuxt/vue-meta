import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import WebpackBar from 'webpackbar'
import VueLoaderPlugin from 'vue-loader/lib/plugin'

export default {
  devtool: 'inline-source-map',
  mode: 'development',
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.js')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = entry
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
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.vue$/, use: 'vue-loader' }
    ]
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js',
      'vue-meta': process.env.NODE_ENV === 'development' ? path.join(__dirname, '..', 'src') : 'vue-meta'
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
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}
