#!/usr/bin/env node

/**
 * Batch 12 - More Directories
 * Run: node scripts/batch12.cjs
 */

const https = require('https');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  // Tech Sites
  { name: 'TechRadar', submit: 'https://www.techradar.com/submit' },
  { name: 'TomGuide', submit: 'https://www.tomsguide.com/submit' },
  { name: 'PCMag', submit: 'https://www.pcmag.com/submit' },
  { name: 'PCWorld', submit: 'https://www.pcworld.com/submit' },
  { name: 'Wired', submit: 'https://www.wired.com/submit' },
  { name: 'TheVerge', submit: 'https://www.theverge.com/submit' },
  { name: 'Engadget', submit: 'https://www.engadget.com/submit' },
  { name: 'Gizmodo', submit: 'https://gizmodo.com/submit' },
  { name: 'LifeHacker', submit: 'https://lifehacker.com/submit' },
  { name: 'Mashable', submit: 'https://mashable.com/submit' },
  
  // More Developer
  { name: 'JavaScript', submit: 'https://javascript.info/submit' },
  { name: 'StackBlitz', submit: 'https://stackblitz.com/submit' },
  { name: 'CodeSandbox', submit: 'https://codesandbox.io/submit' },
  { name: 'JSFiddle', submit: 'https://jsfiddle.net/submit' },
  { name: 'CodePen', submit: 'https://codepen.io/submit' },
  
  // More Tools
  { name: 'TinyPNG', submit: 'https://tinypng.com/submit' },
  { name: 'ImageOptim', submit: 'https://imageoptim.com/submit' },
  { name: 'Compressor', submit: 'https://compressor.io/submit' },
  { name: 'Squoosh', submit: 'https://squoosh.app/submit' },
  { name: 'RemoveBG', submit: 'https://remove.bg/submit' },
  
  // More API
  { name: 'Postman', submit: 'https://www.postman.com/submit' },
  { name: 'Insomnia', submit: 'https://insomnia.rest/submit' },
  { name: 'Hoppscotch', submit: 'https://hoppscotch.io/submit' },
  { name: 'Swagger', submit: 'https://swagger.io/submit' },
  
  // More Design
  { name: 'Figma', submit: 'https://www.figma.com/submit' },
  { name: 'Sketch', submit: 'https://www.sketch.com/submit' },
  { name: 'InVision', submit: 'https://www.invisionapp.com/submit' },
  { name: 'Zeplin', submit: 'https://zeplin.io/submit' },
  { name: 'Marvel', submit: 'https://marvelapp.com/submit' },
  
  // More Font
  { name: 'Dafont', submit: 'https://www.dafont.com/submit' },
  { name: 'FontSpace', submit: 'https://www.fontspace.com/submit' },
  { name: '1001Fonts', submit: 'https://www.1001fonts.com/submit' },
  { name: 'GoogleWebFonts', submit: 'https://fonts.google.com/submit' },
  
  // More Icon
  { name: 'Ionicons', submit: 'https://ionic.io/ionicons/submit' },
  { name: 'MaterialIcons', submit: 'https://fonts.google.com/icons/submit' },
  { name: 'HeroIcons', submit: 'https://heroicons.com/submit' },
  { name: 'Phosphor', submit: 'https://phosphoricons.com/submit' },
  
  // More Stock
  { name: 'Unsplash', submit: 'https://unsplash.com/submit' },
  { name: 'Pexels', submit: 'https://www.pexels.com/submit' },
  { name: 'Pixabay', submit: 'https://pixabay.com/submit' },
  { name: 'Freepik', submit: 'https://www.freepik.com/submit' },
  { name: 'Flaticon', submit: 'https://www.flaticon.com/submit' },
  
  // More Color
  { name: 'Coolors', submit: 'https://coolors.co/submit' },
  { name: 'ColorHunt', submit: 'https://colorhunt.co/submit' },
  { name: 'AdobeColor', submit: 'https://color.adobe.com/submit' },
  { name: 'Colordot', submit: 'https://color.hayeum.com/submit' },
  
  // More Hosting
  { name: 'Vercel', submit: 'https://vercel.com/submit' },
  { name: 'Netlify', submit: 'https://www.netlify.com/submit' },
  { name: 'Render', submit: 'https://render.com/submit' },
  { name: 'Railway', submit: 'https://railway.app/submit' },
  { name: 'Fly', submit: 'https://fly.io/submit' },
  
  // More Database
  { name: 'MongoDB', submit: 'https://www.mongodb.com/submit' },
  { name: 'PostgreSQL', submit: 'https://www.postgresql.org/submit' },
  { name: 'Redis', submit: 'https://redis.io/submit' },
  { name: 'MySQL', submit: 'https://www.mysql.com/submit' },
  
  // More DevOps
  { name: 'Docker', submit: 'https://www.docker.com/submit' },
  { name: 'Kubernetes', submit: 'https://kubernetes.io/submit' },
  { name: 'Terraform', submit: 'https://www.terraform.io/submit' },
  { name: 'Jenkins', submit: 'https://www.jenkins.io/submit' },
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
  console.log(`\n🚀 Batch 12 - Tech & Dev (${DIRECTORIES.length} directories)\n`);
  
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
