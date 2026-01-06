# Local SEO Store Locator System - Complete Plan

## 🎯 Overview

Build hundreds of location-based pages targeting exact-match local keywords to rank for "loans near me", "payday loans [city]", etc.

## 📍 URL Structure

```
/[loan-type]-in-[city]-[state]
/personal-loans-in-los-angeles-ca
/payday-loans-in-chicago-il
/installment-loans-in-houston-tx
/title-loans-in-phoenix-az
```

**Example URLs:**
- `/personal-loans-in-los-angeles-ca`
- `/payday-loans-in-chicago-il`
- `/installment-loans-in-houston-tx`
- `/title-loans-in-phoenix-az`
- `/check-cashing-in-miami-fl`

## 🔑 Target Keywords (Exact Match)

### Primary Keywords (High Volume)
1. **`[loan type] in [city] [state]`**
   - "personal loans in Los Angeles CA"
   - "payday loans in Chicago IL"
   - "installment loans in Houston TX"

2. **`[loan type] near [city]`**
   - "payday loans near me"
   - "title loans near Dallas"
   - "check cashing near Miami"

3. **`[loan type] [city] [state]`**
   - "payday loans Los Angeles California"
   - "title loans Chicago Illinois"

### Secondary Keywords
- `[loan type] locations [city]`
- `best [loan type] [city]`
- `[loan type] store [city]`
- `[loan type] shop [city]`

## 🏗️ System Architecture

### 1. Data Structure

```typescript
interface Location {
  city: string;
  state: string;
  stateAbbr: string;
  zipCodes: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  population: number;
  metroArea?: string;
}

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  services: string[]; // ["Payday Loan", "Installment Loan", etc.]
  hours?: {
    [day: string]: string;
  };
  rating?: number;
  reviewCount?: number;
}

interface LoanType {
  slug: string;
  name: string;
  keywords: string[];
  description: string;
}
```

### 2. Page Template Structure

Each location page will have:

1. **Hero Section**
   - H1: `[Loan Type] in [City], [State]`
   - Subtitle: "Find [Loan Type] locations near you"
   - Search bar (zip code)

2. **Map Section**
   - Google Maps with store markers
   - Filter by service type
   - Distance selector

3. **Store Listings**
   - Store cards with:
     - Name, address, phone
     - Distance from center
     - Services offered
     - Hours
     - Rating (if available)
   - Sortable (distance, rating, name)

4. **Content Section**
   - 500-800 words of unique content
   - Local references
   - FAQ section
   - Schema markup (LocalBusiness)

5. **CTA Section**
   - Lead generation form
   - "Apply Now" buttons
   - Affiliate links

## 🚀 Ranking Strategy

### 1. On-Page SEO
- **Title Tag**: `[Loan Type] in [City], [State] | Find Locations Near You`
- **Meta Description**: `Find [Loan Type] locations in [City], [State]. Compare rates, read reviews, and apply online. [X] locations available.`
- **H1**: Exact match keyword
- **H2s**: Related keywords
- **Schema Markup**: LocalBusiness, FAQPage, BreadcrumbList

### 2. Content Strategy
- **Unique Content**: AI-generated but location-specific
- **Local References**: Neighborhoods, landmarks, zip codes
- **FAQ Section**: Common questions about loans in that city
- **Internal Linking**: Link to related locations, loan guides

### 3. Technical SEO
- **Clean URLs**: `/personal-loans-in-los-angeles-ca` (no .html)
- **Fast Loading**: Optimized images, lazy loading
- **Mobile-First**: Responsive design
- **Sitemap**: Include all location pages
- **Internal Linking**: Hub pages → Location pages

### 4. Link Building
- **Local Citations**: Submit to local directories
- **City Pages**: Create hub pages for major cities
- **State Pages**: Create state-level landing pages
- **Internal Links**: Strong internal linking structure

## 💰 Monetization Strategy

### 1. Lead Generation Forms
- **Primary CTA**: "Get Matched with Lenders"
- **Form Fields**: Name, email, phone, loan amount, zip code
- **Value**: $5-50 per lead (depending on loan type)

### 2. Affiliate Links
- **"Apply Now" buttons** → Direct to lender applications
- **Commission**: $50-200 per approved application
- **Top Lenders**: Display prominently

### 3. Sponsored Listings
- **Premium Placement**: Top 3 positions
- **Featured Badges**: "Featured Lender"
- **Pricing**: $50-200/month per location

### 4. Google Ads
- **AdSense**: Display ads on location pages
- **Custom Ads**: Targeted loan ads

### 5. Data Licensing
- **API Access**: Sell store location data
- **Bulk Data**: Export for other platforms

## 📊 Data Sources

### 1. Google Maps Scraper (Apify)
- Scrape store locations
- Get addresses, phone numbers
- Extract services offered
- Get ratings/reviews

### 2. US Cities Database
- Top 500-1000 cities by population
- Zip codes per city
- Coordinates
- Metro area data

### 3. Loan Type Data
- Service categories
- Keywords per loan type
- Descriptions

## 🛠️ Implementation Plan

### Phase 1: Data Collection
1. Run Google Maps scraper for target cities
2. Clean and structure store data
3. Create location database
4. Generate loan type mappings

### Phase 2: Template Development
1. Create Next.js page template: `app/[loan-type]-in-[city]-[state]/page.tsx`
2. Build store locator component with Google Maps
3. Create store listing component
4. Add search/filter functionality

### Phase 3: Content Generation
1. Create AI prompts for location-specific content
2. Generate unique content for each location
3. Add FAQ sections
4. Create schema markup

### Phase 4: SEO Optimization
1. Generate metadata for all pages
2. Create sitemap with all locations
3. Set up internal linking structure
4. Add breadcrumbs

### Phase 5: Monetization
1. Integrate lead generation forms
2. Add affiliate links
3. Set up sponsored listing system
4. Configure Google Ads

## 📈 Scaling Strategy

### Initial Launch
- **Top 100 cities** by population
- **5 loan types**: Personal Loans, Payday Loans, Installment Loans, Title Loans, Check Cashing
- **Total Pages**: 500 pages

### Expansion
- **500 cities**: Top 500 US cities
- **10 loan types**: Add more services
- **Total Pages**: 5,000 pages

### Full Scale
- **1,000+ cities**: All major cities
- **15+ loan types**: Complete coverage
- **Total Pages**: 15,000+ pages

## 🎨 Page Template Example

```
/[loan-type]-in-[city]-[state]
├── Hero: "Payday Loans in Los Angeles, CA"
├── Map: Google Maps with store markers
├── Search: Zip code + distance filter
├── Store List: Cards with details
├── Content: 500-800 words unique content
├── FAQ: Common questions
├── CTA: Lead form + affiliate links
└── Schema: LocalBusiness markup
```

## 🔧 Technical Requirements

### Next.js Structure
```
app/
├── [loan-type]-in-[city]-[state]/
│   └── page.tsx              # Location page template
├── locations/
│   ├── [city]/
│   │   └── page.tsx          # City hub page
│   └── [state]/
│       └── page.tsx          # State hub page
└── store-locator/
    └── page.tsx              # Main store locator
```

### Components Needed
- `StoreLocator.tsx` - Main map component
- `StoreCard.tsx` - Store listing card
- `LocationSearch.tsx` - Search/filter component
- `LeadForm.tsx` - Lead generation form
- `StoreMap.tsx` - Google Maps integration

### Data Files
- `data/locations.json` - City/state data
- `data/stores.json` - Store locations
- `data/loan-types.json` - Loan type definitions

## 📊 Expected Results

### Traffic
- **Month 1-3**: 1,000-5,000 visitors/month
- **Month 4-6**: 10,000-25,000 visitors/month
- **Month 7-12**: 50,000-100,000 visitors/month

### Rankings
- **Top 10**: 50-100 keywords within 6 months
- **Top 3**: 20-50 keywords within 12 months

### Revenue
- **Leads**: $500-2,000/month (Month 1-3)
- **Affiliates**: $1,000-5,000/month (Month 4-6)
- **Total**: $5,000-20,000/month (Month 7-12)

## ✅ Next Steps

1. **Set up data structure** - Create location/store schemas
2. **Run Google Maps scraper** - Collect store data
3. **Build page template** - Create Next.js location page
4. **Generate content** - AI-powered location content
5. **Deploy & monitor** - Track rankings and revenue

---

**Ready to build?** This system can generate thousands of ranking pages and significant revenue from local loan searches.

