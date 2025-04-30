'use server';

import prisma from '@/lib/prisma';
import { createLLMClient } from '@/lib/llm/llmClient';

/**
 * Create a new LLM configuration
 */
export async function createLLMConfig(
  userId: string,
  data: {
    name: string;
    endpoint: string;
    apiKey?: string;
    modelName: string;
    contextWindow: number;
  }
) {
  try {
    // Validate the configuration by attempting to connect
    try {
      const client = createLLMClient({
        baseUrl: data.endpoint,
        model: data.modelName,
        apiKey: data.apiKey
      });

      // Send a simple test prompt
      await client.complete({
        prompt: 'Test connection. Reply with "Connection successful."',
        maxTokens: 10
      });
    } catch (error) {
      console.error('LLM connection test failed:', error);
      return {
        success: false,
        error:
          'Failed to connect to LLM provider. Please check your configuration.'
      };
    }

    // Create the configuration
    const config = await prisma.lLMConfiguration.create({
      data: {
        name: data.name,
        endpoint: data.endpoint,
        apiKey: data.apiKey,
        modelName: data.modelName,
        contextWindow: data.contextWindow,
        isActive: true,
        userId
      }
    });

    return { success: true, data: config };
  } catch (error) {
    console.error('Error creating LLM configuration:', error);
    return { success: false, error: 'Failed to create LLM configuration' };
  }
}

/**
 * Get LLM configurations for a user
 */
export async function getLLMConfigs(userId: string) {
  try {
    const configs = await prisma.lLMConfiguration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: configs };
  } catch (error) {
    console.error('Error fetching LLM configurations:', error);
    return { success: false, error: 'Failed to fetch LLM configurations' };
  }
}

/**
 * Get a LLM configuration by ID
 */
export async function getLLMConfig(id: string, userId: string) {
  try {
    const config = await prisma.lLMConfiguration.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!config) {
      return { success: false, error: 'LLM configuration not found' };
    }

    return { success: true, data: config };
  } catch (error) {
    console.error('Error fetching LLM configuration:', error);
    return { success: false, error: 'Failed to fetch LLM configuration' };
  }
}

/**
 * Update a LLM configuration
 */
export async function updateLLMConfig(id: string, userId: string, data: any) {
  try {
    // Check if config exists and belongs to user
    const existingConfig = await prisma.lLMConfiguration.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingConfig) {
      return { success: false, error: 'LLM configuration not found' };
    }

    // If changing connection details, validate the configuration
    if (data.endpoint || data.apiKey || data.modelName) {
      try {
        const client = createLLMClient({
          baseUrl: data.endpoint || existingConfig.endpoint,
          model: data.modelName || existingConfig.modelName,
          apiKey:
            data.apiKey !== undefined ? data.apiKey : existingConfig.apiKey
        });

        // Send a simple test prompt
        await client.complete({
          prompt: 'Test connection. Reply with "Connection successful."',
          maxTokens: 10
        });
      } catch (error) {
        console.error('LLM connection test failed:', error);
        return {
          success: false,
          error:
            'Failed to connect to LLM provider. Please check your configuration.'
        };
      }
    }

    // Update the configuration
    const updatedConfig = await prisma.lLMConfiguration.update({
      where: { id },
      data
    });

    return { success: true, data: updatedConfig };
  } catch (error) {
    console.error('Error updating LLM configuration:', error);
    return { success: false, error: 'Failed to update LLM configuration' };
  }
}

/**
 * Delete a LLM configuration
 */
export async function deleteLLMConfig(id: string, userId: string) {
  try {
    // Check if config exists and belongs to user
    const existingConfig = await prisma.lLMConfiguration.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingConfig) {
      return { success: false, error: 'LLM configuration not found' };
    }

    // Delete the configuration
    await prisma.lLMConfiguration.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting LLM configuration:', error);
    return { success: false, error: 'Failed to delete LLM configuration' };
  }
}

/**
 * Get the default LLM configuration for a user
 * Creates a default configuration if none exists
 */
export async function getDefaultLLMConfig(userId: string) {
  try {
    // Find an active configuration
    let config = await prisma.lLMConfiguration.findFirst({
      where: {
        userId,
        isActive: true
      }
    });

    // If no active config, use the most recently created one
    if (!config) {
      config = await prisma.lLMConfiguration.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
    }

    // If still no config, create a default one
    if (!config) {
      config = await prisma.lLMConfiguration.create({
        data: {
          name: 'Default Ollama Configuration',
          endpoint:
            process.env.LLM_API_URL || 'http://localhost:11434/api/generate',
          modelName: process.env.LLM_MODEL_NAME || 'codellama:7b',
          contextWindow: 4000,
          isActive: true,
          userId
        }
      });
    }

    return { success: true, data: config };
  } catch (error) {
    console.error('Error getting default LLM configuration:', error);
    return { success: false, error: 'Failed to get default LLM configuration' };
  }
}
