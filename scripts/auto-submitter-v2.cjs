#!/usr/bin/env node

/**
 * Enhanced Auto-Submitter - Tries POST submissions with form data
 * 
 * Run: node scripts/auto-submitter-v2.cjs
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const SITE_INFO = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools including JSON formatter, Base64 encoder, QR generator, password generator, hash generator, UUID generator, and more.',
  email: 'contact@u2tool.com',
  category: 'Developer Tools',
  tags: 'developer tools, json formatter, base64, qr code, password generator, online tools, free tools'
};

const DIRECTORIES = [
  {
    name: 'ToolScout',
    url: 'https://toolscout.io/submit',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description,
      email: SITE_INFO.email,
      category: SITE_INFO.category
    }
  },
  {
    name: 'Online Tools IO',
    url: 'https://onlinetools.io/submit',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description,
      category: 'Developer Tools'
    }
  },
  {
    name: 'SaaS Discovery',
    url: 'https://saasdiscovery.co/submit',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      tagline: SITE_INFO.description,
      description: SITE_INFO.description,
      category: 'Developer Tools',
      email: SITE_INFO.email
    }
  },
  {
    name: 'Web Tools Finder',
    url: 'https://webtoolsfinder.com/submit',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description,
      category: 'Developer Tools'
    }
  },
  {
    name: 'SaaSHub',
    url: 'https://saashub.com/submit',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description,
      category: 'Developer Tools'
    }
  },
  {
    name: 'Future Tools',
    url: 'https://futuretools.io/submit',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description,
      category: 'Developer Tools',
      tags: SITE_INFO.tags
    }
  },
  {
    name: "There's an AI for That",
    url: 'https://theresanaiforthat.com/submit',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description,
      category: 'Developer Tools'
    }
  },
  {
    name: 'AI Tools Directory',
    url: 'https://aitoolsdirectory.com/submit',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description,
      category: 'Developer Tools'
    }
  },
  {
    name: 'Stack Lima',
    url: 'https://stacklima.com/submit',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description,
      category: 'Developer Tools'
    }
  },
  {
    name: 'Launchpad',
    url: 'https://launchpad.cc/submit',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description,
      category: 'Developer Tools'
    }
  },
  {
    name: 'CodeMyUI',
    url: 'https://codemyui.com/submit/',
    method: 'POST',
    formData: {
      tool_name: SITE_INFO.name,
      tool_url: SITE_INFO.url,
      tool_description: SITE_INFO.description,
      category: 'Developer Tools'
    }
  },
  {
    name: 'CSS Author',
    url: 'https://cssauthor.com/submit-your-tool/',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description,
      category: 'Developer Tools'
    }
  },
  {
    name: 'ToolDirectory',
    url: 'https://tooldirectory.com',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description,
      category: 'Developer Tools'
    }
  },
  {
    name: 'Online Utility',
    url: 'https://online-utility.org',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description
    }
  },
  {
    name: 'DevTool Directory',
    url: 'https://devtooles.com',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description,
      category: 'Developer Tools'
    }
  },
  {
    name: 'Coding Tools',
    url: 'https://coding.tools',
    method: 'POST',
    formData: {
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      description: SITE_INFO.description
    }
  }
];

function postData(url, data) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const postDataStr = Object.entries(data)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postDataStr),
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    };
    
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body.substring(0, 5000)
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.write(postDataStr);
    req.end();
  });
}

async function submitToDirectory(dir) {
  console.log(`\n🔄 Submitting to ${dir.name}...`);
  
  try {
    const result = await postData(dir.url, dir.formData);
    
    console.log(`   Status: ${result.status}`);
    
    const body = result.body.toLowerCase();
    const successIndicators = ['thank', 'success', 'submitted', 'received', 'added', 'created'];
    const errorIndicators = ['error', 'fail', 'invalid', 'required', 'captcha', 'robot'];
    
    const isSuccess = successIndicators.some(indicator => body.includes(indicator));
    const isError = errorIndicators.some(indicator => body.includes(indicator));
    
    if (result.status >= 200 && result.status < 400 && !isError) {
      console.log(`   ✅ Likely SUCCESS`);
      return { name: dir.name, status: 'SUCCESS', note: 'Form submitted' };
    } else if (isError || result.status >= 400) {
      console.log(`   ❌ Error detected`);
      return { name: dir.name, status: 'FAILED', note: 'Error in response' };
    } else {
      console.log(`   ⚠️  Unknown - needs manual check`);
      return { name: dir.name, status: 'UNKNOWN', note: 'Check manually' };
    }
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { name: dir.name, status: 'ERROR', note: error.message };
  }
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║              AUTO-SUBMITTER V2 - Batch Submission              ║
╚══════════════════════════════════════════════════════════════════════╝
  `);
  
  console.log('Submitting to', DIRECTORIES.length, 'directories...\n');
  
  const results = [];
  
  for (const dir of DIRECTORIES) {
    const result = await submitToDirectory(dir);
    results.push(result);
    
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                        RESULTS                                   ║
╚══════════════════════════════════════════════════════════════════════╝
  `);
  
  const success = results.filter(r => r.status === 'SUCCESS');
  const unknown = results.filter(r => r.status === 'UNKNOWN');
  const failed = results.filter(r => r.status === 'FAILED' || r.status === 'ERROR');
  
  console.log(`\n✅ Success: ${success.length}`);
  success.forEach(r => console.log(`   - ${r.name}`));
  
  console.log(`\n⚠️  Unknown (check manually): ${unknown.length}`);
  unknown.forEach(r => console.log(`   - ${r.name}: ${r.note}`));
  
  console.log(`\n❌ Failed: ${failed.length}`);
  failed.forEach(r => console.log(`   - ${r.name}: ${r.note}`));
  
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                     MANUAL SUBMISSION                             ║
╚══════════════════════════════════════════════════════════════════════╝

These require manual submission (login/CAPTCHA):
- AlternativeTo: https://alternativeto.net/software/u2tool/
- Product Hunt: https://www.producthunt.com/posts/new
- StackShare: https://stackshare.io/submissions/new
- Betalist: https://betalist.com/submit
`);
}

main().catch(console.error);
