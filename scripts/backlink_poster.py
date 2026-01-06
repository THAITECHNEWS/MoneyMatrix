import requests
import json
import time
import random
from datetime import datetime
from typing import Dict, List, Optional
from utils import ConfigManager, DataManager, logger
from content_generator import BacklinkContentGenerator, ContentGenerator

class MediumClient:
    """Client for Medium API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.medium.com/v1"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    def get_user_info(self) -> Optional[Dict]:
        """Get authenticated user information"""
        url = f"{self.base_url}/me"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            data = response.json()
            return data.get('data')
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Medium API error: {e}")
            return None
    
    def create_post(self, user_id: str, title: str, content: str, tags: List[str] = None, publish_status: str = "draft") -> Optional[Dict]:
        """Create a new Medium post"""
        url = f"{self.base_url}/users/{user_id}/posts"
        
        payload = {
            "title": title,
            "contentFormat": "markdown",
            "content": content,
            "publishStatus": publish_status
        }
        
        if tags:
            payload["tags"] = tags[:5]  # Medium allows max 5 tags
        
        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            data = response.json()
            return data.get('data')
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create Medium post: {e}")
            return None

class DevToClient:
    """Client for Dev.to API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://dev.to/api"
        self.headers = {
            "api-key": api_key,
            "Content-Type": "application/json"
        }
    
    def create_article(self, title: str, content: str, tags: List[str] = None, published: bool = False) -> Optional[Dict]:
        """Create a new Dev.to article"""
        url = f"{self.base_url}/articles"
        
        payload = {
            "article": {
                "title": title,
                "body_markdown": content,
                "published": published
            }
        }
        
        if tags:
            payload["article"]["tags"] = tags[:4]  # Dev.to allows max 4 tags
        
        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create Dev.to article: {e}")
            return None

class BloggerClient:
    """Client for Blogger API"""
    
    def __init__(self, api_key: str, blog_id: str):
        self.api_key = api_key
        self.blog_id = blog_id
        self.base_url = "https://www.googleapis.com/blogger/v3"
    
    def create_post(self, title: str, content: str, labels: List[str] = None, is_draft: bool = True) -> Optional[Dict]:
        """Create a new Blogger post"""
        url = f"{self.base_url}/blogs/{self.blog_id}/posts"
        params = {"key": self.api_key}
        
        payload = {
            "title": title,
            "content": content
        }
        
        if labels:
            payload["labels"] = labels[:10]  # Blogger allows many labels
        
        if is_draft:
            payload["status"] = "DRAFT"
        else:
            payload["status"] = "LIVE"
        
        try:
            response = requests.post(url, params=params, json=payload)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create Blogger post: {e}")
            return None

class BacklinkPoster:
    """Main backlink posting system"""
    
    def __init__(self):
        self.config_manager = ConfigManager()
        self.data_manager = DataManager()
        
        # Initialize clients
        self.medium_client = None
        self.devto_client = None
        self.blogger_client = None
        
        self.setup_clients()
        
        # Load external blog configurations
        self.external_blogs = self.data_manager.get_external_blogs()
        
        # Load posted backlinks tracking
        self.posted_backlinks = self.load_posted_backlinks()
    
    def setup_clients(self):
        """Setup API clients for external platforms"""
        # Medium
        medium_key = self.config_manager.get_credential('external_blogs.medium.api_key')
        if medium_key and medium_key != "YOUR_MEDIUM_API_KEY":
            self.medium_client = MediumClient(medium_key)
        
        # Dev.to
        devto_key = self.config_manager.get_credential('external_blogs.dev_to.api_key')
        if devto_key and devto_key != "YOUR_DEV_TO_API_KEY":
            self.devto_client = DevToClient(devto_key)
        
        # Blogger
        blogger_key = self.config_manager.get_credential('external_blogs.blogger.api_key')
        blogger_blog_id = self.config_manager.get_credential('external_blogs.blogger.blog_id')
        if blogger_key and blogger_blog_id and blogger_key != "YOUR_BLOGGER_API_KEY":
            self.blogger_client = BloggerClient(blogger_key, blogger_blog_id)
    
    def load_posted_backlinks(self) -> Dict:
        """Load posted backlinks tracking"""
        try:
            with open('data/posted_backlinks.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def save_posted_backlinks(self):
        """Save posted backlinks tracking"""
        with open('data/posted_backlinks.json', 'w') as f:
            json.dump(self.posted_backlinks, f, indent=2)
    
    def get_articles_needing_backlinks(self) -> List[Dict]:
        """Get articles that need backlink posts"""
        published_articles = self.data_manager.get_published_articles()
        
        # Filter articles that don't have backlinks yet
        articles_needing_backlinks = []
        
        for article in published_articles:
            article_slug = article.get('slug', '')
            if article_slug not in self.posted_backlinks:
                articles_needing_backlinks.append(article)
        
        return articles_needing_backlinks
    
    def select_target_platform(self) -> Optional[str]:
        """Select target platform for posting based on availability and rotation"""
        available_platforms = []
        
        if self.medium_client:
            available_platforms.append('medium')
        if self.devto_client:
            available_platforms.append('dev_to')
        if self.blogger_client:
            available_platforms.append('blogger')
        
        if not available_platforms:
            logger.warning("No external platforms configured")
            return None
        
        # Simple rotation - select platform with fewest recent posts
        platform_counts = {}
        for platform in available_platforms:
            platform_counts[platform] = sum(
                1 for backlinks in self.posted_backlinks.values()
                if any(post.get('platform') == platform for post in backlinks.get('posts', []))
            )
        
        # Select platform with minimum posts
        selected_platform = min(platform_counts, key=platform_counts.get)
        return selected_platform
    
    def generate_backlink_content(self, article_data: Dict, platform: str) -> Dict:
        """Generate backlink content for specific platform"""
        content_generator = ContentGenerator()
        backlink_generator = BacklinkContentGenerator(content_generator)
        
        # Generate base backlink content
        backlink_data = backlink_generator.generate_backlink_article(article_data)
        
        # Customize for platform
        if platform == 'medium':
            content = self.format_for_medium(backlink_data, article_data)
        elif platform == 'dev_to':
            content = self.format_for_devto(backlink_data, article_data)
        elif platform == 'blogger':
            content = self.format_for_blogger(backlink_data, article_data)
        else:
            content = backlink_data['content']
        
        backlink_data['formatted_content'] = content
        backlink_data['platform'] = platform
        
        return backlink_data
    
    def format_for_medium(self, backlink_data: Dict, article_data: Dict) -> str:
        """Format content for Medium (Markdown)"""
        content = backlink_data['content']
        
        # Add Medium-specific formatting
        formatted_content = f"""# {backlink_data['title']}

{content}

---

*For the complete guide with detailed analysis and comparison tables, read the full article: [{article_data['title']}]({article_data['url']})*

*Originally published on [MoneyMatrix.me]({article_data['url']}) - Your trusted source for financial product comparisons.*
"""
        
        return formatted_content
    
    def format_for_devto(self, backlink_data: Dict, article_data: Dict) -> str:
        """Format content for Dev.to (Markdown)"""
        content = backlink_data['content']
        
        # Add Dev.to specific formatting
        formatted_content = f"""# {backlink_data['title']}

{content}

## 🔗 Read the Complete Guide

For in-depth analysis, comparison tables, and actionable tips, check out the full article:

**[{article_data['title']}]({article_data['url']})**

---

*This article was originally published on [MoneyMatrix.me]({article_data['url']}) where we help you compare financial products and make informed decisions.*

#finance #money #personalfinance #fintech
"""
        
        return formatted_content
    
    def format_for_blogger(self, backlink_data: Dict, article_data: Dict) -> str:
        """Format content for Blogger (HTML)"""
        content = backlink_data['content']
        
        # Convert to HTML format
        html_content = content.replace('\n\n', '</p><p>').replace('\n', '<br>')
        
        formatted_content = f"""<h2>{backlink_data['title']}</h2>

<p>{html_content}</p>

<hr>

<p><strong>Read the Complete Guide:</strong></p>
<p>For detailed analysis and comprehensive comparison tables, visit the full article: 
<a href="{article_data['url']}" target="_blank">{article_data['title']}</a></p>

<p><em>Originally published on <a href="{article_data['url']}" target="_blank">MoneyMatrix.me</a> - 
Compare financial products and make smart money decisions.</em></p>
"""
        
        return formatted_content
    
    def post_to_medium(self, backlink_data: Dict) -> Optional[Dict]:
        """Post backlink article to Medium"""
        if not self.medium_client:
            logger.error("Medium client not configured")
            return None
        
        # Get user info
        user_info = self.medium_client.get_user_info()
        if not user_info:
            logger.error("Failed to get Medium user info")
            return None
        
        user_id = user_info['id']
        
        # Create post
        tags = ['finance', 'money', 'personal-finance', 'fintech', 'loans']
        
        result = self.medium_client.create_post(
            user_id=user_id,
            title=backlink_data['title'],
            content=backlink_data['formatted_content'],
            tags=tags,
            publish_status="draft"  # Start as draft
        )
        
        return result
    
    def post_to_devto(self, backlink_data: Dict) -> Optional[Dict]:
        """Post backlink article to Dev.to"""
        if not self.devto_client:
            logger.error("Dev.to client not configured")
            return None
        
        tags = ['finance', 'money', 'personalfinance', 'fintech']
        
        result = self.devto_client.create_article(
            title=backlink_data['title'],
            content=backlink_data['formatted_content'],
            tags=tags,
            published=False  # Start as draft
        )
        
        return result
    
    def post_to_blogger(self, backlink_data: Dict) -> Optional[Dict]:
        """Post backlink article to Blogger"""
        if not self.blogger_client:
            logger.error("Blogger client not configured")
            return None
        
        labels = ['Finance', 'Money', 'Personal Finance', 'Loans', 'Credit Cards']
        
        result = self.blogger_client.create_post(
            title=backlink_data['title'],
            content=backlink_data['formatted_content'],
            labels=labels,
            is_draft=True  # Start as draft
        )
        
        return result
    
    def create_backlink_post(self, article_data: Dict) -> bool:
        """Create and post a backlink article"""
        # Check if backlinks are enabled
        if not self.config_manager.get('features.create_backlinks', True):
            logger.info("Backlink creation disabled in config")
            return False
        
        # Select target platform
        platform = self.select_target_platform()
        if not platform:
            logger.warning("No available platforms for backlink posting")
            return False
        
        try:
            # Generate backlink content
            backlink_data = self.generate_backlink_content(article_data, platform)
            
            # Post to selected platform
            if platform == 'medium':
                result = self.post_to_medium(backlink_data)
            elif platform == 'dev_to':
                result = self.post_to_devto(backlink_data)
            elif platform == 'blogger':
                result = self.post_to_blogger(backlink_data)
            else:
                logger.error(f"Unknown platform: {platform}")
                return False
            
            if result:
                # Track the posted backlink
                article_slug = article_data.get('slug', '')
                
                if article_slug not in self.posted_backlinks:
                    self.posted_backlinks[article_slug] = {'posts': []}
                
                post_record = {
                    'platform': platform,
                    'post_id': result.get('id') or result.get('url'),
                    'title': backlink_data['title'],
                    'posted_at': datetime.now().isoformat(),
                    'target_url': article_data['url'],
                    'status': 'draft'
                }
                
                self.posted_backlinks[article_slug]['posts'].append(post_record)
                self.save_posted_backlinks()
                
                logger.info(f"Successfully posted backlink to {platform} for: {article_data['title']}")
                return True
            else:
                logger.error(f"Failed to post to {platform}")
                return False
                
        except Exception as e:
            logger.error(f"Error creating backlink post: {e}")
            return False
    
    def process_backlink_queue(self, max_posts: int = 3) -> int:
        """Process queue of articles needing backlinks"""
        articles_needing_backlinks = self.get_articles_needing_backlinks()
        
        if not articles_needing_backlinks:
            logger.info("No articles need backlinks")
            return 0
        
        # Limit the number of posts per run
        articles_to_process = articles_needing_backlinks[:max_posts]
        successful_posts = 0
        
        for article in articles_to_process:
            logger.info(f"Creating backlink for: {article['title']}")
            
            if self.create_backlink_post(article):
                successful_posts += 1
                
                # Add delay between posts to avoid rate limiting
                time.sleep(random.uniform(30, 60))  # 30-60 second delay
            else:
                logger.warning(f"Failed to create backlink for: {article['title']}")
        
        logger.info(f"Created {successful_posts} backlink posts")
        return successful_posts
    
    def get_backlink_stats(self) -> Dict:
        """Get statistics about posted backlinks"""
        stats = {
            'total_articles_with_backlinks': len(self.posted_backlinks),
            'total_backlink_posts': 0,
            'platform_breakdown': {},
            'recent_posts': []
        }
        
        for article_slug, data in self.posted_backlinks.items():
            posts = data.get('posts', [])
            stats['total_backlink_posts'] += len(posts)
            
            for post in posts:
                platform = post.get('platform', 'unknown')
                stats['platform_breakdown'][platform] = stats['platform_breakdown'].get(platform, 0) + 1
                
                # Add to recent posts
                stats['recent_posts'].append({
                    'article_slug': article_slug,
                    'platform': platform,
                    'posted_at': post.get('posted_at'),
                    'title': post.get('title')
                })
        
        # Sort recent posts by date
        stats['recent_posts'].sort(key=lambda x: x.get('posted_at', ''), reverse=True)
        stats['recent_posts'] = stats['recent_posts'][:10]  # Keep last 10
        
        return stats

def simulate_backlink_posting():
    """Simulate backlink posting for testing (when APIs not available)"""
    data_manager = DataManager()
    published_articles = data_manager.get_published_articles()
    
    if not published_articles:
        logger.info("No published articles to create backlinks for")
        return
    
    # Simulate posting for latest articles
    recent_articles = published_articles[-3:]  # Last 3 articles
    
    simulated_backlinks = {}
    
    for article in recent_articles:
        article_slug = article.get('slug', '')
        
        # Simulate posts to different platforms
        platforms = ['medium', 'dev_to', 'blogger']
        platform = random.choice(platforms)
        
        simulated_backlinks[article_slug] = {
            'posts': [{
                'platform': platform,
                'post_id': f'simulated_{article_slug}_{platform}',
                'title': f"Quick Guide: {article['title']}",
                'posted_at': datetime.now().isoformat(),
                'target_url': article['url'],
                'status': 'published'
            }]
        }
    
    # Save simulated data
    with open('data/posted_backlinks.json', 'w') as f:
        json.dump(simulated_backlinks, f, indent=2)
    
    logger.info(f"Simulated {len(simulated_backlinks)} backlink posts")

if __name__ == "__main__":
    # Test backlink posting
    try:
        poster = BacklinkPoster()
        
        # Check if any clients are configured
        has_clients = any([poster.medium_client, poster.devto_client, poster.blogger_client])
        
        if has_clients:
            # Process actual backlinks
            poster.process_backlink_queue(max_posts=2)
            
            # Show stats
            stats = poster.get_backlink_stats()
            print(f"Backlink Stats: {stats}")
        else:
            # Simulate for testing
            logger.info("No API clients configured, running simulation")
            simulate_backlink_posting()
            
    except Exception as e:
        logger.error(f"Error in backlink posting: {e}")