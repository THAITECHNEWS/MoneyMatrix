import * as fs from 'fs';
import * as path from 'path';

interface ArticleRequest {
  clusterName: string;
  primaryQuestion: string;
  relatedQuestions: string[];
  targetVolume: number;
  slug: string;
}

// Load environment variables
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  const envLocalPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }
  
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }
}

async function generateArticle(request: ArticleRequest): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not found');
  }

  // GPT-5.2 specific prompt following the reasoning guide
  const systemPrompt = `You are an expert financial content writer specializing in payday loans and consumer finance. Your role is to create comprehensive, accurate, and helpful content that educates readers while protecting their financial well-being.

CORE MISSION:
- Answer payday loan questions with factual, well-researched information
- Provide practical, actionable advice that helps readers make informed decisions
- Include appropriate warnings and disclaimers about payday loan risks
- Write in accessible language (8th-10th grade reading level)
- Structure content for SEO while prioritizing reader value

FACTUALITY AND ACCURACY (NON-NEGOTIABLE):
- Never invent facts, statistics, or legal information
- If information varies by state, clearly state this
- Include disclaimers about state-specific regulations
- Note when information may change or requires verification
- Use language like "typically," "generally," or "in most states" when appropriate
- Never guarantee outcomes or make absolute claims about approval, rates, or legal consequences

CONTENT STRUCTURE REQUIREMENTS:
- Introduction: Directly answer the primary question in 2-3 sentences, then provide context
- Main sections: Use H2 headings for major topics, H3 for subsections
- Answer all related questions thoroughly within the article
- CRITICAL: Answer each question ONCE and only once. Do not repeat the same information multiple times
- If questions are similar or overlapping, consolidate them into a single comprehensive answer rather than repeating
- Each section should cover unique aspects - avoid redundancy between sections
- Include practical examples and real-world scenarios
- Use bullet points and numbered lists for scannability
- Conclusion: Summarize key points and provide next steps

OUTPUT VERBOSITY SPEC:
- Target length: 2000-2500 words for comprehensive coverage
- Use clear, structured responses with proper HTML formatting
- Break information into digestible chunks (3-6 sentences per paragraph)
- Use formatting like lists, tables, and short sections
- Avoid long narrative paragraphs; prefer compact bullets and short sections
- Do not rephrase the user's request unless it changes semantics

HANDLING AMBIGUITY:
- If the question has multiple interpretations, address all plausible meanings
- For state-specific questions, provide general information and note state variations
- When legal information is involved, emphasize consulting legal/financial professionals
- Never fabricate specific numbers, rates, or legal outcomes

REQUIRED DISCLAIMERS:
- Include appropriate warnings about payday loan risks (high interest, debt cycles)
- Note that payday loans should be a last resort
- Encourage readers to explore alternatives
- State that information is for educational purposes only
- Recommend consulting financial advisors or credit counselors when appropriate

VALUE-ADD BEHAVIOR:
- Provide concrete examples (specific scenarios, typical amounts, common situations)
- Include practical tips and actionable advice
- Explain underlying mechanisms (how things work, why they matter)
- Add relevant context and background information
- Include comparisons when helpful (payday loans vs alternatives)
- Address common misconceptions

WRITING GUIDELINES:
- Use simple language: full sentences, short words, concrete verbs, active voice
- Avoid jargon unless clearly necessary
- Use readable formatting: Markdown headers, bullets, tables for comparisons
- Write directly and conversationally, not robotically
- Define acronyms on first use
- Use concrete examples throughout`;

  const userPrompt = `Write a comprehensive, SEO-optimized article about payday loans that answers the following question:

PRIMARY QUESTION: "${request.primaryQuestion}"

RELATED QUESTIONS TO ALSO ADDRESS:
${request.relatedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

ARTICLE REQUIREMENTS:
1. Write 2000-2500 words of high-quality, informative content
2. Use proper HTML structure with semantic tags (h2, h3, p, ul, ol, strong, em)
3. Answer the primary question thoroughly in the introduction
4. Address all related questions in dedicated sections throughout the article
5. CRITICAL ANTI-REPETITION RULE: Answer each question ONCE and only once. If questions overlap or are similar, consolidate them into a single comprehensive answer. Do not repeat the same information in multiple sections. Each section must cover unique aspects or perspectives.
6. Before writing each section, check if you've already covered that information elsewhere in the article. If yes, reference the earlier section or expand on it with new details rather than repeating.
7. Use the year 2026 in the title and throughout the article (not 2025)
8. Include practical examples, real-world scenarios, and actionable advice
9. Use bullet points and numbered lists where appropriate
10. Include appropriate disclaimers about payday loan risks
11. Note state-specific variations when relevant
12. Provide a conclusion that summarizes key points
13. Structure content for SEO with proper heading hierarchy

CONTENT STRUCTURE:
- Introduction (answer primary question + context) - The first paragraph should be a clear, concise summary (150-200 words) that can serve as the article excerpt
- Main sections addressing each related question (use H2 headings)
- Subsections with detailed explanations (use H3 headings)
- Practical tips and advice section
- Common mistakes to avoid
- Alternatives section (when relevant)
- Conclusion with key takeaways

IMPORTANT:
- Write ONLY the article content in HTML format
- Do NOT include <html>, <head>, <body>, or <!DOCTYPE> tags
- Start directly with the article content (h1 or h2)
- Use proper semantic HTML tags throughout
- Ensure all information is accurate and includes appropriate qualifiers
- Include disclaimers about consulting professionals for legal/financial advice
- The first paragraph after the h1 should be a comprehensive summary (150-200 words) that answers the primary question and gives readers a clear overview of what the article covers`;

  try {
    // Combine system and user prompts for Responses API
    // Responses API uses a single input string format
    const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;

    console.log('📡 Calling GPT-5.2 Responses API...');

    // Use GPT-5.2 with Responses API (using fetch directly for better control)
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5.2',
        input: combinedPrompt,
        reasoning: {
          effort: 'medium' // Use medium reasoning for quality content generation
        },
        text: {
          verbosity: 'high' // High verbosity for comprehensive 2000-2500 word articles
        },
        max_output_tokens: 8000 // Allow for comprehensive content
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`API Error (${response.status}): ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    // Extract content from response
    // The Responses API returns output as an array
    let content = '';
    if (data.output && Array.isArray(data.output)) {
      for (const outputItem of data.output) {
        // Handle message type with content array
        if (outputItem.type === 'message' && outputItem.content && Array.isArray(outputItem.content)) {
          for (const contentItem of outputItem.content) {
            if ((contentItem.type === 'output_text' || contentItem.type === 'text') && contentItem.text) {
              content += contentItem.text + '\n\n';
            }
          }
        } 
        // Handle direct text field
        else if (outputItem.text) {
          content += outputItem.text + '\n\n';
        }
        // Handle string output
        else if (typeof outputItem === 'string') {
          content += outputItem + '\n\n';
        }
        // Handle content as string
        else if (outputItem.content && typeof outputItem.content === 'string') {
          content += outputItem.content + '\n\n';
        }
      }
    }

    // Fallback: check for direct text field
    if (!content && data.text) {
      content = typeof data.text === 'string' ? data.text : JSON.stringify(data.text);
    }

    if (!content) {
      console.error('Response structure:', JSON.stringify(data, null, 2).substring(0, 1000));
      throw new Error('Could not extract content from response. Response structure may have changed.');
    }

    return content.trim();
  } catch (error: any) {
    console.error('Error generating article:', error);
    
    // If Responses API fails, provide helpful error message
    if (error.message?.includes('responses') || error.message?.includes('404') || error.message?.includes('API Error')) {
      throw new Error(`Responses API error: ${error.message}. Ensure you have access to GPT-5.2 and the Responses API endpoint.`);
    }
    
    throw error;
  }
}

function generateMetaData(request: ArticleRequest): {
  title: string;
  description: string;
  keywords: string[];
} {
  // Convert question to title case
  const title = request.primaryQuestion
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\?/g, '')
    .trim() + ' | Complete Guide 2026';

  const description = `Learn about ${request.primaryQuestion.toLowerCase()}. Get expert answers to your payday loan questions, understand the risks, and make informed financial decisions. Comprehensive guide with practical advice.`;

  const keywords = [
    'payday loans',
    request.primaryQuestion,
    ...request.relatedQuestions.slice(0, 3),
    'payday loan guide',
    'payday loan information'
  ];

  return { title, description, keywords };
}

function extractExcerpt(content: string, maxLength: number = 200): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Try to find the first paragraph after h1
  const h1Match = content.match(/<h1[^>]*>.*?<\/h1>/i);
  if (h1Match) {
    const afterH1 = content.substring(content.indexOf(h1Match[0]) + h1Match[0].length);
    const firstParagraphMatch = afterH1.match(/<p[^>]*>(.*?)<\/p>/i);
    if (firstParagraphMatch) {
      let excerpt = firstParagraphMatch[1]
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      excerpt = excerpt.replace(/<strong>(.*?)<\/strong>/gi, '$1');
      
      if (excerpt.length >= 100 && excerpt.length <= maxLength + 50) {
        return excerpt.length > maxLength 
          ? excerpt.substring(0, maxLength).trim() + '...'
          : excerpt;
      }
      
      if (excerpt.length > maxLength) {
        const truncated = excerpt.substring(0, maxLength);
        const lastPeriod = truncated.lastIndexOf('.');
        const lastExclamation = truncated.lastIndexOf('!');
        const lastQuestion = truncated.lastIndexOf('?');
        const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
        
        if (lastSentenceEnd > maxLength * 0.7) {
          return excerpt.substring(0, lastSentenceEnd + 1);
        }
        return truncated.trim() + '...';
      }
    }
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
  
  if (lastSentenceEnd > maxLength * 0.7) {
    return text.substring(0, lastSentenceEnd + 1);
  }
  
  return truncated.trim() + '...';
}

async function main() {
  loadEnv();

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    console.error('Please add OPENAI_API_KEY to your .env file');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run generate:payday-article "<cluster-name>" <article-number>');
    console.log('\nExample: npm run generate:payday-article "Basic Understanding" 1');
    console.log('\nAvailable clusters:');
    
    const planPath = path.join(process.cwd(), 'data/payday-loans-content-plan.json');
    if (fs.existsSync(planPath)) {
      const plan = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
      plan.clusters.forEach((cluster: any) => {
        console.log(`  - ${cluster.name} (${cluster.estimatedArticles} articles)`);
      });
    }
    
    process.exit(0);
  }

  const clusterName = args[0];
  const articleIndex = parseInt(args[1]) - 1;

  if (isNaN(articleIndex) || articleIndex < 0) {
    console.error('❌ Invalid article number. Please provide a positive integer.');
    process.exit(1);
  }

  // Load content plan
  const planPath = path.join(process.cwd(), 'data/payday-loans-content-plan.json');
  if (!fs.existsSync(planPath)) {
    console.error('❌ Content plan not found. Run analyze:payday-questions first.');
    console.error('   Command: npm run analyze:payday-questions');
    process.exit(1);
  }

  const plan = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
  const cluster = plan.clusters.find((c: any) => c.name === clusterName);

  if (!cluster) {
    console.error(`❌ Cluster "${clusterName}" not found`);
    console.error('\nAvailable clusters:');
    plan.clusters.forEach((c: any) => {
      console.error(`  - ${c.name}`);
    });
    process.exit(1);
  }

  // Get questions for this cluster
  const questions = cluster.questions || [];
  if (questions.length === 0) {
    console.error(`❌ No questions found in cluster "${clusterName}"`);
    process.exit(1);
  }

  if (articleIndex >= questions.length) {
    console.error(`❌ Article number ${articleIndex + 1} exceeds available questions (${questions.length})`);
    process.exit(1);
  }

  // Select primary question and related questions
  const primaryQuestion = questions[articleIndex].keyword;
  const relatedQuestions = questions
    .filter((q: any, i: number) => i !== articleIndex)
    .slice(0, 5) // Get top 5 related questions
    .map((q: any) => q.keyword);

  const request: ArticleRequest = {
    clusterName,
    primaryQuestion,
    relatedQuestions,
    targetVolume: questions[articleIndex].volume || 0,
    slug: primaryQuestion
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  };

  console.log(`\n📝 Generating payday loan article using GPT-5.2\n`);
  console.log(`Cluster: ${clusterName}`);
  console.log(`Primary Question: "${request.primaryQuestion}"`);
  console.log(`Related Questions: ${request.relatedQuestions.length}`);
  console.log(`Target Volume: ${request.targetVolume}`);
  console.log(`\n⏳ Generating content (this may take 30-60 seconds)...\n`);

  try {
    const content = await generateArticle(request);
    const meta = generateMetaData(request);
    const excerpt = extractExcerpt(content, 200);

    // Save article
    const outputDir = path.join(process.cwd(), 'data/generated-articles');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const articleData = {
      slug: request.slug,
      title: meta.title,
      description: meta.description,
      excerpt: excerpt,
      keywords: meta.keywords,
      category: 'payday-loans',
      content: content,
      cluster: clusterName,
      primaryQuestion: request.primaryQuestion,
      relatedQuestions: request.relatedQuestions,
      targetVolume: request.targetVolume,
      model: 'gpt-5.2',
      reasoningEffort: 'medium',
      verbosity: 'high',
      generatedAt: new Date().toISOString()
    };

    const outputPath = path.join(outputDir, `${request.slug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(articleData, null, 2));

    console.log(`✅ Article generated successfully!\n`);
    console.log(`📄 Saved to: ${outputPath}\n`);
    console.log(`Title: ${meta.title}`);
    console.log(`Slug: ${request.slug}`);
    console.log(`Word Count: ~${Math.round(content.split(/\s+/).length)} words`);
    console.log(`\n📋 Next Steps:`);
    console.log(`1. Review the article: ${outputPath}`);
    console.log(`2. Check content quality and accuracy`);
    console.log(`3. Post to site at: /payday-loans/${request.slug}`);
    console.log(`4. Verify SEO metadata and formatting`);

  } catch (error: any) {
    console.error('\n❌ Error generating article:', error.message);
    
    if (error.message?.includes('Responses API')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   - Ensure you have access to GPT-5.2');
      console.error('   - Verify your API key has Responses API access');
      console.error('   - Check OpenAI API status');
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
