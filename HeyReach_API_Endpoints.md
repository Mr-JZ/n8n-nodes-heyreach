# HeyReach API Documentation

## Table of Contents
- [Introduction](#introduction)
- [Authentication](#authentication)
- [Rate Limits](#rate-limits)
- [Common Headers](#common-headers)
- [API Endpoints](#api-endpoints)
  - [PublicAuthentication](#publicauthentication)
  - [PublicCampaigns](#publiccampaigns)
  - [PublicInbox](#publicinbox)
  - [PublicLinkedInAccount](#publiclinkedinaccount)
  - [PublicList](#publiclist)
  - [PublicStats](#publicstats)
  - [PublicLead](#publiclead)
  - [PublicWebhooks](#publicwebhooks)
  - [PublicMyNetwork](#publicmynetwork)
- [Error Handling](#error-handling)

## Introduction

Welcome to the HeyReach API. This documentation provides comprehensive information about all available endpoints and how to use them effectively.

## Authentication

### Finding your API key

The first step when using the HeyReach API is authenticating your requests with an API key.
- The API key is used to authenticate the incoming requests and map them to your organization.
- API keys never expire, however they can be deleted/deactivated.
- You can find your API key in your HeyReach account settings.

### Using your API key

After you have your API key, you will need to provide it in every request that you make to the HeyReach API.
You will need to add the `X-API-KEY` request header to every request and set your API key as the value.

### Test your API key

Once you have your API key, you can check if it's working by sending the following request.
If everything is working properly, you should get a `200` HTTP status code.

```bash
curl --location 'https://api.heyreach.io/api/public/auth/CheckApiKey' \
  --header 'X-API-KEY: <YOUR_API_KEY>'
```

## Rate Limits

HeyReach allows a maximum of **300** requests per minute. All requests are attributed to the same limit.
Going above the limit will return a `429` HTTP status code and an error.

## Common Headers

All API endpoints require these headers:
- **X-API-KEY**: Your API key for authentication (required for all endpoints)
- **Content-Type**: `application/json` (for POST/PUT/PATCH requests)
- **Accept**: `text/plain`

---

## API Endpoints

### PublicAuthentication

#### GET CheckApiKey

**Endpoint:** `GET https://api.heyreach.io/api/public/auth/CheckApiKey`

**Description:** Test your API key to verify authentication is working.

**Headers:**
- `X-API-KEY`: `<string>` - Your API key

**Response:** `200 OK` if successful

---

### PublicCampaigns

Campaign management endpoints for creating, managing, and monitoring outreach campaigns.

#### POST GetAll

**Endpoint:** `POST https://api.heyreach.io/api/public/campaign/GetAll`

**Description:** Get all campaigns in your account with pagination support.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "offset": 0,
  "limit": 100
}
```

#### GET GetById

**Endpoint:** `GET https://api.heyreach.io/api/public/campaign/GetById?campaignId=<id>`

**Description:** Get detailed information about a specific campaign by its ID.

**Headers:**
- `X-API-KEY`: `<string>`
- `Accept`: `text/plain`

**Query Parameters:**
- `campaignId`: The ID of the campaign to retrieve

#### POST Resume

**Endpoint:** `POST https://api.heyreach.io/api/public/campaign/Resume`

**Description:** Resume a paused campaign to continue outreach activities.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "campaignId": 123
}
```

#### POST Pause

**Endpoint:** `POST https://api.heyreach.io/api/public/campaign/Pause`

**Description:** Pause an active campaign to temporarily stop outreach activities.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "campaignId": 123
}
```

#### POST AddLeadsToCampaign

**Endpoint:** `POST https://api.heyreach.io/api/public/campaign/AddLeadsToCampaign`

**Description:** Add new leads to an existing campaign with detailed lead information.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "accountLeadPairs": [
    {
      "lead": {
        "firstName": "<string>",
        "lastName": "<string>",
        "profileUrl": "<string>",
        "location": "<string>",
        "summary": "<string>",
        "companyName": "<string>",
        "position": "<string>",
        "about": "<string>",
        "emailAddress": "<string>",
        "customUserFields": [
          {
            "name": "<string>",
            "value": "<string>"
          }
        ]
      },
      "linkedInAccountId": "<integer>"
    }
  ],
  "campaignId": "<long>"
}
```

#### POST AddLeadsToCampaignV2

**Endpoint:** `POST https://api.heyreach.io/api/public/campaign/AddLeadsToCampaignV2`

**Description:** Add leads to a campaign (version 2) with enhanced features and validation.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

#### POST StopLeadInCampaign

**Endpoint:** `POST https://api.heyreach.io/api/public/campaign/StopLeadInCampaign`

**Description:** Stops a lead's progression in a campaign. Use this to halt all future actions for a specific lead.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Body Parameters:**
- **campaignId** *(integer)*: The ID of the campaign
- **leadMemberId**: The lead member ID (from 'linkedin_id' field)
- **leadUrl**: The LinkedIn URL for the lead

**Request Body:**
```json
{
  "campaignId": 123,
  "leadMemberId": "123123123",
  "leadUrl": "https://www.linkedin.com/in/john-doe"
}
```

#### POST GetLeadsFromCampaign

**Endpoint:** `POST https://api.heyreach.io/api/public/campaign/GetLeadsFromCampaign`

**Description:** Gets the leads that are in a campaign with filtering and pagination options.

**Remark:** Shows only "Pending" leads that are about to start executing actions. Additional pending leads from the lead list may be inserted later.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Body Parameters:**
- **campaignId** *(integer)*: Campaign ID
- **offset** *(integer)*: Records to skip for pagination
- **limit** *(integer)*: Maximum records to return
- **timeFrom** *(string, ISO 8601)*: Start of time range
- **timeTo** *(string, ISO 8601)*: End of time range
- **timeFilter** *(string)*: Time filter type
  - `CreationTime`: Filter by creation time
  - `Everywhere`: No time filtering (default)

**Request Body:**
```json
{
  "campaignId": 1805,
  "offset": 0,
  "limit": 100,
  "timeFrom": "2024-10-06T17:34:00+02:00",
  "timeTo": "2024-10-07T17:36:00+02:00",
  "timeFilter": "CreationTime"
}
```

**Response Enums:**

**LeadCampaignStatus:**
- Pending
- InSequence
- Finished
- Paused
- Failed

**LeadConnectionStatus:**
- None
- ConnectionSent
- ConnectionAccepted

**LeadMessageStatus:**
- None
- MessageSent
- MessageReply

#### POST GetCampaignsForLead

**Endpoint:** `POST https://api.heyreach.io/api/public/campaign/GetCampaignsForLead`

**Description:** Retrieves all campaigns where a specific lead is enrolled.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Body Parameters:**
- **email** *(string, optional)*: Lead's email
- **linkedinId** *(string, optional)*: Lead's LinkedIn ID
- **profileUrl** *(string, optional)*: Lead's LinkedIn URL
- **offset** *(integer)*: Pagination offset
- **limit** *(integer)*: Maximum results

**Request Body:**
```json
{
  "email": "john_doe@example.com",
  "linkedinId": "1254asd3",
  "profileUrl": "https://www.linkedin.com/in/john_doe",
  "offset": 0,
  "limit": 100
}
```

---

### PublicInbox

Manage conversations and messages across all your LinkedIn accounts.

#### POST GetConversations

**Endpoint:** `POST https://api.heyreach.io/api/public/inbox/GetConversations`

**Description:** Get a paginated collection of LinkedIn conversations (up to 100 per request).

**Note:** Consider using GetConversationsV2 for enhanced features.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "offset": 0,
  "filters": {
    "linkedInAccountIds": [123, 124],
    "campaignIds": [123, 125],
    "searchString": "John Doe",
    "seen": false
  },
  "limit": 10
}
```

#### POST GetConversationsV2

**Endpoint:** `POST https://api.heyreach.io/api/public/inbox/GetConversationsV2`

**Description:** Enhanced version of GetConversations with additional filtering and sorting options.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

#### GET GetChatroom

**Endpoint:** `GET https://api.heyreach.io/api/public/inbox/GetChatroom?chatroomId=<id>`

**Description:** Get detailed information about a specific chatroom/conversation.

**Headers:**
- `X-API-KEY`: `<string>`
- `Accept`: `text/plain`

#### POST SendMessage

**Endpoint:** `POST https://api.heyreach.io/api/public/inbox/SendMessage`

**Description:** Send a message to a LinkedIn user from one of your connected accounts.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "linkedInAccountId": 123,
  "recipientProfileUrl": "https://www.linkedin.com/in/john-doe",
  "message": "Your message content here"
}
```

---

### PublicLinkedInAccount

Manage your connected LinkedIn accounts.

#### POST GetAll

**Endpoint:** `POST https://api.heyreach.io/api/public/linkedinaccount/GetAll`

**Description:** Get all LinkedIn accounts connected to your HeyReach account.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "offset": 0,
  "limit": 100
}
```

#### GET GetById

**Endpoint:** `GET https://api.heyreach.io/api/public/linkedinaccount/GetById?accountId=<id>`

**Description:** Get detailed information about a specific LinkedIn account.

**Headers:**
- `X-API-KEY`: `<string>`
- `Accept`: `text/plain`

---

### PublicList

Manage lead lists for organizing your outreach targets.

#### POST GetAll

**Endpoint:** `POST https://api.heyreach.io/api/public/list/GetAll`

**Description:** Get all lead lists with pagination.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "offset": 0,
  "limit": 100
}
```

#### GET GetById

**Endpoint:** `GET https://api.heyreach.io/api/public/list/GetById?listId=<id>`

**Description:** Get details of a specific lead list.

**Headers:**
- `X-API-KEY`: `<string>`
- `Accept`: `text/plain`

#### POST CreateEmptyList

**Endpoint:** `POST https://api.heyreach.io/api/public/list/CreateEmptyList`

**Description:** Create an empty lead or company list. You pass the list name and the list type (USER_LIST or COMPANY_LIST). If the type value is left empty, a Lead list will be created by default.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "name": "<string>",
  "type": "<COMPANY_LIST|USER_LIST>"
}
```

**Example Response:**
```json
{
  "id": 123,
  "name": "My List",
  "count": 0,
  "listType": "<COMPANY_LIST|USER_LIST>",
  "creationTime": "2024-08-29T09:34:56.5417789Z",
  "isDeleted": false,
  "campaigns": null,
  "search": null,
  "status": "UNKNOWN"
}
```

#### POST AddLeadsToList

**Endpoint:** `POST https://api.heyreach.io/api/public/list/AddLeadsToList`

**Description:** Add leads to an existing list.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

#### POST AddLeadsToListV2

**Endpoint:** `POST https://api.heyreach.io/api/public/list/AddLeadsToListV2`

**Description:** Add leads to a list (version 2) with enhanced features.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

#### DELETE DeleteLeadsFromList

**Endpoint:** `DELETE https://api.heyreach.io/api/public/list/DeleteLeadsFromList`

**Description:** Deletes the specified leads from a lead list.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "listId": 3672,
  "leadMemberIds": ["1111", "222"]
}
```

**Note:** leadMemberIds are the LinkedIn IDs of the leads to be deleted. In API responses, this can also be named as 'linkedin_id'.

#### DELETE DeleteLeadsFromListByProfileUrl

**Endpoint:** `DELETE https://api.heyreach.io/api/public/list/DeleteLeadsFromListByProfileUrl`

**Description:** Delete leads from a list using their profile URLs.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

#### POST GetCompaniesFromList

**Endpoint:** `POST https://api.heyreach.io/api/public/list/GetCompaniesFromList`

**Description:** Get companies from a company list.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

#### POST GetListsForLead

**Endpoint:** `POST https://api.heyreach.io/api/public/list/GetListsForLead`

**Description:** Get all lists that contain a specific lead.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

#### POST GetLeadsFromList

**Endpoint:** `POST https://api.heyreach.io/api/public/list/GetLeadsFromList`

**Description:** Get all leads from a specific list with pagination.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "listId": 123,
  "offset": 0,
  "limit": 100
}
```

---

### PublicStats

Retrieve analytics and statistics for your campaigns and accounts.

#### POST GetOverallStats

**Endpoint:** `POST https://api.heyreach.io/api/public/stats/GetOverallStats`

**Description:** Gets the overall stats for the specified filters.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "accountIds": [1234],
  "campaignIds": [],
  "startDate": "2024-12-17T00:00:00.000Z",
  "endDate": "2024-12-19T23:59:59.999Z"
}
```

**Body Parameters:**
- **accountIds**: Array of LinkedIn sender account IDs. If empty, all senders will be included.
- **campaignIds**: Array of campaign IDs to be included. If empty, all campaigns will be included.
- **startDate**: Start date for the stats period (ISO 8601 format)
- **endDate**: End date for the stats period (ISO 8601 format)

**Example Response:**
```json
{
  "byDayStats": {
    "2024-12-17T00:00:00Z": {
      "profileViews": 0,
      "postLikes": 0,
      "follows": 0,
      "messagesSent": 723,
      "totalMessageStarted": 593,
      "totalMessageReplies": 136,
      "inmailMessagesSent": 0,
      "totalInmailStarted": 0,
      "totalInmailReplies": 0,
      "connectionsSent": 4650,
      "connectionsAccepted": 637,
      "messageReplyRate": 0.22934233,
      "inMailReplyRate": 0,
      "connectionAcceptanceRate": 0.13698925
    }
  },
  "overallStats": {
    "profileViews": 0,
    "postLikes": 0,
    "follows": 0,
    "messagesSent": 2601,
    "totalMessageStarted": 1766,
    "totalMessageReplies": 395,
    "inmailMessagesSent": 0,
    "totalInmailStarted": 0,
    "totalInmailReplies": 0,
    "connectionsSent": 14740,
    "connectionsAccepted": 1828,
    "messageReplyRate": 0.2236693,
    "inMailReplyRate": 0,
    "connectionAcceptanceRate": 0.124016285
  }
}
```

---

### PublicLead

Manage individual leads and their properties.

#### POST GetLead

**Endpoint:** `POST https://api.heyreach.io/api/public/lead/GetLead`

**Description:** Gets lead details based on their LinkedIn profile URL.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "profileUrl": "https://www.linkedin.com/in/john_doe/"
}
```

**Example Response:**
```json
{
  "linkedin_id": "63456789",
  "imageUrl": "https://media.licdn.com/dms/image/v2/some_url",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "location": "Texas",
  "summary": "",
  "companyName": "Marines",
  "companyUrl": "https://www.linkedin.com/company/marines",
  "position": "Director of Marines",
  "industry": null,
  "about": null,
  "username": "john_doe",
  "emailAddress": null,
  "connections": 0,
  "followers": 0,
  "experiences": "[]",
  "education": "[]",
  "profileUrl": "https://www.linkedin.com/in/john_doe",
  "enrichedEmailAddress": "john_doe@example.com",
  "headline": null,
  "emailEnrichments": ["john_doe@example.com"]
}
```

#### POST AddTags

**Endpoint:** `POST https://api.heyreach.io/api/public/lead/AddTags`

**Description:** Add tags to a lead. Existing tags will not be changed.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "leadProfileUrl": "https://www.linkedin.com/in/john_doe/",
  "leadLinkedInId": "",
  "tags": ["tag1", "tag2"],
  "createTagIfNotExisting": false
}
```

**Body Parameters:**
- **leadProfileUrl** *(optional)*: LinkedIn profile URL of the lead
- **leadLinkedInId** *(optional)*: LinkedIn ID of the lead (found as "linkedin_id" in API responses)
- **tags**: Array of tags to be added
- **createTagIfNotExisting**: If true, creates tags that don't exist. If false and a tag doesn't exist, returns "Bad Request"

#### POST GetTags

**Endpoint:** `POST https://api.heyreach.io/api/public/lead/GetTags`

**Description:** Get all tags for a lead. Tags are alphabetically sorted.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "profileUrl": "https://www.linkedin.com/in/john_doe/"
}
```

**Example Response:**
```json
{
  "tags": ["atag1", "btag2", "ctag3"]
}
```

#### POST ReplaceTags

**Endpoint:** `POST https://api.heyreach.io/api/public/lead/ReplaceTags`

**Description:** Remove existing tags and replace with new tags.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "leadProfileUrl": "https://www.linkedin.com/in/john_doe/",
  "leadLinkedInId": "",
  "tags": ["tag1", "tag2"],
  "createTagIfNotExisting": false
}
```

---

### PublicWebhooks

Configure webhooks to receive real-time notifications about campaign events.

#### POST GetAllWebhooks

**Endpoint:** `POST https://api.heyreach.io/api/public/webhooks/GetAllWebhooks`

**Description:** Get all configured webhooks with pagination.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "offset": 0,
  "limit": 100
}
```

**Example Response:**
```json
{
  "totalCount": 1,
  "items": [
    {
      "id": 123,
      "webhookName": "My Webhook",
      "webhookUrl": "https://example.com/webhook",
      "eventType": "CONNECTION_REQUEST_SENT",
      "campaignIds": [123],
      "isActive": true
    }
  ]
}
```

#### POST CreateWebhook

**Endpoint:** `POST https://api.heyreach.io/api/public/webhooks/CreateWebhook`

**Description:** Create a new webhook for event notifications.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "webhookName": "My Webhook",
  "webhookUrl": "https://example.com/webhook",
  "eventType": "CONNECTION_REQUEST_SENT",
  "campaignIds": [123, 456],
  "isActive": true
}
```

**Available Event Types:**
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

#### GET GetWebhookById

**Endpoint:** `GET https://api.heyreach.io/api/public/webhooks/GetWebhookById?webhookId=<id>`

**Description:** Get a specific webhook by its ID.

**Headers:**
- `X-API-KEY`: `<string>`
- `Accept`: `text/plain`

#### PATCH UpdateWebhook

**Endpoint:** `PATCH https://api.heyreach.io/api/public/webhooks/UpdateWebhook?webhookId=<id>`

**Description:** Update an existing webhook configuration.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Query Parameters:**
- **webhookId**: The webhook ID to update

**Request Body:**
```json
{
  "webhookName": "Updated Name",
  "webhookUrl": "https://example.com/new-webhook",
  "eventType": "MESSAGE_REPLY_RECEIVED",
  "campaignIds": [],
  "isActive": true
}
```

**Note:** Fields that are null or omitted will retain their original values.

#### DELETE DeleteWebhook

**Endpoint:** `DELETE https://api.heyreach.io/api/public/webhooks/DeleteWebhook?webhookId=<id>`

**Description:** Delete an existing webhook.

**Headers:**
- `X-API-KEY`: `<string>`
- `Accept`: `text/plain`

**Query Parameters:**
- **webhookId**: The webhook ID to delete

---

### PublicMyNetwork

Access and manage your LinkedIn network connections.

#### POST GetMyNetworkForSender

**Endpoint:** `POST https://api.heyreach.io/api/public/MyNetwork/GetMyNetworkForSender`

**Description:** Get paginated list of connections for a specific LinkedIn account.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "pageNumber": 0,
  "pageSize": 100,
  "senderId": 1234
}
```

**Example Response:**
```json
{
  "totalCount": 500,
  "items": [
    {
      "linkedin_id": "123456",
      "profileUrl": "https://www.linkedin.com/in/johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "headline": "Software Engineer",
      "imageUrl": "https://media.licdn.com/...",
      "location": "San Francisco",
      "companyName": "Tech Corp",
      "companyUrl": "https://www.linkedin.com/company/techcorp",
      "position": "Senior Developer",
      "about": "Experienced software engineer...",
      "connections": 500,
      "followers": 1000,
      "emailAddress": "john@example.com"
    }
  ]
}
```

#### POST IsConnection

**Endpoint:** `POST https://api.heyreach.io/api/public/MyNetwork/IsConnection`

**Description:** Check if a lead is a connection of a specific sender account.

**Headers:**
- `X-API-KEY`: `<string>`
- `Content-Type`: `application/json`
- `Accept`: `text/plain`

**Request Body:**
```json
{
  "senderAccountId": 0,
  "leadProfileUrl": "https://www.linkedin.com/in/john_doe/",
  "leadLinkedInId": null
}
```

**Body Parameters:**
- **senderAccountId**: The ID of the sender account to check
- **leadProfileUrl** *(optional)*: LinkedIn profile URL of the lead
- **leadLinkedInId** *(optional)*: LinkedIn ID of the lead

**Note:** Either leadProfileUrl or leadLinkedInId should be specified, but not both.

**Example Response:**
```json
{
  "isConnection": true
}
```

---

## Error Handling

### HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource successfully created
- **204 No Content**: Request successful, no content to return
- **400 Bad Request**: Invalid request parameters or malformed request
- **401 Unauthorized**: Invalid or missing API key
- **403 Forbidden**: Access denied to the requested resource
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded (max 300 requests per minute)
- **500 Internal Server Error**: Server error, please try again later
- **503 Service Unavailable**: Service temporarily unavailable

### Error Response Format

Error responses typically follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details if applicable"
    }
  }
}
```

### Common Error Codes

- `INVALID_API_KEY`: The provided API key is invalid
- `RATE_LIMIT_EXCEEDED`: You've exceeded the rate limit
- `CAMPAIGN_NOT_FOUND`: The specified campaign doesn't exist
- `LEAD_NOT_FOUND`: The specified lead doesn't exist
- `INVALID_PARAMETERS`: One or more parameters are invalid
- `INSUFFICIENT_CREDITS`: Your account doesn't have enough credits
- `ACCOUNT_SUSPENDED`: The LinkedIn account is suspended

---

## Best Practices

1. **Rate Limiting**: Implement exponential backoff when receiving 429 errors
2. **Pagination**: Always use pagination for large data sets to improve performance
3. **Error Handling**: Implement robust error handling for all API calls
4. **Webhook Validation**: Validate webhook signatures to ensure security
5. **Data Caching**: Cache frequently accessed data to reduce API calls
6. **Batch Operations**: Use batch endpoints when available to reduce API calls

---

## Support

For additional support and questions:
- Email: support@heyreach.io
- Documentation: https://docs.heyreach.io
- API Status: https://status.heyreach.io

---

*Note: This documentation is based on the HeyReach API v1. Please check the official documentation for the most recent updates and changes.*
