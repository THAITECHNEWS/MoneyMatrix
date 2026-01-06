import * as fs from 'fs';
import * as path from 'path';

export interface CityData {
  city: string;
  state: string;
  stateAbbr: string;
  slug: string;
  population: number;
  priority: number;
}

export interface StateData {
  state: string;
  stateAbbr: string;
  cities: CityData[];
  totalPopulation: number;
  cityCount: number;
}

// State name mappings for better display
export const STATE_NAMES: Record<string, string> = {
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

/**
 * Load cities from CSV file
 */
export function loadCitiesFromCSV(): CityData[] {
  try {
    const csvPath = path.join(process.cwd(), 'data', 'top-300-locations.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.warn('CSV file not found:', csvPath);
      console.warn('Current working directory:', process.cwd());
      return [];
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      console.warn('CSV file is empty or has no data rows');
      return [];
    }
    
    // Skip header
    const cities: CityData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV (handle quoted fields)
      const matches = line.match(/"([^"]*)"/g);
      if (!matches || matches.length < 6) {
        console.warn(`Skipping invalid CSV line ${i}:`, line.substring(0, 50));
        continue;
      }
      
      const city = matches[0].replace(/"/g, '');
      const state = matches[1].replace(/"/g, '');
      const stateAbbr = matches[2].replace(/"/g, '');
      const slug = matches[3].replace(/"/g, '');
      const population = parseInt(matches[4].replace(/"/g, '')) || 0;
      const priority = parseInt(matches[5].replace(/"/g, '')) || 10;
      
      if (!city || !stateAbbr) {
        console.warn(`Skipping invalid city data at line ${i}`);
        continue;
      }
      
      cities.push({
        city,
        state,
        stateAbbr,
        slug,
        population,
        priority
      });
    }
    
    console.log(`Loaded ${cities.length} cities from CSV`);
    return cities;
  } catch (error) {
    console.error('Error loading cities from CSV:', error);
    return [];
  }
}

/**
 * Get all cities grouped by state
 */
export function getCitiesByState(): Map<string, StateData> {
  const cities = loadCitiesFromCSV();
  const stateMap = new Map<string, StateData>();
  
  for (const city of cities) {
    const stateAbbr = city.stateAbbr.toUpperCase();
    
    if (!stateMap.has(stateAbbr)) {
      stateMap.set(stateAbbr, {
        state: city.state,
        stateAbbr: stateAbbr,
        cities: [],
        totalPopulation: 0,
        cityCount: 0
      });
    }
    
    const stateData = stateMap.get(stateAbbr)!;
    stateData.cities.push(city);
    stateData.totalPopulation += city.population;
    stateData.cityCount += 1;
  }
  
  // Sort cities by population (descending) within each state
  Array.from(stateMap.values()).forEach((stateData) => {
    stateData.cities.sort((a, b) => b.population - a.population);
  });
  
  return stateMap;
}

/**
 * Get cities for a specific state
 */
export function getCitiesForState(stateInput: string): CityData[] {
  const stateAbbr = normalizeStateInput(stateInput);
  const stateMap = getCitiesByState();
  const stateData = stateMap.get(stateAbbr);
  return stateData?.cities || [];
}

/**
 * Convert state name or abbreviation to state abbreviation
 */
export function normalizeStateInput(input: string): string {
  const stateNameToAbbr: Record<string, string> = {
    'california': 'CA',
    'texas': 'TX',
    'florida': 'FL',
    'new york': 'NY',
    'illinois': 'IL',
    'pennsylvania': 'PA',
    'ohio': 'OH',
    'georgia': 'GA',
    'north carolina': 'NC',
    'michigan': 'MI',
    'new jersey': 'NJ',
    'virginia': 'VA',
    'washington': 'WA',
    'arizona': 'AZ',
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
    'rhode island': 'RI',
    'montana': 'MT',
    'delaware': 'DE',
    'south dakota': 'SD',
    'north dakota': 'ND',
    'alaska': 'AK',
    'district of columbia': 'DC',
    'vermont': 'VT',
    'wyoming': 'WY'
  };
  
  const normalized = input.toLowerCase().trim();
  
  // If it's already a 2-letter abbreviation, return uppercase
  if (normalized.length === 2) {
    return normalized.toUpperCase();
  }
  
  // Try to find state name match
  if (stateNameToAbbr[normalized]) {
    return stateNameToAbbr[normalized];
  }
  
  // Fallback: return uppercase of input
  return input.toUpperCase();
}

/**
 * Get state data
 */
export function getStateData(stateInput: string): StateData | undefined {
  const stateAbbr = normalizeStateInput(stateInput);
  const stateMap = getCitiesByState();
  return stateMap.get(stateAbbr);
}

/**
 * Get all states
 */
export function getAllStates(): StateData[] {
  const stateMap = getCitiesByState();
  return Array.from(stateMap.values()).sort((a, b) => 
    b.totalPopulation - a.totalPopulation
  );
}

/**
 * Generate location page URL for a city and loan type
 */
export function generateLocationPageUrl(citySlug: string, loanTypeSlug: string): string {
  return `/locations/${loanTypeSlug}-in-${citySlug}`;
}

