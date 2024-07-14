export const getMgmtAPIURL = (guid: string) => {
	let mgmtApiUrl = "https://mgmt.aglty.io/api/v1/"

	//transform the manager url...
	if (guid.endsWith("-d")) {
		//dev/uat
		mgmtApiUrl = "https://mgmt-dev.aglty.io/api/v1/"
	} else if (guid.endsWith("-c")) {
		//canada
		mgmtApiUrl = "https://mgmt-ca.aglty.io/api/v1/"
	} else if (guid.endsWith("-e")) {
		//europe
		mgmtApiUrl = "https://mgmt-eu.aglty.io/api/v1/"
	} else if (guid.endsWith("-a")) {
		//australia
		mgmtApiUrl = "https://mgmt-aus.aglty.io/api/v1/"
	}

	return mgmtApiUrl
}