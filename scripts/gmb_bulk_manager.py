#!/usr/bin/env python3
"""
Google My Business Bulk Manager
Creates and manages multiple GMB listings programmatically
"""

import json
import os
from typing import List, Dict
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

class GMBManager:
    def __init__(self, credentials_path: str):
        """
        Initialize GMB Manager
        
        Args:
            credentials_path: Path to Google Cloud service account JSON
        """
        self.credentials_path = credentials_path
        self.service = None
        self._authenticate()
    
    def _authenticate(self):
        """Authenticate with Google My Business API"""
        try:
            credentials = service_account.Credentials.from_service_account_file(
                self.credentials_path,
                scopes=['https://www.googleapis.com/auth/business.manage']
            )
            self.service = build('mybusiness', 'v4', credentials=credentials)
            print("✅ Authenticated with Google My Business API")
        except Exception as e:
            print(f"❌ Authentication failed: {e}")
            raise
    
    def create_location(self, account_name: str, location_data: Dict) -> Dict:
        """
        Create a new GMB location
        
        Args:
            account_name: GMB account name
            location_data: Location details (name, address, phone, etc.)
        
        Returns:
            Created location object
        """
        try:
            location = {
                'storefrontAddress': {
                    'addressLines': [location_data.get('address')],
                    'locality': location_data.get('city'),
                    'administrativeArea': location_data.get('state'),
                    'postalCode': location_data.get('zip_code'),
                    'regionCode': location_data.get('country', 'US')
                },
                'title': location_data.get('name'),
                'phoneNumbers': {
                    'primaryPhone': location_data.get('phone')
                },
                'websiteUrl': location_data.get('website'),
                'categories': {
                    'primaryCategory': {
                        'name': location_data.get('primary_category', 'Financial Service')
                    }
                },
                'storeCode': location_data.get('store_code', ''),
                'languageCode': 'en'
            }
            
            # Create location
            parent = f'accounts/{account_name}/locations'
            result = self.service.accounts().locations().create(
                parent=parent,
                body=location
            ).execute()
            
            print(f"✅ Created location: {location_data.get('name')}")
            return result
            
        except HttpError as e:
            print(f"❌ Failed to create location {location_data.get('name')}: {e}")
            return None
    
    def bulk_create_locations(self, account_name: str, locations: List[Dict]) -> List[Dict]:
        """
        Create multiple GMB locations
        
        Args:
            account_name: GMB account name
            locations: List of location data dictionaries
        
        Returns:
            List of created locations
        """
        created = []
        for location_data in locations:
            result = self.create_location(account_name, location_data)
            if result:
                created.append(result)
        return created
    
    def update_location(self, location_name: str, updates: Dict) -> Dict:
        """
        Update an existing GMB location
        
        Args:
            location_name: Full location name (accounts/{account}/locations/{location})
            updates: Dictionary of fields to update
        
        Returns:
            Updated location object
        """
        try:
            location = {}
            
            if 'address' in updates:
                location['storefrontAddress'] = {
                    'addressLines': [updates['address']],
                    'locality': updates.get('city'),
                    'administrativeArea': updates.get('state'),
                    'postalCode': updates.get('zip_code'),
                    'regionCode': updates.get('country', 'US')
                }
            
            if 'phone' in updates:
                location['phoneNumbers'] = {'primaryPhone': updates['phone']}
            
            if 'website' in updates:
                location['websiteUrl'] = updates['website']
            
            result = self.service.accounts().locations().patch(
                name=location_name,
                updateMask=','.join(updates.keys()),
                body=location
            ).execute()
            
            print(f"✅ Updated location: {location_name}")
            return result
            
        except HttpError as e:
            print(f"❌ Failed to update location: {e}")
            return None
    
    def list_locations(self, account_name: str) -> List[Dict]:
        """
        List all locations for an account
        
        Args:
            account_name: GMB account name
        
        Returns:
            List of location objects
        """
        try:
            parent = f'accounts/{account_name}'
            result = self.service.accounts().locations().list(parent=parent).execute()
            return result.get('locations', [])
        except HttpError as e:
            print(f"❌ Failed to list locations: {e}")
            return []
    
    def sync_to_site(self, account_name: str, output_file: str = 'data/gmb_stores.json'):
        """
        Sync GMB locations to MoneyMatrix stores.json format
        
        Args:
            account_name: GMB account name
            output_file: Output file path
        """
        locations = self.list_locations(account_name)
        stores = []
        
        for loc in locations:
            address = loc.get('storefrontAddress', {})
            store = {
                'id': loc.get('name', '').split('/')[-1],
                'name': loc.get('title', ''),
                'address': ', '.join(address.get('addressLines', [])),
                'city': address.get('locality', ''),
                'state': address.get('administrativeArea', ''),
                'zipCode': address.get('postalCode', ''),
                'phone': loc.get('phoneNumbers', {}).get('primaryPhone', ''),
                'website': loc.get('websiteUrl', ''),
                'coordinates': {
                    'lat': loc.get('storefrontAddress', {}).get('lat', 0),
                    'lng': loc.get('storefrontAddress', {}).get('lng', 0)
                },
                'services': [loc.get('categories', {}).get('primaryCategory', {}).get('name', 'Financial Service')],
                'rating': loc.get('rating', {}).get('averageRating', 0),
                'reviewsCount': loc.get('rating', {}).get('totalRatingCount', 0)
            }
            stores.append(store)
        
        # Save to file
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w') as f:
            json.dump(stores, f, indent=2)
        
        print(f"✅ Synced {len(stores)} locations to {output_file}")
        return stores


def main():
    """Example usage"""
    # Load configuration
    config = {
        'credentials_path': 'credentials/gmb-service-account.json',
        'account_name': 'accounts/your-account-id',
        'locations_file': 'data/gmb_locations.json'
    }
    
    # Initialize manager
    manager = GMBManager(config['credentials_path'])
    
    # Load locations to create
    with open(config['locations_file'], 'r') as f:
        locations = json.load(f)
    
    # Create locations
    created = manager.bulk_create_locations(config['account_name'], locations)
    
    # Sync to site
    manager.sync_to_site(config['account_name'])
    
    print(f"\n✅ Created {len(created)} GMB locations")


if __name__ == '__main__':
    main()

