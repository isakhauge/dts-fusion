# DTS Fusion

> DTS Bundler Plugin for Vite

Generates `d.ts` files of all `ts` files and bundles them all into a single `d.ts`, including existing `d.ts` files.

## Installation

```bash
yarn add -D dts-fusion
```

## Usage

```js
const { DtsPlugin } = require('dts-fusion')
export default defineConfig({
	plugins: [
		DtsPlugin({
			inDir: 'src/ts',
			outDir: 'dist',
			outFileName: 'my-types', // Optional, defaults to `types`
		}),
	],
})
```

## Documentation

`inDir` - The directory to search for type declaration files.

`outDir` - The directory to output the bundled type declaration file to.

`outFileName` - The name of the bundled type declaration file. Defaults to `types`.
