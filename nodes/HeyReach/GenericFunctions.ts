import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

/**
 * Make an authenticated API request to HeyReach
 */
export async function heyReachApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<any> {
	const options: IHttpRequestOptions = {
		method,
		body,
		qs: query,
		url: `https://api.heyreach.io${endpoint}`,
		json: true,
	};

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'heyReachApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make paginated requests to HeyReach API
 */
export async function heyReachApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<any[]> {
	const returnData: IDataObject[] = [];
	let offset = 0;
	const limit = 100;

	let responseData;
	do {
		const requestBody = { ...body, offset, limit };
		responseData = await heyReachApiRequest.call(this, method, endpoint, requestBody, query);

		if (responseData.items && Array.isArray(responseData.items)) {
			returnData.push(...responseData.items);
			offset += limit;
		} else if (Array.isArray(responseData)) {
			returnData.push(...responseData);
			break;
		} else {
			break;
		}
	} while (responseData.items && responseData.items.length === limit);

	return returnData;
}

/**
 * Get available webhook event types
 */
export function getWebhookEventTypes(): Array<{ name: string; value: string; description: string }> {
	return [
		{
			name: 'Connection Request Sent',
			value: 'CONNECTION_REQUEST_SENT',
			description: 'Triggered when a connection request is sent',
		},
		{
			name: 'Connection Request Accepted',
			value: 'CONNECTION_REQUEST_ACCEPTED',
			description: 'Triggered when a connection request is accepted',
		},
		{
			name: 'Message Sent',
			value: 'MESSAGE_SENT',
			description: 'Triggered when a message is sent',
		},
		{
			name: 'Message Reply Received',
			value: 'MESSAGE_REPLY_RECEIVED',
			description: 'Triggered when a message reply is received',
		},
		{
			name: 'InMail Sent',
			value: 'INMAIL_SENT',
			description: 'Triggered when an InMail is sent',
		},
		{
			name: 'InMail Reply Received',
			value: 'INMAIL_REPLY_RECEIVED',
			description: 'Triggered when an InMail reply is received',
		},
		{
			name: 'Follow Sent',
			value: 'FOLLOW_SENT',
			description: 'Triggered when a follow action is sent',
		},
		{
			name: 'Post Liked',
			value: 'LIKED_POST',
			description: 'Triggered when a post is liked',
		},
		{
			name: 'Profile Viewed',
			value: 'VIEWED_PROFILE',
			description: 'Triggered when a profile is viewed',
		},
		{
			name: 'Campaign Completed',
			value: 'CAMPAIGN_COMPLETED',
			description: 'Triggered when a campaign is completed',
		},
		{
			name: 'Lead Tag Updated',
			value: 'LEAD_TAG_UPDATED',
			description: 'Triggered when a lead tag is updated',
		},
	];
}