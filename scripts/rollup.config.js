import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
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

const babelConfig = () => ({
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 8,
        ie: 9,
        safari: '5.1'
      }
    }]
  ]
})

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

  // keep simple polyfills when babel plugin is used for build
  if (plugins && plugins.some(p => p.name === 'babel')) {
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
      replace(replaceConfig),
      commonjs(),
      babel(babelConfig()),
    ].concat(plugins),
  })
}

export default [
  // umd web build
  {
    output: {
      file: pkg.web,
    }
  },
  // minimized umd web build
  {
    output: {
      file: pkg.web.replace('.js', '.min.js'),
    },
    plugins: [
      terser()
    ]
  },
  // common js build
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs'
    },
    external: Object.keys(pkg.dependencies)
  },
  // esm build
  {
    input: 'src/index.js',
    output: {
      file: pkg.web.replace('.js', '.esm.js'),
      format: 'es'
    },
    external: Object.keys(pkg.dependencies)
  },
  // browser esm build
  {
    input: 'src/browser.js',
    output: {
      file: pkg.web.replace('.js', '.esm.browser.js'),
      format: 'es'
    },
    external: Object.keys(pkg.dependencies)
  },
  // minimized browser esm build
  {
    input: 'src/browser.js',
    output: {
      file: pkg.web.replace('.js', '.esm.browser.min.js'),
      format: 'es'
    },
    plugins: [
      terser()
    ],
    external: Object.keys(pkg.dependencies)
  }
].map(rollupConfig)
