/**
 * Repository Analysis Node
 *
 * This node analyzes a GitHub repository to understand its overall
 * purpose, structure, and key components. It's the first step in
 * the PRD generation workflow.
 */

import { createGitHubClient } from '@/lib/github/githubClient';
import { Node } from '../Node';
import { PRDGenerationState } from '../types';

export class RepositoryAnalysisNode extends Node<PRDGenerationState> {
  name = 'repository_analysis';

  /**
   * Prepare the repository analysis prompt
   */
  async prep(
    input: PRDGenerationState
  ): Promise<{ prompt: string; state: PRDGenerationState }> {
    const { repository } = input;

    // Create GitHub client
    const githubClient = createGitHubClient({
      accessToken: process.env.GITHUB_ACCESS_TOKEN
    });

    // Fetch repository details, README, and structure
    const repoDetails = await githubClient.getRepo(
      repository.owner,
      repository.name
    );
    const readmeContent = await this.fetchRepositoryReadme(
      repository.owner,
      repository.name
    );
    const fileStructure = await this.fetchRepositoryStructure(
      repository.owner,
      repository.name
    );

    // Construct prompt with repository information
    const prompt = `You are analyzing a GitHub repository to understand its overall purpose and structure.
    
Repository: ${repository.name} by ${repository.owner}
Description: ${repoDetails.description || 'No description provided'}
Primary Languages: ${this.formatLanguages(repoDetails.language)}
${repoDetails.topics?.length ? `Topics: ${repoDetails.topics.join(', ')}` : ''}

README Content:
${readmeContent ? readmeContent : 'No README found'}

File Structure:
${this.formatFileStructure(fileStructure)}

Examine the repository structure, README, and key files to determine:
1. What is the primary purpose of this project?
2. Who are the intended users?
3. What domain does it serve?
4. What are the major components or modules?
5. What architectural patterns are evident?
6. What technologies or frameworks are being used?

Provide a comprehensive analysis that explains:
- The project's main purpose and goals
- The target audience and use cases
- The key components and their responsibilities
- The overall architecture and design patterns
- The technology stack and its implications

Your analysis will be used as the foundation for extracting detailed requirements and generating a comprehensive PRD.`;

    return {
      prompt,
      state: {
        ...input,
        repository: {
          ...input.repository,
          // Add additional repository details for later nodes
          description: repoDetails.description || '',
          language: repoDetails.language,
          topics: repoDetails.topics || []
        }
      }
    };
  }

  /**
   * Process the LLM response and update the state with repository analysis
   */
  async post(
    response: string,
    state: PRDGenerationState
  ): Promise<PRDGenerationState> {
    return {
      ...state,
      repositoryAnalysis: {
        summary: response,
        timestamp: new Date()
      }
    };
  }

  /**
   * Fetch the README content from the repository
   */
  private async fetchRepositoryReadme(
    owner: string,
    repo: string
  ): Promise<string> {
    try {
      const githubClient = createGitHubClient({
        accessToken: process.env.GITHUB_ACCESS_TOKEN
      });

      // Try to fetch README with different common filenames
      const readmeFilenames = [
        'README.md',
        'Readme.md',
        'readme.md',
        'README',
        'Readme',
        'readme'
      ];

      for (const filename of readmeFilenames) {
        try {
          const response = await githubClient.getRepoContents(
            owner,
            repo,
            filename
          );

          if (response && response.content) {
            // GitHub API returns content as base64
            return Buffer.from(response.content, 'base64').toString('utf-8');
          }
        } catch (error) {
          // Continue to the next filename if not found
          continue;
        }
      }

      return 'No README found';
    } catch (error) {
      console.error('Error fetching README:', error);
      return 'Error fetching README';
    }
  }

  /**
   * Fetch the repository structure
   */
  private async fetchRepositoryStructure(
    owner: string,
    repo: string
  ): Promise<any[]> {
    try {
      const githubClient = createGitHubClient({
        accessToken: process.env.GITHUB_ACCESS_TOKEN
      });

      // Get the root directory contents
      const contents = await githubClient.getRepoContents(owner, repo);

      // Filter out very large directories or files that would clutter the analysis
      return contents
        .filter((item: any) => !['node_modules', '.git'].includes(item.name))
        .map((item: any) => ({
          name: item.name,
          path: item.path,
          type: item.type,
          size: item.size
        }));
    } catch (error) {
      console.error('Error fetching repository structure:', error);
      return [];
    }
  }

  /**
   * Format the repository languages for the prompt
   */
  private formatLanguages(languages: any): string {
    if (!languages) return 'Unknown';

    if (typeof languages === 'string') {
      return languages;
    }

    if (typeof languages === 'object') {
      return Object.keys(languages).join(', ');
    }

    return 'Unknown';
  }

  /**
   * Format the file structure for the prompt
   */
  private formatFileStructure(structure: any[]): string {
    if (!structure || structure.length === 0) {
      return 'No file structure available';
    }

    return structure.map(item => `${item.name} (${item.type})`).join('\n');
  }
}
