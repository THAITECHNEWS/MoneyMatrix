#!/usr/bin/env python3
"""
Finalize Category Unification - Ensures all category pages use centralized CSS
"""

import os
import re
from pathlib import Path

def finalize_category_page(file_path: Path):
    """Finalize category page unification"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. Remove all color theme variations - ensure blue only
        content = re.sub(
            r'--secondary-color:\s*#[^;]+;',
            '--secondary-color: #00c896;',
            content
        )
        content = re.sub(
            r'--secondary-dark:\s*#[^;]+;',
            '--secondary-dark: #00a67d;',
            content
        )
        
        # 2. Remove any remaining category-specific CSS
        # Remove category-grid, category-card, category-header-card styles
        patterns_to_remove = [
            r'\.category-grid\s*\{[^}]*\}',
            r'\.category-card\s*\{[^}]*\}',
            r'\.category-header-card\s*\{[^}]*\}',
            r'\.category-icon\s*\{[^}]*\}',
            r'\.category-title\s*\{[^}]*\}',
            r'\.category-subtitle\s*\{[^}]*\}',
            r'\.category-content\s*\{[^}]*\}',
        ]
        
        for pattern in patterns_to_remove:
            content = re.sub(pattern, '', content, flags=re.DOTALL)
        
        # 3. Ensure category-pages.css is linked
        if 'category-pages.css' not in content:
            # Add before closing </head>
            if '</head>' in content:
                css_link = '    <link rel="stylesheet" href="/static/css/category-pages.css">\n'
                content = content.replace('</head>', css_link + '</head>')
        
        # 4. Remove emoji from h1 and h2
        def clean_emoji(match):
            text = match.group(1)
            cleaned = re.sub(r'[^\w\s&]', '', text).strip()
            return f'<h1>{cleaned}</h1>'
        
        content = re.sub(
            r'<h1>([^<]*)</h1>',
            clean_emoji,
            content
        )
        
        def clean_emoji_h2(match):
            text = match.group(1)
            cleaned = re.sub(r'[^\w\s&]', '', text).strip()
            return f'<h2>{cleaned}</h2>'
        
        content = re.sub(
            r'<h2>([^<]*)</h2>',
            clean_emoji_h2,
            content
        )
        
        # 5. Ensure content-grid doesn't create sidebar layout
        content = re.sub(
            r'\.content-grid\s*\{[^}]*grid-template-columns[^}]*\}',
            '.content-grid {\n            display: block;\n        }',
            content
        )
        
        # 6. Hide sidebar if present
        content = re.sub(
            r'\.sidebar\s*\{[^}]*\}',
            '.sidebar {\n            display: none;\n        }',
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

def finalize_all_category_pages():
    """Finalize all category pages"""
    dist_dir = Path('dist')
    
    if not dist_dir.exists():
        print("dist/ directory not found")
        return
    
    category_files = [
        'personal-finance.html',
        'auto-loans.html',
        'business-loans.html',
        'student-loans.html',
        'mortgages.html',
        'credit-score.html',
        'credit-cards.html',
        'personal-loans.html',
        'regional-loans.html',
        'guides.html',
        'calculators.html',
        'news.html',
        'ai.html'
    ]
    
    updated_count = 0
    
    print(f"Finalizing {len(category_files)} category pages...")
    
    for filename in category_files:
        file_path = dist_dir / filename
        if file_path.exists():
            if finalize_category_page(file_path):
                updated_count += 1
                print(f"✅ Finalized: {filename}")
    
    print(f"\n✅ Finalized {updated_count} category pages")
    print("All category pages now unified with centralized CSS!")

if __name__ == "__main__":
    finalize_all_category_pages()

