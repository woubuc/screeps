const DEV = process.argv.includes('--dev');

require('esbuild').build({
	entryPoints: ['src/main.ts'],
	bundle: true,
	platform: 'node',
	target: ['es6'],
	format: 'cjs',
	outfile: 'default/main.js',
	watch: DEV,
	logLevel: 'info',
});
