#!/usr/bin/env node

/**
 * Batch 18 - Final Directories
 * Run: node scripts/batch18.cjs
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
  { name: 'Wired2', submit: 'https://www.wired.com/submit' },
  { name: 'TheVerge2', submit: 'https://www.theverge.com/submit' },
  { name: 'Engadget2', submit: 'https://www.engadget.com/submit' },
  { name: 'Gizmodo2', submit: 'https://gizmodo.com/submit' },
  { name: 'LifeHacker2', submit: 'https://lifehacker.com/submit' },
  { name: 'Mashable2', submit: 'https://mashable.com/submit' },
  { name: 'ArsTechnica2', submit: 'https://arstechnica.com/submit' },
  { name: 'TheNextWeb3', submit: 'https://thenextweb.com/submit' },
  
  // More Developer
  { name: 'DevTo2', submit: 'https://dev.to/submit' },
  { name: 'Hashnode2', submit: 'https://hashnode.com/submit' },
  { name: 'CodeNewbie2', submit: 'https://community.codenewbie.org/submit' },
  { name: 'DEVCommunity2', submit: 'https://dev.to/submit' },
  
  // More Social
  { name: 'Twitter3', submit: 'https://twitter.com/' },
  { name: 'Facebook3', submit: 'https://www.facebook.com/' },
  { name: 'Instagram3', submit: 'https://www.instagram.com/' },
  { name: 'LinkedIn5', submit: 'https://www.linkedin.com/' },
  
  // More Reviews
  { name: 'TrustPilot5', submit: 'https://www.trustpilot.com/submit' },
  { name: 'SiteJabber5', submit: 'https://www.sitejabber.com/submit' },
  
  // More Jobs
  { name: 'Indeed3', submit: 'https://www.indeed.com/' },
  { name: 'Glassdoor3', submit: 'https://www.glassdoor.com/' },
  { name: 'Monster3', submit: 'https://www.monster.com/' },
  
  // More Finance
  { name: 'Bloomberg3', submit: 'https://www.bloomberg.com/' },
  { name: 'WSJ3', submit: 'https://www.wsj.com/' },
  { name: 'CNBC2', submit: 'https://www.cnbc.com/' },
  
  // More Crypto
  { name: 'CoinDesk3', submit: 'https://www.coindesk.com/' },
  { name: 'CoinTelegraph3', submit: 'https://cointelegraph.com/' },
  
  // More Gaming
  { name: 'IGN3', submit: 'https://www.ign.com/' },
  { name: 'GameSpot3', submit: 'https://www.gamespot.com/' },
  { name: 'Kotaku3', submit: 'https://kotaku.com/' },
  
  // More Shopping
  { name: 'Amazon3', submit: 'https://www.amazon.com/' },
  { name: 'eBay3', submit: 'https://www.ebay.com/' },
  
  // More Food
  { name: 'Yelp2', submit: 'https://www.yelp.com/' },
  { name: 'Zomato2', submit: 'https://www.zomato.com/' },
  
  // More Travel
  { name: 'TripAdvisor3', submit: 'https://www.tripadvisor.com/' },
  { name: 'Booking', submit: 'https://www.booking.com/submit' },
  
  // More Dating
  { name: 'Match2', submit: 'https://www.match.com/' },
  { name: 'Tinder2', submit: 'https://tinder.com/' },
  
  // More Music
  { name: 'Spotify3', submit: 'https://open.spotify.com/' },
  { name: 'AppleMusic2', submit: 'https://music.apple.com/' },
  
  // More Podcast
  { name: 'ApplePodcasts2', submit: 'https://podcasts.apple.com/' },
  { name: 'GooglePodcasts2', submit: 'https://podcasts.google.com/' },
  
  // More Video
  { name: 'YouTube4', submit: 'https://www.youtube.com/' },
  { name: 'Vimeo2', submit: 'https://vimeo.com/' },
  { name: 'Twitch2', submit: 'https://www.twitch.tv/submit' },
  
  // More News
  { name: 'BBC3', submit: 'https://www.bbc.com/' },
  { name: 'CNN3', submit: 'https://www.cnn.com/' },
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
  console.log(`\n🚀 Batch 18 - Final (${DIRECTORIES.length} directories)\n`);
  
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
