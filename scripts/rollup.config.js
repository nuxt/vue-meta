import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import buble from 'rollup-plugin-buble'
import { terser } from 'rollup-plugin-terser'

const pkg = require('../package.json')

const banner =  `/**
 * vue-meta v${pkg.version}
 * (c) ${new Date().getFullYear()} Declan de Wet & Sébastien Chopin (@Atinux)
 * @license MIT
 */
`.replace(/ {4}/gm, '').trim()

const baseConfig = {
  input: 'src/browser.js',
  output: {
    file: pkg.web,
    format: 'umd',
    name: 'VueMeta',
    sourcemap: false,
    banner
  },
  plugins: [
    json(),
    nodeResolve(),
    commonjs(),
    /*buble({
      objectAssign: 'Object.assign'
    }),*/
  ]
}

export default [{
  ...baseConfig,
}, {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    file: pkg.web.replace('.js', '.min.js'),
  },
  plugins: [
    ...baseConfig.plugins,
    babel({
      runtimeHelpers: true,
      presets: ['@nuxt/babel-preset-app']
    }),
    terser()
  ]
}, {
  ...baseConfig,
  input: 'src/index.js',
  output: {
    ...baseConfig.output,
    file: pkg.main,
    format: 'cjs'
  },
  external: Object.keys(pkg.dependencies)
}]
