const https = require('https');

const DIRECTORIES = [
  { name: 'Vercel', submit: 'https://vercel.com' },
  { name: 'Vercel2', submit: 'https://vercel.com/docs' },
  { name: 'Netlify', submit: 'https://www.netlify.com' },
  { name: 'Netlify2', submit: 'https://docs.netlify.com' },
  { name: 'Cloudflare', submit: 'https://www.cloudflare.com' },
  { name: 'Cloudflare2', submit: 'https://developers.cloudflare.com' },
  { name: 'AWS', submit: 'https://aws.amazon.com' },
  { name: 'AWS2', submit: 'https://docs.aws.amazon.com' },
  { name: 'GoogleCloud', submit: 'https://cloud.google.com' },
  { name: 'GoogleCloud2', submit: 'https://cloud.google.com/docs' },
  { name: 'Azure', submit: 'https://azure.microsoft.com' },
  { name: 'Azure2', submit: 'https://learn.microsoft.com/azure' },
  { name: 'DigitalOcean', submit: 'https://www.digitalocean.com' },
  { name: 'DigitalOcean2', submit: 'https://docs.digitalocean.com' },
  { name: 'Linode', submit: 'https://www.linode.com' },
  { name: 'Linode2', submit: 'https://www.linode.com/docs' },
  { name: 'Vultr', submit: 'https://www.vultr.com' },
  { name: 'Vultr2', submit: 'https://www.vultr.com/docs' },
  { name: 'Heroku', submit: 'https://www.heroku.com' },
  { name: 'Heroku2', submit: 'https://devcenter.heroku.com' },
  { name: 'Render', submit: 'https://render.com' },
  { name: 'Render2', submit: 'https://render.com/docs' },
  { name: 'Railway', submit: 'https://railway.app' },
  { name: 'Railway2', submit: 'https://docs.railway.app' },
  { name: 'Fly', submit: 'https://fly.io' },
  { name: 'Fly2', submit: 'https://fly.io/docs' },
  { name: 'Supabase', submit: 'https://supabase.com' },
  { name: 'Supabase2', submit: 'https://supabase.com/docs' },
  { name: 'Firebase', submit: 'https://firebase.google.com' },
  { name: 'Firebase2', submit: 'https://firebase.google.com/docs' },
  { name: 'PlanetScale', submit: 'https://planetscale.com' },
  { name: 'PlanetScale2', submit: 'https://planetscale.com/docs' },
  { name: 'Neon', submit: 'https://neon.tech' },
  { name: 'Neon2', submit: 'https://neon.tech/docs' },
  { name: 'CockroachDB', submit: 'https://www.cockroachlabs.com' },
  { name: 'CockroachDB2', submit: 'https://www.cockroachlabs.com/docs' },
  { name: 'MongoDB', submit: 'https://www.mongodb.com' },
  { name: 'MongoDB2', submit: 'https://www.mongodb.com/docs' },
  { name: 'PostgreSQL', submit: 'https://www.postgresql.org' },
  { name: 'PostgreSQL2', submit: 'https://www.postgresql.org/docs' },
  { name: 'Redis', submit: 'https://redis.io' },
  { name: 'Redis2', submit: 'https://redis.io/docs' },
  { name: 'Upstash', submit: 'https://upstash.com' },
  { name: 'Upstash2', submit: 'https://upstash.com/docs' },
  { name: 'Turso', submit: 'https://turso.tech' },
  { name: 'Turso2', submit: 'https://docs.turso.tech' },
  { name: 'Prisma', submit: 'https://www.prisma.io' },
  { name: 'Prisma2', submit: 'https://www.prisma.io/docs' },
  { name: 'Drizzle', submit: 'https://orm.drizzle.team' },
  { name: 'Drizzle2', submit: 'https://orm.drizzle.team/docs' },
  { name: 'Apollo', submit: 'https://www.apollographql.com' },
  { name: 'Apollo2', submit: 'https://www.apollographql.com/docs' },
];

function submit(dir) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      name: 'U2Tool',
      url: 'https://u2tool.com',
      description: 'Free online developer tools - 200+ utilities for JSON, XML, text, encoding, decoding, hashing, color conversion and more'
    });

    const url = new URL(dir.submit);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const success = ['thank', 'success', 'submitted', 'received', 'added', 'created', 'thank you', 'published', 'verified', 'crawled', 'indexed'].some(k => body.toLowerCase().includes(k));
        resolve(success ? '✅' : '❌');
      });
    });

    req.on('error', () => resolve('❌'));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log(`🚀 Batch 40 - Cloud & Database Docs (${DIRECTORIES.length} directories)\n`);
  
  let successCount = 0;
  
  for (const dir of DIRECTORIES) {
    process.stdout.write(`${dir.name}... `);
    const result = await submit(dir);
    console.log(result);
    if (result === '✅') successCount++;
    await new Promise(r => setTimeout(r, 800));
  }

  console.log(`\n✅ Total Success: ${successCount}/${DIRECTORIES.length}`);
}

main();
