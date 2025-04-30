/**
 * Requirements Extraction Node
 *
 * This node extracts detailed requirements for a specific abstraction
 * by analyzing relevant files in the codebase.
 */

import { createGitHubClient } from '@/lib/github/githubClient';
import { Node } from '../Node';
import { PRDGenerationState, Requirement } from '../types';
import crypto from 'crypto';

export class RequirementsExtractionNode extends Node<PRDGenerationState> {
  name = 'requirements_extraction';

  /**
   * Prepare the requirements extraction prompt
   */
  async prep(
    input: PRDGenerationState
  ): Promise<{ prompt: string; state: PRDGenerationState }> {
    const { repository, abstractions, currentAbstractionIndex } = input;

    if (
      !abstractions ||
      currentAbstractionIndex === undefined ||
      !abstractions[currentAbstractionIndex]
    ) {
      throw new Error(
        'Abstractions and current index are required for requirements extraction'
      );
    }

    const abstraction = abstractions[currentAbstractionIndex];

    // Find files that might be relevant to this abstraction
    const relevantFiles = await this.findRelevantFiles(
      repository.owner,
      repository.name,
      abstraction
    );

    // Fetch content of relevant files
    const fileContents = await this.fetchFileContents(
      repository.owner,
      repository.name,
      relevantFiles
    );

    // Construct prompt for requirements extraction
    const prompt = `Extract implicit and explicit requirements from the codebase for the "${
      abstraction.name
    }" abstraction.

Abstraction Details:
Name: ${abstraction.name}
Description: ${abstraction.description}
Responsibilities:
${abstraction.responsibilities.map(r => `- ${r}`).join('\n')}

Relationships:
${abstraction.relationships
  .map(r => `- ${r.name}: ${r.type} - ${r.description}`)
  .join('\n')}

Relevant Code Files:
${this.formatFileContents(fileContents)}

Based on the code files and abstraction description, extract 5-10 key requirements that this abstraction fulfills. 
For each requirement:

1. Determine if it's a:
   - Functional Requirement: What the system does
   - Non-Functional Requirement: Quality attributes (performance, security, etc.)
   - Technical Requirement: Implementation constraints or technical decisions
   - User Story: User-centered need expressed as "As a [role], I want [feature] so that [benefit]"

2. Provide:
   - A clear, precise description of the requirement
   - The rationale behind it (why it exists)
   - Reference to specific code sections supporting it
   - A priority level (high, medium, low)

Format each requirement like this:

## Requirement: [Brief Title]
Type: [Functional|Non-Functional|Technical|User Story]
Description: [Clear description of what is required]
Rationale: [Why this requirement exists]
Code References: [References to specific parts of the code]
Priority: [High|Medium|Low]

Be precise and comprehensive in your analysis. These requirements will form the basis of our PRD chapters.`;

    return { prompt, state: input };
  }

  /**
   * Process the LLM response and extract requirements
   */
  async post(
    response: string,
    state: PRDGenerationState
  ): Promise<PRDGenerationState> {
    const requirements = this.parseRequirements(response);

    if (!state.abstractions || state.currentAbstractionIndex === undefined) {
      return state;
    }

    // Update the current abstraction with its requirements
    const updatedAbstractions = [...state.abstractions];
    updatedAbstractions[state.currentAbstractionIndex] = {
      ...updatedAbstractions[state.currentAbstractionIndex],
      requirements
    };

    // Move to the next abstraction or finish
    const nextIndex = state.currentAbstractionIndex + 1;
    const isComplete = nextIndex >= updatedAbstractions.length;

    return {
      ...state,
      abstractions: updatedAbstractions,
      currentAbstractionIndex: nextIndex,
      abstractionsComplete: isComplete
    };
  }

  /**
   * Find files that are relevant to a specific abstraction
   */
  private async findRelevantFiles(
    owner: string,
    repo: string,
    abstraction: any
  ): Promise<string[]> {
    try {
      const githubClient = createGitHubClient({
        accessToken: process.env.GITHUB_ACCESS_TOKEN
      });

      // Create search terms based on abstraction name and responsibilities
      const searchTerms = [
        abstraction.name,
        ...abstraction.name.split(/(?=[A-Z])/).filter(Boolean), // Split camelCase
        ...abstraction.responsibilities
          .map(r => r.split(' ').filter(w => w.length > 3)) // Extract key words
          .flat()
      ];

      // Get repository contents
      const rootContents = await githubClient.getRepoContents(owner, repo);

      // Common source directories to search in
      const sourceDirs = [
        'src',
        'lib',
        'app',
        'components',
        'services',
        'models',
        'core'
      ];
      const dirsToSearch = rootContents
        .filter(
          (item: any) =>
            item.type === 'dir' &&
            (sourceDirs.includes(item.name.toLowerCase()) ||
              item.name.toLowerCase().includes(abstraction.name.toLowerCase()))
        )
        .map((dir: any) => dir.path);

      // If no matching directories, use root
      if (dirsToSearch.length === 0) {
        dirsToSearch.push('');
      }

      // Keep track of found files
      const relevantFiles: string[] = [];

      // Search each directory
      for (const dir of dirsToSearch) {
        try {
          const contents = await githubClient.getRepoContents(owner, repo, dir);

          // Only include files
          const files = contents.filter((item: any) => item.type === 'file');

          // Score each file for relevance
          const scoredFiles = files.map((file: any) => {
            const fileName = file.name.toLowerCase();
            let score = 0;

            // Check if filename matches search terms
            for (const term of searchTerms) {
              if (fileName.includes(term.toLowerCase())) {
                score += 5;
              }
            }

            // Prioritize key source files
            if (
              fileName.endsWith('.ts') ||
              fileName.endsWith('.tsx') ||
              fileName.endsWith('.js') ||
              fileName.endsWith('.jsx')
            ) {
              score += 3;
            }

            return { path: file.path, score };
          });

          // Add the most relevant files
          relevantFiles.push(
            ...scoredFiles
              .filter(file => file.score > 0)
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map(file => file.path)
          );
        } catch (error) {
          continue;
        }
      }

      // Return the most relevant files (max 7)
      return Array.from(new Set(relevantFiles)).slice(0, 7);
    } catch (error) {
      console.error('Error finding relevant files:', error);
      return [];
    }
  }

  /**
   * Fetch the content of files
   */
  private async fetchFileContents(
    owner: string,
    repo: string,
    files: string[]
  ): Promise<any[]> {
    const githubClient = createGitHubClient({
      accessToken: process.env.GITHUB_ACCESS_TOKEN
    });

    const fileContents = [];

    for (const file of files) {
      try {
        const response = await githubClient.getRepoContents(owner, repo, file);

        if (response && response.content) {
          const content = Buffer.from(response.content, 'base64').toString(
            'utf-8'
          );
          fileContents.push({
            path: file,
            content: this.truncateContent(content, 1000) // Limit content size
          });
        }
      } catch (error) {
        console.error(`Error fetching file ${file}:`, error);
        continue;
      }
    }

    return fileContents;
  }

  /**
   * Format file contents for the prompt
   */
  private formatFileContents(files: any[]): string {
    if (!files || files.length === 0) {
      return 'No relevant files found';
    }

    return files
      .map(
        file => `
### ${file.path}
\`\`\`
${file.content}
\`\`\`
`
      )
      .join('\n');
  }

  /**
   * Truncate content to a maximum number of characters
   */
  private truncateContent(content: string, maxChars: number): string {
    if (content.length <= maxChars) {
      return content;
    }

    return content.substring(0, maxChars) + '... [content truncated]';
  }

  /**
   * Parse requirements from the LLM response
   */
  private parseRequirements(response: string): Requirement[] {
    try {
      const requirements: Requirement[] = [];

      // Split the response by requirement blocks
      const requirementBlocks = response.split(/##\s+Requirement:/).slice(1);

      for (const block of requirementBlocks) {
        try {
          // Extract requirement title (first line)
          const titleMatch = block.match(/(.+?)(?=\n|$)/);
          const title = titleMatch
            ? titleMatch[1].trim()
            : 'Untitled Requirement';

          // Extract type
          const typeMatch = block.match(/Type:\s+(.+?)(?=\n|$)/);
          let type:
            | 'functional'
            | 'non-functional'
            | 'technical'
            | 'user-story' = 'functional';

          if (typeMatch) {
            const typeText = typeMatch[1].toLowerCase().trim();
            if (typeText.includes('non-functional')) {
              type = 'non-functional';
            } else if (typeText.includes('technical')) {
              type = 'technical';
            } else if (typeText.includes('user')) {
              type = 'user-story';
            }
          }

          // Extract description
          const descriptionMatch = block.match(
            /Description:\s+(.+?)(?=\n[A-Z]|$)/s
          );
          const description = descriptionMatch
            ? `${title}: ${descriptionMatch[1].trim()}`
            : title;

          // Extract rationale
          const rationaleMatch = block.match(
            /Rationale:\s+(.+?)(?=\n[A-Z]|$)/s
          );
          const rationale = rationaleMatch ? rationaleMatch[1].trim() : '';

          // Extract code references
          const referencesMatch = block.match(
            /Code References:\s+(.+?)(?=\n[A-Z]|$)/s
          );
          const codeReferences = referencesMatch
            ? referencesMatch[1]
                .split(/\n|,/)
                .map(r => r.trim())
                .filter(Boolean)
            : [];

          // Extract priority
          const priorityMatch = block.match(/Priority:\s+(.+?)(?=\n|$)/);
          let priority: 'low' | 'medium' | 'high' = 'medium';

          if (priorityMatch) {
            const priorityText = priorityMatch[1].toLowerCase().trim();
            if (priorityText.includes('high')) {
              priority = 'high';
            } else if (priorityText.includes('low')) {
              priority = 'low';
            }
          }

          // Generate a unique ID for the requirement
          const id = crypto
            .createHash('md5')
            .update(`${title}${type}${description}`)
            .digest('hex')
            .slice(0, 8);

          requirements.push({
            id,
            type,
            description,
            rationale,
            codeReferences,
            priority
          });
        } catch (error) {
          console.error('Error parsing requirement block:', error);
          continue;
        }
      }

      return requirements;
    } catch (error) {
      console.error('Error parsing requirements:', error);
      return [];
    }
  }
}
