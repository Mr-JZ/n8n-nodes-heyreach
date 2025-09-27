import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { heyReachApiRequest, heyReachApiRequestAllItems } from '../../GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject[]> {
	switch (operation) {
		case 'getAll':
			return await getAll.call(this, i);
		case 'get':
			return await get.call(this, i);
		case 'pause':
			return await pause.call(this, i);
		case 'resume':
			return await resume.call(this, i);
		case 'getLeads':
			return await getLeads.call(this, i);
		case 'stopLead':
			return await stopLead.call(this, i);
		case 'getCampaignsForLead':
			return await getCampaignsForLead.call(this, i);
		case 'addLeads':
		case 'addLeadsV2':
			return await addLeads.call(this, i, operation);
		default:
			throw new Error(`Operation "${operation}" not implemented for campaign resource`);
	}
}

async function getAll(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', i);

	if (returnAll) {
		return await heyReachApiRequestAllItems.call(
			this,
			'POST',
			'/api/public/campaign/GetAll',
			{ offset: 0, limit: 100 },
		);
	} else {
		const limit = this.getNodeParameter('limit', i);
		const responseData = await heyReachApiRequest.call(
			this,
			'POST',
			'/api/public/campaign/GetAll',
			{ offset: 0, limit },
		);
		return responseData.items || [responseData];
	}
}

async function get(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const campaignId = this.getNodeParameter('campaignId', i);
	const responseData = await heyReachApiRequest.call(
		this,
		'GET',
		'/api/public/campaign/GetById',
		{},
		{ campaignId },
	);
	return [responseData];
}

async function pause(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const campaignId = this.getNodeParameter('campaignId', i);
	const responseData = await heyReachApiRequest.call(
		this,
		'POST',
		'/api/public/campaign/Pause',
		{ campaignId },
	);
	return [{ success: true, campaignId, ...responseData }];
}

async function resume(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const campaignId = this.getNodeParameter('campaignId', i);
	const responseData = await heyReachApiRequest.call(
		this,
		'POST',
		'/api/public/campaign/Resume',
		{ campaignId },
	);
	return [{ success: true, campaignId, ...responseData }];
}

async function getLeads(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const campaignId = this.getNodeParameter('campaignId', i);
	const returnAll = this.getNodeParameter('returnAll', i);

	const body: IDataObject = {
		campaignId,
		offset: 0,
		limit: returnAll ? 100 : this.getNodeParameter('limit', i),
	};

	if (returnAll) {
		return await heyReachApiRequestAllItems.call(
			this,
			'POST',
			'/api/public/campaign/GetLeadsFromCampaign',
			body,
		);
	} else {
		const responseData = await heyReachApiRequest.call(
			this,
			'POST',
			'/api/public/campaign/GetLeadsFromCampaign',
			body,
		);
		return responseData.items || [responseData];
	}
}

async function stopLead(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const campaignId = this.getNodeParameter('campaignId', i);
	const leadMemberId = this.getNodeParameter('leadMemberId', i) as string;
	const leadUrl = this.getNodeParameter('leadUrl', i) as string;

	const body: IDataObject = {
		campaignId,
		leadMemberId,
		leadUrl,
	};

	const responseData = await heyReachApiRequest.call(
		this,
		'POST',
		'/api/public/campaign/StopLeadInCampaign',
		body,
	);
	return [{ success: true, campaignId, leadMemberId, leadUrl, ...responseData }];
}

async function getCampaignsForLead(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', i);
	const leadIdentifierType = this.getNodeParameter('leadIdentifierType', i) as string;

	const body: IDataObject = {
		offset: 0,
		limit: returnAll ? 100 : this.getNodeParameter('limit', i),
	};

	// Add the appropriate identifier
	if (leadIdentifierType === 'email') {
		body.email = this.getNodeParameter('leadEmailForCampaigns', i) as string;
	} else if (leadIdentifierType === 'linkedinId') {
		body.linkedinId = this.getNodeParameter('leadLinkedInIdForCampaigns', i) as string;
	} else if (leadIdentifierType === 'profileUrl') {
		body.profileUrl = this.getNodeParameter('leadProfileUrlForCampaigns', i) as string;
	}

	if (returnAll) {
		return await heyReachApiRequestAllItems.call(
			this,
			'POST',
			'/api/public/campaign/GetCampaignsForLead',
			body,
		);
	} else {
		const responseData = await heyReachApiRequest.call(
			this,
			'POST',
			'/api/public/campaign/GetCampaignsForLead',
			body,
		);
		return responseData.items || [responseData];
	}
}

async function addLeads(this: IExecuteFunctions, i: number, operation: string): Promise<IDataObject[]> {
	const campaignId = this.getNodeParameter('campaignId', i);
	const leadData = this.getNodeParameter('leadData', i) as IDataObject;
	const customFields = this.getNodeParameter('customUserFields', i) as IDataObject;

	// Build lead object
	const lead: IDataObject = {
		firstName: leadData.firstName || '',
		lastName: leadData.lastName || '',
		profileUrl: leadData.profileUrl || '',
		location: leadData.location || '',
		summary: leadData.summary || '',
		companyName: leadData.companyName || '',
		position: leadData.position || '',
		about: leadData.about || '',
		emailAddress: leadData.emailAddress || '',
	};

	// Add custom fields if provided
	if (customFields.fields && Array.isArray(customFields.fields)) {
		lead.customUserFields = customFields.fields;
	}

	const linkedInAccountId = leadData.linkedInAccountId || 0;

	const body: IDataObject = {
		campaignId,
		accountLeadPairs: [
			{
				lead,
				linkedInAccountId,
			},
		],
	};

	const endpoint = operation === 'addLeadsV2'
		? '/api/public/campaign/AddLeadsToCampaignV2'
		: '/api/public/campaign/AddLeadsToCampaign';

	const responseData = await heyReachApiRequest.call(
		this,
		'POST',
		endpoint,
		body,
	);
	return [{ success: true, campaignId, ...responseData }];
}