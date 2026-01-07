# GPT-5.2 Payday Articles Generation Setup

## ✅ Implementation Complete

Your payday loan article generation system is now configured to use **GPT-5.2** with the **Responses API**, following OpenAI's best practices and reasoning guide.

---

## 🎯 Key Features

### GPT-5.2 Configuration
- **Model:** `gpt-5.2`
- **API:** Responses API (not Chat Completions)
- **Reasoning Effort:** `medium` (optimal balance for quality content)
- **Verbosity:** `high` (comprehensive 2000-2500 word articles)
- **Max Tokens:** 8000 (allows for full content generation)

### Payday-Loan-Specific Prompts
The system uses specialized prompts that:
- ✅ Focus specifically on payday loan content (not generic)
- ✅ Include required disclaimers about risks
- ✅ Address state-specific variations
- ✅ Provide practical, actionable advice
- ✅ Follow SEO best practices
- ✅ Use accessible language (8th-10th grade reading level)

---

## 📋 Content Plan Summary

- **Total Questions:** 919
- **Content Clusters:** 16
- **Estimated Articles:** 313
- **Priority Order:** Established by search volume and difficulty

### Top Priority Clusters:
1. **Basic Understanding** (92 questions, 31 articles)
2. **Loan Types & Features** (70 questions, 24 articles)
3. **Paying Off & Getting Out** (56 questions, 19 articles)
4. **Multiple Loans** (78 questions, 26 articles)
5. **Getting Payday Loans** (41 questions, 14 articles)

---

## 🚀 Usage

### Generate an Article

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
3. Generate comprehensive content using GPT-5.2
4. Save to `data/generated-articles/<slug>.json`

### Available Clusters

```bash
npm run generate:payday-article
```

(Shows list of available clusters)

---

## 📝 Article Structure

Each generated article includes:

### Content (2000-2500 words)
- **Introduction:** Directly answers primary question
- **Main Sections:** H2 headings addressing related questions
- **Subsections:** H3 headings with detailed explanations
- **Practical Tips:** Actionable advice section
- **Common Mistakes:** What to avoid
- **Alternatives:** When relevant
- **Conclusion:** Key takeaways

### Metadata
- **Title:** SEO-optimized, question-based
- **Description:** 150-160 character meta description
- **Keywords:** Primary + related keywords
- **Slug:** URL-friendly format

### Required Elements
- ✅ Proper HTML structure (h2, h3, p, ul, ol)
- ✅ Disclaimers about payday loan risks
- ✅ State-specific notes when relevant
- ✅ Practical examples and scenarios
- ✅ Internal linking opportunities
- ✅ SEO-optimized headings

---

## 🎨 Prompt Design (GPT-5.2 Specific)

### Following Reasoning Guide Best Practices:

1. **Verbosity Control:**
   - High verbosity for comprehensive articles
   - Clear structure requirements
   - Bullet points and lists for scannability

2. **Scope Discipline:**
   - Focus ONLY on payday loans
   - No generic financial advice
   - Specific to the question asked

3. **Ambiguity Handling:**
   - Address multiple interpretations
   - Note state-specific variations
   - Include appropriate qualifiers

4. **Factuality:**
   - Never invent facts or statistics
   - Use language like "typically," "generally"
   - Include disclaimers about consulting professionals

5. **Value-Add Behavior:**
   - Concrete examples
   - Practical tips
   - Underlying mechanisms explained
   - Relevant context and background

---

## 📊 Response API Structure

The script extracts content from GPT-5.2 Responses API:

```typescript
{
  "output": [
    {
      "type": "message",
      "content": [
        {
          "type": "output_text",
          "text": "Generated content..."
        }
      ]
    }
  ]
}
```

Content is extracted from: `data.output[0].content[0].text`

---

## 🔧 Configuration

### Environment Variables
```bash
OPENAI_API_KEY=your_api_key_here
```

### Reasoning Settings
- **Effort:** `medium` (can be changed to `low`, `high`, or `xhigh`)
- **Verbosity:** `high` (can be changed to `medium` or `low`)

To adjust, edit `scripts/generate-payday-article.ts`:
```typescript
reasoning: {
  effort: 'medium' // Change here
},
text: {
  verbosity: 'high' // Change here
}
```

---

## 📁 Output Files

### Generated Articles
- **Location:** `data/generated-articles/`
- **Format:** JSON files
- **Naming:** `<slug>.json`

### Content Plan
- **Location:** `data/payday-loans-content-plan.json`
- **Format:** Structured JSON with all clusters and questions

### Documentation
- **Content Plan:** `PAYDAY_LOANS_CONTENT_PLAN.md`
- **Strategy:** `PAYDAY_LOANS_CONTENT_STRATEGY.md`

---

## ✅ Quality Checklist

Before posting articles, verify:

- [ ] Content is 2000-2500 words
- [ ] Primary question answered in introduction
- [ ] All related questions addressed
- [ ] Proper HTML structure (h2, h3, lists)
- [ ] Disclaimers included
- [ ] State-specific notes where relevant
- [ ] Practical examples included
- [ ] SEO metadata complete
- [ ] No factual errors
- [ ] Appropriate tone and language

---

## 🐛 Troubleshooting

### API Errors

**Error: "Responses API may not be available"**
- Verify you have access to GPT-5.2
- Check API key is valid
- Ensure Responses API endpoint is accessible

**Error: "Could not extract content"**
- Response structure may have changed
- Check console output for response structure
- Verify API response format

### Content Quality Issues

**Too short:**
- Increase `verbosity` to `high`
- Increase `max_output_tokens`
- Enhance prompt with more specific requirements

**Too generic:**
- Review prompt specificity
- Ensure payday-loan-specific guidelines are clear
- Check that related questions are being addressed

**Missing disclaimers:**
- Verify system prompt includes disclaimer requirements
- Check that prompts emphasize risk warnings

---

## 📈 Next Steps

1. ✅ Content plan created
2. ✅ GPT-5.2 script configured
3. ⏳ Generate first batch of articles (top 10 priority)
4. ⏳ Review and refine content quality
5. ⏳ Post articles to site
6. ⏳ Monitor performance and iterate

---

## 📚 References

- [GPT-5.2 Documentation](https://platform.openai.com/docs/models/gpt-5-2)
- [Reasoning Guide](https://platform.openai.com/docs/guides/reasoning)
- [Responses API Guide](https://platform.openai.com/docs/api-reference/responses)

---

## 💡 Tips

1. **Start with high-priority clusters** (Basic Understanding, Loan Types)
2. **Review first few articles** to ensure quality matches expectations
3. **Adjust reasoning/verbosity** if needed based on results
4. **Batch generate** articles from same cluster for consistency
5. **Monitor API costs** - GPT-5.2 with medium reasoning can be more expensive

---

**Ready to generate articles!** 🚀








