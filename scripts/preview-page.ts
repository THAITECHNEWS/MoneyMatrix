#!/usr/bin/env ts-node
/**
 * Preview a single location page
 * Shows complete rendered content for debugging
 */

import { getLocations, getLoanTypes } from '../lib/locations';
import { generateLocationPageContent } from '../lib/content-templates';

// Get first location and loan type
const locations = getLocations();
const loanTypes = getLoanTypes();

if (locations.length === 0 || loanTypes.length === 0) {
  console.error('No locations or loan types found');
  process.exit(1);
}

function previewPage() {
  const location = locations[0]; // Los Angeles
  const loanType = loanTypes[0]; // Payday Loans

  console.log('\n📄 PREVIEW: Location Page Content\n');
  console.log('=' .repeat(80));
  console.log(`URL: /locations/${loanType.slug}-in-${location.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${location.stateAbbr.toLowerCase()}`);
  console.log(`Location: ${location.city}, ${location.stateAbbr}`);
  console.log(`Loan Type: ${loanType.name}`);
  console.log('=' .repeat(80));

  // Generate content
  const content = generateLocationPageContent(location, loanType);

console.log('\n📋 METADATA:\n');
console.log(`Title: ${content.metaTitle}`);
console.log(`Description: ${content.metaDescription}\n`);

console.log('\n📝 CONTENT SECTIONS:\n');
content.sections.forEach((section, index) => {
  console.log(`${index + 1}. ${section.title}`);
  console.log('   ' + '-'.repeat(76));
  // Show first 200 chars of content
  const preview = section.content.replace(/<[^>]*>/g, '').substring(0, 200);
  console.log(`   ${preview}...`);
  console.log(`   Keywords: ${section.keywords.join(', ')}\n`);
});

console.log('\n❓ FAQ SECTION:\n');
content.faqs.forEach((faq, index) => {
  console.log(`${index + 1}. ${faq.question}`);
  const answerPreview = faq.answer.substring(0, 150);
  console.log(`   ${answerPreview}...\n`);
});

console.log('\n📊 STATISTICS:\n');
console.log(`   Total Sections: ${content.sections.length}`);
console.log(`   Total FAQs: ${content.faqs.length}`);
console.log(`   Total Keywords: ${content.sections.reduce((sum, s) => sum + s.keywords.length, 0)}`);
console.log(`   Content Length: ~${content.sections.reduce((sum, s) => sum + s.content.length, 0)} characters\n`);

  console.log('=' .repeat(80));
  console.log('\n✅ Page preview complete!\n');
  console.log('To view in browser:');
  console.log(`   1. Run: npm run dev`);
  console.log(`   2. Visit: http://localhost:3000/locations/${loanType.slug}-in-${location.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${location.stateAbbr.toLowerCase()}\n`);
}

if (require.main === module) {
  previewPage();
}

