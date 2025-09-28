import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { heyReachApiRequest, heyReachApiRequestAllItems } from '../../GenericFunctions';

export async function executeInbox(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	if (operation === 'getConversations' || operation === 'getConversationsV2') {
		const returnAll = this.getNodeParameter('returnAll', i);
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		// Build the request body
		const body: IDataObject = {
			offset: 0,
			limit: returnAll ? 100 : this.getNodeParameter('limit', i),
			filters: {},
		};

		// Process filters
		if (filters.linkedInAccountIds) {
			const ids = (filters.linkedInAccountIds as string)
				.split(',')
				.map(id => parseInt(id.trim()))
				.filter(id => !isNaN(id));
			if (ids.length > 0) {
				(body.filters as IDataObject).linkedInAccountIds = ids;
			}
		}

		if (filters.campaignIds) {
			const ids = (filters.campaignIds as string)
				.split(',')
				.map(id => parseInt(id.trim()))
				.filter(id => !isNaN(id));
			if (ids.length > 0) {
				(body.filters as IDataObject).campaignIds = ids;
			}
		}

		if (filters.searchString) {
			(body.filters as IDataObject).searchString = filters.searchString;
		}

		if (filters.seen !== undefined) {
			(body.filters as IDataObject).seen = filters.seen;
		}

		const endpoint =
			operation === 'getConversationsV2'
				? '/api/public/inbox/GetConversationsV2'
				: '/api/public/inbox/GetConversations';

		if (returnAll) {
			const conversations = await heyReachApiRequestAllItems.call(
				this,
				'POST',
				endpoint,
				body,
			);
			returnData.push(...conversations);
		} else {
			const responseData = await heyReachApiRequest.call(
				this,
				'POST',
				endpoint,
				body,
			);
			returnData.push(...(responseData.items || responseData));
		}
	}

	if (operation === 'getChatroom') {
		const chatroomId = this.getNodeParameter('chatroomId', i) as string;
		const responseData = await heyReachApiRequest.call(
			this,
			'GET',
			'/api/public/inbox/GetChatroom',
			{},
			{ chatroomId },
		);
		returnData.push(responseData);
	}

	if (operation === 'sendMessage') {
		const linkedInAccountId = this.getNodeParameter('linkedInAccountId', i) as number;
		const recipientProfileUrl = this.getNodeParameter('recipientProfileUrl', i) as string;
		const message = this.getNodeParameter('message', i) as string;

		const body: IDataObject = {
			linkedInAccountId,
			recipientProfileUrl,
			message,
		};

		const responseData = await heyReachApiRequest.call(
			this,
			'POST',
			'/api/public/inbox/SendMessage',
			body,
		);
		returnData.push({ success: true, ...responseData });
	}

	return returnData;
}