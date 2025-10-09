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

// Import resource descriptions
import { inboxOperations, inboxFields } from './resources/inbox/descriptions';
import { leadOperations, leadFields } from './resources/lead/descriptions';
import { listOperations, listFields } from './resources/list/descriptions';
import { statsOperations, statsFields } from './resources/stats/descriptions';

// Import resource executors
import { executeInbox } from './resources/inbox/execute';
import { executeLead } from './resources/lead/execute';
import { executeList } from './resources/list/execute';
import { executeStats } from './resources/stats/execute';

// Import campaign resources (already exist)
import campaignDescriptions from './resources/campaign/descriptions';
import { execute as executeCampaign } from './resources/campaign/execute';

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
			// Resource selector
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
				],
				default: 'campaign',
			},

			// Import operations and fields from modules
			...campaignDescriptions,
			...inboxOperations,
			...inboxFields,
			...leadOperations,
			...leadFields,
			...listOperations,
			...listFields,
			...statsOperations,
			...statsFields,

			// LinkedIn Account operations (simplified inline for now)
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

			// MyNetwork operations (simplified inline for now)
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
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['myNetwork'],
						operation: ['getNetwork'],
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
						resource: ['myNetwork'],
						operation: ['getNetwork'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},

			// Shared pagination fields
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['linkedinAccount'],
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
						resource: ['linkedinAccount'],
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
				let responseData: IDataObject[] = [];

				// Route to appropriate resource handler
				switch (resource) {
					case 'campaign':
						responseData = await executeCampaign.call(this, operation as string, i);
						break;
					case 'inbox':
						responseData = await executeInbox.call(this, operation as string, i);
						break;
					case 'lead':
						responseData = await executeLead.call(this, operation as string, i);
						break;
					case 'list':
						responseData = await executeList.call(this, operation as string, i);
						break;
					case 'stats':
						responseData = await executeStats.call(this, operation as string, i);
						break;
					case 'linkedinAccount':
						responseData = await executeLinkedInAccount.call(this, operation as string, i);
						break;
					case 'myNetwork':
						responseData = await executeMyNetwork.call(this, operation as string, i);
						break;
				}

				returnData.push(...responseData);
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

// LinkedIn Account executor (could be moved to separate file)
async function executeLinkedInAccount(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject[]> {
		const returnData: IDataObject[] = [];

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

		return returnData;
	}

// MyNetwork executor (could be moved to separate file)
async function executeMyNetwork(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject[]> {
		const returnData: IDataObject[] = [];

		if (operation === 'getNetwork') {
			const senderAccountId = this.getNodeParameter('senderAccountId', i) as number;
			const returnAll = this.getNodeParameter('returnAll', i);

			const body: IDataObject = {
				senderId: senderAccountId,
				pageNumber: 0,
				pageSize: returnAll ? 100 : this.getNodeParameter('limit', i),
			};

			if (returnAll) {
				const connections = await heyReachApiRequestAllItems.call(
					this,
					'POST',
					'/api/public/MyNetwork/GetMyNetworkForSender',
					body,
				);
				returnData.push(...connections);
			} else {
				const responseData = await heyReachApiRequest.call(
					this,
					'POST',
					'/api/public/MyNetwork/GetMyNetworkForSender',
					body,
				);
				returnData.push(...(responseData.items || responseData));
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

		return returnData;
	}