// rollup.config.js
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import path from 'path'

export default {
  input: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    name: 'panzoom',
    file: path.resolve(__dirname, 'dist','panzoom.js'),
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    resolve({
      extensions: ['.js', '.mjs'],
      module: true
    }),
    babel({
      // only transpile our source code
      exclude: 'node_modules/**'
    })
  ]
}
