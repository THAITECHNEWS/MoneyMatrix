import json
import os
import re
import random
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from urllib.parse import quote, unquote
import requests
from pathlib import Path

class ConfigManager:
    """Manages configuration and API credentials"""
    
    def __init__(self, config_path: str = "config.json"):
        self.config_path = config_path
        self.config = self.load_config()
        self.credentials = self.load_credentials()
    
    def load_config(self) -> Dict:
        """Load main configuration"""
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return self.create_default_config()
    
    def load_credentials(self) -> Dict:
        """Load API credentials"""
        try:
            with open('data/api_credentials.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print("Warning: API credentials file not found")
            return {}
    
    def create_default_config(self) -> Dict:
        """Create default configuration"""
        default_config = {
            "site": {
                "name": "MoneyMatrix.me",
                "url": "https://moneymatrix.me",
                "description": "Compare financial products and make informed decisions"
            },
            "content": {
                "publish_interval_hours": 2,
                "articles_per_day": 12,
                "min_word_count": 800,
                "max_word_count": 1200,
                "images_per_article": 3
            },
            "features": {
                "auto_publish": True,
                "generate_images": True,
                "create_backlinks": True,
                "internal_linking": True,
                "seo_optimization": True
            },
            "ai": {
                "primary_model": "gpt-4o-mini",
                "backup_model": "gpt-3.5-turbo",
                "temperature": 0.7,
                "max_tokens": 2000
            }
        }
        
        with open(self.config_path, 'w') as f:
            json.dump(default_config, f, indent=2)
        
        return default_config
    
    def get(self, key: str, default=None):
        """Get configuration value with dot notation"""
        keys = key.split('.')
        value = self.config
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        
        return value
    
    def get_credential(self, key: str, default=None):
        """Get credential value with dot notation"""
        keys = key.split('.')
        value = self.credentials
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        
        return value

class DataManager:
    """Manages JSON data files"""
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.ensure_data_dir()
    
    def ensure_data_dir(self):
        """Ensure data directory exists"""
        os.makedirs(self.data_dir, exist_ok=True)
    
    def load_json(self, filename: str) -> Dict:
        """Load JSON file"""
        filepath = os.path.join(self.data_dir, filename)
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def save_json(self, filename: str, data: Dict):
        """Save JSON file"""
        filepath = os.path.join(self.data_dir, filename)
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
    
    def get_categories(self) -> List[Dict]:
        """Get all categories"""
        data = self.load_json('categories.json')
        return data.get('categories', [])
    
    def get_topics(self) -> List[Dict]:
        """Get all topics"""
        data = self.load_json('topics.json')
        return data.get('topics', [])
    
    def get_published_articles(self) -> List[Dict]:
        """Get published articles"""
        data = self.load_json('published_articles.json')
        return data.get('published_articles', [])
    
    def add_published_article(self, article_data: Dict):
        """Add article to published list"""
        data = self.load_json('published_articles.json')
        
        if 'published_articles' not in data:
            data['published_articles'] = []
        
        article_data['published_at'] = datetime.now().isoformat()
        data['published_articles'].append(article_data)
        data['total_published'] = len(data['published_articles'])
        data['last_published'] = article_data['published_at']
        
        self.save_json('published_articles.json', data)
    
    def get_external_blogs(self) -> List[Dict]:
        """Get external blog configurations"""
        data = self.load_json('external_blogs.json')
        return data.get('external_blogs', [])

class ContentUtils:
    """Utilities for content processing"""
    
    @staticmethod
    def generate_slug(title: str) -> str:
        """Generate URL-friendly slug from title"""
        slug = title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')
    
    @staticmethod
    def calculate_read_time(content: str) -> int:
        """Calculate estimated reading time in minutes"""
        word_count = len(content.split())
        return max(1, round(word_count / 200))  # Average 200 words per minute
    
    @staticmethod
    def extract_keywords(content: str, max_keywords: int = 10) -> List[str]:
        """Extract keywords from content"""
        # Simple keyword extraction - can be enhanced with NLP
        words = re.findall(r'\b[a-zA-Z]{4,}\b', content.lower())
        word_freq = {}
        
        # Common stop words to exclude
        stop_words = {'that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'}
        
        for word in words:
            if word not in stop_words and len(word) > 3:
                word_freq[word] = word_freq.get(word, 0) + 1
        
        # Return most frequent words
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, freq in sorted_words[:max_keywords]]
    
    @staticmethod
    def clean_html(html_content: str) -> str:
        """Clean HTML content for processing"""
        # Remove HTML tags for text processing
        clean_text = re.sub(r'<[^>]+>', '', html_content)
        clean_text = re.sub(r'\s+', ' ', clean_text)
        return clean_text.strip()
    
    @staticmethod
    def generate_meta_description(content: str, max_length: int = 155) -> str:
        """Generate meta description from content"""
        clean_content = ContentUtils.clean_html(content)
        sentences = clean_content.split('.')
        
        description = ""
        for sentence in sentences:
            sentence = sentence.strip()
            if len(description + sentence) < max_length - 3:
                description += sentence + ". "
            else:
                break
        
        return description.strip()
    
    @staticmethod
    def format_currency(amount: float) -> str:
        """Format currency amounts"""
        if amount >= 1000000:
            return f"${amount/1000000:.1f}M"
        elif amount >= 1000:
            return f"${amount/1000:.0f}K"
        else:
            return f"${amount:.2f}"

class SEOUtils:
    """SEO optimization utilities"""
    
    @staticmethod
    def optimize_title(title: str, max_length: int = 60) -> str:
        """Optimize title for SEO"""
        if len(title) <= max_length:
            return title
        
        # Try to truncate at word boundary
        truncated = title[:max_length].rsplit(' ', 1)[0]
        return truncated + "..."
    
    @staticmethod
    def generate_structured_data(article_data: Dict) -> Dict:
        """Generate structured data for article"""
        return {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article_data.get('title', ''),
            "description": article_data.get('meta_description', ''),
            "author": {
                "@type": "Organization",
                "name": "MoneyMatrix.me"
            },
            "publisher": {
                "@type": "Organization",
                "name": "MoneyMatrix.me",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://moneymatrix.me/logo.png"
                }
            },
            "datePublished": article_data.get('date_published', ''),
            "dateModified": article_data.get('date_modified', ''),
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": article_data.get('url', '')
            }
        }
    
    @staticmethod
    def generate_canonical_url(slug: str, category_slug: str) -> str:
        """Generate canonical URL"""
        return f"https://moneymatrix.me/{category_slug}/{slug}"

class PromptManager:
    """Manages AI prompt templates"""
    
    def __init__(self, prompts_dir: str = "advanced_prompts"):
        self.prompts_dir = prompts_dir
        self.templates = self.load_templates()
    
    def load_templates(self) -> Dict[str, str]:
        """Load prompt templates"""
        templates = {}
        
        for template_file in ['prompt_A.md', 'prompt_B.md', 'prompt_C.md']:
            filepath = os.path.join(self.prompts_dir, template_file)
            try:
                with open(filepath, 'r') as f:
                    template_name = template_file.replace('.md', '').replace('prompt_', '')
                    templates[template_name] = f.read()
            except FileNotFoundError:
                print(f"Warning: Template {template_file} not found")
        
        return templates
    
    def get_random_template(self) -> str:
        """Get random prompt template"""
        if not self.templates:
            return "Write a comprehensive article about {topic} in the {category} category."
        
        return random.choice(list(self.templates.values()))
    
    def format_prompt(self, template: str, **kwargs) -> str:
        """Format prompt template with variables"""
        return template.format(**kwargs)

class ScheduleManager:
    """Manages publishing schedule"""
    
    def __init__(self, data_manager: DataManager):
        self.data_manager = data_manager
    
    def get_next_publish_time(self, interval_hours: int = 2) -> datetime:
        """Get next scheduled publish time"""
        published_data = self.data_manager.load_json('published_articles.json')
        last_published = published_data.get('last_published')
        
        if last_published:
            last_time = datetime.fromisoformat(last_published.replace('Z', '+00:00'))
            next_time = last_time + timedelta(hours=interval_hours)
        else:
            next_time = datetime.now()
        
        return next_time
    
    def should_publish_now(self, interval_hours: int = 2) -> bool:
        """Check if it's time to publish"""
        next_time = self.get_next_publish_time(interval_hours)
        return datetime.now() >= next_time
    
    def get_publishing_queue(self) -> List[Dict]:
        """Get articles in publishing queue"""
        published_data = self.data_manager.load_json('published_articles.json')
        return published_data.get('publishing_schedule', {}).get('queue', [])
    
    def add_to_queue(self, article_data: Dict):
        """Add article to publishing queue"""
        published_data = self.data_manager.load_json('published_articles.json')
        
        if 'publishing_schedule' not in published_data:
            published_data['publishing_schedule'] = {'queue': []}
        
        published_data['publishing_schedule']['queue'].append(article_data)
        self.data_manager.save_json('published_articles.json', published_data)

class LinkingUtils:
    """Utilities for internal linking"""
    
    @staticmethod
    def find_related_articles(current_category: str, current_topic: str, published_articles: List[Dict], limit: int = 3) -> List[Dict]:
        """Find related articles for linking"""
        related = []
        
        # First, find articles in same category
        same_category = [
            article for article in published_articles 
            if article.get('category_slug') == current_category and article.get('title') != current_topic
        ]
        
        # Then, find articles in related categories (financial topics)
        related_categories = []
        for article in published_articles:
            if article.get('category_slug') != current_category:
                related_categories.append(article)
        
        # Combine and limit results
        related = same_category[:limit//2] + related_categories[:limit//2]
        
        return related[:limit]
    
    @staticmethod
    def generate_anchor_text(title: str, max_length: int = 50) -> str:
        """Generate natural anchor text"""
        if len(title) <= max_length:
            return title
        
        # Try to truncate at word boundary
        truncated = title[:max_length].rsplit(' ', 1)[0]
        return truncated + "..."

def setup_logging():
    """Setup logging configuration"""
    import logging
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('moneymatrix.log'),
            logging.StreamHandler()
        ]
    )
    
    return logging.getLogger(__name__)

def validate_environment():
    """Validate required environment and files"""
    required_dirs = ['data', 'advanced_prompts', 'scripts', 'templates', 'static', 'dist']
    required_files = [
        'data/categories.json',
        'data/topics.json', 
        'data/api_credentials.json',
        'config.json'
    ]
    
    errors = []
    
    # Check directories
    for dir_path in required_dirs:
        if not os.path.exists(dir_path):
            errors.append(f"Missing directory: {dir_path}")
    
    # Check files
    for file_path in required_files:
        if not os.path.exists(file_path):
            errors.append(f"Missing file: {file_path}")
    
    if errors:
        print("Environment validation errors:")
        for error in errors:
            print(f"  - {error}")
        return False
    
    return True

# Initialize global instances
logger = setup_logging()
config_manager = ConfigManager()
data_manager = DataManager()
prompt_manager = PromptManager()
schedule_manager = ScheduleManager(data_manager)