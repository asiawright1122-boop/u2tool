const https = require('https');

const DIRECTORIES = [
  { name: 'Heroku', submit: 'https://www.heroku.com' },
  { name: 'Heroku2', submit: 'https://dashboard.heroku.com' },
  { name: 'Railway3', submit: 'https://railway.app' },
  { name: 'Render3', submit: 'https://render.com' },
  { name: 'Fly3', submit: 'https://fly.io' },
  { name: 'Vercel3', submit: 'https://vercel.com' },
  { name: 'Netlify3', submit: 'https://netlify.com' },
  { name: 'Supabase', submit: 'https://supabase.com' },
  { name: 'Firebase', submit: 'https://firebase.google.com' },
  { name: 'PlanetScale', submit: 'https://planetscale.com' },
  { name: 'CockroachDB', submit: 'https://www.cockroachlabs.com' },
  { name: 'Neon', submit: 'https://neon.tech' },
  { name: 'Turso', submit: 'https://turso.tech' },
  { name: 'Upstash', submit: 'https://upstash.com' },
  { name: 'Redis', submit: 'https://redis.io' },
  { name: 'MongoDB', submit: 'https://www.mongodb.com' },
  { name: 'PostgreSQL', submit: 'https://www.postgresql.org' },
  { name: 'MySQL', submit: 'https://www.mysql.com' },
  { name: 'MariaDB', submit: 'https://mariadb.org' },
  { name: 'SQLite', submit: 'https://sqlite.org' },
  { name: 'Prisma', submit: 'https://www.prisma.io' },
  { name: 'Drizzle', submit: 'https://orm.drizzle.team' },
  { name: 'Knex', submit: 'https://knexjs.org' },
  { name: 'TypeORM', submit: 'https://typeorm.io' },
  { name: 'Sequelize', submit: 'https://sequelize.org' },
  { name: 'GraphQL', submit: 'https://graphql.org' },
  { name: 'Apollo', submit: 'https://www.apollographql.com' },
  { name: 'Hasura', submit: 'https://hasura.io' },
  { name: 'PrismaCloud', submit: 'https://www.prismacloud.io' },
  { name: 'PlanetScale2', submit: 'https://planetscale.com' },
  { name: 'AWS', submit: 'https://aws.amazon.com' },
  { name: 'GCP', submit: 'https://cloud.google.com' },
  { name: 'Azure', submit: 'https://azure.microsoft.com' },
  { name: 'DigitalOcean', submit: 'https://www.digitalocean.com' },
  { name: 'Linode', submit: 'https://www.linode.com' },
  { name: 'Vultr', submit: 'https://www.vultr.com' },
  { name: 'Hetzner', submit: 'https://www.hetzner.com' },
  { name: 'OVH', submit: 'https://www.ovhcloud.com' },
  { name: 'Backblaze', submit: 'https://www.backblaze.com' },
  { name: 'Wasabi', submit: 'https://wasabi.com' },
  { name: 'Cloudflare2', submit: 'https://www.cloudflare.com' },
  { name: 'Fastly', submit: 'https://www.fastly.com' },
  { name: 'Akamai', submit: 'https://www.akamai.com' },
  { name: 'CloudFront', submit: 'https://aws.amazon.com/cloudfront' },
  { name: 'StackPath', submit: 'https://www.stackpath.com' },
  { name: 'Bunny', submit: 'https://bunny.net' },
  { name: 'KeyCDN', submit: 'https://www.keycdn.com' },
  { name: 'CDN77', submit: 'https://www.cdn77.com' },
  { name: 'jsDelivr', submit: 'https://www.jsdelivr.com' },
  { name: 'unpkg', submit: 'https://unpkg.com' },
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
  console.log(`🚀 Batch 27 - Cloud & Database (${DIRECTORIES.length} directories)\n`);
  
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
