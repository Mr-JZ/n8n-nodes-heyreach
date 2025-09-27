import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HeyReachApi implements ICredentialType {
	name = 'heyReachApi';

	displayName = 'HeyReach API';

	documentationUrl = 'https://docs.heyreach.io';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your HeyReach API key. You can find it in your HeyReach account settings.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
				'Content-Type': 'application/json',
				'Accept': 'text/plain',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.heyreach.io',
			url: '/api/public/auth/CheckApiKey',
			method: 'GET',
		},
	};
}