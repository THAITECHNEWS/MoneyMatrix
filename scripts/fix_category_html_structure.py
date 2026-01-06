#!/usr/bin/env python3
"""
Fix Category HTML Structure - Removes weird category-grid and makes all pages use simple article-list
"""

import os
import re
from pathlib import Path
from bs4 import BeautifulSoup

def fix_category_html_structure(file_path: Path):
    """Fix HTML structure to use unified article-list layout"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Parse HTML
        soup = BeautifulSoup(content, 'html.parser')
        
        # Find main content area
        main_content = soup.find('main') or soup.find('div', class_='main-content')
        if not main_content:
            return False
        
        # Remove category-grid divs and replace with simple article-list
        category_grids = main_content.find_all('div', class_='category-grid')
        for grid in category_grids:
            # Extract all article-items from nested category-cards
            all_articles = []
            for card in grid.find_all('div', class_='category-card'):
                articles = card.find_all('div', class_='article-item')
                all_articles.extend(articles)
            
            # Create new simple article-list structure
            if all_articles:
                new_section = soup.new_tag('div', class_='articles-section')
                h2 = soup.new_tag('h2')
                h2.string = 'Guides & Articles'
                new_section.append(h2)
                
                article_list = soup.new_tag('div', class_='article-list')
                for article in all_articles:
                    article_list.append(article.extract())
                
                new_section.append(article_list)
                grid.replace_with(new_section)
            else:
                grid.decompose()
        
        # Remove any remaining category-card elements
        for card in main_content.find_all('div', class_='category-card'):
            card.decompose()
        
        # Remove category-header-card elements
        for header_card in main_content.find_all('div', class_='category-header-card'):
            header_card.decompose()
        
        # Ensure articles-section has proper structure
        articles_sections = main_content.find_all('div', class_='articles-section')
        for section in articles_sections:
            # Remove emoji from h2
            h2 = section.find('h2')
            if h2:
                text = h2.get_text()
                # Remove emoji and clean up
                text = re.sub(r'[^\w\s&]', '', text).strip()
                if not text:
                    text = 'Guides & Articles'
                h2.string = text
            
            # Ensure article-list exists and has correct structure
            article_list = section.find('div', class_='article-list')
            if not article_list:
                article_list = soup.new_tag('div', class_='article-list')
                section.append(article_list)
            
            # Move any loose article-items into article-list
            loose_articles = section.find_all('div', class_='article-item')
            for article in loose_articles:
                if article.parent != article_list:
                    article_list.append(article.extract())
        
        # Remove emoji from category header h1
        category_header = soup.find('section', class_='category-header')
        if category_header:
            h1 = category_header.find('h1')
            if h1:
                text = h1.get_text()
                # Remove emoji
                text = re.sub(r'[^\w\s&]', '', text).strip()
                h1.string = text
        
        # Convert back to string
        new_content = str(soup)
        
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

def fix_all_category_pages():
    """Fix HTML structure for all category pages"""
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
    
    print(f"Fixing HTML structure for {len(category_files)} category pages...")
    
    for filename in category_files:
        file_path = dist_dir / filename
        if file_path.exists():
            if fix_category_html_structure(file_path):
                updated_count += 1
                print(f"✅ Fixed structure: {filename}")
        else:
            print(f"⚠️  Not found: {filename}")
    
    print(f"\n✅ Fixed {updated_count} category pages")
    print("All category pages now have unified HTML structure!")

if __name__ == "__main__":
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        print("Installing beautifulsoup4...")
        import subprocess
        subprocess.run(['pip', 'install', 'beautifulsoup4'], check=True)
        from bs4 import BeautifulSoup
    
    fix_all_category_pages()

