import { parsePostsXml } from "./parse-posts-xml"
import { performReplacements } from "./performReplacements"
import { resolveMedia } from "./resolveMedia"

const doWork = async () => {

	console.log("*** STARTING IMPORT ***")

	const fileName = process.env.WP_EXPORT_FILEPATH || "export.xml"

	//parse the XML
	const posts = await parsePostsXml({ fileName })

	console.log("Parsed posts: ", posts.length)

	//resolve the media
	await resolveMedia({ posts })

	//do the replacements
	const replacements = [
		{
			"old": "http://vostheatre.wordpress.com",
			"new": "https://vostheatre.com/blog"
		},
		{
			"old": "http://vostheatre.blog",
			"new": "https://vostheatre.com/blog"
		},
		{
			"old": "https://vostheatre.wordpress.com",
			"new": "https://vostheatre.com/blog"
		},
		{
			"old": "https://vostheatre.blog",
			"new": "https://vostheatre.com/blog"
		}
	]
	performReplacements({ posts, replacements })

}

doWork()