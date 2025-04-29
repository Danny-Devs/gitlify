# CodeGrok

Deeply understand any public GitHub repository with AI-powered explanations and visualizations.

## Overview

CodeGrok transforms complex GitHub repositories into intuitive learning experiences, helping developers understand unfamiliar codebases faster. Using locally hosted Large Language Models, we provide multi-layered explanations that cover everything from high-level architecture to detailed implementation, with the goal of enabling users to progress from understanding to meaningful contribution.

- **Multi-layered Explanations**: Access explanations that adapt to your level of understanding
- **Side-by-side Code Annotations**: See detailed explanations right alongside the code
- **Visual Understanding**: View generated diagrams that illustrate component relationships
- **Contribution Pathways**: Identify opportunities to contribute through tests, documentation, or refactoring
- **Community Enhancement**: Explanations improve through user feedback and A/B testing

## Features

- Explore curated repositories organized by domain and complexity
- Get instant architectural overviews and component relationship diagrams
- Study code with intelligent annotations and explanations
- Identify patterns, dependencies, and design decisions
- Track your learning progress across multiple repositories
- Discover contribution opportunities with guided workflows
- Rate explanations to help improve the collective understanding
- Build a portfolio of repositories you've mastered

## Use Cases

- **Faster Onboarding**: Quickly understand complex projects with minimal friction
- **Open Source Contribution**: Progress from understanding to making meaningful contributions
- **Learning Best Practices**: Study how successful projects are structured and implemented
- **Code Review Enhancement**: Better understand code you're reviewing with contextual explanations
- **Technical Evaluation**: Assess potential dependencies before adding them to your project

## Tech Stack

- Next.js 14+ with App Router
- TypeScript
- PostgreSQL with Prisma ORM
- TailwindCSS with Shadcn/UI
- Local LLM integration (Ollama, LM Studio)
- Interactive visualization libraries
- GitHub API integration

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- A local LLM setup (like Ollama, LM Studio, etc.)

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/code-grok.git
cd code-grok
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

## How It Works

1. **Repository Analysis**: We fetch and analyze the repository structure using local LLMs
2. **Explanation Generation**: The system creates multiple layers of explanation for the codebase
3. **Visualization Creation**: Supporting diagrams are generated to illustrate component relationships
4. **Learning Path Construction**: Progressive checkpoints guide users from overview to details
5. **Contribution Preparation**: Areas for potential contribution are identified
6. **Feedback Loop**: User ratings and A/B testing continuously improve explanation quality

## Development Principles

- Focus on creating clear, context-aware explanations
- Build progressive learning paths from high-level to detailed understanding
- Ensure all processing happens locally for privacy and control
- Use community feedback to continuously improve explanation quality
- Create visualizations that enhance understanding of complex relationships
- Lower the barrier to meaningful open source contributions

## Documentation

For more detailed information about the project, check out the [documentation](./docs/README.md).

## License

MIT
