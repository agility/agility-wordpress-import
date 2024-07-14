import { ApiClient, ContentList, Options } from "@agility/management-sdk"
import { ListParams } from "@agility/management-sdk/dist/models/listParams"
import { getContentItems } from "./lib/getContentItems"


export const getExistingPosts = async (): Promise<any[]> => {

	const guid = process.env.AGILITY_GUID || ""


	const token = process.env.AGILITY_TOKEN || ""

	let allPosts: any[] = []

	let lstParams: ListParams = new ListParams()
	let existingPosts: any
	let skip = 0
	lstParams.take = 100

	do {

		lstParams.skip = skip
		existingPosts = await getContentItems({ referenceName: "posts", guid, locale: "en-us", skip, take: 100, token, fields: "contentID,title,externalID", filter: "" })

		skip += existingPosts.items[0].length || 0

		if (existingPosts?.items) {
			allPosts.push(...existingPosts.items[0])
		}

	} while ((existingPosts.items[0].length || 0) >= 100)

	return allPosts

}