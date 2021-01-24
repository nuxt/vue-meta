import path from 'path'
import alias from '@rollup/plugin-alias'
// import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import ts from 'rollup-plugin-typescript2'
import defaultsDeep from 'lodash/defaultsDeep'

const pkg = require('../package.json')

const banner =  `/**
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()}
 * - Pim (@pimlie)
 * - All the amazing contributors
 * @license MIT
 */
`

let didTS = false

function rollupConfig({
  plugins = [],
  external = [],
  ...config
  }) {

  const isBrowserBuild = !config.output || !config.output.format || config.output.format === 'iife' || config.output.file.includes('-browser.')
  const isProductionBuild = config.output.file.includes('.prod.')

  const replaceConfig = {
    exclude: 'node_modules',
    delimiters: ['', ''],
    values: {
      'process.server' : isBrowserBuild ? 'false' : 'true', // should not be used anymore
      '__DEV__': config.output.format === 'es' && !isBrowserBuild ? "(process.env.NODE_ENV !== 'production')" : !isProductionBuild,
      '__BROWSER__': isBrowserBuild,
    }
  }

  if (isBrowserBuild) {
    external = ['vue']
  } else {
    external = Object.keys(pkg.peerDependencies)
    external.push('@vue/server-renderer')
  }

  const thisConfig = defaultsDeep({}, config, {
    input: 'src/index.ts',
    output: {
      name: 'VueMeta',
      format: 'iife',
      sourcemap: false,
      banner,
      externalLiveBindings: false,
      globals: {
        vue: 'Vue'
      }
    },
    external,
    plugins: [
      replace(replaceConfig),
      nodeResolve(),
      commonjs(),
      ts({
        check: !didTS,
        tsconfig: path.resolve(__dirname, '../tsconfig.json'),
        cacheRoot: path.resolve(__dirname, '../node_modules/.rts2_cache'),
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: true,
            declaration: !didTS,
            declarationMap: !didTS,
          },
          exclude: ['__tests__', 'test-dts'],
        },
      }),
    ].concat(plugins),
  })

  if (isBrowserBuild) {
    // remove the ssr renderToString helper for browser builds
    thisConfig.plugins.unshift(alias({
      entries: [
        { find: '.\/ssr', replacement: path.resolve(__dirname, './stub.js') },
      ]
    }))
  }

  if (config.output.file.includes('.min.')) {
    const terserOpts = {
      module: config.output.format === 'es',
      compress: {
        ecma: 2015,
        pure_getters: true,
      },
    }

    thisConfig.plugins.push(terser(terserOpts))
  }

  didTS = true

  return thisConfig
}

export default [
  // umd web build
  {
    output: {
      file: pkg.unpkg,
    },
  },
  // minimized umd web build
  {
    output: {
      file: pkg.unpkg.replace('.js', '.min.js'),
    },
  },
  // common js build
  {
    output: {
      file: pkg.main,
      format: 'cjs'
    },
  },
  // common js build
  {
    output: {
      file: pkg.main.replace('.js', '.prod.js'),
      format: 'cjs'
    },
  },
  // esm build
  {
    output: {
      file: pkg.module,
      format: 'es'
    },
  },
  // browser esm build
  {
    output: {
      file: pkg.module.replace('-bundler.js', '-browser.js'),
      format: 'es'
    },
  },
  // minimized browser esm build
  {
    output: {
      file: pkg.module.replace('-bundler.js', '-browser.min.js'),
      format: 'es'
    },
  }
].map(rollupConfig)
