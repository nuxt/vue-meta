import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import buble from 'rollup-plugin-buble'

export default {
  entry: './src/index.js',
  format: 'umd',
  dest: './lib/index.js',
  moduleName: 'VueMeta',
  plugins: [
    json(),
    nodeResolve({
      jsnext: true
    }),
    commonjs(),
    buble()
  ]
}
