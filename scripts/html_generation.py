import os
import json
import random
from datetime import datetime
from typing import Dict, List, Optional
from jinja2 import Environment, FileSystemLoader, select_autoescape
from utils import (
    ContentUtils, SEOUtils, DataManager, ConfigManager, 
    PromptManager, logger
)

class HTMLGenerator:
    """Generates HTML content for articles and pages"""
    
    def __init__(self, templates_dir: str = "templates", output_dir: str = "dist"):
        self.templates_dir = templates_dir
        self.output_dir = output_dir
        self.data_manager = DataManager()
        self.config_manager = ConfigManager()
        
        # Setup Jinja2 environment
        self.jinja_env = Environment(
            loader=FileSystemLoader(self.templates_dir),
            autoescape=select_autoescape(['html', 'xml'])
        )
        
        # Create output directory
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Load data
        self.categories = self.data_manager.get_categories()
        self.topics = self.data_manager.get_topics()
    
    def generate_article_html(self, article_data: Dict) -> str:
        """Generate HTML for a single article"""
        template = self.jinja_env.get_template('article.html')
        
        # Get category info
        category = self.get_category_by_slug(article_data.get('category_slug', ''))
        
        # Prepare template data
        template_data = {
            'title': article_data.get('title', ''),
            'content': article_data.get('content', ''),
            'category_name': category.get('name', '') if category else '',
            'category_slug': article_data.get('category_slug', ''),
            'description': article_data.get('meta_description', ''),
            'keywords': article_data.get('keywords', []),
            'url': article_data.get('url', ''),
            'date_published': article_data.get('date_published', ''),
            'date_modified': article_data.get('date_modified', ''),
            'date_published_formatted': self.format_date(article_data.get('date_published', '')),
            'date_modified_formatted': self.format_date(article_data.get('date_modified', '')),
            'read_time': article_data.get('read_time', 5),
            'tags': article_data.get('tags', []),
            'related_articles': article_data.get('related_articles', []),
            'compare_url': category.get('compare_url', '') if category else '',
            'best_url': category.get('best_url', '') if category else '',
            'url_encoded': article_data.get('url', '').replace('/', '%2F'),
            'title_encoded': article_data.get('title', '').replace(' ', '%20')
        }
        
        return template.render(**template_data)
    
    def generate_homepage(self) -> str:
        """Generate homepage HTML"""
        template = self.jinja_env.get_template('homepage.html')
        
        # Get recent articles
        published_articles = self.data_manager.get_published_articles()
        recent_articles = sorted(
            published_articles, 
            key=lambda x: x.get('date_published', ''), 
            reverse=True
        )[:6]
        
        # Get featured categories
        featured_categories = self.categories[:8]  # First 8 categories
        
        template_data = {
            'title': 'Compare Financial Products - MoneyMatrix.me',
            'description': 'Compare loans, credit cards, and financial products. Find the best rates and terms for your financial needs.',
            'url': 'https://moneymatrix.me',
            'recent_articles': recent_articles,
            'featured_categories': featured_categories,
            'date_published': datetime.now().isoformat(),
            'date_modified': datetime.now().isoformat()
        }
        
        return template.render(**template_data)
    
    def generate_category_page(self, category_slug: str) -> str:
        """Generate category listing page"""
        template = self.jinja_env.get_template('category.html')
        
        category = self.get_category_by_slug(category_slug)
        if not category:
            return ""
        
        # Get articles for this category
        published_articles = self.data_manager.get_published_articles()
        category_articles = [
            article for article in published_articles 
            if article.get('category_slug') == category_slug
        ]
        
        # Sort by date
        category_articles = sorted(
            category_articles,
            key=lambda x: x.get('date_published', ''),
            reverse=True
        )
        
        template_data = {
            'title': f"{category['name']} - MoneyMatrix.me",
            'description': category.get('description', ''),
            'category': category,
            'articles': category_articles,
            'url': f"https://moneymatrix.me/{category_slug}",
            'date_published': datetime.now().isoformat(),
            'date_modified': datetime.now().isoformat()
        }
        
        return template.render(**template_data)
    
    def generate_sitemap(self) -> str:
        """Generate XML sitemap"""
        published_articles = self.data_manager.get_published_articles()
        
        sitemap_content = ['<?xml version="1.0" encoding="UTF-8"?>']
        sitemap_content.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
        
        # Homepage
        sitemap_content.append('<url>')
        sitemap_content.append('<loc>https://moneymatrix.me</loc>')
        sitemap_content.append(f'<lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>')
        sitemap_content.append('<changefreq>daily</changefreq>')
        sitemap_content.append('<priority>1.0</priority>')
        sitemap_content.append('</url>')
        
        # Category pages
        for category in self.categories:
            sitemap_content.append('<url>')
            sitemap_content.append(f'<loc>https://moneymatrix.me/{category["slug"]}</loc>')
            sitemap_content.append(f'<lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>')
            sitemap_content.append('<changefreq>weekly</changefreq>')
            sitemap_content.append('<priority>0.8</priority>')
            sitemap_content.append('</url>')
        
        # Articles
        for article in published_articles:
            sitemap_content.append('<url>')
            sitemap_content.append(f'<loc>{article.get("url", "")}</loc>')
            
            # Parse date
            date_published = article.get('date_published', '')
            if date_published:
                try:
                    date_obj = datetime.fromisoformat(date_published.replace('Z', '+00:00'))
                    sitemap_content.append(f'<lastmod>{date_obj.strftime("%Y-%m-%d")}</lastmod>')
                except:
                    sitemap_content.append(f'<lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>')
            
            sitemap_content.append('<changefreq>monthly</changefreq>')
            sitemap_content.append('<priority>0.7</priority>')
            sitemap_content.append('</url>')
        
        sitemap_content.append('</urlset>')
        
        return '\n'.join(sitemap_content)
    
    def generate_robots_txt(self) -> str:
        """Generate robots.txt file"""
        robots_content = [
            "User-agent: *",
            "Allow: /",
            "",
            "# Sitemap",
            "Sitemap: https://moneymatrix.me/sitemap.xml",
            "",
            "# Crawl-delay",
            "Crawl-delay: 1"
        ]
        
        return '\n'.join(robots_content)
    
    def save_html_file(self, content: str, filename: str, subdirectory: str = ""):
        """Save HTML content to file"""
        if subdirectory:
            output_path = os.path.join(self.output_dir, subdirectory)
            os.makedirs(output_path, exist_ok=True)
            filepath = os.path.join(output_path, filename)
        else:
            filepath = os.path.join(self.output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        logger.info(f"Saved HTML file: {filepath}")
    
    def create_article_page(self, article_data: Dict) -> str:
        """Create complete article page and save to disk"""
        html_content = self.generate_article_html(article_data)
        
        # Create directory structure
        category_slug = article_data.get('category_slug', '')
        article_slug = article_data.get('slug', '')
        
        if category_slug and article_slug:
            subdirectory = category_slug
            filename = f"{article_slug}.html"
            self.save_html_file(html_content, filename, subdirectory)
            
            return f"{subdirectory}/{filename}"
        
        return ""
    
    def create_all_category_pages(self):
        """Create all category listing pages"""
        for category in self.categories:
            html_content = self.generate_category_page(category['slug'])
            if html_content:
                # Save as .html file but URLs won't have .html
                filename = f"{category['slug']}.html"
                self.save_html_file(html_content, filename)
                logger.info(f"Created category page: {category['name']}")
    
    def create_homepage(self):
        """Create homepage"""
        html_content = self.generate_homepage()
        self.save_html_file(html_content, "index.html")
        logger.info("Created homepage")
    
    def create_sitemap(self):
        """Create XML sitemap"""
        sitemap_content = self.generate_sitemap()
        self.save_html_file(sitemap_content, "sitemap.xml")
        logger.info("Created sitemap")
    
    def create_robots_txt(self):
        """Create robots.txt"""
        robots_content = self.generate_robots_txt()
        self.save_html_file(robots_content, "robots.txt")
        logger.info("Created robots.txt")
    
    def copy_static_files(self):
        """Copy static files to output directory"""
        import shutil
        
        static_source = "static"
        static_dest = os.path.join(self.output_dir, "static")
        
        if os.path.exists(static_source):
            if os.path.exists(static_dest):
                shutil.rmtree(static_dest)
            shutil.copytree(static_source, static_dest)
            logger.info("Copied static files")
    
    def build_complete_site(self):
        """Build the complete static site"""
        logger.info("Starting complete site build...")
        
        # Create all pages
        self.create_homepage()
        self.create_all_category_pages()
        self.create_sitemap()
        self.create_robots_txt()
        
        # Copy static files
        self.copy_static_files()
        
        # Create article pages for all published articles
        published_articles = self.data_manager.get_published_articles()
        for article in published_articles:
            self.create_article_page(article)
        
        logger.info(f"Site build complete. Generated {len(published_articles)} article pages.")
    
    def get_category_by_slug(self, slug: str) -> Optional[Dict]:
        """Get category by slug"""
        for category in self.categories:
            if category['slug'] == slug:
                return category
        return None
    
    def format_date(self, date_string: str) -> str:
        """Format date for display"""
        if not date_string:
            return ""
        
        try:
            date_obj = datetime.fromisoformat(date_string.replace('Z', '+00:00'))
            return date_obj.strftime("%B %d, %Y")
        except:
            return date_string

class TemplateManager:
    """Manages additional template creation"""
    
    def __init__(self, templates_dir: str = "templates"):
        self.templates_dir = templates_dir
        os.makedirs(self.templates_dir, exist_ok=True)
    
    def create_homepage_template(self):
        """Create homepage template"""
        template_content = """{% extends "base.html" %}

{% block content %}
<div class="hero-section">
    <div class="container">
        <div class="hero-content">
            <h1>Compare Financial Products & Make Smart Money Decisions</h1>
            <p>Find the best loans, credit cards, and financial products tailored to your needs. Compare rates, terms, and features from top lenders.</p>
            <div class="hero-buttons">
                <a href="/compare-personal-loans" class="btn btn-primary">Compare Loans</a>
                <a href="/compare-credit-cards" class="btn btn-secondary">Compare Cards</a>
            </div>
        </div>
    </div>
</div>

<section class="featured-categories">
    <div class="container">
        <h2>Popular Comparisons</h2>
        <div class="categories-grid">
            {% for category in featured_categories %}
            <div class="category-card">
                <h3><a href="/{{ category.slug }}">{{ category.name }}</a></h3>
                <p>{{ category.description }}</p>
                <div class="card-actions">
                    <a href="{{ category.compare_url }}" class="btn-link">Compare Now</a>
                    <a href="{{ category.best_url }}" class="btn-link">Best Options</a>
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</section>

<section class="recent-articles">
    <div class="container">
        <h2>Latest Financial Guides</h2>
        <div class="articles-grid">
            {% for article in recent_articles %}
            <article class="article-card">
                <h3><a href="{{ article.url }}">{{ article.title }}</a></h3>
                <p>{{ article.excerpt }}</p>
                <div class="article-meta">
                    <span>{{ article.category }}</span>
                    <span>{{ article.read_time }} min read</span>
                </div>
            </article>
            {% endfor %}
        </div>
    </div>
</section>

<style>
.hero-section {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
    padding: var(--space-20) 0;
    text-align: center;
}

.hero-content h1 {
    font-size: var(--text-5xl);
    margin-bottom: var(--space-6);
    color: white;
}

.hero-content p {
    font-size: var(--text-xl);
    margin-bottom: var(--space-8);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    color: rgba(255, 255, 255, 0.9);
}

.hero-buttons {
    display: flex;
    gap: var(--space-4);
    justify-content: center;
    flex-wrap: wrap;
}

.hero-buttons .btn {
    padding: var(--space-4) var(--space-8);
    font-size: var(--text-lg);
}

.featured-categories {
    padding: var(--space-20) 0;
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-6);
    margin-top: var(--space-8);
}

.category-card {
    background: white;
    padding: var(--space-8);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    transition: transform 0.2s ease;
}

.category-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
}

.category-card h3 {
    margin-bottom: var(--space-4);
}

.category-card h3 a {
    color: var(--gray-900);
    text-decoration: none;
}

.category-card h3 a:hover {
    color: var(--primary-color);
}

.card-actions {
    display: flex;
    gap: var(--space-4);
    margin-top: var(--space-6);
}

.btn-link {
    color: var(--primary-color);
    font-weight: 500;
    text-decoration: none;
    font-size: var(--text-sm);
}

.btn-link:hover {
    text-decoration: underline;
}

.recent-articles {
    padding: var(--space-20) 0;
    background: var(--gray-50);
}

.articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--space-6);
    margin-top: var(--space-8);
}

.article-card {
    background: white;
    padding: var(--space-6);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s ease;
}

.article-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.article-card h3 {
    margin-bottom: var(--space-3);
    font-size: var(--text-lg);
}

.article-card h3 a {
    color: var(--gray-900);
    text-decoration: none;
}

.article-card h3 a:hover {
    color: var(--primary-color);
}

.article-meta {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-sm);
    color: var(--gray-500);
    margin-top: var(--space-4);
}

@media (max-width: 768px) {
    .hero-content h1 {
        font-size: var(--text-3xl);
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .hero-buttons .btn {
        width: 100%;
        max-width: 300px;
    }
}
</style>
{% endblock %}"""
        
        with open(os.path.join(self.templates_dir, 'homepage.html'), 'w') as f:
            f.write(template_content)
    
    def create_category_template(self):
        """Create category listing template"""
        template_content = """{% extends "base.html" %}

{% block content %}
<div class="container">
    <div class="category-header">
        <nav class="breadcrumb">
            <a href="/">Home</a> → <span>{{ category.name }}</span>
        </nav>
        
        <h1>{{ category.name }}</h1>
        <p>{{ category.description }}</p>
        
        <div class="category-actions">
            <a href="{{ category.compare_url }}" class="btn btn-primary">Compare {{ category.name }}</a>
            <a href="{{ category.best_url }}" class="btn btn-secondary">Best {{ category.name }}</a>
        </div>
    </div>

    <section class="articles-section">
        <h2>{{ category.name }} Guides & Articles</h2>
        
        {% if articles %}
        <div class="articles-list">
            {% for article in articles %}
            <article class="article-item">
                <div class="article-content">
                    <h3><a href="{{ article.url }}">{{ article.title }}</a></h3>
                    <p>{{ article.excerpt }}</p>
                    <div class="article-meta">
                        <span>{{ article.date_published_formatted }}</span>
                        <span>{{ article.read_time }} min read</span>
                    </div>
                </div>
            </article>
            {% endfor %}
        </div>
        {% else %}
        <div class="no-articles">
            <p>No articles available yet. Check back soon for comprehensive guides on {{ category.name }}.</p>
        </div>
        {% endif %}
    </section>
</div>

<style>
.category-header {
    text-align: center;
    padding: var(--space-12) 0;
    border-bottom: 1px solid var(--gray-200);
    margin-bottom: var(--space-12);
}

.category-header h1 {
    font-size: var(--text-4xl);
    margin-bottom: var(--space-4);
    color: var(--gray-900);
}

.category-header p {
    font-size: var(--text-xl);
    color: var(--gray-600);
    margin-bottom: var(--space-8);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.category-actions {
    display: flex;
    gap: var(--space-4);
    justify-content: center;
    flex-wrap: wrap;
}

.articles-section h2 {
    margin-bottom: var(--space-8);
    text-align: center;
}

.articles-list {
    display: grid;
    gap: var(--space-6);
}

.article-item {
    background: white;
    padding: var(--space-8);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s ease;
}

.article-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.article-item h3 {
    margin-bottom: var(--space-4);
    font-size: var(--text-2xl);
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
    margin-bottom: var(--space-4);
    line-height: 1.6;
}

.article-meta {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-sm);
    color: var(--gray-500);
}

.no-articles {
    text-align: center;
    padding: var(--space-12);
    background: var(--gray-50);
    border-radius: var(--radius-lg);
}

@media (max-width: 768px) {
    .category-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .category-actions .btn {
        width: 100%;
        max-width: 300px;
    }
}
</style>
{% endblock %}"""
        
        with open(os.path.join(self.templates_dir, 'category.html'), 'w') as f:
            f.write(template_content)
    
    def create_all_templates(self):
        """Create all missing templates"""
        self.create_homepage_template()
        self.create_category_template()
        logger.info("Created additional templates")

if __name__ == "__main__":
    # Create templates if they don't exist
    template_manager = TemplateManager()
    template_manager.create_all_templates()
    
    # Generate HTML
    html_generator = HTMLGenerator()
    html_generator.build_complete_site()