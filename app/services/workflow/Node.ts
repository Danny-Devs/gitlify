/**
 * Base Node class for workflow nodes.
 * Implements the PocketFlow architecture with prep → exec → post phases.
 */

import { createLLMClient } from '@/lib/llm/llmClient';
import prisma from '@/lib/prisma';
import { BaseWorkflowState, LLMCallDetails, NodeResult } from './types';

export abstract class Node<T extends BaseWorkflowState> {
  abstract name: string;
  protected llmApiUrl: string;
  protected llmModelName: string;

  constructor() {
    this.llmApiUrl =
      process.env.LLM_API_URL || 'http://localhost:11434/api/generate';
    this.llmModelName = process.env.LLM_MODEL_NAME || 'codellama:7b';
  }

  /**
   * Prepare the LLM prompt and state before execution
   */
  async prep(input: T): Promise<{ prompt: string; state: T }> {
    return { prompt: '', state: input };
  }

  /**
   * Execute the LLM call with the prepared prompt
   */
  async exec(
    prompt: string,
    state: T
  ): Promise<{ response: string; state: T; llmCallDetails?: LLMCallDetails }> {
    if (!prompt) {
      return { response: '', state };
    }

    const startTime = new Date();

    try {
      const llmClient = createLLMClient({
        baseUrl: this.llmApiUrl,
        model: this.llmModelName
      });

      const { text, usage } = await llmClient.complete({
        prompt,
        temperature: 0.2, // Lower temperature for more deterministic outputs
        maxTokens: 4000
      });

      const endTime = new Date();

      return {
        response: text,
        state,
        llmCallDetails: {
          prompt,
          response: text,
          startTime,
          endTime,
          tokensUsed: usage?.totalTokens
        }
      };
    } catch (error) {
      console.error(`Error in ${this.name} exec:`, error);
      return { response: '', state };
    }
  }

  /**
   * Process the LLM response and update the state
   */
  async post(response: string, state: T): Promise<T> {
    return state;
  }

  /**
   * Run the node with logging and state persistence
   */
  async run(input: T): Promise<NodeResult<T>> {
    try {
      console.log(`[${this.name}] Running node`);

      // Update workflow state to running
      await this.updateWorkflowState(input.workflowRunId, 'running');

      // Run the node lifecycle
      const { prompt, state } = await this.prep(input);
      const {
        response,
        state: updatedState,
        llmCallDetails
      } = await this.exec(prompt, state);
      const finalState = await this.post(response, updatedState);

      // Persist completed node state
      await this.saveWorkflowState(
        input.workflowRunId,
        finalState,
        'completed',
        llmCallDetails
      );

      console.log(`[${this.name}] Node completed successfully`);
      return { state: finalState };
    } catch (error) {
      console.error(`[${this.name}] Node execution failed:`, error);

      // Update workflow state to failed
      await this.updateWorkflowState(input.workflowRunId, 'failed');

      return {
        state: input,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  }

  /**
   * Update workflow state in the database
   */
  private async updateWorkflowState(
    workflowRunId: string,
    status: string
  ): Promise<void> {
    try {
      await prisma.workflowState.create({
        data: {
          nodeName: this.name,
          status,
          workflowRunId,
          startedAt: new Date()
        }
      });
    } catch (error) {
      console.error(`Error updating workflow state:`, error);
    }
  }

  /**
   * Save workflow state in the database
   */
  private async saveWorkflowState(
    workflowRunId: string,
    state: T,
    status: string,
    llmCallDetails?: LLMCallDetails
  ): Promise<void> {
    try {
      const stateData = JSON.parse(JSON.stringify(state)); // Sanitize for DB

      await prisma.workflowState.updateMany({
        where: {
          workflowRunId,
          nodeName: this.name,
          status: 'running'
        },
        data: {
          status,
          completedAt: new Date(),
          output: {
            ...stateData,
            ...(llmCallDetails && { llmCallDetails })
          }
        }
      });
    } catch (error) {
      console.error(`Error saving workflow state:`, error);
    }
  }
}
