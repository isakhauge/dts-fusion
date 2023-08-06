# DTS Fusion

> DTS Bundler Plugin for Vite

Generate TS type declaration files of all TS files and bundles them all into a single declaration file.

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
