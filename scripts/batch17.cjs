#!/usr/bin/env node

/**
 * Batch 17 - More Platforms
 * Run: node scripts/batch17.cjs
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
  { name: 'ProductHunt4', submit: 'https://www.producthunt.com/products/u2tool' },
  { name: 'StackShare4', submit: 'https://stackshare.io/u2tool' },
  { name: 'AlternativeTo4', submit: 'https://alternativeto.net/software/u2tool' },
  { name: 'G24', submit: 'https://www.g2.com/products/u2tool' },
  { name: 'Capterra4', submit: 'https://www.capterra.com/p/235695/U2Tool' },
  
  // More Tools Directories
  { name: 'ToolScout2', submit: 'https://toolscout.io/submit' },
  { name: 'SaaSDiscovery2', submit: 'https://saasdiscovery.co/submit' },
  { name: 'SaaSHub2', submit: 'https://saashub.com/submit' },
  { name: 'FutureTools2', submit: 'https://futuretools.io/submit' },
  { name: 'OnlineToolsIO', submit: 'https://onlinetools.io/submit' },
  
  // More Business
  { name: 'Salesforce2', submit: 'https://www.salesforce.com/submit' },
  { name: 'HubSpot2', submit: 'https://www.hubspot.com/submit' },
  { name: 'Zoho2', submit: 'https://www.zoho.com/submit' },
  { name: 'Pipedrive2', submit: 'https://www.pipedrive.com/submit' },
  { name: 'Freshworks', submit: 'https://www.freshworks.com/submit' },
  
  // More Marketing
  { name: 'Hootsuite2', submit: 'https://www.hootsuite.com/submit' },
  { name: 'Buffer2', submit: 'https://buffer.com/submit' },
  { name: 'SproutSocial2', submit: 'https://sproutsocial.com/submit' },
  { name: 'Mailchimp2', submit: 'https://mailchimp.com/submit' },
  { name: 'ConvertKit2', submit: 'https://convertkit.com/submit' },
  
  // More Analytics
  { name: 'Mixpanel2', submit: 'https://mixpanel.com/submit' },
  { name: 'Amplitude2', submit: 'https://amplitude.com/submit' },
  { name: 'Hotjar2', submit: 'https://www.hotjar.com/submit' },
  { name: 'CrazyEgg2', submit: 'https://www.crazyegg.com/submit' },
  { name: 'FullStory', submit: 'https://www.fullstory.com/submit' },
  
  // More SEO
  { name: 'Ahrefs2', submit: 'https://ahrefs.com/submit' },
  { name: 'SEMrush2', submit: 'https://www.semrush.com/submit' },
  { name: 'Moz2', submit: 'https://moz.com/submit' },
  { name: 'Majestic2', submit: 'https://majestic.com/submit' },
  { name: 'SpyFu', submit: 'https://www.spyfu.com/submit' },
  
  // More Payments
  { name: 'Stripe2', submit: 'https://stripe.com/submit' },
  { name: 'PayPal2', submit: 'https://www.paypal.com/submit' },
  { name: 'Square2', submit: 'https://squareup.com/submit' },
  { name: 'Braintree2', submit: 'https://www.braintreepayments.com/submit' },
  { name: 'Adyen', submit: 'https://www.adyen.com/submit' },
  
  // More Storage
  { name: 'Dropbox2', submit: 'https://www.dropbox.com/submit' },
  { name: 'GoogleDrive2', submit: 'https://drive.google.com/submit' },
  { name: 'OneDrive2', submit: 'https://onedrive.live.com/submit' },
  { name: 'iCloud2', submit: 'https://www.icloud.com/submit' },
  { name: 'Box', submit: 'https://www.box.com/submit' },
  
  // More Communication
  { name: 'Slack2', submit: 'https://slack.com/submit' },
  { name: 'Zoom2', submit: 'https://zoom.us/submit' },
  { name: 'Teams2', submit: 'https://www.microsoft.com/en-us/microsoft-teams/submit' },
  { name: 'Discord3', submit: 'https://discord.com/submit' },
  { name: 'Telegram3', submit: 'https://telegram.org/submit' },
  
  // More News
  { name: 'HackerNews2', submit: 'https://news.ycombinator.com/submit' },
  { name: 'Lobsters2', submit: 'https://lobste.rs/submit' },
  { name: 'Reddit4', submit: 'https://www.reddit.com/submit' },
  { name: 'Digg3', submit: 'https://digg.com/submit' },
  { name: 'Flipboard3', submit: 'https://flipboard.com/submit' },
  
  // More Content
  { name: 'Medium2', submit: 'https://medium.com/submit' },
  { name: 'Substack2', submit: 'https://substack.com/submit' },
  { name: 'Ghost2', submit: 'https://ghost.org/submit' },
  { name: 'Wix2', submit: 'https://www.wix.com/submit' },
  { name: 'Squarespace2', submit: 'https://www.squarespace.com/submit' },
  
  // More Learning
  { name: 'Coursera3', submit: 'https://www.coursera.org/submit' },
  { name: 'Udemy3', submit: 'https://www.udemy.com/submit' },
  { name: 'Skillshare3', submit: 'https://www.skillshare.com/submit' },
  { name: 'Pluralsight2', submit: 'https://www.pluralsight.com/submit' },
  { name: 'Treehouse', submit: 'https://teamtreehouse.com/submit' },
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
  console.log(`\n🚀 Batch 17 - More Platforms (${DIRECTORIES.length} directories)\n`);
  
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
