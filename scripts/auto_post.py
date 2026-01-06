#!/usr/bin/env python3
"""
MoneyMatrix.me Automated Content Generation and Publishing System

This is the main orchestration script that handles:
- Content generation with AI
- Image processing and optimization
- HTML generation and site building
- Backlink creation
- Scheduled publishing
- Deployment to Cloudflare

Usage:
    python scripts/auto_post.py                    # Full automation cycle
    python scripts/auto_post.py --build-only       # Build site without new content
    python scripts/auto_post.py --generate-only    # Generate content only
    python scripts/auto_post.py --deploy           # Deploy to Cloudflare
    python scripts/auto_post.py --backlinks        # Create backlinks only
"""

import os
import sys
import time
import argparse
import schedule
from datetime import datetime, timedelta
from typing import Dict, List, Optional

# Add scripts directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils import (
    ConfigManager, DataManager, ScheduleManager, 
    validate_environment, logger
)
from content_generator import ContentGenerator
from html_generation import HTMLGenerator, TemplateManager
from image_handler import ImageHandler
from backlink_poster import BacklinkPoster
from cloudflare_deploy import CloudflareDeployment

class MoneyMatrixOrchestrator:
    """Main orchestration class for the MoneyMatrix.me automation system"""
    
    def __init__(self):
        # Validate environment
        if not validate_environment():
            logger.error("Environment validation failed")
            sys.exit(1)
        
        # Initialize managers
        self.config_manager = ConfigManager()
        self.data_manager = DataManager()
        self.schedule_manager = ScheduleManager(self.data_manager)
        
        # Initialize processors
        self.content_generator = ContentGenerator()
        self.html_generator = HTMLGenerator()
        self.image_handler = ImageHandler()
        self.backlink_poster = BacklinkPoster()
        self.cloudflare_deploy = CloudflareDeployment()
        
        # Configuration
        self.config = self.config_manager.config
        
        logger.info("MoneyMatrix.me Orchestrator initialized")
    
    def generate_new_content(self, count: int = 1) -> List[Dict]:
        """Generate new articles"""
        logger.info(f"Starting content generation for {count} articles")
        
        if not self.config_manager.get('features.auto_publish', True):
            logger.info("Auto publishing disabled in config")
            return []
        
        try:
            articles = self.content_generator.generate_multiple_articles(count)
            
            logger.info(f"Generated {len(articles)} new articles")
            return articles
            
        except Exception as e:
            logger.error(f"Content generation failed: {e}")
            return []
    
    def process_article_images(self, articles: List[Dict]) -> List[Dict]:
        """Process images for articles"""
        logger.info(f"Processing images for {len(articles)} articles")
        
        if not self.config_manager.get('features.generate_images', True):
            logger.info("Image generation disabled in config")
            return articles
        
        processed_articles = []
        
        for article in articles:
            try:
                # Update article content with actual images
                updated_content = self.image_handler.update_article_content_with_images(article)
                article['content'] = updated_content
                
                processed_articles.append(article)
                logger.info(f"Processed images for: {article['title']}")
                
            except Exception as e:
                logger.error(f"Image processing failed for {article['title']}: {e}")
                processed_articles.append(article)  # Keep article without images
        
        return processed_articles
    
    def build_static_site(self):
        """Build the complete static site"""
        logger.info("Building static site")
        
        try:
            # Ensure templates exist
            template_manager = TemplateManager()
            template_manager.create_all_templates()
            
            # Build the site
            self.html_generator.build_complete_site()
            
            logger.info("Static site build completed")
            
        except Exception as e:
            logger.error(f"Site build failed: {e}")
            raise
    
    def create_backlinks(self, max_posts: int = None) -> int:
        """Create backlink posts for articles"""
        if not self.config_manager.get('features.create_backlinks', True):
            logger.info("Backlink creation disabled in config")
            return 0
        
        if max_posts is None:
            max_posts = self.config_manager.get('backlinks.max_posts_per_run', 3)
        
        logger.info(f"Creating backlinks (max {max_posts} posts)")
        
        try:
            count = self.backlink_poster.process_backlink_queue(max_posts)
            logger.info(f"Created {count} backlink posts")
            return count
            
        except Exception as e:
            logger.error(f"Backlink creation failed: {e}")
            return 0
    
    def deploy_to_cloudflare(self) -> bool:
        """Deploy site to Cloudflare"""
        if not self.config_manager.get('deployment.auto_deploy', False):
            logger.info("Auto deployment disabled in config")
            return False
        
        logger.info("Deploying to Cloudflare")
        
        try:
            # Create deployment package if it doesn't exist
            if not os.path.exists('deploy'):
                self.cloudflare_deploy.create_deployment_package()
            
            # Deploy
            success = self.cloudflare_deploy.deploy_to_cloudflare()
            
            if success:
                logger.info("Deployment successful")
            else:
                logger.error("Deployment failed")
            
            return success
            
        except Exception as e:
            logger.error(f"Deployment error: {e}")
            return False
    
    def full_automation_cycle(self):
        """Run complete automation cycle"""
        logger.info("=== Starting Full Automation Cycle ===")
        
        start_time = datetime.now()
        
        try:
            # Check if it's time to publish
            interval_hours = self.config_manager.get('content.publish_interval_hours', 2)
            
            if not self.schedule_manager.should_publish_now(interval_hours):
                next_time = self.schedule_manager.get_next_publish_time(interval_hours)
                logger.info(f"Not time to publish yet. Next scheduled: {next_time}")
                return
            
            # Generate new content
            articles = self.generate_new_content(count=1)
            
            if articles:
                # Process images
                articles = self.process_article_images(articles)
                
                # Build static site
                self.build_static_site()
                
                # Create backlinks (async, can run in background)
                self.create_backlinks(max_posts=1)
                
                # Deploy if configured
                if self.config_manager.get('deployment.auto_deploy', False):
                    self.deploy_to_cloudflare()
            
            duration = datetime.now() - start_time
            logger.info(f"=== Automation Cycle Complete ({duration.total_seconds():.1f}s) ===")
            
        except Exception as e:
            logger.error(f"Automation cycle failed: {e}")
            raise
    
    def build_only_mode(self):
        """Build site without generating new content"""
        logger.info("=== Build Only Mode ===")
        
        try:
            # Build static site with existing content
            self.build_static_site()
            
            logger.info("Build completed successfully")
            
        except Exception as e:
            logger.error(f"Build failed: {e}")
            raise
    
    def generate_only_mode(self, count: int = 1):
        """Generate content only without building site"""
        logger.info(f"=== Generate Only Mode ({count} articles) ===")
        
        try:
            # Generate articles
            articles = self.generate_new_content(count)
            
            # Process images
            if articles:
                articles = self.process_article_images(articles)
            
            logger.info(f"Generated {len(articles)} articles successfully")
            
        except Exception as e:
            logger.error(f"Content generation failed: {e}")
            raise
    
    def backlinks_only_mode(self, max_posts: int = None):
        """Create backlinks only"""
        logger.info("=== Backlinks Only Mode ===")
        
        try:
            count = self.create_backlinks(max_posts)
            logger.info(f"Created {count} backlink posts")
            
        except Exception as e:
            logger.error(f"Backlink creation failed: {e}")
            raise
    
    def setup_scheduled_automation(self):
        """Setup scheduled automation"""
        interval_hours = self.config_manager.get('content.publish_interval_hours', 2)
        
        logger.info(f"Setting up scheduled automation (every {interval_hours} hours)")
        
        # Schedule the main automation cycle
        schedule.every(interval_hours).hours.do(self.full_automation_cycle)
        
        # Schedule daily backlink creation
        schedule.every().day.at("10:00").do(lambda: self.create_backlinks(max_posts=5))
        
        # Schedule daily site rebuild
        schedule.every().day.at("06:00").do(self.build_static_site)
        
        logger.info("Scheduled automation setup complete")
        
        # Run the scheduler
        while True:
            try:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
                
            except KeyboardInterrupt:
                logger.info("Scheduled automation stopped by user")
                break
            except Exception as e:
                logger.error(f"Scheduler error: {e}")
                time.sleep(300)  # Wait 5 minutes before retrying
    
    def get_system_status(self) -> Dict:
        """Get system status and statistics"""
        published_articles = self.data_manager.get_published_articles()
        backlink_stats = self.backlink_poster.get_backlink_stats()
        
        next_publish = self.schedule_manager.get_next_publish_time()
        
        status = {
            'total_articles': len(published_articles),
            'articles_today': len([
                a for a in published_articles 
                if a.get('date_published', '').startswith(datetime.now().strftime('%Y-%m-%d'))
            ]),
            'total_backlinks': backlink_stats.get('total_backlink_posts', 0),
            'next_scheduled_publish': next_publish.isoformat() if next_publish else None,
            'features_enabled': {
                'auto_publish': self.config_manager.get('features.auto_publish', True),
                'generate_images': self.config_manager.get('features.generate_images', True),
                'create_backlinks': self.config_manager.get('features.create_backlinks', True),
                'auto_deploy': self.config_manager.get('deployment.auto_deploy', False)
            },
            'last_updated': datetime.now().isoformat()
        }
        
        return status

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='MoneyMatrix.me Content Automation')
    parser.add_argument('--build-only', action='store_true', help='Build site without generating new content')
    parser.add_argument('--generate-only', action='store_true', help='Generate content only')
    parser.add_argument('--generate-count', type=int, default=1, help='Number of articles to generate')
    parser.add_argument('--backlinks', action='store_true', help='Create backlinks only')
    parser.add_argument('--backlinks-count', type=int, help='Max backlinks to create')
    parser.add_argument('--deploy', action='store_true', help='Deploy to Cloudflare')
    parser.add_argument('--schedule', action='store_true', help='Run scheduled automation')
    parser.add_argument('--status', action='store_true', help='Show system status')
    parser.add_argument('--setup', action='store_true', help='Setup deployment files')
    
    args = parser.parse_args()
    
    try:
        orchestrator = MoneyMatrixOrchestrator()
        
        if args.status:
            status = orchestrator.get_system_status()
            print("\n=== MoneyMatrix.me System Status ===")
            print(f"Total Articles: {status['total_articles']}")
            print(f"Articles Today: {status['articles_today']}")
            print(f"Total Backlinks: {status['total_backlinks']}")
            print(f"Next Publish: {status['next_scheduled_publish']}")
            print(f"Features: {status['features_enabled']}")
            return
        
        if args.setup:
            orchestrator.cloudflare_deploy.create_deployment_package()
            print("Deployment package created successfully!")
            return
        
        if args.build_only:
            orchestrator.build_only_mode()
            
        elif args.generate_only:
            orchestrator.generate_only_mode(args.generate_count)
            
        elif args.backlinks:
            orchestrator.backlinks_only_mode(args.backlinks_count)
            
        elif args.deploy:
            orchestrator.deploy_to_cloudflare()
            
        elif args.schedule:
            orchestrator.setup_scheduled_automation()
            
        else:
            # Default: run full automation cycle once
            orchestrator.full_automation_cycle()
    
    except KeyboardInterrupt:
        logger.info("Operation cancelled by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()