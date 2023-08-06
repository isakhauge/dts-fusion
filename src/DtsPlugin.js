import { resolve } from 'path'
import { createDts, findDts, removeImports } from './utils/dts-utils'
import {
	readDir,
	read,
	write,
	deleteFile,
} from './utils/node-utils'

/**
 * # Merge DTS Files
 * @param {DtsPluginContext} ctx
 * @returns {Promise<string>}
 */
async function mergeDtsFiles(ctx) {
	// Find all created .d.ts files.
	const dtsFiles = await findDts(ctx.options.outDir)

	// Read and the contents of all found .d.ts files.
	const dtsFileContents = await Promise.all(dtsFiles.map(read))

	// Mutate the contents of all found .d.ts files where all import statements are removed.
	const dtsFileContentsWithoutImports = dtsFileContents.map(removeImports)

	// Combine all .d.ts file content strings into one.
	const combinedDtsFileContents = dtsFileContentsWithoutImports.join('\n')

	return combinedDtsFileContents
}

/**
 * # Create DTS Files
 * @param {DtsPluginContext} ctx 
 * @returns {Promise<DirectoryState>}
 */
async function createDtsFiles(ctx) {
	/**
	 * Create read options
	 * @type {ReadOptions}
	 */
	const options = {
		encoding: 'utf8',
		recursive: true,
		withFileTypes: false,
	}

	/**
	 * Cache files and folders before creating .d.ts files.
	 * @type {PathString[]}
	 */
	const filesAndFoldersBefore = (await readDir(
		ctx.options.outDir,
		options
	)).map(fileOrFolder => resolve(ctx.options.outDir, fileOrFolder))

	// Create .d.ts files.
	await createDts(ctx.options.inDir, ctx.options.outDir)

	// Merge the contents of all created .d.ts files into one string.
	const combinedDtsFileContents = await mergeDtsFiles(ctx)

	// Write the new .d.ts file.
	await write(ctx.dtsBundlePath, combinedDtsFileContents)

	/**
	 * Cache all the files and folders after creating the .d.ts files.
	 * @type {PathString[]}
	 */
	const filesAndFoldersAfter = (await readDir(
		ctx.options.outDir,
		options
	)).map(fileOrFolder => resolve(ctx.options.outDir, fileOrFolder))

	return {
		before: filesAndFoldersBefore,
		after: filesAndFoldersAfter,
	}
}

/**
 * # Create Context
 * @param {DtsPluginOptions} options 
 * @returns {DtsPluginContext}
 */
function createContext(options) {
	const defaultBundleFileName = 'types'
	const bundleFileName = options.outFileName || defaultBundleFileName
	return {
		dtsBundlePath: resolve(options.outDir, `${bundleFileName}.d.ts`),
		options,
	}
}

/**
 * # Dts Plugin
 * @typedef {string} PathString
 * @typedef {{
 * 	inDir: string,
 * 	outDir: string,
 *  outFileName?: string,
 * }} DtsPluginOptions
 * @typedef {{
 * 	dtsBundlePath: string,
 * 	options: DtsPluginOptions,
 * }} DtsPluginContext
 * @typedef {{
 * 	before: PathString[],
 * 	after: PathString[],
 * }} DirectoryState
 * @typedef {{
 * 	encoding?: BufferEncoding,
 * 	recursive?: boolean,
 * 	withFileTypes?: boolean
 * }} ReadOptions
 * 
 * @param {DtsPluginOptions} options 
 * @returns {import('rollup').Plugin}
 */
export function DtsPlugin(options) {
	return {
		name: 'dts-plugin',
		async closeBundle() {
			const ctx = createContext(options)
			await deleteFile(ctx.outDir)
			const dirState = await createDtsFiles(ctx)

			const { before, after } = dirState

			// Create an array of all files and folders to keep.
			const filesToKeep = [ctx.dtsBundlePath, ...before]

			// Create and array of all files and folders to delete.
			const filesToDelete = after.filter(path => {
				return filesToKeep.includes(path) === false
			})

			// Delete all .d.ts files used as basis for the new, compound .d.ts file.
			await Promise.all(filesToDelete.map(deleteFile))
		},
	}
}
