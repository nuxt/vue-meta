import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import defaultsDeep from 'lodash/defaultsDeep'

const pkg = require('../package.json')

const banner =  `/**
 * vue-meta v${pkg.version}
 * (c) ${new Date().getFullYear()} Declan de Wet & Sébastien Chopin (@Atinux)
 * @license MIT
 */
`.replace(/ {4}/gm, '').trim()

function rollupConfig({
  plugins = [],
  ...config
  }) {

  return defaultsDeep({}, config, {
    input: 'src/browser.js',
    output: {
      name: 'VueMeta',
      format: 'umd',
      sourcemap: false,
      banner
    },
    plugins: [
      json(),
      nodeResolve()
    ].concat(plugins),
  })
}

const babelConfig = {
  runtimeHelpers: true,
  exclude : 'node_modules/**',
  presets: [['@nuxt/babel-preset-app', {
    // useBuiltIns: 'usage',
    // target: { ie: 9 }
  }]]
}

export default [
  rollupConfig({
    output: {
      file: pkg.web,
    },
    plugins: [
      babel(babelConfig),
      commonjs()
    ]
  }),
  rollupConfig({
    output: {
      file: pkg.web.replace('.js', '.min.js'),
    },
    plugins: [
      babel(babelConfig),
      commonjs(),
      terser()
    ]
  }),
  rollupConfig({
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs'
    },
    plugins: [
      commonjs()
    ],
    external: Object.keys(pkg.dependencies)
  })
]
