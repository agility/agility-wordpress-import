import { Post } from "./types/Post"
import { parse } from "node-html-parser"
import fs from "fs"
import path from "path"
import { downloadImage } from "./downloadImage"
import { Blob } from "buffer";
import FormDataX from 'form-data'

import { ApiClient, Options } from "@agility/management-sdk"

interface Props {
	posts: Post[]
}



export const resolveMedia = async ({ posts }: Props): Promise<void> => {

	const uploads: { [key: string]: string } = {}

	const tmpFolder = "tmp"
	if (fs.existsSync(tmpFolder)) {
		//cleanup the tmp folder
		fs.rmSync(tmpFolder, { recursive: true })
	}

	fs.mkdirSync(tmpFolder)

	const guid = process.env.AGILITY_GUID || ""
	const options = new Options()

	options.token = process.env.AGILITY_TOKEN || ""

	const apiClient = new ApiClient(options)

	for (let i = 0; i < posts.length; i++) {
		const post = posts[i]
		console.log("Resolving media for post: ", post.title)

		const element = parse(post.body)
		const images = element.querySelectorAll("img")

		for (let j = 0; j < images.length; j++) {
			const image = images[j]
			let src = image.getAttribute("src")
			if (!src) continue
			//get the query string (w / h) and pull the FULL image URL
			let queryString = ""

			if (src.includes("?")) {
				const ary = src.split("?")
				queryString = ary[1]
				src = ary[0]
			}

			if (!queryString) {
				queryString = "format=auto"
			} else {
				queryString += "&format=auto"
			}

			src = src.toLowerCase()

			if (src.startsWith("//")) src = "https:" + src
			if (src.startsWith("http://")) src = src.replace("http://", "https://")

			const fileName = path.basename(src)

			//check to see if we have already resolved this image
			const newUrl = uploads[src]

			if (!newUrl) {
				//download the image to a temp file and upload it to the new site
				//then update the src attribute
				const tempFileName = path.join(tmpFolder, `temp-${fileName}`)

				if (await downloadImage({ filename: tempFileName, url: src })) {
					//now upload the image to the new site
					const file = fs.readFileSync(tempFileName, null)
					const form = new FormDataX();
					form.append('files', file, fileName);

					const assets = await apiClient.assetMethods.upload(form, "posts", guid)
					if (assets && assets.length > 0) {
						const asset = assets[0]
						uploads[src] = asset.edgeUrl
						image.setAttribute("src", asset.edgeUrl + "?" + queryString)
					} else {
						console.error("Could not upload image on post ", post.id, "src:", src)
					}
				} else {
					console.warn("Could not download image on post ", post.id, "src:", src)
				}
			}
		}
	}

	//cleanup the tmp folder
	fs.rmSync(tmpFolder, { recursive: true })
}