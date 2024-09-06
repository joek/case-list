const client = require('@sap-cloud-sdk/http-client');


async function getCases(req, res) {
	res.setHeader('Content-Type', 'application/json');
	console.log(req.query);
	const accountId = req.query['accountId']
	const response = await client.executeHttpRequest({destinationName: "service-cloud", jwt: req.tokenInfo.getTokenValue()}, { method: 'get', url: `/sap/c4c/api/v1/case-service/cases?$filter=(isIrrelevant%20eq%20null%20or%20isIrrelevant%20eq%20false)%20and%20(account.displayId%20eq%20${accountId})%20and%20(status%20ne%2007)&$orderby=adminData.updatedOn%20desc` });
	res.send(response.data.value);
}

async function updateCase(req,res){
	const id = req.params.id
	if (!id){
		console.log("No id found")
		res.data({error: "No id"})
		res.status(500).send()
	}
	const caseResp = await client.executeHttpRequest({destinationName: "service-cloud", jwt: req.tokenInfo.getTokenValue()}, { method: 'get', url: `/sap/c4c/api/v1/case-service/cases/${id}` });
	console.log(req.tokenInfo.getTokenValue())
	const caseUpdateResp = await client.executeHttpRequest(
		{destinationName: "service-cloud", jwt: req.tokenInfo.getTokenValue()}, 
		{ method: 'patch', url: `/sap/c4c/api/v1/case-service/cases/${id}`, data: {escalationStatus: "ESCALATED"}, headers: { custom: {'If-Match': caseResp.headers['etag']}}}
	)
	res.status(201).send()
}


module.exports = {
	getCases,
	updateCase
}