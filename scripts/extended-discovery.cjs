#!/usr/bin/env node

/**
 * Extended Directory Discovery - Finds more submission opportunities
 * 
 * Run: node scripts/extended-discovery.cjs
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const SITE_URL = 'https://www.u2tool.com';

const EXTENDED_DIRECTORIES = [
  // Developer Tool Directories
  { name: 'DevHunt', url: 'https://devhunt.org/', check: 'submit' },
  { name: 'DEV Community', url: 'https://dev.to/', check: 'submit' },
  { name: 'Hashnode', url: 'https://hashnode.com/', check: 'submit' },
  { name: 'CodeMentor', url: 'https://www.codementor.io/', check: 'submit' },
  { name: 'Toptal', url: 'https://www.toptal.com/', check: 'submit' },
  { name: 'Upwork', url: 'https://www.upwork.com/', check: 'submit' },
  { name: 'Freelancer', url: 'https://www.freelancer.com/', check: 'submit' },
  
  // Tool Directories
  { name: 'LittleBigTools', url: 'https://littlebigtools.com/', check: 'submit' },
  { name: 'Online Tools Directory', url: 'https://onlinetools.io/', check: 'submit' },
  { name: 'Free Online Tools', url: 'https://freeonlinetools.com/', check: 'submit' },
  { name: 'ToolsHero', url: 'https://toolshero.com/', check: 'submit' },
  { name: 'Web-Based Tools', url: 'https://web-based-tools.com/', check: 'submit' },
  { name: 'ToolBox', url: 'https://toolbox.tools/', check: 'submit' },
  { name: 'WebToolHub', url: 'https://webtoolhub.com/', check: 'submit' },
  { name: 'FreeToolHub', url: 'https://freetoolhub.com/', check: 'submit' },
  { name: 'OnlineUtility', url: 'https://online-utility.org/', check: 'submit' },
  
  // Bookmarking / Social
  { name: 'Pinterest', url: 'https://www.pinterest.com/', check: 'submit' },
  { name: 'Digg', url: 'https://digg.com/', check: 'submit' },
  { name: 'StumbleUpon', url: 'https://www.stumbleupon.com/', check: 'submit' },
  { name: 'Del.icio.us', url: 'https://del.icio.us/', check: 'submit' },
  { name: 'Pearltrees', url: 'https://www.pearltrees.com/', check: 'submit' },
  
  // Business Directories
  { name: 'Yell', url: 'https://www.yell.com/', check: 'submit' },
  { name: 'Thomson Local', url: 'https://www.thomsonlocal.com/', check: 'submit' },
  { name: 'Local.com', url: 'https://www.local.com/', check: 'submit' },
  
  // General Directories
  { name: 'DMOZ Alternative', url: 'https://www.ebird.co/', check: 'submit' },
  { name: 'StartRank', url: 'https://www.startrank.org/', check: 'submit' },
  { name: 'SiteSubmission', url: 'https://www.sitesubmission.com/', check: 'submit' },
  
  // Tech News
  { name: 'TechCrunch', url: 'https://techcrunch.com/', check: 'submit' },
  { name: 'The Verge', url: 'https://www.theverge.com/', check: 'submit' },
  { name: 'Wired', url: 'https://www.wired.com/', check: 'submit' },
  { name: 'Ars Technica', url: 'https://arstechnica.com/', check: 'submit' },
  
  // Developer News
  { name: 'Hacker News', url: 'https://news.ycombinator.com/', check: 'submit' },
  { name: 'Lobsters', url: 'https://lobste.rs/', check: 'submit' },
  { name: 'Reddit Dev', url: 'https://www.reddit.com/r/programming/', check: 'submit' },
  
  // Chinese Directories (high potential)
  { name: 'Juejin', url: 'https://juejin.cn/', check: 'submit' },
  { name: 'SegmentFault', url: 'https://segmentfault.com/', check: 'submit' },
  { name: 'OSChina', url: 'https://www.oschina.net/', check: 'submit' },
  { name: 'ChinaUnix', url: 'https://www.chinaunix.net/', check: 'submit' },
  { name: 'ITEye', url: 'https://www.iteye.com/', check: 'submit' },
  
  // Japanese Directories
  { name: 'Hatena Bookmark', url: 'https://b.hatena.ne.jp/', check: 'submit' },
  { name: 'Livedoor', url: 'https://livedoor.com/', check: 'submit' },
];

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,*/*',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    };
    
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ 
          status: res.statusCode, 
          redirect: res.headers.location,
          body: body.substring(0, 8000) 
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

async function checkSite(dir) {
  try {
    const result = await httpGet(dir.url);
    
    if (result.status === 301 || result.status === 302) {
      return { name: dir.name, url: dir.url, status: 'REDIRECT', redirect: result.redirect };
    }
    
    const body = result.body.toLowerCase();
    const hasSubmit = body.includes('submit') || body.includes('add tool') || body.includes('add your') || body.includes('register');
    const hasLogin = body.includes('login') || body.includes('sign in');
    
    return { 
      name: dir.name, 
      url: dir.url, 
      status: result.status === 200 ? (hasSubmit ? 'HAS_FORM' : 'ACCESSIBLE') : 'ERROR',
      login: hasLogin
    };
  } catch (e) {
    return { name: dir.name, url: dir.url, status: 'ERROR', error: e.message };
  }
}

async function main() {
  console.log(`\n🔍 Extended Directory Discovery\n`);
  
  const results = [];
  
  for (const dir of EXTENDED_DIRECTORIES) {
    process.stdout.write(`.`);
    const result = await checkSite(dir);
    results.push(result);
    await new Promise(r => setTimeout(r, 800));
  }
  
  console.log(`\n\n📊 Results:\n`);
  
  const hasForm = results.filter(r => r.status === 'HAS_FORM');
  const accessible = results.filter(r => r.status === 'ACCESSIBLE');
  const redirect = results.filter(r => r.status === 'REDIRECT');
  const errors = results.filter(r => r.status === 'ERROR');
  
  console.log(`📝 Has Submit Form (${hasForm.length}):`);
  hasForm.forEach(r => console.log(`   - ${r.name}: ${r.url}`));
  
  console.log(`\n✅ Accessible - Create Content (${accessible.length}):`);
  accessible.slice(0, 10).forEach(r => console.log(`   - ${r.name}: ${r.url}`));
  
  console.log(`\n🔄 Redirects (${redirect.length}):`);
  redirect.forEach(r => console.log(`   - ${r.name}: ${r.redirect}`));
  
  console.log(`\n❌ Errors (${errors.length}):`);
  errors.forEach(r => console.log(`   - ${r.name}: ${r.error || r.status}`));
  
  console.log(`\n\n🎯 Top Submission Opportunities:\n`);
  hasForm.forEach((r, i) => {
    console.log(`${i + 1}. ${r.name}`);
    console.log(`   ${r.url}\n`);
  });
}

main().catch(console.error);
