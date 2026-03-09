#!/usr/bin/env node

/**
 * More Platforms - News, Finance, Crypto, etc.
 * Run: node scripts/more-platforms.cjs
 */

const https = require('https');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  // Finance
  { name: 'Bloomberg', submit: 'https://www.bloomberg.com/submit' },
  { name: 'WSJ', submit: 'https://www.wsj.com/submit' },
  { name: 'Reuters', submit: 'https://www.reuters.com/submit' },
  { name: 'CNBC', submit: 'https://www.cnbc.com/submit' },
  { name: 'FT', submit: 'https://www.ft.com/submit' },
  { name: 'MarketWatch', submit: 'https://www.marketwatch.com/submit' },
  { name: 'SeekingAlpha', submit: 'https://seekingalpha.com/submit' },
  { name: 'Investopedia', submit: 'https://www.investopedia.com/submit' },
  
  // Crypto
  { name: 'CoinDesk', submit: 'https://www.coindesk.com/submit' },
  { name: 'CoinTelegraph', submit: 'https://cointelegraph.com/submit' },
  { name: 'Bitcoinist', submit: 'https://bitcoinist.com/submit' },
  { name: 'NewsBTC', submit: 'https://www.newsbtc.com/submit' },
  { name: 'CryptoSlate', submit: 'https://cryptoslate.com/submit' },
  { name: 'Decrypt', submit: 'https://decrypt.co/submit' },
  
  // Science
  { name: 'Nature', submit: 'https://www.nature.com/submit' },
  { name: 'ScienceDaily', submit: 'https://www.sciencedaily.com/submit' },
  { name: 'ScientificAmerican', submit: 'https://www.scientificamerican.com/submit' },
  { name: 'NewScientist', submit: 'https://www.newscientist.com/submit' },
  { name: 'PopularScience', submit: 'https://www.popsci.com/submit' },
  
  // Gaming
  { name: 'IGN', submit: 'https://www.ign.com/submit' },
  { name: 'GameSpot', submit: 'https://www.gamespot.com/submit' },
  { name: 'Kotaku', submit: 'https://kotaku.com/submit' },
  { name: 'Polygon', submit: 'https://www.polygon.com/submit' },
  { name: 'Eurogamer', submit: 'https://www.eurogamer.net/submit' },
  
  // Entertainment
  { name: 'Variety', submit: 'https://variety.com/submit' },
  { name: 'HollywoodReporter', submit: 'https://www.hollywoodreporter.com/submit' },
  { name: 'Billboard', submit: 'https://www.billboard.com/submit' },
  { name: 'RollingStone', submit: 'https://www.rollingstone.com/submit' },
  
  // Sports
  { name: 'ESPN', submit: 'https://www.espn.com/submit' },
  { name: 'SkySports', submit: 'https://www.skysports.com/submit' },
  { name: 'BBCSport', submit: 'https://www.bbc.com/sport/submit' },
  
  // Automotive
  { name: 'CarAndDriver', submit: 'https://www.caranddriver.com/submit' },
  { name: 'MotorTrend', submit: 'https://www.motortrend.com/submit' },
  { name: 'TopGear', submit: 'https://www.topgear.com/submit' },
  
  // Travel
  { name: 'TripAdvisor', submit: 'https://www.tripadvisor.com/submit' },
  { name: 'LonelyPlanet', submit: 'https://www.lonelyplanet.com/submit' },
  { name: 'TravelWeekly', submit: 'https://www.travelweekly.com/submit' },
  
  // Food
  { name: 'FoodNetwork', submit: 'https://www.foodnetwork.com/submit' },
  { name: 'AllRecipes', submit: 'https://www.allrecipes.com/submit' },
  { name: 'SeriousEats', submit: 'https://www.seriouseats.com/submit' },
  
  // Health
  { name: 'WebMD', submit: 'https://www.webmd.com/submit' },
  { name: 'HealthLine', submit: 'https://www.healthline.com/submit' },
  { name: 'MedicalNewsToday', submit: 'https://www.medicalnewstoday.com/submit' },
  
  // Education
  { name: 'Coursera', submit: 'https://www.coursera.org/submit' },
  { name: 'Udemy', submit: 'https://www.udemy.com/submit' },
  { name: 'edX', submit: 'https://www.edx.org/submit' },
  { name: 'KhanAcademy', submit: 'https://www.khanacademy.org/submit' },
  { name: 'Skillshare', submit: 'https://www.skillshare.com/submit' },
  
  // Jobs
  { name: 'Indeed', submit: 'https://www.indeed.com/submit' },
  { name: 'LinkedIn', submit: 'https://www.linkedin.com/submit' },
  { name: 'Glassdoor', submit: 'https://www.glassdoor.com/submit' },
  { name: 'Monster', submit: 'https://www.monster.com/submit' },
  
  // Real Estate
  { name: 'Zillow', submit: 'https://www.zillow.com/submit' },
  { name: 'Realtor', submit: 'https://www.realtor.com/submit' },
  { name: 'Trulia', submit: 'https://www.trulia.com/submit' },
  
  // More Tech
  { name: 'Wired', submit: 'https://www.wired.com/submit' },
  { name: 'ArsTechnica', submit: 'https://arstechnica.com/submit' },
  { name: 'TheVerge', submit: 'https://www.theverge.com/submit' },
  { name: 'TechCrunch', submit: 'https://techcrunch.com/submit' },
  { name: 'Engadget', submit: 'https://www.engadget.com/submit' },
  { name: 'Mashable', submit: 'https://mashable.com/submit' },
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
  console.log(`\n🚀 More Platforms - News/Finance/Crypto (${DIRECTORIES.length} directories)\n`);
  
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
