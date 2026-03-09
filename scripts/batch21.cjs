const https = require('https');

const DIRECTORIES = [
  { name: 'Bing', submit: 'https://www.bing.com/index.php?mkt=en-US&setlang=en' },
  { name: 'Google Search', submit: 'https://search.google.com/search-console' },
  { name: 'Yandex', submit: 'https://webmaster.yandex.com/add-site' },
  { name: 'DuckDuckGo', submit: 'https://duckduckgo.com/add' },
  { name: 'Baidu', submit: 'https://www.baidu.com/search/sitemap' },
  { name: 'Sogou', submit: 'https://www.sogou.com/web' },
  { name: '360', submit: 'https://www.so.com/siteadd' },
  { name: 'Naver', submit: 'https://search.naver.com/search.naver' },
  { name: 'Yahoo', submit: 'https://search.yahoo.com' },
  { name: 'Ask', submit: 'https://www.ask.com' },
  { name: 'AOL', submit: 'https://www.aol.com' },
  { name: 'Startpage', submit: 'https://www.startpage.com' },
  { name: 'Ecosia', submit: 'https://www.ecosia.org' },
  { name: 'Qwant', submit: 'https://www.qwant.com' },
  { name: 'Brave', submit: 'https://search.brave.com' },
  { name: 'Kagi', submit: 'https://kagi.com' },
  { name: 'You', submit: 'https://you.com' },
  { name: 'Neeva', submit: 'https://neeva.com' },
  { name: 'Mojeek', submit: 'https://www.mojeek.com' },
  { name: 'Swisscows', submit: 'https://swisscows.com' },
  { name: 'Yacy', submit: 'https://yacy.net' },
  { name: 'SearX', submit: 'https://searx.org' },
  { name: 'WhoIs', submit: 'https://www.whois.com/whois/u2tool.com' },
  { name: 'DNSlytics', submit: 'https://dnslytics.com' },
  { name: 'ViewDNS', submit: 'https://viewdns.info' },
  { name: 'Site24x7', submit: 'https://www.site24x7.com' },
  { name: 'UptimeRobot', submit: 'https://uptimerobot.com' },
  { name: 'Pingdom', submit: 'https://www.pingdom.com' },
  { name: 'GTmetrix', submit: 'https://gtmetrix.com' },
  { name: 'PageSpeed', submit: 'https://pagespeed.web.dev' },
  { name: 'WebPageTest', submit: 'https://www.webpagetest.org' },
  { name: 'Chrome DevTools', submit: 'https://developer.chrome.com' },
  { name: 'Mozilla DevTools', submit: 'https://developer.mozilla.org' },
  { name: 'Can I Use', submit: 'https://caniuse.com' },
  { name: 'StackBlitz', submit: 'https://stackblitz.com' },
  { name: 'CodeSandbox', submit: 'https://codesandbox.io' },
  { name: 'Replit', submit: 'https://replit.com' },
  { name: 'CodePen', submit: 'https://codepen.io' },
  { name: 'JSFiddle', submit: 'https://jsfiddle.net' },
  { name: 'JSBin', submit: 'https://jsbin.com' },
  { name: 'Plunker', submit: 'https://plnkr.co' },
  { name: 'GitLab', submit: 'https://gitlab.com' },
  { name: 'Bitbucket', submit: 'https://bitbucket.org' },
  { name: 'SourceForge', submit: 'https://sourceforge.net' },
  { name: 'NPM', submit: 'https://www.npmjs.com' },
  { name: 'PyPI', submit: 'https://pypi.org' },
  { name: 'RubyGems', submit: 'https://rubygems.org' },
  { name: 'Packagist', submit: 'https://packagist.org' },
  { name: 'Cargo', submit: 'https://crates.io' },
  { name: 'Maven', submit: 'https://maven.apache.org' },
  { name: 'NuGet', submit: 'https://www.nuget.org' },
];

function submit(dir) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      name: 'U2Tool',
      url: 'https://u2tool.com',
      description: 'Free online developer tools - 200+ utilities for JSON, XML, text, encoding, decoding, hashing, color conversion and more'
    });

    const url = new URL(dir.submit);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const success = ['thank', 'success', 'submitted', 'received', 'added', 'created', 'thank you', 'published', 'verified', 'crawled', 'indexed'].some(k => body.toLowerCase().includes(k));
        resolve(success ? '✅' : '❌');
      });
    });

    req.on('error', () => resolve('❌'));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log(`🚀 Batch 21 - Search Engines & Dev Resources (${DIRECTORIES.length} directories)\n`);
  
  let successCount = 0;
  
  for (const dir of DIRECTORIES) {
    process.stdout.write(`${dir.name}... `);
    const result = await submit(dir);
    console.log(result);
    if (result === '✅') successCount++;
    await new Promise(r => setTimeout(r, 800));
  }

  console.log(`\n✅ Total Success: ${successCount}/${DIRECTORIES.length}`);
}

main();
