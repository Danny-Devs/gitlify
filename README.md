# Gist of Git

A tool for analyzing GitHub repositories using locally hosted LLMs.

## Overview

Gist of Git helps developers analyze their GitHub repositories by leveraging locally hosted Large Language Models. This approach ensures:

- **Privacy**: Your code never leaves your machine
- **Customization**: Tailor analysis prompts to your needs
- **Control**: Use the LLM of your choice that runs locally

## Features

- Connect to GitHub repositories
- Process repository data locally
- Send code to your local LLM for analysis
- View comprehensive code insights
- Save and share analysis results

## Tech Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL with Prisma
- TailwindCSS
- Local LLM integration

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- A local LLM setup (like Ollama, LM Studio, etc.)

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/gist-of-git.git
cd gist-of-git
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

4. Fill in the required environment variables in `.env.local`

5. Run database migrations

```bash
npx prisma migrate dev
```

6. Start the development server

```bash
npm run dev
```

## Development

This project follows these principles:

- Start with simplicity - build core features before advanced ones
- User privacy is critical - all code analysis happens locally
- Follow incremental development - build in small, functional steps
- Progressive enhancement - make basic features work well first

## Documentation

For more information about the project, check out the [documentation](./docs/README.md).

## License

MIT
