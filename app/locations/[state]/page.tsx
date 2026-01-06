import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  getCitiesForState, 
  getStateData, 
  generateLocationPageUrl,
  getAllStates 
} from '@/lib/state-hubs';
import { getLoanTypes } from '@/lib/locations';
import type { Metadata } from 'next';

interface StatePageProps {
  params: Promise<{
    state: string;
  }>;
}

// State name mappings for better display
const STATE_NAMES: Record<string, string> = {
  'CA': 'California',
  'TX': 'Texas',
  'FL': 'Florida',
  'NY': 'New York',
  'IL': 'Illinois',
  'PA': 'Pennsylvania',
  'OH': 'Ohio',
  'GA': 'Georgia',
  'NC': 'North Carolina',
  'MI': 'Michigan',
  'NJ': 'New Jersey',
  'VA': 'Virginia',
  'WA': 'Washington',
  'AZ': 'Arizona',
  'MA': 'Massachusetts',
  'TN': 'Tennessee',
  'IN': 'Indiana',
  'MO': 'Missouri',
  'MD': 'Maryland',
  'WI': 'Wisconsin',
  'CO': 'Colorado',
  'MN': 'Minnesota',
  'SC': 'South Carolina',
  'AL': 'Alabama',
  'LA': 'Louisiana',
  'KY': 'Kentucky',
  'OR': 'Oregon',
  'OK': 'Oklahoma',
  'CT': 'Connecticut',
  'UT': 'Utah',
  'IA': 'Iowa',
  'NV': 'Nevada',
  'AR': 'Arkansas',
  'MS': 'Mississippi',
  'KS': 'Kansas',
  'NM': 'New Mexico',
  'NE': 'Nebraska',
  'WV': 'West Virginia',
  'ID': 'Idaho',
  'HI': 'Hawaii',
  'NH': 'New Hampshire',
  'ME': 'Maine',
  'RI': 'Rhode Island',
  'MT': 'Montana',
  'DE': 'Delaware',
  'SD': 'South Dakota',
  'ND': 'North Dakota',
  'AK': 'Alaska',
  'DC': 'District of Columbia',
  'VT': 'Vermont',
  'WY': 'Wyoming'
};

export async function generateStaticParams() {
  const states = getAllStates();
  return states.map(state => ({
    state: state.stateAbbr.toLowerCase()
  }));
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { state } = await params;
  const stateData = getStateData(state);
  
  if (!stateData) {
    return {
      title: 'State Not Found',
    };
  }

  const stateAbbr = stateData.stateAbbr;
  const stateName = STATE_NAMES[stateAbbr] || stateData.state;
  const cityCount = stateData.cityCount;

  return {
    title: `Payday Loans, Personal Loans & More in ${stateName} | ${cityCount}+ Cities`,
    description: `Find lenders in ${cityCount}+ ${stateName} cities. Compare rates for payday loans, personal loans, installment loans, and more. Browse cities including ${stateData.cities.slice(0, 5).map(c => c.city).join(', ')} and more.`,
  };
}

export default async function StateHubPage({ params }: StatePageProps) {
  try {
    const { state } = await params;
    const stateData = getStateData(state);
    
    if (!stateData || stateData.cities.length === 0) {
      console.error(`No state data found for: ${state}`);
      notFound();
    }

    const stateAbbr = stateData.stateAbbr;
    const cities = getCitiesForState(state);
    const loanTypes = getLoanTypes();
    const stateName = STATE_NAMES[stateAbbr] || stateData.state;

  // Group cities by priority for better organization
  const priority1Cities = cities.filter(c => c.priority === 1);
  const priority2Cities = cities.filter(c => c.priority === 2);
  const otherCities = cities.filter(c => c.priority > 2);

  return (
    <>
      {/* Hero Section */}
      <section className="category-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link> → <Link href="/loan-locator">Loan Locator</Link> → <span>{stateName}</span>
          </nav>
          
          <h1>Payday Loans, Personal Loans & More in {stateName}</h1>
          <p>
            Find lenders in {cities.length}+ {stateName} cities. Compare rates, read reviews, and apply online. 
            Serving {priority1Cities.length > 0 ? priority1Cities.slice(0, 3).map(c => c.city).join(', ') : cities[0]?.city} 
            {cities.length > 3 ? ` and ${cities.length - 3} more cities` : ''}.
          </p>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          {/* Loan Types Section */}
          <section className="state-loan-types" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--gray-900)' }}>
              Loan Types Available in {stateName}
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {loanTypes.map((loanType) => {
                const cityCount = cities.length;
                return (
                  <div 
                    key={loanType.slug}
                    style={{
                      background: 'white',
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      border: '1px solid var(--gray-200)',
                      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                    }}
                  >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--gray-900)' }}>
                      {loanType.name}
                    </h3>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--gray-600)', marginBottom: '1rem', lineHeight: 1.6 }}>
                      {loanType.description}
                    </p>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
                      Available in {cityCount} {cityCount === 1 ? 'city' : 'cities'}
                    </div>
                    <Link 
                      href={`/locations/${state.toLowerCase()}?type=${loanType.slug}`}
                      style={{
                        display: 'inline-block',
                        color: 'var(--primary-color)',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9375rem'
                      }}
                    >
                      Browse {loanType.name} Cities →
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>

          {/* City Directory - Priority 1 */}
          {priority1Cities.length > 0 && (
            <section className="state-cities-priority1" style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--gray-900)' }}>
                Major Cities in {stateName}
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                {priority1Cities.map((city) => (
                  <div key={city.slug} style={{ marginBottom: '0.5rem' }}>
                    <Link 
                      href={generateLocationPageUrl(city.slug, 'payday-loans')}
                      className="state-city-link"
                    >
                      <span style={{ fontWeight: 600 }}>{city.city}</span>
                      <span style={{ color: 'var(--gray-500)', marginLeft: '0.5rem' }}>
                        ({city.population.toLocaleString()})
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* City Directory - All Cities */}
          <section className="state-cities-all" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--gray-900)' }}>
              All Cities in {stateName} ({cities.length} {cities.length === 1 ? 'City' : 'Cities'})
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '0.75rem'
            }}>
              {cities.map((city) => (
                <Link 
                  key={city.slug}
                  href={generateLocationPageUrl(city.slug, 'payday-loans')}
                  className="state-city-link state-city-link-small"
                >
                  {city.city}
                </Link>
              ))}
            </div>
          </section>

          {/* State Statistics */}
          <section className="state-statistics" style={{ 
            background: 'var(--gray-50)', 
            padding: '2rem', 
            borderRadius: '0.75rem',
            marginBottom: '3rem'
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--gray-900)' }}>
              {stateName} Statistics
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                  {cities.length}
                </div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--gray-600)' }}>
                  Cities Served
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                  {stateData.totalPopulation.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--gray-600)' }}>
                  Total Population
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                  {loanTypes.length}
                </div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--gray-600)' }}>
                  Loan Types Available
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                  {cities.length * loanTypes.length}
                </div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--gray-600)' }}>
                  Location Pages
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--gray-900)' }}>
              Ready to Find Lenders in {stateName}?
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)', marginBottom: '2rem' }}>
              Use our loan locator tool to find lenders near you, or browse cities above to see location-specific information.
            </p>
            <div className="hero-buttons">
              <Link href="/loan-locator" className="btn btn-primary">
                Find Lenders Near Me
              </Link>
              <Link href="/" className="btn btn-secondary">
                Browse All States
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
    );
  } catch (error) {
    console.error('Error rendering state hub page:', error);
    notFound();
  }
}

