import { getExistingPosts } from "./get-existing-posts"
import { cleanup, init } from "./init-term"
import { parsePostsXml } from "./parse-posts-xml"
import { resolveCategories } from "./resolve-categories"
import { savePosts } from "./save-posts"

const doWork = async () => {

	console.log("*** STARTING IMPORT ***")

	//init stuff
	init()

	const fileName = process.env.WP_EXPORT_FILEPATH || "export.xml"

	//parse the XML
	const posts = await parsePostsXml({ fileName })

	console.log("Got posts", posts.length)

	//get the existing posts
	const existingPosts = await getExistingPosts()

	const existingCategories = await resolveCategories({ posts })


	await savePosts({ posts, existingPosts, existingCategories })

	//clean up everything...
	cleanup()

	console.log("*** IMPORT COMPLETE ***")

}

doWork()