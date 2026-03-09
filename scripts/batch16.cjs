#!/usr/bin/env node

/**
 * Batch 16 - Even More Directories
 * Run: node scripts/batch16.cjs
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
  { name: 'VentureBeat2', submit: 'https://venturebeat.com/submit' },
  { name: 'TheNextWeb2', submit: 'https://thenextweb.com/submit' },
  { name: 'CNET2', submit: 'https://www.cnet.com/submit' },
  { name: 'ZDNet2', submit: 'https://www.zdnet.com/submit' },
  { name: 'eWeek2', submit: 'https://www.eweek.com/submit' },
  { name: 'ITWorld2', submit: 'https://www.itworld.com/submit' },
  { name: 'TechRadar2', submit: 'https://www.techradar.com/submit' },
  { name: 'TomGuide2', submit: 'https://www.tomsguide.com/submit' },
  { name: 'PCMag2', submit: 'https://www.pcmag.com/submit' },
  { name: 'PCWorld2', submit: 'https://www.pcworld.com/submit' },
  
  // More Developer
  { name: 'CodeProject2', submit: 'https://www.codeproject.com/submit' },
  { name: 'JavaScript2', submit: 'https://javascript.info/submit' },
  { name: 'StackBlitz2', submit: 'https://stackblitz.com/submit' },
  { name: 'CodeSandbox2', submit: 'https://codesandbox.io/submit' },
  { name: 'JSFiddle2', submit: 'https://jsfiddle.net/submit' },
  { name: 'CodePen2', submit: 'https://codepen.io/submit' },
  { name: 'Replit2', submit: 'https://replit.com/submit' },
  { name: 'Glitch2', submit: 'https://glitch.com/submit' },
  
  // More Tools
  { name: 'TinyPNG2', submit: 'https://tinypng.com/submit' },
  { name: 'ImageOptim2', submit: 'https://imageoptim.com/submit' },
  { name: 'Compressor2', submit: 'https://compressor.io/submit' },
  { name: 'Squoosh2', submit: 'https://squoosh.app/submit' },
  { name: 'RemoveBG2', submit: 'https://remove.bg/submit' },
  
  // More API
  { name: 'Postman2', submit: 'https://www.postman.com/submit' },
  { name: 'Insomnia2', submit: 'https://insomnia.rest/submit' },
  { name: 'Hoppscotch2', submit: 'https://hoppscotch.io/submit' },
  { name: 'Swagger2', submit: 'https://swagger.io/submit' },
  
  // More Design
  { name: 'Figma2', submit: 'https://www.figma.com/submit' },
  { name: 'Sketch2', submit: 'https://www.sketch.com/submit' },
  { name: 'InVision2', submit: 'https://www.invisionapp.com/submit' },
  { name: 'Zeplin2', submit: 'https://zeplin.io/submit' },
  { name: 'Marvel2', submit: 'https://marvelapp.com/submit' },
  
  // More Hosting
  { name: 'Vercel2', submit: 'https://vercel.com/submit' },
  { name: 'Netlify2', submit: 'https://www.netlify.com/submit' },
  { name: 'Render2', submit: 'https://render.com/submit' },
  { name: 'Railway2', submit: 'https://railway.app/submit' },
  { name: 'Fly2', submit: 'https://fly.io/submit' },
  { name: 'Heroku', submit: 'https://www.heroku.com/submit' },
  
  // More Database
  { name: 'MongoDB2', submit: 'https://www.mongodb.com/submit' },
  { name: 'PostgreSQL2', submit: 'https://www.postgresql.org/submit' },
  { name: 'Redis2', submit: 'https://redis.io/submit' },
  { name: 'MySQL2', submit: 'https://www.mysql.com/submit' },
  
  // More DevOps
  { name: 'Docker2', submit: 'https://www.docker.com/submit' },
  { name: 'Kubernetes2', submit: 'https://kubernetes.io/submit' },
  { name: 'Terraform2', submit: 'https://www.terraform.io/submit' },
  { name: 'Jenkins2', submit: 'https://www.jenkins.io/submit' },
  
  // More Communication
  { name: 'Discord2', submit: 'https://discord.com/submit' },
  { name: 'Telegram2', submit: 'https://telegram.org/submit' },
  { name: 'WhatsApp2', submit: 'https://www.whatsapp.com/submit' },
  { name: 'Signal2', submit: 'https://signal.org/submit' },
  
  // More Learning
  { name: 'KhanAcademy2', submit: 'https://www.khanacademy.org/submit' },
  { name: 'Skillshare2', submit: 'https://www.skillshare.com/submit' },
  { name: 'Pluralsight2', submit: 'https://www.pluralsight.com/submit' },
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
  console.log(`\n🚀 Batch 16 - Tech & Dev v2 (${DIRECTORIES.length} directories)\n`);
  
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
