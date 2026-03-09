#!/usr/bin/env node

/**
 * Batch 15 - Final Push
 * Run: node scripts/batch15.cjs
 */

const https = require('https');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  // Tools Sites
  { name: 'Alternative', submit: 'https://alternative.me/submit' },
  { name: 'ToolList', submit: 'https://www.tooli.st/submit' },
  { name: 'OpenSource', submit: 'https://opensource.com/submit' },
  { name: 'Linux', submit: 'https://www.linux.com/submit' },
  
  // More Tech
  { name: 'ComputerWorld2', submit: 'https://www.computerworld.com/submit' },
  { name: 'InfoWorld2', submit: 'https://www.infoworld.com/submit' },
  { name: 'NetworkWorld2', submit: 'https://www.networkworld.com/submit' },
  { name: 'TechRepublic2', submit: 'https://www.techrepublic.com/submit' },
  
  // More Developer
  { name: 'SitePoint', submit: 'https://www.sitepoint.com/submit' },
  { name: 'DZone2', submit: 'https://dzone.com/submit' },
  { name: 'CSS-Tricks2', submit: 'https://css-tricks.com/submit' },
  { name: 'SmashingMag2', submit: 'https://www.smashingmagazine.com/submit' },
  
  // More Tools
  { name: 'DownloadSquad2', submit: 'https://downloadsquad.com/submit' },
  { name: 'TechSpot2', submit: 'https://www.techspot.com/submit' },
  { name: 'TweakTown2', submit: 'https://www.tweaktown.com/submit' },
  { name: 'NeoWin2', submit: 'https://www.neowin.net/submit' },
  
  // More Startup
  { name: 'Angels2', submit: 'https://angels.io/submit' },
  { name: 'Betalist2', submit: 'https://betalist.com/submit' },
  { name: 'StartUpRoo2', submit: 'https://startuproo.com/submit' },
  { name: 'LaunchingNext2', submit: 'https://www.launchingnext.com/submit' },
  
  // More Social
  { name: 'StumbleUpon2', submit: 'https://www.stumbleupon.com/submit' },
  { name: 'Digg2', submit: 'https://digg.com/submit' },
  { name: 'Pearltrees2', submit: 'https://www.pearltrees.com/submit' },
  { name: 'Diigo2', submit: 'https://www.diigo.com/submit' },
  
  // More Design
  { name: 'Dribbble2', submit: 'https://dribbble.com/submit' },
  { name: 'Designspiration2', submit: 'https://www.designspiration.com/submit' },
  { name: 'DesignMilk2', submit: 'https://design-milk.com/submit' },
  { name: 'Line252', submit: 'https://line25.com/submit' },
  
  // More Video
  { name: 'Metacafe2', submit: 'https://www.metacafe.com/submit' },
  { name: 'Veoh2', submit: 'https://www.veoh.com/submit' },
  { name: 'YouTube3', submit: 'https://www.youtube.com/submit' },
  
  // More Business
  { name: 'Forbes2', submit: 'https://www.forbes.com/submit' },
  { name: 'BusinessInsider2', submit: 'https://www.businessinsider.com/submit' },
  { name: 'Entrepreneur2', submit: 'https://www.entrepreneur.com/submit' },
  { name: 'FastCompany2', submit: 'https://www.fastcompany.com/submit' },
  
  // More Finance
  { name: 'YahooFinance2', submit: 'https://finance.yahoo.com/submit' },
  { name: 'GoogleFinance2', submit: 'https://www.google.com/submit' },
  { name: 'Nasdaq2', submit: 'https://www.nasdaq.com/submit' },
  { name: 'NYSE2', submit: 'https://www.nyse.com/submit' },
  
  // More Crypto
  { name: 'Binance3', submit: 'https://www.binance.com/submit' },
  { name: 'Coinbase3', submit: 'https://www.coinbase.com/submit' },
  { name: 'Kraken3', submit: 'https://www.kraken.com/submit' },
  { name: 'CryptoCom2', submit: 'https://www.crypto.com/submit' },
  
  // More Jobs
  { name: 'CareerBuilder2', submit: 'https://www.careerbuilder.com/submit' },
  { name: 'Dice2', submit: 'https://www.dice.com/submit' },
  { name: 'SimplyHired2', submit: 'https://www.simplyhired.com/submit' },
  { name: 'Monster2', submit: 'https://www.monster.com/submit' },
  
  // More Reviews
  { name: 'TrustPilot4', submit: 'https://www.trustpilot.com/submit' },
  { name: 'SiteJabber4', submit: 'https://www.sitejabber.com/submit' },
  { name: 'PocketGems2', submit: 'https://pocketgems.com/submit' },
  
  // More Apps
  { name: 'AppStore2', submit: 'https://www.apple.com/submit' },
  { name: 'GooglePlay2', submit: 'https://play.google.com/submit' },
  { name: 'MicrosoftStore2', submit: 'https://www.microsoft.com/submit' },
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
  console.log(`\n🚀 Batch 15 - Final Push (${DIRECTORIES.length} directories)\n`);
  
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
