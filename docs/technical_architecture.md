# Technical Architecture

This document outlines the simplified architecture for the Gist of Git MVP. We focus on the essential components needed to deliver the core functionality.

## Guiding Principles

- **Simplicity First**: Focus on simple, proven technologies
- **Separation of Concerns**: Clear boundaries between components
- **Progressive Enhancement**: Build core features before advanced ones
- **User Privacy**: All code analysis happens locally

## High-Level Architecture

The application follows a client-server architecture with a focus on frontend processing:

```
┌────────────────────────────────────────────────────────────────┐
│                     Client (Browser)                            │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────┐   │
│  │   React UI  │  │   Next.js   │  │ Repository            │   │
│  │  Components │◄─┤    Router   │◄─┤ Explorer              │   │
│  └─────────────┘  └─────────────┘  └───────────────────────┘   │
│          ▲                ▲                    ▲               │
└──────────┼────────────────┼────────────────────┼───────────────┘
           │                │                    │
┌──────────┼────────────────┼────────────────────┼───────────────┐
│          ▼                ▼                    ▼               │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────┐   │
│  │  API Routes │  │ Repository  │  │  Analysis             │   │
│  │             │  │ Service     │  │  Service              │   │
│  └─────────────┘  └─────────────┘  └───────────────────────┘   │
│          ▲                ▲                    ▲               │
│          │                │                    │               │
│  ┌───────┴────────────────┴────────────────────┴───────────┐   │
│  │                    Database                              │   │
│  │                    (Prisma)                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ▲                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────┐
│                              ▼                                  │
│  ┌─────────────────┐  ┌────────────────┐                        │
│  │  GitHub API     │  │  Local LLM     │                        │
│  │                 │  │  (User-hosted) │                        │
│  └─────────────────┘  └────────────────┘                        │
│                                                                │
│                  External Services                              │
└────────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Frontend Components

#### Repository Explorer

- **Purpose**: Browse and view GitHub repository files
- **Key Features**:
  - Repository URL input
  - Directory/file tree navigation
  - File content viewer
  - Simple syntax highlighting

#### Analysis Configuration

- **Purpose**: Configure and start analysis
- **Key Features**:
  - Template selection
  - Basic analysis settings
  - Start/stop controls

#### Results Viewer

- **Purpose**: Display analysis results
- **Key Features**:
  - Formatted markdown display
  - Navigation between sections
  - Simple export functionality

### 2. Backend Services

#### Repository Service

- **Purpose**: Fetch and manage GitHub repository data
- **Key Features**:
  - GitHub API integration
  - Repository metadata storage
  - File content caching

#### Analysis Service

- **Purpose**: Process repository with LLM
- **Key Features**:
  - Template processing
  - LLM communication
  - Results formatting

#### LLM Connector

- **Purpose**: Interface with local LLM instances
- **Key Features**:
  - Connection to Ollama API
  - Basic model detection
  - Prompt submission and response handling

### 3. Data Storage

#### Core Database Tables

- **Repositories**: Store repository information
- **AnalysisResults**: Store completed analyses
- **Templates**: Store analysis templates

## Technology Stack

For simplicity and rapid development, we'll use:

| Component       | Technology                  | Justification                                   |
| --------------- | --------------------------- | ----------------------------------------------- |
| Frontend        | Next.js, React, TailwindCSS | Rapid UI development, good developer experience |
| Backend         | Next.js API routes          | Unified deployment, serverless capabilities     |
| Database        | PostgreSQL, Prisma          | Type-safe access, reliable performance          |
| GitHub Access   | Octokit.js                  | Well-maintained GitHub API client               |
| LLM Integration | Simple REST clients         | Easy integration with various LLM servers       |

## Data Flow

### Repository Analysis Flow

1. User inputs a GitHub repository URL
2. App validates and fetches repository metadata via GitHub API
3. User selects analysis template(s)
4. App fetches necessary repository files
5. App sends files and prompts to local LLM
6. LLM processes and returns analysis
7. App formats and displays results

## MVP Security and Privacy

- GitHub API access is limited to public repositories (no authentication required)
- All repository analysis happens on the user's local machine
- No code is sent to external services
- Database contains only metadata, not actual code content

## Deployment Strategy

For the MVP, we'll use:

- **Frontend/Backend**: Vercel (Next.js hosting)
- **Database**: Supabase (PostgreSQL as a service)

This provides a simple, cost-effective deployment with minimal infrastructure management.

## Development Approach

1. **Start with Core UI**: Build the repository explorer and basic structure
2. **Add GitHub Integration**: Implement repository fetching and browsing
3. **Implement LLM Connection**: Build the connector to local LLMs
4. **Create Analysis Flow**: Develop the template system and analysis processing
5. **Build Results Display**: Implement the results viewer

## Future Enhancements

After delivering the MVP, we'll consider:

- User authentication and saved analyses
- Enhanced visualizations
- Custom template editor
- Collaborative features
- Support for private repositories

For now, the focus is on building a solid foundation with the core functionality.
