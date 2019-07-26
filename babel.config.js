module.exports = {
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
        }]
      ],
    }
  }
}
