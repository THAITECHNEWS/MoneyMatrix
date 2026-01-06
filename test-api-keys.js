// Quick test script for API keys
const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const APIFY_KEY = process.env.NEXT_PUBLIC_APIFY_API_KEY;

console.log('🔑 Testing API Keys...\n');

// Test Google Maps API Key
if (GOOGLE_MAPS_KEY && GOOGLE_MAPS_KEY !== 'your_google_maps_key_here') {
  console.log('✅ Google Maps API Key found:', GOOGLE_MAPS_KEY.substring(0, 20) + '...');
  
  // Test if key is valid by checking Maps JavaScript API
  const testUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places`;
  
  https.get(testUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      if (res.statusCode === 200 && !data.includes('RefererNotAllowedMapError')) {
        console.log('✅ Google Maps API Key: VALID\n');
      } else if (data.includes('RefererNotAllowedMapError')) {
        console.log('⚠️  Google Maps API Key: Valid but domain restrictions may block localhost\n');
      } else {
        console.log('❌ Google Maps API Key: INVALID\n');
      }
      testApifyKey();
    });
  }).on('error', (err) => {
    console.log('⚠️  Could not test Google Maps API Key:', err.message, '\n');
    testApifyKey();
  });
} else {
  console.log('❌ Google Maps API Key: NOT FOUND\n');
  testApifyKey();
}

function testApifyKey() {
  if (APIFY_KEY && APIFY_KEY !== 'your_apify_key_here') {
    console.log('✅ Apify API Key found:', APIFY_KEY.substring(0, 20) + '...');
    
    // Test Apify API by checking user info
    const options = {
      hostname: 'api.apify.com',
      path: '/v2/users/me?token=' + APIFY_KEY,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          const user = JSON.parse(data);
          console.log('✅ Apify API Key: VALID');
          console.log('   User:', user.data?.username || 'Unknown');
          console.log('   Plan:', user.data?.plan?.name || 'Unknown', '\n');
        } else {
          console.log('❌ Apify API Key: INVALID');
          console.log('   Status:', res.statusCode, '\n');
        }
        printSummary();
      });
    }).on('error', (err) => {
      console.log('❌ Apify API Key: ERROR -', err.message, '\n');
      printSummary();
    });
  } else {
    console.log('⏳ Apify API Key: NOT CONFIGURED (optional for now)\n');
    printSummary();
  }
}

function printSummary() {
  console.log('📋 SUMMARY:');
  console.log('===========');
  if (GOOGLE_MAPS_KEY && GOOGLE_MAPS_KEY !== 'your_google_maps_key_here') {
    console.log('✅ Google Maps: Configured');
  } else {
    console.log('❌ Google Maps: Missing');
  }
  if (APIFY_KEY && APIFY_KEY !== 'your_apify_key_here') {
    console.log('✅ Apify: Configured');
  } else {
    console.log('⏳ Apify: Not configured (optional)');
  }
  console.log('\n💡 To test locally: npm run dev');
  console.log('💡 Then visit: http://localhost:3000/locations/payday-loans-in-los-angeles-ca');
}

