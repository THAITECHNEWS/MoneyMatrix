#!/usr/bin/env python3
"""
Railway deployment server for MoneyMatrix.me
Serves static files from dist/ directory with optimized headers and error handling
"""

import os
import sys
import http.server
import socketserver
import mimetypes
from pathlib import Path
from datetime import datetime

# Get port from Railway environment variable (defaults to 8000)
PORT = int(os.getenv('PORT', 8000))

# Change to project directory
script_dir = Path(__file__).parent.absolute()
os.chdir(script_dir)

# Ensure dist directory exists
dist_dir = script_dir / 'dist'
if not dist_dir.exists():
    print(f"⚠️  Warning: dist/ directory not found. Creating basic structure...")
    dist_dir.mkdir(exist_ok=True)
    
    # Create a basic index.html
    index_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MoneyMatrix.me - Building</title>
    <style>
        body { font-family: system-ui; padding: 40px; text-align: center; background: #f8fafc; }
        h1 { color: #0066cc; margin-bottom: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="container">
        <h1>💰 MoneyMatrix.me</h1>
        <p>Site is being built. Please run: <code>python scripts/auto_post.py --build-only</code></p>
    </div>
</body>
</html>"""
    
    with open(dist_dir / 'index.html', 'w') as f:
        f.write(index_html)

class OptimizedHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Optimized handler with performance headers, error handling, and logging"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(dist_dir), **kwargs)
    
    def end_headers(self):
        # Performance and security headers
        self.send_header('Cache-Control', self._get_cache_control())
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
        
        # Compression hint
        accept_encoding = self.headers.get('Accept-Encoding', '')
        if 'gzip' in accept_encoding:
            self.send_header('Vary', 'Accept-Encoding')
        
        super().end_headers()
    
    def _get_cache_control(self) -> str:
        """Get appropriate cache control header based on file type"""
        path = self.path.lower()
        
        if path.endswith(('.html', '.htm')):
            return 'public, max-age=3600, stale-while-revalidate=86400'
        elif path.endswith(('.css', '.js')):
            return 'public, max-age=31536000, immutable'
        elif path.endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico')):
            return 'public, max-age=31536000, immutable'
        else:
            return 'public, max-age=3600'
    
    def guess_type(self, path):
        """Override to ensure proper MIME types"""
        mimetype, encoding = mimetypes.guess_type(path)
        
        # Ensure common types are correct
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.json'):
            return 'application/json'
        elif path.endswith('.xml'):
            return 'application/xml'
        elif path.endswith('.svg'):
            return 'image/svg+xml'
        
        return mimetype or 'application/octet-stream'
    
    def do_GET(self):
        """Handle GET requests with proper error handling and clean URLs"""
        try:
            # Handle root path
            if self.path == '/' or self.path == '':
                self.path = '/index.html'
                return super().do_GET()
            
            # Handle clean URLs (without .html extension)
            # Check if it's a request for a page without extension
            clean_path = self.path.rstrip('/')
            
            # Skip if it's already a file with extension or static asset
            if not clean_path.endswith(('.html', '.css', '.js', '.json', '.xml', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '/static/')):
                # Try to find matching .html file
                html_path = clean_path.lstrip('/') + '.html'
                full_html_path = os.path.join(self.directory, html_path)
                
                if os.path.exists(full_html_path):
                    self.path = '/' + html_path
                    return super().do_GET()
            
            # Handle static files
            if self.path.startswith('/static/'):
                return super().do_GET()
            
            # Default behavior for files with extensions
            return super().do_GET()
            
        except Exception as e:
            self.send_error(500, f"Internal Server Error: {str(e)}")
    
    def send_error(self, code, message=None):
        """Custom error pages"""
        self.error_message_format = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error {code} - MoneyMatrix.me</title>
            <style>
                body {{ font-family: system-ui; padding: 40px; text-align: center; background: #f8fafc; }}
                .error-container {{ max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
                h1 {{ color: #0066cc; font-size: 3em; margin-bottom: 20px; }}
                a {{ color: #0066cc; text-decoration: none; }}
                a:hover {{ text-decoration: underline; }}
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>{code}</h1>
                <p>{message}</p>
                <p><a href="/">← Return to Homepage</a></p>
            </div>
        </body>
        </html>
        """.format(code=code, message=message or self.responses[code][0])
        
        super().send_error(code, message)
    
    def log_message(self, format, *args):
        """Enhanced logging for Railway"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")

if __name__ == "__main__":
    Handler = OptimizedHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"""
🚀 MoneyMatrix.me Railway Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Server running on port {PORT}
✅ Serving files from: {dist_dir}
✅ Optimized headers enabled
✅ Error handling configured
✅ Ready to serve static site

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""")
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Server error: {e}")
        sys.exit(1)

