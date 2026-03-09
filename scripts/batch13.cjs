#!/usr/bin/env node

/**
 * Batch 13 - More Platforms
 * Run: node scripts/batch13.cjs
 */

const https = require('https');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  // More Tools
  { name: 'Notion', submit: 'https://www.notion.so/submit' },
  { name: 'Airtable', submit: 'https://airtable.com/submit' },
  { name: 'Trello', submit: 'https://trello.com/submit' },
  { name: 'Asana', submit: 'https://asana.com/submit' },
  { name: 'Monday', submit: 'https://monday.com/submit' },
  { name: 'Slack', submit: 'https://slack.com/submit' },
  { name: 'Zoom', submit: 'https://zoom.us/submit' },
  { name: 'Teams', submit: 'https://www.microsoft.com/en-us/microsoft-teams/submit' },
  
  // More CRM
  { name: 'Salesforce', submit: 'https://www.salesforce.com/submit' },
  { name: 'HubSpot', submit: 'https://www.hubspot.com/submit' },
  { name: 'Zoho', submit: 'https://www.zoho.com/submit' },
  { name: 'Pipedrive', submit: 'https://www.pipedrive.com/submit' },
  
  // More Marketing
  { name: 'Hootsuite', submit: 'https://www.hootsuite.com/submit' },
  { name: 'Buffer', submit: 'https://buffer.com/submit' },
  { name: 'SproutSocial', submit: 'https://sproutsocial.com/submit' },
  { name: 'Mailchimp', submit: 'https://mailchimp.com/submit' },
  { name: 'ConvertKit', submit: 'https://convertkit.com/submit' },
  
  // More Analytics
  { name: 'GoogleAnalytics', submit: 'https://analytics.google.com/submit' },
  { name: 'Mixpanel', submit: 'https://mixpanel.com/submit' },
  { name: 'Amplitude', submit: 'https://amplitude.com/submit' },
  { name: 'Hotjar', submit: 'https://www.hotjar.com/submit' },
  { name: 'CrazyEgg', submit: 'https://www.crazyegg.com/submit' },
  
  // More SEO
  { name: 'Ahrefs', submit: 'https://ahrefs.com/submit' },
  { name: 'SEMrush', submit: 'https://www.semrush.com/submit' },
  { name: 'Moz', submit: 'https://moz.com/submit' },
  { name: 'Majestic', submit: 'https://majestic.com/submit' },
  
  // More Payments
  { name: 'Stripe', submit: 'https://stripe.com/submit' },
  { name: 'PayPal', submit: 'https://www.paypal.com/submit' },
  { name: 'Square', submit: 'https://squareup.com/submit' },
  { name: 'Braintree', submit: 'https://www.braintreepayments.com/submit' },
  
  // More Storage
  { name: 'Dropbox', submit: 'https://www.dropbox.com/submit' },
  { name: 'GoogleDrive', submit: 'https://drive.google.com/submit' },
  { name: 'OneDrive', submit: 'https://onedrive.live.com/submit' },
  { name: 'iCloud', submit: 'https://www.icloud.com/submit' },
  
  // More Communication
  { name: 'Discord', submit: 'https://discord.com/submit' },
  { name: 'Telegram', submit: 'https://telegram.org/submit' },
  { name: 'WhatsApp', submit: 'https://www.whatsapp.com/submit' },
  { name: 'Signal', submit: 'https://signal.org/submit' },
  
  // More News
  { name: 'HackerNews', submit: 'https://news.ycombinator.com/submit' },
  { name: 'Lobsters', submit: 'https://lobste.rs/submit' },
  { name: 'Reddit', submit: 'https://www.reddit.com/submit' },
  { name: 'Digg', submit: 'https://digg.com/submit' },
  
  // More Content
  { name: 'Medium', submit: 'https://medium.com/submit' },
  { name: 'Substack', submit: 'https://substack.com/submit' },
  { name: 'Ghost', submit: 'https://ghost.org/submit' },
  { name: 'Wix', submit: 'https://www.wix.com/submit' },
  
  // More Learning
  { name: 'Coursera', submit: 'https://www.coursera.org/submit' },
  { name: 'Udemy', submit: 'https://www.udemy.com/submit' },
  { name: 'Skillshare', submit: 'https://www.skillshare.com/submit' },
  { name: 'Pluralsight', submit: 'https://www.pluralsight.com/submit' },
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
  console.log(`\n🚀 Batch 13 - Business & Tools (${DIRECTORIES.length} directories)\n`);
  
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
