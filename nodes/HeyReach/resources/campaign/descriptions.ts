import type { INodeProperties } from 'n8n-workflow';

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
			},
		},
		options: [
			{
				name: 'Add Leads',
				value: 'addLeads',
				description: 'Add leads to a campaign',
				action: 'Add leads to a campaign',
			},
			{
				name: 'Add Leads V2',
				value: 'addLeadsV2',
				description: 'Add leads to a campaign (enhanced version)',
				action: 'Add leads to a campaign v2',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a campaign by ID',
				action: 'Get a campaign',
			},
			{
				name: 'Get Campaigns for Lead',
				value: 'getCampaignsForLead',
				description: 'Get all campaigns where a lead is enrolled',
				action: 'Get campaigns for a lead',
			},
			{
				name: 'Get Leads',
				value: 'getLeads',
				description: 'Get leads from a campaign',
				action: 'Get leads from a campaign',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many campaigns',
				action: 'Get many campaigns',
			},
			{
				name: 'Pause',
				value: 'pause',
				description: 'Pause a campaign',
				action: 'Pause a campaign',
			},
			{
				name: 'Resume',
				value: 'resume',
				description: 'Resume a campaign',
				action: 'Resume a campaign',
			},
			{
				name: 'Stop Lead',
				value: 'stopLead',
				description: 'Stop a lead\'s progression in a campaign',
				action: 'Stop a lead in campaign',
			},
		],
		default: 'getAll',
	},
];

export const fields: INodeProperties[] = [
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['get', 'pause', 'resume', 'addLeads', 'addLeadsV2', 'getLeads', 'stopLead'],
			},
		},
		default: 0,
		description: 'The ID of the campaign',
	},
	// ... Rest of the campaign fields from the original file
];

// Export combined descriptions for the main node
export default [...operations, ...fields];