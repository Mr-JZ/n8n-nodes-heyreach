import type {
	IExecuteFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { heyReachApiRequest, heyReachApiRequestAllItems } from './GenericFunctions';

export class HeyReach implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HeyReach',
		name: 'heyReach',
		icon: 'file:heyreach.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with HeyReach API',
		defaults: {
			name: 'HeyReach',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'heyReachApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Campaign',
						value: 'campaign',
					},
					{
						name: 'Inbox',
						value: 'inbox',
					},
					{
						name: 'Lead',
						value: 'lead',
					},
					{
						name: 'LinkedIn Account',
						value: 'linkedinAccount',
					},
					{
						name: 'List',
						value: 'list',
					},
					{
						name: 'My Network',
						value: 'myNetwork',
					},
					{
						name: 'Stat',
						value: 'stats',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
				],
				default: 'campaign',
			},

			// Campaign Operations
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
						name: 'Get',
						value: 'get',
						description: 'Get a campaign by ID',
						action: 'Get a campaign',
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
				],
				default: 'getAll',
			},

			// Inbox Operations
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

			// Lead Operations
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

			// List Operations
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

			// LinkedIn Account Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['linkedinAccount'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a LinkedIn account by ID',
						action: 'Get a linkedin account',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many LinkedIn accounts',
						action: 'Get many linkedin accounts',
					},
				],
				default: 'getAll',
			},

			// MyNetwork Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['myNetwork'],
					},
				},
				options: [
					{
						name: 'Get Network',
						value: 'getNetwork',
						description: 'Get connections for a LinkedIn account',
						action: 'Get network connections',
					},
					{
						name: 'Is Connection',
						value: 'isConnection',
						description: 'Check if someone is a connection',
						action: 'Check if is connection',
					},
				],
				default: 'getNetwork',
			},

			// Stats Operations
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

			// Common Fields
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['get', 'pause', 'resume', 'addLeads', 'getLeads'],
					},
				},
				default: 0,
				description: 'The ID of the campaign',
			},

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

			// List Fields
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

			// Inbox Fields
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

			// LinkedIn Account Fields
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['linkedinAccount'],
						operation: ['get'],
					},
				},
				default: 0,
				required: true,
				description: 'The ID of the LinkedIn account',
			},

			// Stats Fields
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

			// MyNetwork Fields
			{
				displayName: 'Sender Account ID',
				name: 'senderAccountId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['myNetwork'],
						operation: ['getNetwork', 'isConnection'],
					},
				},
				default: 0,
				required: true,
				description: 'The ID of the LinkedIn sender account',
			},
			{
				displayName: 'Lead Profile URL',
				name: 'leadProfileUrl',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['myNetwork'],
						operation: ['isConnection'],
					},
				},
				default: '',
				placeholder: 'https://www.linkedin.com/in/john-doe',
				description: 'LinkedIn profile URL of the lead to check',
			},
			{
				displayName: 'Page Number',
				name: 'pageNumber',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['myNetwork'],
						operation: ['getNetwork'],
					},
				},
				default: 0,
				description: 'Page number for pagination (0-based)',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['myNetwork'],
						operation: ['getNetwork'],
					},
				},
				default: 100,
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				description: 'Number of connections per page (max 100)',
			},

			// Pagination
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['campaign', 'linkedinAccount', 'list', 'inbox'],
						operation: ['getAll', 'getLeads', 'getCompanies', 'getListsForLead', 'getConversations', 'getConversationsV2'],
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
						resource: ['campaign', 'linkedinAccount', 'list', 'inbox'],
						operation: ['getAll', 'getLeads', 'getCompanies', 'getListsForLead', 'getConversations', 'getConversationsV2'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
		],
	};

	methods = {
		loadOptions: {
			// Load campaigns for dropdown
			async getCampaigns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const campaigns = await heyReachApiRequestAllItems.call(
					this,
					'POST',
					'/api/public/campaign/GetAll',
					{ offset: 0, limit: 100 },
				);

				for (const campaign of campaigns) {
					returnData.push({
						name: campaign.name || `Campaign ${campaign.id}`,
						value: campaign.id,
					});
				}

				return returnData;
			},

			// Load LinkedIn accounts for dropdown
			async getLinkedInAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const accounts = await heyReachApiRequestAllItems.call(
					this,
					'POST',
					'/api/public/linkedinaccount/GetAll',
					{ offset: 0, limit: 100 },
				);

				for (const account of accounts) {
					const name = account.fullName || account.name || `Account ${account.id}`;
					returnData.push({
						name,
						value: account.id,
					});
				}

				return returnData;
			},

			// Load lists for dropdown
			async getLists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const lists = await heyReachApiRequestAllItems.call(
					this,
					'POST',
					'/api/public/list/GetAll',
					{ offset: 0, limit: 100 },
				);

				for (const list of lists) {
					const name = `${list.name} (${list.count || 0} items)`;
					returnData.push({
						name,
						value: list.id,
					});
				}

				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'campaign') {
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);

						if (returnAll) {
							const campaigns = await heyReachApiRequestAllItems.call(
								this,
								'POST',
								'/api/public/campaign/GetAll',
								{ offset: 0, limit: 100 },
							);
							returnData.push(...campaigns);
						} else {
							const limit = this.getNodeParameter('limit', i);
							const responseData = await heyReachApiRequest.call(
								this,
								'POST',
								'/api/public/campaign/GetAll',
								{ offset: 0, limit },
							);
							returnData.push(...(responseData.items || responseData));
						}
					}

					if (operation === 'get') {
						const campaignId = this.getNodeParameter('campaignId', i);
						const responseData = await heyReachApiRequest.call(
							this,
							'GET',
							'/api/public/campaign/GetById',
							{},
							{ campaignId },
						);
						returnData.push(responseData);
					}

					if (operation === 'pause') {
						const campaignId = this.getNodeParameter('campaignId', i);
						const responseData = await heyReachApiRequest.call(
							this,
							'POST',
							'/api/public/campaign/Pause',
							{ campaignId },
						);
						returnData.push({ success: true, campaignId, ...responseData });
					}

					if (operation === 'resume') {
						const campaignId = this.getNodeParameter('campaignId', i);
						const responseData = await heyReachApiRequest.call(
							this,
							'POST',
							'/api/public/campaign/Resume',
							{ campaignId },
						);
						returnData.push({ success: true, campaignId, ...responseData });
					}

					if (operation === 'getLeads') {
						const campaignId = this.getNodeParameter('campaignId', i);
						const returnAll = this.getNodeParameter('returnAll', i);

						const body: IDataObject = {
							campaignId,
							offset: 0,
							limit: returnAll ? 100 : this.getNodeParameter('limit', i),
						};

						if (returnAll) {
							const leads = await heyReachApiRequestAllItems.call(
								this,
								'POST',
								'/api/public/campaign/GetLeadsFromCampaign',
								body,
							);
							returnData.push(...leads);
						} else {
							const responseData = await heyReachApiRequest.call(
								this,
								'POST',
								'/api/public/campaign/GetLeadsFromCampaign',
								body,
							);
							returnData.push(...(responseData.items || responseData));
						}
					}
				}

				if (resource === 'lead') {
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
						const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);

						const endpoint = operation === 'addTags'
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
				}

				// LinkedIn Account resource
				if (resource === 'linkedinAccount') {
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);

						if (returnAll) {
							const accounts = await heyReachApiRequestAllItems.call(
								this,
								'POST',
								'/api/public/linkedinaccount/GetAll',
								{ offset: 0, limit: 100 },
							);
							returnData.push(...accounts);
						} else {
							const limit = this.getNodeParameter('limit', i);
							const responseData = await heyReachApiRequest.call(
								this,
								'POST',
								'/api/public/linkedinaccount/GetAll',
								{ offset: 0, limit },
							);
							returnData.push(...(responseData.items || responseData));
						}
					}

					if (operation === 'get') {
						const accountId = this.getNodeParameter('accountId', i);
						const responseData = await heyReachApiRequest.call(
							this,
							'GET',
							'/api/public/linkedinaccount/GetById',
							{},
							{ accountId },
						);
						returnData.push(responseData);
					}
				}

				// Inbox resource
				if (resource === 'inbox') {
					if (operation === 'getConversations' || operation === 'getConversationsV2') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						// Build the request body
						const body: IDataObject = {
							offset: 0,
							limit: returnAll ? 100 : this.getNodeParameter('limit', i),
							filters: {},
						};

						// Process filters
						if (filters.linkedInAccountIds) {
							const ids = (filters.linkedInAccountIds as string).split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
							if (ids.length > 0) {
								(body.filters as IDataObject).linkedInAccountIds = ids;
							}
						}

						if (filters.campaignIds) {
							const ids = (filters.campaignIds as string).split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
							if (ids.length > 0) {
								(body.filters as IDataObject).campaignIds = ids;
							}
						}

						if (filters.searchString) {
							(body.filters as IDataObject).searchString = filters.searchString;
						}

						if (filters.seen !== undefined) {
							(body.filters as IDataObject).seen = filters.seen;
						}

						const endpoint = operation === 'getConversationsV2'
							? '/api/public/inbox/GetConversationsV2'
							: '/api/public/inbox/GetConversations';

						if (returnAll) {
							const conversations = await heyReachApiRequestAllItems.call(
								this,
								'POST',
								endpoint,
								body,
							);
							returnData.push(...conversations);
						} else {
							const responseData = await heyReachApiRequest.call(
								this,
								'POST',
								endpoint,
								body,
							);
							returnData.push(...(responseData.items || responseData));
						}
					}

					if (operation === 'getChatroom') {
						const chatroomId = this.getNodeParameter('chatroomId', i) as string;
						const responseData = await heyReachApiRequest.call(
							this,
							'GET',
							'/api/public/inbox/GetChatroom',
							{},
							{ chatroomId },
						);
						returnData.push(responseData);
					}

					if (operation === 'sendMessage') {
						const linkedInAccountId = this.getNodeParameter('linkedInAccountId', i) as number;
						const recipientProfileUrl = this.getNodeParameter('recipientProfileUrl', i) as string;
						const message = this.getNodeParameter('message', i) as string;

						const body: IDataObject = {
							linkedInAccountId,
							recipientProfileUrl,
							message,
						};

						const responseData = await heyReachApiRequest.call(
							this,
							'POST',
							'/api/public/inbox/SendMessage',
							body,
						);
						returnData.push({ success: true, ...responseData });
					}
				}

				// MyNetwork resource
				if (resource === 'myNetwork') {
					if (operation === 'getNetwork') {
						const senderAccountId = this.getNodeParameter('senderAccountId', i) as number;
						const pageNumber = this.getNodeParameter('pageNumber', i) as number;
						const pageSize = this.getNodeParameter('pageSize', i) as number;

						const body: IDataObject = {
							senderId: senderAccountId,
							pageNumber,
							pageSize,
						};

						const responseData = await heyReachApiRequest.call(
							this,
							'POST',
							'/api/public/MyNetwork/GetMyNetworkForSender',
							body,
						);

						// If response has items array, spread it, otherwise push the whole response
						if (responseData.items && Array.isArray(responseData.items)) {
							returnData.push(...responseData.items);
						} else {
							returnData.push(responseData);
						}
					}

					if (operation === 'isConnection') {
						const senderAccountId = this.getNodeParameter('senderAccountId', i) as number;
						const leadProfileUrl = this.getNodeParameter('leadProfileUrl', i) as string;

						const body: IDataObject = {
							senderAccountId,
							leadProfileUrl,
						};

						const responseData = await heyReachApiRequest.call(
							this,
							'POST',
							'/api/public/MyNetwork/IsConnection',
							body,
						);
						returnData.push(responseData);
					}
				}

				// List resource
				if (resource === 'list') {
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
							const leadMemberIds = leadMemberIdsString.split(',').map(id => id.trim()).filter(id => id);

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
							returnData.push({ success: true, listId, deletedLeadsCount: leadMemberIds.length, ...responseData });
						} else {
							const profileUrlsString = this.getNodeParameter('profileUrls', i) as string;
							const profileUrls = profileUrlsString.split(',').map(url => url.trim()).filter(url => url);

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
							returnData.push({ success: true, listId, deletedLeadsCount: profileUrls.length, ...responseData });
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
				}

				// Stats resource
				if (resource === 'stats') {
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
							const accountIds = accountIdsString.split(',')
								.map(id => parseInt(id.trim()))
								.filter(id => !isNaN(id));
							body.accountIds = accountIds;
						} else {
							body.accountIds = [];
						}

						// Parse campaign IDs if provided
						if (campaignIdsString) {
							const campaignIds = campaignIdsString.split(',')
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
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}