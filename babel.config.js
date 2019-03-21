module.exports = {
  "plugins": ["@babel/plugin-syntax-dynamic-import"],
  "env": {
    "test": {
      "plugins": ["dynamic-import-node"],
      "presets": [
        [ "@babel/env", {
          targets: {
            node: "current"
          }
        }]
      ]
    }
  },
}
