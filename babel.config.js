module.exports = {
  presets: [
    ["@babel/preset-env", {
      useBuiltIns: 'usage',
      corejs: 3,
      targets: {
        ie: 9
      }
    }]
  ],
  plugins: [
    "dynamic-import-node"
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
