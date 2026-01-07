# 🚀 GitHub Repository Setup Instructions

## Step 1: Create Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: `MoneyMatrix`
3. Description: "MoneyMatrix - Financial loan comparison and location finder platform"
4. Visibility: **Private** (recommended) or **Public**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

## Step 2: Push Code to GitHub

After creating the repo, run these commands:

```bash
git remote add origin https://github.com/THAITECHNEWS/MoneyMatrix.git
git push -u origin main
```

If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Or use SSH: `git@github.com:THAITECHNEWS/MoneyMatrix.git`

## Step 3: Connect to Railway

1. Go to Railway dashboard: https://railway.app
2. Create a **New Project** (or select existing project)
3. Click **"New Service"** → **"GitHub Repo"**
4. Select **"THAITECHNEWS/MoneyMatrix"**
5. Railway will automatically:
   - Detect Next.js
   - Build the project
   - Deploy it

## Step 4: Configure Environment Variables

In Railway dashboard:
1. Go to your service → **Variables** tab
2. Add these environment variables:
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = (your Google Maps API key)
   - `NEXT_PUBLIC_APIFY_API_KEY` = (your Apify API key)
   - `OPENAI_API_KEY` = (your OpenAI API key)

## Step 5: Deploy!

Railway will automatically deploy on every `git push` to `main` branch.

---

## ✅ What's Already Done

- ✅ Git repository initialized
- ✅ All files committed (188 files)
- ✅ Sensitive files excluded (.env, node_modules, etc.)
- ✅ Ready to push to GitHub

## 🔒 Security Check

These files are **NOT** in the repository (protected by .gitignore):
- `.env` files
- `node_modules/`
- `venv/`
- API keys and secrets
- Build artifacts

---

## Next Steps

1. Create the GitHub repository (Step 1 above)
2. Run the push command (Step 2)
3. Connect to Railway (Step 3)
4. Add environment variables (Step 4)
5. Deploy! 🎉







