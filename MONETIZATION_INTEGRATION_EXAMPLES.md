# 💰 Monetization Integration Examples

## How to Add Monetization to Each Page Type

### Example 1: Location Page (`/locations/payday-loans-in-los-angeles-ca`)

```tsx
import QuickQuoteWidget from '@/components/QuickQuoteWidget';
import FeaturedLenders from '@/components/FeaturedLenders';
import AffiliateLink from '@/components/AffiliateLink';

export default async function LocationPage({ params }) {
  // ... existing code ...

  // Mock lender data (replace with real data)
  const featuredLenders = [
    {
      id: 'lender-1',
      name: 'ACE Cash Express',
      rating: 4.5,
      reviewCount: 1250,
      aprRange: '15% - 20%',
      minAmount: '$100',
      maxAmount: '$1,000',
      fundingTime: 'Same day',
      affiliateUrl: 'https://example.com/apply',
      sponsored: true,
      highlights: ['Same-day funding', 'No credit check', 'Multiple locations']
    },
    // ... more lenders
  ];

  return (
    <>
      {/* Existing hero section */}
      
      {/* Add Quick Quote Widget */}
      <QuickQuoteWidget 
        loanType="payday-loans"
        location="Los Angeles, CA"
        position="right"
      />

      <main className="main-content">
        {/* Existing content */}
        
        {/* Add Featured Lenders Section */}
        <FeaturedLenders 
          lenders={featuredLenders}
          loanType="payday-loans"
          location="Los Angeles, CA"
          showSponsored={true}
        />

        {/* Add affiliate links in comparison table */}
        <table>
          <tr>
            <td>Lender Name</td>
            <td>
              <AffiliateLink
                href="https://lender.com/apply"
                lenderName="Lender Name"
                loanType="payday-loans"
                location="Los Angeles, CA"
                source="location-page"
                className="btn btn-primary"
              >
                Apply Now
              </AffiliateLink>
            </td>
          </tr>
        </table>
      </main>
    </>
  );
}
```

---

### Example 2: State Hub Page (`/locations/california`)

```tsx
import QuickQuoteWidget from '@/components/QuickQuoteWidget';

export default async function StateHubPage({ params }) {
  // ... existing code ...

  return (
    <>
      {/* Existing hero */}
      
      {/* Add bottom sticky widget */}
      <QuickQuoteWidget 
        loanType="payday-loans"
        position="bottom"
      />

      <main>
        {/* Existing content */}
        
        {/* Add CTA section with affiliate links */}
        <section className="cta-section">
          <h2>Ready to Find Lenders in {stateName}?</h2>
          <div className="hero-buttons">
            <Link href="/loan-locator" className="btn btn-primary">
              Find Lenders Near Me
            </Link>
            <AffiliateLink
              href="https://lendingtree.com"
              lenderName="LendingTree"
              loanType="payday-loans"
              location={stateName}
              source="state-hub-page"
              className="btn btn-secondary"
            >
              Compare Top Lenders
            </AffiliateLink>
          </div>
        </section>
      </main>
    </>
  );
}
```

---

### Example 3: Compare Page (`/compare-personal-loans`)

```tsx
import FeaturedLenders from '@/components/FeaturedLenders';
import AffiliateLink from '@/components/AffiliateLink';
import SponsoredBadge from '@/components/SponsoredBadge';

export default function ComparePage() {
  const lenders = [
    // ... lender data
  ];

  return (
    <>
      {/* Comparison Table with Affiliate Links */}
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Lender</th>
            <th>APR</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {lenders.map((lender) => (
            <tr key={lender.id}>
              <td>
                {lender.name}
                {lender.sponsored && <SponsoredBadge />}
              </td>
              <td>{lender.aprRange}</td>
              <td>{lender.minAmount} - {lender.maxAmount}</td>
              <td>
                <AffiliateLink
                  href={lender.affiliateUrl}
                  lenderName={lender.name}
                  loanType="personal-loans"
                  source="compare-page"
                  className="btn btn-primary"
                >
                  Apply Now
                </AffiliateLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Featured Lenders Section */}
      <FeaturedLenders 
        lenders={lenders.filter(l => l.sponsored)}
        loanType="personal-loans"
        showSponsored={true}
      />
    </>
  );
}
```

---

### Example 4: Category Page (`/payday-loans`)

```tsx
import QuickQuoteWidget from '@/components/QuickQuoteWidget';
import FeaturedLenders from '@/components/FeaturedLenders';

export default function CategoryPage({ params }) {
  // ... existing code ...

  const topLenders = [
    // Top 5 lenders for this category
  ];

  return (
    <>
      {/* Existing hero */}
      
      {/* Add Quick Quote Widget */}
      <QuickQuoteWidget 
        loanType={categorySlug}
        position="right"
      />

      <main>
        {/* Existing articles section */}
        
        {/* Add Featured Lenders before CTA */}
        <FeaturedLenders 
          lenders={topLenders}
          loanType={categorySlug}
          showSponsored={true}
        />

        {/* Existing CTA section */}
      </main>
    </>
  );
}
```

---

## 🎯 Key Integration Points

### 1. **Above the Fold** (High Priority)
- Primary CTA button
- Quick quote widget (sticky)
- Featured lenders (top 3)

### 2. **Mid-Page** (Medium Priority)
- Comparison tables with affiliate links
- Lead capture forms
- Related lenders section

### 3. **Below Content** (Low Priority)
- Full lead form
- Newsletter signup
- Display ads (if using)

---

## 📊 Tracking Setup

### Google Analytics Events:
```javascript
// Track quick quote submissions
gtag('event', 'quick_quote_submit', {
  loan_type: 'payday-loans',
  location: 'Los Angeles, CA',
  amount: '500-1000'
});

// Track affiliate clicks
gtag('event', 'affiliate_click', {
  lender: 'ACE Cash Express',
  loan_type: 'payday-loans',
  location: 'Los Angeles, CA',
  sponsored: true
});

// Track lead form submissions
gtag('event', 'lead_submit', {
  loan_type: 'payday-loans',
  location: 'Los Angeles, CA',
  source: 'location-page'
});
```

---

## 🔧 Configuration

### Environment Variables:
```env
# Affiliate tracking
AFFILIATE_REF_ID=moneymatrix
AFFILIATE_NETWORK=lendingtree

# Lead generation
LEAD_WEBHOOK_URL=https://your-webhook.com/leads
CRM_API_KEY=your-api-key

# Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## ✅ Next Steps

1. **Add components to pages** (start with location pages)
2. **Set up tracking** (Google Analytics, conversion tracking)
3. **Integrate affiliate networks** (LendingTree, Bankrate, etc.)
4. **Test conversions** (A/B test placements)
5. **Optimize** (improve conversion rates)
6. **Scale** (add more lenders, optimize placements)

---

**Remember:** Monetization should enhance user experience, not detract from it. Test everything and optimize based on data!




