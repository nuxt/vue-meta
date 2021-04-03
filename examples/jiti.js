const path = require('path')
const { transformSync } = require('@babel/core')

module.exports = require('jiti')(__filename, {
  cache: false,
  debug: false,
  transform (opts) {
    const _opts = {
      babelrc: false,
      configFile: false,
      compact: false,
      retainLines: typeof opts.retainLines === 'boolean' ? opts.retainLines : true,
      filename: '',
      cwd: '/',
      plugins: [
        [require('@babel/plugin-transform-modules-commonjs'), { allowTopLevelThis: true }],
        [require('@babel/plugin-transform-typescript')],
        [require('babel-plugin-dynamic-import-node'), { noInterop: true }],
        [require('babel-plugin-global-define'), {
          __DEV__: true,
          __BROWSER__: false
        }],
        [require('babel-plugin-module-resolver'), {
          root: '.',
          extensions: ['.ts'],
          alias: {
            '^vue-meta$': path.resolve(__dirname, '../src/')
          }
        }]
      ]
    }

    try {
      return transformSync(opts.source, _opts).code || ''
    } catch (err) {
      return 'exports.__JITI_ERROR__ = ' + JSON.stringify({
        filename: opts.filename,
        line: (err.loc && err.loc.line) || 0,
        column: (err.loc && err.loc.column) || 0,
        code: err.code && err.code.replace('BABEL_', '').replace('PARSE_ERROR', 'ParseError'),
        message: err.message.replace('/: ', '').replace(/\(.+\)\s*$/, '')
      })
    }
  }
})
