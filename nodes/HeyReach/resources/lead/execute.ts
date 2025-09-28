import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { heyReachApiRequest } from '../../GenericFunctions';

export async function executeLead(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	const profileUrl = this.getNodeParameter('profileUrl', i) as string;

	if (operation === 'get') {
		const responseData = await heyReachApiRequest.call(
			this,
			'POST',
			'/api/public/lead/GetLead',
			{ profileUrl },
		);
		returnData.push(responseData);
	}

	if (operation === 'getTags') {
		const responseData = await heyReachApiRequest.call(
			this,
			'POST',
			'/api/public/lead/GetTags',
			{ profileUrl },
		);
		returnData.push(responseData);
	}

	if (operation === 'addTags' || operation === 'replaceTags') {
		const tagsString = this.getNodeParameter('tags', i) as string;
		const tags = tagsString
			.split(',')
			.map(tag => tag.trim())
			.filter(tag => tag);

		const endpoint =
			operation === 'addTags'
				? '/api/public/lead/AddTags'
				: '/api/public/lead/ReplaceTags';

		const responseData = await heyReachApiRequest.call(
			this,
			'POST',
			endpoint,
			{
				leadProfileUrl: profileUrl,
				tags,
				createTagIfNotExisting: true,
			},
		);
		returnData.push({ success: true, profileUrl, tags, ...responseData });
	}

	return returnData;
}