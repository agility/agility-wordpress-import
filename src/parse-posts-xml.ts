import { Post } from "./types/Post";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser"
import { parseString } from "xml2js";
import fs from "fs";

interface Props {
	fileName: string;

}

export const parsePostsXml = async ({ fileName }: Props): Promise<Post[]> => {

	const p = new Promise<Post[]>((resolve, reject) => {


		const xmlStr = fs.readFileSync(fileName, "utf8")

		parseString(xmlStr, { explicitArray: false }, (err, result) => {
			if (err) {
				console.error("Could not parse XML file", err)
				reject("Could not parse XML file")
			} else {

				const posts: Post[] = []


				const blog_base_url = result.rss.channel['wp:base_blog_url']
				const lstPosts = result.rss.channel['item'];

				console.log("Blog Base URL: ", blog_base_url)

				//pull out the attachments first

				for (let i = 0; i < lstPosts.length; i++) {
					const post = lstPosts[i]

					const postType = post["wp:post_type"]

					if (postType !== "post") {
						//only process posts...
						continue
					}

					const postStatus = post["wp:status"]
					if (postStatus !== "publish") {
						//only process published posts...
						console.log("Skipping post because it is not published: ", post["title"], postStatus)
						continue
					}

					let categories = post["category"];

					let postCategories: string[] = []
					if (Array.isArray(categories)) {

						categories.map(function (category, instanceIndex) {
							postCategories.push(category["_"])
						})
					} else {
						postCategories.push(categories["_"])
					}

					let date = new Date(post["wp:post_date_gmt"])
					let slug = post["wp:post_name"];

					let oldUrl = post["link"];
					let oldID = post["wp:post_id"]
					let title = post["title"]
					let author = post["dc:creator"]
					let body = post["content:encoded"]


					const postObj: Post = {
						id: parseInt(oldID),
						title,
						body,
						categories: postCategories,
						author,
						date,
						slug
					}


					posts.push(postObj)
				}

				resolve(posts)

			}
		})


	})

	return p

}