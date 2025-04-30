/**
 * LLM client for interacting with local LLM instances.
 * Designed to be provider-agnostic with configurable endpoints.
 */

interface LLMOptions {
  baseUrl: string;
  model: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

interface LLMCompletionRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

interface LLMCompletionResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Create a LLM client for a specific provider
 */
export function createLLMClient(options: LLMOptions) {
  const { baseUrl, model, apiKey } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  /**
   * Handle provider-specific request formatting
   */
  function formatRequest(provider: string, request: LLMCompletionRequest): any {
    switch (provider) {
      case 'ollama':
        return {
          model: model,
          prompt: request.prompt,
          ...(request.maxTokens && { max_tokens: request.maxTokens }),
          ...(request.temperature && { temperature: request.temperature }),
          ...(request.topP && { top_p: request.topP })
        };
      case 'openai':
        return {
          model: model,
          messages: [{ role: 'user', content: request.prompt }],
          ...(request.maxTokens && { max_tokens: request.maxTokens }),
          ...(request.temperature && { temperature: request.temperature }),
          ...(request.topP && { top_p: request.topP }),
          ...(request.frequencyPenalty && {
            frequency_penalty: request.frequencyPenalty
          }),
          ...(request.presencePenalty && {
            presence_penalty: request.presencePenalty
          })
        };
      default:
        // Generic format that works with many LLM APIs
        return {
          model: model,
          prompt: request.prompt,
          ...(request.maxTokens && { max_tokens: request.maxTokens }),
          ...(request.temperature && { temperature: request.temperature })
        };
    }
  }

  /**
   * Handle provider-specific response parsing
   */
  function parseResponse(provider: string, data: any): LLMCompletionResponse {
    switch (provider) {
      case 'ollama':
        return {
          text: data.response || '',
          usage: data.eval_count
            ? {
                promptTokens: data.prompt_eval_count || 0,
                completionTokens: data.eval_count || 0,
                totalTokens:
                  (data.prompt_eval_count || 0) + (data.eval_count || 0)
              }
            : undefined
        };
      case 'openai':
        return {
          text: data.choices?.[0]?.message?.content || '',
          usage: data.usage
            ? {
                promptTokens: data.usage.prompt_tokens || 0,
                completionTokens: data.usage.completion_tokens || 0,
                totalTokens: data.usage.total_tokens || 0
              }
            : undefined
        };
      default:
        // Try to extract completion in a generic way
        return {
          text:
            data.text || data.completion || data.output || data.response || '',
          usage: undefined
        };
    }
  }

  /**
   * Detect which provider we're using based on the base URL
   */
  function detectProvider(): string {
    if (baseUrl.includes('ollama')) return 'ollama';
    if (baseUrl.includes('openai')) return 'openai';
    return 'generic';
  }

  const provider = detectProvider();

  return {
    /**
     * Complete a prompt with the LLM
     */
    async complete(
      request: LLMCompletionRequest
    ): Promise<LLMCompletionResponse> {
      try {
        const formattedRequest = formatRequest(provider, request);

        const response = await fetch(baseUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(formattedRequest)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`LLM API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        return parseResponse(provider, data);
      } catch (error) {
        console.error('LLM request failed:', error);
        throw error;
      }
    }
  };
}
