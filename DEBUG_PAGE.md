# Debug Guide: Location Page

## Example Page to Debug

**URL**: `/locations/payday-loans-in-los-angeles-ca`

**Full URL**: `http://localhost:3000/locations/payday-loans-in-los-angeles-ca`

## Page Components to Check

### 1. Header & Breadcrumbs
- ✅ Breadcrumb navigation displays correctly
- ✅ H1 title: "Payday Loans Near Los Angeles, CA"
- ✅ Meta description in header

### 2. Store Locator Tool
- ✅ Map displays correctly
- ✅ Search form works
- ✅ Store cards render
- ✅ Filters work
- ✅ Ratings display correctly (no star emoji)

### 3. Content Sections (7 sections)
Check each section renders:
1. About Section - Introduction text
2. Neighborhoods Section - List of neighborhoods
3. Regulations Section - State laws info
4. Rates Section - Rate information
5. How to Apply Section - Step-by-step guide
6. Best Practices Section - Tips list
7. Alternatives Section - Alternative options

### 4. FAQ Section
- ✅ 8 FAQs display in grid
- ✅ Schema markup in page source (check View Source)
- ✅ Questions and answers readable

### 5. CTA Section
- ✅ "Ready to Find..." heading
- ✅ Buttons link correctly

## Common Issues to Check

### Content Issues
- [ ] HTML tags rendering correctly (not showing as text)
- [ ] Lists displaying properly
- [ ] Headings hierarchy correct
- [ ] No broken links

### Styling Issues
- [ ] Content sections have proper spacing
- [ ] FAQ cards display in grid
- [ ] Mobile responsive
- [ ] No overflow issues

### SEO Issues
- [ ] Page title in browser tab
- [ ] Meta description in source
- [ ] Schema markup valid (use Google Rich Results Test)
- [ ] H1 tag present

### Functionality Issues
- [ ] Store locator loads
- [ ] Map displays
- [ ] Search works
- [ ] Store cards clickable

## Quick Debug Commands

```bash
# View page preview
npx ts-node --project scripts/tsconfig.json scripts/preview-page.ts

# Validate system
npm run locations:validate

# Check generated pages
cat data/generated-location-pages.json | head -50
```

## Browser DevTools Checks

1. **Console**: Check for JavaScript errors
2. **Network**: Verify all assets load
3. **Elements**: Inspect HTML structure
4. **Lighthouse**: Run SEO audit
5. **Schema Validator**: Test FAQ schema markup

## Files to Check if Issues Found

- `app/locations/[loan-type]-in-[city]-[state]/page.tsx` - Page component
- `lib/content-templates.ts` - Content generation
- `components/StoreLocator.tsx` - Store locator component
- `app/globals.css` - Styling

## Test Other Pages

- `/locations/personal-loans-in-chicago-il`
- `/locations/installment-loans-in-houston-tx`
- `/locations/title-loans-in-phoenix-az`

All should follow same structure with location-specific content.









