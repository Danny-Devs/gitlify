# Getting Started with Gist of Git

This guide will walk you through the basic steps to analyze your first GitHub repository with Gist of Git.

## Prerequisites

Before you begin, you'll need:

1. A modern web browser (Chrome, Firefox, Safari, or Edge)
2. A local LLM setup (see the [LLM Setup Guide](./llm_setup_guide.md))

## Step 1: Access Gist of Git

Visit [gistofgit.com](https://gistofgit.com) or your local installation URL.

## Step 2: Configure Your LLM Connection

1. Click the **Settings** icon in the top right corner
2. Under "LLM Configuration", enter:
   - **LLM Provider**: Select "Ollama" or "LM Studio"
   - **API URL**: Enter the URL of your local LLM service (typically `http://localhost:11434/api` for Ollama)
   - **Model**: Select the model you want to use (we recommend CodeLlama-7b for a good balance of performance and resource usage)
3. Click **Test Connection** to verify everything is working
4. Click **Save**

## Step 3: Add a GitHub Repository

1. On the main page, enter a GitHub repository URL in the input field
   - Example: `https://github.com/facebook/react`
2. Click **Add Repository**
3. Wait for Gist of Git to fetch the repository structure

## Step 4: Configure Your Analysis

1. Select the analysis template(s) you want to use:
   - **Project Overview**: High-level understanding of the project
   - **Code Structure Analysis**: Directory and file organization
   - **Dependency Analysis**: Libraries and frameworks used
2. Adjust settings if needed:
   - **Analysis Depth**: How detailed the analysis should be
   - **File Types**: Which file extensions to include
3. Click **Start Analysis**

## Step 5: View Results

1. Wait for the analysis to complete (this can take a few minutes depending on the repository size and your hardware)
2. Review the generated insights in the results panel
3. Navigate between different sections using the tabs at the top of the results panel
4. Use the file browser on the left to explore specific files

## Step 6: Export or Share Results (Optional)

1. Click the **Export** button to save the analysis as Markdown or PDF
2. Use the **Share** button to generate a shareable link (if this feature is enabled)

## Tips for Better Analysis

- Start with smaller repositories first
- Use the most powerful LLM model your hardware can support
- Focus analysis on specific areas of interest rather than entire large repositories
- Try different templates to get varied perspectives
- Remember that LLM analyses are helpful but not perfect - use them as a guide

## Troubleshooting

If you encounter issues:

1. **Analysis is slow**: Try using a smaller model or focusing on a subset of files
2. **LLM connection fails**: Check that your local LLM server is running
3. **Poor quality analysis**: Try a different model or template
4. **Repository too large**: Start with analyzing just the main directories first

## Next Steps

Once you're comfortable with basic analysis:

- Explore the advanced templates
- Try analyzing different types of repositories
- Read the [Prompt Engineering Guide](./prompt_engineering.md) to understand how to customize templates

For more detailed information, check the full [User Guide](./user_guide.md).
