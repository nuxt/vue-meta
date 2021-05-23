const path = require('path')

module.exports = require('jiti')(__filename, {
  cache: false,
  debug: false,
  transformOptions: {
    ts: true,
    retainLines: true,
    babel: {
      plugins: [
        [require('babel-plugin-global-define'), {
          __DEV__: true,
          __BROWSER__: false
        }],
        [require('babel-plugin-module-resolver'), {
          root: '.',
          extensions: ['.ts'],
          alias: {
            '^vue-meta$': path.resolve(__dirname, '../src/'),
            '^vue-meta/ssr$': path.resolve(__dirname, '../src/ssr')
          }
        }]
      ]
    }
  }
})
