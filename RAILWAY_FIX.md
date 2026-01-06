# Railway Deployment Fix

## Issue
Railway was trying to use `venv/bin/python3` which doesn't exist in the deployment environment.

## Solution Applied

### 1. Created `.railwayignore`
Excludes `venv/` and other unnecessary files from deployment.

### 2. Updated `railway.json`
Changed `startCommand` from `python3` to `python` (Railway's Nixpacks provides Python).

### 3. Created `nixpacks.toml`
Explicitly configures Python 3 and dependency installation.

## Deploy Now

```bash
cd /Users/ofri.david/Downloads/MoneyMatrix
railway up
```

Railway will now:
1. Ignore the `venv/` directory (via `.railwayignore`)
2. Use Nixpacks to detect Python
3. Install dependencies from `requirements.txt`
4. Run `python railway_server.py`

## Verify

After deployment, check Railway logs:
```bash
railway logs
```

You should see:
```
✅ Server running on port [PORT]
✅ Serving files from: /app/dist
```

---

**Note**: The venv directory is now excluded from deployment. Railway will use its own Python environment.

