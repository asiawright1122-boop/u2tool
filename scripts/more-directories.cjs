#!/usr/bin/env node

/**
 * More Directories - Part 2
 * Run: node scripts/more-directories.cjs
 */

const https = require('https');
const { URL } = require('url');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  // More Tools
  { name: 'OnlineTools247', submit: 'https://onlinetools247.com/submit' },
  { name: 'ToolsBucket', submit: 'https://toolsbucket.com/submit' },
  { name: 'ToolBoxHub', submit: 'https://toolboxhub.com/submit' },
  { name: 'WebTools365', submit: 'https://webtools365.com/submit' },
  { name: 'ToolsList', submit: 'https://toolslist.org/submit' },
  { name: 'TinyTool', submit: 'https://tinytool.app/submit' },
  { name: 'WebTooler', submit: 'https://webtooler.com/submit' },
  { name: 'ToolMania', submit: 'https://toolmania.info/submit' },
  
  // Tech Blogs
  { name: 'ReadWrite', submit: 'https://readwrite.com/submit' },
  { name: 'VentureCanvas', submit: 'https://venturecanvas.com/submit' },
  { name: 'ReadHub', submit: 'https://readhub.me/submit' },
  { name: 'Techinasia', submit: 'https://www.techinasia.com/submit' },
  { name: 'NextShark', submit: 'https://nextshark.com/submit' },
  { name: 'Asian Junkie', submit: 'https://asianjunkie.com/submit' },
  
  // More Directories
  { name: 'DirDB', submit: 'https://dir-db.com/submit' },
  { name: 'SubmitCube', submit: 'https://submitcube.com/submit' },
  { name: 'SiteJabber', submit: 'https://www.sitejabber.com/submit' },
  { name: 'TrustPilot', submit: 'https://www.trustpilot.com/submit' },
  { name: 'ResellerRatings', submit: 'https://www.resellerratings.com/submit' },
  { name: 'OpinionBureau', submit: 'https://www.opinionbureau.com/submit' },
  
  // Content
  { name: 'Medium', submit: 'https://medium.com/submit' },
  { name: 'Substack', submit: 'https://substack.com/submit' },
  { name: 'Wix', submit: 'https://www.wix.com/submit' },
  { name: 'WordPress', submit: 'https://wordpress.org/submit' },
  { name: 'Blogger', submit: 'https://www.blogger.com/submit' },
  
  // Video
  { name: 'YouTube', submit: 'https://www.youtube.com/submit' },
  { name: 'Vimeo', submit: 'https://vimeo.com/submit' },
  { name: 'Dailymotion', submit: 'https://www.dailymotion.com/submit' },
  { name: 'Twitch', submit: 'https://www.twitch.tv/submit' },
  
  // Podcast
  { name: 'Spotify', submit: 'https://podcasters.spotify.com/submit' },
  { name: 'ApplePodcasts', submit: 'https://podcasts.apple.com/submit' },
  { name: 'GooglePodcasts', submit: 'https://podcasts.google.com/submit' },
  { name: 'Stitcher', submit: 'https://www.stitcher.com/submit' },
  
  // CDN & Hosting
  { name: 'Cloudflare', submit: 'https://www.cloudflare.com/submit' },
  { name: 'AWS', submit: 'https://aws.amazon.com/submit' },
  { name: 'GoogleCloud', submit: 'https://cloud.google.com/submit' },
  { name: 'Azure', submit: 'https://azure.microsoft.com/submit' },
  
  // Domain
  { name: 'Namecheap', submit: 'https://www.namecheap.com/submit' },
  { name: 'GoDaddy', submit: 'https://www.godaddy.com/submit' },
  { name: 'Domaincom', submit: 'https://www.domain.com/submit' },
  { name: 'Name', submit: 'https://www.name.com/submit' },
  
  // Email
  { name: 'Mailchimp', submit: 'https://mailchimp.com/submit' },
  { name: 'SendGrid', submit: 'https://sendgrid.com/submit' },
  { name: 'Mailgun', submit: 'https://www.mailgun.com/submit' },
  { name: 'Postmark', submit: 'https://postmarkapp.com/submit' },
  
  // Analytics
  { name: 'GoogleAnalytics', submit: 'https://analytics.google.com/submit' },
  { name: 'Mixpanel', submit: 'https://mixpanel.com/submit' },
  { name: 'Amplitude', submit: 'https://amplitude.com/submit' },
  { name: 'Hotjar', submit: 'https://www.hotjar.com/submit' },
  
  // Marketing
  { name: 'Hootsuite', submit: 'https://www.hootsuite.com/submit' },
  { name: 'Buffer', submit: 'https://buffer.com/submit' },
  { name: 'SproutSocial', submit: 'https://sproutsocial.com/submit' },
  { name: 'SEMrush', submit: 'https://www.semrush.com/submit' },
  
  // Design
  { name: 'Figma', submit: 'https://www.figma.com/submit' },
  { name: 'Sketch', submit: 'https://www.sketch.com/submit' },
  { name: 'InVision', submit: 'https://www.invisionapp.com/submit' },
  { name: 'Adobe', submit: 'https://www.adobe.com/submit' },
  
  // Font
  { name: 'GoogleFonts', submit: 'https://fonts.google.com/submit' },
  { name: 'AdobeFonts', submit: 'https://fonts.adobe.com/submit' },
  { name: 'FontSpace', submit: 'https://www.fontspace.com/submit' },
  { name: 'DaFont', submit: 'https://www.dafont.com/submit' },
  
  // Icon
  { name: 'FontAwesome', submit: 'https://fontawesome.com/submit' },
  { name: 'Flaticon', submit: 'https://www.flaticon.com/submit' },
  { name: 'Icons8', submit: 'https://icons8.com/submit' },
  { name: 'Iconfinder', submit: 'https://www.iconfinder.com/submit' },
  
  // Stock
  { name: 'Unsplash', submit: 'https://unsplash.com/submit' },
  { name: 'Pexels', submit: 'https://www.pexels.com/submit' },
  { name: 'Pixabay', submit: 'https://pixabay.com/submit' },
  { name: 'Shutterstock', submit: 'https://www.shutterstock.com/submit' },
  
  // Color
  { name: 'Coolors', submit: 'https://coolors.co/submit' },
  { name: 'ColorHunt', submit: 'https://colorhunt.co/submit' },
  { name: 'AdobeColor', submit: 'https://color.adobe.com/submit' },
  { name: 'Colr', submit: 'http://colr.org/submit' },
  
  // API
  { name: 'RapidAPI', submit: 'https://rapidapi.com/submit' },
  { name: 'ProgrammableWeb', submit: 'https://www.programmableweb.com/submit' },
  { name: 'APIsio', submit: 'https://apis.io/submit' },
  { name: 'PublicAPIs', submit: 'https://publicapis.dev/submit' },
  
  // Package
  { name: 'NPM', submit: 'https://www.npmjs.com/submit' },
  { name: 'PyPI', submit: 'https://pypi.org/submit' },
  { name: 'Packagist', submit: 'https://packagist.org/submit' },
  { name: 'Maven', submit: 'https://mvnrepository.com/submit' },
];

function submit(dir) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(dir.submit);
      const data = `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`;
      
      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname,
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
  console.log(`\n🚀 More Directories - Part 2 (${DIRECTORIES.length} directories)\n`);
  
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
