import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import buble from 'rollup-plugin-buble'
import replace from 'rollup-plugin-replace'
import { terser } from 'rollup-plugin-terser'
import defaultsDeep from 'lodash/defaultsDeep'

const pkg = require('../package.json')

const banner =  `/**
 * vue-meta v${pkg.version}
 * (c) ${new Date().getFullYear()}
 * - Declan de Wet
 * - Sébastien Chopin (@Atinux)
 * - All the amazing contributors
 * @license MIT
 */
`

function rollupConfig({
  plugins = [],
  ...config
  }) {

  const replaceConfig = {
    exclude: 'node_modules/**',
    delimiters: ['', ''],
    values: {
      // replaceConfig needs to have some values
      'const polyfill = process.env.NODE_ENV === \'test\'': 'const polyfill = false',
    }
  }

  if (!config.output.format || config.output.format === 'umd') {
    replaceConfig.values = {
      'const polyfill = process.env.NODE_ENV === \'test\'': 'const polyfill = true',
    }
  }

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
      nodeResolve(),
      replace(replaceConfig)
    ].concat(plugins),
  })
}

export default [
  // umd web build
  rollupConfig({
    output: {
      file: pkg.web,
    },
    plugins: [
      commonjs(),
      buble()
    ]
  }),
  // minimized umd web build
  rollupConfig({
    output: {
      file: pkg.web.replace('.js', '.min.js'),
    },
    plugins: [
      commonjs(),
      buble(),
      terser()
    ]
  }),
  // common js build
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
  }),
  // esm build
  rollupConfig({
    input: 'src/index.js',
    output: {
      file: pkg.web.replace('.js', '.esm.js'),
      format: 'es'
    },
    external: Object.keys(pkg.dependencies)
  }),
  // browser esm build
  rollupConfig({
    input: 'src/browser.js',
    output: {
      file: pkg.web.replace('.js', '.esm.browser.js'),
      format: 'es'
    },
    external: Object.keys(pkg.dependencies)
  }),
  // minimized browser esm build
  rollupConfig({
    input: 'src/browser.js',
    output: {
      file: pkg.web.replace('.js', '.esm.browser.min.js'),
      format: 'es'
    },
    plugins: [
      terser()
    ],
    external: Object.keys(pkg.dependencies)
  })
]
