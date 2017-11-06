import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import buble from 'rollup-plugin-buble'

const pkg = require('./package.json')

export default {
  entry: './src/index.js',
  targets: [
    { dest: pkg.main, format: 'umd', moduleName: 'VueMeta' }
  ],
  plugins: [
    json(),
    nodeResolve({ jsnext: true }),
    commonjs(),
    buble()
  ],
  banner: `
    /**
     * vue-meta v${pkg.version}
     * (c) ${new Date().getFullYear()} Declan de Wet & Atinux
     * @license MIT
     */
  `.replace(/ {4}/gm, '').trim()
}
