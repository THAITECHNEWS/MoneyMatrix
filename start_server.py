#!/usr/bin/env python3
"""
Start MoneyMatrix.me server on an available port
"""

import os
import socket
import http.server
import socketserver
import webbrowser
from pathlib import Path

def find_free_port(start_port=8000, max_port=8020):
    """Find a free port to use"""
    for port in range(start_port, max_port):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.bind(('', port))
            sock.close()
            return port
        except:
            continue
    return None

def create_simple_page():
    """Create a simple test page"""
    os.makedirs('dist', exist_ok=True)
    
    html = """<!DOCTYPE html>
<html>
<head>
    <title>MoneyMatrix.me - Local Development</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: system-ui; margin: 0; padding: 40px; background: #f0f9ff; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        h1 { color: #0066cc; margin-bottom: 20px; }
        .success { background: #dcfce7; border: 1px solid #16a34a; color: #15803d; padding: 16px; border-radius: 8px; margin: 20px 0; }
        .btn { background: #0066cc; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 10px 5px 10px 0; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .card { border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; }
        .card h3 { margin-top: 0; color: #374151; }
        code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <h1>💰 MoneyMatrix.me</h1>
        
        <div class="success">
            <strong>✅ SUCCESS!</strong> Your MoneyMatrix.me development server is running perfectly!
        </div>
        
        <p>This is your local development environment for the MoneyMatrix.me financial comparison platform.</p>
        
        <div class="grid">
            <div class="card">
                <h3>🎨 Professional Design</h3>
                <p>Modern, responsive layout inspired by top financial sites like NerdWallet</p>
            </div>
            <div class="card">
                <h3>🤖 AI Content Generation</h3>
                <p>DeepSeek API integration for generating financial articles automatically</p>
            </div>
            <div class="card">
                <h3>📊 15 Financial Categories</h3>
                <p>Credit cards, loans, mortgages, and more - complete topic coverage</p>
            </div>
            <div class="card">
                <h3>☁️ Cloud Deployment</h3>
                <p>Ready for Cloudflare Workers deployment with GitHub Actions</p>
            </div>
        </div>
        
        <h2>🚀 Get Started with Content Generation</h2>
        <p>To generate your first financial articles:</p>
        
        <ol>
            <li><strong>Get DeepSeek API Key</strong> - Sign up at <a href="https://platform.deepseek.com" target="_blank">platform.deepseek.com</a> (very affordable)</li>
            <li><strong>Add API Key</strong> - Edit <code>data/api_credentials.json</code> with your key</li>
            <li><strong>Generate Content</strong> - Run: <code>python scripts/auto_post.py --generate-only</code></li>
            <li><strong>Build Site</strong> - Run: <code>python scripts/auto_post.py --build-only</code></li>
        </ol>
        
        <h2>🛠️ What's Included</h2>
        <ul>
            <li><strong>Content Generation:</strong> AI-powered 1000+ word financial articles</li>
            <li><strong>Image Processing:</strong> Automatic image selection from Unsplash/Pixabay</li>
            <li><strong>SEO Optimization:</strong> Meta tags, structured data, sitemaps</li>
            <li><strong>Backlink System:</strong> Automatic posting to Medium, Dev.to, Blogger</li>
            <li><strong>Static Site Generator:</strong> Fast, responsive HTML generation</li>
            <li><strong>Deployment Ready:</strong> Cloudflare Workers integration</li>
        </ul>
        
        <p style="margin-top: 40px; text-align: center; color: #6b7280;">
            <strong>MoneyMatrix.me Development Server</strong><br>
            Ready to generate professional financial content with AI
        </p>
    </div>
</body>
</html>"""
    
    with open('dist/index.html', 'w') as f:
        f.write(html)

class SimpleHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='dist', **kwargs)

def main():
    # Change to project directory
    if os.path.basename(os.getcwd()) != 'MoneyMatrix':
        script_dir = os.path.dirname(os.path.abspath(__file__))
        if os.path.basename(script_dir) == 'scripts':
            project_dir = os.path.dirname(script_dir)
            os.chdir(project_dir)
    
    # Create test page
    create_simple_page()
    
    # Find free port
    port = find_free_port()
    if not port:
        print("❌ Could not find an available port")
        return
    
    try:
        with socketserver.TCPServer(("", port), SimpleHandler) as httpd:
            print(f"""
🚀 MoneyMatrix.me Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Server URL: http://localhost:{port}
✅ Alternative: http://127.0.0.1:{port}

🌐 Opening in your default browser...
   If it doesn't open, copy/paste the URL above

Press Ctrl+C to stop the server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""")
            
            # Open browser
            try:
                webbrowser.open(f'http://127.0.0.1:{port}')
            except:
                pass
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()