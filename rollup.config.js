import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'

export default {
  external: [
    'fs',
    'front-matter',
    'markdown-it',
    '@baleada/markdown-it-prose-container',
  ],
  input: [
    'src/index.js',
  ],
  output: { file: 'lib/index.js', format: 'cjs' },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
  ]
}
