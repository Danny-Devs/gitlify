# Gitlify

Gitlify transforms GitHub repositories into comprehensive Project Requirement Documents (PRDs), enabling developers to understand, rebuild, and contribute to open-source projects.

## 🚀 Features

- **Reverse-Engineer PRDs**: Generate detailed specifications from public GitHub repositories
- **Chapter-Based Organization**: Progressively explore projects from high-level concepts to implementation details
- **Architecture Visualization**: Automatically create Mermaid diagrams showing component relationships and system architecture
- **Local LLM Integration**: Use your own computing resources with Ollama, LM Studio, or other local LLM providers
- **PocketFlow-Inspired Workflow**: Advanced LLM orchestration for handling large repositories and complex analysis
- **Community Curation**: Rate, review, and improve PRDs to build a valuable resource for developers

## 🔍 How It Works

1. **Select Repository**: Choose any public GitHub repository you want to analyze
2. **Configure Analysis**: Set analysis depth and focus areas
3. **Generate PRD**: Our system analyzes the repository to extract requirements and generate detailed specifications
4. **Explore Results**: Navigate through the PRD's progressive chapters and visualizations
5. **Rebuild & Contribute**: Use the PRD to implement your own version, then contribute improvements back to the original

## 🧩 Why Gitlify?

Gitlify helps developers:

- **Understand Projects Deeply**: Go beyond code to discover the "why" behind implementation decisions
- **Learn Software Design**: See how successful projects are structured and architected
- **Build Better Software**: Use PRDs as a foundation for creating improved implementations
- **Contribute Meaningfully**: Make significant contributions to open-source projects based on deep understanding

## 🔄 PocketFlow Architecture

Gitlify uses a PocketFlow-inspired workflow to analyze repositories of any size:

1. **Node-Based Processing**: Breaking PRD generation into discrete, focused steps
2. **Progressive Analysis**: Building up context from repository overview to detailed requirements
3. **State Management**: Maintaining analysis state for resumable, reliable processing
4. **Context Optimization**: Strategically managing context windows to handle large repositories

This approach enables Gitlify to generate high-quality PRDs from even the largest and most complex codebases.

## 🛠️ Technology Stack

- Next.js 15+ and React 19+ for the frontend and API routes
- TypeScript for type safety
- PostgreSQL with Prisma ORM for data storage
- Tailwind CSS v4 with Shadcn/UI for UI components
  - Using modern @tailwindcss/postcss plugin configuration
  - CSS imports via `@import "tailwindcss";` syntax
- Local LLM integration (Ollama, LM Studio)
- Mermaid.js for architecture diagrams
- PocketFlow-inspired workflow for LLM orchestration

## 📚 Documentation

For more details, see our documentation:

- [Project Vision](docs/project_vision.md)
- [Project Requirements Document](docs/prd.md)
- [Technical Architecture](docs/technical_architecture.md)
- [Getting Started](docs/getting_started.md)
- [PocketFlow Implementation Guide](docs/pocket_flow_guide.md)
- [Mermaid Diagram Guide](docs/mermaid-diagram-guide.md)
- [Prompt Engineering Guidelines](docs/prompt_engineering.md)
- [Complete Documentation Index](docs/README.md)

## 🧪 Development

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Local LLM setup (Ollama, LM Studio, or similar)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/gitlify.git
   cd gitlify
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase and GitHub configuration
   ```

   Configure the following environment variables:

   - `DATABASE_URL` and `DIRECT_URL`: Supabase PostgreSQL connection strings
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase client credentials
   - `GITHUB_ACCESS_TOKEN`: GitHub personal access token for API access

4. Initialize the database with Prisma

   ```bash
   npx prisma db push
   # Or if you prefer to create migrations:
   # npx prisma migrate dev
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

### Supabase and Prisma Integration

Gitlify uses a combination of:

- **Prisma ORM**: For type-safe database access and schema management
- **Supabase PostgreSQL**: As the database provider
- **Supabase SDK**: For authentication, storage, and other Supabase features

The database schema is defined in `prisma/schema.prisma` and all database operations go through Prisma for type safety and query optimization.

### Setting Up Local LLMs

For optimal PRD generation, we recommend:

1. Ollama with CodeLlama 7B or 13B
2. LM Studio with a suitable code-oriented model
3. At least 16GB RAM for efficient processing

See our [LLM Setup Guide](docs/llm_setup_guide.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please check out our [contributing guidelines](CONTRIBUTING.md) to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Implementation Progress

### Phase 1: Core Functionality

- ✅ Repository analysis workflow
  - ✅ GitHub repository integration
  - ✅ Repository structure analysis
  - ✅ Core abstractions extraction
  - ✅ Requirements extraction
- ✅ Basic PRD generation

### Phase 2: Testing and CI/CD

- ✅ Testing infrastructure with Jest and React Testing Library
  - ✅ Unit tests for core functionality
  - ✅ Integration tests for workflow nodes
  - ✅ Component tests for UI elements
- ✅ Continuous Integration setup
  - ✅ GitHub Actions workflow
  - ✅ Test coverage reporting
  - ✅ Linting and type checking

### Phase 3: Enhanced Features

- 🔄 PRD templates
- 🔄 Collaborative editing
- 🔄 Export to different formats
- 🔄 Version control for PRDs

### Phase 4: Advanced Features

- 🚫 Custom LLM integrations
- 🚫 Fine-tuning for specific domains
- 🚫 Enterprise features
  - 🚫 Team management
  - 🚫 SSO integration
  - 🚫 Custom branding

## Testing

We have comprehensive test coverage for Gitlify's core functionality. Read more about our testing approach in [docs/testing.md](docs/testing.md).

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run validation (lint + type-check + test)
npm run validate
```
