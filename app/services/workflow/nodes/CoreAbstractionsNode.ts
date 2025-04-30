/**
 * Core Abstractions Node
 *
 * This node identifies the key abstractions in a repository based on
 * the initial repository analysis. Abstractions are the fundamental
 * concepts, components, or entities in the system.
 */

import { createGitHubClient } from '@/lib/github/githubClient';
import { Node } from '../Node';
import { Abstraction, PRDGenerationState } from '../types';

export class CoreAbstractionsNode extends Node<PRDGenerationState> {
  name = 'core_abstractions';

  /**
   * Prepare the core abstractions prompt
   */
  async prep(
    input: PRDGenerationState
  ): Promise<{ prompt: string; state: PRDGenerationState }> {
    const { repository, repositoryAnalysis } = input;

    if (!repositoryAnalysis) {
      throw new Error(
        'Repository analysis is required for core abstractions node'
      );
    }

    // Fetch key files to help identify abstractions
    const keyFiles = await this.findKeyFiles(repository.owner, repository.name);

    // Construct prompt with repository analysis and key files
    const prompt = `Based on the initial repository analysis, identify 5-10 core abstractions in this codebase.

Repository Analysis:
${repositoryAnalysis.summary}

Key Files:
${this.formatKeyFiles(keyFiles)}

For each key abstraction, provide:
1. Name - The identifier for this abstraction
2. Description - A brief explanation of what this abstraction represents
3. Responsibilities - The main jobs or tasks this abstraction handles (list at least 3-5)
4. Relationships - How this abstraction connects to others (list at least 2-3)

An abstraction could be:
- A core entity (User, Product, Post)
- A major component (AuthService, PaymentProcessor)
- A subsystem (NotificationSystem, DatabaseLayer)
- A conceptual model (WorkflowEngine, PermissionModel)

Be concrete and specific in your descriptions. These abstractions will form the backbone of our PRD
and will be used to organize requirements into logical groups.

Format your response as follows for each abstraction:

## [Abstraction Name]
Description: [Description]

Responsibilities:
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]
...

Relationships:
- [Abstraction Name]: [Relationship Type] - [Brief description of how they relate]
...

[Repeat for each abstraction]`;

    return { prompt, state: input };
  }

  /**
   * Process the LLM response and extract abstractions
   */
  async post(
    response: string,
    state: PRDGenerationState
  ): Promise<PRDGenerationState> {
    const abstractions = this.parseAbstractions(response);

    return {
      ...state,
      abstractions,
      currentAbstractionIndex: 0
    };
  }

  /**
   * Find key files in the repository that represent important abstractions
   */
  private async findKeyFiles(owner: string, repo: string): Promise<any[]> {
    try {
      const githubClient = createGitHubClient({
        accessToken: process.env.GITHUB_ACCESS_TOKEN
      });

      // Get the file structure
      const rootContents = await githubClient.getRepoContents(owner, repo);

      // Look for key directories that might contain abstractions
      const keyDirs = [
        'src',
        'lib',
        'app',
        'core',
        'models',
        'services',
        'components',
        'api'
      ];
      const foundDirs = rootContents.filter(
        (item: any) =>
          item.type === 'dir' && keyDirs.includes(item.name.toLowerCase())
      );

      // Get contents of each key directory (up to 3)
      const keyFiles: any[] = [];

      for (const dir of foundDirs.slice(0, 3)) {
        try {
          const dirContents = await githubClient.getRepoContents(
            owner,
            repo,
            dir.path
          );

          // Add important looking files (avoid test files, configs)
          const importantFiles = dirContents
            .filter(
              (file: any) =>
                file.type === 'file' &&
                !file.name.includes('test') &&
                !file.name.includes('config') &&
                !file.name.startsWith('.')
            )
            .slice(0, 5); // Limit to 5 files per directory

          keyFiles.push(...importantFiles);
        } catch (error) {
          continue;
        }
      }

      return keyFiles.slice(0, 15); // Return up to 15 key files
    } catch (error) {
      console.error('Error finding key files:', error);
      return [];
    }
  }

  /**
   * Format the key files for the prompt
   */
  private formatKeyFiles(files: any[]): string {
    if (!files || files.length === 0) {
      return 'No key files found';
    }

    return files.map(file => `- ${file.path}`).join('\n');
  }

  /**
   * Parse abstractions from the LLM response
   */
  private parseAbstractions(response: string): Abstraction[] {
    try {
      const abstractions: Abstraction[] = [];

      // Split the response by abstraction (## [name])
      const abstractionBlocks = response
        .split(/##\s+/)
        .filter(block => block.trim());

      for (const block of abstractionBlocks) {
        try {
          // Extract abstraction name (first line)
          const nameMatch = block.match(/(.+?)(?=\n|$)/);
          const name = nameMatch ? nameMatch[1].trim() : 'Unknown Abstraction';

          // Extract description
          const descriptionMatch = block.match(
            /Description:\s+(.+?)(?=\n\n|\n[A-Z]|$)/s
          );
          const description = descriptionMatch
            ? descriptionMatch[1].trim()
            : '';

          // Extract responsibilities
          const responsibilitiesMatch = block.match(
            /Responsibilities:\s+([\s\S]+?)(?=\n\n[A-Z]|$)/
          );
          let responsibilities: string[] = [];

          if (responsibilitiesMatch) {
            responsibilities = responsibilitiesMatch[1]
              .split(/\n-\s+/)
              .map(r => r.trim())
              .filter(r => r);
          }

          // Extract relationships
          const relationshipsMatch = block.match(
            /Relationships:\s+([\s\S]+?)(?=\n\n[A-Z]|$)/
          );
          let relationships: {
            name: string;
            type: string;
            description: string;
          }[] = [];

          if (relationshipsMatch) {
            const relationshipLines = relationshipsMatch[1]
              .split(/\n-\s+/)
              .map(r => r.trim())
              .filter(r => r);

            relationships = relationshipLines.map(line => {
              // Parse relationship line: "[Abstraction]: [Type] - [Description]"
              const parts = line.split(/:\s+|:\s+-\s+|-\s+/);

              if (parts.length >= 2) {
                return {
                  name: parts[0].trim(),
                  type: parts[1].trim(),
                  description: parts.slice(2).join(' ').trim()
                };
              }

              return {
                name: line,
                type: 'related to',
                description: ''
              };
            });
          }

          abstractions.push({
            name,
            description,
            responsibilities,
            relationships
          });
        } catch (error) {
          console.error('Error parsing abstraction block:', error);
          continue;
        }
      }

      return abstractions;
    } catch (error) {
      console.error('Error parsing abstractions:', error);
      return [];
    }
  }
}
