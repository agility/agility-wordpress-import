
import { ApiClient, ContentItem, ContentItemProperties, Options } from "@agility/management-sdk";
import { performReplacements } from "./performReplacements";

import { resolveMedia } from "./resolveMedia";
import { Post } from "./types/Post";
import { updateBatchContentItems } from "./lib/updateBatchContentItems";
import { DateTime } from "luxon";

interface Props {
	existingPosts: any[]
	existingCategories: any[]
	posts: Post[]
}

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

export const savePosts = async ({ posts, existingPosts, existingCategories }: Props): Promise<void> => {



	//when we have a full batch of posts, do the save all at once..
	let batch: ContentItem[] = []

	//loop through the posts
	for (let i = 0; i < posts.length; i++) {

		let post = posts[i]

		//resolve the media
		const res = await resolveMedia({ post })
		const mainImage = res.media
		post = res.post


		//perform replacements
		performReplacements({ post, replacements })


		//lookup the post
		const existingPost = existingPosts.find(p => p.ExternalID === `${post.id}`)
		let contentID = -1
		if (existingPost) {
			contentID = existingPost.itemContainerID
		}

		//figure out the categories
		let catIDs: number[] = []
		post.categories.forEach(cat => {
			const existingCat = existingCategories.find(c => c.title === cat)
			if (existingCat) {
				catIDs.push(existingCat.itemContainerID)
			}
		})


		const properties: ContentItemProperties = new ContentItemProperties()
		properties.referenceName = "posts"

		const CONTENTITEM_FORMAT = "yyyy-MM-dd'T'HH:mm:ss"


		//create the content item
		const contentItem: ContentItem = {
			contentID: contentID,
			fields: {
				title: post.title,
				slug: post.slug,
				date: DateTime.fromJSDate(post.date).toFormat(CONTENTITEM_FORMAT),
				content: post.body,
				image: mainImage ? {
					label: "",
					url: mainImage.edgeUrl,
					filesize: mainImage.size
				} : undefined,
				externalID: `${post.id}`,
				categoryID: catIDs.length > 0 ? catIDs.join(",") : undefined
			},
			properties,
			seo: null,
			scripts: null
		}

		batch.push(contentItem)


		if (batch.length >= 10) {
			//save the batch
			await updateBatchContentItems({ contentItems: batch })

			batch = []

		}

	}

	//if there are any left over posts in the batch, save them
	if (batch.length > 0) {
		//save the batch
		await updateBatchContentItems({ contentItems: batch })
		batch = []

	}

}