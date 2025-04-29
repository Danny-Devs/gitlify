# Database Schema

## Overview

This document defines the database schema for the Gist of Git application. The application uses PostgreSQL as the primary database with Prisma ORM for type-safe database access.

## Schema Diagram

```
┌───────────────────┐       ┌────────────────────┐      ┌────────────────────┐
│      User         │       │    Repository      │      │     Template       │
├───────────────────┤       ├────────────────────┤      ├────────────────────┤
│ id (PK)           │       │ id (PK)            │      │ id (PK)            │
│ name              │       │ url                │      │ name               │
│ email             │◄──┐   │ name               │      │ description        │
│ image             │   │   │ owner              │      │ content            │
│ createdAt         │   │   │ lastAnalyzed       │      │ category           │
│ updatedAt         │   │   │ lastCommitSha      │      │ createdAt          │
└───────────────────┘   │   │ userId (FK)        │──┐   │ updatedAt          │
                        │   │ createdAt          │  │   │ userId (FK)        │──┐
                        │   │ updatedAt          │  │   └────────────────────┘  │
                        │   └────────────────────┘  │                           │
                        │                           │                           │
                        │                           │                           │
┌───────────────────┐   │   ┌────────────────────┐  │   ┌────────────────────┐  │
│  LLMConfiguration │   │   │   Analysis         │  │   │  TemplateUsage     │  │
├───────────────────┤   │   ├────────────────────┤  │   ├────────────────────┤  │
│ id (PK)           │   │   │ id (PK)            │  │   │ id (PK)            │  │
│ name              │   │   │ status             │  │   │ templateId (FK)    │──┘
│ endpoint          │   │   │ startedAt          │  │   │ analysisId (FK)    │──┐
│ apiKey            │   │   │ completedAt        │  │   │ createdAt          │  │
│ modelName         │   │   │ repositoryId (FK)  │──┘   │ updatedAt          │  │
│ contextWindow     │   │   │ userId (FK)        │──────┘ success            │  │
│ userId (FK)       │───┘   │ configurationId(FK)│──┐   └────────────────────┘  │
│ createdAt         │       │ createdAt          │  │                           │
│ updatedAt         │       │ updatedAt          │  │                           │
└───────────────────┘       └────────────────────┘  │                           │
                                                    │                           │
                                                    │                           │
┌───────────────────┐       ┌────────────────────┐  │   ┌────────────────────┐  │
│   ApiKey          │       │   AnalysisResult   │  │   │  FileAnalysis      │  │
├───────────────────┤       ├────────────────────┤  │   ├────────────────────┤  │
│ id (PK)           │       │ id (PK)            │  │   │ id (PK)            │  │
│ key               │       │ title              │  │   │ filePath           │  │
│ name              │       │ summary            │  │   │ language           │  │
│ expiresAt         │       │ analysisId (FK)    │──┘   │ size               │  │
│ lastUsedAt        │       │ category           │      │ analysisId (FK)    │──┘
│ active            │       │ content            │      │ summary            │
│ userId (FK)       │───────┘ createdAt          │      │ content            │
│ createdAt         │       │ updatedAt          │      │ createdAt          │
│ updatedAt         │       └────────────────────┘      │ updatedAt          │
└───────────────────┘                                   └────────────────────┘
```

## Tables

### User

Stores user account information.

| Column    | Type      | Constraints      | Description                            |
| --------- | --------- | ---------------- | -------------------------------------- |
| id        | UUID      | PK               | Unique identifier for the user         |
| name      | STRING    | NOT NULL         | User's full name                       |
| email     | STRING    | UNIQUE, NOT NULL | User's email address                   |
| image     | STRING    |                  | URL to user's profile image            |
| createdAt | TIMESTAMP | NOT NULL         | When the user account was created      |
| updatedAt | TIMESTAMP | NOT NULL         | When the user account was last updated |

### Repository

Stores information about GitHub repositories that users have analyzed.

| Column        | Type      | Constraints | Description                                |
| ------------- | --------- | ----------- | ------------------------------------------ |
| id            | UUID      | PK          | Unique identifier for the repository       |
| url           | STRING    | NOT NULL    | GitHub repository URL                      |
| name          | STRING    | NOT NULL    | Repository name                            |
| owner         | STRING    | NOT NULL    | Repository owner/organization              |
| lastAnalyzed  | TIMESTAMP |             | When the repository was last analyzed      |
| lastCommitSha | STRING    |             | SHA of the latest commit analyzed          |
| userId        | UUID      | FK          | Reference to the user who owns this record |
| createdAt     | TIMESTAMP | NOT NULL    | When the record was created                |
| updatedAt     | TIMESTAMP | NOT NULL    | When the record was last updated           |

### Analysis

Represents a single analysis run of a repository.

| Column          | Type      | Constraints | Description                                               |
| --------------- | --------- | ----------- | --------------------------------------------------------- |
| id              | UUID      | PK          | Unique identifier for the analysis                        |
| status          | ENUM      | NOT NULL    | Status of the analysis (pending/running/completed/failed) |
| startedAt       | TIMESTAMP |             | When the analysis started                                 |
| completedAt     | TIMESTAMP |             | When the analysis completed                               |
| repositoryId    | UUID      | FK          | Reference to the repository being analyzed                |
| userId          | UUID      | FK          | Reference to the user who initiated analysis              |
| configurationId | UUID      | FK          | Reference to the LLM configuration used                   |
| createdAt       | TIMESTAMP | NOT NULL    | When the record was created                               |
| updatedAt       | TIMESTAMP | NOT NULL    | When the record was last updated                          |

### AnalysisResult

Stores the results of an analysis run.

| Column     | Type      | Constraints | Description                                         |
| ---------- | --------- | ----------- | --------------------------------------------------- |
| id         | UUID      | PK          | Unique identifier for the result                    |
| title      | STRING    | NOT NULL    | Title of this particular result                     |
| summary    | TEXT      | NOT NULL    | Summary of the analysis result                      |
| analysisId | UUID      | FK          | Reference to the analysis run                       |
| category   | ENUM      | NOT NULL    | Category of result (architecture/dependencies/etc.) |
| content    | JSONB     | NOT NULL    | Detailed content of the analysis result             |
| createdAt  | TIMESTAMP | NOT NULL    | When the record was created                         |
| updatedAt  | TIMESTAMP | NOT NULL    | When the record was last updated                    |

### FileAnalysis

Stores analysis results for individual files in a repository.

| Column     | Type      | Constraints | Description                             |
| ---------- | --------- | ----------- | --------------------------------------- |
| id         | UUID      | PK          | Unique identifier for the file analysis |
| filePath   | STRING    | NOT NULL    | Path to the file within the repository  |
| language   | STRING    |             | Programming language of the file        |
| size       | INTEGER   |             | Size of the file in bytes               |
| analysisId | UUID      | FK          | Reference to the analysis run           |
| summary    | TEXT      | NOT NULL    | Summary of the file's purpose           |
| content    | JSONB     | NOT NULL    | Detailed analysis of the file           |
| createdAt  | TIMESTAMP | NOT NULL    | When the record was created             |
| updatedAt  | TIMESTAMP | NOT NULL    | When the record was last updated        |

### Template

Stores analysis templates for repository analysis.

| Column      | Type      | Constraints | Description                                       |
| ----------- | --------- | ----------- | ------------------------------------------------- |
| id          | UUID      | PK          | Unique identifier for the template                |
| name        | STRING    | NOT NULL    | Name of the template                              |
| description | TEXT      | NOT NULL    | Description of what the template analyzes         |
| content     | TEXT      | NOT NULL    | Template content (prompt structure)               |
| category    | ENUM      | NOT NULL    | Category of analysis (architecture/security/etc.) |
| userId      | UUID      | FK          | Reference to the user who created template        |
| createdAt   | TIMESTAMP | NOT NULL    | When the record was created                       |
| updatedAt   | TIMESTAMP | NOT NULL    | When the record was last updated                  |

### TemplateUsage

Tracks usage of templates in analysis runs.

| Column     | Type      | Constraints | Description                                   |
| ---------- | --------- | ----------- | --------------------------------------------- |
| id         | UUID      | PK          | Unique identifier for the usage record        |
| templateId | UUID      | FK          | Reference to the template                     |
| analysisId | UUID      | FK          | Reference to the analysis run                 |
| success    | BOOLEAN   | NOT NULL    | Whether the template was successfully applied |
| createdAt  | TIMESTAMP | NOT NULL    | When the record was created                   |
| updatedAt  | TIMESTAMP | NOT NULL    | When the record was last updated              |

### LLMConfiguration

Stores configuration for connecting to local LLM servers.

| Column        | Type      | Constraints | Description                                |
| ------------- | --------- | ----------- | ------------------------------------------ |
| id            | UUID      | PK          | Unique identifier for the configuration    |
| name          | STRING    | NOT NULL    | Name of this configuration                 |
| endpoint      | STRING    | NOT NULL    | URL endpoint for the LLM server            |
| apiKey        | STRING    |             | API key if required by the LLM server      |
| modelName     | STRING    | NOT NULL    | Name of the model to use                   |
| contextWindow | INTEGER   | NOT NULL    | Max context window size in tokens          |
| userId        | UUID      | FK          | Reference to the user who owns this config |
| createdAt     | TIMESTAMP | NOT NULL    | When the record was created                |
| updatedAt     | TIMESTAMP | NOT NULL    | When the record was last updated           |

### ApiKey

Stores API keys for external system integration.

| Column     | Type      | Constraints | Description                             |
| ---------- | --------- | ----------- | --------------------------------------- |
| id         | UUID      | PK          | Unique identifier for the API key       |
| key        | STRING    | NOT NULL    | The API key (stored encrypted)          |
| name       | STRING    | NOT NULL    | Name/description of the API key         |
| expiresAt  | TIMESTAMP |             | When the API key expires                |
| lastUsedAt | TIMESTAMP |             | When the API key was last used          |
| active     | BOOLEAN   | NOT NULL    | Whether the API key is active           |
| userId     | UUID      | FK          | Reference to the user who owns this key |
| createdAt  | TIMESTAMP | NOT NULL    | When the record was created             |
| updatedAt  | TIMESTAMP | NOT NULL    | When the record was last updated        |

## Indexes

| Table        | Index Name                | Columns      | Type   | Description                           |
| ------------ | ------------------------- | ------------ | ------ | ------------------------------------- |
| User         | User_email_key            | email        | UNIQUE | Ensures unique email addresses        |
| Repository   | Repository_url_userId     | url, userId  | UNIQUE | Prevents duplicate repository entries |
| Repository   | Repository_userId_idx     | userId       | INDEX  | Speeds up queries by user             |
| Analysis     | Analysis_repositoryId_idx | repositoryId | INDEX  | Speeds up queries by repository       |
| Analysis     | Analysis_userId_idx       | userId       | INDEX  | Speeds up queries by user             |
| FileAnalysis | FileAnalysis_analysisId   | analysisId   | INDEX  | Speeds up queries by analysis         |
| Template     | Template_userId_idx       | userId       | INDEX  | Speeds up queries by user             |
| ApiKey       | ApiKey_userId_idx         | userId       | INDEX  | Speeds up queries by user             |
| ApiKey       | ApiKey_key_key            | key          | UNIQUE | Ensures unique API keys               |

## Relationships

- A **User** can have many **Repositories**, **Analyses**, **Templates**, **LLMConfigurations**, and **ApiKeys**
- A **Repository** belongs to a **User** and can have many **Analyses**
- An **Analysis** belongs to a **User**, a **Repository**, and an **LLMConfiguration**
- An **Analysis** can have many **AnalysisResults**, **FileAnalyses**, and **TemplateUsages**
- A **Template** belongs to a **User** and can have many **TemplateUsages**
- A **TemplateUsage** belongs to a **Template** and an **Analysis**
- An **LLMConfiguration** belongs to a **User** and can have many **Analyses**
- An **ApiKey** belongs to a **User**

## Migrations

The initial migration will create all the tables, indexes, and relationships defined above. Subsequent migrations will be documented as they are created.

### Initial Migration

The initial migration creates the database schema with all tables, relationships, and indexes as defined above.

### Future Migrations

As the application evolves, additional migrations will be added to this document to track schema changes over time.
