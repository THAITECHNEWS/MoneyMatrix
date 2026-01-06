# 🔐 Environment Variables Guide

## Where to Put Environment Variables?

### ✅ Railway (Production) - PUT THEM HERE
**This is where your app runs, so env vars MUST be here.**

1. Go to Railway dashboard
2. Select your service
3. Go to **Variables** tab
4. Click **"New Variable"**
5. Add each variable:
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = (your actual key)
   - `NEXT_PUBLIC_APIFY_API_KEY` = (your actual key)
   - `OPENAI_API_KEY` = (your actual key)

### ❌ GitHub - DO NOT PUT THEM HERE
**Never commit secrets to GitHub!**

- GitHub is for code only
- Secrets are already removed from the repo
- `.gitignore` prevents `.env` files from being committed

### 📝 Local Development (Optional)
For local testing, create `.env.local` file (already in `.gitignore`):
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_APIFY_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

**This file stays on your computer only!**

---

## Summary
- ✅ **Railway** = Production environment variables (REQUIRED)
- ✅ **Local `.env.local`** = Development only (optional)
- ❌ **GitHub** = Never put secrets here!



