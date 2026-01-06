#!/usr/bin/env python3
"""
Ultra-simple test server for MoneyMatrix.me
"""

import os
import http.server
import socketserver
from pathlib import Path

def create_test_page():
    """Create a simple test page"""
    os.makedirs('dist', exist_ok=True)
    
    test_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MoneyMatrix.me - Test Server</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            text-align: center; 
            background: rgba(255,255,255,0.1); 
            padding: 60px; 
            border-radius: 20px; 
            backdrop-filter: blur(10px);
            max-width: 600px;
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        p { font-size: 1.2em; margin-bottom: 30px; opacity: 0.9; }
        .success { 
            background: #4CAF50; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0; 
            font-weight: bold;
        }
        .btn {
            background: white;
            color: #667eea;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            font-weight: bold;
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 40px;
        }
        .card {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            backdrop-filter: blur(5px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💰 MoneyMatrix.me</h1>
        <div class="success">
            ✅ Local Server Running Successfully!
        </div>
        <p>Your MoneyMatrix.me development environment is working perfectly.</p>
        
        <div class="grid">
            <div class="card">
                <h3>🎨 Design</h3>
                <p>Professional financial website layout</p>
            </div>
            <div class="card">
                <h3>🤖 AI Content</h3>
                <p>DeepSeek integration ready</p>
            </div>
            <div class="card">
                <h3>☁️ Deployment</h3>
                <p>Cloudflare Workers setup</p>
            </div>
        </div>
        
        <div style="margin-top: 40px;">
            <h2>🚀 Next Steps:</h2>
            <p>1. Add DeepSeek API key to <code>data/api_credentials.json</code></p>
            <p>2. Run: <code>python scripts/auto_post.py --generate-only</code></p>
            <p>3. Generate your first financial articles!</p>
        </div>
        
        <div style="margin-top: 40px; opacity: 0.7; font-size: 0.9em;">
            <p>Server running on <strong>localhost:8000</strong></p>
            <p>Press Ctrl+C in terminal to stop</p>
        </div>
    </div>
</body>
</html>"""
    
    with open('dist/index.html', 'w') as f:
        f.write(test_html)
    
    print("✅ Created test page")

class TestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='dist', **kwargs)

def run_test_server():
    """Run ultra-simple test server"""
    # Change to project directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    os.chdir(project_dir)
    
    # Create test page
    create_test_page()
    
    PORT = 8000
    
    try:
        with socketserver.TCPServer(("", PORT), TestHandler) as httpd:
            print(f"""
🚀 MoneyMatrix.me Test Server Starting...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Server URL: http://localhost:{PORT}
✅ Test page created
✅ Ready for connections

Opening in browser... If it doesn't open automatically, 
copy and paste this URL: http://localhost:{PORT}

Press Ctrl+C to stop server
""")
            
            # Try to open browser
            try:
                import webbrowser
                webbrowser.open(f'http://localhost:{PORT}')
                print("🌐 Browser opened automatically")
            except:
                print("⚠️  Could not open browser automatically")
            
            httpd.serve_forever()
            
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {PORT} is already in use!")
            print("Try a different port:")
            print("python scripts/test_server.py")
        else:
            print(f"❌ Server error: {e}")
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped successfully")

if __name__ == "__main__":
    run_test_server()