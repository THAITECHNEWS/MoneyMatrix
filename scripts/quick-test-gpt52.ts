#!/usr/bin/env ts-node
/**
 * Quick Test: Verify GPT-5.2 API Key and Model Access
 */

import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
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
  console.error('❌ OPENAI_API_KEY not found');
  process.exit(1);
}

async function quickTest() {
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not found');
    process.exit(1);
  }

  console.log('\n🧪 Quick GPT-5.2 API Test\n');
  console.log('='.repeat(60));
  console.log(`API Key: ${apiKey.substring(0, 25)}...`);
  console.log('Testing: GPT-5.2 Responses API');
  console.log('='.repeat(60));
  console.log('\n⏳ Testing with small request (should be fast)...\n');

  try {
    const startTime = Date.now();
    
    // Small test request
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5.2',
        input: 'Write a 100-word paragraph about payday loans. Format as markdown.',
        reasoning: {
          effort: 'none', // Fastest
        },
        text: {
          verbosity: 'low', // Fastest
        },
        max_output_tokens: 200,
      }),
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ GPT-5.2 API is WORKING! (${elapsed}s)\n`);
      
      // Debug: Show response structure
      console.log('📋 Response structure:');
      console.log(JSON.stringify(data, null, 2).substring(0, 1000));
      console.log('\n');
      
      // Extract content - GPT-5.2 Responses API structure
      let content = '';
      
      // Check for output array
      if (data.output && Array.isArray(data.output)) {
        for (const item of data.output) {
          if (typeof item === 'string') {
            content += item + '\n';
          } else if (item.type === 'message' && item.content) {
            if (Array.isArray(item.content)) {
              for (const contentItem of item.content) {
                if ((contentItem.type === 'output_text' || contentItem.type === 'text') && contentItem.text) {
                  content += contentItem.text + '\n';
                }
              }
            } else if (typeof item.content === 'string') {
              content += item.content + '\n';
            }
          } else if (item.text) {
            content += item.text + '\n';
          } else if (item.content) {
            content += item.content + '\n';
          }
        }
      }
      
      // Check for direct text field
      if (!content && data.text) {
        content = typeof data.text === 'string' ? data.text : JSON.stringify(data.text);
      }
      
      // Check for content field
      if (!content && data.content) {
        content = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
      }
      
      // Last resort: stringify the whole thing
      if (!content || content.length < 10) {
        content = JSON.stringify(data, null, 2).substring(0, 1000);
      }

      if (content) {
        console.log('📝 Generated Content:');
        console.log('-'.repeat(60));
        console.log(content);
        console.log('-'.repeat(60));
        console.log(`\n✅ Test successful! GPT-5.2 is working.\n`);
        console.log(`Response time: ${elapsed}s`);
        console.log(`Content length: ${content.length} characters\n`);
      } else {
        console.log('⚠️  API responded but no content found');
        console.log('Response:', JSON.stringify(data, null, 2).substring(0, 500));
      }
    } else {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status}`);
      console.error(`Response: ${errorText.substring(0, 500)}...\n`);
      
      if (response.status === 401) {
        console.error('💡 This might be an invalid API key or the key doesn\'t have access to GPT-5.2');
      } else if (response.status === 404) {
        console.error('💡 GPT-5.2 Responses API endpoint might not be available yet');
      }
    }
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('fetch')) {
      console.error('💡 Network error - check your internet connection');
    }
  }
}

quickTest().catch(console.error);

