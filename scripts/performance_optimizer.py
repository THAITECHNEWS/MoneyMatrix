#!/usr/bin/env python3
"""
Performance Optimizer for MoneyMatrix.me
Handles compression, minification, lazy loading, and caching
"""

import os
import re
import gzip
from pathlib import Path
from typing import Dict, List
from utils import ConfigManager, logger

class PerformanceOptimizer:
    """Performance optimization utilities"""
    
    def __init__(self):
        self.config_manager = ConfigManager()
        self.performance_config = self.config_manager.get('performance', {})
    
    def optimize_html(self, html_content: str) -> str:
        """Optimize HTML content"""
        # Remove extra whitespace
        html_content = re.sub(r'\s+', ' ', html_content)
        html_content = re.sub(r'>\s+<', '><', html_content)
        
        # Compress if enabled
        if self.performance_config.get('compress_html', True):
            html_content = self._compress_html(html_content)
        
        return html_content.strip()
    
    def add_lazy_loading(self, html_content: str) -> str:
        """Add lazy loading to images"""
        if not self.performance_config.get('lazy_load_images', True):
            return html_content
        
        # Add loading="lazy" to img tags that don't have it
        html_content = re.sub(
            r'<img((?![^>]*loading=)[^>]*)>',
            r'<img\1 loading="lazy">',
            html_content
        )
        
        return html_content
    
    def add_preload_hints(self, html_content: str, critical_resources: List[str]) -> str:
        """Add preload hints for critical resources"""
        preload_tags = []
        
        for resource in critical_resources:
            resource_type = 'style' if resource.endswith('.css') else 'script' if resource.endswith('.js') else 'font'
            preload_tags.append(f'<link rel="preload" href="{resource}" as="{resource_type}">')
        
        # Insert after <head>
        if preload_tags:
            html_content = html_content.replace(
                '<head>',
                '<head>\n    ' + '\n    '.join(preload_tags)
            )
        
        return html_content
    
    def generate_cache_headers(self) -> Dict[str, str]:
        """Generate cache control headers"""
        cache_duration = self.config_manager.get('deployment.cache_duration', 3600)
        
        return {
            'Cache-Control': f'public, max-age={cache_duration}, stale-while-revalidate=86400',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
    
    def optimize_css(self, css_content: str) -> str:
        """Optimize CSS content"""
        if not self.performance_config.get('minify_css', False):
            return css_content
        
        # Remove comments
        css_content = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
        
        # Remove extra whitespace
        css_content = re.sub(r'\s+', ' ', css_content)
        css_content = re.sub(r';\s*}', '}', css_content)
        css_content = re.sub(r'{\s+', '{', css_content)
        css_content = re.sub(r'}\s+', '}', css_content)
        
        return css_content.strip()
    
    def optimize_js(self, js_content: str) -> str:
        """Optimize JavaScript content"""
        if not self.performance_config.get('minify_js', False):
            return js_content
        
        # Remove single-line comments (but preserve URLs)
        js_content = re.sub(r'//(?!https?://)[^\n]*', '', js_content)
        
        # Remove multi-line comments
        js_content = re.sub(r'/\*.*?\*/', '', js_content, flags=re.DOTALL)
        
        # Remove extra whitespace
        js_content = re.sub(r'\s+', ' ', js_content)
        
        return js_content.strip()
    
    def _compress_html(self, html_content: str) -> str:
        """Compress HTML by removing unnecessary whitespace"""
        # Preserve whitespace in <pre> and <code> tags
        html_content = re.sub(r'<pre[^>]*>.*?</pre>', lambda m: m.group(0), html_content, flags=re.DOTALL)
        html_content = re.sub(r'<code[^>]*>.*?</code>', lambda m: m.group(0), html_content, flags=re.DOTALL)
        
        # Remove whitespace between tags
        html_content = re.sub(r'>\s+<', '><', html_content)
        
        return html_content
    
    def create_manifest(self, output_path: str = 'dist/manifest.json') -> bool:
        """Create web app manifest for PWA support"""
        try:
            site_config = self.config_manager.get('site', {})
            
            manifest = {
                "name": site_config.get('name', 'MoneyMatrix.me'),
                "short_name": "MoneyMatrix",
                "description": site_config.get('description', ''),
                "start_url": "/",
                "display": "standalone",
                "background_color": "#ffffff",
                "theme_color": "#0066cc",
                "icons": [
                    {
                        "src": "/icon-192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "/icon-512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    }
                ]
            }
            
            import json
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, 'w') as f:
                json.dump(manifest, f, indent=2)
            
            logger.info("Created web app manifest")
            return True
            
        except Exception as e:
            logger.error(f"Failed to create manifest: {e}")
            return False

