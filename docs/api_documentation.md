# API Documentation

## Overview

This document outlines the REST API endpoints available in the Gist of Git application. The API allows clients to analyze GitHub repositories, manage templates, and access analysis results without sending code to external services.

## Base URL

```
https://api.gistofgit.com/v1
```

For local development:

```
http://localhost:3000/api/v1
```

## Authentication

### Authentication Methods

All API requests require authentication using one of the following methods:

1. **API Key**: Include your API key in the `Authorization` header

   ```
   Authorization: Bearer YOUR_API_KEY
   ```

2. **Session Authentication**: For browser-based applications, sessions are automatically managed via cookies

### API Key Management

API keys can be created and managed through the dashboard interface or via dedicated API endpoints.

## Endpoints

### Repositories

#### List Repositories

```http
GET /repositories
```

Returns a list of repositories that the user has analyzed.

**Query Parameters:**

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| limit     | number | Maximum number of items to return  |
| offset    | number | Number of items to skip            |
| search    | string | Search term to filter repositories |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "url": "https://github.com/owner/repo",
      "name": "repo",
      "owner": "owner",
      "lastAnalyzed": "2023-06-15T10:30:00Z",
      "createdAt": "2023-06-15T10:00:00Z",
      "updatedAt": "2023-06-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

#### Get Repository

```http
GET /repositories/:id
```

Returns details about a specific repository.

**Response:**

```json
{
  "id": "uuid",
  "url": "https://github.com/owner/repo",
  "name": "repo",
  "owner": "owner",
  "lastAnalyzed": "2023-06-15T10:30:00Z",
  "lastCommitSha": "a1b2c3d4e5f6g7h8i9j0",
  "createdAt": "2023-06-15T10:00:00Z",
  "updatedAt": "2023-06-15T10:30:00Z"
}
```

#### Add Repository

```http
POST /repositories
```

Adds a new repository for analysis.

**Request Body:**

```json
{
  "url": "https://github.com/owner/repo"
}
```

**Response:**

```json
{
  "id": "uuid",
  "url": "https://github.com/owner/repo",
  "name": "repo",
  "owner": "owner",
  "createdAt": "2023-06-15T10:00:00Z",
  "updatedAt": "2023-06-15T10:00:00Z"
}
```

#### Delete Repository

```http
DELETE /repositories/:id
```

Removes a repository and all associated analyses.

**Response:**

```json
{
  "success": true,
  "message": "Repository deleted successfully"
}
```

### Analyses

#### List Analyses

```http
GET /repositories/:repoId/analyses
```

Returns a list of analyses for a specific repository.

**Query Parameters:**

| Parameter | Type   | Description                                         |
| --------- | ------ | --------------------------------------------------- |
| limit     | number | Maximum number of items to return                   |
| offset    | number | Number of items to skip                             |
| status    | string | Filter by status (pending/running/completed/failed) |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "status": "completed",
      "startedAt": "2023-06-15T10:00:00Z",
      "completedAt": "2023-06-15T10:30:00Z",
      "repositoryId": "uuid",
      "createdAt": "2023-06-15T10:00:00Z",
      "updatedAt": "2023-06-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

#### Get Analysis

```http
GET /analyses/:id
```

Returns details about a specific analysis.

**Response:**

```json
{
  "id": "uuid",
  "status": "completed",
  "startedAt": "2023-06-15T10:00:00Z",
  "completedAt": "2023-06-15T10:30:00Z",
  "repositoryId": "uuid",
  "repository": {
    "id": "uuid",
    "name": "repo",
    "owner": "owner",
    "url": "https://github.com/owner/repo"
  },
  "configuration": {
    "id": "uuid",
    "name": "Default Configuration",
    "modelName": "llama3-70b"
  },
  "createdAt": "2023-06-15T10:00:00Z",
  "updatedAt": "2023-06-15T10:30:00Z"
}
```

#### Start Analysis

```http
POST /repositories/:repoId/analyses
```

Starts a new analysis for the specified repository.

**Request Body:**

```json
{
  "configurationId": "uuid",
  "templateIds": ["uuid1", "uuid2"],
  "branch": "main",
  "commitSha": "a1b2c3d4e5f6g7h8i9j0"
}
```

**Response:**

```json
{
  "id": "uuid",
  "status": "pending",
  "repositoryId": "uuid",
  "createdAt": "2023-06-15T10:00:00Z",
  "updatedAt": "2023-06-15T10:00:00Z"
}
```

#### Cancel Analysis

```http
POST /analyses/:id/cancel
```

Cancels a running analysis.

**Response:**

```json
{
  "success": true,
  "message": "Analysis canceled successfully"
}
```

#### List Analysis Results

```http
GET /analyses/:id/results
```

Returns the results of a specific analysis.

**Query Parameters:**

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| category  | string | Filter by result category |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Architecture Overview",
      "summary": "This repository follows a Model-View-Controller architecture...",
      "category": "architecture",
      "createdAt": "2023-06-15T10:30:00Z",
      "updatedAt": "2023-06-15T10:30:00Z"
    }
  ]
}
```

#### Get Analysis Result

```http
GET /analyses/results/:resultId
```

Returns a specific analysis result with detailed content.

**Response:**

```json
{
  "id": "uuid",
  "title": "Architecture Overview",
  "summary": "This repository follows a Model-View-Controller architecture...",
  "category": "architecture",
  "content": {
    "description": "Detailed description of the architecture...",
    "components": [
      {
        "name": "Controllers",
        "description": "Handle HTTP requests and responses..."
      },
      {
        "name": "Models",
        "description": "Represent data structures and business logic..."
      },
      {
        "name": "Views",
        "description": "Render data for the client..."
      }
    ],
    "diagram": "ASCII or URL to diagram"
  },
  "createdAt": "2023-06-15T10:30:00Z",
  "updatedAt": "2023-06-15T10:30:00Z"
}
```

#### List File Analyses

```http
GET /analyses/:id/files
```

Returns analysis results for individual files.

**Query Parameters:**

| Parameter | Type   | Description                                  |
| --------- | ------ | -------------------------------------------- |
| path      | string | Filter by file path (supports glob patterns) |
| language  | string | Filter by programming language               |
| limit     | number | Maximum number of items to return            |
| offset    | number | Number of items to skip                      |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "filePath": "src/main.js",
      "language": "JavaScript",
      "size": 1024,
      "summary": "Application entry point that initializes the router...",
      "createdAt": "2023-06-15T10:30:00Z",
      "updatedAt": "2023-06-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 120,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

#### Get File Analysis

```http
GET /analyses/files/:fileId
```

Returns detailed analysis for a specific file.

**Response:**

```json
{
  "id": "uuid",
  "filePath": "src/main.js",
  "language": "JavaScript",
  "size": 1024,
  "summary": "Application entry point that initializes the router...",
  "content": {
    "description": "This file serves as the entry point for the application...",
    "complexity": {
      "cognitive": 12,
      "cyclomaticAverage": 3.5
    },
    "dependencies": [
      {
        "name": "vue",
        "usage": "Imported to create the Vue application instance"
      }
    ],
    "functions": [
      {
        "name": "main",
        "description": "Initializes the application...",
        "parameters": [
          {
            "name": "options",
            "type": "Object",
            "description": "Configuration options"
          }
        ]
      }
    ]
  },
  "createdAt": "2023-06-15T10:30:00Z",
  "updatedAt": "2023-06-15T10:30:00Z"
}
```

### Templates

#### List Templates

```http
GET /templates
```

Returns a list of analysis templates.

**Query Parameters:**

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| category  | string | Filter by template category       |
| limit     | number | Maximum number of items to return |
| offset    | number | Number of items to skip           |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Architecture Analysis",
      "description": "Analyzes the architectural patterns used in the repository",
      "category": "architecture",
      "createdAt": "2023-06-01T10:00:00Z",
      "updatedAt": "2023-06-01T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

#### Get Template

```http
GET /templates/:id
```

Returns details about a specific template.

**Response:**

```json
{
  "id": "uuid",
  "name": "Architecture Analysis",
  "description": "Analyzes the architectural patterns used in the repository",
  "content": "Template prompt content with instructions for the LLM...",
  "category": "architecture",
  "createdAt": "2023-06-01T10:00:00Z",
  "updatedAt": "2023-06-01T10:00:00Z"
}
```

#### Create Template

```http
POST /templates
```

Creates a new analysis template.

**Request Body:**

```json
{
  "name": "Security Analysis",
  "description": "Identifies potential security vulnerabilities in the code",
  "content": "Template prompt content with instructions for the LLM...",
  "category": "security"
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Security Analysis",
  "description": "Identifies potential security vulnerabilities in the code",
  "content": "Template prompt content with instructions for the LLM...",
  "category": "security",
  "createdAt": "2023-06-15T10:00:00Z",
  "updatedAt": "2023-06-15T10:00:00Z"
}
```

#### Update Template

```http
PUT /templates/:id
```

Updates an existing template.

**Request Body:**

```json
{
  "name": "Updated Template Name",
  "description": "Updated description",
  "content": "Updated template content...",
  "category": "security"
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Updated Template Name",
  "description": "Updated description",
  "content": "Updated template content...",
  "category": "security",
  "createdAt": "2023-06-01T10:00:00Z",
  "updatedAt": "2023-06-15T10:00:00Z"
}
```

#### Delete Template

```http
DELETE /templates/:id
```

Deletes a template.

**Response:**

```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

### LLM Configurations

#### List Configurations

```http
GET /llm-configurations
```

Returns a list of LLM configurations.

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Local LLaMA",
      "endpoint": "http://localhost:8080/v1",
      "modelName": "llama3-70b",
      "contextWindow": 32768,
      "createdAt": "2023-06-01T10:00:00Z",
      "updatedAt": "2023-06-01T10:00:00Z"
    }
  ]
}
```

#### Get Configuration

```http
GET /llm-configurations/:id
```

Returns details about a specific LLM configuration.

**Response:**

```json
{
  "id": "uuid",
  "name": "Local LLaMA",
  "endpoint": "http://localhost:8080/v1",
  "modelName": "llama3-70b",
  "contextWindow": 32768,
  "createdAt": "2023-06-01T10:00:00Z",
  "updatedAt": "2023-06-01T10:00:00Z"
}
```

#### Create Configuration

```http
POST /llm-configurations
```

Creates a new LLM configuration.

**Request Body:**

```json
{
  "name": "Local Mistral",
  "endpoint": "http://localhost:11434/v1",
  "apiKey": "optional-api-key",
  "modelName": "mistral-7b",
  "contextWindow": 16384
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Local Mistral",
  "endpoint": "http://localhost:11434/v1",
  "modelName": "mistral-7b",
  "contextWindow": 16384,
  "createdAt": "2023-06-15T10:00:00Z",
  "updatedAt": "2023-06-15T10:00:00Z"
}
```

#### Update Configuration

```http
PUT /llm-configurations/:id
```

Updates an existing LLM configuration.

**Request Body:**

```json
{
  "name": "Updated Configuration Name",
  "endpoint": "http://localhost:11434/v1",
  "apiKey": "new-api-key",
  "modelName": "mistral-7b",
  "contextWindow": 32768
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Updated Configuration Name",
  "endpoint": "http://localhost:11434/v1",
  "modelName": "mistral-7b",
  "contextWindow": 32768,
  "createdAt": "2023-06-01T10:00:00Z",
  "updatedAt": "2023-06-15T10:00:00Z"
}
```

#### Delete Configuration

```http
DELETE /llm-configurations/:id
```

Deletes an LLM configuration.

**Response:**

```json
{
  "success": true,
  "message": "Configuration deleted successfully"
}
```

#### Test Configuration

```http
POST /llm-configurations/:id/test
```

Tests connectivity to the configured LLM.

**Response:**

```json
{
  "success": true,
  "message": "Successfully connected to LLM endpoint",
  "details": {
    "modelInfo": {
      "name": "mistral-7b",
      "version": "1.0.0"
    },
    "latency": 120, // ms
    "maxContextWindow": 32768
  }
}
```

### API Keys

#### List API Keys

```http
GET /api-keys
```

Returns a list of API keys for the authenticated user.

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Development Key",
      "expiresAt": "2024-06-15T10:00:00Z",
      "lastUsedAt": "2023-06-15T10:00:00Z",
      "active": true,
      "createdAt": "2023-06-01T10:00:00Z",
      "updatedAt": "2023-06-01T10:00:00Z"
    }
  ]
}
```

#### Create API Key

```http
POST /api-keys
```

Creates a new API key.

**Request Body:**

```json
{
  "name": "Production Key",
  "expiresAt": "2024-06-15T10:00:00Z"
}
```

**Response:**

```json
{
  "id": "uuid",
  "key": "gog_a1b2c3d4e5f6g7h8i9j0", // Only returned once on creation
  "name": "Production Key",
  "expiresAt": "2024-06-15T10:00:00Z",
  "active": true,
  "createdAt": "2023-06-15T10:00:00Z",
  "updatedAt": "2023-06-15T10:00:00Z"
}
```

#### Update API Key

```http
PUT /api-keys/:id
```

Updates an API key.

**Request Body:**

```json
{
  "name": "Updated Key Name",
  "expiresAt": "2025-06-15T10:00:00Z",
  "active": false
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Updated Key Name",
  "expiresAt": "2025-06-15T10:00:00Z",
  "lastUsedAt": "2023-06-15T10:00:00Z",
  "active": false,
  "createdAt": "2023-06-01T10:00:00Z",
  "updatedAt": "2023-06-15T10:00:00Z"
}
```

#### Delete API Key

```http
DELETE /api-keys/:id
```

Deletes an API key.

**Response:**

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

### User

#### Get Current User

```http
GET /user
```

Returns information about the authenticated user.

**Response:**

```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "image": "https://example.com/avatar.jpg",
  "createdAt": "2023-01-01T10:00:00Z",
  "updatedAt": "2023-06-01T10:00:00Z"
}
```

#### Update User

```http
PUT /user
```

Updates the authenticated user's information.

**Request Body:**

```json
{
  "name": "John Smith"
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "John Smith",
  "email": "john.doe@example.com",
  "image": "https://example.com/avatar.jpg",
  "createdAt": "2023-01-01T10:00:00Z",
  "updatedAt": "2023-06-15T10:00:00Z"
}
```

## Error Handling

All API endpoints follow a consistent error format:

```json
{
  "error": {
    "code": "resource_not_found",
    "message": "The requested resource was not found",
    "details": {
      "resource": "repository",
      "id": "invalid-uuid"
    }
  }
}
```

### Common Error Codes

| Code                  | HTTP Status | Description                           |
| --------------------- | ----------- | ------------------------------------- |
| unauthorized          | 401         | Authentication required or failed     |
| forbidden             | 403         | Permission denied                     |
| resource_not_found    | 404         | The requested resource does not exist |
| validation_failed     | 422         | Request data failed validation        |
| rate_limit_exceeded   | 429         | Too many requests                     |
| internal_server_error | 500         | Unexpected server error               |

## Rate Limiting

API requests are subject to rate limiting:

- 100 requests per minute for most endpoints
- 10 analysis requests per minute

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623760800
```

## Webhooks

### Available Events

- `analysis.started`: When an analysis begins
- `analysis.completed`: When an analysis completes successfully
- `analysis.failed`: When an analysis fails

### Setting Up Webhooks

Webhooks can be configured through the dashboard or the API:

```http
POST /webhooks
```

**Request Body:**

```json
{
  "url": "https://example.com/webhook",
  "events": ["analysis.completed", "analysis.failed"],
  "secret": "webhook-secret-for-verification"
}
```

**Response:**

```json
{
  "id": "uuid",
  "url": "https://example.com/webhook",
  "events": ["analysis.completed", "analysis.failed"],
  "active": true,
  "createdAt": "2023-06-15T10:00:00Z",
  "updatedAt": "2023-06-15T10:00:00Z"
}
```

### Webhook Payload

```json
{
  "id": "uuid",
  "type": "analysis.completed",
  "createdAt": "2023-06-15T10:30:00Z",
  "data": {
    "analysis": {
      "id": "uuid",
      "status": "completed",
      "startedAt": "2023-06-15T10:00:00Z",
      "completedAt": "2023-06-15T10:30:00Z",
      "repository": {
        "id": "uuid",
        "name": "repo",
        "owner": "owner"
      }
    }
  }
}
```

### Webhook Signature

To verify webhook authenticity, a signature is included in the `X-GOG-Signature` header:

```
X-GOG-Signature: sha256=a1b2c3d4e5f6g7h8i9j0
```

The signature is generated using the webhook secret and the request body.
