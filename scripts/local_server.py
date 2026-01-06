#!/usr/bin/env python3
"""
Local development server for MoneyMatrix.me

This script serves the generated static site locally for testing and development.
It also provides a simple API for triggering content generation and monitoring.
"""

import os
import json
import threading
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import sys

# Add scripts directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils import logger, ConfigManager, DataManager
from auto_post import MoneyMatrixOrchestrator

class MoneyMatrixHandler(SimpleHTTPRequestHandler):
    """Custom handler for local development server"""
    
    def __init__(self, *args, **kwargs):
        self.data_manager = DataManager()
        self.config_manager = ConfigManager()
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # API endpoints
        if path.startswith('/api/'):
            self.handle_api_request(path, parsed_path.query)
            return
        
        # Admin interface
        if path == '/admin' or path == '/admin/':
            self.serve_admin_interface()
            return
        
        # Serve static files from dist directory
        if path == '/':
            path = '/index.html'
        
        # Handle category pages (e.g., /credit-cards)
        if path.count('/') == 1 and path != '/index.html' and not path.startswith('/static/'):
            # Try category page
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
            logger.error(f"Error serving file {file_path}: {e}")
            self.send_error(500, "Internal server error")
    
    def handle_api_request(self, path, query_string):
        """Handle API requests"""
        query_params = parse_qs(query_string) if query_string else {}
        
        if path == '/api/status':
            self.api_status()
        elif path == '/api/generate':
            self.api_generate_content(query_params)
        elif path == '/api/build':
            self.api_build_site()
        elif path == '/api/articles':
            self.api_list_articles()
        elif path == '/api/config':
            self.api_get_config()
        else:
            self.send_json_response({'error': 'API endpoint not found'}, 404)
    
    def api_status(self):
        """Return system status"""
        try:
            orchestrator = MoneyMatrixOrchestrator()
            status = orchestrator.get_system_status()
            self.send_json_response(status)
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)
    
    def api_generate_content(self, params):
        """Generate new content via API"""
        try:
            count = int(params.get('count', [1])[0])
            
            # Run in background thread to avoid blocking
            def generate():
                orchestrator = MoneyMatrixOrchestrator()
                orchestrator.generate_only_mode(count)
            
            thread = threading.Thread(target=generate)
            thread.daemon = True
            thread.start()
            
            self.send_json_response({
                'message': f'Content generation started for {count} articles',
                'status': 'started'
            })
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)
    
    def api_build_site(self):
        """Build site via API"""
        try:
            def build():
                orchestrator = MoneyMatrixOrchestrator()
                orchestrator.build_only_mode()
            
            thread = threading.Thread(target=build)
            thread.daemon = True
            thread.start()
            
            self.send_json_response({
                'message': 'Site build started',
                'status': 'started'
            })
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)
    
    def api_list_articles(self):
        """List published articles"""
        try:
            articles = self.data_manager.get_published_articles()
            # Return summary info
            article_list = []
            for article in articles[-20:]:  # Last 20 articles
                article_list.append({
                    'title': article.get('title', ''),
                    'slug': article.get('slug', ''),
                    'category': article.get('category_name', ''),
                    'url': article.get('url', ''),
                    'date_published': article.get('date_published', ''),
                    'word_count': article.get('word_count', 0)
                })
            
            self.send_json_response({
                'articles': article_list,
                'total': len(articles)
            })
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)
    
    def api_get_config(self):
        """Get system configuration"""
        try:
            config = {
                'features': self.config_manager.get('features', {}),
                'content': self.config_manager.get('content', {}),
                'site': self.config_manager.get('site', {})
            }
            self.send_json_response(config)
        except Exception as e:
            self.send_json_response({'error': str(e)}, 500)
    
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
        """Serve admin interface"""
        admin_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MoneyMatrix.me - Admin Panel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f7; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .card { background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .btn { background: #007AFF; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; margin-right: 10px; margin-bottom: 10px; }
        .btn:hover { background: #0056CC; }
        .btn-secondary { background: #8E8E93; }
        .btn-secondary:hover { background: #6D6D70; }
        .status { padding: 10px; border-radius: 8px; margin: 10px 0; }
        .status.success { background: #D1F2EB; color: #00695C; }
        .status.error { background: #FADBD8; color: #C62828; }
        .status.info { background: #D6EAF8; color: #1565C0; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .metric { text-align: center; padding: 20px; }
        .metric-value { font-size: 2em; font-weight: bold; color: #007AFF; }
        .metric-label { color: #8E8E93; margin-top: 5px; }
        .log { background: #1E1E1E; color: #00FF00; padding: 15px; border-radius: 8px; font-family: monospace; max-height: 300px; overflow-y: auto; }
        .article-list { max-height: 400px; overflow-y: auto; }
        .article-item { padding: 10px; border-bottom: 1px solid #eee; }
        .article-title { font-weight: bold; color: #333; }
        .article-meta { font-size: 0.9em; color: #666; }
        input[type="number"] { padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 80px; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💰 MoneyMatrix.me - Admin Panel</h1>
            <p>Local development server for content generation and site management</p>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>📊 System Status</h3>
                <div id="status-metrics">
                    <div class="metric">
                        <div class="metric-value" id="total-articles">-</div>
                        <div class="metric-label">Total Articles</div>
                    </div>
                </div>
                <button class="btn" onclick="refreshStatus()">Refresh Status</button>
            </div>
            
            <div class="card">
                <h3>✍️ Content Generation</h3>
                <div style="margin-bottom: 15px;">
                    <label>Articles to generate:</label>
                    <input type="number" id="generate-count" value="1" min="1" max="10">
                </div>
                <button class="btn" onclick="generateContent()">Generate Content</button>
                <button class="btn btn-secondary" onclick="buildSite()">Build Site</button>
                <div id="generate-status"></div>
            </div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>📄 Recent Articles</h3>
                <div id="articles-list" class="article-list">
                    Loading articles...
                </div>
                <button class="btn btn-secondary" onclick="refreshArticles()">Refresh List</button>
            </div>
            
            <div class="card">
                <h3>🔧 Quick Actions</h3>
                <button class="btn" onclick="openSite()">🌐 Open Site</button>
                <button class="btn btn-secondary" onclick="window.open('/api/status', '_blank')">📊 API Status</button>
                <button class="btn btn-secondary" onclick="window.open('/api/config', '_blank')">⚙️ Config</button>
                <div style="margin-top: 15px;">
                    <h4>🔗 Useful Links</h4>
                    <p><a href="/" target="_blank">Homepage</a></p>
                    <p><a href="/credit-cards" target="_blank">Credit Cards Category</a></p>
                    <p><a href="/personal-loans" target="_blank">Personal Loans Category</a></p>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h3>📝 Activity Log</h3>
            <div id="activity-log" class="log">
                Server started - Ready for content generation<br>
                Waiting for commands...
            </div>
        </div>
    </div>

    <script>
        let logEntries = ['Server started - Ready for content generation', 'Waiting for commands...'];
        
        function addLogEntry(message) {
            const timestamp = new Date().toLocaleTimeString();
            logEntries.push(`[${timestamp}] ${message}`);
            if (logEntries.length > 100) logEntries.shift();
            
            const logDiv = document.getElementById('activity-log');
            logDiv.innerHTML = logEntries.join('<br>');
            logDiv.scrollTop = logDiv.scrollHeight;
        }
        
        function showStatus(message, type = 'info') {
            const statusDiv = document.getElementById('generate-status');
            statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
            setTimeout(() => statusDiv.innerHTML = '', 5000);
        }
        
        async function refreshStatus() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                
                document.getElementById('total-articles').textContent = data.total_articles || 0;
                addLogEntry(`Status refreshed - ${data.total_articles} articles published`);
            } catch (error) {
                addLogEntry(`Error refreshing status: ${error.message}`);
            }
        }
        
        async function generateContent() {
            const count = document.getElementById('generate-count').value;
            
            try {
                showStatus(`Starting generation of ${count} article(s)...`, 'info');
                addLogEntry(`Starting content generation for ${count} articles`);
                
                const response = await fetch(`/api/generate?count=${count}`);
                const data = await response.json();
                
                if (response.ok) {
                    showStatus(data.message, 'success');
                    addLogEntry(data.message);
                } else {
                    showStatus(`Error: ${data.error}`, 'error');
                    addLogEntry(`Generation error: ${data.error}`);
                }
            } catch (error) {
                showStatus(`Error: ${error.message}`, 'error');
                addLogEntry(`Generation failed: ${error.message}`);
            }
        }
        
        async function buildSite() {
            try {
                showStatus('Building site...', 'info');
                addLogEntry('Starting site build');
                
                const response = await fetch('/api/build');
                const data = await response.json();
                
                if (response.ok) {
                    showStatus(data.message, 'success');
                    addLogEntry(data.message);
                } else {
                    showStatus(`Error: ${data.error}`, 'error');
                    addLogEntry(`Build error: ${data.error}`);
                }
            } catch (error) {
                showStatus(`Error: ${error.message}`, 'error');
                addLogEntry(`Build failed: ${error.message}`);
            }
        }
        
        async function refreshArticles() {
            try {
                const response = await fetch('/api/articles');
                const data = await response.json();
                
                const articlesDiv = document.getElementById('articles-list');
                
                if (data.articles && data.articles.length > 0) {
                    articlesDiv.innerHTML = data.articles.map(article => `
                        <div class="article-item">
                            <div class="article-title">${article.title}</div>
                            <div class="article-meta">
                                ${article.category} • ${article.word_count} words • 
                                <a href="${article.url}" target="_blank">View</a>
                            </div>
                        </div>
                    `).join('');
                } else {
                    articlesDiv.innerHTML = '<p>No articles found. Generate some content first!</p>';
                }
                
                addLogEntry(`Articles list refreshed - ${data.total} total articles`);
            } catch (error) {
                addLogEntry(`Error loading articles: ${error.message}`);
            }
        }
        
        function openSite() {
            window.open('/', '_blank');
            addLogEntry('Opened main site in new tab');
        }
        
        // Auto-refresh status every 30 seconds
        setInterval(refreshStatus, 30000);
        
        // Load initial data
        refreshStatus();
        refreshArticles();
    </script>
</body>
</html>"""
        
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.send_header('Content-Length', str(len(admin_html)))
        self.end_headers()
        self.wfile.write(admin_html.encode())

def run_local_server(port=8000, auto_open=True):
    """Run local development server"""
    
    # Change to MoneyMatrix directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    os.chdir(project_dir)
    
    # Ensure dist directory exists (create basic structure if needed)
    if not os.path.exists('dist'):
        logger.info("Creating basic site structure for testing...")
        try:
            from auto_post import MoneyMatrixOrchestrator
            orchestrator = MoneyMatrixOrchestrator()
            orchestrator.build_only_mode()
        except Exception as e:
            logger.warning(f"Could not build site: {e}")
            # Create minimal structure
            os.makedirs('dist', exist_ok=True)
            with open('dist/index.html', 'w') as f:
                f.write("""<!DOCTYPE html>
<html><head><title>MoneyMatrix.me - Local Testing</title></head>
<body><h1>MoneyMatrix.me</h1><p>Local development server running!</p>
<p><a href="/admin">Go to Admin Panel</a></p></body></html>""")
    
    server_address = ('', port)
    httpd = HTTPServer(server_address, MoneyMatrixHandler)
    
    print(f"""
🚀 MoneyMatrix.me Local Development Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 Main Site:    http://localhost:{port}/
🔧 Admin Panel:  http://localhost:{port}/admin
📊 API Status:   http://localhost:{port}/api/status

Server running on port {port}...
Press Ctrl+C to stop
""")
    
    if auto_open:
        # Open admin panel in browser
        import webbrowser
        webbrowser.open(f'http://localhost:{port}/admin')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
        httpd.shutdown()

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='MoneyMatrix.me Local Development Server')
    parser.add_argument('--port', type=int, default=8000, help='Port to run server on (default: 8000)')
    parser.add_argument('--no-browser', action='store_true', help='Don\'t automatically open browser')
    
    args = parser.parse_args()
    
    run_local_server(port=args.port, auto_open=not args.no_browser)