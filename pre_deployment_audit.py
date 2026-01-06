#!/usr/bin/env python3
"""
Pre-Deployment Audit Script for MoneyMatrix.me
Comprehensive validation before deployment
"""

import os
import sys
from pathlib import Path

# Add scripts to path
sys.path.insert(0, str(Path(__file__).parent / 'scripts'))

from config_validator import ConfigValidator
from utils import logger

class PreDeploymentAudit:
    """Comprehensive pre-deployment audit"""
    
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.passed_checks = []
    
    def run_full_audit(self) -> bool:
        """Run complete audit"""
        print("\n" + "="*70)
        print("MONEYMATRIX.ME - PRE-DEPLOYMENT AUDIT")
        print("="*70 + "\n")
        
        # 1. Validate configuration
        print("📋 Validating Configuration...")
        self.validate_configuration()
        
        # 2. Check directory structure
        print("\n📁 Checking Directory Structure...")
        self.check_directory_structure()
        
        # 3. Check dist directory
        print("\n📦 Checking Build Output...")
        self.check_build_output()
        
        # 4. Validate SEO
        print("\n🔍 Validating SEO Setup...")
        self.validate_seo()
        
        # 5. Check mobile responsiveness
        print("\n📱 Checking Mobile Responsiveness...")
        self.check_mobile_responsiveness()
        
        # 6. Check performance
        print("\n⚡ Checking Performance Optimizations...")
        self.check_performance()
        
        # 7. Check Railway deployment
        print("\n🚂 Checking Railway Deployment Setup...")
        self.check_railway_setup()
        
        # Print summary
        self.print_summary()
        
        return len(self.errors) == 0
    
    def validate_configuration(self):
        """Validate all configuration files"""
        validator = ConfigValidator()
        is_valid, errors, warnings = validator.validate_all()
        
        if errors:
            self.errors.extend([f"Config: {e}" for e in errors])
        if warnings:
            self.warnings.extend([f"Config: {w}" for w in warnings])
        if is_valid:
            self.passed_checks.append("Configuration files validated")
    
    def check_directory_structure(self):
        """Check required directories exist"""
        required_dirs = [
            'data',
            'scripts',
            'templates',
            'static',
            'dist',
            'advanced_prompts'
        ]
        
        missing = []
        for dir_path in required_dirs:
            if not os.path.exists(dir_path):
                missing.append(dir_path)
        
        if missing:
            self.errors.append(f"Missing directories: {', '.join(missing)}")
        else:
            self.passed_checks.append("All required directories present")
    
    def check_build_output(self):
        """Check dist directory has content"""
        dist_dir = Path('dist')
        
        if not dist_dir.exists():
            self.errors.append("dist/ directory does not exist - run build first")
            return
        
        html_files = list(dist_dir.glob('*.html'))
        if not html_files:
            self.warnings.append("No HTML files found in dist/ - site may be empty")
        else:
            self.passed_checks.append(f"Found {len(html_files)} HTML files in dist/")
        
        # Check for sitemap
        if (dist_dir / 'sitemap.xml').exists():
            self.passed_checks.append("sitemap.xml found")
        else:
            self.warnings.append("sitemap.xml not found - will be generated on build")
        
        # Check for robots.txt
        if (dist_dir / 'robots.txt').exists():
            self.passed_checks.append("robots.txt found")
        else:
            self.warnings.append("robots.txt not found - will be generated on build")
    
    def validate_seo(self):
        """Validate SEO setup"""
        # Check for SEO manager
        seo_manager_path = Path('scripts/seo_manager.py')
        if seo_manager_path.exists():
            self.passed_checks.append("SEO Manager found")
        else:
            self.errors.append("SEO Manager not found")
        
        # Check config has SEO settings
        try:
            import json
            with open('config.json', 'r') as f:
                config = json.load(f)
                if 'seo' in config:
                    self.passed_checks.append("SEO configuration present")
                else:
                    self.warnings.append("SEO configuration missing")
        except:
            self.warnings.append("Could not validate SEO config")
    
    def check_mobile_responsiveness(self):
        """Check mobile responsiveness setup"""
        mobile_css = Path('static/css/mobile-responsive.css')
        if mobile_css.exists():
            self.passed_checks.append("Mobile responsive CSS found")
        else:
            self.warnings.append("Mobile responsive CSS not found")
        
        # Check a sample HTML file for viewport meta
        dist_dir = Path('dist')
        if dist_dir.exists():
            index_html = dist_dir / 'index.html'
            if index_html.exists():
                content = index_html.read_text()
                if 'viewport' in content.lower():
                    self.passed_checks.append("Viewport meta tag found in HTML")
                else:
                    self.warnings.append("Viewport meta tag missing")
    
    def check_performance(self):
        """Check performance optimizations"""
        perf_optimizer = Path('scripts/performance_optimizer.py')
        if perf_optimizer.exists():
            self.passed_checks.append("Performance Optimizer found")
        else:
            self.warnings.append("Performance Optimizer not found")
        
        # Check config has performance settings
        try:
            import json
            with open('config.json', 'r') as f:
                config = json.load(f)
                if 'performance' in config:
                    self.passed_checks.append("Performance configuration present")
                else:
                    self.warnings.append("Performance configuration missing")
        except:
            pass
    
    def check_railway_setup(self):
        """Check Railway deployment setup"""
        railway_json = Path('railway.json')
        railway_server = Path('railway_server.py')
        
        if railway_json.exists():
            self.passed_checks.append("railway.json found")
        else:
            self.errors.append("railway.json not found - required for Railway deployment")
        
        if railway_server.exists():
            self.passed_checks.append("railway_server.py found")
        else:
            self.errors.append("railway_server.py not found - required for Railway deployment")
        
        # Check requirements.txt
        requirements = Path('requirements.txt')
        if requirements.exists():
            self.passed_checks.append("requirements.txt found")
        else:
            self.warnings.append("requirements.txt not found")
    
    def print_summary(self):
        """Print audit summary"""
        print("\n" + "="*70)
        print("AUDIT SUMMARY")
        print("="*70)
        
        print(f"\n✅ PASSED CHECKS: {len(self.passed_checks)}")
        for check in self.passed_checks:
            print(f"   • {check}")
        
        if self.warnings:
            print(f"\n⚠️  WARNINGS: {len(self.warnings)}")
            for warning in self.warnings[:10]:  # Limit to 10
                print(f"   • {warning}")
            if len(self.warnings) > 10:
                print(f"   ... and {len(self.warnings) - 10} more warnings")
        
        if self.errors:
            print(f"\n❌ ERRORS: {len(self.errors)}")
            for error in self.errors:
                print(f"   • {error}")
        
        print("\n" + "="*70)
        
        if self.errors:
            print("\n❌ DEPLOYMENT BLOCKED - Please fix errors above")
            return False
        elif self.warnings:
            print("\n⚠️  DEPLOYMENT READY WITH WARNINGS - Review warnings above")
            return True
        else:
            print("\n✅ DEPLOYMENT READY - All checks passed!")
            return True

if __name__ == "__main__":
    audit = PreDeploymentAudit()
    success = audit.run_full_audit()
    
    sys.exit(0 if success else 1)

