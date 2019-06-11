module.exports = class VueMetaLoaderPlugin {
  apply(compiler) {
    const rules = compiler.options.module.rules
    const vueRule = rules.find(r => r.loader.includes('vue-loader'))

    if (!vueRule) {
      console.error('vue-loader not found in webpack config')
      return
    }

    if (vueRule.use) {
      console.error('vue-meta-loader plugin should be added before the vue-loader plugin')
      return
    }

    compiler.options.module.rules.push({
      resourceQuery: /blockType=head/,
      loader: require.resolve('./loader.js')
    })
  }
}
