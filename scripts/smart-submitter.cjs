#!/usr/bin/env node

/**
 * Smart Auto-Submitter - Uses GET first to check form, then POST
 * 
 * Run: node scripts/smart-submitter.cjs
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const SITE_INFO = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, and more.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  { name: 'AlternativeTo', url: 'https://alternativeto.net/software/u2tool/', type: 'alternative' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com/', type: 'redirect' },
  { name: 'StackShare', url: 'https://stackshare.io/', type: 'redirect' },
  { name: 'Betalist', url: 'https://betalist.com/submit', type: 'get' },
  { name: 'Indie Hackers', url: 'https://indiehackers.com/', type: 'redirect' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/', type: 'redirect' },
  { name: 'Reddit', url: 'https://www.reddit.com/', type: 'redirect' },
  { name: 'Dev.to', url: 'https://dev.to/', type: 'redirect' },
  { name: 'Hashnode', url: 'https://hashnode.com/', type: 'redirect' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com/', type: 'redirect' },
  { name: 'GitHub', url: 'https://github.com/', type: 'redirect' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/', type: 'redirect' },
  { name: 'Twitter', url: 'https://twitter.com/', type: 'redirect' },
  { name: 'YouTube', url: 'https://www.youtube.com/', type: 'redirect' },
  { name: 'G2', url: 'https://www.g2.com/products/u2tool', type: 'alternative' },
  { name: 'Capterra', url: 'https://www.capterra.com/p/235695/U2Tool', type: 'alternative' },
  { name: 'AppSumo', url: 'https://appsumo.com/', type: 'redirect' },
  { name: 'AngelList', url: 'https://angel.co/', type: 'redirect' },
  { name: 'Crunchbase', url: 'https://www.crunchbase.com/', type: 'redirect' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com/products/u2tool', type: 'alternative' },
];

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    };
    
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: body.substring(0, 10000) });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

async function checkDirectory(dir) {
  console.log(`\n🔍 Checking ${dir.name}...`);
  
  try {
    const result = await httpGet(dir.url);
    
    console.log(`   Status: ${result.status}`);
    
    if (dir.type === 'alternative') {
      if (result.body.includes('not found') || result.body.includes('404') || result.status === 404) {
        console.log(`   ⚠️  Not found - need to add as new`);
        return { name: dir.name, url: dir.url, status: 'NOT_FOUND', action: 'Add as new alternative' };
      } else {
        console.log(`   ✅ Already exists or exists as alternative`);
        return { name: dir.name, url: dir.url, status: 'EXISTS', action: 'Already listed' };
      }
    }
    
    if (result.status === 200 || result.status === 301 || result.status === 302) {
      if (result.body.includes('submit') || result.body.includes('add tool') || result.body.includes('add your')) {
        console.log(`   📝 Has submission form`);
        return { name: dir.name, url: dir.url, status: 'HAS_FORM', action: 'Manual submit' };
      }
      console.log(`   ✅ Accessible - needs manual engagement`);
      return { name: dir.name, url: dir.url, status: 'OK', action: 'Create content/post' };
    }
    
    return { name: dir.name, url: dir.url, status: 'UNKNOWN', action: 'Check manually' };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { name: dir.name, url: dir.url, status: 'ERROR', action: error.message };
  }
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║              SMART SUBMITTER - Directory Discovery          ║
╚══════════════════════════════════════════════════════════════════════╝
  `);
  
  const results = [];
  
  for (const dir of DIRECTORIES) {
    const result = await checkDirectory(dir);
    results.push(result);
    await new Promise(r => setTimeout(r, 1500));
  }
  
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                     ACTION ITEMS                             ║
╚══════════════════════════════════════════════════════════════════════╝
  `);
  
  const notFound = results.filter(r => r.status === 'NOT_FOUND');
  const exists = results.filter(r => r.status === 'EXISTS');
  const hasForm = results.filter(r => r.status === 'HAS_FORM');
  const ok = results.filter(r => r.status === 'OK');
  
  console.log(`\n📋 Already Listed (${exists.length}):`);
  exists.forEach(r => console.log(`   ✅ ${r.name}: ${r.url}`));
  
  console.log(`\n📝 Need to Add as Alternative (${notFound.length}):`);
  notFound.forEach(r => console.log(`   ➕ ${r.name}: ${r.url}`));
  
  console.log(`\n📝 Has Submit Form (${hasForm.length}):`);
  hasForm.forEach(r => console.log(`   📝 ${r.name}: ${r.url}`));
  
  console.log(`\n💬 Content/Post Required (${ok.length}):`);
  ok.forEach(r => console.log(`   💬 ${r.name}: ${r.url}`));
  
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                  IMMEDIATE ACTIONS                           ║
╚══════════════════════════════════════════════════════════════════════╝

1. Add as Alternative on these sites:
${notFound.map(r => `   - ${r.name}: ${r.url}`).join('\n')}

2. Create accounts and submit:
   - Product Hunt: https://www.producthunt.com/posts/new
   - StackShare: https://stackshare.io/submissions/new
   - Betalist: https://betalist.com/submit

3. Post/Share on:
   - Reddit: https://reddit.com/r/webdev
   - Hacker News: https://news.ycombinator.com
   - Dev.to: https://dev.to
   - Hashnode: https://hashnode.com

4. Answer questions on Stack Overflow with tool links
`);
}

main().catch(console.error);
