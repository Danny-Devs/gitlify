import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  mockRepository,
  mockRepositoryContent,
  mockRepositoryContents,
  mockSearchResults
} from './github-api';

// Set up handlers
export const handlers = [
  // GitHub API handlers
  http.get('https://api.github.com/repos/:owner/:repo', () => {
    return HttpResponse.json(mockRepository);
  }),

  http.get('https://api.github.com/repos/:owner/:repo/contents', () => {
    return HttpResponse.json(mockRepositoryContents);
  }),

  http.get('https://api.github.com/repos/:owner/:repo/contents/:path', () => {
    return HttpResponse.json(mockRepositoryContent);
  }),

  http.get('https://api.github.com/search/repositories', () => {
    return HttpResponse.json(mockSearchResults);
  }),

  // LLM API handlers
  http.post('http://localhost:11434/api/generate', () => {
    return HttpResponse.json({
      text: 'This is a test response from the LLM API',
      usage: {
        totalTokens: 10
      }
    });
  })
];

// Set up server
export const server = setupServer(...handlers);
