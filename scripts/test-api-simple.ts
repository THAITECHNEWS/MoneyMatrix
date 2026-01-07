#!/usr/bin/env ts-node
// Simple API test

import * as fs from 'fs';
import * as path from 'path';

// Load .env
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
console.log('API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT FOUND');

if (!apiKey) {
  console.error('❌ No API key found!');
  process.exit(1);
}

// Test API call
async function testAPI() {
  try {
    console.log('\n🧪 Testing OpenAI API...\n');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Say "API test successful" in one sentence.' }],
        max_tokens: 50,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Test Successful!');
      console.log('Response:', data.choices[0]?.message?.content || 'No content');
    } else {
      const error = await response.text();
      console.error('❌ API Error:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAPI();








