/**
 * GitHub client for accessing the GitHub API.
 * This is a simple wrapper around fetch to handle GitHub API requests.
 */

const BASE_URL = 'https://api.github.com';

interface GitHubOptions {
  accessToken?: string;
  headers?: Record<string, string>;
}

/**
 * Create a GitHub API client
 */
export function createGitHubClient(options: GitHubOptions = {}) {
  const { accessToken } = options;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  /**
   * Make a request to the GitHub API
   */
  async function request<T>(
    endpoint: string,
    method: string = 'GET',
    data?: any
  ): Promise<T> {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${BASE_URL}${endpoint}`;

    const config: RequestInit = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) })
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText} ${
            errorData ? JSON.stringify(errorData) : ''
          }`
        );
      }

      // Handle no-content responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error('GitHub API request failed:', error);
      throw error;
    }
  }

  return {
    /**
     * Get information about the authenticated user
     */
    getUser: () => request<any>('/user'),

    /**
     * Get repositories for the authenticated user
     */
    getUserRepos: (params: { per_page?: number; page?: number } = {}) => {
      const queryParams = new URLSearchParams();
      if (params.per_page)
        queryParams.append('per_page', params.per_page.toString());
      if (params.page) queryParams.append('page', params.page.toString());

      return request<any[]>(`/user/repos?${queryParams.toString()}`);
    },

    /**
     * Get a specific repository
     */
    getRepo: (owner: string, repo: string) =>
      request<any>(`/repos/${owner}/${repo}`),

    /**
     * Get a repository's contents
     */
    getRepoContents: (owner: string, repo: string, path: string = '') =>
      request<any>(`/repos/${owner}/${repo}/contents/${path}`),

    /**
     * Perform a generic request to the GitHub API
     */
    request
  };
}
