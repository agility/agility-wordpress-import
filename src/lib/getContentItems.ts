

import * as agilitySDK from "@agility/management-sdk"
import { getMgmtAPIURL } from "./getMgmtAPIURL"

interface Props {
	token: string
	guid: string,
	referenceName: string
	sortField?: string,
	sortDirection?: string,
	locale: string | null | undefined,
	skip: number,
	take: number
	filter: string | undefined,
	fields: string
}


export const getContentItems = async ({ token, guid, locale, referenceName, skip, take, filter, sortDirection, sortField, fields }: Props) => {
	const queryStrings = `fields=${fields}&sortDirection=${sortDirection}&sortField=${sortField}&take=${take}&skip=${skip}`
	const url = `${getMgmtAPIURL(guid)}instance/${guid}/${locale}/list/${referenceName}?${queryStrings}`


	const body = {
		modifiedByIds: [],
		stateIds: [],
		dateRange: {},
		fieldFilters: [],
		genericSearch: filter
	}

	const res = await fetch(url, {
		method: "POST",
		body: JSON.stringify(body),
		headers: { Authorization: `BEARER ${token}`, 'Content-Type': 'application/json' }
	})

	const json = await res.json()

	return json
}