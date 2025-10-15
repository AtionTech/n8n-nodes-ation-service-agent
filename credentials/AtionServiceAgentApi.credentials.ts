import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AtionServiceAgentApi implements ICredentialType {
	name = 'ationServiceAgentApi';
	icon = { light: 'file:ationServiceAgent.svg', dark: 'file:ationServiceAgent.svg' } as Icon;
	displayName = 'Ation Service Agent API';
	// Link to your community node's README
	documentationUrl = 'https://github.com/org/-ation-service-agent?tab=readme-ov-file#credentials';
 
	properties: INodeProperties[] = [
		{
			displayName: 'Ation Service Agent URL',
			name: 'url',
			type: 'string',
			required: true,
			default: 'http://ationsa:3000'
        },
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: '/api/user/',
			method: 'GET',
        },
	};
}
