# Prompt Engineering Guidelines

This document provides basic guidelines for creating effective prompts for code analysis in Gist of Git. Well-crafted prompts are essential for getting useful insights from local LLMs.

## Core Principles

### 1. Be Specific and Clear

- Ask focused questions rather than general ones
- Specify exactly what information you want to extract
- Include context about what the code repository is

**Example:**

```
❌ "Analyze this code."
✅ "Identify the key React components in this file and explain their responsibilities."
```

### 2. Provide Context

- Include relevant background information
- Specify programming language and framework
- Mention what the overall project is trying to achieve

**Example:**

```
❌ "What does this function do?"
✅ "This is a JavaScript function from an e-commerce application.
    Explain what it does, its inputs and outputs, and any side effects."
```

### 3. Structure the Output

- Specify how you want the response formatted
- Ask for bullet points, sections, or specific formats when needed
- Request code examples or explanations as appropriate

**Example:**

```
❌ "Tell me about the API endpoints."
✅ "List all API endpoints in this Express.js application with:
    1. The HTTP method and route
    2. Required parameters
    3. What the endpoint does
    Format as a markdown table."
```

## Basic Template Structure

For initial versions of Gist of Git, we'll use a simple template structure:

```json
{
  "name": "Template Name",
  "description": "What this template analyzes",
  "prompt": "The actual prompt text with {{variables}}",
  "outputFormat": "markdown"
}
```

## Example Templates

### 1. Project Overview

```
You are a senior software engineer analyzing a GitHub repository.

Repository: {{repoName}}

Based on the files and code provided, create a high-level overview of this project:

1. What is the main purpose of this application?
2. What are the major components or modules?
3. What programming language(s) and frameworks are used?
4. How is the code organized?

Format your response as markdown with clear headings and bullet points.
```

### 2. Code Structure Analysis

```
You are a code architect examining a codebase.

Based on the files provided, identify:

1. The main directories and their purposes
2. Key files and what they contain
3. Entry points to the application
4. The overall architecture pattern being used (MVC, microservices, etc.)

Present your findings in a clear, structured format with sections for each aspect.
```

### 3. Dependency Analysis

```
Analyze the dependencies in this project:

1. List all external libraries/frameworks being used
2. Group them by purpose (UI, testing, utilities, etc.)
3. Identify the most central dependencies
4. Note any potential issues (outdated versions, security concerns)

Format your response as a structured report with clear sections.
```

## Variables

Templates can use the following variables which will be automatically replaced:

- `{{repoName}}` - The name of the repository
- `{{repoOwner}}` - The owner of the repository
- `{{filePath}}` - The current file path being analyzed
- `{{fileCount}}` - Total number of files in the repository
- `{{languageStats}}` - Breakdown of programming languages used

## Tips for Effective Prompts

1. **Start broad, then narrow down** - Begin with high-level analysis before diving into details
2. **Use programming terminology** - Be specific about code concepts (classes, functions, etc.)
3. **Include constraints** - Mention what to exclude or include in the analysis
4. **Balance detail and brevity** - Ask for enough detail without overwhelming
5. **Iterate and refine** - Improve prompts based on the quality of responses

## Troubleshooting

If you're not getting useful responses:

1. Make your prompts more specific
2. Break complex prompts into simpler ones
3. Include more relevant context
4. Specify the format you want more clearly
5. Try a different/larger model if available

## Future Development

As Gist of Git evolves, we'll enhance the template system with:

- Template categories
- Multi-step analysis flows
- Custom template creation UI
- Template sharing capabilities

For now, focusing on these core principles will help create effective analysis prompts.
