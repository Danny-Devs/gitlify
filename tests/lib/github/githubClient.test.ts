import { createGitHubClient } from '@/lib/github/githubClient';
import { server } from '../../mocks/server';
import {
  mockRepository,
  mockRepositoryContent,
  mockRepositoryContents,
  mockSearchResults
} from '../../mocks/github-api';

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());

describe('GitHub Client', () => {
  const githubClient = createGitHubClient({ accessToken: 'test-token' });

  test('getRepo fetches repository details', async () => {
    const repo = await githubClient.getRepo('example-user', 'example-repo');

    expect(repo).toEqual(mockRepository);
  });

  test('getRepoContents fetches repository contents', async () => {
    const contents = await githubClient.getRepoContents(
      'example-user',
      'example-repo'
    );

    expect(contents).toEqual(mockRepositoryContents);
  });

  test('getRepoContents with path fetches specific file/directory contents', async () => {
    const content = await githubClient.getRepoContents(
      'example-user',
      'example-repo',
      'README.md'
    );

    expect(content).toEqual(mockRepositoryContent);
  });

  test('request performs generic GitHub API request', async () => {
    const searchResults = await githubClient.request<typeof mockSearchResults>(
      '/search/repositories?q=example'
    );

    expect(searchResults).toEqual(mockSearchResults);
  });
});
