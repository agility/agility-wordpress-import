import { Post } from "./types/Post"

interface Props {
	post: Post
	replacements: { old: string, new: string }[]

}

export const performReplacements = ({ post, replacements }: Props) => {

	//do the replacements
	replacements.forEach(replacement => {
		post.body = post.body.replace(new RegExp(replacement.old, "g"), replacement.new)
	})


}