module.exports = {
  plugins: [
    ['@babel/plugin-transform-runtime', { regenerator: true }], // Needed for IE9 build target
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          ie: 9,
        },
      },
    ],
  ],
}
