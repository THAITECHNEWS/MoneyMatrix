#!/usr/bin/env python3
"""
Centralized Navigation Manager for MoneyMatrix.me
Handles dynamic navigation generation across all pages
"""

import json
import os
from typing import Dict, List, Optional
from utils import DataManager, ConfigManager, logger

class NavigationManager:
    """Centralized navigation management"""
    
    def __init__(self):
        self.data_manager = DataManager()
        self.config_manager = ConfigManager()
        self.categories = self.data_manager.get_categories()
        self.nav_config = self._load_nav_config()
    
    def _load_nav_config(self) -> Dict:
        """Load navigation configuration"""
        nav_file = 'data/navigation.json'
        if os.path.exists(nav_file):
            try:
                with open(nav_file, 'r') as f:
                    return json.load(f)
            except:
                pass
        
        # Generate default navigation from categories
        return self._generate_default_nav()
    
    def _generate_default_nav(self) -> Dict:
        """Generate default navigation structure"""
        nav_items = []
        
        # Main categories
        main_categories = [
            {'slug': 'credit-cards', 'name': 'Credit Cards'},
            {'slug': 'personal-loans', 'name': 'Loans'},
            {'slug': 'mortgages', 'name': 'Mortgages'},
            {'slug': 'personal-finance', 'name': 'Personal Finance'},
        ]
        
        for cat in main_categories:
            nav_items.append({
                'id': cat['slug'],
                'label': cat['name'],
                'url': f"/{cat['slug']}",
                'type': 'single'
            })
        
        # Loans dropdown
        loans_item = {
            'id': 'loans',
            'label': 'Loans',
            'url': '/personal-loans',
            'type': 'dropdown',
            'children': [
                {'id': 'personal-loans', 'label': 'Personal Loans', 'url': '/personal-loans'},
                {'id': 'auto-loans', 'label': 'Auto Loans', 'url': '/auto-loans'},
                {'id': 'business-loans', 'label': 'Business Loans', 'url': '/business-loans'},
                {'id': 'student-loans', 'label': 'Student Loans', 'url': '/student-loans'},
            ]
        }
        
        # Personal Finance dropdown
        finance_item = {
            'id': 'personal-finance',
            'label': 'Personal Finance',
            'url': '/personal-finance',
            'type': 'dropdown',
            'children': [
                {'id': 'guides', 'label': 'Guides', 'url': '/guides'},
                {'id': 'calculators', 'label': 'Calculators', 'url': '/calculators'},
                {'id': 'credit-score', 'label': 'Credit Score', 'url': '/credit-score'},
            ]
        }
        
        nav_items.append(loans_item)
        nav_items.append(finance_item)
        
        # Additional items
        nav_items.append({'id': 'news', 'label': 'News', 'url': '/news', 'type': 'single'})
        
        return {
            'navigation': nav_items,
            'settings': {
                'mobileBreakpoint': 768,
                'animationDuration': 200,
                'seoFallback': True
            }
        }
    
    def generate_navigation_html(self, current_page: str = '') -> str:
        """Generate navigation HTML"""
        nav_items = self.nav_config.get('navigation', [])
        
        html_parts = []
        html_parts.append('<nav class="nav-menu" role="navigation" aria-label="Main navigation">')
        
        # Generate noscript fallback for SEO
        html_parts.append('<noscript>')
        for item in nav_items:
            if item.get('type') == 'single':
                html_parts.append(f'<a href="{item["url"]}" class="nav-link">{item["label"]}</a>')
        html_parts.append('</noscript>')
        
        # Generate main navigation
        html_parts.append('<div class="nav-menu-items">')
        
        for item in nav_items:
            if item.get('type') == 'dropdown':
                html_parts.append(self._generate_dropdown_html(item, current_page))
            else:
                html_parts.append(self._generate_single_item_html(item, current_page))
        
        html_parts.append('</div>')
        
        # Mobile menu toggle
        html_parts.append('<button class="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded="false">')
        html_parts.append('<span></span><span></span><span></span>')
        html_parts.append('</button>')
        
        html_parts.append('</nav>')
        
        return '\n            '.join(html_parts)
    
    def _generate_single_item_html(self, item: Dict, current_page: str) -> str:
        """Generate HTML for single navigation item"""
        is_active = current_page == item.get('url', '') or current_page == item.get('id', '')
        active_class = ' active' if is_active else ''
        
        return f'<a href="{item["url"]}" class="nav-link{active_class}" aria-current="{"page" if is_active else "false"}">{item["label"]}</a>'
    
    def _generate_dropdown_html(self, item: Dict, current_page: str) -> str:
        """Generate HTML for dropdown navigation item"""
        children = item.get('children', [])
        is_active = any(child.get('url') == current_page or child.get('id') == current_page for child in children)
        active_class = ' active' if is_active else ''
        
        html = []
        html.append(f'<div class="nav-item dropdown">')
        html.append(f'  <a href="{item["url"]}" class="nav-link dropdown-toggle{active_class}" aria-haspopup="true" aria-expanded="false">')
        html.append(f'    {item["label"]} <span class="dropdown-arrow" aria-hidden="true">▼</span>')
        html.append(f'  </a>')
        html.append(f'  <div class="dropdown-menu" role="menu">')
        
        for child in children:
            child_active = current_page == child.get('url', '') or current_page == child.get('id', '')
            child_active_class = ' active' if child_active else ''
            html.append(f'    <a href="{child["url"]}" class="dropdown-item{child_active_class}" role="menuitem">{child["label"]}</a>')
        
        html.append(f'  </div>')
        html.append(f'</div>')
        
        return '\n            '.join(html)
    
    def generate_navigation_css(self) -> str:
        """Generate navigation CSS"""
        return """
/* Navigation Styles */
.nav-menu {
    display: flex;
    align-items: center;
    gap: 2rem;
    position: relative;
}

.nav-menu-items {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.nav-link {
    font-weight: 500;
    color: var(--gray-700);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    position: relative;
}

.nav-link:hover,
.nav-link.active {
    background: var(--gray-100);
    color: var(--gray-900);
}

.nav-item {
    position: relative;
}

.dropdown-toggle {
    cursor: pointer;
}

.dropdown-arrow {
    font-size: 0.75rem;
    transition: transform 0.2s ease;
    margin-left: 0.25rem;
}

.nav-item:hover .dropdown-arrow,
.nav-item:focus-within .dropdown-arrow {
    transform: rotate(180deg);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    padding: 0.5rem 0;
    min-width: 180px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s ease;
    z-index: 1000;
}

.nav-item:hover .dropdown-menu,
.nav-item:focus-within .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.dropdown-item {
    display: block;
    padding: 0.5rem 1rem;
    color: var(--gray-700);
    text-decoration: none;
    transition: background 0.2s ease;
}

.dropdown-item:hover,
.dropdown-item.active {
    background: var(--gray-100);
    color: var(--gray-900);
}

/* Mobile Menu */
.mobile-menu-toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
}

.mobile-menu-toggle span {
    width: 24px;
    height: 2px;
    background: var(--gray-700);
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    .mobile-menu-toggle {
        display: flex;
    }
    
    .nav-menu-items {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        align-items: stretch;
        padding: 1rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }
    
    .nav-menu-items.mobile-open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .nav-link {
        width: 100%;
        padding: 0.75rem 1rem;
    }
    
    .dropdown-menu {
        position: static;
        opacity: 1;
        visibility: visible;
        transform: none;
        box-shadow: none;
        border: none;
        padding-left: 1rem;
    }
    
    .nav-item:hover .dropdown-menu {
        transform: none;
    }
}
"""
    
    def generate_navigation_js(self) -> str:
        """Generate navigation JavaScript"""
        return """
// Navigation JavaScript
(function() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu-items');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('mobile-open');
            navMenu.classList.toggle('mobile-open');
            mobileToggle.setAttribute('aria-expanded', !isOpen);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('mobile-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Handle keyboard navigation
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    navLinks.forEach(link => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
})();
"""

