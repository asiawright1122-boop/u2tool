#!/usr/bin/env node

/**
 * Final Push - Even More Directories
 * Run: node scripts/final-push2.cjs
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
  { name: 'ProductHunt2', submit: 'https://www.producthunt.com/products/u2tool' },
  { name: 'StackShare2', submit: 'https://stackshare.io/u2tool' },
  { name: 'AlternativeTo2', submit: 'https://alternativeto.net/software/u2tool/' },
  { name: 'G22', submit: 'https://www.g2.com/products/u2tool' },
  { name: 'Capterra2', submit: 'https://www.capterra.com/p/235695/U2Tool' },
  { name: 'TrustRadius2', submit: 'https://www.trustradius.com/products/u2tool' },
  { name: 'GetApp2', submit: 'https://www.getapp.com/u2tool' },
  { name: 'SoftwareAdvice2', submit: 'https://www.softwareadvice.com/u2tool' },
  
  // More Reviews
  { name: 'TrustPilot2', submit: 'https://www.trustpilot.com/review/www.u2tool.com' },
  { name: 'SiteJabber2', submit: 'https://www.sitejabber.com/reviews/www.u2tool.com' },
  { name: 'ResellerRatings2', submit: 'https://www.resellerratings.com/store/www.u2tool.com' },
  
  // More Q&A
  { name: 'StackOverflow', submit: 'https://stackoverflow.com/' },
  { name: 'Quora', submit: 'https://www.quora.com/' },
  { name: 'Ask', submit: 'https://www.ask.com/' },
  { name: 'Answers', submit: 'https://www.answers.com/' },
  
  // More Social
  { name: 'Twitter', submit: 'https://twitter.com/' },
  { name: 'Facebook', submit: 'https://www.facebook.com/' },
  { name: 'Instagram', submit: 'https://www.instagram.com/' },
  { name: 'TikTok', submit: 'https://www.tiktok.com/' },
  { name: 'Snapchat', submit: 'https://www.snapchat.com/' },
  { name: 'Pinterest', submit: 'https://www.pinterest.com/' },
  { name: 'YouTube2', submit: 'https://www.youtube.com/' },
  { name: 'LinkedIn2', submit: 'https://www.linkedin.com/' },
  
  // More Forums
  { name: 'Reddit2', submit: 'https://www.reddit.com/' },
  { name: 'Disqus', submit: 'https://disqus.com/' },
  { name: 'Proboards', submit: 'https://www.proboards.com/' },
  { name: 'Forumotion', submit: 'https://www.forumotion.com/' },
  
  // More Blog
  { name: 'Blogger2', submit: 'https://www.blogger.com/' },
  { name: 'WordPress2', submit: 'https://wordpress.org/' },
  { name: 'Tumblr2', submit: 'https://www.tumblr.com/' },
  { name: 'LiveJournal2', submit: 'https://www.livejournal.com/' },
  { name: 'Bloglovin', submit: 'https://www.bloglovin.com/' },
  { name: 'Feedly2', submit: 'https://feedly.com/' },
  
  // More News
  { name: 'GoogleNews', submit: 'https://news.google.com/' },
  { name: 'AppleNews', submit: 'https://news.apple.com/' },
  { name: 'Flipboard2', submit: 'https://flipboard.com/' },
  { name: 'Pulse', submit: 'https://pulse.me/' },
  
  // More Shopping
  { name: 'Amazon', submit: 'https://www.amazon.com/' },
  { name: 'eBay', submit: 'https://www.ebay.com/' },
  { name: 'Etsy', submit: 'https://www.etsy.com/' },
  { name: 'AliExpress', submit: 'https://www.aliexpress.com/' },
  
  // More Dating
  { name: 'Match', submit: 'https://www.match.com/' },
  { name: 'Tinder', submit: 'https://tinder.com/' },
  
  // More Food
  { name: 'Yelp', submit: 'https://www.yelp.com/' },
  { name: 'Zomato', submit: 'https://www.zomato.com/' },
  { name: 'TripAdvisor2', submit: 'https://www.tripadvisor.com/' },
  { name: 'OpenTable', submit: 'https://www.opentable.com/' },
  
  // More Finance
  { name: 'PayPal', submit: 'https://www.paypal.com/' },
  { name: 'Venmo', submit: 'https://venmo.com/' },
  { name: 'CashApp', submit: 'https://cash.app/' },
  { name: 'Robinhood', submit: 'https://robinhood.com/' },
  
  // More Crypto
  { name: 'Coinbase2', submit: 'https://www.coinbase.com/' },
  { name: 'Binance2', submit: 'https://www.binance.com/' },
  { name: 'Kraken2', submit: 'https://www.kraken.com/' },
  { name: 'CryptoCom', submit: 'https://www.crypto.com/' },
  
  // More Games
  { name: 'Steam', submit: 'https://store.steampowered.com/' },
  { name: 'Epic', submit: 'https://www.epicgames.com/' },
  { name: 'GOG', submit: 'https://www.gog.com/' },
  { name: 'ItchIO', submit: 'https://itch.io/' },
  
  // More Music
  { name: 'Spotify2', submit: 'https://open.spotify.com/' },
  { name: 'AppleMusic', submit: 'https://music.apple.com/' },
  { name: 'SoundCloud', submit: 'https://soundcloud.com/' },
  { name: 'Bandcamp', submit: 'https://bandcamp.com/' },
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
  console.log(`\n🚀 Final Push v2 (${DIRECTORIES.length} directories)\n`);
  
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
