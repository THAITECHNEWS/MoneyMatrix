#!/usr/bin/env python3
"""
Final Design Fix - Applies complete design system updates
- Fixes font-family references
- Adds logo gradient styling
- Ensures design-system.css is linked
- Removes any remaining emoji/Playfair references
"""

import os
import re
from pathlib import Path

def fix_design_in_file(file_path: Path):
    """Apply final design fixes"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. Fix font-family variable references
        content = re.sub(
            r'var\(--font-family-sans\)',
            'var(--font-family)',
            content
        )
        content = re.sub(
            r'var\(--font-family-serif\)',
            'var(--font-family)',
            content
        )
        
        # 2. Add logo gradient styling if not present
        if '.logo-text' in content and 'background:' not in content.split('.logo-text')[1][:200]:
            # Find the logo styling section and add gradient
            logo_style_pattern = r'(\.logo-text\s*\{[^}]*)(color:[^;]+;)'
            if re.search(logo_style_pattern, content):
                content = re.sub(
                    logo_style_pattern,
                    r'\1background: linear-gradient(135deg, #0066cc, #004c99);\n            -webkit-background-clip: text;\n            -webkit-text-fill-color: transparent;\n            background-clip: text;\n            \2',
                    content
                )
            else:
                # Add logo-text styling before closing style tag
                if '</style>' in content:
                    logo_css = """
        .logo-text {
            background: linear-gradient(135deg, #0066cc, #004c99);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
"""
                    content = content.replace('</style>', logo_css + '    </style>')
        
        # 3. Ensure design-system.css is linked
        if 'design-system.css' not in content and '</head>' in content:
            css_link = '    <link rel="stylesheet" href="/static/css/design-system.css">\n'
            content = content.replace('</head>', css_link + '</head>')
        
        # 4. Remove any remaining emoji from logo area
        content = re.sub(
            r'<a[^>]*class="logo"[^>]*>💰\s*',
            '<a href="/" class="logo">',
            content
        )
        
        # 5. Fix logo structure
        content = re.sub(
            r'<a href="[^"]*" class="logo">\s*💰\s*<span class="logo-text">MoneyMatrix</span>',
            '<a href="/" class="logo"><span class="logo-text">MoneyMatrix</span>',
            content
        )
        
        # 6. Remove logo-icon CSS if present
        content = re.sub(
            r'\.logo-icon\s*\{[^}]*\}',
            '',
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

def fix_all_html_files():
    """Apply fixes to all HTML files"""
    dist_dir = Path('dist')
    
    if not dist_dir.exists():
        print("dist/ directory not found")
        return
    
    html_files = list(dist_dir.glob('*.html'))
    updated_count = 0
    
    print(f"Applying final design fixes to {len(html_files)} files...")
    
    for html_file in html_files:
        if fix_design_in_file(html_file):
            updated_count += 1
            print(f"✅ Fixed: {html_file.name}")
    
    print(f"\n✅ Fixed {updated_count} files")
    print("Design system complete! Clean URLs, Inter font, gradient logo.")

if __name__ == "__main__":
    fix_all_html_files()

