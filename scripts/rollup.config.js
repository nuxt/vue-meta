import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import { terser } from 'rollup-plugin-terser'
import defaultsDeep from 'lodash/defaultsDeep'

const pkg = require('../package.json')

const version = pkg.version

const banner =  `/**
 * vue-meta v${version}
 * (c) ${new Date().getFullYear()}
 * - Declan de Wet
 * - Sébastien Chopin (@Atinux)
 * - Pim (@pimlie)
 * - All the amazing contributors
 * @license MIT
 */
`

const babelConfig = () => ({
  presets: [
    ['@babel/preset-env', {
      /*useBuiltIns: 'usage',
      corejs: 2,*/
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

  const isBrowserBuild = !config.output || !config.output.format || config.output.format === 'umd' || config.output.file.includes('.browser.')

  const replaceConfig = {
    exclude: 'node_modules/(?!is-mergeable-object)',
    delimiters: ['', ''],
    values: {
      // replaceConfig needs to have some values
      'const polyfill = process.env.NODE_ENV === \'test\'': 'const polyfill = true',
      'process.env.VERSION': `"${version}"`,
      'process.server' : isBrowserBuild ? 'false' : 'true',
      /* remove unused stuff from deepmerge */

      // remove react stuff from is-mergeable-object
      '|| isReactElement(value)': '|| false',
      // we always provide an arrayMerge, remove default
      '|| defaultArrayMerge' : '',
      // we dont provide a custom merge
      'options.clone' : 'false',
      // we dont provide a custom merge
      'options.customMerge' : 'false',
      // dont use this
      'deepmerge.all = ' : 'false;'
    }
  }

  /* / keep simple polyfills when babel plugin is used for build
  if (plugins && plugins.some(p => p.name === 'babel')) {
    replaceConfig.values = {
      'const polyfill = process.env.NODE_ENV === \'test\'': 'const polyfill = true',
    }
  }*/

  return defaultsDeep({}, config, {
    input: 'src/index.js',
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
    output: {
      file: pkg.main,
      format: 'cjs'
    },
    external: Object.keys(pkg.dependencies)
  },
  // esm build
  {
    output: {
      file: pkg.web.replace('.js', '.esm.js'),
      format: 'es'
    },
    external: Object.keys(pkg.dependencies)
  },
  // browser esm build
  {
    output: {
      file: pkg.web.replace('.js', '.esm.browser.js'),
      format: 'es'
    },
    external: Object.keys(pkg.dependencies)
  },
  // minimized browser esm build
  {
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
