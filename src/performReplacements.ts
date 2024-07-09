import { Post } from "./types/Post"

interface Props {
	posts: Post[]
	replacements: { old: string, new: string }[]

}

export const performReplacements = ({ posts, replacements }: Props) => {

	for (let i = 0; i < posts.length; i++) {
		const post = posts[i]

		//do the replacements
		replacements.forEach(replacement => {
			post.body = post.body.replace(new RegExp(replacement.old, "g"), replacement.new)
		})
	}

}