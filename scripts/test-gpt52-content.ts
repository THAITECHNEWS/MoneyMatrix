#!/usr/bin/env ts-node
/**
 * Test GPT-5.2 Content Generation
 * Generates a sample article and saves it to a markdown file
 * Run: npx ts-node --project scripts/tsconfig.json scripts/test-gpt52-content.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('❌ OPENAI_API_KEY not found in .env file');
  process.exit(1);
}

async function testGPT52() {
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not found');
    process.exit(1);
  }

  console.log('\n🧪 Testing GPT-5.2 Content Generation\n');
  console.log('='.repeat(70));
  console.log(`API Key: ${apiKey.substring(0, 20)}...`);
  console.log('Model: gpt-5.2');
  console.log('='.repeat(70));
  console.log('\n⏳ Generating article... This may take 30-60 seconds...\n');

  const prompt = `Write a comprehensive, SEO-optimized article about "How to Find the Best Payday Loans Near You" for a financial comparison website.

The article should be:
- 1500-2000 words
- Well-structured with clear headings (H2, H3)
- Include practical tips and advice
- SEO-optimized with natural keyword usage
- Written in a helpful, informative tone
- Include sections on: how to search for lenders, what to look for, how to compare options, red flags to avoid, and best practices

Format the output in markdown with proper headings, paragraphs, lists, and formatting.`;

  try {
    const startTime = Date.now();

    // Try GPT-5.2 Responses API first
    console.log('🔄 Attempting GPT-5.2 Responses API...\n');
    
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5.2',
        input: prompt,
        reasoning: {
          effort: 'medium',
        },
        text: {
          verbosity: 'high',
        },
        max_output_tokens: 4000,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      
      console.log(`✅ GPT-5.2 Responses API successful! (${elapsed}s)\n`);
      
      // Extract content from GPT-5.2 Responses API
      let contentText = '';
      if (data.output && Array.isArray(data.output)) {
        for (const outputItem of data.output) {
          if (outputItem.type === 'message' && outputItem.content && Array.isArray(outputItem.content)) {
            for (const contentItem of outputItem.content) {
              if ((contentItem.type === 'output_text' || contentItem.type === 'text') && contentItem.text) {
                contentText += contentItem.text + '\n\n';
              }
            }
          } else if (outputItem.text) {
            contentText += outputItem.text + '\n\n';
          } else if (typeof outputItem === 'string') {
            contentText += outputItem + '\n\n';
          }
        }
      } else if (data.text) {
        contentText = typeof data.text === 'string' ? data.text : JSON.stringify(data.text);
      }

      if (contentText) {
        // Save to markdown file
        const outputDir = path.join(__dirname, '..', 'generated-content');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `gpt52-test-article-${timestamp}.md`;
        const filepath = path.join(outputDir, filename);

        // Add frontmatter
        const markdownContent = `---
title: "How to Find the Best Payday Loans Near You"
generated: ${new Date().toISOString()}
model: gpt-5.2
word_count: ${contentText.split(/\s+/).length}
---

${contentText}
`;

        fs.writeFileSync(filepath, markdownContent, 'utf-8');

        console.log('✅ Article generated successfully!\n');
        console.log(`📄 Saved to: ${filepath}\n`);
        console.log(`📊 Statistics:`);
        console.log(`   - Word count: ${contentText.split(/\s+/).length.toLocaleString()}`);
        console.log(`   - Characters: ${contentText.length.toLocaleString()}`);
        console.log(`   - Generation time: ${elapsed}s\n`);
        console.log('📝 Preview (first 500 characters):');
        console.log('-'.repeat(70));
        console.log(contentText.substring(0, 500) + '...\n');
        console.log('='.repeat(70));
        console.log('✅ Test completed successfully!\n');
        
        return;
      } else {
        console.error('❌ No content found in API response');
        console.log('Response structure:', JSON.stringify(data, null, 2).substring(0, 500));
      }
    } else {
      const errorText = await response.text();
      console.error(`❌ GPT-5.2 Responses API error: ${response.status}`);
      console.error(`Error: ${errorText.substring(0, 300)}...\n`);
      
      // Fallback to Chat Completions
      console.log('🔄 Falling back to Chat Completions API with GPT-4o...\n');
      
      const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert SEO content writer. Write comprehensive, well-structured articles in markdown format.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (chatResponse.ok) {
        const chatData = await chatResponse.json();
        const content = chatData.choices[0]?.message?.content || '';
        
        if (content) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          console.log(`✅ GPT-4o fallback successful! (${elapsed}s)\n`);
          
          const outputDir = path.join(__dirname, '..', 'generated-content');
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const filename = `gpt4o-fallback-article-${timestamp}.md`;
          const filepath = path.join(outputDir, filename);

          const markdownContent = `---
title: "How to Find the Best Payday Loans Near You"
generated: ${new Date().toISOString()}
model: gpt-4o (fallback)
word_count: ${content.split(/\s+/).length}
---

${content}
`;

          fs.writeFileSync(filepath, markdownContent, 'utf-8');

          console.log('✅ Article generated with GPT-4o fallback!\n');
          console.log(`📄 Saved to: ${filepath}\n`);
          console.log(`📊 Word count: ${content.split(/\s+/).length.toLocaleString()}\n`);
        }
      } else {
        const chatError = await chatResponse.text();
        console.error(`❌ Chat Completions API error: ${chatResponse.status}`);
        console.error(`Error: ${chatError.substring(0, 300)}...`);
      }
    }
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  }
}

testGPT52().catch(console.error);

