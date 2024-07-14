
import { ApiClient, ContentItem, ContentItemProperties, Options } from "@agility/management-sdk";
import { performReplacements } from "./performReplacements";

import { resolveMedia } from "./resolveMedia";
import { Post } from "./types/Post";
import { updateBatchContentItems } from "./lib/updateBatchContentItems";
import { DateTime } from "luxon";
import { ListParams } from "@agility/management-sdk/dist/models/listParams";
import { getContentItems } from "./lib/getContentItems";
import { getExistingCategories } from "./get-existing-categories";

interface Props {

	posts: Post[]
}

export const resolveCategories = async ({ posts }: Props): Promise<any[]> => {

	//grab the existing categories
	const existingCategories = await getExistingCategories()

	//when we have a full batch of posts, do the save all at once..
	let batch: ContentItem[] = []

	let uniqueCategories: string[] = []

	//loop through the posts
	for (let i = 0; i < posts.length; i++) {

		let post = posts[i]

		post.categories.forEach(cat => {
			if (!uniqueCategories.includes(cat)) {

				//check if the category exists in Agility
				const existingCat = existingCategories.find((c: any) => c.title === cat)
				if (!existingCat) {
					uniqueCategories.push(cat)
				}
			}
		});
	}


	for (let i = 0; uniqueCategories.length; i++) {
		const cat = uniqueCategories[i]

		//create the categories
		let contentID = -1

		const properties: ContentItemProperties = new ContentItemProperties()
		properties.referenceName = "categories"

		//create the content item
		const contentItem: ContentItem = {
			contentID: contentID,
			fields: {
				title: cat
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


	return await getExistingCategories()
}