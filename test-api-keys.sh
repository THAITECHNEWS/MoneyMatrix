#!/bin/bash

echo "🔑 Testing API Keys..."
echo ""

# Read keys from .env.local
GOOGLE_MAPS_KEY=$(grep "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" .env.local 2>/dev/null | cut -d '=' -f2 | tr -d '"' | tr -d "'")
APIFY_KEY=$(grep "NEXT_PUBLIC_APIFY_API_KEY" .env.local 2>/dev/null | cut -d '=' -f2 | tr -d '"' | tr -d "'")

# Test Google Maps API Key
echo "📍 Testing Google Maps API Key..."
if [ -z "$GOOGLE_MAPS_KEY" ] || [ "$GOOGLE_MAPS_KEY" = "your_google_maps_key_here" ]; then
  echo "❌ Google Maps API Key: NOT FOUND"
else
  echo "✅ Google Maps API Key found: ${GOOGLE_MAPS_KEY:0:20}..."
  
  # Test the key by making a request to Maps API
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places" 2>/dev/null)
  
  if [ "$RESPONSE" = "200" ]; then
    echo "✅ Google Maps API Key: VALID ✓"
  else
    echo "⚠️  Google Maps API Key: Status code $RESPONSE (may have domain restrictions)"
  fi
fi

echo ""

# Test Apify API Key
echo "🔍 Testing Apify API Key..."
if [ -z "$APIFY_KEY" ] || [ "$APIFY_KEY" = "your_apify_key_here" ]; then
  echo "⏳ Apify API Key: NOT CONFIGURED (optional)"
else
  echo "✅ Apify API Key found: ${APIFY_KEY:0:20}..."
  
  # Test Apify API
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://api.apify.com/v2/users/me?token=${APIFY_KEY}" 2>/dev/null)
  
  if [ "$RESPONSE" = "200" ]; then
    USER_INFO=$(curl -s "https://api.apify.com/v2/users/me?token=${APIFY_KEY}")
    USERNAME=$(echo "$USER_INFO" | grep -o '"username":"[^"]*' | cut -d'"' -f4)
    echo "✅ Apify API Key: VALID ✓"
    echo "   User: $USERNAME"
  else
    echo "❌ Apify API Key: INVALID (Status: $RESPONSE)"
  fi
fi

echo ""
echo "📋 SUMMARY:"
echo "==========="
if [ ! -z "$GOOGLE_MAPS_KEY" ] && [ "$GOOGLE_MAPS_KEY" != "your_google_maps_key_here" ]; then
  echo "✅ Google Maps: Configured"
else
  echo "❌ Google Maps: Missing"
fi

if [ ! -z "$APIFY_KEY" ] && [ "$APIFY_KEY" != "your_apify_key_here" ]; then
  echo "✅ Apify: Configured"
else
  echo "⏳ Apify: Not configured (optional)"
fi

echo ""
echo "💡 To test in browser:"
echo "   npm run dev"
echo "   Then visit: http://localhost:3000/locations/payday-loans-in-los-angeles-ca"

