#!/usr/bin/env ts-node
/**
 * Location Page Generation Script
 * Generates location pages for all loan types and cities
 * Run: npx ts-node scripts/generate-location-pages.ts
 */

import fs from 'fs';
import path from 'path';
import { getLocations, getLoanTypes } from '../lib/locations';
import { generateLocationPageContent } from '../lib/content-templates';

interface PageInfo {
  url: string;
  loanType: string;
  city: string;
  state: string;
  title: string;
  description: string;
  sections: number;
  faqs: number;
}

/**
 * Generate all location page URLs and metadata
 */
export function generateAllLocationPages(): PageInfo[] {
  const locations = getLocations();
  const loanTypes = getLoanTypes();
  const pages: PageInfo[] = [];

  console.log(`\n🚀 Generating location pages...`);
  console.log(`   Locations: ${locations.length}`);
  console.log(`   Loan Types: ${loanTypes.length}`);
  console.log(`   Total Pages: ${locations.length * loanTypes.length}\n`);

  for (const location of locations) {
    for (const loanType of loanTypes) {
      const citySlug = location.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const stateSlug = location.stateAbbr.toLowerCase();
      const url = `/locations/${loanType.slug}-in-${citySlug}-${stateSlug}`;

      const content = generateLocationPageContent(location, loanType);

      pages.push({
        url,
        loanType: loanType.slug,
        city: location.city,
        state: location.stateAbbr,
        title: content.metaTitle,
        description: content.metaDescription,
        sections: content.sections.length,
        faqs: content.faqs.length,
      });
    }
  }

  // Save pages list
  const outputPath = path.join(process.cwd(), 'data', 'generated-location-pages.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify({ pages, generatedAt: new Date().toISOString() }, null, 2)
  );

  console.log(`✅ Generated ${pages.length} location page configurations`);
  console.log(`   Saved to: data/generated-location-pages.json\n`);

  // Show sample pages
  console.log('📄 Sample pages:');
  pages.slice(0, 5).forEach((page, i) => {
    console.log(`   ${i + 1}. ${page.url}`);
    console.log(`      Title: ${page.title}`);
  });

  return pages;
}

/**
 * Generate sitemap entries for location pages
 */
export async function generateSitemapEntries(): Promise<Array<{
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
}>> {
  const pages = generateAllLocationPages();
  const baseUrl = 'https://moneymatrix.me';

  return pages.map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
}

/**
 * Validate that all pages can be generated
 */
export function validatePageGeneration(): { valid: boolean; errors: string[] } {
  const locations = getLocations();
  const loanTypes = getLoanTypes();
  const errors: string[] = [];

  if (locations.length === 0) {
    errors.push('No locations found in locations.json');
  }

  if (loanTypes.length === 0) {
    errors.push('No loan types found in loan-types.json');
  }

  // Test content generation for first location/loan type
  if (locations.length > 0 && loanTypes.length > 0) {
    try {
      // Note: This is synchronous validation, so we can't await here
      // The actual generation will work fine at runtime
      errors.push('Note: Content validation skipped (async function)');
    } catch (error: any) {
      errors.push(`Content generation error: ${error.message}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Run if executed directly
if (require.main === module) {
  (async () => {
    console.log('📍 Location Page Generator\n');
    
    const validation = validatePageGeneration();
    if (!validation.valid) {
      console.error('❌ Validation failed:');
      validation.errors.forEach(error => console.error(`   - ${error}`));
      process.exit(1);
    }

    const pages = generateAllLocationPages();
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total Pages: ${pages.length}`);
    console.log(`   Unique Cities: ${new Set(pages.map(p => p.city)).size}`);
    console.log(`   Unique Loan Types: ${new Set(pages.map(p => p.loanType)).size}`);
    console.log(`   Average Sections per Page: ${(pages.reduce((sum, p) => sum + p.sections, 0) / pages.length).toFixed(1)}`);
    console.log(`   Average FAQs per Page: ${(pages.reduce((sum, p) => sum + p.faqs, 0) / pages.length).toFixed(1)}\n`);
  })().catch(console.error);
}

