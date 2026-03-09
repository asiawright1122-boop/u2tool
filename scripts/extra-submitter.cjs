#!/usr/bin/env node

/**
 * Extra Directories Submitter - Even more directories
 * Run: node scripts/extra-submitter.cjs
 */

const https = require('https');
const { URL } = require('url');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID, color conversion, and more.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  {
    name: 'ToolBox',
    url: 'https://toolbox.tools/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'FreeToolHub',
    url: 'https://freetoolhub.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'ToolsFinder',
    url: 'https://toolsfinder.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'AllTechBuzz',
    url: 'https://alltechbuzz.net/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'TechPanga',
    url: 'https://techpanga.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'TechFandom',
    url: 'https://techfandom.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'MarkTechPost',
    url: 'https://marktechpost.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'SciTechDaily',
    url: 'https://scitechdaily.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'InsideBitcoins',
    url: 'https://insidebitcoins.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'CoinGecko',
    url: 'https://www.coingecko.com/en/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'ProductHunt',
    url: 'https://www.producthunt.com/products/u2tool',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'StackShare2',
    url: 'https://stackshare.io/u2tool',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'AlternativeTo2',
    url: 'https://alternativeto.net/browse/',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'G22',
    url: 'https://www.g2.com/categories/dev-tools',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'Capterra2',
    url: 'https://www.capterra.com/categories/',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  }
];

function submit(dir) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(dir.url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(dir.data),
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,*/*',
        'Referer': 'https://www.google.com/'
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const bodyLower = body.toLowerCase();
        const success = bodyLower.includes('thank') || bodyLower.includes('success') || bodyLower.includes('submitted') || bodyLower.includes('received') || bodyLower.includes('added');
        resolve({ name: dir.name, status: res.statusCode, success });
      });
    });
    
    req.on('error', () => resolve({ name: dir.name, status: 0, success: false }));
    req.setTimeout(12000, () => { req.destroy(); resolve({ name: dir.name, status: 0, success: false }); });
    
    req.write(dir.data);
    req.end();
  });
}

async function main() {
  console.log(`\n🚀 Extra Directories Submitter\n`);
  
  const results = [];
  
  for (const dir of DIRECTORIES) {
    process.stdout.write(`Submitting to ${dir.name}... `);
    const result = await submit(dir);
    console.log(result.success ? '✅' : '❌');
    results.push(result);
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log(`\n\n📊 Results:\n`);
  
  const success = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Success: ${success.length}`);
  success.forEach(r => console.log(`   - ${r.name}`));
  
  console.log(`\n❌ Failed: ${failed.length}`);
  failed.forEach(r => console.log(`   - ${r.name}`));
}

main();
