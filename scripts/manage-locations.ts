#!/usr/bin/env ts-node
/**
 * Location Management Script
 * Central control for managing locations, generating pages, and validating content
 * 
 * Usage:
 *   npx ts-node scripts/manage-locations.ts list
 *   npx ts-node scripts/manage-locations.ts generate
 *   npx ts-node scripts/manage-locations.ts validate
 *   npx ts-node scripts/manage-locations.ts add --city "New York" --state "NY"
 */

import fs from 'fs';
import path from 'path';
import { getLocations, getLoanTypes } from '../lib/locations';
import { generateAllLocationPages, validatePageGeneration } from './generate-location-pages';

interface LocationInput {
  city: string;
  state: string;
  stateAbbr: string;
  zipCodes?: string[];
  coordinates?: { lat: number; lng: number };
  population?: number;
  metroArea?: string;
}

/**
 * List all locations
 */
function listLocations() {
  const locations = getLocations();
  const loanTypes = getLoanTypes();
  
  console.log('\n📍 Location Management System\n');
  console.log(`Current Locations: ${locations.length}`);
  console.log(`Loan Types: ${loanTypes.length}`);
  console.log(`Total Pages: ${locations.length * loanTypes.length}\n`);
  
  console.log('Locations:');
  locations.forEach((loc, i) => {
    console.log(`  ${i + 1}. ${loc.city}, ${loc.stateAbbr}`);
    console.log(`     Population: ${loc.population.toLocaleString()}`);
    console.log(`     Metro: ${loc.metroArea || 'N/A'}`);
    console.log(`     Zip Codes: ${loc.zipCodes.slice(0, 3).join(', ')}${loc.zipCodes.length > 3 ? '...' : ''}`);
    console.log('');
  });
  
  console.log('Loan Types:');
  loanTypes.forEach((lt, i) => {
    console.log(`  ${i + 1}. ${lt.name} (${lt.slug})`);
  });
  console.log('');
}

/**
 * Generate all location pages
 */
function generatePages() {
  console.log('\n🚀 Generating Location Pages...\n');
  
  const validation = validatePageGeneration();
  if (!validation.valid) {
    console.error('❌ Validation failed:');
    validation.errors.forEach(error => console.error(`   - ${error}`));
    process.exit(1);
  }
  
  const pages = generateAllLocationPages();
  
  console.log(`\n✅ Successfully generated ${pages.length} location page configurations`);
  console.log(`   Output: data/generated-location-pages.json\n`);
}

/**
 * Validate location data and page generation
 */
function validate() {
  console.log('\n🔍 Validating Location System...\n');
  
  const validation = validatePageGeneration();
  
  if (validation.valid) {
    console.log('✅ All validations passed!\n');
    
    const locations = getLocations();
    const loanTypes = getLoanTypes();
    
    console.log('System Status:');
    console.log(`  Locations: ${locations.length}`);
    console.log(`  Loan Types: ${loanTypes.length}`);
    console.log(`  Total Pages: ${locations.length * loanTypes.length}`);
    console.log(`  Content Templates: ✅`);
    console.log(`  Page Generation: ✅`);
    console.log('');
  } else {
    console.error('❌ Validation errors found:\n');
    validation.errors.forEach(error => console.error(`   - ${error}`));
    console.log('');
    process.exit(1);
  }
}

/**
 * Add a new location
 */
function addLocation(location: LocationInput) {
  const locationsPath = path.join(process.cwd(), 'data', 'locations.json');
  const data = JSON.parse(fs.readFileSync(locationsPath, 'utf-8'));
  
  // Check if location already exists
  const exists = data.locations.some(
    (loc: any) => 
      loc.city.toLowerCase() === location.city.toLowerCase() &&
      loc.stateAbbr.toUpperCase() === location.stateAbbr.toUpperCase()
  );
  
  if (exists) {
    console.error(`❌ Location ${location.city}, ${location.stateAbbr} already exists`);
    process.exit(1);
  }
  
  // Add new location
  const newLocation = {
    city: location.city,
    state: location.state,
    stateAbbr: location.stateAbbr.toUpperCase(),
    zipCodes: location.zipCodes || [],
    coordinates: location.coordinates || { lat: 0, lng: 0 },
    population: location.population || 0,
    metroArea: location.metroArea,
  };
  
  data.locations.push(newLocation);
  
  // Sort by city name
  data.locations.sort((a: any, b: any) => a.city.localeCompare(b.city));
  
  fs.writeFileSync(locationsPath, JSON.stringify(data, null, 2));
  
  console.log(`✅ Added location: ${location.city}, ${location.stateAbbr}`);
  console.log(`   Total locations: ${data.locations.length}\n`);
}

/**
 * Get location suggestions (top US cities)
 */
function getLocationSuggestions() {
  const suggestions = [
    { city: 'New York', state: 'New York', stateAbbr: 'NY', population: 8336817 },
    { city: 'San Antonio', state: 'Texas', stateAbbr: 'TX', population: 1547253 },
    { city: 'San Diego', state: 'California', stateAbbr: 'CA', population: 1423851 },
    { city: 'Dallas', state: 'Texas', stateAbbr: 'TX', population: 1343573 },
    { city: 'San Jose', state: 'California', stateAbbr: 'CA', population: 1021795 },
    { city: 'Austin', state: 'Texas', stateAbbr: 'TX', population: 978908 },
    { city: 'Jacksonville', state: 'Florida', stateAbbr: 'FL', population: 949611 },
    { city: 'Fort Worth', state: 'Texas', stateAbbr: 'TX', population: 918915 },
    { city: 'Columbus', state: 'Ohio', stateAbbr: 'OH', population: 905748 },
    { city: 'Charlotte', state: 'North Carolina', stateAbbr: 'NC', population: 885708 },
  ];
  
  console.log('\n💡 Top 10 US Cities to Add:\n');
  suggestions.forEach((loc, i) => {
    console.log(`  ${i + 1}. ${loc.city}, ${loc.stateAbbr} (Population: ${loc.population.toLocaleString()})`);
  });
  console.log('');
}

// CLI handling
const command = process.argv[2];

switch (command) {
  case 'list':
    listLocations();
    break;
    
  case 'generate':
    generatePages();
    break;
    
  case 'validate':
    validate();
    break;
    
  case 'add':
    const city = process.argv.find(arg => arg.startsWith('--city='))?.split('=')[1];
    const state = process.argv.find(arg => arg.startsWith('--state='))?.split('=')[1];
    const stateAbbr = process.argv.find(arg => arg.startsWith('--stateAbbr='))?.split('=')[1];
    
    if (!city || !state) {
      console.error('Usage: npx ts-node scripts/manage-locations.ts add --city="City Name" --state="State Name" [--stateAbbr="XX"]');
      process.exit(1);
    }
    
    addLocation({
      city,
      state,
      stateAbbr: stateAbbr || state.substring(0, 2).toUpperCase(),
    });
    break;
    
  case 'suggestions':
    getLocationSuggestions();
    break;
    
  default:
    console.log(`
📍 Location Management System

Usage:
  npx ts-node scripts/manage-locations.ts <command>

Commands:
  list          - List all current locations and loan types
  generate      - Generate all location page configurations
  validate      - Validate location data and page generation
  add           - Add a new location (requires --city and --state flags)
  suggestions   - Show top US cities to add

Examples:
  npx ts-node scripts/manage-locations.ts list
  npx ts-node scripts/manage-locations.ts generate
  npx ts-node scripts/manage-locations.ts validate
  npx ts-node scripts/manage-locations.ts add --city="New York" --state="New York" --stateAbbr="NY"
  npx ts-node scripts/manage-locations.ts suggestions
`);
}

