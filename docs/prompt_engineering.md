# Prompt Engineering for PRD Generation

This document provides guidelines for creating effective prompts for Gitlify's PRD generation system. Well-crafted prompts are essential for extracting high-quality requirements and creating useful diagrams from GitHub repositories.

## Core Principles

### 1. Be Specific and Targeted

- Focus prompts on specific aspects of requirements extraction
- Define exactly what type of information to extract
- Include context about the repository's domain and purpose

**Example:**

```
❌ "Extract requirements from this code."
✅ "Identify the core user-facing features implemented in this e-commerce repository and extract the implicit requirements behind them."
```

### 2. Provide Contextual Awareness

- Ensure prompts understand the repository context
- Reference previously extracted information
- Maintain awareness of the overall project structure

**Example:**

```
❌ "What does this component do?"
✅ "Based on the previously identified core abstractions, analyze this React component and determine:
   1. What user requirements it fulfills
   2. What design decisions were made in its implementation
   3. How it relates to other identified components"
```

### 3. Structure the Output for PRDs

- Specify clear PRD-focused output formats
- Request specific sections and categorization
- Ask for both functional and non-functional requirements

**Example:**

```
❌ "Summarize the code's purpose."
✅ "Extract the following PRD sections from this codebase:
   1. User personas and their needs
   2. Functional requirements (categorized by feature)
   3. Non-functional requirements (performance, security, etc.)
   4. Technical constraints and considerations
   Format as markdown with appropriate headings and bullet points."
```

## Workflow Node Prompting

Gitlify uses a PocketFlow-inspired workflow with separate nodes for processing. Each node requires specific prompt approaches:

### 1. Repository Analysis Node

```
You are analyzing a GitHub repository to understand its overall purpose and structure.

Repository: {{repoName}} by {{repoOwner}}
Primary Languages: {{languageStats}}

Examine the repository structure, README, and key files to determine:
1. What is the primary purpose of this project?
2. Who are the intended users?
3. What domain does it serve?
4. What are the major components or modules?
5. What architectural patterns are evident?

Provide a concise summary that will help with extracting detailed requirements in later steps.
```

### 2. Core Abstractions Node

```
Based on the initial repository analysis, identify the core abstractions in this codebase.

For each key abstraction, provide:
1. Name and purpose
2. Responsibilities and boundaries
3. Relationships with other abstractions
4. Key interfaces or APIs

Focus on identifying between 5-10 central abstractions that form the backbone of the system.
The identified abstractions will be used to organize the PRD and create architecture diagrams.
```

### 3. Requirements Extraction Node

```
Extract implicit and explicit requirements from the codebase for the {{abstractionName}} abstraction.

Analyze:
1. What user needs does this code fulfill?
2. What functional capabilities are implemented?
3. What constraints or non-functional requirements are addressed?
4. What design decisions were made and why?

Format requirements clearly, using precise language and organizing them logically.
Include references to specific code locations that support each requirement.
```

### 4. Architecture Diagram Node

```
Create Mermaid diagram code to visualize the {{diagramType}} for this project.

Based on the analyzed abstractions and their relationships, generate a clear, well-organized diagram showing:
{{diagramSpecificInstructions}}

Use appropriate Mermaid syntax for this diagram type:
- Use meaningful labels
- Group related elements
- Include relevant relationships
- Ensure the diagram is readable and not too complex

Return only valid Mermaid markdown code that can be rendered directly.
```

## Diagram-Specific Prompting

For generating effective architecture diagrams, use specialized prompts:

### Component Diagram

```
Generate a Mermaid component diagram showing the main components of the system and their relationships.

Based on the identified abstractions, show:
1. Primary components as boxes with descriptive labels
2. Dependencies and relationships between components with arrows
3. Direction of data or control flow
4. Logical grouping of related components

Use the graph TD (top-down) orientation for clarity.
```

### Data Flow Diagram

```
Create a Mermaid graph diagram showing the data flow through the system.

Show:
1. Data sources and entry points
2. Processing steps and transformations
3. Storage or persistence points
4. Output or endpoints
5. Direction of data movement with labeled arrows indicating the type of data

Use clear, concise labels that describe the data being transferred.
```

### Entity Relationship Diagram

```
Generate a Mermaid entity-relationship diagram based on the data models in the codebase.

For each entity:
1. Include the entity name
2. Show relationships to other entities (one-to-many, many-to-many, etc.)
3. Indicate the nature of relationships with labels

Focus on the core domain entities that are essential to understanding the system.
```

## Variables for Templates

The following variables are available in our prompt templates:

- `{{repoName}}` - The name of the repository
- `{{repoOwner}}` - The owner of the repository
- `{{repoDescription}}` - Description from the repository
- `{{languageStats}}` - Breakdown of programming languages used
- `{{abstractionName}}` - Name of the current abstraction being processed
- `{{diagramType}}` - Type of diagram being generated
- `{{chapterName}}` - Current PRD chapter being generated
- `{{previousFindings}}` - Summary of information extracted in previous nodes

## Tips for PRD Generation Prompts

1. **Progressive detail** - Start with high-level analysis before extracting specific requirements
2. **Cross-reference code elements** - Ask the LLM to reference specific files or functions when identifying requirements
3. **Emphasize the "why"** - Focus prompts on extracting the reasoning behind implementation decisions
4. **Request categorization** - Ask for requirements to be grouped into logical categories
5. **Seek both explicit and implicit requirements** - Look beyond documented features to infer unstated requirements

## Troubleshooting Prompt Issues

If PRD generation is not producing quality results:

1. **Too general**: Make prompts more specific about the type of requirements to extract
2. **Missing context**: Ensure the LLM has sufficient repository context in the prompt
3. **Ambiguous instructions**: Clarify exactly what format and content you want
4. **Overwhelming complexity**: Break analysis into smaller, focused chunks
5. **Model limitations**: Try using a more capable model for complex repositories

## Future Prompt Development

As Gitlify evolves, we'll enhance our prompting strategy with:

- Fine-tuned prompts for specific repository types (web apps, libraries, etc.)
- Chain-of-thought approaches for better reasoning about requirements
- Domain-specific prompt templates
- Self-critique and refinement steps for generated PRDs
- User-customizable prompt templates
