# Location Page Generation System

## Overview

This system automatically generates SEO-optimized location pages for all loan types and cities. Each page includes:

- **Store Locator Tool** - Interactive map and search functionality
- **Template-Generated Content** - Unique, location-specific content sections
- **FAQ Section** - With Schema.org markup for rich snippets
- **Optimized Metadata** - Title tags and descriptions for SEO

## Architecture

### Core Components

1. **Content Templates** (`lib/content-templates.ts`)
   - Generates unique content for each location/loan type combination
   - Includes sections: About, Neighborhoods, Regulations, Rates, How to Apply, Best Practices, Alternatives
   - Generates location-specific FAQs

2. **Location Page Component** (`app/locations/[loan-type]-in-[city]-[state]/page.tsx`)
   - Next.js dynamic route handler
   - Uses content templates to render pages
   - Includes Schema.org FAQ markup

3. **Management Scripts**
   - `scripts/generate-location-pages.ts` - Generates page configurations
   - `scripts/manage-locations.ts` - Central control for managing locations

## Content Templates

### Available Sections

Each location page includes these content sections:

1. **About Section** - Introduction to the loan type in the city
2. **Neighborhoods Section** - Top neighborhoods for finding lenders
3. **Regulations Section** - State-specific laws and requirements
4. **Rates Section** - Average rates and factors affecting pricing
5. **How to Apply Section** - Step-by-step application guide
6. **Best Practices Section** - Tips for choosing the right lender
7. **Alternatives Section** - Other options to consider

### FAQ Generation

Each page includes 8 location-specific FAQs with Schema.org markup for rich snippets in search results.

## Usage

### List Current Locations

```bash
npx ts-node scripts/manage-locations.ts list
```

### Generate Page Configurations

```bash
npx ts-node scripts/manage-locations.ts generate
```

This creates `data/generated-location-pages.json` with all page metadata.

### Validate System

```bash
npx ts-node scripts/manage-locations.ts validate
```

### Add New Location

```bash
npx ts-node scripts/manage-locations.ts add --city="New York" --state="New York" --stateAbbr="NY"
```

### Get Location Suggestions

```bash
npx ts-node scripts/manage-locations.ts suggestions
```

## Adding Locations

### Manual Method

Edit `data/locations.json`:

```json
{
  "locations": [
    {
      "city": "New York",
      "state": "New York",
      "stateAbbr": "NY",
      "zipCodes": ["10001", "10002", "10003"],
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      },
      "population": 8336817,
      "metroArea": "New York-Newark-Jersey City"
    }
  ]
}
```

### Using Management Script

```bash
npx ts-node scripts/manage-locations.ts add --city="New York" --state="New York" --stateAbbr="NY"
```

## URL Structure

Location pages follow this URL pattern:

```
/locations/{loan-type}-in-{city}-{state}
```

Examples:
- `/locations/payday-loans-in-los-angeles-ca`
- `/locations/personal-loans-in-chicago-il`
- `/locations/installment-loans-in-houston-tx`

## SEO Features

### Metadata
- Unique title tags: `{Loan Type} Near {City}, {State} | Find Locations & Compare Rates`
- Unique meta descriptions with location and loan type keywords
- Breadcrumb navigation

### Schema Markup
- FAQPage schema for rich snippets
- Question/Answer structured data

### Content Optimization
- Location-specific keywords throughout content
- Natural keyword density
- Internal linking opportunities
- Local SEO signals (neighborhoods, zip codes, metro areas)

## Scaling to 300 Locations

### Current Setup
- 5 locations × 7 loan types = 35 pages

### To Reach 300 Locations

1. **Add Locations**
   - Use `manage-locations.ts suggestions` for top cities
   - Add locations in batches using the management script
   - Target: 43 locations × 7 loan types = 301 pages

2. **Bulk Import** (Future Enhancement)
   - Create CSV import script
   - Import from location databases
   - Validate coordinates and population data

3. **Automated Generation**
   - Pages generate automatically via Next.js dynamic routes
   - No manual page creation needed
   - Content templates ensure uniqueness

## Content Customization

### Modify Templates

Edit `lib/content-templates.ts` to customize:
- Section content and structure
- FAQ questions and answers
- Neighborhood lists
- Regulation information
- Rate information

### Add New Sections

1. Create new function in `content-templates.ts`:
```typescript
export function generateNewSection(
  location: LocationData,
  loanType: LoanTypeData
): ContentSection {
  return {
    title: 'Section Title',
    content: '<p>Content HTML</p>',
    keywords: ['keyword1', 'keyword2']
  };
}
```

2. Add to `generateLocationPageContent()` function

## Performance Considerations

- Pages are server-rendered (SSR) for SEO
- Content is generated on-demand
- No build-time generation needed for new locations
- Sitemap includes all location pages automatically

## Monitoring

### Track Generated Pages

Check `data/generated-location-pages.json` for:
- Total page count
- URLs generated
- Content statistics

### Validate Content

Run validation before deployment:
```bash
npx ts-node scripts/manage-locations.ts validate
```

## Next Steps

1. **Add More Locations**
   - Target top 50-100 US cities
   - Focus on high-population areas
   - Prioritize cities with high search volume

2. **Enhance Content Templates**
   - Add real neighborhood data
   - Include actual regulation information
   - Add local business information

3. **Add Location-Specific Data**
   - Average rates by city
   - Number of lenders per city
   - Local market insights

4. **Automate Updates**
   - Scheduled content refresh
   - Automatic location data updates
   - Rate information updates







