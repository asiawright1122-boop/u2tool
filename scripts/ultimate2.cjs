#!/usr/bin/env node

/**
 * Ultimate Directories - More Categories
 * Run: node scripts/ultimate2.cjs
 */

const https = require('https');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  // Niche Directories
  { name: 'DirJournal', submit: 'https://www.dirjournal.com/submit' },
  { name: 'Best of the Web', submit: 'https://www.bestofthweb.com/submit' },
  { name: 'Jayde', submit: 'https://www.jayde.com/submit' },
  { name: 'Bizzomate', submit: 'https://www.bizzomate.com/submit' },
  { name: 'Aviva', submit: 'https://www.aviva.com/submit' },
  { name: 'WebWorld', submit: 'https://www.webworld.com/submit' },
  
  // More Tools Directories
  { name: 'Tools4SEO', submit: 'https://tools4seo.com/submit' },
  { name: 'SEO Tools', submit: 'https://www.seo-tools.com/submit' },
  { name: 'OnlineTools', submit: 'https://www.online-tools.com/submit' },
  { name: 'WebToolKit', submit: 'https://www.webtoolkit.com/submit' },
  { name: 'DevToolZone', submit: 'https://www.devtoolzone.com/submit' },
  
  // More Startup
  { name: 'StartupGrind', submit: 'https://www.startupgrind.com/submit' },
  { name: 'YCombinator', submit: 'https://www.ycombinator.com/submit' },
  { name: 'TechStars', submit: 'https://www.techstars.com/submit' },
  { name: 'FounderWorld', submit: 'https://www.founderworld.com/submit' },
  { name: 'VentureDash', submit: 'https://www.venturedash.com/submit' },
  
  // More Developer
  { name: 'DevTo', submit: 'https://dev.to/submit' },
  { name: 'Hashnode', submit: 'https://hashnode.com/submit' },
  { name: 'CodeNewbie', submit: 'https://community.codenewbie.org/submit' },
  { name: 'DEVCommunity', submit: 'https://dev.to/submit' },
  
  // More Social
  { name: 'Mastodon', submit: 'https://mastodon.social/submit' },
  { name: 'MeWe', submit: 'https://mewe.com/submit' },
  { name: 'Parler', submit: 'https://parler.com/submit' },
  { name: 'Gab', submit: 'https://gab.com/submit' },
  
  // More Video
  { name: 'Bitchute', submit: 'https://www.bitchute.com/submit' },
  { name: 'Rumble', submit: 'https://rumble.com/submit' },
  { name: 'Odysee', submit: 'https://odysee.com/submit' },
  
  // More Blog Platforms
  { name: 'Ghost', submit: 'https://ghost.org/submit' },
  { name: 'Medium', submit: 'https://medium.com/submit' },
  { name: 'Substack', submit: 'https://substack.com/submit' },
  { name: 'Wix', submit: 'https://www.wix.com/submit' },
  { name: 'Squarespace', submit: 'https://www.squarespace.com/submit' },
  { name: 'Weebly', submit: 'https://www.weebly.com/submit' },
  { name: 'WordPress', submit: 'https://wordpress.org/submit' },
  { name: 'Blogger', submit: 'https://www.blogger.com/submit' },
  { name: 'Tumblr', submit: 'https://www.tumblr.com/submit' },
  { name: 'LiveJournal', submit: 'https://www.livejournal.com/submit' },
  
  // More CMS
  { name: 'Drupal', submit: 'https://www.drupal.org/submit' },
  { name: 'Joomla', submit: 'https://www.joomla.org/submit' },
  { name: 'Magento', submit: 'https://magento.com/submit' },
  { name: 'Shopify', submit: 'https://www.shopify.com/submit' },
  { name: 'PrestaShop', submit: 'https://www.prestashop.com/submit' },
  
  // More Hosting
  { name: 'Hostinger', submit: 'https://www.hostinger.com/submit' },
  { name: 'Bluehost', submit: 'https://www.bluehost.com/submit' },
  { name: 'SiteGround', submit: 'https://www.siteground.com/submit' },
  { name: 'HostGator', submit: 'https://www.hostgator.com/submit' },
  { name: 'DreamHost', submit: 'https://www.dreamhost.com/submit' },
  { name: 'A2Hosting', submit: 'https://www.a2hosting.com/submit' },
  { name: 'InMotion', submit: 'https://www.inmotionhosting.com/submit' },
  { name: 'WPEngine', submit: 'https://wpengine.com/submit' },
  { name: 'Kinsta', submit: 'https://kinsta.com/submit' },
  
  // More CDN
  { name: 'Cloudflare', submit: 'https://www.cloudflare.com/submit' },
  { name: 'Fastly', submit: 'https://www.fastly.com/submit' },
  { name: 'KeyCDN', submit: 'https://www.keycdn.com/submit' },
  { name: 'BunnyCDN', submit: 'https://bunny.net/submit' },
  
  // More Email
  { name: 'Mailchimp', submit: 'https://mailchimp.com/submit' },
  { name: 'SendGrid', submit: 'https://sendgrid.com/submit' },
  { name: 'Mailgun', submit: 'https://www.mailgun.com/submit' },
  { name: 'Postmark', submit: 'https://postmarkapp.com/submit' },
  { name: 'SendInBlue', submit: 'https://www.sendinblue.com/submit' },
  { name: 'ConvertKit', submit: 'https://convertkit.com/submit' },
  { name: 'AWeber', submit: 'https://www.aweber.com/submit' },
  { name: 'GetResponse', submit: 'https://www.getresponse.com/submit' },
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
  console.log(`\n🚀 Ultimate Directories v2 (${DIRECTORIES.length} directories)\n`);
  
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
