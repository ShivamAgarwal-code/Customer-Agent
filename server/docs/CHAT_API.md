# Chat API Documentation

This document describes all available Chat API endpoints.

## Base URL

```
/chat
```

---

## Table of Contents

1. [Send Message (New Conversation)](#1-send-message-new-conversation)
2. [Send Message (Existing Conversation)](#2-send-message-existing-conversation)
3. [List Conversations](#3-list-conversations)
4. [List Messages in a Conversation](#4-list-messages-in-a-conversation)

---

## Data Models

### Conversation

| Field       | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `id`        | `string` | Unique identifier (CUID)             |
| `status`    | `string` | Status: `active` or `inactive`       |
| `createdAt` | `string` | ISO 8601 timestamp of creation       |
| `updatedAt` | `string` | ISO 8601 timestamp of last update    |

### Message

| Field            | Type     | Description                                      |
| ---------------- | -------- | ------------------------------------------------ |
| `id`             | `string` | Unique identifier (CUID)                         |
| `content`        | `string` | The message content                              |
| `role`           | `string` | Role: `user`, `assistant`, or `system`           |
| `conversationId` | `string` | ID of the parent conversation                    |
| `createdAt`      | `string` | ISO 8601 timestamp of creation                   |

### API Response Wrapper

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "meta": {
    "limit": 10,
    "hasMore": true,
    "nextCursor": "2025-12-21T10:30:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

---

## Endpoints

### 1. Send Message (New Conversation)

Creates a new conversation and sends a message to the AI assistant.

**Endpoint:** `POST /chat`

#### Request

**Headers:**

| Header         | Value              | Required |
| -------------- | ------------------ | -------- |
| `Content-Type` | `application/json` | Yes      |

**Body:**

| Field     | Type     | Required | Constraints                                       |
| --------- | -------- | -------- | ------------------------------------------------- |
| `message` | `string` | Yes      | Min: 1 character, Max: 10,000 characters          |

**Example Request:**

```json
{
  "message": "Hello, I need help with my order"
}
```

#### Response

**Status Code:** `200 OK`

**Example Response:**

```json
{
  "success": true,
  "data": {
    "conversationId": "clq1abc2d0000abcd1234efgh",
    "response": "Hello! I'd be happy to help you with your order. Could you please provide me with your order number or describe the issue you're experiencing?"
  }
}
```

---

### 2. Send Message (Existing Conversation)

Sends a message to an existing conversation.

**Endpoint:** `POST /chat/:conversationId`

#### Request

**URL Parameters:**

| Parameter        | Type     | Required | Description                                |
| ---------------- | -------- | -------- | ------------------------------------------ |
| `conversationId` | `string` | Yes      | UUID of the existing conversation          |

**Headers:**

| Header         | Value              | Required |
| -------------- | ------------------ | -------- |
| `Content-Type` | `application/json` | Yes      |

**Body:**

| Field     | Type     | Required | Constraints                                       |
| --------- | -------- | -------- | ------------------------------------------------- |
| `message` | `string` | Yes      | Min: 1 character, Max: 10,000 characters          |

**Example Request:**

```
POST /chat/550e8400-e29b-41d4-a716-446655440000
```

```json
{
  "message": "My order number is #12345"
}
```

#### Response

**Status Code:** `200 OK`

**Example Response:**

```json
{
  "success": true,
  "data": {
    "conversationId": "550e8400-e29b-41d4-a716-446655440000",
    "response": "Thank you for providing your order number #12345. Let me look that up for you. I can see your order was placed on December 20th. How can I assist you with this order?"
  }
}
```

#### Errors

| Status Code | Error Code    | Description                          |
| ----------- | ------------- | ------------------------------------ |
| `404`       | `NOT_FOUND`   | Conversation with given ID not found |
| `400`       | `BAD_REQUEST` | Invalid conversation ID format (must be UUID) |

---

### 3. List Conversations

Retrieves a paginated list of all conversations.

**Endpoint:** `GET /chat`

#### Request

**Query Parameters:**

| Parameter    | Type     | Required | Default | Description                                      |
| ------------ | -------- | -------- | ------- | ------------------------------------------------ |
| `limit`      | `number` | No       | `10`    | Number of conversations to return per page       |
| `nextCursor` | `string` | No       | -       | Cursor for pagination (ISO 8601 timestamp)       |

**Example Request:**

```
GET /chat?limit=5
GET /chat?limit=10&nextCursor=2025-12-21T10:30:00.000Z
```

#### Response

**Status Code:** `200 OK`

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "clq1abc2d0000abcd1234efgh",
      "status": "active",
      "createdAt": "2025-12-21T10:00:00.000Z",
      "updatedAt": "2025-12-21T10:30:00.000Z"
    },
    {
      "id": "clq2xyz3e0001wxyz5678ijkl",
      "status": "active",
      "createdAt": "2025-12-20T15:00:00.000Z",
      "updatedAt": "2025-12-20T16:45:00.000Z"
    }
  ],
  "message": "Conversations fetched successfully",
  "meta": {
    "limit": 10,
    "hasMore": true,
    "nextCursor": "2025-12-20T16:45:00.000Z"
  }
}
```

#### Pagination

- Results are sorted by `updatedAt` in descending order (most recent first)
- Use the `nextCursor` from the response `meta` object to fetch the next page
- When `hasMore` is `false`, there are no more results to fetch

---

### 4. List Messages in a Conversation

Retrieves a paginated list of messages for a specific conversation.

**Endpoint:** `GET /chat/:conversationId/messages`

#### Request

**URL Parameters:**

| Parameter        | Type     | Required | Description                      |
| ---------------- | -------- | -------- | -------------------------------- |
| `conversationId` | `string` | Yes      | ID of the conversation           |

**Query Parameters:**

| Parameter    | Type     | Required | Default | Description                                  |
| ------------ | -------- | -------- | ------- | -------------------------------------------- |
| `limit`      | `number` | No       | `10`    | Number of messages to return per page        |
| `nextCursor` | `string` | No       | -       | Cursor for pagination (ISO 8601 timestamp)   |

**Example Request:**

```
GET /chat/clq1abc2d0000abcd1234efgh/messages?limit=20
GET /chat/clq1abc2d0000abcd1234efgh/messages?limit=10&nextCursor=2025-12-21T10:25:00.000Z
```

#### Response

**Status Code:** `200 OK`

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "msg_001abc",
      "content": "Hello, I need help with my order",
      "role": "user",
      "conversationId": "clq1abc2d0000abcd1234efgh",
      "createdAt": "2025-12-21T10:00:00.000Z"
    },
    {
      "id": "msg_002def",
      "content": "Hello! I'd be happy to help you with your order. Could you please provide me with your order number?",
      "role": "assistant",
      "conversationId": "clq1abc2d0000abcd1234efgh",
      "createdAt": "2025-12-21T10:00:05.000Z"
    },
    {
      "id": "msg_003ghi",
      "content": "My order number is #12345",
      "role": "user",
      "conversationId": "clq1abc2d0000abcd1234efgh",
      "createdAt": "2025-12-21T10:01:00.000Z"
    },
    {
      "id": "msg_004jkl",
      "content": "Thank you for providing your order number #12345. Let me look that up for you.",
      "role": "assistant",
      "conversationId": "clq1abc2d0000abcd1234efgh",
      "createdAt": "2025-12-21T10:01:05.000Z"
    }
  ],
  "message": "Messages fetched successfully",
  "meta": {
    "limit": 10,
    "hasMore": false,
    "nextCursor": null
  }
}
```

#### Pagination

- Results are sorted by `createdAt` (chronological order)
- Use the `nextCursor` from the response `meta` object to fetch the next page
- When `hasMore` is `false`, there are no more results to fetch

---

## Error Codes

| HTTP Status | Code               | Description                                |
| ----------- | ------------------ | ------------------------------------------ |
| `400`       | `BAD_REQUEST`      | Invalid request body or parameters         |
| `404`       | `NOT_FOUND`        | Requested resource not found               |
| `500`       | `INTERNAL_ERROR`   | Server error or LLM service failure        |

---

## Message Roles

| Role        | Description                                      |
| ----------- | ------------------------------------------------ |
| `user`      | Message sent by the user                         |
| `assistant` | Response generated by the AI assistant           |
| `system`    | System-level instructions (internal use)         |

---

## Usage Examples

### Start a new conversation

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I need help with my order"}'
```

### Continue an existing conversation

```bash
curl -X POST http://localhost:3000/chat/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"message": "My order number is #12345"}'
```

### List all conversations

```bash
curl http://localhost:3000/chat?limit=10
```

### Get messages from a conversation

```bash
curl http://localhost:3000/chat/clq1abc2d0000abcd1234efgh/messages?limit=20
```

