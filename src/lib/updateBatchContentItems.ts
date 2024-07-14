import { ApiClient, ContentItem, Options } from "@agility/management-sdk"



interface Props {
	contentItems: ContentItem[]
}


export const updateBatchContentItems = async ({ contentItems }: Props) => {

	//save the post
	const guid = process.env.AGILITY_GUID || ""
	const options = new Options()

	options.token = process.env.AGILITY_TOKEN || ""

	const apiClient = new ApiClient(options)


	const ret = await apiClient.contentMethods.saveContentItems(contentItems, guid, "en-us")

	console.log("Saved content items", ret)


}