# Railway Deployment Fix - Dockerfile Approach

## Problem
Nixpacks was timing out during Nix package installation.

## Solution
Switched to Dockerfile-based deployment for more reliable builds.

## Files Created/Updated

1. **Dockerfile** - Simple Python 3.11 slim image
2. **requirements-prod.txt** - Minimal production dependencies
3. **railway.json** - Updated to use Dockerfile builder
4. **.dockerignore** - Excludes unnecessary files

## Deploy

```bash
cd /Users/ofri.david/Downloads/MoneyMatrix
railway up
```

## What Changed

- ✅ Removed `nixpacks.toml` (was causing timeouts)
- ✅ Created `Dockerfile` (more reliable)
- ✅ Created `requirements-prod.txt` (minimal deps)
- ✅ Updated `railway.json` to use Dockerfile builder
- ✅ Added `.dockerignore` to reduce build size

## Build Process

1. Railway detects Dockerfile
2. Builds Python 3.11 slim image
3. Installs minimal dependencies
4. Copies application files
5. Runs `python railway_server.py`

This should be much faster and more reliable than Nixpacks!

