# Payday Loans Content Strategy

## Overview

This document outlines the comprehensive content plan for answering 919 payday loan questions identified from Google search data.

**Total Questions:** 919  
**Total Clusters:** 16  
**Estimated Articles:** 313  
**Generated:** January 5, 2026

---

## Content Clusters (Priority Order)

### 1. Basic Understanding (Priority: 2337.8)
- **Questions:** 92
- **Articles:** 31
- **Total Volume:** 5,770
- **Focus:** Fundamental questions about what payday loans are and how they work
- **Top Questions:**
  - "what are payday loans" (2,200 vol)
  - "how do payday loans work" (1,500 vol)
  - "what is true about payday loans" (600 vol)

### 2. Other Questions (Priority: 1738.2)
- **Questions:** 322
- **Articles:** 108
- **Focus:** Miscellaneous questions that don't fit other categories
- **Note:** These should be reviewed and potentially re-clustered

### 3. Loan Types & Features (Priority: 987.8)
- **Questions:** 70
- **Articles:** 24
- **Focus:** Secured vs unsecured, fixed vs variable, installment vs revolving
- **Top Questions:**
  - "are payday loans installment or revolving"
  - "are payday loans secured or unsecured"
  - "are payday loans fixed or variable"

### 4. Paying Off & Getting Out (Priority: 824.1)
- **Questions:** 56
- **Articles:** 19
- **Focus:** Consolidation, paying off, getting out of debt
- **Top Questions:**
  - "how to consolidate payday loans"
  - "how to get out of payday loans"
  - "how to pay off payday loans"

### 5. Multiple Loans (Priority: 769.4)
- **Questions:** 78
- **Articles:** 26
- **Focus:** How many loans can you have, multiple lenders
- **Top Questions:**
  - "how many payday loans can i get at once"
  - "can you have two payday loans at once"
  - "can you get 2 payday loans from different places"

### 6. Getting Payday Loans (Priority: 509.3)
- **Questions:** 41
- **Articles:** 14
- **Focus:** Where to get, who offers, best lenders
- **Top Questions:**
  - "where to get payday loans"
  - "who does payday loans"
  - "what are the best online payday loans"

### 7. State-Specific (Priority: 426.9)
- **Questions:** 70
- **Articles:** 24
- **Focus:** Legal status by state, state-specific regulations
- **Top Questions:**
  - "are payday loans legal in texas"
  - "are payday loans legal in ohio"
  - "where are payday loans illegal"

### 8. Risks & Warnings (Priority: 345.1)
- **Questions:** 50
- **Articles:** 17
- **Focus:** Why payday loans are bad, risks, scams
- **Top Questions:**
  - "are payday loans bad"
  - "why are payday loans bad"
  - "why are payday loans so popular"

### 9. Banking & Payment (Priority: 253.7)
- **Questions:** 19
- **Articles:** 7
- **Focus:** Chime, direct deposit, blocking payments
- **Top Questions:**
  - "what payday loans accept chime"
  - "how to block payday loans from debiting my account"
  - "can i close my bank account to stop payday loans"

### 10. Legal & Consequences (Priority: 240.4)
- **Questions:** 14
- **Articles:** 5
- **Focus:** Lawsuits, wage garnishment, jail
- **Top Questions:**
  - "can payday loans take you to court"
  - "can payday loans garnish your wages"
  - "can you go to jail for not paying payday loans"

### 11. Credit Impact (Priority: 223.2)
- **Questions:** 16
- **Articles:** 6
- **Focus:** How payday loans affect credit scores
- **Top Questions:**
  - "can payday loans hurt your credit"
  - "how do payday loans affect your credit"
  - "does payday loans affect your credit"

### 12. Rates & Costs (Priority: 200.0)
- **Questions:** 39
- **Articles:** 13
- **Focus:** Interest rates, fees, costs
- **Top Questions:**
  - "how much interest do payday loans charge"
  - "how much do payday loans cost"

### 13. Specific Lenders (Priority: 180.0)
- **Questions:** 13
- **Articles:** 5
- **Focus:** Individual lender questions (ACE Cash, PLS, Viva, etc.)
- **Top Questions:**
  - "who does payday loans near me"
  - "does pls do payday loans"
  - "is viva payday loans legit"

### 14. Default & Non-Payment (Priority: 150.0)
- **Questions:** 22
- **Articles:** 8
- **Focus:** What happens if you don't pay
- **Top Questions:**
  - "what happens if you stop paying payday loans"
  - "what happens if i don't pay my payday loans"

### 15. Alternatives & Comparisons (Priority: 120.0)
- **Questions:** 11
- **Articles:** 4
- **Focus:** Alternatives to payday loans, comparisons
- **Top Questions:**
  - "what are alternatives to payday loans"
  - "how do payday loans compare to installment loans"

### 16. Usage & Best Practices (Priority: 80.0)
- **Questions:** 6
- **Articles:** 2
- **Focus:** When to use, best practices
- **Top Questions:**
  - "what should payday loans be used for"
  - "what are the most common uses for payday loans"

---

## Content Generation Workflow

### Step 1: Analyze Questions
```bash
npm run analyze:payday-questions
```
This generates:
- `PAYDAY_LOANS_CONTENT_PLAN.md` - Full detailed plan
- `data/payday-loans-content-plan.json` - Structured data for automation

### Step 2: Generate Individual Articles
```bash
npm run generate:payday-article "<cluster-name>" <article-number>
```

**Example:**
```bash
npm run generate:payday-article "Basic Understanding" 1
```

This will:
1. Load the content plan
2. Find the specified cluster and article
3. Generate AI content using GPT-4o
4. Save to `data/generated-articles/<slug>.json`

### Step 3: Review & Post
1. Review generated article in `data/generated-articles/`
2. Edit if needed
3. Post to site at `/payday-loans/<slug>`

---

## Article Template Structure

Each article should include:

1. **Title:** Question-based, SEO-optimized
2. **Meta Description:** 150-160 characters
3. **Content:** 2000-2500 words
4. **Structure:**
   - Introduction (answer primary question)
   - H2 sections for each related question
   - H3 subsections for details
   - Bullet points and lists
   - Conclusion

5. **SEO Elements:**
   - Primary keyword in title
   - Related keywords throughout
   - Internal links to related articles
   - Proper heading hierarchy
   - Meta tags

---

## Priority Order for Content Creation

Start with highest priority clusters:

1. ✅ **Basic Understanding** - Foundation content
2. ✅ **Loan Types & Features** - Important distinctions
3. ✅ **Paying Off & Getting Out** - High user intent
4. ✅ **Multiple Loans** - Common question
5. ✅ **Getting Payday Loans** - Commercial intent
6. ✅ **State-Specific** - Local SEO opportunity
7. ✅ **Risks & Warnings** - Important consumer protection
8. ✅ **Banking & Payment** - Practical questions
9. ✅ **Legal & Consequences** - Serious concerns
10. ✅ **Credit Impact** - Important financial impact
11. ✅ **Rates & Costs** - Cost transparency
12. ✅ **Specific Lenders** - Branded searches
13. ✅ **Default & Non-Payment** - Crisis management
14. ✅ **Alternatives & Comparisons** - Helpful alternatives
15. ✅ **Usage & Best Practices** - Educational content

---

## Content Quality Standards

### Writing Guidelines:
- **Tone:** Informative, helpful, non-judgmental
- **Reading Level:** 8th-10th grade
- **Length:** 2000-2500 words minimum
- **Format:** HTML with semantic tags
- **Accuracy:** Fact-check all information
- **Disclaimers:** Include appropriate legal disclaimers

### SEO Guidelines:
- **Keyword Density:** Natural, not forced
- **Internal Linking:** Link to related articles
- **External Links:** Link to authoritative sources
- **Images:** Include relevant images with alt text
- **Schema:** Use FAQPage schema where appropriate

### Legal Considerations:
- Include disclaimers about payday loan risks
- Provide accurate legal information
- Note state-specific regulations
- Encourage responsible borrowing

---

## Tracking Progress

### Metrics to Track:
- Articles generated
- Articles published
- Search rankings
- Organic traffic
- Engagement metrics

### Files:
- `data/generated-articles/` - Generated article JSON files
- `PAYDAY_LOANS_CONTENT_PLAN.md` - Full detailed plan
- `data/payday-loans-content-plan.json` - Structured data

---

## Next Steps

1. ✅ Analyze questions and create clusters
2. ✅ Generate content plan
3. ⏳ Set up article generation script
4. ⏳ Generate first batch of articles (top 10 priority)
5. ⏳ Review and refine content quality
6. ⏳ Post articles to site
7. ⏳ Monitor performance and iterate

---

## Notes

- The "Other Questions" cluster (322 questions) should be reviewed and potentially re-clustered
- Some questions may be combined into single comprehensive articles
- State-specific content offers strong local SEO opportunities
- Focus on high-volume, low-difficulty keywords first
- Ensure all content complies with financial content regulations








