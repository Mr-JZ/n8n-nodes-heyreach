import type { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new webhook',
			action: 'Create a webhook',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a webhook',
			action: 'Delete a webhook',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get webhook details',
			action: 'Get a webhook',
		},
		{
			name: 'Get Many',
			value: 'getAll',
			description: 'Get many webhooks',
			action: 'Get many webhooks',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a webhook',
			action: 'Update a webhook',
		},
	],
	default: 'getAll',
};

export const webhookFields: INodeProperties[] = [
	// Webhook Create fields
	{
		displayName: 'URL',
		name: 'webhookUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		required: true,
		default: '',
		placeholder: 'https://your-domain.com/webhook',
		description: 'The URL where webhook events will be sent',
	},
	{
		displayName: 'Event Type',
		name: 'eventType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				name: 'Campaign Completed',
				value: 'CAMPAIGN_COMPLETED',
			},
			{
				name: 'Connection Request Accepted',
				value: 'CONNECTION_REQUEST_ACCEPTED',
			},
			{
				name: 'Connection Request Sent',
				value: 'CONNECTION_REQUEST_SENT',
			},
			{
				name: 'Follow Sent',
				value: 'FOLLOW_SENT',
			},
			{
				name: 'InMail Reply Received',
				value: 'INMAIL_REPLY_RECEIVED',
			},
			{
				name: 'InMail Sent',
				value: 'INMAIL_SENT',
			},
			{
				name: 'Lead Tag Updated',
				value: 'LEAD_TAG_UPDATED',
			},
			{
				name: 'Liked Post',
				value: 'LIKED_POST',
			},
			{
				name: 'Message Reply Received',
				value: 'MESSAGE_REPLY_RECEIVED',
			},
			{
				name: 'Message Sent',
				value: 'MESSAGE_SENT',
			},
			{
				name: 'Viewed Profile',
				value: 'VIEWED_PROFILE',
			},
		],
		default: 'MESSAGE_SENT',
		description: 'The type of event that will trigger the webhook',
	},
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create', 'update'],
			},
		},
		default: 0,
		description: 'Optional: Associate webhook with a specific campaign. Leave 0 for all campaigns.',
	},
	{
		displayName: 'Active',
		name: 'isActive',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create', 'update'],
			},
		},
		default: true,
		description: 'Whether the webhook is active',
	},

	// Webhook ID for operations
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'update', 'delete'],
			},
		},
		required: true,
		default: '',
		description: 'The ID of the webhook',
	},

	// Update specific fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'https://your-domain.com/webhook',
				description: 'The URL where webhook events will be sent',
			},
			{
				displayName: 'Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is active',
			},
		],
	},

	// Pagination for getAll
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];