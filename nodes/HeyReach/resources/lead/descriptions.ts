import type { INodeProperties } from 'n8n-workflow';

export const leadOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lead'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get lead details',
				action: 'Get a lead',
			},
			{
				name: 'Add Tags',
				value: 'addTags',
				description: 'Add tags to a lead',
				action: 'Add tags to a lead',
			},
			{
				name: 'Get Tags',
				value: 'getTags',
				description: 'Get tags for a lead',
				action: 'Get tags for a lead',
			},
			{
				name: 'Replace Tags',
				value: 'replaceTags',
				description: 'Replace all tags for a lead',
				action: 'Replace tags for a lead',
			},
		],
		default: 'get',
	},
];

export const leadFields: INodeProperties[] = [
	{
		displayName: 'Profile URL',
		name: 'profileUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['get', 'addTags', 'getTags', 'replaceTags'],
			},
		},
		default: '',
		placeholder: 'https://www.linkedin.com/in/john-doe',
		description: 'LinkedIn profile URL of the lead',
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['addTags', 'replaceTags'],
			},
		},
		default: '',
		placeholder: 'tag1,tag2,tag3',
		description: 'Comma-separated list of tags',
	},
];