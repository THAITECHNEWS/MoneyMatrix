/**
 * Content Templates for Location Pages
 * These templates generate unique, SEO-optimized content for each location
 */

export interface LocationData {
  city: string;
  state: string;
  stateAbbr: string;
  population: number;
  metroArea?: string;
  zipCodes: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface LoanTypeData {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
}

export interface ContentSection {
  title: string;
  content: string;
  keywords: string[];
}

/**
 * Generate neighborhoods section content
 */
export function generateNeighborhoodsSection(
  location: LocationData,
  loanType: LoanTypeData
): ContentSection {
  // Common neighborhoods for major cities (can be expanded with real data)
  const neighborhoodTemplates: Record<string, string[]> = {
    'los angeles': ['Downtown LA', 'Hollywood', 'Santa Monica', 'Beverly Hills', 'West Hollywood', 'Pasadena', 'Long Beach'],
    'chicago': ['The Loop', 'Lincoln Park', 'Wicker Park', 'Lakeview', 'River North', 'Gold Coast', 'Hyde Park'],
    'houston': ['Downtown', 'Montrose', 'The Heights', 'Midtown', 'Rice Village', 'Galleria', 'Katy'],
    'phoenix': ['Downtown Phoenix', 'Scottsdale', 'Tempe', 'Mesa', 'Glendale', 'Chandler', 'Peoria'],
    'philadelphia': ['Center City', 'Old City', 'Rittenhouse Square', 'Fishtown', 'Northern Liberties', 'University City', 'Manayunk'],
  };

  const cityKey = location.city.toLowerCase();
  const neighborhoods = neighborhoodTemplates[cityKey] || [
    'Downtown', 'Midtown', 'North Side', 'South Side', 'East Side', 'West Side', 'Central District'
  ];

  const selectedNeighborhoods = neighborhoods.slice(0, 6);
  
  let content = `<p>${location.city} offers several neighborhoods where ${loanType.name.toLowerCase()} services are readily available. Here are the top areas to find ${loanType.name.toLowerCase()} providers:</p><ul>`;
  
  selectedNeighborhoods.forEach((neighborhood, index) => {
    const isPopular = index < 3;
    content += `<li><strong>${neighborhood}</strong> - ${isPopular ? 'One of the most popular areas' : 'A great option'} for ${loanType.name.toLowerCase()} in ${location.city}. ${isPopular ? 'High concentration of lenders' : 'Convenient locations'} make it easy to find the right provider.</li>`;
  });
  
  content += `</ul><p>Use the store locator above to find specific ${loanType.name.toLowerCase()} locations in these neighborhoods and throughout ${location.city}.</p>`;

  return {
    title: `Top Neighborhoods for ${loanType.name} in ${location.city}`,
    content,
    keywords: [
      `${loanType.name.toLowerCase()} ${location.city}`,
      `${loanType.name.toLowerCase()} neighborhoods ${location.city}`,
      `best areas for ${loanType.name.toLowerCase()} ${location.city}`
    ]
  };
}

/**
 * Generate local regulations section
 */
export function generateRegulationsSection(
  location: LocationData,
  loanType: LoanTypeData
): ContentSection {
  // State-specific regulation info (can be expanded with real data)
  const stateRegulations: Record<string, string> = {
    'CA': 'California has specific regulations for payday loans, including maximum loan amounts and fee caps.',
    'TX': 'Texas allows payday loans with certain restrictions on fees and repayment terms.',
    'IL': 'Illinois has regulations governing payday loan interest rates and fees.',
    'AZ': 'Arizona has laws regulating payday loan terms and maximum amounts.',
    'PA': 'Pennsylvania has restrictions on payday lending practices.',
  };

  const regulationText = stateRegulations[location.stateAbbr] || 
    `${location.state} has specific regulations governing ${loanType.name.toLowerCase()}.`;

  const content = `
    <p>${regulationText} It's important to understand the local laws before applying for a ${loanType.name.toLowerCase()} in ${location.city}.</p>
    
    <h4>Key Regulations in ${location.state}:</h4>
    <ul>
      <li>Maximum loan amounts vary by lender and loan type</li>
      <li>Interest rates and fees are regulated by state law</li>
      <li>Repayment terms must comply with ${location.state} regulations</li>
      <li>Lenders must be licensed to operate in ${location.state}</li>
    </ul>
    
    <p>Always verify that your chosen lender is properly licensed and compliant with ${location.state} regulations. Use the store locator above to find reputable ${loanType.name.toLowerCase()} providers in ${location.city}.</p>
  `;

  return {
    title: `${loanType.name} Requirements and Regulations in ${location.city}`,
    content,
    keywords: [
      `${loanType.name.toLowerCase()} laws ${location.state}`,
      `${loanType.name.toLowerCase()} regulations ${location.city}`,
      `legal ${loanType.name.toLowerCase()} ${location.city}`
    ]
  };
}

/**
 * Generate rates and fees section
 */
export function generateRatesSection(
  location: LocationData,
  loanType: LoanTypeData
): ContentSection {
  const content = `
    <p>${loanType.name} rates and fees in ${location.city} vary depending on several factors including your credit score, loan amount, and the lender you choose.</p>
    
    <h4>Average Rates in ${location.city}:</h4>
    <ul>
      <li>Interest rates typically range from 15% to 36% APR</li>
      <li>Origination fees may apply (usually 1-5% of loan amount)</li>
      <li>Late payment fees vary by lender</li>
      <li>Prepayment penalties may or may not apply</li>
    </ul>
    
    <h4>Factors Affecting Rates:</h4>
    <ul>
      <li><strong>Credit Score:</strong> Higher scores typically qualify for better rates</li>
      <li><strong>Loan Amount:</strong> Larger loans may have different rate structures</li>
      <li><strong>Loan Term:</strong> Shorter terms may have different fee structures</li>
      <li><strong>Lender:</strong> Different lenders offer different rates and terms</li>
    </ul>
    
    <p>Use the store locator above to compare rates from multiple ${loanType.name.toLowerCase()} providers in ${location.city}. Always read the terms carefully and compare offers before making a decision.</p>
  `;

  return {
    title: `${loanType.name} Rates and Fees in ${location.city}`,
    content,
    keywords: [
      `${loanType.name.toLowerCase()} rates ${location.city}`,
      `${loanType.name.toLowerCase()} fees ${location.city}`,
      `cheap ${loanType.name.toLowerCase()} ${location.city}`
    ]
  };
}

/**
 * Generate how to apply section
 */
export function generateHowToApplySection(
  location: LocationData,
  loanType: LoanTypeData
): ContentSection {
  const content = `
    <p>Applying for ${loanType.name.toLowerCase()} in ${location.city} is straightforward. Follow these steps to get started:</p>
    
    <h4>Step 1: Use the Store Locator</h4>
    <p>Use the search tool above to find ${loanType.name.toLowerCase()} providers near you in ${location.city}. You can search by zip code or enter your address to find locations within your preferred distance.</p>
    
    <h4>Step 2: Compare Options</h4>
    <p>Review the lenders listed in your area. Check their ratings, reviews, and services offered. Compare rates and terms to find the best option for your needs.</p>
    
    <h4>Step 3: Check Requirements</h4>
    <p>Most ${loanType.name.toLowerCase()} providers in ${location.city} require:</p>
    <ul>
      <li>Proof of income (pay stubs, bank statements)</li>
      <li>Valid government-issued ID</li>
      <li>Active checking account</li>
      <li>Minimum age requirement (usually 18+)</li>
    </ul>
    
    <h4>Step 4: Apply</h4>
    <p>Click "Get Quote" on any lender listing to start your application. You can apply online or visit the location in person. Many lenders offer same-day approval and funding.</p>
    
    <p>Ready to get started? Use the store locator above to find ${loanType.name.toLowerCase()} providers in ${location.city}.</p>
  `;

  return {
    title: `How to Get ${loanType.name} in ${location.city}`,
    content,
    keywords: [
      `how to get ${loanType.name.toLowerCase()} ${location.city}`,
      `apply for ${loanType.name.toLowerCase()} ${location.city}`,
      `${loanType.name.toLowerCase()} application ${location.city}`
    ]
  };
}

/**
 * Generate best practices section
 */
export function generateBestPracticesSection(
  location: LocationData,
  loanType: LoanTypeData
): ContentSection {
  const content = `
    <p>When looking for ${loanType.name.toLowerCase()} in ${location.city}, follow these best practices to ensure you get the best deal and avoid common pitfalls:</p>
    
    <h4>1. Compare Multiple Lenders</h4>
    <p>Don't settle for the first lender you find. Use the store locator to compare rates, fees, and terms from multiple ${loanType.name.toLowerCase()} providers in ${location.city}.</p>
    
    <h4>2. Read Reviews</h4>
    <p>Check customer reviews and ratings before choosing a lender. Look for lenders with consistently high ratings and positive customer feedback.</p>
    
    <h4>3. Understand the Terms</h4>
    <p>Read all terms and conditions carefully. Make sure you understand the interest rate, fees, repayment schedule, and any penalties before signing.</p>
    
    <h4>4. Verify Licensing</h4>
    <p>Ensure the lender is properly licensed to operate in ${location.state}. Licensed lenders must comply with state regulations and consumer protection laws.</p>
    
    <h4>5. Only Borrow What You Need</h4>
    <p>${loanType.name} can be helpful for short-term financial needs, but only borrow what you actually need and can afford to repay.</p>
    
    <h4>6. Have a Repayment Plan</h4>
    <p>Before taking out a ${loanType.name.toLowerCase()}, make sure you have a plan to repay it on time. Late payments can result in additional fees and damage to your credit.</p>
    
    <p>Use the store locator above to find reputable ${loanType.name.toLowerCase()} providers in ${location.city} that follow best practices and treat customers fairly.</p>
  `;

  return {
    title: `Best Practices for ${loanType.name} in ${location.city}`,
    content,
    keywords: [
      `best ${loanType.name.toLowerCase()} ${location.city}`,
      `tips for ${loanType.name.toLowerCase()} ${location.city}`,
      `how to choose ${loanType.name.toLowerCase()} ${location.city}`
    ]
  };
}

/**
 * Generate alternatives section
 */
export function generateAlternativesSection(
  location: LocationData,
  loanType: LoanTypeData
): ContentSection {
  const alternatives = loanType.slug === 'payday-loans' ? [
    'Personal loans from banks or credit unions',
    'Credit card cash advances',
    'Borrowing from family or friends',
    'Payment plans with creditors',
    'Emergency assistance programs'
  ] : [
    'Traditional bank loans',
    'Credit union loans',
    'Peer-to-peer lending',
    'Credit cards',
    'Home equity loans'
  ];

  let content = `
    <p>Before taking out a ${loanType.name.toLowerCase()} in ${location.city}, consider these alternatives that may be more affordable or better suited to your needs:</p>
    <ul>
  `;

  alternatives.forEach(alt => {
    content += `<li><strong>${alt}</strong> - May offer better rates or terms depending on your situation.</li>`;
  });

  content += `
    </ul>
    <p>If you decide that a ${loanType.name.toLowerCase()} is the right choice for you, use the store locator above to find providers in ${location.city} and compare your options.</p>
  `;

  return {
    title: `Alternatives to ${loanType.name} in ${location.city}`,
    content,
    keywords: [
      `alternatives to ${loanType.name.toLowerCase()} ${location.city}`,
      `other options ${location.city}`,
      `instead of ${loanType.name.toLowerCase()} ${location.city}`
    ]
  };
}

/**
 * Generate FAQ section
 */
export function generateFAQSection(
  location: LocationData,
  loanType: LoanTypeData
): Array<{ question: string; answer: string }> {
  return [
    {
      question: `What are the ${loanType.name.toLowerCase()} requirements in ${location.city}?`,
      answer: `Requirements vary by lender but typically include proof of income, valid ID, active checking account, and minimum age of 18. Some lenders may require a minimum credit score. Use the store locator above to find lenders in ${location.city} and check their specific requirements.`
    },
    {
      question: `How many ${loanType.name.toLowerCase()} stores are in ${location.city}?`,
      answer: `${location.city} has numerous ${loanType.name.toLowerCase()} providers throughout the city and surrounding areas. Use the store locator tool above to find all available locations near you, filter by distance, and compare options.`
    },
    {
      question: `Are ${loanType.name.toLowerCase()} legal in ${location.state}?`,
      answer: `Yes, ${loanType.name.toLowerCase()} are legal in ${location.state}, but they are regulated by state law. Lenders must be licensed and comply with state regulations regarding interest rates, fees, and terms. Always verify that your lender is properly licensed.`
    },
    {
      question: `What are the best neighborhoods for ${loanType.name.toLowerCase()} in ${location.city}?`,
      answer: `Popular areas for ${loanType.name.toLowerCase()} in ${location.city} include downtown areas, major commercial districts, and neighborhoods with high foot traffic. Use the store locator above to find lenders in specific neighborhoods and compare your options.`
    },
    {
      question: `How long does it take to get approved for ${loanType.name.toLowerCase()} in ${location.city}?`,
      answer: `Approval times vary by lender. Many ${loanType.name.toLowerCase()} providers in ${location.city} offer same-day or next-day approval. Online applications can be processed in minutes, while in-person applications may take longer. Use the store locator to find lenders with fast approval times.`
    },
    {
      question: `What are the interest rates for ${loanType.name.toLowerCase()} in ${location.city}?`,
      answer: `Interest rates for ${loanType.name.toLowerCase()} in ${location.city} vary based on your credit score, loan amount, and the lender you choose. Rates typically range from 15% to 36% APR. Use the store locator above to compare rates from multiple lenders in ${location.city}.`
    },
    {
      question: `Can I get ${loanType.name.toLowerCase()} with bad credit in ${location.city}?`,
      answer: `Yes, many ${loanType.name.toLowerCase()} providers in ${location.city} work with borrowers who have less-than-perfect credit. While rates may be higher, you can still qualify. Use the store locator to find lenders that accept bad credit applicants.`
    },
    {
      question: `Do I need a bank account for ${loanType.name.toLowerCase()} in ${location.city}?`,
      answer: `Most ${loanType.name.toLowerCase()} lenders in ${location.city} require an active checking account for loan disbursement and repayment. However, some lenders may offer alternative options. Check with individual lenders using the store locator above.`
    }
  ];
}

/**
 * Generate main about section
 */
export function generateAboutSection(
  location: LocationData,
  loanType: LoanTypeData
): ContentSection {
  const content = `
    <p>
      ${location.city}, ${location.state} is home to ${location.population.toLocaleString()} residents${location.metroArea ? ` in the ${location.metroArea} metro area` : ''}. 
      Finding the right ${loanType.name.toLowerCase()} provider is essential for your financial needs.
    </p>
    
    <p>
      ${loanType.name} providers in ${location.city} offer competitive rates and flexible terms. 
      Whether you need quick cash or a longer-term solution, local lenders understand the needs of ${location.city} residents.
    </p>
    
    <p>
      With ${location.city}'s diverse economy and population, there are numerous ${loanType.name.toLowerCase()} options available. 
      Use the store locator above to find providers near you, compare rates, read reviews, and choose the best option for your situation.
    </p>
  `;

  return {
    title: `About ${loanType.name} in ${location.city}`,
    content,
    keywords: [
      `${loanType.name.toLowerCase()} ${location.city}`,
      `${loanType.name.toLowerCase()} ${location.city} ${location.stateAbbr}`,
      `${loanType.name.toLowerCase()} near ${location.city}`
    ]
  };
}

/**
 * Check if we're in build mode (should not make API calls)
 */
function isBuildTime(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build' || 
         (process.env.NODE_ENV === 'production' && typeof window === 'undefined' && !process.env.RUNTIME_ENV);
}

/**
 * Generate all content sections for a location page
 * Uses AI enhancement if available, falls back to templates
 */
export function generateLocationPageContent(
  location: LocationData,
  loanType: LoanTypeData
): {
  sections: ContentSection[];
  faqs: Array<{ question: string; answer: string }>;
  metaTitle: string;
  metaDescription: string;
} {
  // Generate template-based content
  const sections = [
    generateAboutSection(location, loanType),
    generateNeighborhoodsSection(location, loanType),
    generateRegulationsSection(location, loanType),
    generateRatesSection(location, loanType),
    generateHowToApplySection(location, loanType),
    generateBestPracticesSection(location, loanType),
    generateAlternativesSection(location, loanType),
  ];

  const faqs = generateFAQSection(location, loanType);

  const metaTitle = `${loanType.name} Near ${location.city}, ${location.stateAbbr} | Find Locations & Compare Rates`;
  const metaDescription = `Find ${loanType.name.toLowerCase()} locations near you in ${location.city}, ${location.state}. Compare rates, read reviews, and apply online. Search by zip code or location to find stores within your preferred distance.`;

  return {
    sections,
    faqs,
    metaTitle,
    metaDescription,
  };
}


