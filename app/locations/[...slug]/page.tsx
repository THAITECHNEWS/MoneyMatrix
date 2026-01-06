import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  getLoanTypeBySlug, 
  getLocationByCityState, 
  getStoresByService,
  generateLocationSlug 
} from '@/lib/locations';
import { generateLocationPageContent } from '@/lib/content-templates';
import StoreLocator from '@/components/StoreLocator';
import QuickQuoteWidget from '@/components/QuickQuoteWidget';
import FeaturedLenders from '@/components/FeaturedLenders';
import AffiliateLink from '@/components/AffiliateLink';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import type { Metadata } from 'next';

interface LocationPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

/**
 * Parse location URL slug into components
 * Example: ["payday-loans-in-los-angeles-ca"] -> { loanType: "payday-loans", city: "los-angeles", state: "ca" }
 */
function parseLocationSlug(slugArray: string[] | undefined): { loanType: string; city: string; state: string } | null {
  // Handle undefined or empty array
  if (!slugArray || !Array.isArray(slugArray) || slugArray.length === 0) {
    return null;
  }
  
  // Join the slug array back into a single string
  const slug = slugArray.join('/');
  
  // Ensure slug is not empty
  if (!slug || typeof slug !== 'string') {
    return null;
  }
  
  // Pattern: {loan-type}-in-{city}-{state}
  const match = slug.match(/^(.+)-in-(.+)-([a-z]{2})$/);
  if (!match || match.length < 4) {
    return null;
  }
  
  return {
    loanType: match[1],
    city: match[2],
    state: match[3],
  };
}

/**
 * Get featured lenders for a loan type and location
 * In production, this would fetch from a database or API
 */
function getFeaturedLenders(loanTypeSlug: string, city: string, state: string) {
  // Mock lender data - replace with real data from your database/API
  const lenders = [
    {
      id: 'lender-1',
      name: 'ACE Cash Express',
      logo: '/images/lenders/ace-cash-express.png',
      rating: 4.5,
      reviewCount: 1250,
      aprRange: '15% - 20%',
      minAmount: '$100',
      maxAmount: '$1,000',
      fundingTime: 'Same day',
      affiliateUrl: 'https://example.com/ace-apply',
      sponsored: true,
      highlights: ['Same-day funding', 'No credit check', 'Multiple locations', '24/7 online access']
    },
    {
      id: 'lender-2',
      name: 'Check Into Cash',
      logo: '/images/lenders/check-into-cash.png',
      rating: 4.3,
      reviewCount: 890,
      aprRange: '18% - 25%',
      minAmount: '$50',
      maxAmount: '$1,500',
      fundingTime: 'Same day',
      affiliateUrl: 'https://example.com/check-into-cash-apply',
      sponsored: true,
      highlights: ['Fast approval', 'Flexible terms', 'Online application', 'Customer support']
    },
    {
      id: 'lender-3',
      name: 'Advance America',
      logo: '/images/lenders/advance-america.png',
      rating: 4.2,
      reviewCount: 2100,
      aprRange: '16% - 22%',
      minAmount: '$100',
      maxAmount: '$1,000',
      fundingTime: 'Next business day',
      affiliateUrl: 'https://example.com/advance-america-apply',
      sponsored: false,
      highlights: ['Established lender', 'Transparent terms', 'Multiple payment options']
    },
    {
      id: 'lender-4',
      name: 'Speedy Cash',
      logo: '/images/lenders/speedy-cash.png',
      rating: 4.4,
      reviewCount: 1560,
      aprRange: '17% - 24%',
      minAmount: '$100',
      maxAmount: '$1,500',
      fundingTime: 'Same day',
      affiliateUrl: 'https://example.com/speedy-cash-apply',
      sponsored: false,
      highlights: ['Quick approval', 'Competitive rates', 'Online & in-store']
    },
    {
      id: 'lender-5',
      name: 'CashNetUSA',
      logo: '/images/lenders/cashnetusa.png',
      rating: 4.1,
      reviewCount: 3200,
      aprRange: '20% - 30%',
      minAmount: '$100',
      maxAmount: '$2,000',
      fundingTime: 'Same day',
      affiliateUrl: 'https://example.com/cashnetusa-apply',
      sponsored: false,
      highlights: ['Online only', 'Fast application', 'Direct deposit']
    }
  ];

  // Return top 5 lenders (mix of sponsored and regular)
  return lenders.slice(0, 5);
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const parsed = parseLocationSlug(slug);
    
    if (!parsed) {
      return {
        title: 'Location Not Found',
      };
    }
  
    const { loanType: loanTypeSlug, city, state } = parsed;
    const loanType = getLoanTypeBySlug(loanTypeSlug);
    const location = getLocationByCityState(city, state);
    
    if (!loanType || !location) {
      return {
        title: 'Location Not Found',
      };
    }

    // Generate metadata using templates
    const content = generateLocationPageContent(location, loanType);

    return {
      title: content.metaTitle,
      description: content.metaDescription,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Location Not Found',
      description: 'The requested location page could not be found.',
    };
  }
}

export default async function LocationPage({ params }: LocationPageProps) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      notFound();
    }
    
    const parsed = parseLocationSlug(slug);
    
    if (!parsed) {
      notFound();
    }
  
    const { loanType: loanTypeSlug, city, state } = parsed;
    const loanType = getLoanTypeBySlug(loanTypeSlug);
    const location = getLocationByCityState(city, state);
    
    if (!loanType || !location) {
      notFound();
    }

    // Use actual city name and state abbreviation from location data
    const stores = getStoresByService(loanTypeSlug, location.city, location.stateAbbr);
    
    // Generate content using templates
    const content = generateLocationPageContent(location, loanType);

    // Get featured lenders for monetization
    const featuredLenders = getFeaturedLenders(loanTypeSlug, location.city, location.stateAbbr);
    
    // Build location string for components
    const locationString = `${location.city}, ${location.stateAbbr}`;

    return (
    <>
      {/* Quick Quote Widget - Sticky Sidebar (Desktop) / Bottom Bar (Mobile) */}
      <QuickQuoteWidget 
        loanType={loanTypeSlug}
        location={locationString}
        position="right"
      />

      <section className="category-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link> → <Link href={`/${loanTypeSlug}`}>{loanType.name}</Link> → <span>{location.city}, {location.stateAbbr}</span>
          </nav>
          
          <h1>{loanType.name} Near {location.city}, {location.stateAbbr}</h1>
          <p>Find {loanType.name.toLowerCase()} locations near you in {location.city}, {location.state}. Compare rates, read reviews, and apply online. Search by zip code or location to find stores within your preferred distance.</p>
          
          {/* Primary CTA Button */}
          <div className="hero-buttons" style={{ marginTop: '1.5rem' }}>
            <Link 
              href="#lead-form" 
              className="btn btn-primary"
              style={{ fontSize: '1.125rem', padding: '0.875rem 2rem' }}
            >
              Get Matched with Top Lenders
            </Link>
            <Link 
              href="#store-locator" 
              className="btn btn-secondary"
              style={{ fontSize: '1.125rem', padding: '0.875rem 2rem' }}
            >
              Search Locations Near Me
            </Link>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          {/* Store Locator */}
          <div id="store-locator">
            <StoreLocator 
              stores={stores}
              centerLat={location.coordinates.lat}
              centerLng={location.coordinates.lng}
              defaultDistance={25}
              loanType={loanTypeSlug}
              defaultLocation={`${location.city}, ${location.stateAbbr}`}
            />
          </div>

          {/* Featured Lenders Section - Monetization */}
          <section style={{ marginTop: '4rem' }}>
            <FeaturedLenders 
              lenders={featuredLenders}
              loanType={loanTypeSlug}
              location={locationString}
              showSponsored={true}
            />
          </section>

          {/* Generated Content Sections */}
          {content.sections.map((section, index) => (
            <section key={index} style={{ marginTop: index === 0 ? '4rem' : '3rem' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem', fontWeight: 800 }}>
                {section.title}
              </h2>
              <div 
                className="article-body" 
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}

          {/* Comparison Table with Affiliate Links */}
          <section style={{ marginTop: '4rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem', fontWeight: 800 }}>
              Compare Top Lenders in {location.city}
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))', color: 'white' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700 }}>Lender</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700 }}>APR Range</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700 }}>Loan Amount</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700 }}>Funding Time</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 700 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {featuredLenders.slice(0, 5).map((lender, idx) => (
                    <tr key={lender.id} style={{ borderBottom: idx < featuredLenders.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <strong>{lender.name}</strong>
                          {lender.sponsored && (
                            <span style={{ background: '#f59e0b', color: 'white', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 700 }}>
                              Featured
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          ⭐ {lender.rating.toFixed(1)} ({lender.reviewCount.toLocaleString()} reviews)
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{lender.aprRange}</td>
                      <td style={{ padding: '1rem' }}>{lender.minAmount} - {lender.maxAmount}</td>
                      <td style={{ padding: '1rem' }}>{lender.fundingTime}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <AffiliateLink
                          href={lender.affiliateUrl}
                          lenderName={lender.name}
                          loanType={loanTypeSlug}
                          location={locationString}
                          source="location-page-comparison-table"
                          className="btn btn-primary"
                          trackClick={true}
                        >
                          Apply Now
                        </AffiliateLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem', fontStyle: 'italic' }}>
              * We may earn a commission if you apply through our links. This helps us provide free comparison services.
            </p>
          </section>

          {/* FAQ Section with Schema */}
          <section style={{ marginTop: '4rem' }}>
            <h2 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 800 }}>
              Frequently Asked Questions
            </h2>
            
            {/* Schema markup for FAQ */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: content.faqs.map(faq => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: faq.answer
                    }
                  }))
                })
              }}
            />
            
            <div className="feature-grid">
              {content.faqs.map((faq, index) => (
                <div key={index} className="feature-card">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Lead Capture Form Section - Monetization */}
          <section id="lead-form" style={{ marginTop: '4rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', padding: '3rem', borderRadius: '1rem', border: '2px solid var(--primary-color)' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#111827' }}>
                    Get Matched with Top Lenders in {location.city}
                  </h2>
                  <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151', marginBottom: '1.5rem' }}>
                    Fill out our quick form and we'll match you with the best {loanType.name.toLowerCase()} lenders in {location.city}, {location.stateAbbr}. 
                    Compare rates, terms, and get approved in minutes.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                    <li style={{ padding: '0.5rem 0', fontSize: '1rem', color: '#374151' }}>
                      ✓ Compare rates from multiple lenders
                    </li>
                    <li style={{ padding: '0.5rem 0', fontSize: '1rem', color: '#374151' }}>
                      ✓ Fast approval process
                    </li>
                    <li style={{ padding: '0.5rem 0', fontSize: '1rem', color: '#374151' }}>
                      ✓ No obligation to accept offers
                    </li>
                    <li style={{ padding: '0.5rem 0', fontSize: '1rem', color: '#374151' }}>
                      ✓ Free service - no hidden fees
                    </li>
                  </ul>
                </div>
                <div>
                  <LeadCaptureForm 
                    loanType={loanTypeSlug}
                    location={locationString}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section with Affiliate Links */}
          <section className="cta-section" style={{ marginTop: '4rem', borderRadius: '0.75rem' }}>
            <div className="container">
              <h2>Ready to Find {loanType.name} in {location.city}?</h2>
              <p>Compare top lenders and find the best rates for your needs.</p>
              <div className="hero-buttons">
                <Link href="#store-locator" className="btn btn-primary">Search Locations</Link>
                <Link href="#lead-form" className="btn btn-secondary">Get Matched</Link>
                <AffiliateLink
                  href="https://lendingtree.com"
                  lenderName="LendingTree"
                  loanType={loanTypeSlug}
                  location={locationString}
                  source="location-page-cta"
                  className="btn btn-secondary"
                >
                  Compare Top Lenders
                </AffiliateLink>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
    );
  } catch (error) {
    console.error('Error rendering location page:', error);
    notFound();
  }
}
