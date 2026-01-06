# How to Get Google Maps API Key

## Step-by-Step Guide

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create or Select a Project
- Click the project dropdown at the top
- Click "New Project" or select an existing one
- Give it a name (e.g., "MoneyMatrix")

### 3. Enable Maps JavaScript API
- Go to: https://console.cloud.google.com/apis/library
- Search for "Maps JavaScript API"
- Click on it and click "Enable"

### 4. Enable Places API (for search)
- Still in APIs & Services > Library
- Search for "Places API"
- Click on it and click "Enable"

### 5. Create API Key
- Go to: https://console.cloud.google.com/apis/credentials
- Click "Create Credentials" → "API Key"
- Copy the API key (it will look like: `AIzaSy...`)

### 6. Restrict API Key (Recommended)
- Click on the API key you just created
- Under "API restrictions", select "Restrict key"
- Choose: "Maps JavaScript API" and "Places API"
- Under "Application restrictions", you can restrict by HTTP referrer:
  - Add: `https://moneymatrix.me/*`
  - Add: `https://*.railway.app/*` (for Railway deployment)
  - Add: `http://localhost:3000/*` (for local development)
- Click "Save"

### 7. Add to Your Project

**For Local Development (.env file):**
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyYourActualKeyHere
```

**For Railway Deployment:**
1. Go to your Railway project
2. Click on your service
3. Go to "Variables" tab
4. Add: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = `your_key_here`

## Quick Links

- **Google Cloud Console**: https://console.cloud.google.com/
- **APIs Library**: https://console.cloud.google.com/apis/library
- **Credentials**: https://console.cloud.google.com/apis/credentials
- **Maps JavaScript API**: https://console.cloud.google.com/apis/library/maps-backend.googleapis.com
- **Places API**: https://console.cloud.google.com/apis/library/places-backend.googleapis.com

## Pricing

Google Maps API has a **free tier**:
- **$200 free credit per month**
- Maps JavaScript API: Free for most use cases
- Places API: $17 per 1,000 requests (after free tier)

For a store locator with 20 results per search:
- ~$0.34 per search (if you exceed free tier)
- First $200/month is free

## Required APIs

Make sure these are enabled:
1. ✅ **Maps JavaScript API** - For displaying the map
2. ✅ **Places API** - For place details (optional, but recommended)

## Security Best Practices

1. **Restrict by API** - Only enable Maps JavaScript API and Places API
2. **Restrict by Domain** - Add your production domain
3. **Monitor Usage** - Set up billing alerts
4. **Use Environment Variables** - Never commit API keys to git

---

**Once you have the key, add it to your `.env` file or Railway environment variables!**

