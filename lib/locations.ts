import fs from 'fs';
import path from 'path';

export interface Location {
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

export interface Store {
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
  services: string[];
  hours?: {
    [day: string]: string;
  };
  rating?: number;
  reviewCount?: number;
  website?: string;
  placeId?: string;
  url?: string;
}

export interface LoanType {
  slug: string;
  name: string;
  keywords: string[];
  description: string;
}

function loadJSON<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'data', filename);
  if (!fs.existsSync(filePath)) {
    return {} as T;
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as T;
}

export function getLocations(): Location[] {
  try {
    const data = loadJSON<{ locations: Location[] }>('locations.json');
    return data.locations || [];
  } catch {
    return [];
  }
}

/**
 * Convert URL slug to city name
 * Example: "los-angeles" -> "Los Angeles"
 */
export function convertSlugToCityName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function slugToCityName(slug: string): string {
  return convertSlugToCityName(slug);
}

export function getLocationByCityState(city: string, stateAbbr: string): Location | undefined {
  const locations = getLocations();
  
  // Try direct match first
  let found = locations.find(
    loc => loc.city.toLowerCase() === city.toLowerCase() && 
           loc.stateAbbr.toLowerCase() === stateAbbr.toLowerCase()
  );
  
  // If not found, try converting slug to city name
  if (!found) {
    const cityName = slugToCityName(city);
    found = locations.find(
      loc => loc.city.toLowerCase() === cityName.toLowerCase() && 
             loc.stateAbbr.toLowerCase() === stateAbbr.toLowerCase()
    );
  }
  
  return found;
}

export function getStores(): Store[] {
  try {
    const data = loadJSON<{ stores: Store[] }>('stores.json');
    return data.stores || [];
  } catch {
    return [];
  }
}

export function getStoresByLocation(city: string, stateAbbr: string): Store[] {
  const stores = getStores();
  return stores.filter(
    store => store.city.toLowerCase() === city.toLowerCase() && 
             store.state.toLowerCase() === stateAbbr.toLowerCase()
  );
}

export function getStoresByService(service: string, city?: string, stateAbbr?: string): Store[] {
  let stores = getStores();
  
  if (city && stateAbbr) {
    stores = getStoresByLocation(city, stateAbbr);
  }
  
  return stores.filter(store => 
    store.services.some(s => s.toLowerCase().includes(service.toLowerCase()))
  );
}

export function getLoanTypes(): LoanType[] {
  try {
    const data = loadJSON<{ loanTypes: LoanType[] }>('loan-types.json');
    return data.loanTypes || [];
  } catch {
    return [
      {
        slug: 'payday-loans',
        name: 'Payday Loans',
        keywords: ['payday loans', 'cash advance', 'payday advance'],
        description: 'Short-term loans designed to cover expenses until your next paycheck.'
      },
      {
        slug: 'personal-loans',
        name: 'Personal Loans',
        keywords: ['personal loans', 'unsecured loans', 'installment loans'],
        description: 'Flexible loans for various personal expenses and financial needs.'
      },
      {
        slug: 'installment-loans',
        name: 'Installment Loans',
        keywords: ['installment loans', 'monthly payment loans'],
        description: 'Loans repaid in fixed monthly installments over a set period.'
      },
      {
        slug: 'title-loans',
        name: 'Title Loans',
        keywords: ['title loans', 'car title loans', 'auto title loans'],
        description: 'Loans secured by your vehicle title with quick approval.'
      },
      {
        slug: 'check-cashing',
        name: 'Check Cashing',
        keywords: ['check cashing', 'cash checks'],
        description: 'Convenient check cashing services for immediate access to funds.'
      }
    ];
  }
}

export function getLoanTypeBySlug(slug: string): LoanType | undefined {
  const loanTypes = getLoanTypes();
  return loanTypes.find(lt => lt.slug === slug);
}

export function generateLocationSlug(loanType: string, city: string, stateAbbr: string): string {
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const stateSlug = stateAbbr.toLowerCase();
  return `${loanType}-in-${citySlug}-${stateSlug}`;
}

