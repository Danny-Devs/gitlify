# Development Setup Guide

This guide will help you set up your development environment to work on the Gitlify project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or later)
- **npm** (v9.x or later) or **yarn** (v1.22.x or later)
- **Git**
- **PostgreSQL** (v14.x or later) or Docker for running PostgreSQL
- **Local LLM** (Ollama, LM Studio, or similar)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/gitlify.git
cd gitlify
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/gitlify"

# GitHub API (no auth required for MVP)
GITHUB_API_BASE_URL="https://api.github.com"

# LLM API (for local LLM integration)
LLM_API_URL="http://localhost:11434/api"
```

### 4. Set Up the Database

If you have PostgreSQL installed locally:

```bash
# Create the database
createdb gitlify

# Run migrations
npx prisma migrate dev
```

If you prefer using Docker:

```bash
# Start PostgreSQL container
docker run --name gitlify-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=gitlify -p 5432:5432 -d postgres:14

# Run migrations
npx prisma migrate dev
```

### 5. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Setting Up Local LLM

For PRD generation, you'll need to set up a local LLM service:

### Option 1: Ollama

1. Follow the installation instructions on the [Ollama website](https://ollama.ai)
2. Pull a code-focused model:
   ```bash
   ollama pull codellama:7b
   ```
3. Ensure Ollama is running in the background

### Option 2: LM Studio

1. Download and install [LM Studio](https://lmstudio.ai/)
2. Download a code-focused model (CodeLlama, WizardCoder, etc.)
3. Start the local server from the LM Studio interface

## Project Structure

```
gitlify/
├── app/              # Next.js app directory
│   ├── api/          # API routes
│   │   ├── auth/     # Authentication endpoints
│   │   ├── github/   # GitHub API integration
│   │   └── llm/      # LLM integration endpoints
│   ├── components/   # React components
│   │   ├── analysis/   # PRD analysis components
│   │   ├── auth/       # Authentication components
│   │   ├── common/     # Shared UI components
│   │   └── repository/ # Repository components
│   ├── lib/          # Utility functions
│   ├── services/     # Service layer
│   │   ├── analysis/   # PRD generation services
│   │   ├── llm/        # LLM orchestration services
│   │   └── repository/ # Repository handling services
│   └── theme/        # UI theme and styling
├── prisma/           # Prisma schema and migrations
├── public/           # Static assets
└── docs/             # Documentation
```

## Development Workflow

1. **Create a new branch** for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and ensure they pass linting and tests:

   ```bash
   npm run lint
   npm run test
   ```

3. **Submit a pull request** against the main branch

## Common Tasks

### Update Database Schema

1. Modify the schema in `prisma/schema.prisma`
2. Create a migration:
   ```bash
   npx prisma migrate dev --name your-migration-name
   ```

### Add a New API Endpoint

Create a new file in the appropriate location within `app/api/` following the Next.js App Router conventions.

### Implement PocketFlow-Inspired Workflow

When implementing PRD generation nodes:

1. Create node classes in the appropriate service directory
2. Define prep, exec, and post methods for each node
3. Set up flows to connect nodes and manage data

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify your DATABASE_URL in `.env.local`
- Check that your PostgreSQL credentials are correct

### Next.js Build Errors

- Clear the `.next` cache folder:
  ```bash
  rm -rf .next
  npm run dev
  ```

### LLM Connection Issues

- Ensure your LLM service is running
- Check that LLM_API_URL is set correctly in `.env.local`
- Make sure you've pulled the necessary model
- Verify your model has sufficient capabilities for code analysis

### GitHub API Rate Limiting

- The GitHub API has rate limits for unauthenticated requests
- Consider adding GitHub authentication for higher rate limits during development
