# 🔧 Fix Railway Environment Variables

## Issue
`NEXT_PUBLIC_APIFY_API_KEY` not being detected even though it's set in Railway.

## Why This Happens
In Next.js, variables prefixed with `NEXT_PUBLIC_` are embedded at **build time**, not runtime. If you added the variable after the build, it won't be available.

## Solution

### Step 1: Verify Variable Name
In Railway dashboard, make sure the variable is named **exactly**:
```
NEXT_PUBLIC_APIFY_API_KEY
```
(No spaces, exact capitalization)

### Step 2: Redeploy After Adding Variables
After adding/updating `NEXT_PUBLIC_` variables:
1. Go to Railway → Your Service → **Deployments** tab
2. Click **"Redeploy"** button
3. This will rebuild with the new environment variables

### Step 3: Verify Variables Are Set
Check Railway → Your Service → **Variables** tab:
- ✅ `NEXT_PUBLIC_APIFY_API_KEY` = (your key)
- ✅ `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = (your key)
- ✅ `OPENAI_API_KEY` = (your key)

### Step 4: Check Build Logs
After redeploy, check the build logs to ensure:
- Variables are loaded during build
- No errors about missing variables

---

## Quick Fix Steps

1. **Verify variable exists** in Railway Variables tab
2. **Redeploy** the service (Deployments → Redeploy)
3. **Wait for build** to complete (2-3 minutes)
4. **Test** the page again

---

## Alternative: Use Runtime Variables (If Needed)

If you need to change variables without rebuilding, you'd need to:
- Remove `NEXT_PUBLIC_` prefix (but then it won't be available in browser)
- Or use a server-side API route to fetch the key

For now, **redeploy after adding NEXT_PUBLIC_ variables** is the correct approach.







