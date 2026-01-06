#!/usr/bin/env python3
"""
Clean Category Structure - Properly formats and unifies category page HTML
"""

import os
import re
from pathlib import Path
from bs4 import BeautifulSoup

def clean_category_structure(file_path: Path):
    """Clean and unify category page structure"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Parse HTML
        soup = BeautifulSoup(content, 'html.parser')
        
        # Find main content
        main_content = soup.find('main', class_='main-content')
        if not main_content:
            return False
        
        container = main_content.find('div', class_='container')
        if not container:
            return False
        
        # Remove any remaining category-grid or weird structures
        for grid in container.find_all('div', class_='category-grid'):
            grid.decompose()
        
        for card in container.find_all('div', class_='category-card'):
            card.decompose()
        
        # Find or create articles-section
        articles_section = container.find('div', class_='articles-section')
        
        if not articles_section:
            # Create new articles-section
            articles_section = soup.new_tag('div', class_='articles-section')
            container.append(articles_section)
        
        # Ensure h2 exists
        h2 = articles_section.find('h2')
        if not h2:
            h2 = soup.new_tag('h2')
            # Get category name from page title or h1
            h1 = soup.find('h1')
            if h1:
                category_name = h1.get_text().strip()
                # Remove emoji
                category_name = re.sub(r'[^\w\s&]', '', category_name).strip()
                h2.string = f"{category_name} Guides & Articles"
            else:
                h2.string = "Guides & Articles"
            articles_section.append(h2)
        else:
            # Clean h2 text
            h2_text = h2.get_text()
            h2_text = re.sub(r'[^\w\s&]', '', h2_text).strip()
            if not h2_text:
                h2_text = "Guides & Articles"
            h2.string = h2_text
        
        # Find or create article-list
        article_list = articles_section.find('div', class_='article-list')
        
        if not article_list:
            article_list = soup.new_tag('div', class_='article-list')
            articles_section.append(article_list)
        
        # Collect all article-items from container
        all_articles = container.find_all(['div', 'article'], class_='article-item')
        
        # Move all articles to the unified article-list
        for article in all_articles:
            if article.parent != article_list:
                article_list.append(article.extract())
        
        # Remove content-grid wrapper if it exists (we want single column)
        content_grid = container.find('div', class_='content-grid')
        if content_grid:
            # Move articles-section out of content-grid
            if articles_section in content_grid.descendants:
                articles_section.extract()
                container.append(articles_section)
            content_grid.decompose()
        
        # Remove sidebar
        sidebar = container.find('div', class_='sidebar')
        if sidebar:
            sidebar.decompose()
        
        # Remove emoji from category header h1
        category_header = soup.find('section', class_='category-header')
        if category_header:
            h1 = category_header.find('h1')
            if h1:
                text = h1.get_text()
                text = re.sub(r'[^\w\s&]', '', text).strip()
                if text:
                    h1.string = text
        
        # Convert back to string with proper formatting
        new_content = str(soup)
        
        # Clean up extra whitespace
        new_content = re.sub(r'\n\s*\n\s*\n', '\n\n', new_content)
        
        if new_content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        import traceback
        traceback.print_exc()
        return False

def clean_all_category_pages():
    """Clean all category pages"""
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
    
    print(f"Cleaning structure for {len(category_files)} category pages...")
    
    for filename in category_files:
        file_path = dist_dir / filename
        if file_path.exists():
            if clean_category_structure(file_path):
                updated_count += 1
                print(f"✅ Cleaned: {filename}")
    
    print(f"\n✅ Cleaned {updated_count} category pages")
    print("All category pages now have clean, unified structure!")

if __name__ == "__main__":
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        print("Installing beautifulsoup4...")
        import subprocess
        subprocess.run(['pip', 'install', 'beautifulsoup4'], check=True)
        from bs4 import BeautifulSoup
    
    clean_all_category_pages()

