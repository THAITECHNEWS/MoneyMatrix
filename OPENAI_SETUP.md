# OpenAI API Setup for MoneyMatrix.me

## ✅ DeepSeek Replaced with OpenAI

All references to DeepSeek have been replaced with OpenAI API.

## 🔑 API Key Configuration

### Option 1: Environment Variable (Recommended)
Set the `OPENAI_API_KEY` environment variable:

```bash
export OPENAI_API_KEY=your_openai_api_key_here
```

Or add to your `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Option 2: Configuration File
Add to `data/api_credentials.json`:

```json
{
  "openai": {
    "api_key": "your_openai_api_key_here",
    "base_url": "https://api.openai.com/v1",
    "model": "gpt-4o-mini"
  }
}
```

## 🤖 Model Configuration

Default model: `gpt-4o-mini` (cost-effective)

You can change the model in `config.json`:

```json
{
  "ai": {
    "primary_service": "openai",
    "primary_model": "gpt-4o-mini",
    "backup_model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "max_tokens": 2000
  }
}
```

### Available Models:
- `gpt-4o-mini` - Recommended (fast, cost-effective)
- `gpt-4o` - More capable, higher cost
- `gpt-3.5-turbo` - Backup option

## 🚀 Usage

The system will automatically:
1. Check for `OPENAI_API_KEY` environment variable first
2. Fall back to `data/api_credentials.json` if env var not set
3. Use the configured model from `config.json`

## ✅ Changes Made

- ✅ Replaced `DeepSeekClient` with `OpenAIClient`
- ✅ Updated `config.json` to use OpenAI
- ✅ Updated `data/api_credentials.json` template
- ✅ Updated `scripts/utils.py` default config
- ✅ Updated `scripts/config_validator.py` to check OpenAI
- ✅ Environment variable support added

## 🔍 Verification

Run the pre-deployment audit to verify:

```bash
python3 pre_deployment_audit.py
```

The system will check for OpenAI API key configuration.

---

**Note**: Make sure your OpenAI API key has sufficient credits for content generation.

