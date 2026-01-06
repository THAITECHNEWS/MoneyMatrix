import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  getCitiesForState, 
  getStateData, 
  generateLocationPageUrl,
  getAllStates,
  STATE_NAMES,
  normalizeStateInput
} from '@/lib/state-hubs';
import { getLoanTypes } from '@/lib/locations';
import type { Metadata } from 'next';

interface StatePageProps {
  params: Promise<{
    state: string;
  }>;
}

export async function generateStaticParams() {
  const states = getAllStates();
  // Generate slugs using state names (e.g., "california", "texas")
  // normalizeStateInput will handle conversion to abbreviations internally
  return states.map(state => {
    // Convert state name to slug (e.g., "California" -> "california")
    const stateSlug = state.state.toLowerCase().replace(/\s+/g, '-');
    return {
      state: stateSlug,
    };
  });
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { state } = await params;
  const stateAbbr = normalizeStateInput(state);
  const stateData = getStateData(stateAbbr);
  
  if (!stateData || stateData.cities.length === 0) {
    return {
      title: 'State Not Found',
      description: 'The requested state page could not be found.',
    };
  }

  const stateName = STATE_NAMES[stateAbbr] || stateData.state;

  return {
    title: `Payday Loans & Personal Loans in ${stateName} | MoneyMatrix`,
    description: `Find lenders in ${stateData.cities.length}+ ${stateName} cities. Compare rates, read reviews, and apply online. Serving ${stateData.cities.slice(0, 5).map(c => c.city).join(', ')} and more.`,
  };
}

export default async function StateHubPage({ params }: StatePageProps) {
  try {
    const { state } = await params;
    const stateAbbr = normalizeStateInput(state);
    const stateData = getStateData(stateAbbr);
    
    if (!stateData || stateData.cities.length === 0) {
      console.error(`No state data found for: ${state}`);
      notFound();
    }

    const cities = getCitiesForState(stateAbbr);
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
            <section className="state-loan-types">
              <h2 className="state-section-title">
                Loan Types Available in {stateName}
              </h2>
              <div className="loan-type-grid">
                {loanTypes.map((loanType) => {
                  const cityCount = cities.length;
                  return (
                    <div key={loanType.slug} className="loan-type-card">
                      <h3 className="loan-type-title">
                        {loanType.name}
                      </h3>
                      <p className="loan-type-description">
                        {loanType.description}
                      </p>
                      <div className="loan-type-cities-count">
                        Available in {cityCount} {cityCount === 1 ? 'city' : 'cities'}
                      </div>
                      <Link 
                        href={generateLocationPageUrl(cities[0]?.slug || 'los-angeles-ca', loanType.slug)}
                        className="loan-type-link"
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
              <section className="state-cities-priority1">
                <h2 className="state-section-title">
                  Major Cities in {stateName}
                </h2>
                <div className="city-grid-priority1">
                  {priority1Cities.map((city) => (
                    <div key={city.slug}>
                      <Link 
                        href={generateLocationPageUrl(city.slug, 'payday-loans')}
                        className="state-city-link"
                      >
                        <span className="city-name">{city.city}</span>
                        <span className="city-population">
                          ({city.population.toLocaleString()})
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* City Directory - All Cities */}
            <section className="state-cities-all">
              <h2 className="state-section-title">
                All Cities in {stateName} ({cities.length} {cities.length === 1 ? 'City' : 'Cities'})
              </h2>
              <div className="city-grid-all">
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
            <section className="state-statistics">
              <h2 className="state-section-title">
                {stateName} Statistics
              </h2>
              <div className="stats-grid">
                <div>
                  <div className="stat-number">
                    {cities.length}
                  </div>
                  <div className="stat-label">
                    Cities Served
                  </div>
                </div>
                <div>
                  <div className="stat-number">
                    {stateData.totalPopulation.toLocaleString()}
                  </div>
                  <div className="stat-label">
                    Total Population
                  </div>
                </div>
                <div>
                  <div className="stat-number">
                    {loanTypes.length}
                  </div>
                  <div className="stat-label">
                    Loan Types Available
                  </div>
                </div>
                <div>
                  <div className="stat-number">
                    {cities.length * loanTypes.length}
                  </div>
                  <div className="stat-label">
                    Location Pages
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
              <h2 className="cta-title">
                Ready to Find Lenders in {stateName}?
              </h2>
              <p className="cta-description">
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

