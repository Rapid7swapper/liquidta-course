# Claude Code Setup

This project has the Anthropic Claude API SDK installed and ready to use.

## Setup

1. **Activate the virtual environment:**
   ```bash
   source venv/bin/activate
   ```

2. **Set your API key:**
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"
   ```
   
   Or create a `.env` file with:
   ```
   ANTHROPIC_API_KEY=your-api-key-here
   ```

3. **Run the example:**
   ```bash
   python example.py
   ```

## Getting an API Key

If you don't have an API key yet, you can get one from:
https://console.anthropic.com/

## Installation

The Claude SDK is already installed in the virtual environment. If you need to reinstall:

```bash
source venv/bin/activate
pip install -r requirements.txt
```

## Documentation

For more information, visit:
https://docs.anthropic.com/claude/reference/getting-started-with-the-api

