#!/usr/bin/env node

/**
 * Bulk Directory Submitter - Auto submit to multiple directories
 * Run: node scripts/bulk-submitter.cjs
 */

const https = require('https');
const { URL } = require('url');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID, color conversion, and more.',
  email: 'contact@u2tool.com',
  tags: 'developer tools, json formatter, base64 encoder, qr generator, password generator, online tools, free tools'
};

const DIRECTORIES = [
  {
    name: 'ToolScout',
    url: 'https://toolscout.io/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&email=${encodeURIComponent(SITE.email)}&category=Developer+Tools`
  },
  {
    name: 'Online Tools IO',
    url: 'https://onlinetools.io/submit',
    data: `tool_name=${encodeURIComponent(SITE.name)}&tool_url=${encodeURIComponent(SITE.url)}&tool_desc=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'Web Tools Finder',
    url: 'https://webtoolsfinder.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'Future Tools',
    url: 'https://futuretools.io/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools&tags=${encodeURIComponent(SITE.tags)}`
  },
  {
    name: "There's an AI for That",
    url: 'https://theresanaiforthat.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'AI Tools Directory',
    url: 'https://aitoolsdirectory.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'Stack Lima',
    url: 'https://stacklima.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'Launchpad',
    url: 'https://launchpad.cc/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'ToolDirectory',
    url: 'https://tooldirectory.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'FreeOnlineTools',
    url: 'https://freeonlinetools.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'LittleBigTools',
    url: 'https://littlebigtools.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'DevTool Directory',
    url: 'https://devtooles.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'Coding Tools',
    url: 'https://coding.tools/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'Online Utility',
    url: 'https://online-utility.org/submit',
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Referer': 'https://www.google.com/'
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const success = body.toLowerCase().includes('thank') || body.toLowerCase().includes('success') || body.toLowerCase().includes('submitted') || res.statusCode < 400;
        resolve({ name: dir.name, status: res.statusCode, success });
      });
    });
    
    req.on('error', () => resolve({ name: dir.name, status: 0, success: false }));
    req.setTimeout(15000, () => { req.destroy(); resolve({ name: dir.name, status: 0, success: false }); });
    
    req.write(dir.data);
    req.end();
  });
}

async function main() {
  console.log(`\n🚀 Bulk Directory Submitter\n`);
  
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
