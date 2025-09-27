# Webhook Trigger Node Guide

This guide explains how webhook-based trigger nodes in n8n are structured, using the existing Stripe and Flow triggers as examples. It is written for contributors who are new to the codebase and want to implement similar functionality for another service.

## Trigger Lifecycle Overview

n8n activates trigger nodes when a workflow is switched on. Each node describes a webhook entry in its `description.webhooks` array and implements lifecycle handlers in `webhookMethods`:

- `checkExists` runs first to see whether the external webhook already exists.
- `create` runs if no webhook is found and registers one with the external API.
- `delete` runs on deactivation to clean up the remote webhook.
- The `webhook` function receives incoming requests and decides whether the workflow should execute.

All three lifecycle methods share state through `this.getWorkflowStaticData('node')`, which behaves like a small key–value store scoped to the workflow + node. Use it to cache webhook IDs, secrets, or other metadata returned by the provider.

## Stripe Trigger Walkthrough (`packages/nodes-base/nodes/Stripe/StripeTrigger.node.ts`)

1. **Node declaration**: The `description` object sets `group: ['trigger']`, removes inputs, and defines a single POST webhook named `default` that listens at `/webhook` relative to the REST API base path.
2. **`checkExists`**: Reads `webhookId` from static data. If present, it calls Stripe’s `/webhook_endpoints/{id}`; a `404` or `resource_missing` error indicates the endpoint was removed, so the saved ID is cleared.
3. **`create`**: Builds the request body with the node’s user-selected `events`, optional `apiVersion`, and the runtime-generated `webhookUrl` from `getNodeWebhookUrl('default')`. After calling `stripeApiRequest` (a helper that handles auth and error translation), it validates the response and saves `webhookId`, `webhookEvents`, and `webhookSecret` in static data for reuse.
4. **`delete`**: If an ID is stored, it issues a DELETE to `/webhook_endpoints/{id}` and removes all cached Stripe fields so the next activation starts clean.
5. **`webhook` handler**: Reads the incoming payload’s `type` and only returns data to the workflow if it matches the configured events (or the wildcard `*`). Returning an empty object tells n8n to skip execution.

## Flow Trigger Walkthrough (`packages/nodes-base/nodes/Flow/FlowTrigger.node.ts`)

1. **Node declaration**: Similar setup with a `default` POST webhook. Properties let users select Flow resources (projects or tasks) that should generate events.
2. **`checkExists`**: Static data stores an array `webhookIds`. On activation it requests the organization’s `/integration_webhooks` list using `flowApiRequest` and confirms each saved ID is still present. Missing IDs cause the method to return `false`, prompting a re-create.
3. **`create`**: Splits the comma-separated resource IDs selected in the node UI, then loops. For each ID it POSTs to `/integration_webhooks` with the webhook URL, resource type, and numeric resource ID, pushing every returned webhook ID into the static array.
4. **`delete`**: Iterates through the stored IDs, deleting each `/integration_webhooks/{id}` and finally clearing `webhookIds` from static data.
5. **`webhook` handler**: Converts the raw request body into JSON items and hands them straight to the workflow so downstream nodes can filter or transform as needed.

## Implementing a New Webhook Trigger

When you create a new trigger node for another service, follow this checklist:

1. Define the node as a trigger (`inputs: []`, `group: ['trigger']`) and register at least one webhook entry under `description.webhooks`.
2. Use static data (`getWorkflowStaticData('node')`) to persist the webhook identifiers your provider returns. Keep the structure simple (single ID vs. array) and clear it whenever a DELETE succeeds.
3. Implement `checkExists` to be tolerant: handle 404/410 responses, strip saved state on failures, and return `false` so n8n knows to call `create`.
4. In `create`, build the provider-specific payload, call a helper that wraps authentication, and verify the response before saving IDs or secrets.
5. Make `delete` best-effort; catch errors, but only clear static data when the remote deletion succeeds.
6. Keep the `webhook` handler narrow: filter by event type if possible, return `{}` to ignore unrelated events, and return `workflowData` with structured JSON when accepting them.

## Quick Reference

- Static storage key: `const webhookData = this.getWorkflowStaticData('node');`
- Webhook URL helper: `const webhookUrl = this.getNodeWebhookUrl('default');`
- n8n helper types: `IHookFunctions`, `IWebhookFunctions`, `IWebhookResponseData` from `n8n-workflow`.
- Error handling: throw `NodeApiError` when the provider returns unexpected data so the UI surfaces actionable errors.

By mirroring these patterns you ensure the new trigger behaves consistently with existing nodes, respects activation/deactivation hooks, and keeps remote webhook registrations tidy.
