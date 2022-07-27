import path from 'path'
import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import defaultsDeep from 'lodash/defaultsDeep'

const r = p => path.resolve(__dirname, p)
const pkg = require('../package.json')

const banner = `/**
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()}
 * - Pim (@pimlie)
 * - All the amazing contributors
 * @license MIT
 */
`

let didTS = false

function rollupConfig ({
  plugins = [],
  external = [],
  ...config
}) {
  const { file, format } = config?.output
  const isProductionBuild = file.includes('.prod.')
  const isESMBundlerBuild = file.includes('.esm-bundler.')
  const isBrowserBuild = format === 'iife' || file.includes('-browser.')

  const replaceConfig = {
    preventAssignment: true,
    exclude: 'node_modules',
    delimiters: ['', ''],
    values: {
      'process.env.NODE_ENV': JSON.stringify(isProductionBuild ? 'production' : 'development'),
      __DEV__: config.output.format === 'es' && !isBrowserBuild ? "(process.env.NODE_ENV !== 'production')" : !isProductionBuild,
      __BROWSER__: isESMBundlerBuild || isBrowserBuild
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
      sourcemap: false,
      banner,
      externalLiveBindings: false,
      globals: {
        vue: 'Vue'
      }
    },
    external: [...external, /@babel\/runtime/],
    plugins: [
      replace(replaceConfig),
      nodeResolve(),
      ts({
        check: !didTS,
        tsconfig: r('../tsconfig.json'),
        cacheRoot: r('../node_modules/.rts2_cache'),
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: true,
            declaration: !didTS,
            declarationMap: !didTS
          },
          exclude: ['node_modules', '__tests__', 'test-dts']
        }
      }),
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        extensions: [
          ...DEFAULT_EXTENSIONS,
          '.ts',
          '.tsx'
        ]
      }),
      commonjs()
    ].concat(plugins)
  })

  if (isBrowserBuild) {
    // remove the ssr renderToString helper for browser builds
    thisConfig.plugins.unshift(alias({
      entries: [
        { find: '.\/ssr', replacement: r('./stub.js') }
      ]
    }))
  }

  if (config.output.file.includes('.min.')) {
    const terserOpts = {
      module: config.output.format === 'es',
      compress: {
        ecma: 2015,
        pure_getters: true
      }
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
      format: 'iife'
    }
  },
  // minimized umd web build
  {
    output: {
      file: pkg.unpkg.replace('.js', '.min.js'),
      format: 'iife'
    }
  },
  // common js build
  {
    output: {
      file: pkg.main,
      format: 'cjs'
    }
  },
  // common js build
  {
    output: {
      file: pkg.main.replace('.js', '.prod.js'),
      format: 'cjs'
    }
  },
  // esm build
  {
    output: {
      file: pkg.module,
      format: 'es'
    }
  },
  // browser esm build
  {
    output: {
      file: pkg.module.replace('-bundler.js', '-browser.js'),
      format: 'es'
    }
  },
  // minimized browser esm build
  {
    output: {
      file: pkg.module.replace('-bundler.js', '-browser.min.js'),
      format: 'es'
    }
  },
  // SSR build
  {
    input: 'src/ssr.ts',
    output: {
      file: 'ssr/index.js',
      format: 'es'
    }
  }

].map(rollupConfig).concat([
  {
    input: r('../dist/src/index.d.ts'),
    output: [{
      file: `dist/${pkg.name}.d.ts`,
      format: 'es',
      banner: `${banner}
/// <reference path="../ssr/index.d.ts" />
      `
    }],
    plugins: [dts()]
  },
  {
    input: r('../dist/src/ssr.d.ts'),
    output: [{
      file: 'ssr/index.d.ts',
      format: 'es'
    }],
    plugins: [dts()]
  }
])
