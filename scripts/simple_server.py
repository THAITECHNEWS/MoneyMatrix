#!/usr/bin/env python3
"""
Simple local development server for MoneyMatrix.me

This is a lightweight version that works without all dependencies.
Perfect for testing the HTML structure and design locally.
"""

import os
import json
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse
import sys

class MoneyMatrixHandler(SimpleHTTPRequestHandler):
    """Simple handler for local development server"""
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Admin interface
        if path == '/admin' or path == '/admin/':
            self.serve_admin_interface()
            return
        
        # API endpoints (simple responses)
        if path.startswith('/api/'):
            self.handle_simple_api(path)
            return
        
        # Serve static files from dist directory
        if path == '/':
            path = '/index.html'
        
        # Handle category pages (e.g., /credit-cards)
        if path.count('/') == 1 and path != '/index.html' and not path.startswith('/static/'):
            category_file = f"dist{path}.html"
            if os.path.exists(category_file):
                self.serve_file(category_file, 'text/html')
                return
        
        # Handle article pages (e.g., /credit-cards/best-credit-cards-2025)
        if path.count('/') == 2 and not path.startswith('/static/'):
            parts = path.strip('/').split('/')
            if len(parts) == 2:
                article_file = f"dist/{parts[0]}/{parts[1]}.html"
                if os.path.exists(article_file):
                    self.serve_file(article_file, 'text/html')
                    return
        
        # Serve from dist directory
        file_path = f"dist{path}"
        if os.path.exists(file_path) and os.path.isfile(file_path):
            # Determine content type
            if path.endswith('.html'):
                content_type = 'text/html'
            elif path.endswith('.css'):
                content_type = 'text/css'
            elif path.endswith('.js'):
                content_type = 'application/javascript'
            elif path.endswith('.json'):
                content_type = 'application/json'
            elif path.endswith('.xml'):
                content_type = 'application/xml'
            elif path.endswith(('.jpg', '.jpeg')):
                content_type = 'image/jpeg'
            elif path.endswith('.png'):
                content_type = 'image/png'
            else:
                content_type = 'text/plain'
            
            self.serve_file(file_path, content_type)
        else:
            self.send_error(404, "File not found")
    
    def serve_file(self, file_path, content_type):
        """Serve a file with appropriate headers"""
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            
        except Exception as e:
            print(f"Error serving file {file_path}: {e}")
            self.send_error(500, "Internal server error")
    
    def handle_simple_api(self, path):
        """Handle simple API requests"""
        if path == '/api/status':
            response = {
                'status': 'ok',
                'message': 'Simple local server running',
                'total_articles': 0,
                'articles_today': 0
            }
        else:
            response = {'error': 'API endpoint not available in simple mode'}
        
        self.send_json_response(response)
    
    def send_json_response(self, data, status_code=200):
        """Send JSON response"""
        response = json.dumps(data, indent=2)
        
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(response)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response.encode())
    
    def serve_admin_interface(self):
        """Serve simple admin interface"""
        admin_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MoneyMatrix.me - Local Development</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f7; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { background: white; padding: 30px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
        .card { background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .btn { background: #007AFF; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; margin: 10px; text-decoration: none; display: inline-block; }
        .btn:hover { background: #0056CC; }
        .btn-green { background: #34C759; }
        .btn-green:hover { background: #28A745; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .status { padding: 15px; background: #D1F2EB; color: #00695C; border-radius: 8px; margin: 15px 0; }
        h1 { color: #1d1d1f; margin-bottom: 10px; }
        h2 { color: #1d1d1f; margin-bottom: 15px; }
        p { color: #86868b; margin-bottom: 20px; }
        .feature { padding: 15px; border: 1px solid #e5e5e7; border-radius: 8px; margin-bottom: 10px; }
        .code { background: #f5f5f7; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💰 MoneyMatrix.me</h1>
            <p>Local Development Server</p>
            <div class="status">
                ✅ Server running successfully on <strong>localhost:8000</strong>
            </div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h2>🌐 View Your Site</h2>
                <p>Explore the MoneyMatrix.me website structure and design:</p>
                <a href="/" class="btn btn-green">Open Homepage</a>
                <div style="margin-top: 15px;">
                    <p><strong>Try these pages:</strong></p>
                    <a href="/credit-cards" class="btn">Credit Cards</a>
                    <a href="/personal-loans" class="btn">Personal Loans</a>
                    <a href="/mortgages" class="btn">Mortgages</a>
                </div>
            </div>
            
            <div class="card">
                <h2>🛠️ Development Mode</h2>
                <p>This is a simple server for viewing the site structure.</p>
                <div class="feature">
                    <strong>✅ Features Working:</strong><br>
                    • HTML templates and routing<br>
                    • CSS styling and responsive design<br>
                    • Static file serving<br>
                    • Navigation and links
                </div>
                <div class="feature">
                    <strong>⚠️ For Full Features:</strong><br>
                    • Add API keys to <code>data/api_credentials.json</code><br>
                    • Run: <code>python scripts/auto_post.py --generate-only</code><br>
                    • Then: <code>python scripts/auto_post.py --build-only</code>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h2>🚀 Next Steps</h2>
            <p>To get full functionality with content generation:</p>
            <div class="code">
# 1. Get a DeepSeek API key (very affordable)<br>
# 2. Edit data/api_credentials.json<br>
# 3. Generate your first article:<br>
python scripts/auto_post.py --generate-only<br><br>
# 4. Build the site:<br>
python scripts/auto_post.py --build-only<br><br>
# 5. View your generated content!
            </div>
        </div>
        
        <div class="card">
            <h2>📁 Project Structure</h2>
            <p>Your MoneyMatrix.me project includes:</p>
            <ul style="list-style: none; padding: 0;">
                <li>📄 <strong>15 Financial Categories</strong> - Auto loans, credit cards, mortgages, etc.</li>
                <li>🤖 <strong>AI Content Generation</strong> - DeepSeek API integration</li>
                <li>🎨 <strong>Professional Design</strong> - NerdWallet-inspired responsive layout</li>
                <li>🔗 <strong>Backlink System</strong> - Medium, Dev.to, Blogger integration</li>
                <li>☁️ <strong>Cloudflare Deployment</strong> - Ready for production</li>
                <li>📊 <strong>SEO Optimization</strong> - Structured data, meta tags, sitemaps</li>
            </ul>
        </div>
    </div>
</body>
</html>"""
        
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.send_header('Content-Length', str(len(admin_html)))
        self.end_headers()
        self.wfile.write(admin_html.encode())

def create_basic_site_structure():
    """Create basic site structure for demo"""
    os.makedirs('dist', exist_ok=True)
    os.makedirs('dist/static/css', exist_ok=True)
    os.makedirs('dist/static/js', exist_ok=True)
    
    # Create basic index.html
    index_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MoneyMatrix.me - Financial Product Comparisons</title>
    <link rel="stylesheet" href="/static/css/main.css">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; background: #f8fafc; }
        .hero { background: linear-gradient(135deg, #0066cc, #004c99); color: white; padding: 80px 20px; text-align: center; }
        .hero h1 { font-size: 3em; margin-bottom: 20px; }
        .hero p { font-size: 1.2em; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .categories { padding: 60px 20px; }
        .categories h2 { text-align: center; margin-bottom: 40px; font-size: 2.5em; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.2s; }
        .card:hover { transform: translateY(-5px); }
        .card h3 { color: #0066cc; margin-bottom: 15px; }
        .btn { background: #0066cc; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 15px; }
        .btn:hover { background: #004c99; }
        .nav { background: white; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .nav .container { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5em; font-weight: bold; color: #0066cc; }
        .nav-links { display: flex; gap: 30px; }
        .nav-links a { text-decoration: none; color: #333; font-weight: 500; }
    </style>
</head>
<body>
    <nav class="nav">
        <div class="container">
            <div class="logo">💰 MoneyMatrix.me</div>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/credit-cards">Credit Cards</a>
                <a href="/personal-loans">Loans</a>
                <a href="/admin">Admin</a>
            </div>
        </div>
    </nav>

    <section class="hero">
        <div class="container">
            <h1>Compare Financial Products</h1>
            <p>Find the best loans, credit cards, and financial products tailored to your needs. Make informed decisions with our comprehensive comparisons.</p>
            <a href="/credit-cards" class="btn" style="margin-right: 15px;">Compare Credit Cards</a>
            <a href="/personal-loans" class="btn">Compare Loans</a>
        </div>
    </section>

    <section class="categories">
        <div class="container">
            <h2>Popular Categories</h2>
            <div class="grid">
                <div class="card">
                    <h3>💳 Credit Cards</h3>
                    <p>Compare credit cards, rewards programs, and find the best offers for your spending habits.</p>
                    <a href="/credit-cards" class="btn">Compare Cards</a>
                </div>
                <div class="card">
                    <h3>🏠 Personal Loans</h3>
                    <p>Find personal loans for debt consolidation, home improvement, or major purchases.</p>
                    <a href="/personal-loans" class="btn">Compare Loans</a>
                </div>
                <div class="card">
                    <h3>🏡 Mortgages</h3>
                    <p>Compare mortgage rates and find the best home loans for your dream house.</p>
                    <a href="/mortgages" class="btn">Compare Mortgages</a>
                </div>
                <div class="card">
                    <h3>🚗 Auto Loans</h3>
                    <p>Get the best auto loan rates for new or used vehicle purchases.</p>
                    <a href="/auto-loans" class="btn">Compare Auto Loans</a>
                </div>
                <div class="card">
                    <h3>📊 Credit Score</h3>
                    <p>Monitor and improve your credit score with our tools and guides.</p>
                    <a href="/credit-score" class="btn">Check Score</a>
                </div>
                <div class="card">
                    <h3>💼 Business Loans</h3>
                    <p>Find business financing options for startups and growing companies.</p>
                    <a href="/business-loans" class="btn">Compare Business Loans</a>
                </div>
            </div>
        </div>
    </section>

    <footer style="background: #1e293b; color: white; padding: 40px 20px; text-align: center; margin-top: 60px;">
        <div class="container">
            <p>&copy; 2025 MoneyMatrix.me - Compare financial products and make informed decisions.</p>
        </div>
    </footer>
</body>
</html>"""
    
    with open('dist/index.html', 'w') as f:
        f.write(index_html)
    
    # Copy CSS file if it exists
    if os.path.exists('static/css/main.css'):
        import shutil
        shutil.copy('static/css/main.css', 'dist/static/css/main.css')
    
    print("✅ Created basic site structure for local testing")

def run_simple_server(port=8000, auto_open=True):
    """Run simple local development server"""
    
    # Change to MoneyMatrix directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    os.chdir(project_dir)
    
    # Create basic structure if needed
    if not os.path.exists('dist/index.html'):
        create_basic_site_structure()
    
    server_address = ('', port)
    httpd = HTTPServer(server_address, MoneyMatrixHandler)
    
    print(f"""
🚀 MoneyMatrix.me Local Development Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 Main Site:    http://localhost:{port}/
🔧 Admin Panel:  http://localhost:{port}/admin

✅ Server running on port {port}...
✅ Basic site structure ready for testing
✅ Templates and CSS working

Press Ctrl+C to stop server
""")
    
    if auto_open:
        webbrowser.open(f'http://localhost:{port}/admin')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
        httpd.shutdown()

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='MoneyMatrix.me Simple Local Server')
    parser.add_argument('--port', type=int, default=8000, help='Port to run server on (default: 8000)')
    parser.add_argument('--no-browser', action='store_true', help='Don\'t automatically open browser')
    
    args = parser.parse_args()
    
    run_simple_server(port=args.port, auto_open=not args.no_browser)