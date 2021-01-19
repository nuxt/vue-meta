const path = require('path')

module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 3,
      targets: {
        ie: 9
      }
    }],
    '@babel/preset-typescript',
  ],
  plugins: [
    'dynamic-import-node',
    ['global-define', {
      '__DEV__': 'true'
    }],
    ['module-resolver', {
      root: '.',
      extensions: ['.ts'],
      alias: {
        'vue-meta': path.resolve('./src/')
      }
    }],
  ],
  env: {
    test: {
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        'dynamic-import-node'
      ],
      presets: [
        [ '@babel/preset-env', {
          targets: {
            node: 'current'
          }
        }],
       '@babel/preset-typescript'
      ],
    }
  }
}
