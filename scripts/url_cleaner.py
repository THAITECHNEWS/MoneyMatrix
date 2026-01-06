#!/usr/bin/env python3
"""
URL Cleaner - Removes .html from all URLs across the site
Updates all HTML files to use clean URLs without .html extension
"""

import os
import re
from pathlib import Path

def clean_urls_in_file(file_path: Path):
    """Remove .html from URLs in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace href="something.html" with href="/something" or href="something"
        # But keep index.html as "/"
        content = re.sub(r'href=["\']([^"\']+)\.html["\']', r'href="\1"', content)
        content = re.sub(r'href=["\']index["\']', r'href="/"', content)
        
        # Fix URLs that start with / to keep them absolute
        content = re.sub(r'href="([^/][^"]+)"', lambda m: f'href="/{m.group(1)}"' if not m.group(1).startswith(('http', '#', 'mailto:', 'tel:')) else f'href="{m.group(1)}"', content)
        
        # Fix canonical URLs
        content = re.sub(r'<link rel="canonical" href="([^"]+)\.html"', r'<link rel="canonical" href="\1"', content)
        
        # Fix Open Graph URLs
        content = re.sub(r'<meta property="og:url" content="([^"]+)\.html"', r'<meta property="og:url" content="\1"', content)
        
        # Fix Twitter Card URLs
        content = re.sub(r'<meta property="twitter:url" content="([^"]+)\.html"', r'<meta property="twitter:url" content="\1"', content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def clean_all_html_files():
    """Clean URLs in all HTML files"""
    dist_dir = Path('dist')
    
    if not dist_dir.exists():
        print("dist/ directory not found")
        return
    
    html_files = list(dist_dir.glob('*.html'))
    updated_count = 0
    
    print(f"Found {len(html_files)} HTML files to process...")
    
    for html_file in html_files:
        if clean_urls_in_file(html_file):
            updated_count += 1
            print(f"✅ Updated: {html_file.name}")
    
    print(f"\n✅ Updated {updated_count} files")
    print("URLs cleaned! All .html extensions removed from links.")

if __name__ == "__main__":
    clean_all_html_files()

