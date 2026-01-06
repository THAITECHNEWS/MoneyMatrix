import requests
import json
import random
import time
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from utils import (
    DataManager, ConfigManager, PromptManager, ContentUtils, 
    SEOUtils, LinkingUtils, logger
)

class OpenAIClient:
    """Client for OpenAI API"""
    
    def __init__(self, api_key: str, base_url: str = "https://api.openai.com/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def generate_content(self, prompt: str, model: str = "gpt-4o-mini", max_tokens: int = 2000, temperature: float = 0.7) -> str:
        """Generate content using OpenAI API"""
        url = f"{self.base_url}/chat/completions"
        
        payload = {
            "model": model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": max_tokens,
            "temperature": temperature,
            "stream": False
        }
        
        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            data = response.json()
            return data['choices'][0]['message']['content']
            
        except requests.exceptions.RequestException as e:
            logger.error(f"OpenAI API error: {e}")
            raise
        except KeyError as e:
            logger.error(f"Unexpected API response format: {e}")
            raise

class ContentGenerator:
    """Main content generation system"""
    
    def __init__(self):
        self.config_manager = ConfigManager()
        self.data_manager = DataManager()
        self.prompt_manager = PromptManager()
        
        # Initialize AI client - try OpenAI API key from environment or credentials
        import os
        api_key = os.getenv('OPENAI_API_KEY') or self.config_manager.get_credential('openai.api_key')
        base_url = self.config_manager.get_credential('openai.base_url', 'https://api.openai.com/v1')
        
        if not api_key:
            raise ValueError("OpenAI API key not found. Set OPENAI_API_KEY environment variable or add to data/api_credentials.json")
        
        self.ai_client = OpenAIClient(api_key, base_url)
        
        # Load data
        self.categories = self.data_manager.get_categories()
        self.topics = self.data_manager.get_topics()
        self.published_articles = self.data_manager.get_published_articles()
    
    def select_next_topic(self) -> Optional[Tuple[Dict, str]]:
        """Select next topic to write about"""
        published_titles = {article['title'] for article in self.published_articles}
        
        # Find unpublished topics
        for topic_group in self.topics:
            category_id = topic_group['category_id']
            category = self.get_category_by_id(category_id)
            
            if not category:
                continue
            
            for topic in topic_group['topics']:
                if topic not in published_titles:
                    return category, topic
        
        # If all topics are published, start over with variations
        logger.info("All topics published, generating variations...")
        return self.generate_topic_variation()
    
    def generate_topic_variation(self) -> Optional[Tuple[Dict, str]]:
        """Generate a variation of an existing topic"""
        if not self.categories:
            return None
        
        category = random.choice(self.categories)
        
        # Generate a new topic variation
        variation_prompts = [
            f"Generate a fresh article topic about {category['name'].lower()} for 2025",
            f"What's a trending {category['name'].lower()} topic people should know about?",
            f"Create an informative article title about {category['name'].lower()} tips"
        ]
        
        prompt = random.choice(variation_prompts)
        
        try:
            model = self.config_manager.get('ai.primary_model', 'gpt-4o-mini')
            new_topic = self.ai_client.generate_content(
                prompt,
                model=model,
                max_tokens=100,
                temperature=0.8
            ).strip()
            
            # Clean up the response
            if new_topic.startswith('"') and new_topic.endswith('"'):
                new_topic = new_topic[1:-1]
            
            return category, new_topic
            
        except Exception as e:
            logger.error(f"Failed to generate topic variation: {e}")
            return None
    
    def generate_article_content(self, category: Dict, topic: str) -> Dict:
        """Generate complete article content"""
        logger.info(f"Generating article: {topic}")
        
        # Select random prompt template
        template = self.prompt_manager.get_random_template()
        
        # Get category info for internal linking
        money_page_url = random.choice([category.get('compare_url', ''), category.get('best_url', '')])
        related_article_url = self.get_related_article_url(category['slug'])
        
        # Format the prompt
        formatted_prompt = self.prompt_manager.format_prompt(
            template,
            topic=topic,
            category=category['name'],
            money_page_url=money_page_url,
            related_article_url=related_article_url
        )
        
        try:
            # Generate main content
            model = self.config_manager.get('ai.primary_model', 'gpt-4o-mini')
            content = self.ai_client.generate_content(
                formatted_prompt,
                model=model,
                max_tokens=self.config_manager.get('ai.max_tokens', 2000),
                temperature=self.config_manager.get('ai.temperature', 0.7)
            )
            
            # Process the content
            processed_content = self.process_generated_content(content)
            
            # Generate additional metadata
            article_data = self.create_article_metadata(category, topic, processed_content)
            
            return article_data
            
        except Exception as e:
            logger.error(f"Failed to generate article content: {e}")
            raise
    
    def process_generated_content(self, raw_content: str) -> str:
        """Process and enhance generated content"""
        # Clean up content
        content = raw_content.strip()
        
        # Ensure proper HTML structure if not already present
        if not content.startswith('<article>'):
            content = f"<article>\n{content}\n</article>"
        
        # Add image placeholders if not present
        if '[IMAGE:' not in content:
            content = self.add_image_placeholders(content)
        
        # Enhance internal linking
        content = self.enhance_internal_linking(content)
        
        return content
    
    def add_image_placeholders(self, content: str) -> str:
        """Add image placeholders to content"""
        # Find good spots to insert images (after sections)
        sections = content.split('<h2>')
        
        if len(sections) < 2:
            return content
        
        enhanced_content = sections[0]
        
        for i, section in enumerate(sections[1:], 1):
            # Add section back
            enhanced_content += '<h2>' + section
            
            # Add image placeholder after every 2-3 sections
            if i % 2 == 0 and i <= 6:  # Max 3 images
                image_name = f"financial-guide-{i}.jpg"
                image_placeholder = f'\n[IMAGE: {image_name}]\n'
                
                # Insert after the first paragraph of the section
                paragraphs = section.split('</p>')
                if len(paragraphs) > 1:
                    paragraphs[0] += '</p>' + image_placeholder
                    enhanced_content = enhanced_content.replace(
                        '<h2>' + section,
                        '<h2>' + '</p>'.join(paragraphs)
                    )
        
        return enhanced_content
    
    def enhance_internal_linking(self, content: str) -> str:
        """Enhance internal linking in content"""
        # This is a simplified version - can be enhanced with NLP
        
        # Find opportunities to add links
        published_articles = self.data_manager.get_published_articles()
        
        if not published_articles:
            return content
        
        # Look for keywords that match article titles
        for article in published_articles[-10:]:  # Last 10 articles
            article_title = article.get('title', '')
            article_url = article.get('url', '')
            
            if not article_title or not article_url:
                continue
            
            # Extract key phrase from title
            key_phrases = article_title.lower().split()[:3]  # First 3 words
            key_phrase = ' '.join(key_phrases)
            
            # Look for this phrase in content (case insensitive)
            if key_phrase in content.lower() and article_url not in content:
                # Replace first occurrence with link
                content = content.replace(
                    key_phrase,
                    f'<a href="{article_url}">{key_phrase}</a>',
                    1
                )
                break  # Only add one additional link
        
        return content
    
    def create_article_metadata(self, category: Dict, topic: str, content: str) -> Dict:
        """Create complete article metadata"""
        # Generate slug
        slug = ContentUtils.generate_slug(topic)
        
        # Calculate reading time
        read_time = ContentUtils.calculate_read_time(content)
        
        # Extract keywords
        keywords = ContentUtils.extract_keywords(content)
        
        # Generate meta description
        meta_description = ContentUtils.generate_meta_description(content)
        
        # Get related articles
        related_articles = LinkingUtils.find_related_articles(
            category['slug'], 
            topic, 
            self.published_articles
        )
        
        # Generate URLs
        canonical_url = SEOUtils.generate_canonical_url(slug, category['slug'])
        
        # Create complete article data
        now = datetime.now()
        
        article_data = {
            'title': topic,
            'slug': slug,
            'content': content,
            'category_id': category['id'],
            'category_slug': category['slug'],
            'category_name': category['name'],
            'meta_description': meta_description,
            'keywords': keywords,
            'tags': self.generate_tags(category, keywords),
            'url': canonical_url,
            'read_time': read_time,
            'date_published': now.isoformat(),
            'date_modified': now.isoformat(),
            'date_published_formatted': now.strftime("%B %d, %Y"),
            'date_modified_formatted': now.strftime("%B %d, %Y"),
            'related_articles': related_articles,
            'excerpt': self.generate_excerpt(content),
            'word_count': len(ContentUtils.clean_html(content).split()),
            'images': self.extract_image_placeholders(content),
            'structured_data': SEOUtils.generate_structured_data({
                'title': topic,
                'meta_description': meta_description,
                'url': canonical_url,
                'date_published': now.isoformat(),
                'date_modified': now.isoformat()
            })
        }
        
        return article_data
    
    def generate_tags(self, category: Dict, keywords: List[str]) -> List[str]:
        """Generate article tags"""
        tags = [category['name']]
        
        # Add relevant keywords as tags
        relevant_keywords = [kw for kw in keywords if len(kw) > 4][:5]
        tags.extend(relevant_keywords)
        
        # Add common financial tags based on category
        financial_tags = {
            'credit-cards': ['Credit', 'APR', 'Rewards', 'Balance Transfer'],
            'personal-loans': ['Loans', 'Interest Rate', 'Debt Consolidation'],
            'auto-loans': ['Auto Financing', 'Car Loans', 'Vehicle'],
            'mortgages': ['Home Loans', 'Real Estate', 'Property'],
            'credit-score': ['Credit Report', 'FICO', 'Credit History']
        }
        
        category_slug = category.get('slug', '')
        if category_slug in financial_tags:
            tags.extend(financial_tags[category_slug][:2])
        
        return list(set(tags))  # Remove duplicates
    
    def generate_excerpt(self, content: str, max_length: int = 200) -> str:
        """Generate article excerpt"""
        clean_content = ContentUtils.clean_html(content)
        
        # Get first few sentences
        sentences = clean_content.split('.')
        excerpt = ""
        
        for sentence in sentences:
            sentence = sentence.strip()
            if len(excerpt + sentence) < max_length - 3:
                excerpt += sentence + ". "
            else:
                break
        
        return excerpt.strip()
    
    def extract_image_placeholders(self, content: str) -> List[str]:
        """Extract image placeholders from content"""
        import re
        
        image_pattern = r'\[IMAGE:\s*([^\]]+)\]'
        matches = re.findall(image_pattern, content)
        
        return [match.strip() for match in matches]
    
    def get_category_by_id(self, category_id: int) -> Optional[Dict]:
        """Get category by ID"""
        for category in self.categories:
            if category['id'] == category_id:
                return category
        return None
    
    def get_related_article_url(self, category_slug: str) -> str:
        """Get a related article URL for internal linking"""
        # Find articles in same category
        same_category_articles = [
            article for article in self.published_articles
            if article.get('category_slug') == category_slug
        ]
        
        if same_category_articles:
            return random.choice(same_category_articles)['url']
        
        # Fallback to any published article
        if self.published_articles:
            return random.choice(self.published_articles)['url']
        
        # Fallback to category page
        return f"https://moneymatrix.me/{category_slug}"
    
    def generate_and_save_article(self) -> Optional[Dict]:
        """Generate a new article and save it"""
        # Select topic
        topic_data = self.select_next_topic()
        
        if not topic_data:
            logger.warning("No topics available for generation")
            return None
        
        category, topic = topic_data
        
        try:
            # Generate article
            article_data = self.generate_article_content(category, topic)
            
            # Save to published articles
            self.data_manager.add_published_article(article_data)
            
            logger.info(f"Successfully generated and saved article: {topic}")
            return article_data
            
        except Exception as e:
            logger.error(f"Failed to generate article '{topic}': {e}")
            return None
    
    def generate_multiple_articles(self, count: int = 1) -> List[Dict]:
        """Generate multiple articles"""
        articles = []
        
        for i in range(count):
            logger.info(f"Generating article {i+1}/{count}")
            
            article = self.generate_and_save_article()
            if article:
                articles.append(article)
                
                # Add delay between generations
                if i < count - 1:
                    time.sleep(2)
            else:
                logger.warning(f"Failed to generate article {i+1}")
        
        return articles

class BacklinkContentGenerator:
    """Generate backlink articles for external platforms"""
    
    def __init__(self, content_generator: ContentGenerator):
        self.content_generator = content_generator
        self.ai_client = content_generator.ai_client
        self.config_manager = content_generator.config_manager
    
    def generate_backlink_article(self, main_article: Dict) -> Dict:
        """Generate a backlink article pointing to main article"""
        
        backlink_prompt = f"""
Write a 300-word informative article about {main_article['title']} that provides value to readers.

Requirements:
- Make it engaging and informative
- Include 1 natural link to the full article: {main_article['url']}
- Use a slightly different angle than the main article
- Keep it conversational and helpful
- Include actionable tips
- Don't make it overly promotional

The article should stand alone as valuable content while encouraging readers to learn more from the detailed guide.
"""
        
        try:
            model = self.config_manager.get('ai.primary_model', 'gpt-4o-mini')
            content = self.ai_client.generate_content(
                backlink_prompt,
                model=model,
                max_tokens=800,
                temperature=0.8
            )
            
            # Create backlink article metadata
            backlink_data = {
                'title': f"Quick Guide: {main_article['title']}",
                'content': content,
                'target_url': main_article['url'],
                'category': main_article['category_name'],
                'generated_at': datetime.now().isoformat(),
                'word_count': len(content.split()),
                'main_article_id': main_article.get('slug', '')
            }
            
            return backlink_data
            
        except Exception as e:
            logger.error(f"Failed to generate backlink article: {e}")
            raise

if __name__ == "__main__":
    # Test content generation
    try:
        generator = ContentGenerator()
        article = generator.generate_and_save_article()
        
        if article:
            print("Successfully generated article:")
            print(f"Title: {article['title']}")
            print(f"Category: {article['category_name']}")
            print(f"Word count: {article['word_count']}")
            print(f"URL: {article['url']}")
        else:
            print("Failed to generate article")
            
    except Exception as e:
        print(f"Error: {e}")