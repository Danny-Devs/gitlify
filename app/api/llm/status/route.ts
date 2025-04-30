import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/llm/status
 * Check if the Ollama server is running
 */
export async function GET(request: NextRequest) {
  try {
    // Default Ollama endpoint
    const ollamaEndpoint =
      process.env.LLM_API_URL || 'http://localhost:11434/api/generate';

    // Simple connectivity check
    const response = await fetch(ollamaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL_NAME || 'codellama:7b',
        prompt: 'Test connection. Reply with "Connection successful."',
        max_tokens: 1,
        stream: false
      }),
      // Short timeout to avoid hanging
      signal: AbortSignal.timeout(5000)
    });

    return NextResponse.json({
      connected: response.ok,
      endpoint: ollamaEndpoint
    });
  } catch (error) {
    console.error('Error checking Ollama status:', error);
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
