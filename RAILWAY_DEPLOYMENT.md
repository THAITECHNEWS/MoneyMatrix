# Railway Deployment Guide for MoneyMatrix.me

## 🚀 Quick Deploy to Railway

### Option 1: Deploy Static Site (Recommended)

This deploys the already-generated static HTML files from `/dist/`.

1. **Install Railway CLI** (if not already installed):
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize Railway Project**:
   ```bash
   cd /Users/ofri.david/Downloads/MoneyMatrix
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

5. **Set Custom Domain** (optional):
   ```bash
   railway domain add moneymatrix.me
   ```

### Option 2: Deploy with Content Generation

If you want Railway to also generate content automatically:

1. **Set Environment Variables** in Railway dashboard:
   - `DEEPSEEK_API_KEY` - Your DeepSeek API key
   - `UNSPLASH_ACCESS_KEY` - (Optional) For images
   - `PIXABAY_API_KEY` - (Optional) For images

2. **Create a build script** that generates content before serving:
   ```bash
   python scripts/auto_post.py --build-only && python3 railway_server.py
   ```

3. **Update `railway.json`**:
   ```json
   {
     "deploy": {
       "startCommand": "python scripts/auto_post.py --build-only && python3 railway_server.py"
     }
   }
   ```

## 📋 What Gets Deployed

- **Static HTML files** from `/dist/` directory
- **CSS/JS assets** from `/dist/static/`
- **All 26+ pages** ready to serve

## 🔧 Configuration Files

- `railway.json` - Railway deployment configuration
- `railway_server.py` - Python HTTP server for Railway
- `requirements.txt` - Python dependencies (auto-detected by Railway)

## 🌐 Environment Variables

Set these in Railway dashboard if you want content generation:

```
DEEPSEEK_API_KEY=your_key_here
UNSPLASH_ACCESS_KEY=your_key_here
PIXABAY_API_KEY=your_key_here
```

## 📝 Pre-Deployment Checklist

- [ ] Ensure `/dist/` directory has all generated HTML files
- [ ] Test locally: `python3 railway_server.py`
- [ ] Verify all pages load correctly
- [ ] Check that static assets (CSS/JS) are in `/dist/static/`

## 🚨 Troubleshooting

### Port Issues
Railway automatically sets the `PORT` environment variable. The server script uses this automatically.

### Missing Files
If `/dist/` is empty, run locally first:
```bash
python scripts/auto_post.py --build-only
```

### Build Errors
Check Railway logs:
```bash
railway logs
```

## 💡 Tips

1. **Static Site = Fast**: Since it's just HTML/CSS/JS, Railway serves it very quickly
2. **No Database Needed**: All content is pre-generated static files
3. **CDN Ready**: Railway automatically handles CDN and caching
4. **Auto HTTPS**: Railway provides SSL certificates automatically

## 🔄 Updating Content

To update content after deployment:

1. **Generate new content locally**:
   ```bash
   python scripts/auto_post.py --generate-only
   python scripts/auto_post.py --build-only
   ```

2. **Commit and push**:
   ```bash
   git add dist/
   git commit -m "Update content"
   git push
   ```

3. **Railway auto-deploys** (if connected to GitHub) or manually:
   ```bash
   railway up
   ```

## 📊 Monitoring

- View logs: `railway logs`
- Check metrics: Railway dashboard
- Monitor uptime: Railway dashboard

---

**Ready to deploy?** Run `railway up` and your site will be live in minutes! 🎉

