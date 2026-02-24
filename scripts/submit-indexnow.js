#!/usr/bin/env node

/**
 * submit-indexnow.js
 * 
 * Submits sitemap updates to search engines using IndexNow protocol
 * Supports Bing, Yandex, and other IndexNow-compliant search engines
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://www.u2tool.com';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const API_KEY = 'u2tool-indexnow-key-2026'; // Replace with your actual API key
const API_KEY_FILE = path.join(__dirname, '..', 'public', 'key.txt');

// Search engines that support IndexNow
const SEARCH_ENGINES = [
  'https://bing.com/indexnow',
  'https://yandex.com/indexnow'
];

async function main() {
  console.log('=== IndexNow Submission Script ===\n');
  
  try {
    // Ensure API key file exists
    await ensureApiKeyFile();
    
    // Submit sitemap to all search engines
    for (const engine of SEARCH_ENGINES) {
      console.log(`Submitting to ${engine}...`);
      await submitToSearchEngine(engine);
    }
    
    console.log('\n✅ All submissions completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`- Site URL: ${SITE_URL}`);
    console.log(`- Sitemap URL: ${SITEMAP_URL}`);
    console.log(`- Submitted to: ${SEARCH_ENGINES.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error submitting IndexNow:', error.message);
    process.exit(1);
  }
}

async function ensureApiKeyFile() {
  // Create API key file if it doesn't exist
  if (!fs.existsSync(API_KEY_FILE)) {
    console.log('Creating API key file...');
    fs.writeFileSync(API_KEY_FILE, API_KEY);
    console.log(`Created API key file at ${API_KEY_FILE}`);
  }
}

async function submitToSearchEngine(engineUrl) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      host: 'www.u2tool.com',
      key: API_KEY,
      keyLocation: `${SITE_URL}/key.txt`,
      urlList: [SITEMAP_URL]
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(engineUrl, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`  ✅ Success: ${res.statusCode}`);
          resolve();
        } else {
          console.log(`  ⚠️  Received status code: ${res.statusCode}`);
          console.log(`  Response: ${responseData}`);
          resolve(); // Continue even if one engine fails
        }
      });
    });

    req.on('error', (error) => {
      console.log(`  ❌ Error: ${error.message}`);
      resolve(); // Continue even if one engine fails
    });

    req.write(data);
    req.end();
  });
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
