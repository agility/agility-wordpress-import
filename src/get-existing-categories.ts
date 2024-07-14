import { getContentItems } from "./lib/getContentItems"

export const getExistingCategories = async (): Promise<any[]> => {

	const guid = process.env.AGILITY_GUID || ""
	const token = process.env.AGILITY_TOKEN || ""

	const existingCats = await getContentItems({ referenceName: "categories", guid, locale: "en-us", skip: 0, take: 100, token, fields: "contentID,title", filter: "" })
	const existingCategories = existingCats.items[0]

	return existingCategories
}