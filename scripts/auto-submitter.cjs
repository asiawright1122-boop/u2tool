#!/usr/bin/env node

/**
 * Auto-Submitter - Attempts to submit to directories automatically
 * 
 * Note: Most directories require CAPTCHA, login, or email verification.
 * This script attempts submissions where possible and logs results.
 * 
 * Run: node scripts/auto-submitter.cjs
 */

const https = require('https');
const http = require('http');

const SITE_INFO = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools including JSON formatter, Base64 encoder, QR generator, password generator, and more.',
  email: 'contact@u2tool.com',
  category: 'Developer Tools'
};

const DIRECTORIES = [
  {
    name: 'StackShare',
    url: 'https://stackshare.io/submissions/new',
    method: 'GET',
    note: 'Requires login'
  },
  {
    name: 'Product Hunt',
    url: 'https://www.producthunt.com/posts/new',
    method: 'GET',
    note: 'Requires login'
  },
  {
    name: 'AlternativeTo',
    url: 'https://alternativeto.net/software/u2tool/',
    method: 'GET',
    note: 'Can add as alternative'
  },
  {
    name: 'SaaS Discovery',
    url: 'https://saasdiscovery.co/submit',
    method: 'GET',
    note: 'Simple form - try it'
  },
  {
    name: 'SaaSHub',
    url: 'https://saashub.com/submit',
    method: 'GET',
    note: 'Simple form - try it'
  },
  {
    name: 'ToolScout',
    url: 'https://toolscout.io/submit',
    method: 'GET',
    note: 'Simple form - try it'
  },
  {
    name: 'Betalist',
    url: 'https://betalist.com/submit',
    method: 'GET',
    note: 'Requires login'
  },
  {
    name: 'Future Tools',
    url: 'https://futuretools.io/submit',
    method: 'GET',
    note: 'Simple form'
  },
  {
    name: "There's an AI for That",
    url: 'https://theresanaiforthat.com/submit',
    method: 'GET',
    note: 'Simple form'
  },
  {
    name: 'Online Tools IO',
    url: 'https://onlinetools.io/submit',
    method: 'GET',
    note: 'Simple form'
  },
  {
    name: 'Web Tools Finder',
    url: 'https://webtoolsfinder.com/submit',
    method: 'GET',
    note: 'Simple form'
  }
];

function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(url, { method }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data.substring(0, 5000)
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
}

async function testDirectory(dir) {
  console.log(`\n🔄 Testing ${dir.name}...`);
  
  try {
    const result = await makeRequest(dir.url, 'GET');
    
    console.log(`   Status: ${result.status}`);
    
    if (result.status === 200) {
      const hasForm = result.body.includes('<form');
      const hasCaptcha = result.body.includes('captcha') || result.body.includes('recaptcha');
      const hasLogin = result.body.includes('login') || result.body.includes('signin');
      
      console.log(`   Has form: ${hasForm ? 'Yes' : 'No'}`);
      console.log(`   Has CAPTCHA: ${hasCaptcha ? 'Yes' : 'No'}`);
      console.log(`   Requires login: ${hasLogin ? 'Yes' : 'No'}`);
      
      if (!hasCaptcha && !hasLogin) {
        return { success: true, canAutoSubmit: true, note: dir.note };
      } else {
        return { success: true, canAutoSubmit: false, note: dir.note };
      }
    } else if (result.status === 301 || result.status === 302) {
      console.log(`   Redirects to: ${result.headers.location}`);
      return { success: true, redirect: result.headers.location, note: 'Redirects' };
    } else {
      return { success: false, status: result.status, note: dir.note };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message, note: dir.note };
  }
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║              AUTO-SUBMITTER - Directory Test                      ║
╚══════════════════════════════════════════════════════════════════════╝
  `);
  
  console.log('Site:', SITE_INFO.name);
  console.log('URL:', SITE_INFO.url);
  console.log('\nTesting directories...\n');
  
  const results = [];
  
  for (const dir of DIRECTORIES) {
    const result = await testDirectory(dir);
    results.push({ name: dir.name, ...result });
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                        RESULTS                                    ║
╚══════════════════════════════════════════════════════════════════════╝
  `);
  
  const autoSubmit = results.filter(r => r.canAutoSubmit);
  const manual = results.filter(r => !r.canAutoSubmit && r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n✅ Can Auto-Submit (${autoSubmit.length}):`);
  autoSubmit.forEach(r => console.log(`   - ${r.name}: ${r.note}`));
  
  console.log(`\n⚠️  Manual Required (${manual.length}):`);
  manual.forEach(r => console.log(`   - ${r.name}: ${r.note}`));
  
  console.log(`\n❌ Failed (${failed.length}):`);
  failed.forEach(r => console.log(`   - ${r.name}: ${r.note}`));
  
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                     RECOMMENDATIONS                               ║
╚══════════════════════════════════════════════════════════════════════╝

Most directories require manual submission. Here's what you can do:

1. Open these URLs in your browser and submit manually:
${autoSubmit.map(r => `   - ${r.name}: ${r.url}`).join('\n')}

2. For directories requiring login:
   - Create accounts on Product Hunt, StackShare, Betalist
   - These platforms give more visibility when you have a profile

3. Alternative strategy:
   - Answer questions on Stack Overflow with tool links
   - Write articles on Dev.to/Hashnode about your tools
   - Create YouTube tutorials
   - These build organic backlinks over time
`);
}

main().catch(console.error);
