# Claude Development Notes

## n8n Node Development

### Useful Commands for Searching n8n Codebase

Use these grep patterns to search the n8n repository for examples:

1. **Find webhook trigger implementations:**
   ```bash
   grep -r "webhookMethods" packages/nodes-base/nodes --include="*.ts"
   ```

2. **Find trigger node patterns:**
   ```bash
   grep -r "implements INodeType" packages/nodes-base/nodes --include="*.ts" | grep -i trigger
   ```

3. **Find webhook function signatures:**
   ```bash
   grep -r "IWebhookFunctions" packages/nodes-base/nodes --include="*.ts"
   ```

4. **Find API request helpers:**
   ```bash
   grep -r "ApiRequest" packages/nodes-base/nodes --include="*.ts"
   ```

5. **Find credential implementations:**
   ```bash
   grep -r "ICredentialType" packages/nodes-base/credentials --include="*.ts"
   ```

### n8n Community Node Structure

Based on research, here's what's needed for a HeyReach community node:

1. **Package.json Configuration:**
   - Must include `"n8n-community-node-package"` in keywords
   - Configure the `n8n` section with API version, nodes, and credentials paths
   - Use TypeScript and ESLint for development

2. **Node Types Needed:**
   - **HeyReach Trigger Node**: For webhook events (webhooks from HeyReach)
   - **HeyReach API Node**: For making API calls to HeyReach endpoints

3. **Credentials:**
   - API Key authentication using `X-API-KEY` header

4. **Development Commands:**
   - `npm run dev` - Start development server with hot reload
   - `npm run build` - Build for distribution
   - `npm run lint` - Check code quality

### HeyReach API Endpoints to Implement

Based on the API documentation, these are the key endpoints to support:

1. **Authentication:** `GET /api/public/auth/CheckApiKey`
2. **Campaigns:** Create, get, pause, resume, add leads
3. **Leads:** Get lead info, manage tags
4. **Lists:** Create, manage lead lists
5. **Inbox:** Send messages, get conversations
6. **Stats:** Get campaign statistics
7. **Webhooks:** Manage webhook subscriptions

### Webhook Events Available in HeyReach

The following webhook events are supported:
- CONNECTION_REQUEST_SENT
- CONNECTION_REQUEST_ACCEPTED
- MESSAGE_SENT
- MESSAGE_REPLY_RECEIVED
- INMAIL_SENT
- INMAIL_REPLY_RECEIVED
- FOLLOW_SENT
- LIKED_POST
- VIEWED_PROFILE
- CAMPAIGN_COMPLETED
- LEAD_TAG_UPDATED