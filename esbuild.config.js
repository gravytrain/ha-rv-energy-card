import esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: ['src/rv-energy-card.ts'],
  bundle: true,                 // inline Lit so HACS serves one self-contained file
  outfile: 'dist/rv-energy-card.js',
  format: 'esm',
  target: 'es2021',
  minify: true,
  sourcemap: false,
  loader: { '.geojson': 'json' },
  legalComments: 'none',
  banner: {
    js: '/* ha-rv-energy-card — bundled (Lit inlined). Source: src/. Do not edit dist/ by hand. */',
  },
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('esbuild: watching src/ …');
} else {
  await esbuild.build(options);
  console.log('esbuild: built dist/rv-energy-card.js');
}
