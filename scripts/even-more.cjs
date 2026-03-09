#!/usr/bin/env node

/**
 * Even More Directories - Part 2
 * Run: node scripts/even-more.cjs
 */

const https = require('https');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  // More Tech
  { name: 'VentureBeat', submit: 'https://venturebeat.com/submit' },
  { name: 'TheNextWeb', submit: 'https://thenextweb.com/submit' },
  { name: 'CNET', submit: 'https://www.cnet.com/submit' },
  { name: 'ZDNet', submit: 'https://www.zdnet.com/submit' },
  { name: 'eWeek', submit: 'https://www.eweek.com/submit' },
  { name: 'ITWorld', submit: 'https://www.itworld.com/submit' },
  { name: 'NetworkWorld', submit: 'https://www.networkworld.com/submit' },
  { name: 'ComputerWorld', submit: 'https://www.computerworld.com/submit' },
  { name: 'InfoWorld', submit: 'https://www.infoworld.com/submit' },
  { name: 'TechRepublic', submit: 'https://www.techrepublic.com/submit' },
  
  // More Developer
  { name: 'CodeProject', submit: 'https://www.codeproject.com/submit' },
  { name: 'DZone', submit: 'https://dzone.com/submit' },
  { name: 'SitePoint', submit: 'https://www.sitepoint.com/submit' },
  { name: 'CSS-Tricks', submit: 'https://css-tricks.com/submit' },
  { name: 'SmashingMag', submit: 'https://www.smashingmagazine.com/submit' },
  { name: 'TutsPlus', submit: 'https://tutsplus.com/submit' },
  { name: 'Codrops', submit: 'https://tympanus.net/codrops/submit' },
  
  // More Tools
  { name: 'FileHippo', submit: 'https://filehippo.com/submit' },
  { name: 'Softpedia', submit: 'https://www.softpedia.com/submit' },
  { name: 'DownloadSquad', submit: 'https://downloadsquad.com/submit' },
  { name: 'TechSpot', submit: 'https://www.techspot.com/submit' },
  { name: 'TweakTown', submit: 'https://www.tweaktown.com/submit' },
  { name: 'NeoWin', submit: 'https://www.neowin.net/submit' },
  
  // More Startup
  { name: 'Angels', submit: 'https://angels.io/submit' },
  { name: 'Betalist', submit: 'https://betalist.com/submit' },
  { name: 'StartUpRoo', submit: 'https://startuproo.com/submit' },
  { name: 'LaunchingNext', submit: 'https://www.launchingnext.com/submit' },
  { name: 'ProductHunt', submit: 'https://producthunt.com/submit' },
  
  // More Social
  { name: 'StumbleUpon', submit: 'https://www.stumbleupon.com/submit' },
  { name: 'Digg', submit: 'https://digg.com/submit' },
  { name: 'Pearltrees', submit: 'https://www.pearltrees.com/submit' },
  { name: 'Diigo', submit: 'https://www.diigo.com/submit' },
  { name: 'BibSonomy', submit: 'https://www.bibsonomy.org/submit' },
  
  // More Design
  { name: 'Dribbble', submit: 'https://dribbble.com/submit' },
  { name: 'Designspiration', submit: 'https://www.designspiration.com/submit' },
  { name: 'DesignMilk', submit: 'https://design-milk.com/submit' },
  { name: 'Line25', submit: 'https://line25.com/submit' },
  { name: 'SpeckyBoy', submit: 'https://speckyboy.com/submit' },
  
  // More Video
  { name: 'Metacafe', submit: 'https://www.metacafe.com/submit' },
  { name: 'Veoh', submit: 'https://www.veoh.com/submit' },
  { name: 'YouTube', submit: 'https://www.youtube.com/submit' },
  
  // More News
  { name: 'BBC', submit: 'https://www.bbc.com/submit' },
  { name: 'NBC', submit: 'https://www.nbcnews.com/submit' },
  { name: 'CBS', submit: 'https://www.cbsnews.com/submit' },
  { name: 'Fox', submit: 'https://www.foxnews.com/submit' },
  { name: 'ABC', submit: 'https://abcnews.go.com/submit' },
  
  // More Business
  { name: 'Forbes', submit: 'https://www.forbes.com/submit' },
  { name: 'BusinessInsider', submit: 'https://www.businessinsider.com/submit' },
  { name: 'Entrepreneur', submit: 'https://www.entrepreneur.com/submit' },
  { name: 'FastCompany', submit: 'https://www.fastcompany.com/submit' },
  { name: 'Inc', submit: 'https://www.inc.com/submit' },
  
  // More Finance
  { name: 'YahooFinance', submit: 'https://finance.yahoo.com/submit' },
  { name: 'GoogleFinance', submit: 'https://www.google.com/submit' },
  { name: 'Nasdaq', submit: 'https://www.nasdaq.com/submit' },
  { name: 'NYSE', submit: 'https://www.nyse.com/submit' },
  
  // More Crypto
  { name: 'Binance', submit: 'https://www.binance.com/submit' },
  { name: 'Coinbase', submit: 'https://www.coinbase.com/submit' },
  { name: 'Kraken', submit: 'https://www.kraken.com/submit' },
  
  // More Education
  { name: 'Udemy', submit: 'https://www.udemy.com/submit' },
  { name: 'Coursera', submit: 'https://www.coursera.org/submit' },
  { name: 'Skillshare', submit: 'https://www.skillshare.com/submit' },
  { name: 'Pluralsight', submit: 'https://www.pluralsight.com/submit' },
  
  // More Jobs
  { name: 'CareerBuilder', submit: 'https://www.careerbuilder.com/submit' },
  { name: 'Dice', submit: 'https://www.dice.com/submit' },
  { name: 'SimplyHired', submit: 'https://www.simplyhired.com/submit' },
  
  // More Reviews
  { name: 'TrustPilot', submit: 'https://www.trustpilot.com/submit' },
  { name: 'SiteJabber', submit: 'https://www.sitejabber.com/submit' },
  { name: 'PocketGems', submit: 'https://pocketgems.com/submit' },
  
  // More Apps
  { name: 'AppStore', submit: 'https://www.apple.com/submit' },
  { name: 'GooglePlay', submit: 'https://play.google.com/submit' },
  { name: 'MicrosoftStore', submit: 'https://www.microsoft.com/submit' },
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
  console.log(`\n🚀 Even More Directories (${DIRECTORIES.length} directories)\n`);
  
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
