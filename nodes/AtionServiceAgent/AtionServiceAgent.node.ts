import {
	NodeConnectionTypes,
	NodeOperationError,
	type ILoadOptionsFunctions,
	type INodePropertyOptions,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import { taskDescription } from './resources/task';

export class AtionServiceAgent implements INodeType {
	methods = {
		loadOptions: {
			async getProjects(this: ILoadOptionsFunctions) {
				const credentials = (await this.getCredentials('ationServiceAgentApi')) as {
					url?: string;
					accessToken?: string;
				};

				if (!credentials?.url) {
					throw new NodeOperationError(this.getNode(), 'Missing credentials for Ation Service Agent API');
				}

				const baseUrl = credentials.url.replace(/\/$/, '');

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'ationServiceAgentApi',
					{
						method: 'GET',
						url: `${baseUrl}/api/projects`,
					},
				);

				if (!Array.isArray(response)) {
					return [] as INodePropertyOptions[];
				}

				return response
					.filter((project) => project && project.id && project.name)
					.map((project) => ({
						name: project.name as string,
						value: String(project.id),
					})) as INodePropertyOptions[];
			},
			async getProjectTemplates(this: ILoadOptionsFunctions) {
				const credentials = (await this.getCredentials('ationServiceAgentApi')) as {
					url?: string;
					bearerToken?: string;
				};

				if (!credentials?.url) {
					throw new NodeOperationError(this.getNode(), 'Missing credentials for Ation Service Agent API');
				}

				const projectId = this.getCurrentNodeParameter('projectId') as string;

				if (!projectId) {
					return [] as INodePropertyOptions[];
				}

				const baseUrl = credentials.url.replace(/\/$/, '');

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'ationServiceAgentApi',
					{
						method: 'GET',
						url: `${baseUrl}/api/project/${projectId}/templates`,
						qs: {
							sort: 'name',
							order: 'desc',
						},
					},
				);

				if (!Array.isArray(response)) {
					return [] as INodePropertyOptions[];
				}

				return response
					.filter((template) => template && template.id && template.name)
					.map((template) => ({
						name: template.name as string,
						value: String(template.id),
					})) as INodePropertyOptions[];
			},
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Ation Service Agent',
		name: 'ationServiceAgent',
		icon: { light: 'file:ationServiceAgent.svg', dark: 'file:ationServiceAgent.dark.svg' },
		group: ['transform'],
		version: [1],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Ation Service Agent API',
		defaults: {
			name: 'Ation Service Agent',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'ationServiceAgentApi', required: true }],
		requestDefaults: {
			baseURL: '={{$credentials["url"]}}/api'
				//'={{$credentials["url"].endsWith("/") ? $credentials["url"].slice(0, -1) : $credentials["url"]}}/api',
		},
		defaultVersion: 1,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Task Runner',
						value: 'task',
					}
				],
				default: 'task',
			},
			...taskDescription,
		],
	};
}
