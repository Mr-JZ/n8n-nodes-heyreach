import type { INodeProperties } from 'n8n-workflow';

export const inboxOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['inbox'],
			},
		},
		options: [
			{
				name: 'Get Chatroom',
				value: 'getChatroom',
				description: 'Get detailed information about a specific chatroom',
				action: 'Get a chatroom',
			},
			{
				name: 'Get Conversations',
				value: 'getConversations',
				description: 'Get LinkedIn conversations',
				action: 'Get conversations',
			},
			{
				name: 'Get Conversations V2',
				value: 'getConversationsV2',
				description: 'Get LinkedIn conversations with enhanced features',
				action: 'Get conversations v2',
			},
			{
				name: 'Send Message',
				value: 'sendMessage',
				description: 'Send a message to a LinkedIn user',
				action: 'Send a message',
			},
		],
		default: 'getConversations',
	},
];

export const inboxFields: INodeProperties[] = [
	// Chatroom Fields
	{
		displayName: 'Chatroom ID',
		name: 'chatroomId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['getChatroom'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the chatroom to retrieve',
	},
	{
		displayName: 'LinkedIn Account ID',
		name: 'linkedInAccountId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['sendMessage'],
			},
		},
		default: 0,
		required: true,
		description: 'The LinkedIn account ID to send the message from',
	},
	{
		displayName: 'Recipient Profile URL',
		name: 'recipientProfileUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['sendMessage'],
			},
		},
		default: '',
		required: true,
		placeholder: 'https://www.linkedin.com/in/john-doe',
		description: 'LinkedIn profile URL of the message recipient',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['sendMessage'],
			},
		},
		default: '',
		required: true,
		description: 'The message content to send',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['getConversations', 'getConversationsV2'],
			},
		},
		options: [
			{
				displayName: 'LinkedIn Account IDs',
				name: 'linkedInAccountIds',
				type: 'string',
				default: '',
				placeholder: '123,456',
				description: 'Comma-separated LinkedIn account IDs to filter by',
			},
			{
				displayName: 'Campaign IDs',
				name: 'campaignIds',
				type: 'string',
				default: '',
				placeholder: '789,012',
				description: 'Comma-separated campaign IDs to filter by',
			},
			{
				displayName: 'Search String',
				name: 'searchString',
				type: 'string',
				default: '',
				description: 'Text to search for in conversations',
			},
			{
				displayName: 'Seen',
				name: 'seen',
				type: 'boolean',
				default: false,
				description: 'Whether to filter by seen/unseen conversations',
			},
		],
	},
	// Pagination
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['getConversations', 'getConversationsV2'],
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
				resource: ['inbox'],
				operation: ['getConversations', 'getConversationsV2'],
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