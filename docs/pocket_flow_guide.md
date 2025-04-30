# PocketFlow Implementation Guide

This guide explains how to implement a PocketFlow-inspired architecture for PRD generation in Gitlify, enabling efficient processing of large repositories beyond LLM context limits.

## What is PocketFlow?

PocketFlow is a lightweight framework for orchestrating Large Language Model (LLM) applications created by Zachary Huang. It provides a way to break complex tasks into manageable nodes, allowing for:

1. Processing of large codebases despite LLM context limitations
2. Structured, chainable workflows with clear data flow
3. Easy debugging and state inspection
4. Separation of task preparation, execution, and post-processing

## Core Concepts

### 1. Node

A node is a single unit of work that represents a discrete step in the PRD generation process. Each node has three main methods:

- **prep**: Prepares the input for the LLM call (e.g., formatting prompt, gathering context)
- **exec**: Makes the actual call to the LLM
- **post**: Processes the LLM output (e.g., parsing, formatting, saving)

### 2. Flow

A flow is a collection of nodes arranged in a specific order, where the output of one node becomes the input for the next. Flows can also have branches, conditionals, and loops.

### 3. State

Each node executes with specific state data and produces updated state that's passed to subsequent nodes. State management enables tracking progress and resuming interrupted workflows.

## Implementation in Gitlify

### Node Base Class

Create a base Node class that all specialized nodes will inherit from:

```typescript
abstract class Node<T extends Record<string, any>> {
  abstract name: string;

  async prep(input: T): Promise<{ prompt: string; state: T }> {
    return { prompt: '', state: input };
  }

  async exec(
    prompt: string,
    state: T
  ): Promise<{ response: string; state: T }> {
    // Default implementation would call the LLM
    return { response: '', state };
  }

  async post(response: string, state: T): Promise<T> {
    return state;
  }

  async run(input: T): Promise<T> {
    const { prompt, state } = await this.prep(input);
    const { response, state: updatedState } = await this.exec(prompt, state);
    return this.post(response, updatedState);
  }
}
```

### PRD Generation Nodes

#### 1. RepositoryAnalysisNode

Analyzes the repository structure and metadata:

```typescript
class RepositoryAnalysisNode extends Node<PRDGenerationState> {
  name = 'repository_analysis';

  async prep(input: PRDGenerationState) {
    const { repository } = input;
    const readmeContent = await fetchRepositoryReadme(repository.url);
    const fileStructure = await fetchRepositoryStructure(repository.url);

    const prompt = `You are analyzing a GitHub repository to understand its overall purpose and structure.
    
Repository: ${repository.name} by ${repository.owner}
Primary Languages: ${getLanguageStats(fileStructure)}

${readmeContent ? `README Content:\n${readmeContent}\n\n` : ''}
File Structure:\n${formatFileStructure(fileStructure)}

Examine the repository structure, README, and key files to determine:
1. What is the primary purpose of this project?
2. Who are the intended users?
3. What domain does it serve?
4. What are the major components or modules?
5. What architectural patterns are evident?

Provide a concise summary that will help with extracting detailed requirements in later steps.`;

    return { prompt, state: input };
  }

  async post(response: string, state: PRDGenerationState) {
    return {
      ...state,
      repositoryAnalysis: {
        summary: response,
        timestamp: new Date()
      }
    };
  }
}
```

#### 2. CoreAbstractionsNode

Identifies key abstractions in the codebase:

```typescript
class CoreAbstractionsNode extends Node<PRDGenerationState> {
  name = 'core_abstractions';

  async prep(input: PRDGenerationState) {
    const { repository, repositoryAnalysis } = input;
    const keyFiles = await findKeyFiles(repository.url);

    const prompt = `Based on the initial repository analysis, identify the core abstractions in this codebase.

Repository Analysis:
${repositoryAnalysis.summary}

Key Files:
${formatKeyFiles(keyFiles)}

For each key abstraction, provide:
1. Name and purpose
2. Responsibilities and boundaries
3. Relationships with other abstractions
4. Key interfaces or APIs

Focus on identifying between 5-10 central abstractions that form the backbone of the system.
The identified abstractions will be used to organize the PRD and create architecture diagrams.`;

    return { prompt, state: input };
  }

  async post(response: string, state: PRDGenerationState) {
    const abstractions = parseAbstractions(response);

    return {
      ...state,
      abstractions,
      currentAbstractionIndex: 0
    };
  }
}
```

#### 3. RequirementsExtractionNode

Extracts requirements for each identified abstraction:

```typescript
class RequirementsExtractionNode extends Node<PRDGenerationState> {
  name = 'requirements_extraction';

  async prep(input: PRDGenerationState) {
    const { repository, abstractions, currentAbstractionIndex } = input;
    const abstraction = abstractions[currentAbstractionIndex];

    const relevantFiles = await findRelevantFiles(repository.url, abstraction);
    const fileContents = await fetchFileContents(repository.url, relevantFiles);

    const prompt = `Extract implicit and explicit requirements from the codebase for the ${
      abstraction.name
    } abstraction.

Abstraction Description:
${abstraction.description}

Relevant Code:
${formatFileContents(fileContents)}

Analyze:
1. What user needs does this code fulfill?
2. What functional capabilities are implemented?
3. What constraints or non-functional requirements are addressed?
4. What design decisions were made and why?

Format requirements clearly, using precise language and organizing them logically.
Include references to specific code locations that support each requirement.`;

    return { prompt, state: input };
  }

  async post(response: string, state: PRDGenerationState) {
    const { abstractions, currentAbstractionIndex } = state;
    const requirements = parseRequirements(response);

    // Update the current abstraction with its requirements
    const updatedAbstractions = [...abstractions];
    updatedAbstractions[currentAbstractionIndex] = {
      ...updatedAbstractions[currentAbstractionIndex],
      requirements
    };

    // Move to the next abstraction or finish
    const nextIndex = currentAbstractionIndex + 1;
    const isComplete = nextIndex >= abstractions.length;

    return {
      ...state,
      abstractions: updatedAbstractions,
      currentAbstractionIndex: nextIndex,
      abstractionsComplete: isComplete
    };
  }
}
```

#### 4. DiagramGenerationNode

Creates Mermaid diagrams for the PRD:

```typescript
class DiagramGenerationNode extends Node<PRDGenerationState> {
  name = 'diagram_generation';
  diagramType: string;

  constructor(diagramType: string) {
    super();
    this.diagramType = diagramType;
  }

  async prep(input: PRDGenerationState) {
    const { abstractions, repositoryAnalysis } = input;

    let diagramSpecificInstructions = '';

    switch (this.diagramType) {
      case 'component':
        diagramSpecificInstructions = `
1. Primary components as boxes with descriptive labels
2. Dependencies and relationships between components with arrows
3. Direction of data or control flow
4. Logical grouping of related components`;
        break;
      case 'data_flow':
        diagramSpecificInstructions = `
1. Data sources and entry points
2. Processing steps and transformations
3. Storage or persistence points
4. Output or endpoints
5. Direction of data movement with labeled arrows indicating the type of data`;
        break;
      case 'entity_relationship':
        diagramSpecificInstructions = `
1. Key entities identified in the abstractions
2. Relationships between entities with proper cardinality
3. Important attributes of each entity`;
        break;
    }

    const prompt = `Create Mermaid diagram code to visualize the ${
      this.diagramType
    } diagram for this project.

Repository Summary:
${repositoryAnalysis.summary}

Abstractions:
${formatAbstractions(abstractions)}

Based on the analyzed abstractions and their relationships, generate a clear, well-organized diagram showing:
${diagramSpecificInstructions}

Use appropriate Mermaid syntax for this diagram type:
- Use meaningful labels
- Group related elements
- Include relevant relationships
- Ensure the diagram is readable and not too complex

Return only valid Mermaid markdown code that can be rendered directly.`;

    return { prompt, state: input };
  }

  async post(response: string, state: PRDGenerationState) {
    // Extract the Mermaid code from the response
    const mermaidCode = extractMermaidCode(response);

    // Add the diagram to the state
    return {
      ...state,
      diagrams: [
        ...(state.diagrams || []),
        {
          type: this.diagramType,
          mermaidCode,
          title: `${this.diagramType.replace('_', ' ')} diagram`.toUpperCase(),
          createdAt: new Date()
        }
      ]
    };
  }
}
```

#### 5. PRDChapterNode

Generates a specific chapter of the PRD:

```typescript
class PRDChapterNode extends Node<PRDGenerationState> {
  name = 'prd_chapter';
  chapterType: string;

  constructor(chapterType: string) {
    super();
    this.chapterType = chapterType;
  }

  async prep(input: PRDGenerationState) {
    const { repository, repositoryAnalysis, abstractions, diagrams } = input;

    let chapterPrompt = '';

    switch (this.chapterType) {
      case 'executive_summary':
        chapterPrompt = `Create an executive summary for the PRD that provides a high-level overview of:
1. The project purpose and goals
2. The target audience
3. The key features and capabilities
4. The overall architectural approach

Keep it concise (3-5 paragraphs) and written for both technical and non-technical stakeholders.`;
        break;
      case 'functional_requirements':
        chapterPrompt = `Create a comprehensive list of functional requirements based on the analyzed abstractions.
Organize them by feature area and include:
1. User-facing requirements
2. System requirements
3. Integration requirements

Number each requirement and include rationale where helpful.`;
        break;
      // Additional chapter types...
    }

    const prompt = `You are creating the "${this.chapterType.replace(
      '_',
      ' '
    )}" chapter for a Project Requirements Document (PRD).

Repository: ${repository.name}
${repositoryAnalysis.summary}

${chapterPrompt}

Format the chapter in Markdown with clear headings, bullet points, and numbered lists as appropriate.`;

    return { prompt, state: input };
  }

  async post(response: string, state: PRDGenerationState) {
    // Add the chapter to the state
    return {
      ...state,
      chapters: [
        ...(state.chapters || []),
        {
          type: this.chapterType,
          title: this.chapterType
            .replace('_', ' ')
            .replace(/\b\w/g, l => l.toUpperCase()),
          content: response,
          orderIndex: determineChapterOrder(this.chapterType),
          createdAt: new Date()
        }
      ]
    };
  }
}
```

### Flow Construction

Build the PRD generation flow by combining nodes:

```typescript
async function buildPRDGenerationFlow(
  repository: Repository
): Promise<Flow<PRDGenerationState>> {
  const initialState: PRDGenerationState = {
    repository,
    startedAt: new Date()
  };

  const flow = new Flow<PRDGenerationState>();

  // Core analysis nodes
  flow.addNode(new RepositoryAnalysisNode());
  flow.addNode(new CoreAbstractionsNode());

  // Requirements extraction loop
  flow.addNode(
    new LoopNode<PRDGenerationState>(
      state => !state.abstractionsComplete,
      new RequirementsExtractionNode()
    )
  );

  // Diagram generation
  flow.addNode(new DiagramGenerationNode('component'));
  flow.addNode(new DiagramGenerationNode('data_flow'));
  flow.addNode(new DiagramGenerationNode('entity_relationship'));

  // PRD chapter generation
  flow.addNode(new PRDChapterNode('executive_summary'));
  flow.addNode(new PRDChapterNode('user_personas'));
  flow.addNode(new PRDChapterNode('functional_requirements'));
  flow.addNode(new PRDChapterNode('non_functional_requirements'));
  flow.addNode(new PRDChapterNode('architecture'));
  flow.addNode(new PRDChapterNode('implementation_considerations'));

  // Final compilation
  flow.addNode(new PRDCompilationNode());

  return flow;
}
```

### State Management and Persistence

Implement state persistence to allow resuming interrupted workflows:

```typescript
// Save workflow state after each node execution
async function saveWorkflowState(
  workflowRunId: string,
  nodeName: string,
  state: any
): Promise<void> {
  await prisma.workflowState.create({
    data: {
      nodeName,
      status: 'completed',
      input: state.input,
      output: state.output,
      workflowRunId,
      startedAt: state.startedAt,
      completedAt: new Date()
    }
  });
}

// Resume workflow from the last completed node
async function resumeWorkflow(
  workflowRunId: string
): Promise<PRDGenerationState> {
  const states = await prisma.workflowState.findMany({
    where: { workflowRunId },
    orderBy: { completedAt: 'desc' }
  });

  if (states.length === 0) {
    throw new Error('No states found for workflow');
  }

  return states[0].output as PRDGenerationState;
}
```

## Best Practices

1. **Atomicity**: Keep nodes focused on a single responsibility
2. **Idempotency**: Design nodes to be safely rerunnable
3. **Error Handling**: Implement robust error capture to aid debugging
4. **Context Management**: Carefully manage LLM context size to avoid token limits
5. **Incremental Processing**: Process large repositories in manageable chunks
6. **Logging**: Add detailed logs at each step to trace execution
7. **Caching**: Cache intermediate results for efficiency

## Example: PRD Generation Workflow

A typical workflow for a repository might follow this pattern:

1. **Initial Analysis**: Scan the repository structure and README
2. **Core Abstractions**: Identify key components and their relationships
3. **Per-Abstraction Requirements**: Process each abstraction for detailed requirements
4. **Architecture Visualization**: Generate architecture diagrams
5. **Chapter Generation**: Create structured PRD chapters
6. **Compilation**: Assemble the final PRD document

## Debugging and Testing

1. **Node Testing**: Test individual nodes with sample inputs
2. **Flow Validation**: Verify node connections and data flow
3. **State Inspection**: Add tools to visualize state at each step
4. **Interruption Testing**: Ensure workflows can be properly resumed

## Integration with Gitlify UI

The PocketFlow-based PRD generation system integrates with the Gitlify UI through:

1. **Progress Tracking**: Display workflow progress to users
2. **Chapter Preview**: Show completed chapters as they become available
3. **Diagram Rendering**: Render Mermaid diagrams in the UI
4. **Interactive Feedback**: Allow users to provide feedback on generated content

## Conclusion

By implementing a PocketFlow-inspired architecture, Gitlify can effectively handle repositories of any size, breaking the PRD generation process into manageable steps while maintaining context across the workflow.
