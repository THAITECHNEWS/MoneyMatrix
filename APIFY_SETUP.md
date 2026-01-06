# Apify Google Maps Scraper - Setup Guide

## API Endpoint Used

**Synchronous Dataset Items Endpoint:**
```
POST https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=YOUR_TOKEN&format=json&limit=20
```

This endpoint:
- ✅ Runs synchronously (waits for completion)
- ✅ Returns dataset items directly (no polling needed)
- ✅ Faster and simpler than async endpoint
- ✅ Limits to 20 results automatically

## Environment Variables

Add to `.env` or Railway environment:

```bash
NEXT_PUBLIC_APIFY_API_KEY=your_apify_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

## How It Works

1. **User searches** → Enters location/zip code + distance
2. **API calls Apify** → Uses synchronous endpoint
3. **Apify scrapes** → Gets real Google Maps data (max 20 places)
4. **Results returned** → Transformed to Store format
5. **Displayed** → Map + 20 beautiful store cards

## Request Format

```json
{
  "searchTerms": ["payday loans", "cash advance"],
  "location": "Los Angeles, CA",
  "maxCrawledPlacesPerSearch": 20,
  "language": "en"
}
```

## Response Format

Apify returns array of places with:
- `title` - Store name
- `address` - Full address
- `city`, `state`, `postalCode` - Location details
- `phone`, `phoneUnformatted` - Phone numbers
- `location` - `{lat, lng}` coordinates
- `categories` - Array of category strings
- `totalScore` - Rating (0-5)
- `reviewsCount` - Number of reviews
- `website` - Store website URL
- `openingHours` - Array of `{day, hours}` objects
- `placeId` - Google Place ID
- `url` - Google Maps URL

## Cost

- Base: $4 per 1,000 places
- 20 results = ~$0.08 per search
- Additional details: $0.002 per place
- **Total per search: ~$0.12**

## Testing

Test the API endpoint:
```bash
curl -X POST https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=YOUR_TOKEN&format=json&limit=20 \
  -H "Content-Type: application/json" \
  -d '{
    "searchTerms": ["payday loans"],
    "location": "Los Angeles, CA",
    "maxCrawledPlacesPerSearch": 20
  }'
```

## Features

✅ **Synchronous API** - No polling, instant results
✅ **20 Result Limit** - Fast and cost-effective
✅ **Real Google Maps Data** - Actual store information
✅ **Beautiful Display** - Professional store cards
✅ **Interactive Map** - Google Maps integration
✅ **Service Filtering** - Filter by service type

---

**Status**: Ready to use! ✅
**Next**: Add API keys and test search functionality

