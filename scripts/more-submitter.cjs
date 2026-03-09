#!/usr/bin/env node

/**
 * More Directories Submitter - Try additional directories
 * Run: node scripts/more-submitter.cjs
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
    name: 'SaaSHub',
    url: 'https://saashub.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'SaaS Discovery',
    url: 'https://saasdiscovery.co/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools&email=${encodeURIComponent(SITE.email)}`
  },
  {
    name: 'CodeMyUI',
    url: 'https://codemyui.com/submit/',
    data: `tool_name=${encodeURIComponent(SITE.name)}&tool_url=${encodeURIComponent(SITE.url)}&tool_description=${encodeURIComponent(SITE.description)}&tool_category=Developer+Tools`
  },
  {
    name: 'CSS Author',
    url: 'https://cssauthor.com/submit-your-tool/',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'Webydo',
    url: 'https://webydo.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'DesignMunch',
    url: 'https://designmunch.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'Startup Li.st',
    url: 'https://startupli.st/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'Showcase',
    url: 'https://showcase.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'AppSumo',
    url: 'https://appsumo.com/submit-product/',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'SaaS Optic',
    url: 'https://saasoptic.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'Betalist',
    url: 'https://betalist.com/submit',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&email=${encodeURIComponent(SITE.email)}`
  },
  {
    name: 'Indie Hackers',
    url: 'https://indiehackers.com/post',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'Product Hunt',
    url: 'https://www.producthunt.com/posts/new',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'StackShare',
    url: 'https://stackshare.io/submissions/new',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}&category=Developer+Tools`
  },
  {
    name: 'G2',
    url: 'https://www.g2.com/products/u2tool/submissions/new',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'Capterra',
    url: 'https://www.capterra.com/software/-request-review',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'AlternativeTo',
    url: 'https://alternativeto.net/software/u2tool/',
    data: `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`
  },
  {
    name: 'TrustRadius',
    url: 'https://www.trustradius.com/products/u2tool/reviews',
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
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/'
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const bodyLower = body.toLowerCase();
        const success = bodyLower.includes('thank') || bodyLower.includes('success') || bodyLower.includes('submitted') || bodyLower.includes('received') || (res.statusCode >= 200 && res.statusCode < 400);
        resolve({ name: dir.name, status: res.statusCode, success, redirect: res.headers.location });
      });
    });
    
    req.on('error', () => resolve({ name: dir.name, status: 0, success: false }));
    req.setTimeout(15000, () => { req.destroy(); resolve({ name: dir.name, status: 0, success: false }); });
    
    req.write(dir.data);
    req.end();
  });
}

async function main() {
  console.log(`\n🚀 More Directories Submitter\n`);
  
  const results = [];
  
  for (const dir of DIRECTORIES) {
    process.stdout.write(`Submitting to ${dir.name}... `);
    const result = await submit(dir);
    console.log(result.success ? '✅' : '❌');
    results.push(result);
    await new Promise(r => setTimeout(r, 2500));
  }
  
  console.log(`\n\n📊 Results:\n`);
  
  const success = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Success: ${success.length}`);
  success.forEach(r => console.log(`   - ${r.name}`));
  
  console.log(`\n❌ Failed: ${failed.length}`);
  failed.forEach(r => console.log(`   - ${r.name}`));
  
  console.log(`\n\n💡 Manual Actions Needed:`);
  failed.forEach(r => console.log(`   - ${r.name}: ${r.redirect || ''}`));
}

main();
