import type { INodeProperties } from 'n8n-workflow';
import { taskRunDescription } from './run';

const showOnlyForTasks = {
	resource: ['task'],
};

export const taskDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForTasks,
		},
		options: [
			{
				name: 'Execute a Task',
				value: 'run',
				action: 'Execute a task',
				description: 'Trigger a task from a project template',
				routing: {
					request: {
						method: 'POST',
						url: '=/project/{{$parameter["projectId"]}}/tasks',
						body: {
							project_id: '={{Number($parameter["projectId"] ?? 0)}}',
							template_id: '={{Number($parameter["templateId"] ?? 0)}}',
							environment: '={{$parameter["taskDescription"] && $parameter["taskDescription"].length > 3 ? JSON.stringify({ reason: $parameter["taskDescription"] }) : "{}"}}',
							parent_id: 0,
							dry_run: '={{$parameter["dryRun"]}}',
						},
					},
				},
			},
			{
				name: 'Get Task Report',
				value: 'getReport',
				action: 'Get task report',
				description: 'Get the report of a completed task',
				routing: {
					request: {
						method: 'GET',
						url: '=/reports/Ation-Report-{{$parameter["taskId"]}}.html',
					},
				},
			},
			{
				name: 'Get Task Status',
				value: 'getStatus',
				action: 'Get task status',
				description: 'Get the status of a running task',
				routing: {
					request: {
						method: 'GET',
						url: '=/project/{{$parameter["projectId"]}}/tasks/{{$parameter["taskId"]}}',
					},
				},
			},
			{
				name: 'Stop a Task',
				value: 'stop',
				action: 'Stop a task',
				description: 'Stop a running task',
				routing: {
					request: {
						method: 'POST',
						url: '=/project/{{$parameter["projectId"]}}/tasks/{{$parameter["taskId"]}}/stop',
					},
				},
			},
			{
				name: 'Stop a Task (Force)',
				value: 'forceStop',
				action: 'Force stop a task',
				description: 'Force stop a running task',
				routing: {
					request: {
						method: 'POST',
						url: '=/project/{{$parameter["projectId"]}}/tasks/{{$parameter["taskId"]}}/stop',
						body: {
							force: true,
						},
					},
				},
			},
		],
		default: 'run',
	},
	...taskRunDescription,
];
