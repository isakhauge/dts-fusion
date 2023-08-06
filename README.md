# DTS Fusion

> DTS Bundler Plugin for Vite

Bundles all type declaration files into a single declaration file.

## Installation

```bash
npm install dts-fusion
```

## Usage

```js
const { DtsPlugin } = require('@isak/dts-bundler')
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
