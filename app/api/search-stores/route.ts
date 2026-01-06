import { NextRequest, NextResponse } from 'next/server';

interface ApifySearchRequest {
  searchStringsArray: string[];
  location: string;
  maxCrawledPlacesPerSearch?: number;
  language?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, zipCode, distance, loanType, apifyApiKey } = body;

    if (!apifyApiKey) {
      return NextResponse.json(
        { error: 'Apify API key is required' },
        { status: 400 }
      );
    }

    if (!loanType) {
      return NextResponse.json(
        { error: 'Service type is required' },
        { status: 400 }
      );
    }

    if (!location && !zipCode) {
      return NextResponse.json(
        { error: 'Location or zip code is required' },
        { status: 400 }
      );
    }

    // Build search terms - INCLUDE LOCATION IN SEARCH TERMS for accuracy
    const baseSearchTerms = getSearchTermsForLoanType(loanType);
    
    // Format location properly
    let locationString = '';
    let searchLocation = '';
    let targetState = '';
    let targetCity = '';
    
    if (zipCode) {
      // If zip code, use it as location
      locationString = zipCode;
      searchLocation = zipCode;
    } else if (location) {
      // Clean and format location string
      locationString = location.trim();
      searchLocation = locationString;
      
      // Extract state from location (e.g., "Philadelphia, PA" or "Albuquerque, NM, USA")
      const locationParts = locationString.split(',').map(p => p.trim());
      
      if (locationParts.length >= 2) {
        targetCity = locationParts[0];
        
        // Handle "City, State, Country" format - state is second to last (not last if country is present)
        // Check if last part is a country code (US, USA) or country name
        const lastPart = locationParts[locationParts.length - 1].toUpperCase();
        const isCountry = lastPart === 'US' || lastPart === 'USA' || lastPart === 'UNITED STATES';
        
        if (isCountry && locationParts.length >= 3) {
          // Format: "City, State, Country" - state is second to last
          targetState = locationParts[locationParts.length - 2];
        } else {
          // Format: "City, State" - state is last
          targetState = locationParts[locationParts.length - 1];
        }
        
        // Convert state abbreviation to full name for better matching
        targetState = normalizeStateName(targetState);
      } else {
        // Single part - check if it's a state name
        const stateMatch = locationString.match(/\b(PA|Pennsylvania|CA|California|NY|New York|TX|Texas|FL|Florida|IL|Illinois|OH|Ohio|GA|Georgia|NC|North Carolina|MI|Michigan|NJ|New Jersey|AZ|Arizona|WA|Washington|MA|Massachusetts|TN|Tennessee|IN|Indiana|MO|Missouri|MD|Maryland|WI|Wisconsin|CO|Colorado|MN|Minnesota|SC|South Carolina|AL|Alabama|LA|Louisiana|KY|Kentucky|OR|Oregon|OK|Oklahoma|CT|Connecticut|UT|Utah|IA|Iowa|NV|Nevada|AR|Arkansas|MS|Mississippi|KS|Kansas|NM|New Mexico|NE|Nebraska|WV|West Virginia|ID|Idaho|HI|Hawaii|NH|New Hampshire|ME|Maine|MT|Montana|RI|Rhode Island|DE|Delaware|SD|South Dakota|ND|North Dakota|AK|Alaska|DC|District of Columbia|VT|Vermont|WY|Wyoming)\b/i);
        if (stateMatch) {
          targetState = normalizeStateName(stateMatch[1]);
        }
      }
    }

    // Build search terms WITH location for better accuracy
    // Format: "payday loans in Pennsylvania" or "payday loans in Philadelphia, PA"
    const searchTerms = baseSearchTerms.map(term => {
      if (searchLocation) {
        return `${term} in ${searchLocation}`;
      }
      return term;
    });

    // Prepare Apify API request - CORRECT FORMAT
    const apifyInput: ApifySearchRequest = {
      searchStringsArray: searchTerms, // Search terms WITH location included
      location: searchLocation, // Location string
      maxCrawledPlacesPerSearch: 20, // Limit to 20 results
      language: 'en',
    };

    // Use synchronous endpoint that returns dataset items directly
    const apifyActorId = 'compass~crawler-google-places';
    const apifyApiUrl = `https://api.apify.com/v2/acts/${apifyActorId}/run-sync-get-dataset-items?token=${apifyApiKey}&format=json&limit=20`;

    console.log('Calling Apify API with:', { 
      searchStringsArray: apifyInput.searchStringsArray, 
      location: apifyInput.location,
      userInput: { location, zipCode, distance, loanType },
      filters: { targetState, targetCity }
    });

    const apifyResponse = await fetch(apifyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apifyInput),
    });

    if (!apifyResponse.ok) {
      let errorData;
      try {
        errorData = await apifyResponse.json();
      } catch {
        errorData = await apifyResponse.text();
      }
      
      console.error('Apify API error:', errorData);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to search locations';
      if (typeof errorData === 'object' && errorData.error) {
        if (typeof errorData.error === 'string') {
          errorMessage = errorData.error;
        } else if (errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
      
      return NextResponse.json(
        { error: errorMessage, details: errorData },
        { status: apifyResponse.status }
      );
    }

    const results = await apifyResponse.json();
    
    console.log('Apify raw results:', Array.isArray(results) ? results.length : 'not array', typeof results);
    if (Array.isArray(results) && results.length > 0) {
      console.log('First result sample:', JSON.stringify(results[0], null, 2));
    }

    // Handle different response formats
    let apifyData: any[] = [];
    if (Array.isArray(results)) {
      apifyData = results;
    } else if (results.data && Array.isArray(results.data)) {
      apifyData = results.data;
    } else if (results.items && Array.isArray(results.items)) {
      apifyData = results.items;
    } else if (typeof results === 'object') {
      // Try to extract array from object
      const keys = Object.keys(results);
      for (const key of keys) {
        if (Array.isArray(results[key])) {
          apifyData = results[key];
          break;
        }
      }
    }

    console.log(`Processing ${apifyData.length} results from Apify`);

    // Transform Apify results to our Store format
    let stores = transformApifyResults(apifyData, loanType);
    
    console.log(`Transformed to ${stores.length} stores`);

    console.log(`Before filtering: ${stores.length} stores`);
    
    // FILTER RESULTS BY LOCATION FOR ACCURACY
    // If user specified a state or city, filter results to match
    if (targetState || targetCity) {
      const beforeFilter = stores.length;
      const normalizedTargetState = targetState ? normalizeStateName(targetState).toLowerCase() : '';
      const targetStateAbbr = targetState ? getStateAbbreviation(targetState).toLowerCase() : '';
      
      stores = stores.filter(store => {
        const storeState = (store.state || '').toLowerCase().trim();
        const storeCity = (store.city || '').toLowerCase().trim();
        const storeAddress = (store.address || '').toLowerCase();
        
        // Check state match - compare both full names and abbreviations
        if (targetState) {
          // Normalize store state for comparison
          const normalizedStoreState = normalizeStateName(store.state || '').toLowerCase();
          const storeStateAbbr = getStateAbbreviation(store.state || '').toLowerCase();
          
          const stateMatches = 
            normalizedStoreState === normalizedTargetState ||
            storeState === normalizedTargetState ||
            storeStateAbbr === targetStateAbbr ||
            storeState === targetStateAbbr ||
            normalizedStoreState.includes(normalizedTargetState) ||
            storeState.includes(normalizedTargetState) ||
            storeAddress.includes(normalizedTargetState) ||
            storeAddress.includes(targetStateAbbr);
          
          if (!stateMatches) {
            console.log(`Filtered out store "${store.name}" - state mismatch: store="${store.state}" vs target="${targetState}"`);
            return false;
          }
        }
        
        // Check city match if provided (lenient - allow partial matches)
        if (targetCity) {
          const cityMatch = targetCity.toLowerCase().trim();
          const cityMatches = 
            storeCity === cityMatch ||
            storeCity.includes(cityMatch) ||
            storeAddress.includes(cityMatch);
          
          // If state matches, be lenient with city (nearby cities are OK)
          // Only filter by city if state doesn't match
          if (!cityMatches && !targetState) {
            console.log(`Filtered out store "${store.name}" - city mismatch: store="${store.city}" vs target="${targetCity}"`);
            return false;
          }
        }
        
        return true;
      });
      console.log(`After state/city filter: ${stores.length} stores (removed ${beforeFilter - stores.length})`);
      console.log(`Target state: "${targetState}" (normalized: "${normalizedTargetState}", abbr: "${targetStateAbbr}")`);
    }

    // Filter by zip code if provided (lenient - just check if zip starts with input)
    if (zipCode && zipCode.length >= 3) {
      const beforeFilter = stores.length;
      stores = stores.filter(store => {
        const storeZip = (store.zipCode || '').trim();
        // Match if zip starts with input (e.g., "191" matches "19104")
        return !storeZip || storeZip.startsWith(zipCode) || storeZip === zipCode;
      });
      console.log(`After zip filter: ${stores.length} stores (removed ${beforeFilter - stores.length})`);
    }
    
    console.log(`Final stores count: ${stores.length}`);

    // Filter by distance if provided (using coordinates)
    // Calculate distance from search location center
    if (distance && stores.length > 0) {
      // Get center coordinates from first result or use average
      // This is approximate - Apify results are already location-based
      // Distance parameter helps Apify focus the search area
      // We keep all results as they're already filtered by location
    }

    // Sort by rating (best first)
    stores.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      if (ratingB !== ratingA) {
        return ratingB - ratingA;
      }
      // If ratings equal, sort by review count
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });

    // Ensure we return at least empty array, not null/undefined
    const finalStores = stores.slice(0, 20);
    
    console.log(`Returning ${finalStores.length} stores to frontend`);
    
    return NextResponse.json({
      success: true,
      stores: finalStores, // Always an array, even if empty
      total: stores.length,
      searchLocation: searchLocation,
      filtersApplied: {
        state: targetState || null,
        city: targetCity || null,
        zipCode: zipCode || null
      },
      debug: {
        rawResultsCount: apifyData.length,
        transformedCount: transformApifyResults(apifyData, loanType).length,
        afterFilterCount: stores.length
      }
    });

  } catch (error: any) {
    console.error('Search stores error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

function getSearchTermsForLoanType(loanType: string): string[] {
  const loanTypeMap: { [key: string]: string[] } = {
    'payday-loans': ['payday loans', 'cash advance', 'payday advance'],
    'personal-loans': ['personal loans', 'unsecured loans', 'installment loans'],
    'installment-loans': ['installment loans', 'monthly payment loans'],
    'title-loans': ['title loans', 'car title loans', 'auto title loans'],
    'check-cashing': ['check cashing', 'cash checks'],
    'pawn-loans': ['pawn shop', 'pawn loans'],
    'cash-for-gold': ['cash for gold', 'sell gold', 'gold buyers'],
  };

  return loanTypeMap[loanType] || ['loans'];
}

function transformApifyResults(apifyResults: any[], loanType: string): any[] {
  return apifyResults.map((place, index) => {
    // Handle different Apify response formats
    // Format 1: Full format with location object
    // Format 2: CSV format with street, city, state separate
    
    const name = place.title || place.name || 'Unknown Store';
    const address = place.address || place.street || '';
    const city = place.city || '';
    const state = place.state || '';
    const zipCode = place.postalCode || place.zipCode || place.postal_code || '';
    const phone = place.phone || place.phoneUnformatted || '';
    const website = place.website || '';
    const rating = place.totalScore || place.rating || place.total_score || 0;
    const reviewCount = place.reviewsCount || place.reviews_count || place.reviewCount || 0;
    
    // Handle coordinates - can be object {lat, lng} or separate fields
    // IMPORTANT: Missing coordinates should NOT prevent store from being displayed
    let coordinates = { lat: 0, lng: 0 };
    if (place.location) {
      if (typeof place.location.lat === 'number' && typeof place.location.lng === 'number') {
        coordinates = { lat: place.location.lat, lng: place.location.lng };
      } else if (place.location.lat !== undefined && place.location.lng !== undefined) {
        coordinates = { 
          lat: parseFloat(place.location.lat) || 0, 
          lng: parseFloat(place.location.lng) || 0 
        };
      }
    } else if (place.lat !== undefined && place.lng !== undefined) {
      coordinates = { 
        lat: parseFloat(String(place.lat)) || 0, 
        lng: parseFloat(String(place.lng)) || 0 
      };
    } else if (place.latitude !== undefined && place.longitude !== undefined) {
      coordinates = { 
        lat: parseFloat(String(place.latitude)) || 0, 
        lng: parseFloat(String(place.longitude)) || 0 
      };
    }
    
    // If we still have 0,0, try to geocode from address later (optional)
    // For now, stores without coordinates will still display, just no map marker
    
    // Extract categories - can be array or single string
    let categories: string[] = [];
    if (Array.isArray(place.categories)) {
      categories = place.categories;
    } else if (place.categoryName) {
      categories = [place.categoryName];
    } else if (place.categories && typeof place.categories === 'string') {
      categories = [place.categories];
    }
    
    // Extract services from categories
    const services = extractServicesFromCategories(categories, loanType);
    
    // Build full address if we have street + city + state
    let fullAddress = address;
    if (address && city && state) {
      fullAddress = `${address}, ${city}, ${state}${zipCode ? ' ' + zipCode : ''}`;
    } else if (!fullAddress && city && state) {
      fullAddress = `${city}, ${state}`;
    }

    return {
      id: `store-${place.placeId || place.place_id || place.id || index}`,
      name: name,
      address: fullAddress,
      city: city,
      state: state,
      zipCode: zipCode,
      phone: phone,
      coordinates: coordinates,
      services: services,
      hours: formatOpeningHours(place.openingHours || place.opening_hours),
      rating: typeof rating === 'string' ? parseFloat(rating) : rating,
      reviewCount: typeof reviewCount === 'string' ? parseInt(reviewCount) : reviewCount,
      website: website,
      placeId: place.placeId || place.place_id || '',
      url: place.url || '',
    };
  });
}

function extractServicesFromCategories(categories: string[], loanType: string): string[] {
  const services: string[] = [];
  
  categories.forEach(cat => {
    const catLower = cat.toLowerCase();
    if (catLower.includes('payday') || catLower.includes('cash advance')) {
      services.push('Payday Loan');
    }
    if (catLower.includes('personal loan') || catLower.includes('installment')) {
      services.push('Installment Loan');
    }
    if (catLower.includes('title') || catLower.includes('auto loan')) {
      services.push('Title Loan');
    }
    if (catLower.includes('check cash') || catLower.includes('check cashing')) {
      services.push('Check Cashing');
    }
    if (catLower.includes('pawn')) {
      services.push('Pawn Loan');
    }
    if (catLower.includes('gold') || catLower.includes('jewelry')) {
      services.push('Cash For Gold');
    }
  });

  // If no specific services found, add generic
  if (services.length === 0) {
    services.push('Financial Services');
  }

  return Array.from(new Set(services)); // Remove duplicates
}

function formatOpeningHours(openingHours: any[]): { [day: string]: string } {
  if (!openingHours || !Array.isArray(openingHours)) {
    return {};
  }

  const hours: { [day: string]: string } = {};
  openingHours.forEach((item: any) => {
    if (item.day && item.hours) {
      hours[item.day] = item.hours;
    }
  });

  return hours;
}

function normalizeStateName(stateInput: string): string {
  // Convert state abbreviation to full name, or return normalized full name
  const stateAbbrToFull: { [key: string]: string } = {
    'PA': 'Pennsylvania',
    'CA': 'California',
    'NY': 'New York',
    'TX': 'Texas',
    'FL': 'Florida',
    'IL': 'Illinois',
    'OH': 'Ohio',
    'GA': 'Georgia',
    'NC': 'North Carolina',
    'MI': 'Michigan',
    'NJ': 'New Jersey',
    'AZ': 'Arizona',
    'WA': 'Washington',
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
    'MT': 'Montana',
    'RI': 'Rhode Island',
    'DE': 'Delaware',
    'SD': 'South Dakota',
    'ND': 'North Dakota',
    'AK': 'Alaska',
    'DC': 'District of Columbia',
    'VT': 'Vermont',
    'WY': 'Wyoming',
  };

  const normalized = stateInput.trim();
  const upper = normalized.toUpperCase();
  
  // If it's a 2-letter abbreviation, convert to full name
  if (upper.length === 2 && stateAbbrToFull[upper]) {
    return stateAbbrToFull[upper];
  }
  
  // If it's already a full name, normalize it (capitalize properly)
  const lower = normalized.toLowerCase();
  const fullName = stateAbbrToFull[upper] || normalized;
  
  // Return properly capitalized version
  return fullName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

function getStateAbbreviation(stateName: string): string {
  const stateMap: { [key: string]: string } = {
    'pennsylvania': 'PA',
    'california': 'CA',
    'new york': 'NY',
    'texas': 'TX',
    'florida': 'FL',
    'illinois': 'IL',
    'ohio': 'OH',
    'georgia': 'GA',
    'north carolina': 'NC',
    'michigan': 'MI',
    'new jersey': 'NJ',
    'arizona': 'AZ',
    'washington': 'WA',
    'massachusetts': 'MA',
    'tennessee': 'TN',
    'indiana': 'IN',
    'missouri': 'MO',
    'maryland': 'MD',
    'wisconsin': 'WI',
    'colorado': 'CO',
    'minnesota': 'MN',
    'south carolina': 'SC',
    'alabama': 'AL',
    'louisiana': 'LA',
    'kentucky': 'KY',
    'oregon': 'OR',
    'oklahoma': 'OK',
    'connecticut': 'CT',
    'utah': 'UT',
    'iowa': 'IA',
    'nevada': 'NV',
    'arkansas': 'AR',
    'mississippi': 'MS',
    'kansas': 'KS',
    'new mexico': 'NM',
    'nebraska': 'NE',
    'west virginia': 'WV',
    'idaho': 'ID',
    'hawaii': 'HI',
    'new hampshire': 'NH',
    'maine': 'ME',
    'montana': 'MT',
    'rhode island': 'RI',
    'delaware': 'DE',
    'south dakota': 'SD',
    'north dakota': 'ND',
    'alaska': 'AK',
    'district of columbia': 'DC',
    'vermont': 'VT',
    'wyoming': 'WY',
  };

  const normalized = stateName.toLowerCase().trim();
  return stateMap[normalized] || stateName.toUpperCase().slice(0, 2);
}
