/**
 * GitHub utility functions
 */

/**
 * Extract owner and repo name from a GitHub URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } {
  // Clean up URL
  url = url.trim();

  // Remove trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  // Try to match GitHub URL patterns
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)$/,
    /github\.com\/([^\/]+)\/([^\/]+)\/$/,
    /github\.com\/([^\/]+)\/([^\/]+)(\.git)$/,
    /git@github\.com:([^\/]+)\/([^\/]+)(\.git)?$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match.length >= 3) {
      const owner = match[1];
      // Remove .git suffix if present
      const repo = match[2].replace(/\.git$/, '');
      return { owner, repo };
    }
  }

  throw new Error('Invalid GitHub repository URL');
}
