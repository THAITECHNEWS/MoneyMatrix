#!/usr/bin/env python3
"""
Unify Category Pages - Makes all category pages look the same
- Unified blue theme (like homepage and credit-cards)
- Same grid layout for articles
- Centralized styling
"""

import os
import re
from pathlib import Path

# Unified category page CSS template
UNIFIED_CATEGORY_CSS = """
        /* Unified Category Page Styles - Blue Theme */
        .category-header {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            color: white;
            padding: 4rem 0;
            text-align: center;
            margin-bottom: 0;
        }

        .breadcrumb {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem 2rem;
            font-size: 0.875rem;
        }

        .breadcrumb a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
        }

        .breadcrumb a:hover {
            color: white;
        }

        .category-header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: white;
            font-weight: 700;
        }

        .category-header p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            opacity: 0.9;
        }

        .main-content {
            padding: 4rem 0;
            max-width: 1200px;
            margin: 0 auto;
            padding-left: 1rem;
            padding-right: 1rem;
        }

        .articles-section h2 {
            font-size: 2rem;
            margin-bottom: 2rem;
            color: var(--gray-900);
            font-weight: 600;
        }

        .article-list {
            display: grid;
            gap: 2rem;
        }

        .article-item {
            background: white;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
            transition: all 0.2s ease;
            border: 1px solid var(--gray-200);
        }

        .article-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            border-color: var(--primary-color);
        }

        .article-item h3 {
            margin-bottom: 1rem;
            font-size: 1.5rem;
            font-weight: 600;
        }

        .article-item h3 a {
            color: var(--gray-900);
            text-decoration: none;
        }

        .article-item h3 a:hover {
            color: var(--primary-color);
        }

        .article-item p {
            color: var(--gray-600);
            margin-bottom: 1rem;
            line-height: 1.6;
        }

        .article-meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.875rem;
            color: var(--gray-500);
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--gray-200);
        }

        .no-articles {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--gray-600);
        }

        @media (max-width: 768px) {
            .category-header h1 {
                font-size: 2rem;
            }
            
            .category-header p {
                font-size: 1rem;
            }
            
            .article-item {
                padding: 1.5rem;
            }
        }
"""

def unify_category_page(file_path: Path):
    """Unify a single category page"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. Remove all color theme variations - use unified blue
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
        
        # 2. Remove category-specific color themes (green, orange, etc.)
        content = re.sub(
            r'/\*.*?page with.*?theme.*?\*/',
            '/* Unified Category Page - Blue Theme */',
            content
        )
        
        # 3. Replace category-header styling with unified version
        # Find and replace the category-header section
        category_header_pattern = r'\.category-header\s*\{[^}]*background:[^;]+;[^}]*\}'
        if re.search(category_header_pattern, content):
            content = re.sub(
                category_header_pattern,
                '.category-header {\n            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));\n            color: white;\n            padding: 4rem 0;\n            text-align: center;\n            margin-bottom: 0;\n        }',
                content,
                flags=re.DOTALL
            )
        
        # 4. Remove weird category-grid and category-card styles
        content = re.sub(
            r'\.category-grid\s*\{[^}]*\}',
            '',
            content
        )
        content = re.sub(
            r'\.category-card\s*\{[^}]*\}',
            '',
            content
        )
        content = re.sub(
            r'\.category-card[^{]*\{[^}]*\}',
            '',
            content
        )
        content = re.sub(
            r'\.category-header-card\s*\{[^}]*\}',
            '',
            content
        )
        content = re.sub(
            r'\.category-icon\s*\{[^}]*\}',
            '',
            content
        )
        content = re.sub(
            r'\.category-title\s*\{[^}]*\}',
            '',
            content
        )
        content = re.sub(
            r'\.category-subtitle\s*\{[^}]*\}',
            '',
            content
        )
        content = re.sub(
            r'\.category-content\s*\{[^}]*\}',
            '',
            content
        )
        
        # 5. Ensure article-list uses unified styling
        # Replace article-list if it exists with different styling
        if '.article-list' in content:
            # Check if it has grid-template-columns (wrong layout)
            if 'grid-template-columns' in content.split('.article-list')[1][:500]:
                content = re.sub(
                    r'\.article-list\s*\{[^}]*grid-template-columns[^}]*\}',
                    '.article-list {\n            display: grid;\n            gap: 2rem;\n        }',
                    content
                )
        
        # 6. Add unified CSS if not present (before </style>)
        if 'Unified Category Page Styles' not in content:
            if '</style>' in content:
                content = content.replace('</style>', UNIFIED_CATEGORY_CSS + '    </style>')
        
        # 7. Remove any emoji or icons from category headers in HTML
        content = re.sub(
            r'<div class="category-icon">[^<]*</div>',
            '',
            content
        )
        content = re.sub(
            r'<span class="category-icon">[^<]*</span>',
            '',
            content
        )
        
        # 8. Ensure article-item hover uses primary color
        content = re.sub(
            r'\.article-item h3 a:hover\s*\{[^}]*color:[^;]+;',
            '.article-item h3 a:hover {\n            color: var(--primary-color);',
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

def unify_all_category_pages():
    """Unify all category pages"""
    dist_dir = Path('dist')
    
    if not dist_dir.exists():
        print("dist/ directory not found")
        return
    
    # Category page files (excluding comparison pages and guides)
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
    
    print(f"Unifying {len(category_files)} category pages...")
    
    for filename in category_files:
        file_path = dist_dir / filename
        if file_path.exists():
            if unify_category_page(file_path):
                updated_count += 1
                print(f"✅ Unified: {filename}")
        else:
            print(f"⚠️  Not found: {filename}")
    
    print(f"\n✅ Unified {updated_count} category pages")
    print("All category pages now have unified blue theme and layout!")

if __name__ == "__main__":
    unify_all_category_pages()

