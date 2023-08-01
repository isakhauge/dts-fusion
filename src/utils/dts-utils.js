import { resolve } from 'path'
import { run } from './node-utils'
import { stat, readdir } from 'fs/promises'

/**
 * # Create DTS
 * Creates a .d.ts file for each .ts file in a directory.
 * @param {string} inDir The directory containing the .ts files.
 * @param {string} outDir The directory to write the .d.ts files to.
 * @returns
 */
export const createDts = async (inDir, outDir) => {
	const command = [
		'tsc',
		'--emitDeclarationOnly',
		'--declaration',
		'--allowJs',
		'--emitDecoratorMetadata',
		'--experimentalDecorators',
		'--moduleResolution node',
		`--outDir ${outDir}`,
		`${inDir}/**/*.ts`,
	].join(' ')
	return await run(command)
}

export const findDtsFilesRecursively = async (path, files) => {
	const directories = await readdir(path)
	for (const dir of directories) {
		const aggregatedPath = resolve(path, dir)
		const pathStat = await stat(aggregatedPath)
		if (pathStat.isDirectory()) {
			await findDtsFilesRecursively(aggregatedPath, files)
		} else if (aggregatedPath.endsWith('.d.ts')) {
			files.push(aggregatedPath)
		}
	}
	return files
}

/**
 * # Find DTS
 * Returns a list of absolute paths to all .d.ts files in a directory.
 * @param {string} path Path to directory to search.
 * @returns {Promise<any[]>} List of absolute paths to all .d.ts files in a directory.
 */
export const findDts = async (path) => {
	return await findDtsFilesRecursively(path, [])
}

/**
 * # Remove Imports
 * Removes all import statements from a string.
 * @param {string} data String to remove imports statements from.
 * @returns {string} String without import statements.
 */
export const removeImports = (data) => {
	const regex = /^(import.+)$/gm
	return data?.replace(regex, '')
}
