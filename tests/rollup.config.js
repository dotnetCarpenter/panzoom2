// rollup.config.js
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import path from 'path'

export default {
  input: path.resolve(__dirname, 'panzoom2.js'),
  output: {
    file: path.resolve(__dirname, 'test-panzoom2.js'),
    format: 'cjs'
  },
  plugins: [
    commonjs({
      namedExports: {
        'tap': ['test']
      }
    }),
    resolve(),
    babel({
      // only transpile our source code
      exclude: 'node_modules/**'
    })
  ]
}