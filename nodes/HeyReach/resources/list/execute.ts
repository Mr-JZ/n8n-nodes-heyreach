import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { heyReachApiRequest, heyReachApiRequestAllItems } from '../../GenericFunctions';

export async function executeList(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i);

		if (returnAll) {
			const lists = await heyReachApiRequestAllItems.call(
				this,
				'POST',
				'/api/public/list/GetAll',
				{ offset: 0, limit: 100 },
			);
			returnData.push(...lists);
		} else {
			const limit = this.getNodeParameter('limit', i);
			const responseData = await heyReachApiRequest.call(
				this,
				'POST',
				'/api/public/list/GetAll',
				{ offset: 0, limit },
			);
			returnData.push(...(responseData.items || responseData));
		}
	}

	if (operation === 'get') {
		const listId = this.getNodeParameter('listId', i);
		const responseData = await heyReachApiRequest.call(
			this,
			'GET',
			'/api/public/list/GetById',
			{},
			{ listId },
		);
		returnData.push(responseData);
	}

	if (operation === 'create') {
		const name = this.getNodeParameter('listName', i) as string;
		const type = this.getNodeParameter('listType', i) as string;

		const body: IDataObject = {
			name,
			type,
		};

		const responseData = await heyReachApiRequest.call(
			this,
			'POST',
			'/api/public/list/CreateEmptyList',
			body,
		);
		returnData.push(responseData);
	}

	if (operation === 'getLeads') {
		const listId = this.getNodeParameter('listId', i);
		const returnAll = this.getNodeParameter('returnAll', i);

		const body: IDataObject = {
			listId,
			offset: 0,
			limit: returnAll ? 100 : this.getNodeParameter('limit', i),
		};

		if (returnAll) {
			const leads = await heyReachApiRequestAllItems.call(
				this,
				'POST',
				'/api/public/list/GetLeadsFromList',
				body,
			);
			returnData.push(...leads);
		} else {
			const responseData = await heyReachApiRequest.call(
				this,
				'POST',
				'/api/public/list/GetLeadsFromList',
				body,
			);
			returnData.push(...(responseData.items || responseData));
		}
	}

	if (operation === 'getCompanies') {
		const listId = this.getNodeParameter('listId', i);
		const returnAll = this.getNodeParameter('returnAll', i);

		const body: IDataObject = {
			listId,
			offset: 0,
			limit: returnAll ? 100 : this.getNodeParameter('limit', i),
		};

		if (returnAll) {
			const companies = await heyReachApiRequestAllItems.call(
				this,
				'POST',
				'/api/public/list/GetCompaniesFromList',
				body,
			);
			returnData.push(...companies);
		} else {
			const responseData = await heyReachApiRequest.call(
				this,
				'POST',
				'/api/public/list/GetCompaniesFromList',
				body,
			);
			returnData.push(...(responseData.items || responseData));
		}
	}

	if (operation === 'deleteLeads') {
		const listId = this.getNodeParameter('listId', i);
		const deleteBy = this.getNodeParameter('deleteBy', i) as string;

		if (deleteBy === 'linkedinId') {
			const leadMemberIdsString = this.getNodeParameter('leadMemberIds', i) as string;
			const leadMemberIds = leadMemberIdsString
				.split(',')
				.map(id => id.trim())
				.filter(id => id);

			const body: IDataObject = {
				listId,
				leadMemberIds,
			};

			const responseData = await heyReachApiRequest.call(
				this,
				'DELETE',
				'/api/public/list/DeleteLeadsFromList',
				body,
			);
			returnData.push({
				success: true,
				listId,
				deletedLeadsCount: leadMemberIds.length,
				...responseData,
			});
		} else {
			const profileUrlsString = this.getNodeParameter('profileUrls', i) as string;
			const profileUrls = profileUrlsString
				.split(',')
				.map(url => url.trim())
				.filter(url => url);

			const body: IDataObject = {
				listId,
				profileUrls,
			};

			const responseData = await heyReachApiRequest.call(
				this,
				'DELETE',
				'/api/public/list/DeleteLeadsFromListByProfileUrl',
				body,
			);
			returnData.push({
				success: true,
				listId,
				deletedLeadsCount: profileUrls.length,
				...responseData,
			});
		}
	}

	if (operation === 'addLeads') {
		const listId = this.getNodeParameter('listId', i);
		// For now, we'll use a simple implementation
		// In production, you'd want to add more fields for lead data
		const responseData = await heyReachApiRequest.call(
			this,
			'POST',
			'/api/public/list/AddLeadsToListV2',
			{ listId },
		);
		returnData.push({ success: true, listId, ...responseData });
	}

	if (operation === 'getListsForLead') {
		const returnAll = this.getNodeParameter('returnAll', i);
		const body: IDataObject = {
			offset: 0,
			limit: returnAll ? 100 : this.getNodeParameter('limit', i),
		};

		// Add optional parameters
		const email = this.getNodeParameter('leadEmail', i) as string;
		const linkedinId = this.getNodeParameter('leadLinkedInId', i) as string;
		const profileUrl = this.getNodeParameter('leadProfileUrl', i) as string;

		if (email) body.email = email;
		if (linkedinId) body.linkedinId = linkedinId;
		if (profileUrl) body.profileUrl = profileUrl;

		if (returnAll) {
			const lists = await heyReachApiRequestAllItems.call(
				this,
				'POST',
				'/api/public/list/GetListsForLead',
				body,
			);
			returnData.push(...lists);
		} else {
			const responseData = await heyReachApiRequest.call(
				this,
				'POST',
				'/api/public/list/GetListsForLead',
				body,
			);
			returnData.push(...(responseData.items || responseData));
		}
	}

	return returnData;
}