import type { INodeProperties } from 'n8n-workflow';

export const statsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['stats'],
			},
		},
		options: [
			{
				name: 'Get Overall Stats',
				value: 'getOverallStats',
				description: 'Get overall statistics for campaigns and accounts',
				action: 'Get overall statistics',
			},
		],
		default: 'getOverallStats',
	},
];

export const statsFields: INodeProperties[] = [
	{
		displayName: 'Account IDs',
		name: 'accountIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['stats'],
				operation: ['getOverallStats'],
			},
		},
		default: '',
		placeholder: '1234,5678',
		description: 'Comma-separated LinkedIn account IDs. Leave empty for all accounts.',
	},
	{
		displayName: 'Campaign IDs',
		name: 'campaignIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['stats'],
				operation: ['getOverallStats'],
			},
		},
		default: '',
		placeholder: '123,456',
		description: 'Comma-separated campaign IDs. Leave empty for all campaigns.',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['stats'],
				operation: ['getOverallStats'],
			},
		},
		default: '',
		required: true,
		description: 'Start date for the stats period',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['stats'],
				operation: ['getOverallStats'],
			},
		},
		default: '',
		required: true,
		description: 'End date for the stats period',
	},
];