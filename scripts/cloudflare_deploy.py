import os
import json
import requests
import subprocess
import shutil
from typing import Dict, List, Optional
from pathlib import Path
from utils import ConfigManager, logger

class CloudflareDeployment:
    """Handles deployment to Cloudflare Workers and Pages"""
    
    def __init__(self):
        self.config_manager = ConfigManager()
        self.account_id = self.config_manager.get_credential('cloudflare.account_id')
        self.api_token = self.config_manager.get_credential('cloudflare.api_token')
        self.zone_id = self.config_manager.get_credential('cloudflare.zone_id')
        
        if not all([self.account_id, self.api_token]):
            logger.warning("Cloudflare credentials not configured")
        
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
        
        self.base_url = "https://api.cloudflare.com/client/v4"
    
    def create_worker_script(self) -> str:
        """Create Cloudflare Worker script for serving static site"""
        worker_script = '''
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Map of routes to static files
const routes = {
  '/': '/index.html',
  '/sitemap.xml': '/sitemap.xml',
  '/robots.txt': '/robots.txt'
}

// Handle requests
async function handleRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  // Check for exact route match
  if (routes[pathname]) {
    return await serveStaticFile(routes[pathname])
  }
  
  // Check for category pages (e.g., /credit-cards)
  const categoryMatch = pathname.match(/^\/([a-z-]+)$/)
  if (categoryMatch) {
    return await serveStaticFile(`/${categoryMatch[1]}.html`)
  }
  
  // Check for article pages (e.g., /credit-cards/best-credit-cards-2025)
  const articleMatch = pathname.match(/^\/([a-z-]+)\/([a-z0-9-]+)$/)
  if (articleMatch) {
    return await serveStaticFile(`/${articleMatch[1]}/${articleMatch[2]}.html`)
  }
  
  // Serve static assets
  if (pathname.startsWith('/static/')) {
    return await serveStaticFile(pathname)
  }
  
  // 404 for everything else
  return new Response('Page not found', { 
    status: 404,
    headers: { 'Content-Type': 'text/plain' }
  })
}

// Serve static files (this would be replaced with actual file serving logic)
async function serveStaticFile(path) {
  // In production, this would serve from KV storage or R2
  // For now, return a basic HTML structure
  if (path.endsWith('.html')) {
    return new Response(getDefaultHTML(path), {
      headers: { 'Content-Type': 'text/html' }
    })
  }
  
  if (path.endsWith('.css')) {
    return new Response('/* CSS content */', {
      headers: { 'Content-Type': 'text/css' }
    })
  }
  
  if (path.endsWith('.js')) {
    return new Response('// JS content', {
      headers: { 'Content-Type': 'application/javascript' }
    })
  }
  
  return new Response('File not found', { status: 404 })
}

function getDefaultHTML(path) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MoneyMatrix.me - Financial Product Comparisons</title>
    <meta name="description" content="Compare financial products and make informed decisions">
</head>
<body>
    <h1>MoneyMatrix.me</h1>
    <p>Your financial comparison platform is loading...</p>
    <p>Path: ${path}</p>
</body>
</html>`
}

// Handle CORS if needed
function addCORSHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}
'''
        return worker_script
    
    def create_wrangler_config(self) -> Dict:
        """Create wrangler.toml configuration"""
        config = {
            "name": "moneymatrix-site",
            "type": "javascript",
            "account_id": self.account_id,
            "workers_dev": True,
            "route": "",
            "zone_id": self.zone_id,
            "usage_model": "bundled",
            "compatibility_date": "2025-01-01",
            "compatibility_flags": ["nodejs_compat"],
            "vars": {
                "ENVIRONMENT": "production"
            },
            "kv_namespaces": [
                {
                    "binding": "STATIC_CONTENT",
                    "id": "your_kv_namespace_id",
                    "preview_id": "your_preview_kv_namespace_id"
                }
            ]
        }
        return config
    
    def create_package_json(self) -> Dict:
        """Create package.json for Cloudflare deployment"""
        package_json = {
            "name": "moneymatrix-worker",
            "version": "1.0.0",
            "description": "MoneyMatrix.me Cloudflare Worker",
            "main": "worker.js",
            "scripts": {
                "deploy": "wrangler publish",
                "dev": "wrangler dev",
                "tail": "wrangler tail"
            },
            "devDependencies": {
                "@cloudflare/wrangler": "^3.0.0"
            },
            "engines": {
                "node": ">=16.0.0"
            }
        }
        return package_json
    
    def setup_deployment_files(self):
        """Setup deployment configuration files"""
        deploy_dir = "deploy"
        os.makedirs(deploy_dir, exist_ok=True)
        
        # Create worker script
        worker_script = self.create_worker_script()
        with open(os.path.join(deploy_dir, "worker.js"), "w") as f:
            f.write(worker_script)
        
        # Create wrangler config
        wrangler_config = self.create_wrangler_config()
        
        # Convert to TOML format
        wrangler_toml = f"""name = "{wrangler_config['name']}"
type = "{wrangler_config['type']}"
account_id = "{wrangler_config['account_id']}"
workers_dev = {str(wrangler_config['workers_dev']).lower()}
compatibility_date = "{wrangler_config['compatibility_date']}"

[vars]
ENVIRONMENT = "{wrangler_config['vars']['ENVIRONMENT']}"

[[kv_namespaces]]
binding = "STATIC_CONTENT"
id = "your_kv_namespace_id"
preview_id = "your_preview_kv_namespace_id"
"""
        
        with open(os.path.join(deploy_dir, "wrangler.toml"), "w") as f:
            f.write(wrangler_toml)
        
        # Create package.json
        package_json = self.create_package_json()
        with open(os.path.join(deploy_dir, "package.json"), "w") as f:
            json.dump(package_json, f, indent=2)
        
        logger.info("Created deployment configuration files")
    
    def create_github_action(self) -> str:
        """Create GitHub Action for automated deployment"""
        github_action = """name: Deploy to Cloudflare Workers

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: deploy/package-lock.json
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install Python dependencies
        run: |
          pip install -r requirements.txt
      
      - name: Generate content and build site
        env:
          DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
          UNSPLASH_ACCESS_KEY: ${{ secrets.UNSPLASH_ACCESS_KEY }}
          PIXABAY_API_KEY: ${{ secrets.PIXABAY_API_KEY }}
        run: |
          python scripts/auto_post.py --build-only
      
      - name: Install Wrangler dependencies
        working-directory: deploy
        run: npm install
      
      - name: Upload static files to KV
        working-directory: deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: |
          # This would upload static files to Cloudflare KV storage
          echo "Uploading static files to KV storage..."
      
      - name: Deploy to Cloudflare Workers
        working-directory: deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: npx wrangler publish
"""
        return github_action
    
    def setup_github_actions(self):
        """Setup GitHub Actions workflow"""
        github_dir = ".github/workflows"
        os.makedirs(github_dir, exist_ok=True)
        
        action_content = self.create_github_action()
        
        with open(os.path.join(github_dir, "deploy.yml"), "w") as f:
            f.write(action_content)
        
        logger.info("Created GitHub Actions workflow")
    
    def create_advanced_worker(self) -> str:
        """Create advanced Cloudflare Worker with KV storage support"""
        advanced_worker = '''
import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  try {
    event.respondWith(handleRequest(event))
  } catch (e) {
    event.respondWith(
      new Response('Internal Error', { status: 500 })
    )
  }
})

async function handleRequest(event) {
  const url = new URL(event.request.url)
  const pathname = url.pathname
  
  try {
    // Try to serve from KV storage first
    const page = await getAssetFromKV(event, {
      mapRequestToAsset: customKeyModifier,
    })
    
    // Add security headers
    const response = new Response(page.body, page)
    
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'unsafe-url')
    response.headers.set('Feature-Policy', 'none')
    
    // Add caching headers
    if (pathname.startsWith('/static/')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000')
    } else {
      response.headers.set('Cache-Control', 'public, max-age=3600')
    }
    
    return response
    
  } catch (e) {
    // If not found in KV, try our routing logic
    return await handleRouting(event.request)
  }
}

function customKeyModifier(request) {
  let url = new URL(request.url)
  
  // Map root to index.html
  if (url.pathname === '/') {
    url.pathname = '/index.html'
  }
  
  // Map category pages
  const categoryMatch = url.pathname.match(/^\/([a-z-]+)$/)
  if (categoryMatch) {
    url.pathname = `/${categoryMatch[1]}.html`
  }
  
  // Map article pages
  const articleMatch = url.pathname.match(/^\/([a-z-]+)\/([a-z0-9-]+)$/)
  if (articleMatch) {
    url.pathname = `/${articleMatch[1]}/${articleMatch[2]}.html`
  }
  
  return mapRequestToAsset(new Request(url.toString(), request))
}

async function handleRouting(request) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  // API endpoints
  if (pathname.startsWith('/api/')) {
    return await handleAPI(request)
  }
  
  // Redirects for SEO
  const redirects = {
    '/compare-loans': '/personal-loans',
    '/compare-cards': '/credit-cards',
    '/loan-calculator': '/calculators/loan',
    '/credit-calculator': '/calculators/credit'
  }
  
  if (redirects[pathname]) {
    return Response.redirect(new URL(redirects[pathname], request.url).toString(), 301)
  }
  
  // 404 page
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Page Not Found - MoneyMatrix.me</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/">Return to Homepage</a>
    </body>
    </html>
  `, {
    status: 404,
    headers: { 'Content-Type': 'text/html' }
  })
}

async function handleAPI(request) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  // Basic API endpoints
  if (pathname === '/api/health') {
    return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (pathname === '/api/sitemap') {
    // Return dynamic sitemap data
    return new Response(JSON.stringify({ sitemap: 'data' }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return new Response('API endpoint not found', { status: 404 })
}
'''
        return advanced_worker
    
    def create_kv_upload_script(self) -> str:
        """Create script to upload static files to Cloudflare KV"""
        upload_script = """#!/usr/bin/env python3

import os
import json
import requests
import base64
import mimetypes
from pathlib import Path

class CloudflareKVUploader:
    def __init__(self, account_id, api_token, namespace_id):
        self.account_id = account_id
        self.api_token = api_token
        self.namespace_id = namespace_id
        self.base_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}"
        self.headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json"
        }
    
    def upload_file(self, file_path, key):
        '''Upload a single file to KV storage'''
        
        with open(file_path, 'rb') as f:
            content = f.read()
        
        # Determine content type
        content_type, _ = mimetypes.guess_type(file_path)
        if not content_type:
            content_type = 'application/octet-stream'
        
        # For text files, store as string; for binary, encode as base64
        if content_type.startswith('text/') or content_type == 'application/json':
            value = content.decode('utf-8')
            metadata = {"contentType": content_type}
        else:
            value = base64.b64encode(content).decode('utf-8')
            metadata = {"contentType": content_type, "encoding": "base64"}
        
        url = f"{self.base_url}/values/{key}"
        
        payload = {
            "value": value,
            "metadata": metadata
        }
        
        response = requests.put(url, headers=self.headers, json=payload)
        
        if response.status_code == 200:
            print(f"✓ Uploaded: {key}")
            return True
        else:
            print(f"✗ Failed to upload {key}: {response.text}")
            return False
    
    def upload_directory(self, directory, prefix=""):
        '''Upload entire directory to KV storage'''
        
        uploaded = 0
        failed = 0
        
        for root, dirs, files in os.walk(directory):
            for file in files:
                file_path = os.path.join(root, file)
                
                # Create KV key from file path
                rel_path = os.path.relpath(file_path, directory)
                key = prefix + rel_path.replace(os.sep, '/')
                
                if self.upload_file(file_path, key):
                    uploaded += 1
                else:
                    failed += 1
        
        print(f"\\nUpload complete: {uploaded} successful, {failed} failed")
        return uploaded, failed

if __name__ == "__main__":
    import sys
    
    # Get credentials from environment
    account_id = os.getenv('CLOUDFLARE_ACCOUNT_ID')
    api_token = os.getenv('CLOUDFLARE_API_TOKEN') 
    namespace_id = os.getenv('CLOUDFLARE_KV_NAMESPACE_ID')
    
    if not all([account_id, api_token, namespace_id]):
        print("Missing required environment variables:")
        print("- CLOUDFLARE_ACCOUNT_ID")
        print("- CLOUDFLARE_API_TOKEN")
        print("- CLOUDFLARE_KV_NAMESPACE_ID")
        sys.exit(1)
    
    uploader = CloudflareKVUploader(account_id, api_token, namespace_id)
    
    # Upload dist directory
    if os.path.exists('dist'):
        print("Uploading static site to Cloudflare KV...")
        uploader.upload_directory('dist')
    else:
        print("dist directory not found. Run site build first.")
        sys.exit(1)
"""
        return upload_script
    
    def create_deployment_package(self):
        """Create complete deployment package"""
        logger.info("Creating Cloudflare deployment package...")
        
        # Setup basic deployment files
        self.setup_deployment_files()
        
        # Create advanced worker
        advanced_worker = self.create_advanced_worker()
        with open("deploy/advanced-worker.js", "w") as f:
            f.write(advanced_worker)
        
        # Create KV upload script
        kv_script = self.create_kv_upload_script()
        with open("deploy/upload-to-kv.py", "w") as f:
            f.write(kv_script)
        
        # Make upload script executable
        os.chmod("deploy/upload-to-kv.py", 0o755)
        
        # Setup GitHub Actions
        self.setup_github_actions()
        
        # Create deployment README
        readme_content = """# MoneyMatrix.me Cloudflare Deployment

## Setup

1. Install Wrangler CLI:
   ```bash
   npm install -g @cloudflare/wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Create KV namespace:
   ```bash
   wrangler kv:namespace create "STATIC_CONTENT"
   ```

4. Update wrangler.toml with your KV namespace ID

5. Deploy:
   ```bash
   cd deploy
   npm install
   wrangler publish
   ```

## Environment Variables

Set these secrets in GitHub Actions:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `DEEPSEEK_API_KEY`
- `UNSPLASH_ACCESS_KEY`
- `PIXABAY_API_KEY`

## Manual Deployment

1. Build the site:
   ```bash
   python scripts/auto_post.py --build-only
   ```

2. Upload to KV storage:
   ```bash
   cd deploy
   python upload-to-kv.py
   ```

3. Deploy worker:
   ```bash
   wrangler publish
   ```

## Custom Domain

To use a custom domain:

1. Add your domain to Cloudflare
2. Update wrangler.toml with your zone_id
3. Add route configuration
4. Deploy with `wrangler publish`
"""
        
        with open("deploy/README.md", "w") as f:
            f.write(readme_content)
        
        logger.info("Cloudflare deployment package created successfully")
        logger.info("Check the deploy/ directory for all deployment files")
    
    def deploy_to_cloudflare(self):
        """Deploy the site to Cloudflare (requires wrangler CLI)"""
        if not shutil.which("wrangler"):
            logger.error("Wrangler CLI not found. Install with: npm install -g @cloudflare/wrangler")
            return False
        
        try:
            # Change to deploy directory
            os.chdir("deploy")
            
            # Install dependencies
            subprocess.run(["npm", "install"], check=True)
            
            # Deploy to Cloudflare
            subprocess.run(["npx", "wrangler", "publish"], check=True)
            
            logger.info("Successfully deployed to Cloudflare Workers")
            return True
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Deployment failed: {e}")
            return False
        except Exception as e:
            logger.error(f"Deployment error: {e}")
            return False

if __name__ == "__main__":
    deployer = CloudflareDeployment()
    deployer.create_deployment_package()
    
    print("\\nDeployment package created!")
    print("Next steps:")
    print("1. Configure your Cloudflare credentials in data/api_credentials.json")
    print("2. Run: cd deploy && npm install")
    print("3. Run: wrangler login")
    print("4. Run: wrangler publish")