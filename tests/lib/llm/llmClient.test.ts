import { createLLMClient } from '@/lib/llm/llmClient';
import { server } from '../../mocks/server';

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());

describe('LLM Client', () => {
  const llmClient = createLLMClient({
    baseUrl: 'http://localhost:11434/api/generate',
    model: 'test-model'
  });

  test('complete method sends request to LLM API and returns text response', async () => {
    const response = await llmClient.complete({
      prompt: 'Test prompt',
      maxTokens: 100,
      temperature: 0.7
    });

    expect(response).toEqual({
      text: 'This is a test response from the LLM API',
      usage: { totalTokens: 10 }
    });
  });

  test('handles optional parameters in complete method', async () => {
    // No need to specify maxTokens, temperature
    const response = await llmClient.complete({
      prompt: 'Test prompt'
    });

    expect(response).toEqual({
      text: 'This is a test response from the LLM API',
      usage: { totalTokens: 10 }
    });
  });

  test('handles apiKey in client creation', () => {
    // Creating client with apiKey should not throw errors
    const clientWithApiKey = createLLMClient({
      baseUrl: 'http://localhost:11434/api/generate',
      model: 'test-model',
      apiKey: 'test-api-key'
    });

    // Just check that the client was created successfully
    expect(clientWithApiKey).toBeDefined();
  });
});
