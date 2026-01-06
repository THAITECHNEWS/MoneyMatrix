#!/usr/bin/env python3
"""
Centralized SEO Manager for MoneyMatrix.me
Handles all SEO-related functionality: meta tags, structured data, sitemaps, robots.txt
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Optional
from utils import ConfigManager, DataManager, logger

class SEOManager:
    """Centralized SEO management system"""
    
    def __init__(self):
        self.config_manager = ConfigManager()
        self.data_manager = DataManager()
        self.site_config = self.config_manager.get('site', {})
        self.base_url = self.site_config.get('url', 'https://moneymatrix.me')
        
    def generate_meta_tags(self, page_data: Dict) -> str:
        """Generate complete meta tags HTML"""
        title = page_data.get('title', self.site_config.get('name', 'MoneyMatrix.me'))
        description = page_data.get('description', self.site_config.get('description', ''))
        keywords = page_data.get('keywords', [])
        canonical_url = page_data.get('canonical_url', '')
        og_image = page_data.get('og_image', f'{self.base_url}/og-image.jpg')
        article_type = page_data.get('type', 'website')  # 'article' or 'website'
        
        # Optimize title length
        max_title_length = self.config_manager.get('seo.title_length', 60)
        if len(title) > max_title_length:
            title = title[:max_title_length-3] + '...'
        
        # Optimize description length
        max_desc_length = self.config_manager.get('seo.meta_description_length', 155)
        if len(description) > max_desc_length:
            description = description[:max_desc_length-3] + '...'
        
        meta_tags = []
        
        # Basic meta tags
        meta_tags.append(f'<meta charset="UTF-8">')
        meta_tags.append(f'<meta name="viewport" content="width=device-width, initial-scale=1.0">')
        meta_tags.append(f'<title>{title}</title>')
        meta_tags.append(f'<meta name="description" content="{self._escape_html(description)}">')
        
        if keywords:
            keywords_str = ', '.join(keywords[:10])  # Limit to 10 keywords
            meta_tags.append(f'<meta name="keywords" content="{self._escape_html(keywords_str)}">')
        
        # Author and language
        meta_tags.append(f'<meta name="author" content="{self.site_config.get("author", "MoneyMatrix Team")}">')
        meta_tags.append(f'<meta name="language" content="{self.site_config.get("language", "en-US")}">')
        
        # Canonical URL
        if canonical_url:
            meta_tags.append(f'<link rel="canonical" href="{canonical_url}">')
        
        # Open Graph tags
        meta_tags.append(f'<meta property="og:type" content="{article_type}">')
        meta_tags.append(f'<meta property="og:url" content="{canonical_url or self.base_url}">')
        meta_tags.append(f'<meta property="og:title" content="{self._escape_html(title)}">')
        meta_tags.append(f'<meta property="og:description" content="{self._escape_html(description)}">')
        meta_tags.append(f'<meta property="og:image" content="{og_image}">')
        meta_tags.append(f'<meta property="og:site_name" content="{self.site_config.get("name", "MoneyMatrix.me")}">')
        
        # Twitter Card tags
        meta_tags.append(f'<meta name="twitter:card" content="summary_large_image">')
        meta_tags.append(f'<meta name="twitter:url" content="{canonical_url or self.base_url}">')
        meta_tags.append(f'<meta name="twitter:title" content="{self._escape_html(title)}">')
        meta_tags.append(f'<meta name="twitter:description" content="{self._escape_html(description)}">')
        meta_tags.append(f'<meta name="twitter:image" content="{og_image}">')
        
        # Additional SEO tags
        meta_tags.append('<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">')
        meta_tags.append('<meta name="googlebot" content="index, follow">')
        meta_tags.append('<meta name="bingbot" content="index, follow">')
        
        # Theme color for mobile browsers
        meta_tags.append('<meta name="theme-color" content="#0066cc">')
        
        return '\n    '.join(meta_tags)
    
    def generate_structured_data(self, page_data: Dict) -> str:
        """Generate JSON-LD structured data"""
        page_type = page_data.get('type', 'WebPage')
        
        if page_type == 'article':
            structured_data = self._generate_article_schema(page_data)
        elif page_type == 'category':
            structured_data = self._generate_category_schema(page_data)
        else:
            structured_data = self._generate_website_schema(page_data)
        
        return f'<script type="application/ld+json">\n{json.dumps(structured_data, indent=2)}\n</script>'
    
    def _generate_article_schema(self, page_data: Dict) -> Dict:
        """Generate Article schema"""
        return {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": page_data.get('title', ''),
            "description": page_data.get('description', ''),
            "image": page_data.get('og_image', f'{self.base_url}/og-image.jpg'),
            "author": {
                "@type": "Organization",
                "name": self.site_config.get("author", "MoneyMatrix Team"),
                "url": self.base_url
            },
            "publisher": {
                "@type": "Organization",
                "name": self.site_config.get("name", "MoneyMatrix.me"),
                "logo": {
                    "@type": "ImageObject",
                    "url": f"{self.base_url}/logo.png"
                }
            },
            "datePublished": page_data.get('date_published', datetime.now().isoformat()),
            "dateModified": page_data.get('date_modified', datetime.now().isoformat()),
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": page_data.get('canonical_url', self.base_url)
            },
            "articleSection": page_data.get('category', 'Finance'),
            "keywords": ', '.join(page_data.get('keywords', []))
        }
    
    def _generate_category_schema(self, page_data: Dict) -> Dict:
        """Generate Category/CollectionPage schema"""
        return {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": page_data.get('title', ''),
            "description": page_data.get('description', ''),
            "url": page_data.get('canonical_url', self.base_url),
            "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": page_data.get('article_count', 0)
            }
        }
    
    def _generate_website_schema(self, page_data: Dict) -> Dict:
        """Generate Website/Organization schema"""
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": self.site_config.get("name", "MoneyMatrix.me"),
            "url": self.base_url,
            "description": self.site_config.get("description", ""),
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": f"{self.base_url}/search?q={{search_term_string}}"
                },
                "query-input": "required name=search_term_string"
            }
        }
    
    def generate_breadcrumb_schema(self, breadcrumbs: List[Dict]) -> str:
        """Generate BreadcrumbList schema"""
        if not breadcrumbs:
            return ''
        
        breadcrumb_list = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": []
        }
        
        for idx, crumb in enumerate(breadcrumbs, 1):
            breadcrumb_list["itemListElement"].append({
                "@type": "ListItem",
                "position": idx,
                "name": crumb.get('name', ''),
                "item": crumb.get('url', '')
            })
        
        return f'<script type="application/ld+json">\n{json.dumps(breadcrumb_list, indent=2)}\n</script>'
    
    def generate_sitemap(self, output_path: str = 'dist/sitemap.xml') -> bool:
        """Generate XML sitemap with all pages"""
        try:
            categories = self.data_manager.get_categories()
            published_articles = self.data_manager.get_published_articles()
            
            urls = []
            
            # Homepage
            urls.append({
                'loc': self.base_url,
                'lastmod': datetime.now().strftime('%Y-%m-%d'),
                'changefreq': 'daily',
                'priority': '1.0'
            })
            
            # Category pages
            for category in categories:
                urls.append({
                    'loc': f"{self.base_url}/{category['slug']}",
                    'lastmod': datetime.now().strftime('%Y-%m-%d'),
                    'changefreq': 'weekly',
                    'priority': '0.8'
                })
                
                # Comparison pages
                if category.get('compare_url'):
                    urls.append({
                        'loc': category['compare_url'],
                        'lastmod': datetime.now().strftime('%Y-%m-%d'),
                        'changefreq': 'weekly',
                        'priority': '0.9'
                    })
            
            # Article pages
            for article in published_articles:
                article_url = article.get('url', '')
                if article_url:
                    urls.append({
                        'loc': article_url,
                        'lastmod': article.get('date_modified', article.get('date_published', datetime.now().isoformat()))[:10],
                        'changefreq': 'monthly',
                        'priority': '0.7'
                    })
            
            # Generate XML
            sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
            sitemap_xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            
            for url_data in urls:
                sitemap_xml += '  <url>\n'
                sitemap_xml += f'    <loc>{self._escape_xml(url_data["loc"])}</loc>\n'
                sitemap_xml += f'    <lastmod>{url_data["lastmod"]}</lastmod>\n'
                sitemap_xml += f'    <changefreq>{url_data["changefreq"]}</changefreq>\n'
                sitemap_xml += f'    <priority>{url_data["priority"]}</priority>\n'
                sitemap_xml += '  </url>\n'
            
            sitemap_xml += '</urlset>'
            
            # Save to file
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(sitemap_xml)
            
            logger.info(f"Generated sitemap with {len(urls)} URLs")
            return True
            
        except Exception as e:
            logger.error(f"Failed to generate sitemap: {e}")
            return False
    
    def generate_robots_txt(self, output_path: str = 'dist/robots.txt') -> bool:
        """Generate robots.txt file"""
        try:
            robots_content = []
            robots_content.append('User-agent: *')
            robots_content.append('Allow: /')
            robots_content.append('Disallow: /admin')
            robots_content.append('Disallow: /api/')
            robots_content.append('')
            robots_content.append(f'Sitemap: {self.base_url}/sitemap.xml')
            
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(robots_content))
            
            logger.info("Generated robots.txt")
            return True
            
        except Exception as e:
            logger.error(f"Failed to generate robots.txt: {e}")
            return False
    
    def _escape_html(self, text: str) -> str:
        """Escape HTML special characters"""
        return (text
                .replace('&', '&amp;')
                .replace('<', '&lt;')
                .replace('>', '&gt;')
                .replace('"', '&quot;')
                .replace("'", '&#39;'))
    
    def _escape_xml(self, text: str) -> str:
        """Escape XML special characters"""
        return (text
                .replace('&', '&amp;')
                .replace('<', '&lt;')
                .replace('>', '&gt;')
                .replace('"', '&quot;')
                .replace("'", '&apos;'))

