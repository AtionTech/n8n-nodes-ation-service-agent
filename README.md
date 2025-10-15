# n8n-nodes-ation-service-agent

Community node for connecting n8n to the Ation Service Agent API. Use it to trigger automation tasks managed by Ation, monitor their progress, collect reports, and react to webhook callbacks inside your workflows.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Developer instructions](#developer-instructions)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [official community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) or install from the n8n UI by referencing this package name.

## Operations

The node exposes the **Task Runner** resource of the Ation Service Agent API:

- Execute a task from a selected project template (supports dry-run mode).
- Check the status of an existing task.
- Fetch the generated HTML task report.
- Stop or force stop a running task.
- Dynamically load available projects and templates based on your credentials.

The bundle also ships with an **Ation Service Agent Trigger** node that accepts incoming webhooks for task status updates.

## Credentials

Create credentials of type **Ation Service Agent API** in n8n:

- `Ation Service Agent URL`: Base URL of your Ation deployment, e.g. `https://ation.example.com`.
- `Access Token`: API token with permission to manage tasks. It is sent as a Bearer token on every request.

The credential test issues a `GET /api/user/` request to verify the token.

## Compatibility

- Built with `@n8n/node-cli` and `n8n-workflow` 1.82.x.
- Tested with n8n `>= 1.0`. No specific incompatibilities are known.

## Usage

1. Add the **Ation Service Agent** node to your workflow and select the Task Runner resource.
2. Choose or expression-set a project and template; both dropdowns query the API for live data.
3. Run the workflow to create or manage tasks, then chain follow-up nodes using the JSON response.
4. Optionally add the trigger node, expose it via n8n’s webhook URL, and configure Ation to call it when task statuses change.

## Developer instructions

1. Install the n8n node CLI globally (or run with `npx`): `npm install --global @n8n/node-cli`.
2. Install dependencies in this repo: `npm install` (or `pnpm install`).
3. Develop with live recompilation via `n8n-node dev` and run tests/linters with the provided npm scripts.
4. Build distributable assets with `n8n-node build` before publishing.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- Internal Ation Service Agent API docs (contact your Ation administrator).

## Version history

- `0.1.0` – Initial public release with task operations and webhook trigger.
