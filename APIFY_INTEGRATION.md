# Apify Google Maps Scraper Integration ✅

## What's Built

### ✅ Search Interface
- **Location Input**: City, state, or location name
- **Zip Code Input**: 5-digit zip code search
- **Distance Filter**: 5, 10, 25, 50, 100 miles
- **Beautiful UI**: Yellow search bar matching store locator design

### ✅ API Integration
- **API Route**: `/api/search-stores`
- **Apify Integration**: Calls `compass/crawler-google-places` actor
- **Result Transformation**: Converts Apify data to our Store format
- **20 Result Limit**: Returns top 20 locations beautifully organized

### ✅ Store Display
- **Store Cards**: Beautiful cards with all details
- **Google Maps**: Interactive map with markers
- **Service Filter**: Filter by service type (radio buttons)
- **Store Details**: Name, address, phone, website, services, ratings, hours

## Setup Required

### 1. Add Apify API Key
```bash
# Add to .env or Railway environment variables:
NEXT_PUBLIC_APIFY_API_KEY=your_apify_api_token_here
```

### 2. Add Google Maps API Key (for map display)
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## How It Works

1. **User searches** → Enters location/zip code + distance
2. **API calls Apify** → Sends search terms, location, max 20 results
3. **Apify scrapes** → Gets real Google Maps data
4. **Results transformed** → Converts to Store format
5. **Displayed beautifully** → Map + 20 store cards

## API Endpoint

**POST** `/api/search-stores`

**Request Body:**
```json
{
  "location": "Los Angeles, CA",
  "zipCode": "90001",
  "distance": 25,
  "loanType": "payday-loans",
  "apifyApiKey": "your_api_key"
}
```

**Response:**
```json
{
  "success": true,
  "stores": [
    {
      "id": "store-1",
      "name": "ABC Payday Loans",
      "address": "123 Main St",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90001",
      "phone": "(555) 123-4567",
      "coordinates": {"lat": 34.0522, "lng": -118.2437},
      "services": ["Payday Loan", "Check Cashing"],
      "rating": 4.5,
      "reviewCount": 120,
      "website": "https://example.com",
      "hours": {"Monday": "9 AM - 6 PM"}
    }
  ],
  "total": 20
}
```

## Search Terms Mapping

Automatically maps loan types to Apify search terms:
- `payday-loans` → ["payday loans", "cash advance", "payday advance"]
- `personal-loans` → ["personal loans", "unsecured loans", "installment loans"]
- `title-loans` → ["title loans", "car title loans", "auto title loans"]
- `check-cashing` → ["check cashing", "cash checks"]
- `pawn-loans` → ["pawn shop", "pawn loans"]
- `cash-for-gold` → ["cash for gold", "sell gold", "gold buyers"]

## Features

✅ **Real-time Search** - Live Apify API integration
✅ **20 Results** - Neatly organized and limited
✅ **Beautiful Display** - Professional store cards
✅ **Interactive Map** - Google Maps with markers
✅ **Service Filtering** - Filter by service type
✅ **Distance Filter** - Search within radius
✅ **Zip Code Support** - Search by zip code
✅ **Phone Links** - Click to call
✅ **Website Links** - Visit store websites
✅ **Ratings & Reviews** - Display ratings and review counts
✅ **Opening Hours** - Show store hours

## Cost Estimate

Apify pricing:
- Base: $4 per 1,000 places
- 20 results = ~$0.08 per search
- Additional details: $0.002 per place
- Reviews: $0.0005 per review

**Example**: 20 places with details = ~$0.12 per search

## Next Steps

1. **Get Apify API Key** → Sign up at apify.com
2. **Add to Environment** → Set `NEXT_PUBLIC_APIFY_API_KEY`
3. **Test Search** → Try searching for stores
4. **Scale** → System ready for production use

---

**Status**: Integration complete ✅
**Ready**: Just add API keys and deploy!

