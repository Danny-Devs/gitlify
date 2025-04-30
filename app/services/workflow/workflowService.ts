/**
 * Workflow Service
 *
 * This service orchestrates the PocketFlow nodes to generate a PRD.
 * It handles workflow initialization, node execution, and state management.
 */

import prisma from '@/lib/prisma';
import { RepositoryAnalysisNode } from './nodes/RepositoryAnalysisNode';
import { CoreAbstractionsNode } from './nodes/CoreAbstractionsNode';
import { RequirementsExtractionNode } from './nodes/RequirementsExtractionNode';
import { PRDGenerationState } from './types';

/**
 * Initialize a new PRD generation workflow
 */
export async function initializeWorkflow(
  userId: string,
  repositoryId: string,
  llmConfigId: string
): Promise<string> {
  // Get repository details
  const repository = await prisma.repository.findUnique({
    where: { id: repositoryId }
  });

  if (!repository) {
    throw new Error(`Repository with ID ${repositoryId} not found`);
  }

  // Create workflow run in database
  const workflowRun = await prisma.workflowRun.create({
    data: {
      status: 'pending',
      repositoryId,
      userId,
      configurationId: llmConfigId
    }
  });

  return workflowRun.id;
}

/**
 * Execute the repository analysis node
 */
export async function executeRepositoryAnalysis(
  workflowRunId: string
): Promise<PRDGenerationState> {
  // Get workflow run details
  const workflowRun = await prisma.workflowRun.findUnique({
    where: { id: workflowRunId },
    include: {
      repository: true,
      user: true,
      configuration: true
    }
  });

  if (!workflowRun) {
    throw new Error(`Workflow run with ID ${workflowRunId} not found`);
  }

  // Update workflow run status
  await prisma.workflowRun.update({
    where: { id: workflowRunId },
    data: { status: 'running' }
  });

  // Initialize state
  const initialState: PRDGenerationState = {
    workflowRunId,
    repositoryId: workflowRun.repositoryId,
    userId: workflowRun.userId,
    repository: {
      id: workflowRun.repository.id,
      name: workflowRun.repository.name,
      owner: workflowRun.repository.owner,
      url: workflowRun.repository.url
    }
  };

  // Execute repository analysis node
  const node = new RepositoryAnalysisNode();
  const result = await node.run(initialState);

  if (result.error) {
    // Update workflow run status to failed
    await prisma.workflowRun.update({
      where: { id: workflowRunId },
      data: {
        status: 'failed',
        completedAt: new Date()
      }
    });

    throw result.error;
  }

  return result.state;
}

/**
 * Execute the core abstractions node
 */
export async function executeCoreAbstractions(
  state: PRDGenerationState
): Promise<PRDGenerationState> {
  const node = new CoreAbstractionsNode();
  const result = await node.run(state);

  if (result.error) {
    // Update workflow run status to failed
    await prisma.workflowRun.update({
      where: { id: state.workflowRunId },
      data: {
        status: 'failed',
        completedAt: new Date()
      }
    });

    throw result.error;
  }

  return result.state;
}

/**
 * Execute the requirements extraction for a single abstraction
 */
export async function executeRequirementsExtraction(
  state: PRDGenerationState
): Promise<PRDGenerationState> {
  const node = new RequirementsExtractionNode();
  const result = await node.run(state);

  if (result.error) {
    // Update workflow run status to failed
    await prisma.workflowRun.update({
      where: { id: state.workflowRunId },
      data: {
        status: 'failed',
        completedAt: new Date()
      }
    });

    throw result.error;
  }

  // If all abstractions have been processed, mark the workflow as complete
  if (result.state.abstractionsComplete) {
    await prisma.workflowRun.update({
      where: { id: state.workflowRunId },
      data: {
        status: 'completed',
        completedAt: new Date()
      }
    });

    // Save PRD to database
    await createPRD(result.state);
  }

  return result.state;
}

/**
 * Create a PRD from the workflow state
 */
async function createPRD(state: PRDGenerationState): Promise<void> {
  if (!state.repository || !state.repositoryAnalysis || !state.abstractions) {
    throw new Error('Incomplete state for PRD creation');
  }

  // Create PRD
  const prd = await prisma.pRD.create({
    data: {
      title: `${state.repository.name} PRD`,
      summary: state.repositoryAnalysis.summary,
      status: 'draft',
      repositoryId: state.repositoryId,
      userId: state.userId,
      metadata: {
        generatedAt: new Date(),
        abstractionsCount: state.abstractions.length,
        workflowRunId: state.workflowRunId
      }
    }
  });

  // Create chapters
  await createPRDChapters(prd.id, state);
}

/**
 * Create chapters for a PRD
 */
async function createPRDChapters(
  prdId: string,
  state: PRDGenerationState
): Promise<void> {
  if (!state.repository || !state.repositoryAnalysis || !state.abstractions) {
    throw new Error('Incomplete state for chapter creation');
  }

  // Create overview chapter
  await prisma.chapter.create({
    data: {
      title: 'Project Overview',
      orderIndex: 0,
      content: `# ${state.repository.name} Project Overview\n\n${state.repositoryAnalysis.summary}`,
      prdId
    }
  });

  // Create abstractions chapter
  await prisma.chapter.create({
    data: {
      title: 'Core Abstractions',
      orderIndex: 1,
      content: formatAbstractionsChapter(state.abstractions),
      prdId
    }
  });

  // Create requirements chapters for each abstraction
  for (let i = 0; i < state.abstractions.length; i++) {
    const abstraction = state.abstractions[i];

    if (abstraction.requirements && abstraction.requirements.length > 0) {
      await prisma.chapter.create({
        data: {
          title: `Requirements: ${abstraction.name}`,
          orderIndex: i + 2,
          content: formatRequirementsChapter(abstraction),
          prdId
        }
      });
    }
  }
}

/**
 * Format the abstractions chapter content
 */
function formatAbstractionsChapter(abstractions: any[]): string {
  let content = '# Core Abstractions\n\n';
  content +=
    'This chapter describes the core abstractions identified in the codebase. ';
  content +=
    'These abstractions form the backbone of the system and help organize requirements.\n\n';

  for (const abstraction of abstractions) {
    content += `## ${abstraction.name}\n\n`;
    content += `${abstraction.description}\n\n`;

    content += '### Responsibilities\n\n';
    for (const responsibility of abstraction.responsibilities) {
      content += `- ${responsibility}\n`;
    }
    content += '\n';

    content += '### Relationships\n\n';
    for (const relationship of abstraction.relationships) {
      content += `- **${relationship.name}**: ${relationship.type} - ${relationship.description}\n`;
    }
    content += '\n';
  }

  return content;
}

/**
 * Format a requirements chapter for an abstraction
 */
function formatRequirementsChapter(abstraction: any): string {
  let content = `# Requirements: ${abstraction.name}\n\n`;
  content += `This chapter describes the requirements for the ${abstraction.name} abstraction.\n\n`;
  content += `${abstraction.description}\n\n`;

  // Group requirements by type
  const functional = abstraction.requirements.filter(
    (r: any) => r.type === 'functional'
  );
  const nonFunctional = abstraction.requirements.filter(
    (r: any) => r.type === 'non-functional'
  );
  const technical = abstraction.requirements.filter(
    (r: any) => r.type === 'technical'
  );
  const userStories = abstraction.requirements.filter(
    (r: any) => r.type === 'user-story'
  );

  if (functional.length > 0) {
    content += '## Functional Requirements\n\n';
    for (const req of functional) {
      content += formatRequirement(req);
    }
  }

  if (nonFunctional.length > 0) {
    content += '## Non-Functional Requirements\n\n';
    for (const req of nonFunctional) {
      content += formatRequirement(req);
    }
  }

  if (technical.length > 0) {
    content += '## Technical Requirements\n\n';
    for (const req of technical) {
      content += formatRequirement(req);
    }
  }

  if (userStories.length > 0) {
    content += '## User Stories\n\n';
    for (const req of userStories) {
      content += formatRequirement(req);
    }
  }

  return content;
}

/**
 * Format a single requirement
 */
function formatRequirement(requirement: any): string {
  let content = `### ${requirement.description}\n\n`;

  if (requirement.rationale) {
    content += `**Rationale**: ${requirement.rationale}\n\n`;
  }

  if (requirement.codeReferences && requirement.codeReferences.length > 0) {
    content += '**Code References**:\n';
    for (const ref of requirement.codeReferences) {
      content += `- ${ref}\n`;
    }
    content += '\n';
  }

  content += `**Priority**: ${
    requirement.priority.charAt(0).toUpperCase() + requirement.priority.slice(1)
  }\n\n`;

  return content;
}
