# GPT-5.2 Quick Start Guide

## ✅ What's Been Set Up

Your location pages now use GPT-5.2 to generate enhanced, local content automatically!

## 🔑 Set Your API Key

### Option 1: Environment Variable (Local Development)
Create `.env.local` file in project root:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### Option 2: Railway (Production)
Add `OPENAI_API_KEY` to your Railway environment variables.

## 🧪 Test It

```bash
npm run test:ai-content
```

This will generate sample content and show you what GPT-5.2 creates.

## 🚀 How It Works

1. **First Visit**: Page generates AI content (30-60 seconds)
2. **Cached Visits**: Instant (served from cache for 7 days)
3. **Auto-Fallback**: Uses templates if AI unavailable

## 📍 See It Live

Visit any location page:
- http://localhost:3000/locations/payday-loans-in-los-angeles-ca
- http://localhost:3000/locations/personal-loans-in-chicago-il

The content will be AI-enhanced with:
- Local neighborhoods
- State-specific regulations  
- Local rates and fees
- Detailed FAQs

## 📊 Current Pages

All **35 location pages** will use AI enhancement:
- 5 cities × 7 loan types = 35 pages
- Each page gets unique, local content
- Content cached for 7 days

## 💡 What's Different?

**Before**: Template-based content (generic)
**After**: GPT-5.2 generated content (local, specific, detailed)

Example improvements:
- Mentions actual neighborhoods (not just "Downtown")
- References state-specific regulations
- Includes local context and demographics
- More natural, conversational language

---

**Ready to test?** Run `npm run test:ai-content` 🚀



