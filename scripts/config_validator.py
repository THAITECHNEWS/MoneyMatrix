#!/usr/bin/env python3
"""
Configuration Validator for MoneyMatrix.me
Validates all configuration files and ensures consistency
"""

import json
import os
from typing import Dict, List, Tuple
from utils import logger

class ConfigValidator:
    """Validates all configuration files"""
    
    def __init__(self):
        self.errors = []
        self.warnings = []
    
    def validate_all(self) -> Tuple[bool, List[str], List[str]]:
        """Validate all configurations"""
        self.errors = []
        self.warnings = []
        
        # Validate main config
        self.validate_config_json()
        
        # Validate data files
        self.validate_categories()
        self.validate_topics()
        self.validate_api_credentials()
        
        # Validate directory structure
        self.validate_directory_structure()
        
        # Validate SEO settings
        self.validate_seo_settings()
        
        return len(self.errors) == 0, self.errors, self.warnings
    
    def validate_config_json(self):
        """Validate config.json"""
        try:
            if not os.path.exists('config.json'):
                self.errors.append("config.json not found")
                return
            
            with open('config.json', 'r') as f:
                config = json.load(f)
            
            # Required sections
            required_sections = ['site', 'content', 'features', 'ai', 'seo']
            for section in required_sections:
                if section not in config:
                    self.errors.append(f"config.json missing required section: {section}")
            
            # Validate site config
            if 'site' in config:
                site = config['site']
                if 'url' not in site or not site['url'].startswith('http'):
                    self.warnings.append("site.url should be a full URL starting with http/https")
                if 'name' not in site:
                    self.errors.append("site.name is required")
            
            # Validate SEO settings
            if 'seo' in config:
                seo = config['seo']
                if seo.get('title_length', 0) > 70:
                    self.warnings.append("SEO title_length should be <= 70 for optimal display")
                if seo.get('meta_description_length', 0) > 160:
                    self.warnings.append("SEO meta_description_length should be <= 160 for optimal display")
            
        except json.JSONDecodeError as e:
            self.errors.append(f"config.json is not valid JSON: {e}")
        except Exception as e:
            self.errors.append(f"Error validating config.json: {e}")
    
    def validate_categories(self):
        """Validate categories.json"""
        try:
            if not os.path.exists('data/categories.json'):
                self.errors.append("data/categories.json not found")
                return
            
            with open('data/categories.json', 'r') as f:
                data = json.load(f)
            
            if 'categories' not in data:
                self.errors.append("categories.json missing 'categories' key")
                return
            
            categories = data['categories']
            if not categories:
                self.warnings.append("No categories defined in categories.json")
            
            # Check for required fields
            required_fields = ['id', 'name', 'slug']
            for idx, category in enumerate(categories):
                for field in required_fields:
                    if field not in category:
                        self.errors.append(f"Category {idx+1} missing required field: {field}")
                
                # Validate slug format
                if 'slug' in category:
                    slug = category['slug']
                    if not slug.replace('-', '').replace('_', '').isalnum():
                        self.warnings.append(f"Category '{category.get('name', '')}' has non-standard slug format")
            
            # Check for duplicate IDs
            ids = [cat.get('id') for cat in categories]
            if len(ids) != len(set(ids)):
                self.errors.append("Duplicate category IDs found")
            
        except json.JSONDecodeError as e:
            self.errors.append(f"categories.json is not valid JSON: {e}")
        except Exception as e:
            self.errors.append(f"Error validating categories.json: {e}")
    
    def validate_topics(self):
        """Validate topics.json"""
        try:
            if not os.path.exists('data/topics.json'):
                self.warnings.append("data/topics.json not found (content generation may be limited)")
                return
            
            with open('data/topics.json', 'r') as f:
                data = json.load(f)
            
            if 'topics' not in data:
                self.errors.append("topics.json missing 'topics' key")
                return
            
            topics = data['topics']
            if not topics:
                self.warnings.append("No topics defined in topics.json")
            
            # Validate topic structure
            for idx, topic_group in enumerate(topics):
                if 'category_id' not in topic_group:
                    self.errors.append(f"Topic group {idx+1} missing category_id")
                if 'topics' not in topic_group or not topic_group['topics']:
                    self.warnings.append(f"Topic group {idx+1} has no topics")
            
        except json.JSONDecodeError as e:
            self.errors.append(f"topics.json is not valid JSON: {e}")
        except Exception as e:
            self.errors.append(f"Error validating topics.json: {e}")
    
    def validate_api_credentials(self):
        """Validate api_credentials.json"""
        try:
            if not os.path.exists('data/api_credentials.json'):
                self.warnings.append("data/api_credentials.json not found (content generation will not work)")
                return
            
            with open('data/api_credentials.json', 'r') as f:
                credentials = json.load(f)
            
            # Check for OpenAI API key
            import os
            openai_key_env = os.getenv('OPENAI_API_KEY')
            if 'openai' not in credentials and not openai_key_env:
                self.warnings.append("OpenAI API credentials not found (check OPENAI_API_KEY env var or api_credentials.json)")
            elif credentials.get('openai', {}).get('api_key') == 'YOUR_OPENAI_API_KEY' and not openai_key_env:
                self.warnings.append("OpenAI API key not configured (using placeholder) - set OPENAI_API_KEY env var")
            
        except json.JSONDecodeError as e:
            self.errors.append(f"api_credentials.json is not valid JSON: {e}")
        except Exception as e:
            self.errors.append(f"Error validating api_credentials.json: {e}")
    
    def validate_directory_structure(self):
        """Validate required directories exist"""
        required_dirs = [
            'data',
            'scripts',
            'templates',
            'static',
            'dist',
            'advanced_prompts'
        ]
        
        for dir_path in required_dirs:
            if not os.path.exists(dir_path):
                self.errors.append(f"Required directory missing: {dir_path}")
    
    def validate_seo_settings(self):
        """Validate SEO-related settings"""
        try:
            if not os.path.exists('config.json'):
                return
            
            with open('config.json', 'r') as f:
                config = json.load(f)
            
            seo = config.get('seo', {})
            
            # Check for optimal values
            if seo.get('title_length', 60) < 30:
                self.warnings.append("SEO title_length is very short, may impact SEO")
            
            if seo.get('meta_description_length', 155) < 120:
                self.warnings.append("SEO meta_description_length is short, may impact click-through rates")
            
            if not seo.get('optimize_for_featured_snippets', False):
                self.warnings.append("Featured snippets optimization is disabled")
            
        except Exception as e:
            self.warnings.append(f"Could not validate SEO settings: {e}")
    
    def print_report(self):
        """Print validation report"""
        print("\n" + "="*60)
        print("CONFIGURATION VALIDATION REPORT")
        print("="*60)
        
        if self.errors:
            print(f"\n❌ ERRORS ({len(self.errors)}):")
            for error in self.errors:
                print(f"   • {error}")
        
        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"   • {warning}")
        
        if not self.errors and not self.warnings:
            print("\n✅ All validations passed!")
        
        print("\n" + "="*60 + "\n")
        
        return len(self.errors) == 0

if __name__ == "__main__":
    validator = ConfigValidator()
    is_valid, errors, warnings = validator.validate_all()
    validator.print_report()
    
    if not is_valid:
        exit(1)

