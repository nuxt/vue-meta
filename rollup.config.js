import buble from 'rollup-plugin-buble'

export default {
  entry: './src/index.js',
  format: 'umd',
  dest: './lib/index.js',
  moduleName: 'VueMeta',
  plugins: [buble()]
}
