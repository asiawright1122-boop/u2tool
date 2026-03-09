#!/usr/bin/env node

/**
 * Batch 14 - More Directories
 * Run: node scripts/batch14.cjs
 */

const https = require('https');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  // More Platforms
  { name: 'ProductHunt3', submit: 'https://www.producthunt.com/products/u2tool' },
  { name: 'StackShare3', submit: 'https://stackshare.io/u2tool' },
  { name: 'AlternativeTo3', submit: 'https://alternativeto.net/software/u2tool' },
  { name: 'G23', submit: 'https://www.g2.com/products/u2tool' },
  { name: 'Capterra3', submit: 'https://www.capterra.com/p/235695/U2Tool' },
  { name: 'TrustRadius3', submit: 'https://www.trustradius.com/products/u2tool' },
  
  // More Review Sites
  { name: 'TrustPilot3', submit: 'https://www.trustpilot.com/review/www.u2tool.com' },
  { name: 'SiteJabber3', submit: 'https://www.sitejabber.com/reviews/www.u2tool.com' },
  
  // More Q&A
  { name: 'StackOverflow2', submit: 'https://stackoverflow.com/' },
  { name: 'Quora2', submit: 'https://www.quora.com/' },
  { name: 'Ask2', submit: 'https://www.ask.com/' },
  { name: 'Answers2', submit: 'https://www.answers.com/' },
  
  // More Social
  { name: 'Twitter2', submit: 'https://twitter.com/' },
  { name: 'Facebook2', submit: 'https://www.facebook.com/' },
  { name: 'Instagram2', submit: 'https://www.instagram.com/' },
  { name: 'LinkedIn3', submit: 'https://www.linkedin.com/' },
  
  // More Forums
  { name: 'Reddit3', submit: 'https://www.reddit.com/' },
  { name: 'Disqus2', submit: 'https://disqus.com/' },
  
  // More News
  { name: 'BBC2', submit: 'https://www.bbc.com/' },
  { name: 'CNN2', submit: 'https://www.cnn.com/' },
  { name: 'NBC2', submit: 'https://www.nbcnews.com/' },
  { name: 'ABC2', submit: 'https://abcnews.go.com/' },
  
  // More Finance
  { name: 'Bloomberg2', submit: 'https://www.bloomberg.com/' },
  { name: 'WSJ2', submit: 'https://www.wsj.com/' },
  { name: 'FT2', submit: 'https://www.ft.com/' },
  { name: 'MarketWatch2', submit: 'https://www.marketwatch.com/' },
  
  // More Crypto
  { name: 'CoinDesk2', submit: 'https://www.coindesk.com/' },
  { name: 'CoinTelegraph2', submit: 'https://cointelegraph.com/' },
  
  // More Gaming
  { name: 'IGN2', submit: 'https://www.ign.com/' },
  { name: 'GameSpot2', submit: 'https://www.gamespot.com/' },
  { name: 'Kotaku2', submit: 'https://kotaku.com/' },
  
  // More Entertainment
  { name: 'Variety2', submit: 'https://variety.com/' },
  { name: 'HollywoodReporter2', submit: 'https://www.hollywoodreporter.com/' },
  { name: 'Billboard2', submit: 'https://www.billboard.com/' },
  
  // More Shopping
  { name: 'Amazon2', submit: 'https://www.amazon.com/' },
  { name: 'eBay2', submit: 'https://www.ebay.com/' },
  
  // More Jobs
  { name: 'Indeed2', submit: 'https://www.indeed.com/' },
  { name: 'LinkedIn4', submit: 'https://www.linkedin.com/' },
  { name: 'Glassdoor2', submit: 'https://www.glassdoor.com/' },
  
  // More Education
  { name: 'Coursera2', submit: 'https://www.coursera.org/' },
  { name: 'Udemy2', submit: 'https://www.udemy.com/' },
  { name: 'edX2', submit: 'https://www.edx.org/' },
  
  // More Tools
  { name: 'JSONFormatter', submit: 'https://jsonformatter.curiousconcept.com/' },
  { name: 'Base64Encode', submit: 'https://www.base64encode.org/' },
  { name: 'URLEncoder', submit: 'https://www.urlencoder.org/' },
  { name: 'QRCodeGenerator', submit: 'https://www.qrcode-generator.com/' },
  
  // More Developer
  { name: 'GitHub', submit: 'https://github.com/' },
  { name: 'GitLab2', submit: 'https://gitlab.com/' },
  { name: 'Bitbucket2', submit: 'https://bitbucket.org/' },
  { name: 'NPM2', submit: 'https://www.npmjs.com/' },
  
  // More SEO
  { name: 'GoogleSearchConsole', submit: 'https://search.google.com/search-console/' },
  { name: 'BingWebmaster', submit: 'https://www.bing.com/webmasters/' },
  { name: 'YandexWebmaster', submit: 'https://webmaster.yandex.com/' },
];

function submit(dir) {
  return new Promise((resolve) => {
    try {
      const data = `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`;
      
      const options = {
        hostname: new URL(dir.submit).hostname,
        port: 443,
        path: new URL(dir.submit).pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,*/*'
        }
      };
      
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const bl = body.toLowerCase();
          const success = bl.includes('thank') || bl.includes('success') || bl.includes('submitted') || bl.includes('received') || bl.includes('added');
          resolve({ name: dir.name, success });
        });
      });
      
      req.on('error', () => resolve({ name: dir.name, success: false }));
      req.setTimeout(10000, () => { req.destroy(); resolve({ name: dir.name, success: false }); });
      
      req.write(data);
      req.end();
    } catch(e) {
      resolve({ name: dir.name, success: false });
    }
  });
}

async function main() {
  console.log(`\n🚀 Batch 14 - More Platforms (${DIRECTORIES.length} directories)\n`);
  
  let successCount = 0;
  
  for (const dir of DIRECTORIES) {
    process.stdout.write(`${dir.name}... `);
    const result = await submit(dir);
    console.log(result.success ? '✅' : '❌');
    if (result.success) successCount++;
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log(`\n✅ Total Success: ${successCount}/${DIRECTORIES.length}`);
}

main();
