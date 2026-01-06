#!/usr/bin/env python3
"""
Design Updater - Updates all HTML files with new design system
- Removes Playfair Display font
- Uses Inter font throughout
- Updates logo to remove emoji
- Applies unified typography
"""

import os
import re
from pathlib import Path

def update_design_in_file(file_path: Path):
    """Update design in a single HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. Remove Playfair Display from font imports
        content = re.sub(
            r'family=Inter[^&]*&family=Playfair\+Display[^"]*"',
            'family=Inter:wght@300;400;500;600;700"',
            content
        )
        
        # 2. Remove serif font family variable
        content = re.sub(
            r'--font-family-serif:[^;]*;',
            '',
            content
        )
        
        # 3. Update all headings to use Inter (remove serif)
        content = re.sub(
            r'font-family:\s*var\(--font-family-serif\)',
            'font-family: var(--font-family)',
            content
        )
        content = re.sub(
            r'font-family:\s*[\'"]?Playfair Display[\'"]?',
            'font-family: var(--font-family)',
            content
        )
        
        # 4. Update logo to remove emoji and icon spans
        content = re.sub(
            r'<span class="logo-icon">[^<]*</span>\s*',
            '',
            content
        )
        content = re.sub(
            r'💰\s*',
            '',
            content
        )
        # Update logo structure to use clean text with gradient
        content = re.sub(
            r'<a href="[^"]*" class="logo">\s*<span class="logo-text">MoneyMatrix</span>\s*</a>',
            '<a href="/" class="logo"><span class="logo-text">MoneyMatrix</span></a>',
            content
        )
        
        # 5. Update logo text to use gradient
        content = re.sub(
            r'<span class="logo-text">MoneyMatrix</span>',
            '<span class="logo-text">MoneyMatrix</span>',
            content
        )
        
        # 6. Add design system CSS if not present
        if 'design-system.css' not in content:
            # Find the last </style> or <link rel="stylesheet"
            if '</head>' in content:
                css_link = '<link rel="stylesheet" href="/static/css/design-system.css">\n    '
                content = content.replace('</head>', css_link + '</head>')
        
        # 7. Update font-family variables
        content = re.sub(
            r'--font-family-sans:\s*[^;]*;',
            '--font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;',
            content
        )
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def update_all_html_files():
    """Update design in all HTML files"""
    dist_dir = Path('dist')
    
    if not dist_dir.exists():
        print("dist/ directory not found")
        return
    
    html_files = list(dist_dir.glob('*.html'))
    updated_count = 0
    
    print(f"Found {len(html_files)} HTML files to update...")
    
    for html_file in html_files:
        if update_design_in_file(html_file):
            updated_count += 1
            print(f"✅ Updated: {html_file.name}")
    
    print(f"\n✅ Updated {updated_count} files")
    print("Design system applied! Inter font throughout, logo updated.")

if __name__ == "__main__":
    update_all_html_files()

