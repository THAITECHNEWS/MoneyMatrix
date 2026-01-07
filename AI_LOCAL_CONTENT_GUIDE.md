# AI-Powered Local Content Generation Guide

## 🎯 Goal: Create Unique, Ranking Content for Every Location Page

### Current Setup:
- ✅ OpenAI API configured (`OPENAI_API_KEY`)
- ✅ Content templates exist (`lib/content-templates.ts`)
- ✅ GPT-5.2 setup documented
- ⚠️ Need: Enhanced AI prompts for local SEO

---

## 🔥 Critical Local SEO Elements for Ranking

### 1. **Geographic Signals** (MUST HAVE)
- City name mentioned 15-20 times naturally
- State name mentioned 8-10 times
- Zip codes mentioned 3-5 times
- Neighborhood names (5-7 specific neighborhoods)
- Metro area mentioned
- Landmarks/local references

### 2. **Local Business Data** (MUST HAVE)
- Actual lender names in the area
- Real addresses (or general areas)
- Business hours (if available)
- Phone numbers (if available)
- Local reviews/ratings

### 3. **Local Regulations** (HIGH PRIORITY)
- State-specific loan laws
- City-specific regulations (if any)
- Maximum loan amounts by state
- Interest rate caps by state
- Repayment term restrictions

### 4. **Local Demographics** (HIGH PRIORITY)
- City population
- Median income
- Average credit score in area
- Employment statistics
- Cost of living data

### 5. **Local Neighborhoods** (CRITICAL)
- 5-7 actual neighborhoods (not generic)
- Specific areas where lenders are located
- Neighborhood characteristics
- Distance from city center

### 6. **Local Statistics** (HIGH PRIORITY)
- Average loan amounts in the city
- Average interest rates
- Number of lenders in area
- Loan volume statistics
- Market trends

### 7. **Local FAQs** (CRITICAL FOR RICH SNIPPETS)
- 8-10 location-specific questions
- Schema.org FAQ markup
- Answers include city/state names
- Address common local concerns

### 8. **Internal Linking** (HIGH PRIORITY)
- Links to state hub page
- Links to other loan types in same city
- Links to nearby cities
- Links to state/loan-type pages

### 9. **Structured Data** (CRITICAL)
- LocalBusiness schema
- FAQPage schema
- BreadcrumbList schema
- Review schema (if available)

### 10. **Content Uniqueness** (CRITICAL)
- No duplicate content across pages
- City-specific examples
- Local references
- Unique statistics per city

---

## 🤖 AI Content Generation Strategy

### Current System:
You have templates that generate basic content, but need AI enhancement for:
- Unique neighborhood names per city
- Local statistics and data
- City-specific examples
- Natural language variation

### Enhanced AI Prompt Template:

```typescript
const AI_PROMPT = `
You are an expert SEO content writer specializing in local financial services content.

Generate comprehensive, unique content for a location page about {LOAN_TYPE} in {CITY}, {STATE}.

CRITICAL REQUIREMENTS:

1. GEOGRAPHIC SIGNALS:
   - Mention "{CITY}" 15-20 times naturally throughout the content
   - Mention "{STATE}" 8-10 times
   - Include these zip codes: {ZIP_CODES}
   - Mention metro area: {METRO_AREA}
   - Include 5-7 REAL neighborhood names from {CITY} (research actual neighborhoods)

2. LOCAL DATA:
   - City population: {POPULATION}
   - Use this to provide context about market size
   - Reference local demographics naturally

3. STATE REGULATIONS:
   - State abbreviation: {STATE_ABBR}
   - Research and include actual {STATE} regulations for {LOAN_TYPE}
   - Maximum loan amounts in {STATE}
   - Interest rate caps in {STATE}
   - Repayment term restrictions

4. CONTENT SECTIONS (generate 200-400 words each):

   Section 1: About {LOAN_TYPE} in {CITY}
   - Introduction mentioning {CITY} and {STATE}
   - Why {LOAN_TYPE} are popular in {CITY}
   - Local market overview
   - Include population context

   Section 2: Top Neighborhoods for {LOAN_TYPE} in {CITY}
   - List 5-7 REAL neighborhoods in {CITY}
   - For each neighborhood, mention:
     * Why it's good for {LOAN_TYPE}
     * Characteristics of the area
     * Distance from city center
   - Use actual neighborhood names (research {CITY} neighborhoods)

   Section 3: {LOAN_TYPE} Regulations in {CITY}, {STATE}
   - {STATE}-specific laws
   - Maximum loan amounts
   - Interest rate caps
   - Repayment terms
   - Licensing requirements
   - How regulations affect borrowers in {CITY}

   Section 4: Average Rates and Fees in {CITY}
   - Typical interest rates in {CITY}
   - Average loan amounts
   - Fee structures
   - Factors affecting rates in {CITY}
   - Comparison to state/national averages

   Section 5: How to Apply for {LOAN_TYPE} in {CITY}
   - Step-by-step process
   - Required documents
   - Where to apply (mention neighborhoods)
   - Online vs in-person options
   - Timeline for approval

   Section 6: Best Practices for {LOAN_TYPE} in {CITY}
   - Tips specific to {CITY} borrowers
   - How to compare lenders
   - Red flags to avoid
   - Local resources

   Section 7: Alternatives to {LOAN_TYPE} in {CITY}
   - Other loan types available
   - Credit unions in {CITY}
   - Local financial assistance programs
   - When to consider alternatives

5. FAQs (generate 8-10 questions, 100-200 words each):
   - Questions should include "{CITY}" or "{STATE}" in them
   - Examples:
     * "What are the maximum {LOAN_TYPE} amounts in {CITY}?"
     * "Are {LOAN_TYPE} legal in {STATE}?"
     * "Where can I find {LOAN_TYPE} lenders in {CITY}?"
     * "What are the interest rates for {LOAN_TYPE} in {CITY}?"
   - Answers must be specific to {CITY} and {STATE}
   - Include local regulations, rates, and examples

6. WRITING STYLE:
   - Natural, conversational tone
   - Avoid keyword stuffing
   - Use variations: "{CITY}", "in {CITY}", "{CITY} residents", "the {CITY} area"
   - Include local context and examples
   - Write as if you're a local expert

7. UNIQUENESS:
   - This content must be 100% unique
   - Do NOT use generic templates
   - Include city-specific details
   - Reference actual local characteristics
   - Use different phrasing than other location pages

OUTPUT FORMAT:
Return JSON with this structure:
{
  "sections": [
    {
      "title": "Section Title",
      "content": "HTML content with <p>, <ul>, <li> tags",
      "keywords": ["keyword1", "keyword2"]
    }
  ],
  "faqs": [
    {
      "question": "Question text",
      "answer": "Answer text (100-200 words)"
    }
  ],
  "metaTitle": "SEO-optimized title",
  "metaDescription": "SEO-optimized description (150-160 characters)"
}

LOCATION DATA:
- City: {CITY}
- State: {STATE}
- State Abbr: {STATE_ABBR}
- Population: {POPULATION}
- Zip Codes: {ZIP_CODES}
- Metro Area: {METRO_AREA}
- Coordinates: {LAT}, {LNG}

LOAN TYPE DATA:
- Name: {LOAN_TYPE_NAME}
- Description: {LOAN_TYPE_DESCRIPTION}
- Keywords: {LOAN_TYPE_KEYWORDS}

Generate content now:
`;
```

---

## 📋 Complete Page Structure for Maximum Ranking

### Page Elements Checklist:

#### 1. **Hero Section**
```html
<h1>{LOAN_TYPE} in {CITY}, {STATE}: Find Lenders Near You</h1>
<p>Compare {LOAN_TYPE} rates from {NUMBER} lenders in {CITY}, {STATE}. 
   Serving {NEIGHBORHOOD_1}, {NEIGHBORHOOD_2}, {NEIGHBORHOOD_3} and {TOTAL_CITIES} more areas.</p>
```

**Local Signals:**
- City name in H1
- State name in H1
- Neighborhood names
- Number of lenders
- Service area mention

#### 2. **Breadcrumbs** (Schema.org)
```html
<nav>
  Home → Loan Locator → {STATE} → {CITY} → {LOAN_TYPE}
</nav>
```

#### 3. **Store Locator Tool**
- Interactive map centered on {CITY}
- Search by zip code
- Filter by distance
- Shows actual lender locations

#### 4. **About Section** (200-400 words)
- City name: 5-7 mentions
- State name: 3-4 mentions
- Population context
- Local market overview
- Why {LOAN_TYPE} are popular in {CITY}

#### 5. **Neighborhoods Section** (300-500 words)
- 5-7 REAL neighborhoods
- Each with:
  - Why it's good for {LOAN_TYPE}
  - Distance from city center
  - Characteristics
  - Lender concentration
- Links to neighborhood-specific searches

#### 6. **Regulations Section** (300-400 words)
- {STATE}-specific laws
- Maximum loan amounts
- Interest rate caps
- Repayment terms
- Licensing requirements
- How it affects {CITY} borrowers

#### 7. **Rates Section** (300-400 words)
- Average rates in {CITY}
- Comparison to {STATE} average
- Comparison to national average
- Factors affecting rates
- Fee structures
- Local market trends

#### 8. **How to Apply Section** (200-300 words)
- Step-by-step process
- Required documents
- Where to apply (mention neighborhoods)
- Online vs in-person
- Timeline
- {CITY}-specific tips

#### 9. **Best Practices Section** (200-300 words)
- Tips for {CITY} borrowers
- How to compare lenders
- Red flags
- Local resources
- {CITY}-specific advice

#### 10. **Alternatives Section** (200-300 words)
- Other loan types in {CITY}
- Credit unions
- Financial assistance programs
- When to consider alternatives

#### 11. **FAQs Section** (8-10 questions)
- Schema.org FAQPage markup
- Questions include {CITY} or {STATE}
- Detailed answers (100-200 words)
- Local-specific information

#### 12. **Featured Lenders Section**
- Real lender names
- Ratings
- Locations in {CITY}
- Links to apply

#### 13. **Internal Links Section**
- Link to state hub: `/locations/{STATE}`
- Link to state/loan-type: `/locations/{STATE}/{LOAN_TYPE}`
- Links to other loan types in {CITY}
- Links to nearby cities

#### 14. **Structured Data** (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{LOAN_TYPE} Lenders in {CITY}",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "{CITY}",
    "addressRegion": "{STATE_ABBR}",
    "postalCode": "{ZIP_CODE}"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "{LAT}",
    "longitude": "{LNG}"
  },
  "areaServed": {
    "@type": "City",
    "name": "{CITY}"
  }
}
```

---

## 🚀 Implementation: Enhanced AI Content Generator

### Step 1: Create Enhanced AI Content Service

Create: `lib/ai-content-service.ts`

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface LocationData {
  city: string;
  state: string;
  stateAbbr: string;
  population: number;
  zipCodes: string[];
  metroArea?: string;
  coordinates: { lat: number; lng: number };
}

interface LoanTypeData {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
}

export async function generateAIContent(
  location: LocationData,
  loanType: LoanTypeData
): Promise<{
  sections: Array<{ title: string; content: string; keywords: string[] }>;
  faqs: Array<{ question: string; answer: string }>;
  metaTitle: string;
  metaDescription: string;
}> {
  const prompt = buildAIPrompt(location, loanType);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert SEO content writer specializing in local financial services. Generate unique, location-specific content that ranks well in search engines.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
}

function buildAIPrompt(location: LocationData, loanType: LoanTypeData): string {
  return `
Generate comprehensive, unique SEO content for: ${loanType.name} in ${location.city}, ${location.state}

CRITICAL LOCAL SEO REQUIREMENTS:

1. GEOGRAPHIC SIGNALS (MUST INCLUDE):
   - Mention "${location.city}" 15-20 times naturally
   - Mention "${location.state}" 8-10 times
   - Include zip codes: ${location.zipCodes.join(', ')}
   - Metro area: ${location.metroArea || 'N/A'}
   - Include 5-7 REAL neighborhood names from ${location.city}
   - Population: ${location.population.toLocaleString()}

2. STATE REGULATIONS:
   - Research ${location.stateAbbr} regulations for ${loanType.name}
   - Include maximum loan amounts
   - Interest rate caps
   - Repayment term restrictions

3. GENERATE 7 CONTENT SECTIONS (200-400 words each):
   - About ${loanType.name} in ${location.city}
   - Top Neighborhoods (use REAL neighborhood names)
   - Regulations in ${location.city}, ${location.state}
   - Rates and Fees in ${location.city}
   - How to Apply in ${location.city}
   - Best Practices for ${location.city} borrowers
   - Alternatives in ${location.city}

4. GENERATE 8-10 FAQs:
   - Questions must include "${location.city}" or "${location.state}"
   - Answers 100-200 words each
   - Include local regulations and rates

5. META DATA:
   - Title: ${loanType.name} in ${location.city}, ${location.state} | Find Lenders & Compare Rates
   - Description: 150-160 characters mentioning ${location.city} and ${location.state}

OUTPUT JSON FORMAT:
{
  "sections": [
    {"title": "...", "content": "<p>...</p>", "keywords": ["..."]}
  ],
  "faqs": [
    {"question": "...", "answer": "..."}
  ],
  "metaTitle": "...",
  "metaDescription": "..."
}

Make content 100% unique. Use actual ${location.city} neighborhoods and local context.
`;
}
```

### Step 2: Enhance Location Page Component

Update: `app/locations/[...slug]/page.tsx`

```typescript
import { generateAIContent } from '@/lib/ai-content-service';
import { generateLocationPageContent } from '@/lib/content-templates';

// In the page component:
const aiContent = await generateAIContent(location, loanType).catch(() => null);
const templateContent = generateLocationPageContent(location, loanType);

// Use AI content if available, fallback to templates
const content = aiContent || templateContent;
```

### Step 3: Add Caching

Create: `lib/content-cache.ts`

```typescript
import fs from 'fs';
import path from 'path';

const CACHE_DIR = '.cache/ai-content';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getCachedContent(
  city: string,
  stateAbbr: string,
  loanTypeSlug: string
): any | null {
  const cacheFile = path.join(
    CACHE_DIR,
    `${loanTypeSlug}-${city}-${stateAbbr}.json`
  );

  if (!fs.existsSync(cacheFile)) return null;

  const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
  const age = Date.now() - cached.timestamp;

  if (age > CACHE_DURATION) {
    fs.unlinkSync(cacheFile);
    return null;
  }

  return cached.content;
}

export function saveCachedContent(
  city: string,
  stateAbbr: string,
  loanTypeSlug: string,
  content: any
): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const cacheFile = path.join(
    CACHE_DIR,
    `${loanTypeSlug}-${city}-${stateAbbr}.json`
  );

  fs.writeFileSync(
    cacheFile,
    JSON.stringify({ content, timestamp: Date.now() }, null, 2)
  );
}
```

---

## 📊 Local SEO Ranking Factors (Priority Order)

### Tier 1: CRITICAL (Must Have)
1. **City name in H1** - 100% of pages
2. **State name in H1** - 100% of pages
3. **City name density** - 15-20 mentions naturally
4. **Real neighborhood names** - 5-7 per page
5. **Zip codes** - 3-5 mentioned
6. **LocalBusiness schema** - JSON-LD markup
7. **FAQ schema** - For rich snippets
8. **Unique content** - No duplication

### Tier 2: HIGH PRIORITY (Should Have)
9. **State regulations** - Specific to state
10. **Local statistics** - Rates, amounts, etc.
11. **Internal linking** - To state/city hubs
12. **Local lender names** - Real businesses
13. **Metro area mention** - Geographic context
14. **Population context** - Market size

### Tier 3: MEDIUM PRIORITY (Nice to Have)
15. **Local landmarks** - City-specific references
16. **Demographics** - Income, credit scores
17. **Local news/trends** - Recent developments
18. **Reviews/ratings** - Local business reviews
19. **Images** - City-specific images
20. **Videos** - Local content

---

## 🎯 Content Uniqueness Strategy

### How to Ensure Each Page is Unique:

1. **Neighborhood Variation:**
   - Each city gets different neighborhoods
   - Research actual neighborhoods per city
   - Vary descriptions

2. **Statistics Variation:**
   - Different rates per city
   - Different loan amounts
   - Different lender counts

3. **Regulation Variation:**
   - State-specific regulations
   - City-specific rules (if any)
   - Vary examples

4. **Language Variation:**
   - Different phrasing
   - Different sentence structures
   - Different examples

5. **Local Context:**
   - City-specific demographics
   - Local economic factors
   - Regional trends

---

## 🔧 Data Sources for Local Content

### 1. **Neighborhood Data:**
- Google Maps API
- Wikipedia city pages
- Local government websites
- Real estate sites (Zillow, Trulia)

### 2. **Regulation Data:**
- State financial department websites
- CFPB state regulations
- Legal databases
- State-specific loan laws

### 3. **Statistics Data:**
- Census data
- BLS employment data
- Credit score data by city
- Loan volume data (if available)

### 4. **Lender Data:**
- Google My Business API
- Apify Google Maps Scraper (you have this)
- Yelp API
- Better Business Bureau

---

## 📝 Complete Page Template

### Structure:
```
1. Hero Section (H1, description, breadcrumbs)
2. Store Locator Tool (interactive map)
3. About Section (200-400 words)
4. Neighborhoods Section (300-500 words)
5. Regulations Section (300-400 words)
6. Rates Section (300-400 words)
7. How to Apply Section (200-300 words)
8. Best Practices Section (200-300 words)
9. Alternatives Section (200-300 words)
10. Featured Lenders Section
11. FAQs Section (8-10 questions with schema)
12. Internal Links Section
13. Structured Data (JSON-LD)
```

**Total Word Count:** 2,000-3,500 words per page
**City Mentions:** 15-20 times
**State Mentions:** 8-10 times
**Neighborhoods:** 5-7 real neighborhoods
**Zip Codes:** 3-5 mentioned

---

## 🚀 Quick Start Implementation

### Option 1: Enhance Existing Templates (Fastest)
- Add AI enhancement to `lib/content-templates.ts`
- Use AI to generate neighborhoods per city
- Use AI to enhance existing sections

### Option 2: Full AI Generation (Best Quality)
- Create `lib/ai-content-service.ts`
- Generate all content via AI
- Cache results for 7 days
- Fallback to templates if AI fails

### Option 3: Hybrid Approach (Recommended)
- Use templates for structure
- Use AI to enhance:
  - Neighborhood names
  - Local statistics
  - Unique phrasing
  - FAQs

---

## 💰 Cost Estimation

### AI API Costs:
- GPT-4o: ~$0.03 per page (4K tokens)
- 2,100 pages × $0.03 = $63 one-time
- Cached for 7 days = ~$9/month to refresh

### ROI:
- 2,100 pages with unique content
- Better rankings = more traffic
- $63 investment for thousands of pages

---

## ✅ Next Steps

1. **Create AI content service** (`lib/ai-content-service.ts`)
2. **Enhance prompts** with local SEO requirements
3. **Add caching** to reduce API costs
4. **Test on 10 pages** first
5. **Scale to all 2,100 pages**
6. **Monitor rankings** and adjust

---

## 📋 Checklist for Each Page

- [ ] City name in H1
- [ ] State name in H1
- [ ] City mentioned 15-20 times
- [ ] State mentioned 8-10 times
- [ ] 5-7 real neighborhoods listed
- [ ] 3-5 zip codes mentioned
- [ ] State regulations included
- [ ] Local statistics included
- [ ] 8-10 location-specific FAQs
- [ ] FAQ schema markup
- [ ] LocalBusiness schema
- [ ] Internal links to state/city hubs
- [ ] Unique content (no duplication)
- [ ] 2,000+ words total
- [ ] Store locator tool included
- [ ] Featured lenders section
- [ ] Breadcrumb navigation

---

**Ready to implement?** Start with the AI content service and test on a few pages first!


