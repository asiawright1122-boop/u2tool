#!/usr/bin/env node

/**
 * Final Directories Push - Try remaining high-value directories
 * Run: node scripts/final-push.cjs
 */

const https = require('https');
const { URL } = require('url');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID, color conversion.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  {
    name: 'DevHunt',
    url: 'https://devhunt.org/submit',
    data: `title=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'OpenSource',
    url: 'https://opensource.com/submit',
    data: `title=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'Linux',
    url: 'https://www.linux.com/submit',
    data: `title=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'ComputerWorld',
    url: 'https://www.computerworld.com/submit',
    data: `title=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'InfoWorld',
    url: 'https://www.infoworld.com/submit',
    data: `title=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'NetworkWorld',
    url: 'https://www.networkworld.com/submit',
    data: `title=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'TechRepublic',
    url: 'https://www.techrepublic.com/submit',
    data: `title=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'eWeek',
    url: 'https://www.eweek.com/submit',
    data: `title=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'CMSWire',
    url: 'https://www.cmswire.com/submit',
    data: `title=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'MarTech',
    url: 'https://martech.org/submit',
    data: `title=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
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
        'Accept': 'text/html,*/*'
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const bodyLower = body.toLowerCase();
        const success = bodyLower.includes('thank') || bodyLower.includes('success') || bodyLower.includes('submitted');
        resolve({ name: dir.name, status: res.statusCode, success });
      });
    });
    
    req.on('error', () => resolve({ name: dir.name, status: 0, success: false }));
    req.setTimeout(10000, () => { req.destroy(); resolve({ name: dir.name, status: 0, success: false }); });
    
    req.write(dir.data);
    req.end();
  });
}

async function main() {
  console.log(`\n🚀 Final Push - High Value Directories\n`);
  
  const results = [];
  
  for (const dir of DIRECTORIES) {
    process.stdout.write(`${dir.name}... `);
    const result = await submit(dir);
    console.log(result.success ? '✅' : '❌');
    results.push(result);
    await new Promise(r => setTimeout(r, 1500));
  }
  
  const success = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n✅ Success: ${success.length}`);
  success.forEach(r => console.log(`   - ${r.name}`));
  console.log(`\n❌ Failed: ${failed.length}`);
}

main();
