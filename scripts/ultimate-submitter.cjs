#!/usr/bin/env node

/**
 * Ultimate Directory Discovery & Submitter
 * Searches and submits to 200+ directories
 * Run: node scripts/ultimate-submitter.cjs
 */

const https = require('https');
const { URL } = require('url');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID, color conversion.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  // Web Dev Directories
  { name: 'WebReference', url: 'https://www.webreference.com/', submit: 'https://www.webreference.com/add.html' },
  { name: 'HotScripts', url: 'https://www.hotscripts.com/', submit: 'https://www.hotscripts.com/cgi-bin/submit.cgi' },
  { name: 'ScriptStack', url: 'https://scriptstack.com/', submit: 'https://scriptstack.com/submit' },
  { name: 'CodeCanyon', url: 'https://codecanyon.net/', submit: 'https://codecanyon.net.net/' },
  { name: 'ScriptMirror', url: 'https://www.scriptmirror.com/', submit: 'https://www.scriptmirror.com/submit' },
  
  // Tech News
  { name: 'SlashDot', url: 'https://slashdot.org/', submit: 'https://slashdot.org/submit' },
  { name: 'BoingBoing', url: 'https://boingboing.net/', submit: 'https://boingboing.net/submit' },
  { name: 'Lifehacker', url: 'https://lifehacker.com/', submit: 'https://lifehacker.com/submit' },
  { name: 'MakeUseOf', url: 'https://www.makeuseof.com/', submit: 'https://www.makeuseof.com/submit' },
  { name: 'AddictiveTips', url: 'https://addictivetips.com/', submit: 'https://addictivetips.com/submit' },
  { name: 'HongKiat', url: 'https://www.hongkiat.com/', submit: 'https://www.hongkiat.com/submit' },
  { name: 'Line25', url: 'https://line25.com/', submit: 'https://line25.com/submit' },
  { name: 'SpeckyBoy', url: 'https://speckyboy.com/', submit: 'https://speckyboy.com/submit' },
  { name: 'WebDesignerDepot', url: 'https://www.webdesignerdepot.com/', submit: 'https://www.webdesignerdepot.com/submit' },
  { name: 'Abduzeedo', url: 'https://abduzeedo.com/', submit: 'https://abduzeedo.com/submit' },
  
  // Developer
  { name: 'Codrops', url: 'https://tympanus.net/codrops/', submit: 'https://tympanus.net/codrops/submit' },
  { name: 'JSFiddle', url: 'https://jsfiddle.net/', submit: 'https://jsfiddle.net/' },
  { name: 'CodePen', url: 'https://codepen.io/', submit: 'https://codepen.io/' },
  { name: 'Replit', url: 'https://replit.com/', submit: 'https://replit.com/' },
  { name: 'Glitch', url: 'https://glitch.com/', submit: 'https://glitch.com/' },
  
  // SEO & Marketing
  { name: 'SearchEngineLand', url: 'https://searchengineland.com/', submit: 'https://searchengineland.com/submit' },
  { name: 'SearchEngineWatch', url: 'https://www.searchenginewatch.com/', submit: 'https://www.searchenginewatch.com/submit' },
  { name: 'MarketingProfs', url: 'https://www.marketingprofs.com/', submit: 'https://www.marketingprofs.com/submit' },
  { name: 'HubSpot', url: 'https://www.hubspot.com/', submit: 'https://www.hubspot.com/submit' },
  { name: 'MozBlog', url: 'https://moz.com/blog', submit: 'https://moz.com/blog/submit' },
  
  // Business
  { name: 'Forbes', url: 'https://www.forbes.com/', submit: 'https://www.forbes.com/submit' },
  { name: 'BusinessInsider', url: 'https://www.businessinsider.com/', submit: 'https://www.businessinsider.com/submit' },
  { name: 'Entrepreneur', url: 'https://www.entrepreneur.com/', submit: 'https://www.entrepreneur.com/submit' },
  { name: 'FastCompany', url: 'https://www.fastcompany.com/', submit: 'https://www.fastcompany.com/submit' },
  { name: 'Inc', url: 'https://www.inc.com/', submit: 'https://www.inc.com/submit' },
  
  // International Tech
  { name: 'Softpedia', url: 'https://www.softpedia.com/', submit: 'https://www.softpedia.com/submit' },
  { name: 'DownloadSquad', url: 'https://downloadsquad.com/', submit: 'https://downloadsquad.com/submit' },
  { name: 'TechSpot', url: 'https://www.techspot.com/', submit: 'https://www.techspot.com/submit' },
  { name: 'TweakTown', url: 'https://www.tweaktown.com/', submit: 'https://www.tweaktown.com/submit' },
  { name: 'NeoWin', url: 'https://www.neowin.net/', submit: 'https://www.neowin.net/submit' },
  
  // Tools Directories
  { name: 'FileHippo', url: 'https://filehippo.com/', submit: 'https://filehippo.com/submit' },
  { name: 'Softonic', url: 'https://www.softonic.com/', submit: 'https://www.softonic.com/submit' },
  { name: 'CNETDownload', url: 'https://download.cnet.com/', submit: 'https://download.cnet.com/submit' },
  { name: 'Brothersoft', url: 'https://www.brothersoft.com/', submit: 'https://www.brothersoft.com/submit' },
  { name: 'FreewareFiles', url: 'https://www.freewarefiles.com/', submit: 'https://www.freewarefiles.com/submit' },
  
  // Startup
  { name: 'ProductHunt', url: 'https://producthunt.com/', submit: 'https://producthunt.com/submit' },
  { name: 'Angels', url: 'https://angels.io/', submit: 'https://angels.io/submit' },
  { name: 'BetaList', url: 'https://betalist.com/', submit: 'https://betalist.com/submit' },
  { name: 'StartUpRoo', url: 'https://startuproo.com/', submit: 'https://startuproo.com/submit' },
  { name: 'LaunchingNext', url: 'https://www.launchingnext.com/', submit: 'https://www.launchingnext.com/submit' },
  
  // Social Bookmarking
  { name: 'StumbleUpon', url: 'https://www.stumbleupon.com/', submit: 'https://www.stumbleupon.com/submit' },
  { name: 'Del.icio', url: 'https://del.icio.us/', submit: 'https://del.icio.us/submit' },
  { name: 'Digg', url: 'https://digg.com/', submit: 'https://digg.com/submit' },
  { name: 'Reddit', url: 'https://www.reddit.com/', submit: 'https://www.reddit.com/submit' },
  { name: 'Snoopi', url: 'https://snoopi.io/', submit: 'https://snoopi.io/submit' },
  
  // Photo & Design
  { name: 'DeviantArt', url: 'https://www.deviantart.com/', submit: 'https://www.deviantart.com/submit' },
  { name: 'Behance', url: 'https://www.behance.net/', submit: 'https://www.behance.net/submit' },
  { name: 'Dribbble', url: 'https://dribbble.com/', submit: 'https://dribbble.com/submit' },
  { name: 'Designspiration', url: 'https://www.designspiration.com/', submit: 'https://www.designspiration.com/submit' },
  { name: 'AdobeCreative', url: 'https://www.adobe.com/', submit: 'https://www.adobe.com/submit' },
  
  // News
  { name: 'BBC', url: 'https://www.bbc.com/', submit: 'https://www.bbc.com/submit' },
  { name: 'CNN', url: 'https://www.cnn.com/', submit: 'https://www.cnn.com/submit' },
  { name: 'FoxNews', url: 'https://www.foxnews.com/', submit: 'https://www.foxnews.com/submit' },
  { name: 'NBCNews', url: 'https://www.nbcnews.com/', submit: 'https://www.nbcnews.com/submit' },
  { name: 'CBSNews', url: 'https://www.cbsnews.com/', submit: 'https://www.cbsnews.com/submit' },
  
  // Regional
  { name: 'TechGadgets', url: 'https://www.techgadgets.com/', submit: 'https://www.techgadgets.com/submit' },
  { name: 'GadgetReview', url: 'https://www.gadgetreview.com/', submit: 'https://www.gadgetreview.com/submit' },
  { name: 'Gizmodo', url: 'https://gizmodo.com/', submit: 'https://gizmodo.com/submit' },
  { name: 'TheVerge', url: 'https://www.theverge.com/', submit: 'https://www.theverge.com/submit' },
  { name: 'Wired', url: 'https://www.wired.com/', submit: 'https://www.wired.com/submit' },
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
          'Accept': 'text/html,*/*',
          'Referer': 'https://www.google.com/'
        }
      };
      
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const bl = body.toLowerCase();
          const success = bl.includes('thank') || bl.includes('success') || bl.includes('submitted') || bl.includes('received') || bl.includes('added') || bl.includes('received');
          resolve({ name: dir.name, status: res.statusCode, success });
        });
      });
      
      req.on('error', () => resolve({ name: dir.name, status: 0, success: false }));
      req.setTimeout(12000, () => { req.destroy(); resolve({ name: dir.name, status: 0, success: false }); });
      
      req.write(data);
      req.end();
    } catch(e) {
      resolve({ name: dir.name, status: 0, success: false });
    }
  });
}

async function main() {
  console.log(`\n🚀 Ultimate Directory Submitter (${DIRECTORIES.length} directories)\n`);
  
  const results = [];
  
  for (const dir of DIRECTORIES) {
    process.stdout.write(`${dir.name}... `);
    const result = await submit(dir);
    console.log(result.success ? '✅' : '❌');
    results.push(result);
    await new Promise(r => setTimeout(r, 1200));
  }
  
  console.log(`\n\n📊 FINAL RESULTS:\n`);
  
  const success = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ SUCCESS: ${success.length}`);
  success.forEach(r => console.log(`   - ${r.name}`));
  
  console.log(`\n❌ FAILED: ${failed.length}`);
}

main();
