import fs from "fs"
import path from "path"


const tmpFolder = "tmp"

export const init = async () => {

	console.log("cleaning up tmp folder")

	if (fs.existsSync(tmpFolder)) {
		//cleanup the tmp folder
		fs.rmSync(tmpFolder, { recursive: true })
	}

	fs.mkdirSync(tmpFolder)
}

export const cleanup = async () => {
	//cleanup the tmp folder
	fs.rmSync(tmpFolder, { recursive: true })
}