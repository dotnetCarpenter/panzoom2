// rollup.config.js
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import path from 'path'

export default {
  name: 'panzoom',
  input: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    file: path.resolve(__dirname, 'dist','panzoom.js'),
    format: 'umd'
  },
  plugins: [
    resolve(),
    babel({
      // only transpile our source code
      exclude: 'node_modules/**'
    })
  ]
}