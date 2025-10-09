import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { heyReachApiRequest, getWebhookEventTypes } from '../HeyReach/GenericFunctions';

export class HeyReachTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HeyReach Trigger',
		name: 'heyReachTrigger',
		icon: 'file:heyreach.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when HeyReach events occur',
		defaults: {
			name: 'HeyReach Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'heyReachApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: getWebhookEventTypes(),
				default: ['MESSAGE_REPLY_RECEIVED'],
				required: true,
				description: 'The events to listen for',
			},
			{
				displayName: 'Campaign IDs',
				name: 'campaignIds',
				type: 'string',
				default: '',
				placeholder: '123,456,789',
				description: 'Comma-separated list of campaign IDs to filter events. Leave empty to listen to all campaigns.',
			},
			{
				displayName: 'Webhook Name',
				name: 'webhookName',
				type: 'string',
				default: 'n8n Webhook',
				description: 'Name for the webhook in HeyReach (max 25 characters)',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookIds === undefined) {
					return false;
				}

				const webhookIds = webhookData.webhookIds as number[];

				for (const webhookId of webhookIds) {
					const endpoint = `/api/public/webhooks/GetWebhookById`;
					try {
						await heyReachApiRequest.call(this, 'GET', endpoint, {}, { webhookId });
					} catch (error) {
						delete webhookData.webhookIds;
						delete webhookData.webhookEvents;
						delete webhookData.webhookCampaignIds;
						return false;
					}
				}

				return true;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const campaignIdsParam = this.getNodeParameter('campaignIds', '') as string;
				const webhookName = this.getNodeParameter('webhookName') as string;

				// Parse campaign IDs
				const campaignIds: number[] = [];
				if (campaignIdsParam.trim()) {
					const ids = campaignIdsParam.split(',').map(id => parseInt(id.trim(), 10));
					campaignIds.push(...ids.filter(id => !isNaN(id)));
				}

				const webhookData = this.getWorkflowStaticData('node');

				// Clear any existing webhook data
				webhookData.webhookIds = [];
				webhookData.webhookEvents = events;
				webhookData.webhookCampaignIds = campaignIdsParam;

				// Create a webhook for each event type (HeyReach requires separate webhooks per event)
				for (const eventType of events) {
					// Ensure webhook name doesn't exceed 25 characters (API limit)
					let finalWebhookName = webhookName;
					if (events.length > 1) {
						// If multiple events, abbreviate the event type
						const eventAbbr = eventType.split('_').map(word => word[0]).join('');
						finalWebhookName = `${webhookName.substring(0, 20)}-${eventAbbr}`;
					}
					// Ensure final name is within 25 character limit
					finalWebhookName = finalWebhookName.substring(0, 25);

					const body: IDataObject = {
						webhookName: finalWebhookName,
						webhookUrl,
						eventType,
						campaignIds,
						isActive: true,
					};

					const endpoint = '/api/public/webhooks/CreateWebhook';
					try {
						const responseData = await heyReachApiRequest.call(this, 'POST', endpoint, body);

						// Store the webhook ID - API returns { webhookId: number }
						const webhookId = responseData.webhookId || responseData.id;
						(webhookData.webhookIds as number[]).push(webhookId);

						// Store first webhook ID for backward compatibility
						if (!webhookData.webhookId) {
							webhookData.webhookId = webhookId;
						}
					} catch (error) {
						// If any webhook creation fails, delete all created webhooks
						if (webhookData.webhookIds && (webhookData.webhookIds as number[]).length > 0) {
							for (const id of webhookData.webhookIds as number[]) {
								const deleteEndpoint = `/api/public/webhooks/DeleteWebhook`;
								try {
									await heyReachApiRequest.call(this, 'DELETE', deleteEndpoint, {}, { webhookId: id });
								} catch (deleteError) {
									// Continue even if deletion fails
								}
							}
							delete webhookData.webhookIds;
							delete webhookData.webhookEvents;
							delete webhookData.webhookCampaignIds;
						}
						throw error;
					}
				}

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				// Get all webhook IDs to delete
				const webhookIds = (webhookData.webhookIds as number[]) || [];

				// Also check for legacy single webhook ID
				if (webhookData.webhookId && !webhookIds.includes(webhookData.webhookId as number)) {
					webhookIds.push(webhookData.webhookId as number);
				}

				// Delete each webhook
				for (const webhookId of webhookIds) {
					const endpoint = `/api/public/webhooks/DeleteWebhook`;
					try {
						await heyReachApiRequest.call(this, 'DELETE', endpoint, {}, { webhookId });
					} catch (error) {
						// Continue trying to delete other webhooks even if one fails
						// The webhook might already be deleted on HeyReach's side
					}
				}

				// Clear all stored webhook data
				delete webhookData.webhookId;
				delete webhookData.webhookIds;
				delete webhookData.webhookEvents;
				delete webhookData.webhookCampaignIds;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		const events = this.getNodeParameter('events') as string[];

		const eventType = bodyData.eventType as string;
		if (!eventType || !events.includes(eventType)) {
			return {};
		}

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}