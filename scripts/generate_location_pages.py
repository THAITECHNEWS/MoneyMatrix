#!/usr/bin/env python3
"""
Generate Location Pages - Creates location-based pages programmatically
Run Google Maps scraper first to populate stores.json, then run this script
"""

import json
import os
from typing import List, Dict

def load_json(filename: str) -> Dict:
    """Load JSON file"""
    filepath = os.path.join('data', filename)
    if not os.path.exists(filepath):
        return {}
    with open(filepath, 'r') as f:
        return json.load(f)

def generate_location_pages():
    """Generate location pages for all combinations"""
    locations = load_json('locations.json').get('locations', [])
    loan_types = load_json('loan-types.json').get('loanTypes', [])
    
    print(f"Generating pages for {len(locations)} locations × {len(loan_types)} loan types")
    print(f"Total pages: {len(locations) * len(loan_types)}")
    
    # Next.js will generate these dynamically, but we can create a list
    pages = []
    
    for location in locations:
        for loan_type in loan_types:
            slug = f"{loan_type['slug']}-in-{location['city'].lower().replace(' ', '-')}-{location['stateAbbr'].lower()}"
            url = f"/locations/{slug}"
            
            pages.append({
                'url': url,
                'loan_type': loan_type['slug'],
                'city': location['city'],
                'state': location['stateAbbr'],
                'title': f"{loan_type['name']} in {location['city']}, {location['stateAbbr']}"
            })
    
    # Save pages list for reference
    with open('data/location-pages.json', 'w') as f:
        json.dump({'pages': pages}, f, indent=2)
    
    print(f"✅ Generated {len(pages)} location page URLs")
    print(f"Example: {pages[0]['url'] if pages else 'N/A'}")
    
    return pages

if __name__ == "__main__":
    generate_location_pages()

