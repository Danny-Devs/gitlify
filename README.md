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

- Next.js and React for the frontend and API routes
- TypeScript for type safety
- PostgreSQL with Prisma ORM for data storage
- TailwindCSS with Shadcn/UI for UI components
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
   # Edit .env.local with your database and LLM configuration
   ```

4. Initialize the database

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

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
