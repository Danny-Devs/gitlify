# Local LLM Setup Guide

This guide will help you set up local Large Language Model (LLM) instances to use with Gist of Git. Running LLMs locally ensures privacy since your code never leaves your machine.

## Overview

Gist of Git works with locally-hosted LLM servers, particularly:

1. **Ollama** - Easy-to-use tool for running models locally
2. **LM Studio** - GUI application for running and managing models

We recommend starting with Ollama for its simplicity, but both options work well.

## Option 1: Ollama (Recommended)

### System Requirements

- **Minimum**: 8GB RAM, modern CPU (Intel i5/AMD Ryzen 5 or better)
- **Recommended**: 16GB+ RAM, modern CPU with 6+ cores
- **For larger models**: 16GB+ RAM, graphics card with 8GB+ VRAM

### Installation Steps

#### macOS

1. Download Ollama from [ollama.ai](https://ollama.ai)
2. Open the downloaded file and drag it to your Applications folder
3. Launch Ollama from your Applications folder
4. A small icon will appear in your menu bar, indicating Ollama is running

#### Windows

1. Download Ollama from [ollama.ai](https://ollama.ai)
2. Run the installer and follow the prompts
3. Once installed, Ollama will run in the background with an icon in your system tray

#### Linux

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

After installation, start the Ollama service:

```bash
ollama serve
```

### Installing a Code-Focused Model

Open your terminal (Command Prompt or PowerShell on Windows) and run:

```bash
# CodeLlama 7B - Good balance of performance and resource usage
ollama pull codellama:7b

# Or for a smaller model that works on modest hardware
ollama pull codellama:7b-instruct

# Or for a larger, more capable model (if you have 16GB+ RAM)
ollama pull codellama:13b
```

### Verifying Ollama Setup

1. Ensure Ollama is running (check for the icon in your menu bar/system tray)
2. In your terminal, run:

   ```bash
   ollama list
   ```

   You should see your installed models listed

3. Test your model with:
   ```bash
   ollama run codellama:7b "What is a React component?"
   ```

## Option 2: LM Studio

### System Requirements

Similar to Ollama, but with a more user-friendly interface:

- **Minimum**: 8GB RAM, modern CPU
- **Recommended**: 16GB+ RAM, graphics card with 4GB+ VRAM

### Installation Steps

1. Download LM Studio from [lmstudio.ai](https://lmstudio.ai)
2. Run the installer for your operating system
3. Launch LM Studio

### Setting Up a Model

1. In LM Studio, go to the "Models" tab
2. Click "Download" and search for "CodeLlama"
3. Download one of the following recommended models:

   - CodeLlama-7B-Instruct-GGUF (for systems with limited resources)
   - CodeLlama-7B-GGUF (better performance)
   - CodeLlama-13B-GGUF (if you have more RAM/GPU memory)

4. Once downloaded, select the model and click "Use in Chat"
5. Go to the "Local Server" tab and click "Start Server"

### Configuring LM Studio for Gist of Git

1. With the server running, note the API Base URL (typically http://localhost:1234/v1)
2. In Gist of Git, provide this URL when setting up your LLM connection

## Troubleshooting

### Common Ollama Issues

1. **Model downloads fail**

   - Check your internet connection
   - Try running with sudo (Linux) or as administrator (Windows)

2. **Out of memory errors**

   - Try a smaller model (e.g., codellama:7b-instruct instead of codellama:13b)
   - Close other memory-intensive applications
   - Add swap space/virtual memory

3. **Slow generation**
   - This is normal on CPU-only systems
   - Consider using a GPU if available
   - Use smaller context sizes in the Gist of Git settings

### Common LM Studio Issues

1. **Server won't start**

   - Check if another application is using the same port
   - Restart LM Studio
   - Reinstall if issues persist

2. **Model loading fails**
   - Try downloading the model again
   - Use a smaller model variant
   - Check available disk space

## Recommended Models for Gist of Git

| Model                 | Size | Performance                            | Hardware Requirements     |
| --------------------- | ---- | -------------------------------------- | ------------------------- |
| CodeLlama-7B-Instruct | ~4GB | Good for basic code analysis           | 8GB RAM, CPU only         |
| CodeLlama-7B          | ~4GB | Better for detailed code understanding | 8GB RAM, CPU only         |
| CodeLlama-13B         | ~8GB | Strong code comprehension, slower      | 16GB RAM, GPU recommended |
| DeepSeek Coder        | ~4GB | Optimized for code analysis            | 8GB RAM, CPU only         |

## Privacy Note

With these local setups, all code analysis happens entirely on your machine. No code is sent to external services, ensuring maximum privacy and security for your projects.
