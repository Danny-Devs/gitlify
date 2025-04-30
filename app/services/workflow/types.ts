/**
 * Types for the workflow service
 * This implements the PocketFlow-inspired architecture for PRD generation
 */

/**
 * Base state interface that all workflow states must extend
 */
export interface BaseWorkflowState {
  workflowRunId: string;
  repositoryId: string;
  userId: string;
}

/**
 * Repository analysis workflow state
 */
export interface PRDGenerationState extends BaseWorkflowState {
  repository: {
    id: string;
    name: string;
    owner: string;
    url: string;
    description?: string;
    language?: string | Record<string, any>;
    topics?: string[];
  };
  repositoryAnalysis?: {
    summary: string;
    timestamp: Date;
  };
  abstractions?: Abstraction[];
  currentAbstractionIndex?: number;
  abstractionsComplete?: boolean;
  diagrams?: Diagram[];
  chapters?: Chapter[];
}

/**
 * Core abstraction identified in a repository
 */
export interface Abstraction {
  name: string;
  description: string;
  responsibilities: string[];
  relationships: {
    name: string;
    type: string;
    description: string;
  }[];
  interfaces?: string[];
  requirements?: Requirement[];
}

/**
 * Requirement extracted from the codebase
 */
export interface Requirement {
  id: string;
  type: 'functional' | 'non-functional' | 'technical' | 'user-story';
  description: string;
  rationale?: string;
  codeReferences?: string[];
  priority?: 'low' | 'medium' | 'high';
}

/**
 * Generated diagram
 */
export interface Diagram {
  title: string;
  type: string;
  mermaidCode: string;
  description: string;
}

/**
 * PRD chapter
 */
export interface Chapter {
  title: string;
  orderIndex: number;
  content: string;
  diagrams?: Diagram[];
}

/**
 * Node result containing updated state and potential error
 */
export interface NodeResult<T extends BaseWorkflowState> {
  state: T;
  error?: Error;
}

/**
 * LLM call details for tracking and debugging
 */
export interface LLMCallDetails {
  prompt: string;
  response: string;
  startTime: Date;
  endTime: Date;
  tokensUsed?: number;
}

export interface Repository {
  id: string;
  name: string;
  owner: string;
  url: string;
  description?: string;
  language?: string | Record<string, any>;
  topics?: string[];
}
