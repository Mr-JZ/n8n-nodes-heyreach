import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { heyReachApiRequest } from '../../GenericFunctions';

export async function executeStats(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	if (operation === 'getOverallStats') {
		const accountIdsString = this.getNodeParameter('accountIds', i) as string;
		const campaignIdsString = this.getNodeParameter('campaignIds', i) as string;
		const startDate = this.getNodeParameter('startDate', i) as string;
		const endDate = this.getNodeParameter('endDate', i) as string;

		// Build request body
		const body: IDataObject = {
			startDate: new Date(startDate).toISOString(),
			endDate: new Date(endDate).toISOString(),
		};

		// Parse account IDs if provided
		if (accountIdsString) {
			const accountIds = accountIdsString
				.split(',')
				.map(id => parseInt(id.trim()))
				.filter(id => !isNaN(id));
			body.accountIds = accountIds;
		} else {
			body.accountIds = [];
		}

		// Parse campaign IDs if provided
		if (campaignIdsString) {
			const campaignIds = campaignIdsString
				.split(',')
				.map(id => parseInt(id.trim()))
				.filter(id => !isNaN(id));
			body.campaignIds = campaignIds;
		} else {
			body.campaignIds = [];
		}

		const responseData = await heyReachApiRequest.call(
			this,
			'POST',
			'/api/public/stats/GetOverallStats',
			body,
		);
		returnData.push(responseData);
	}

	return returnData;
}