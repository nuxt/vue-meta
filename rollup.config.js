import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import buble from 'rollup-plugin-buble'

const pkg = require('./package.json')

export default {
  input: './src/index.js',
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'VueMeta',
    banner: `/**
 * vue-meta v${pkg.version}
 * (c) ${new Date().getFullYear()} Declan de Wet & Sébastien Chopin (@Atinux)
 * @license MIT
 */
`.replace(/ {4}/gm, '').trim()
  },
  plugins: [
    json(),
    nodeResolve({ jsnext: true }),
    commonjs(),
    buble()
  ]
}
