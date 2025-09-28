import type { INodeProperties } from 'n8n-workflow';

export const listOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['list'],
			},
		},
		options: [
			{
				name: 'Add Leads',
				value: 'addLeads',
				description: 'Add leads to a list',
				action: 'Add leads to a list',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create an empty list',
				action: 'Create a list',
			},
			{
				name: 'Delete Leads',
				value: 'deleteLeads',
				description: 'Delete leads from a list',
				action: 'Delete leads from a list',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a list by ID',
				action: 'Get a list',
			},
			{
				name: 'Get Companies',
				value: 'getCompanies',
				description: 'Get companies from a company list',
				action: 'Get companies from a list',
			},
			{
				name: 'Get Leads',
				value: 'getLeads',
				description: 'Get leads from a list',
				action: 'Get leads from a list',
			},
			{
				name: 'Get Lists for Lead',
				value: 'getListsForLead',
				description: 'Get all lists containing a specific lead',
				action: 'Get lists for a lead',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many lists',
				action: 'Get many lists',
			},
		],
		default: 'getAll',
	},
];

export const listFields: INodeProperties[] = [
	{
		displayName: 'List ID',
		name: 'listId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['get', 'addLeads', 'deleteLeads', 'getLeads', 'getCompanies'],
			},
		},
		default: 0,
		required: true,
		description: 'The ID of the list',
	},
	{
		displayName: 'List Name',
		name: 'listName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'Name of the list to create',
	},
	{
		displayName: 'List Type',
		name: 'listType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Lead List',
				value: 'USER_LIST',
			},
			{
				name: 'Company List',
				value: 'COMPANY_LIST',
			},
		],
		default: 'USER_LIST',
		description: 'Type of list to create',
	},
	{
		displayName: 'Delete By',
		name: 'deleteBy',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['deleteLeads'],
			},
		},
		options: [
			{
				name: 'LinkedIn ID',
				value: 'linkedinId',
			},
			{
				name: 'Profile URL',
				value: 'profileUrl',
			},
		],
		default: 'linkedinId',
		description: 'How to identify leads to delete',
	},
	{
		displayName: 'Lead Member IDs',
		name: 'leadMemberIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['deleteLeads'],
				deleteBy: ['linkedinId'],
			},
		},
		default: '',
		placeholder: '1111,2222,3333',
		description: 'Comma-separated LinkedIn IDs of leads to delete',
	},
	{
		displayName: 'Profile URLs',
		name: 'profileUrls',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['deleteLeads'],
				deleteBy: ['profileUrl'],
			},
		},
		default: '',
		placeholder: 'https://linkedin.com/in/user1,https://linkedin.com/in/user2',
		description: 'Comma-separated LinkedIn profile URLs of leads to delete',
	},
	{
		displayName: 'Lead Email',
		name: 'leadEmail',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['getListsForLead'],
			},
		},
		default: '',
		placeholder: 'john@example.com',
		description: "Lead's email address",
	},
	{
		displayName: 'Lead LinkedIn ID',
		name: 'leadLinkedInId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['getListsForLead'],
			},
		},
		default: '',
		description: "Lead's LinkedIn ID",
	},
	{
		displayName: 'Lead Profile URL',
		name: 'leadProfileUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['getListsForLead'],
			},
		},
		default: '',
		placeholder: 'https://www.linkedin.com/in/john-doe',
		description: "Lead's LinkedIn profile URL",
	},
	// Pagination
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['getAll', 'getLeads', 'getCompanies', 'getListsForLead'],
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
				resource: ['list'],
				operation: ['getAll', 'getLeads', 'getCompanies', 'getListsForLead'],
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