import { exec } from 'child_process'
import { readdir, readFile, writeFile, mkdir } from 'fs'
import { dirname } from 'path'

/**
 * # Make Exec Error Handler
 * @param {function} resolve 
 * @param {function} reject
 */
const makeExecErrorHandler = (resolve, reject) => {
	/**
	 * # Exec Error Handler
	 * @param {ExecException | null} error 
	 * @param {string} stdout 
	 * @param {string} stderr 
	 */
	return (error, stdout, stderr) => {
		if (error) {
			reject(error)
		}
		resolve(stdout ? stdout : stderr)
	}
}

/**
 * # Run
 * Run a command in the terminal
 * @param {string} command Command to run
 * @returns {Promise<string>} Command output
 */
export const run = (command) => {
	return new Promise((resolve, reject) => {
		exec(command, makeExecErrorHandler(resolve, reject))
	})
}

/**
 * # Read
 * Read a file
 * @param {string} path Path to file
 * @returns {Promise<string>} File content
 */
export const read = (path) => {
	return new Promise((resolve, reject) => {
		readFile(
			path,
			{ encoding: 'utf-8', flag: 'r' },
			(err, data) => {
				if (err) {
					reject(err)
				}
				resolve(data)
			}
		)
	})
}

/**
 * # Write
 * Write to a file
 * @param {string} path Path to file
 * @param {string} data Data to write
 * @returns {Promise<void>}
 */
export const write = (path, data) => {
	return new Promise((resolve, reject) => {
		const dir = dirname(path)
		mkdir(dir, { recursive: true }, (err) => {
			if (err) {
				reject(err)
			}
			writeFile(
				path,
				data,
				{ encoding: 'utf-8' },
				(err) => {
					if (err) {
						reject(err)
					}
					resolve()
				}
			)
		})
	})
}

/**
 * # Delete File
 * @param {string} path Path to file or folder
 * @returns {Promise<boolean>} True if file was deleted, false if not
 */
export const deleteFile = async (path) => {
	try {
		await run(`rm -rf ${path}`)
		return true
	} catch {
		return false
	}
}

/**
 * # Read Directory
 * @param {string} path Path to directory
 * @param {ReadOptions} options Options
 * @returns {Promise<PathString[]>} File- and folder paths in directory
 * @typedef {{
 * 	encoding?: BufferEncoding,
 * 	recursive?: boolean,
 * 	withFileTypes?: boolean
 * }} ReadOptions
 */
export const readDir = (path, options) => {
	return new Promise((resolve, reject) => {
		readdir(
			path,
			options,
			(err, files) => {
				if (err) {
					reject(err)
				}
				resolve(files)
			}
		)
	})
}
