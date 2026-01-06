# Fix Railway 403 Forbidden Error

## Problem
Getting `403 Forbidden` when running `railway up` because you don't have deploy permissions on the "money-matrix" service.

## Solution: Create New Service

### Step 1: Create Service in Railway Dashboard
1. Go to https://railway.app
2. Navigate to project "csxyz"
3. Click **"New Service"** button
4. Name it: `moneymatrix-web` (or any name you prefer)
5. Select **"Empty Service"** or **"GitHub Repo"** if you want to connect GitHub

### Step 2: Link to New Service
```bash
railway unlink
railway link
# Select workspace: Ofri David's Projects
# Select project: csxyz
# Select environment: production
# Select service: moneymatrix-web (your new service)
```

### Step 3: Deploy
```bash
railway up
```

## Alternative: Deploy Without Service Selection

If you want to deploy to project root (without selecting a service):

```bash
railway unlink
railway link
# When asked "Select a service", press ESC to skip
railway up
```

## Why This Happens

The 403 error occurs because:
- The "money-matrix" service was created by someone else or in a different workspace
- You don't have "Deploy" permissions on that service (only "View" permissions)
- Railway requires write permissions to upload code

## Updated Files

- ✅ Updated `.railwayignore` to exclude `node_modules/` and `.next/` directories
- These large directories (250MB+) can cause upload issues

## Verify Deployment

After successful deployment:
```bash
railway logs
railway status
```

Your app will be available at: `https://[your-service-name].railway.app`









