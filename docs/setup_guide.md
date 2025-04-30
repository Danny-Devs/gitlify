# Development Setup Guide

This guide provides comprehensive instructions for setting up your development environment to work on the Gitlify project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: **v18.x or later** (Verify with `node -v`)
- **npm**: v9.x or later (Comes with Node.js, verify with `npm -v`)
- **Git**: (Verify with `git --version`)
- **PostgreSQL**: v14.x or later (or Docker)
- **Local LLM Service**: Ollama or LM Studio recommended (See [LLM Setup Guide](llm_setup_guide.md))

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/gitlify.git # Replace with your actual repo URL
cd gitlify
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root by copying the example file:

```bash
cp .env.example .env.local
```

Now, edit `.env.local` and fill in the required values:

```env
# Database Connection
# Example for local PostgreSQL:
DATABASE_URL="postgresql://postgres:password@localhost:5432/gitlify?schema=public"

# NextAuth Configuration
# Used for session management and securing API routes
NEXTAUTH_URL="http://localhost:3000" # Change port if needed
# Generate a strong secret using: openssl rand -base64 32
NEXTAUTH_SECRET="YOUR_STRONG_RANDOM_SECRET_HERE"

# GitHub OAuth Credentials (Required for Sign In)
# Obtain these from GitHub Developer Settings -> OAuth Apps
GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID"
GITHUB_CLIENT_SECRET="YOUR_GITHUB_CLIENT_SECRET"

# Local LLM API Endpoint
# Default for Ollama. Adjust if using LM Studio or different port.
LLM_API_URL="http://localhost:11434/api"

# Add other variables as needed (e.g., specific API keys for external services)
```

**Detailed Variable Setup:**

- **`DATABASE_URL`**: Update the username, password, host, port, and database name to match your PostgreSQL setup.
- **`NEXTAUTH_URL`**: Ensure this matches the URL where your development server runs (typically `http://localhost:3000`).
- **`NEXTAUTH_SECRET`**: Generate a secure random string using `openssl rand -base64 32` in your terminal and paste the result here.
- **`GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`**:
  1.  Go to [GitHub Developer Settings > OAuth Apps](https://github.com/settings/developers).
  2.  Click "New OAuth App".
  3.  **Application name**: `Gitlify Dev` (or similar)
  4.  **Homepage URL**: `http://localhost:3000` (or your dev port)
  5.  **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (adjust port if needed)
  6.  Register the application.
  7.  Copy the "Client ID" into `GITHUB_CLIENT_ID`.
  8.  Generate a "New client secret" and copy it into `GITHUB_CLIENT_SECRET`.
- **`LLM_API_URL`**: Use `http://localhost:11434/api` for Ollama's default. For LM Studio, check the URL provided when you start its local server (often `http://localhost:1234/v1`).

### 4. Set Up the Database

**Option A: Local PostgreSQL Installation**

1.  Ensure your PostgreSQL server is running.
2.  Create the database (if it doesn't exist):
    ```bash
    createdb gitlify
    ```
3.  Apply migrations and generate Prisma client:
    ```bash
    npx prisma migrate dev
    ```

**Option B: Using Docker**

1.  Make sure Docker is running.
2.  Start a PostgreSQL container:
    ```bash
    docker run --name gitlify-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=gitlify -p 5432:5432 -d postgres:14
    ```
    _(Adjust `POSTGRES_PASSWORD`, `POSTGRES_USER`, `POSTGRES_DB` if needed and update your `DATABASE_URL` accordingly)_
3.  Apply migrations and generate Prisma client:
    ```bash
    npx prisma migrate dev
    ```

### 5. Start the Development Server

```bash
npm run dev
```

The application should now be available at `http://localhost:3000` (or the port specified in `NEXTAUTH_URL` / chosen by Next.js if 3000 is busy).

## Setting Up Local LLM Service

Refer to the [LLM Setup Guide](llm_setup_guide.md) for detailed instructions on installing and running Ollama or LM Studio and downloading appropriate code models like CodeLlama.

## Project Structure Overview

```
gitlify/
├── app/              # Next.js app directory (routes, UI)
├── components/       # Shared React components (UI logic)
├── docs/             # Project documentation
├── lib/              # Shared utilities, clients (Prisma, LLM, GitHub)
├── prisma/           # Prisma schema, migrations, seeds
├── public/           # Static assets (images, fonts)
├── scripts/          # Utility scripts (e.g., reset-db.sql)
├── .env.example      # Example environment variables
├── .gitignore
├── next.config.mjs   # Next.js configuration
├── package.json
├── postcss.config.mjs # PostCSS config (for Tailwind)
├── README.md         # Project overview
└── tsconfig.json     # TypeScript configuration
```

## Development Workflow

1.  **Branching**: Create feature branches from `main` (e.g., `feature/new-prd-viewer`).
2.  **Coding**: Implement features, following code style guidelines (`.cursorrules`, linting).
3.  **Testing**: Write unit/integration tests (see `testing_strategy.md`). Run tests: `npm test`.
4.  **Linting**: Check code quality: `npm run lint`.
5.  **Committing**: Write clear, concise commit messages.
6.  **Pull Request**: Submit PRs to `main` for review.

## Common Tasks

- **Update Database Schema**: Modify `prisma/schema.prisma`, then run `npx prisma migrate dev --name <migration_name>`.
- **Generate Prisma Client**: Usually automatic after migration, but can run manually: `npx prisma generate`.
- **Reset Database**: Use the script: `psql -U <user> -d gitlify -a -f scripts/reset-db.sql` (adjust user/db) or `npx prisma migrate reset`.
- **Add API Endpoint**: Create route handlers in `app/api/...` following Next.js conventions.
- **Implement Workflow Node**: Create node classes (likely in a `services/` or `workflows/` directory - TBD), define `prep`, `exec`, `post` methods.

## Troubleshooting

- **Database Connection**: Verify `DATABASE_URL`, ensure PostgreSQL is running, check credentials.
- **Next.js Errors**: Try clearing cache: `rm -rf .next`, then restart `npm run dev`.
- **LLM Connection**: Ensure LLM service is running, `LLM_API_URL` is correct, model is available.
- **Auth Issues**: Double-check GitHub OAuth credentials and callback URL in GitHub settings and `.env.local`. Ensure `NEXTAUTH_SECRET` is set.

_For further details on specific areas like LLM setup, PocketFlow, or Testing, refer to the dedicated guides in the `/docs` directory._
