import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTaskRun = {
	operation: ['run'],
	resource: ['task'],
};

const showProjectScopedTaskOperations = {
	operation: ['run', 'getStatus', 'stop', 'forceStop'],
	resource: ['task'],
};

const showTaskId = {
	operation: ['getReport', 'getStatus', 'stop', 'forceStop'],
	resource: ['task'],
};

export const taskRunDescription: INodeProperties[] = [
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getProjects',
		},
		noDataExpression: false,
		placeholder: 'Select a project...',
		displayOptions: {
			show: showProjectScopedTaskOperations,
		},
		default: '',
		description: 'Project to use when running the task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		routing: {
			send: {
				type: 'body',
				property: 'project_id',
				value: '={{Number($value ?? 0)}}',
			},
		},
	},
	
	{
		displayName: 'Template Name or ID',
		name: 'templateId',
		type: 'options',
		required: true,
		noDataExpression: false,
		typeOptions: {
			loadOptionsMethod: 'getProjectTemplates',
			loadOptionsDependsOn: ['projectId'],
		},
		placeholder: 'Select a template...',
		displayOptions: {
			show: showOnlyForTaskRun,
		},
		default: '',
		description: 'Template to use when running the task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		routing: {
			send: {
				type: 'body',
				property: 'template_id',
				value: '={{Number($value ?? 0)}}',
			},
		},
	},
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		noDataExpression: false,
		displayOptions: {
			show: showTaskId,
		},
		default: '',
		description: 'ID of the task to operate on. Specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		routing: {
			send: {
				type: 'query',
				property: 'taskId',
				value: '={{$value}}',
			},
		},
	},
	{
		displayName: 'Options',
		name: 'optionalFields',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: showOnlyForTaskRun,
		},
		options: [
			{
				displayName: 'Execution Description',
				name: 'taskDescription',
				type: 'string',
				default: '',
				description: 'Optional description for the task run',
			},
			{
				displayName: 'Dry Run',
				name: 'dryRun',
				type: 'boolean',
				default: false,
				description: 'Whether to simulate execution without taking action',
				routing: {
					send: {
						type: 'body',
						property: 'dry_run',
						value: '={{$value}}',
					},
				},
			},
		],
	},
];
