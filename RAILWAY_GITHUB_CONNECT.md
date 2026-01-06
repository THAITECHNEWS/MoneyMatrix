# 🚂 Connect GitHub to Railway

## ✅ Successfully Pushed to GitHub!
- Repository: https://github.com/THAITECHNEWS/MoneyMatrix
- All code is now on GitHub (secrets removed for security)

## 🚀 Connect to Railway (Step-by-Step)

### Step 1: Go to Railway Dashboard
1. Open: https://railway.app
2. Log in with your Railway account

### Step 2: Create New Project (or use existing)
1. Click **"New Project"** (or select existing project)
2. If creating new, give it a name: `MoneyMatrix`

### Step 3: Connect GitHub Repository
1. Click **"New Service"**
2. Select **"GitHub Repo"** (not "Empty Service")
3. You'll see a list of your repositories
4. Find and click: **"THAITECHNEWS/MoneyMatrix"**

### Step 4: Railway Auto-Detection
Railway will automatically:
- ✅ Detect Next.js framework
- ✅ Install dependencies (`npm install`)
- ✅ Build the project (`npm run build`)
- ✅ Deploy it (`npm start`)

### Step 5: Configure Environment Variables
**Important:** Add these in Railway dashboard:

1. Go to your service → **Variables** tab
2. Click **"New Variable"**
3. Add these one by one:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
NEXT_PUBLIC_APIFY_API_KEY=your_apify_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

**⚠️ Replace with your actual API keys!**

### Step 6: Deploy!
- Railway will automatically deploy after connecting
- Or click **"Deployments"** tab → **"Redeploy"** if needed

### Step 7: Get Your URL
- Railway will provide a URL like: `https://your-app.up.railway.app`
- You can also set a custom domain in **Settings** → **Domains**

---

## 🔄 Auto-Deploy on Push

Once connected, Railway will automatically deploy whenever you push to `main` branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Railway will detect the push and auto-deploy! 🎉

---

## ✅ Checklist

- ✅ Code pushed to GitHub
- ⏳ Connect GitHub repo to Railway
- ⏳ Add environment variables
- ⏳ Deploy!

---

## 🆘 Troubleshooting

**If Railway doesn't detect Next.js:**
- Check `package.json` has `"build"` and `"start"` scripts
- Check `next.config.js` exists

**If build fails:**
- Check Railway logs in **Deployments** tab
- Make sure all environment variables are set
- Check `railway.json` configuration

**If deployment fails:**
- Check **Settings** → **Deploy** → Start command should be: `npm start`
- Check **Variables** tab for missing env vars

---

**Ready? Go to Railway and connect your GitHub repo!**

