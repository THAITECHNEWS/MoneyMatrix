import requests
import os
import json
import time
import hashlib
from typing import Dict, List, Optional, Tuple
from urllib.parse import urlparse, quote
from utils import ConfigManager, DataManager, logger

class UnsplashClient:
    """Client for Unsplash API"""
    
    def __init__(self, access_key: str):
        self.access_key = access_key
        self.base_url = "https://api.unsplash.com"
        self.headers = {
            "Authorization": f"Client-ID {access_key}"
        }
    
    def search_photos(self, query: str, per_page: int = 10, orientation: str = "landscape") -> List[Dict]:
        """Search for photos on Unsplash"""
        url = f"{self.base_url}/search/photos"
        params = {
            "query": query,
            "per_page": per_page,
            "orientation": orientation,
            "content_filter": "high"
        }
        
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            
            data = response.json()
            return data.get('results', [])
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Unsplash API error: {e}")
            return []
    
    def get_photo_info(self, photo_id: str) -> Optional[Dict]:
        """Get detailed photo information"""
        url = f"{self.base_url}/photos/{photo_id}"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get photo info: {e}")
            return None

class PixabayClient:
    """Client for Pixabay API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://pixabay.com/api/"
    
    def search_images(self, query: str, per_page: int = 10, image_type: str = "photo") -> List[Dict]:
        """Search for images on Pixabay"""
        params = {
            "key": self.api_key,
            "q": query,
            "image_type": image_type,
            "orientation": "horizontal",
            "category": "business",
            "min_width": 1920,
            "min_height": 1080,
            "per_page": per_page,
            "safesearch": "true"
        }
        
        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            return data.get('hits', [])
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Pixabay API error: {e}")
            return []

class ImageHandler:
    """Main image handling system"""
    
    def __init__(self, images_dir: str = "static/images"):
        self.config_manager = ConfigManager()
        self.data_manager = DataManager()
        self.images_dir = images_dir
        
        # Create images directory
        os.makedirs(self.images_dir, exist_ok=True)
        
        # Initialize image service clients
        self.unsplash_client = None
        self.pixabay_client = None
        
        # Setup clients if API keys are available
        unsplash_key = self.config_manager.get_credential('image_services.unsplash.access_key')
        if unsplash_key and unsplash_key != "YOUR_UNSPLASH_ACCESS_KEY":
            self.unsplash_client = UnsplashClient(unsplash_key)
        
        pixabay_key = self.config_manager.get_credential('image_services.pixabay.api_key')
        if pixabay_key and pixabay_key != "YOUR_PIXABAY_API_KEY":
            self.pixabay_client = PixabayClient(pixabay_key)
        
        # Load processed images cache
        self.processed_images = self.load_processed_images()
    
    def load_processed_images(self) -> Dict:
        """Load cache of processed images"""
        cache_file = os.path.join('data', 'processed_images.json')
        
        try:
            with open(cache_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def save_processed_images(self):
        """Save processed images cache"""
        cache_file = os.path.join('data', 'processed_images.json')
        
        with open(cache_file, 'w') as f:
            json.dump(self.processed_images, f, indent=2)
    
    def generate_search_terms(self, article_data: Dict) -> List[str]:
        """Generate search terms for finding relevant images"""
        category = article_data.get('category_name', '')
        title = article_data.get('title', '')
        keywords = article_data.get('keywords', [])
        
        search_terms = []
        
        # Category-based terms
        category_terms = {
            'Auto Loans': ['car finance', 'auto loan', 'vehicle financing', 'car dealership'],
            'Credit Score': ['credit report', 'financial planning', 'credit score', 'financial advice'],
            'Personal Loans': ['personal finance', 'loan application', 'financial planning', 'money management'],
            'Mortgages': ['home mortgage', 'real estate', 'house buying', 'property finance'],
            'Business Loans': ['business finance', 'entrepreneur', 'business meeting', 'office finance'],
            'Credit Cards': ['credit card', 'payment card', 'financial transaction', 'shopping payment'],
            'Student Loans': ['student finance', 'education funding', 'college student', 'graduation'],
            'Rewards & Cashback': ['cashback rewards', 'credit card rewards', 'shopping benefits', 'financial rewards'],
            'Balance Transfers & Debt Management': ['debt management', 'financial planning', 'debt relief', 'financial stress'],
            'Building & Rebuilding Credit': ['credit building', 'financial improvement', 'credit repair', 'financial success'],
            'Travel & Premium Cards': ['travel finance', 'airport lounge', 'premium travel', 'travel rewards'],
            'Business Credit Cards': ['business card', 'corporate finance', 'business expense', 'office payment'],
            'Credit Card Protections & Security': ['financial security', 'payment protection', 'secure payment', 'financial safety'],
            'Advanced Tips & Optimization': ['financial strategy', 'money optimization', 'financial planning', 'investment advice']
        }
        
        if category in category_terms:
            search_terms.extend(category_terms[category])
        
        # Generic financial terms
        search_terms.extend([
            'business finance',
            'financial planning',
            'money management',
            'calculator finance',
            'professional meeting',
            'financial advisor'
        ])
        
        # Add relevant keywords
        relevant_keywords = [kw for kw in keywords if len(kw) > 4][:3]
        search_terms.extend(relevant_keywords)
        
        return search_terms[:8]  # Limit to 8 terms
    
    def search_and_select_images(self, search_terms: List[str], count: int = 3) -> List[Dict]:
        """Search and select appropriate images"""
        selected_images = []
        
        for term in search_terms:
            if len(selected_images) >= count:
                break
            
            # Try Unsplash first
            if self.unsplash_client:
                images = self.unsplash_client.search_photos(term, per_page=5)
                for img in images:
                    if len(selected_images) >= count:
                        break
                    
                    if self.is_suitable_image(img, 'unsplash'):
                        selected_images.append(self.format_unsplash_image(img))
            
            # Try Pixabay if needed
            if len(selected_images) < count and self.pixabay_client:
                images = self.pixabay_client.search_images(term, per_page=5)
                for img in images:
                    if len(selected_images) >= count:
                        break
                    
                    if self.is_suitable_image(img, 'pixabay'):
                        selected_images.append(self.format_pixabay_image(img))
            
            # Add delay between API calls
            time.sleep(0.5)
        
        # Fill remaining slots with fallback images if needed
        while len(selected_images) < count:
            selected_images.append(self.create_fallback_image(len(selected_images) + 1))
        
        return selected_images[:count]
    
    def is_suitable_image(self, image_data: Dict, source: str) -> bool:
        """Check if image is suitable for financial content"""
        if source == 'unsplash':
            # Check image dimensions
            width = image_data.get('width', 0)
            height = image_data.get('height', 0)
            
            if width < 1200 or height < 800:
                return False
            
            # Check aspect ratio (prefer landscape)
            aspect_ratio = width / height if height > 0 else 0
            if aspect_ratio < 1.2 or aspect_ratio > 2.0:
                return False
            
        elif source == 'pixabay':
            # Pixabay images are pre-filtered in the search
            return True
        
        return True
    
    def format_unsplash_image(self, image_data: Dict) -> Dict:
        """Format Unsplash image data"""
        return {
            'id': image_data['id'],
            'source': 'unsplash',
            'url': image_data['urls']['regular'],
            'download_url': image_data['urls']['full'],
            'alt_text': image_data.get('alt_description', ''),
            'photographer': image_data['user']['name'],
            'photographer_url': image_data['user']['links']['html'],
            'width': image_data['width'],
            'height': image_data['height'],
            'attribution_required': True
        }
    
    def format_pixabay_image(self, image_data: Dict) -> Dict:
        """Format Pixabay image data"""
        return {
            'id': str(image_data['id']),
            'source': 'pixabay',
            'url': image_data['webformatURL'],
            'download_url': image_data['fullHDURL'],
            'alt_text': image_data.get('tags', '').replace(',', ' '),
            'photographer': image_data['user'],
            'width': image_data['imageWidth'],
            'height': image_data['imageHeight'],
            'attribution_required': False
        }
    
    def create_fallback_image(self, image_number: int) -> Dict:
        """Create fallback image placeholder"""
        return {
            'id': f'fallback_{image_number}',
            'source': 'fallback',
            'url': f'/static/images/placeholder-{image_number}.jpg',
            'download_url': '',
            'alt_text': 'Financial planning and money management illustration',
            'photographer': 'MoneyMatrix',
            'width': 1200,
            'height': 800,
            'attribution_required': False
        }
    
    def download_image(self, image_data: Dict, filename: str) -> bool:
        """Download image to local storage"""
        download_url = image_data.get('download_url') or image_data.get('url')
        
        if not download_url:
            return False
        
        filepath = os.path.join(self.images_dir, filename)
        
        # Skip if already exists
        if os.path.exists(filepath):
            return True
        
        try:
            response = requests.get(download_url, stream=True)
            response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            logger.info(f"Downloaded image: {filename}")
            return True
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to download image {filename}: {e}")
            return False
    
    def generate_alt_text(self, image_data: Dict, article_context: Dict) -> str:
        """Generate appropriate alt text for image"""
        base_alt = image_data.get('alt_text', '')
        category = article_context.get('category_name', '')
        
        # Enhance alt text with context
        if base_alt:
            alt_text = f"{base_alt} - {category} guide"
        else:
            alt_text = f"Financial illustration for {category} advice and tips"
        
        # Ensure alt text is descriptive and SEO-friendly
        alt_text = alt_text.replace('  ', ' ').strip()
        
        return alt_text[:125]  # Keep under 125 characters for accessibility
    
    def process_article_images(self, article_data: Dict) -> Dict:
        """Process all images for an article"""
        article_slug = article_data.get('slug', '')
        
        # Check if already processed
        if article_slug in self.processed_images:
            logger.info(f"Images already processed for {article_slug}")
            return self.processed_images[article_slug]
        
        # Generate search terms
        search_terms = self.generate_search_terms(article_data)
        
        # Search and select images
        images = self.search_and_select_images(search_terms, count=3)
        
        # Process each image
        processed_images = []
        
        for i, image_data in enumerate(images, 1):
            filename = f"{article_slug}-{i}.jpg"
            
            # Download image if from external source
            if image_data['source'] != 'fallback':
                self.download_image(image_data, filename)
            
            # Generate alt text
            alt_text = self.generate_alt_text(image_data, article_data)
            
            # Create processed image data
            processed_image = {
                'filename': filename,
                'url': f"/static/images/{filename}",
                'alt_text': alt_text,
                'title': f"{article_data.get('category_name', '')} - {article_data.get('title', '')}",
                'source': image_data['source'],
                'photographer': image_data.get('photographer', ''),
                'photographer_url': image_data.get('photographer_url', ''),
                'attribution_required': image_data.get('attribution_required', False),
                'width': image_data.get('width', 1200),
                'height': image_data.get('height', 800)
            }
            
            processed_images.append(processed_image)
        
        # Cache the results
        self.processed_images[article_slug] = {
            'images': processed_images,
            'processed_at': time.time(),
            'search_terms': search_terms
        }
        
        self.save_processed_images()
        
        logger.info(f"Processed {len(processed_images)} images for {article_slug}")
        
        return self.processed_images[article_slug]
    
    def update_article_content_with_images(self, article_data: Dict) -> str:
        """Update article content with actual image tags"""
        content = article_data.get('content', '')
        
        # Process images
        image_result = self.process_article_images(article_data)
        images = image_result.get('images', [])
        
        # Replace image placeholders
        import re
        
        image_pattern = r'\[IMAGE:\s*([^\]]+)\]'
        
        def replace_image(match):
            if images:
                # Get next image
                image = images.pop(0)
                
                # Create image HTML
                img_html = f'''<figure class="article-image">
    <img src="{image['url']}" 
         alt="{image['alt_text']}" 
         title="{image['title']}"
         width="{image['width']}" 
         height="{image['height']}"
         loading="lazy">
    {f'<figcaption>Photo by <a href="{image["photographer_url"]}" target="_blank">{image["photographer"]}</a></figcaption>' if image['attribution_required'] else ''}
</figure>'''
                
                return img_html
            else:
                # No more images available
                return ""
        
        updated_content = re.sub(image_pattern, replace_image, content)
        
        return updated_content
    
    def create_placeholder_images(self):
        """Create placeholder images for fallback"""
        placeholder_dir = self.images_dir
        
        # Simple colored rectangles as placeholders
        try:
            from PIL import Image, ImageDraw, ImageFont
            
            for i in range(1, 4):
                # Create placeholder image
                img = Image.new('RGB', (1200, 800), color=f'#{(i*50):02x}{(i*30):02x}{(i*70):02x}')
                draw = ImageDraw.Draw(img)
                
                # Add text
                try:
                    font = ImageFont.truetype("arial.ttf", 60)
                except:
                    font = ImageFont.load_default()
                
                text = f"Financial Guide Image {i}"
                bbox = draw.textbbox((0, 0), text, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
                
                x = (1200 - text_width) // 2
                y = (800 - text_height) // 2
                
                draw.text((x, y), text, fill='white', font=font)
                
                # Save placeholder
                placeholder_path = os.path.join(placeholder_dir, f'placeholder-{i}.jpg')
                img.save(placeholder_path, 'JPEG', quality=85)
                
            logger.info("Created placeholder images")
            
        except ImportError:
            logger.warning("PIL not available, skipping placeholder creation")

def create_default_images():
    """Create default images for the site"""
    image_handler = ImageHandler()
    image_handler.create_placeholder_images()

if __name__ == "__main__":
    # Test image handling
    image_handler = ImageHandler()
    
    # Create placeholder images
    image_handler.create_placeholder_images()
    
    # Test with sample article data
    sample_article = {
        'slug': 'test-article',
        'title': 'Best Credit Cards for 2025',
        'category_name': 'Credit Cards',
        'keywords': ['credit', 'cards', 'rewards', 'cashback']
    }
    
    result = image_handler.process_article_images(sample_article)
    print(f"Processed images: {len(result['images'])}")