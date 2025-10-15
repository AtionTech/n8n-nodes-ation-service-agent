import type {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';


export class AtionServiceAgentTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ation Service Agent Trigger',
		name: 'ationServiceAgentTrigger',
		icon: { light: 'file:ationServiceAgent.svg', dark: 'file:ationServiceAgent.dark.svg' },
		group: ['trigger'],
		version: [1],
		description: 'Receive task status updates from the Ation Service Agent',
		defaults: {
			name: 'Ation Service Agent Trigger',
		},
		usableAsTool: undefined,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: '={{$parameter["webhookPath"]}}',
			},
		],
		defaultVersion: 1,
		properties: [
			{
				displayName: 'Webhook Path',
				name: 'webhookPath',
				type: 'string',
				required: true,
				placeholder: 'ation-service-agent/task-status',
				default: 'ation-service-agent/task-status',
				description:
					'Path segment to receive Ation Service Agent callbacks. The full URL is &lt;webhook-URL&gt;/&lt;path&gt;.',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const webhookName = this.getWebhookName();
		if (webhookName !== 'default') {
			return {
				workflowData: [],
				webhookResponse: {
					success: false,
				},
			};
		}

		const bodyData = this.getBodyData();
		const toNumber = (value: unknown): number | null => {
			const parsed = Number(value);
			return Number.isFinite(parsed) ? parsed : null;
		};

		const jsonData: IDataObject = {
			name: bodyData?.name ?? null,
			project_id: toNumber(bodyData?.project_id),
			project_name: bodyData?.project_name ?? null,
			report: bodyData?.report ?? null,
			status: bodyData?.status ?? null,
			task_id: toNumber(bodyData?.task_id),
			template_id: toNumber(bodyData?.template_id),
			version: bodyData?.version ?? null,
		};

		const item: INodeExecutionData = { json: jsonData };

		return {
			workflowData: [[item]],
			webhookResponse: {
				success: true,
			},
		};
	}
}
