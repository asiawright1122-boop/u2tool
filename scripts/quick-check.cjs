#!/usr/bin/env node

/**
 * Quick Directory Discovery - Fast check for submission opportunities
 */

const https = require('https');

const SITE = 'https://www.u2tool.com';

const DIRECTORIES = [
  { name: 'Juejin', url: 'https://juejin.cn/posts' },
  { name: 'SegmentFault', url: 'https://segmentfault.com/' },
  { name: 'OSChina', url: 'https://www.oschina.net/' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com/' },
  { name: 'Reddit WebDev', url: 'https://www.reddit.com/r/webdev/' },
  { name: 'Reddit Programming', url: 'https://www.reddit.com/r/programming/' },
  { name: 'Dev.to', url: 'https://dev.to/' },
  { name: 'Hashnode', url: 'https://hashnode.com/' },
  { name: 'Medium', url: 'https://medium.com/' },
  { name: 'Quora', url: 'https://www.quora.com/' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/' },
  { name: 'Lobsters', url: 'https://lobste.rs/' },
  { name: 'Digg', url: 'https://digg.com/' },
  { name: 'Pinterest', url: 'https://www.pinterest.com/' },
  { name: 'Hatena', url: 'https://b.hatena.ne.jp/' },
];

function check(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ status: res.statusCode, redirect: res.headers.location });
    }).on('error', () => resolve({ status: 'error' }));
  });
}

async function main() {
  console.log('\n🔍 Quick Directory Check\n');
  
  for (const dir of DIRECTORIES) {
    const result = await check(dir.url);
    const status = result.status === 200 ? '✅' : result.status === 301 || result.status === 302 ? '🔄' : '❌';
    console.log(`${status} ${dir.name} (${result.status})`);
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('\n📝 Quick Actions:\n');
  console.log('1. Juejin (掘金): https://juejin.cn/posts - 发帖分享工具');
  console.log('2. SegmentFault: https://segmentfault.com/ - 回答问题');
  console.log('3. OSChina: https://www.oschina.net/ - 开源中国');
  console.log('4. Reddit: https://reddit.com/r/webdev - 发布');
  console.log('5. Dev.to: https://dev.to - 写技术文章');
}

main();
