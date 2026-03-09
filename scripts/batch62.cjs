const https = require('https');

const DIRECTORIES = [
  { name: 'Vercel', submit: 'https://vercel.com' },
  { name: 'Vercel2', submit: 'https://vercel.com/new' },
  { name: 'Netlify', submit: 'https://www.netlify.com' },
  { name: 'Netlify2', submit: 'https://app.netlify.com/signup' },
  { name: 'Cloudflare', submit: 'https://www.cloudflare.com' },
  { name: 'Cloudflare2', submit: 'https://www.cloudflare.com/a' },
  { name: 'AWS', submit: 'https://aws.amazon.com' },
  { name: 'AWS2', submit: 'https://aws.amazon.com/console' },
  { name: 'GCP', submit: 'https://cloud.google.com' },
  { name: 'GCP2', submit: 'https://console.cloud.google.com' },
  { name: 'Azure', submit: 'https://azure.microsoft.com' },
  { name: 'Azure2', submit: 'https://portal.azure.com' },
  { name: 'DigitalOcean', submit: 'https://www.digitalocean.com' },
  { name: 'DigitalOcean2', submit: 'https://cloud.digitalocean.com' },
  { name: 'Linode', submit: 'https://www.linode.com' },
  { name: 'Linode2', submit: 'https://cloud.linode.com' },
  { name: 'Vultr', submit: 'https://www.vultr.com' },
  { name: 'Vultr2', submit: 'https://my.vultr.com' },
  { name: 'Heroku', submit: 'https://www.heroku.com' },
  { name: 'Heroku2', submit: 'https://dashboard.heroku.com' },
  { name: 'Render', submit: 'https://render.com' },
  { name: 'Render2', submit: 'https://dashboard.render.com' },
  { name: 'Railway', submit: 'https://railway.app' },
  { name: 'Railway2', submit: 'https://railway.app/new' },
  { name: 'Fly', submit: 'https://fly.io' },
  { name: 'Fly2', submit: 'https://fly.io/launch' },
  { name: 'Supabase', submit: 'https://supabase.com' },
  { name: 'Supabase2', submit: 'https://supabase.com/dashboard' },
  { name: 'Firebase', submit: 'https://firebase.google.com' },
  { name: 'Firebase2', submit: 'https://console.firebase.google.com' },
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
  { name: 'MySQL', submit: 'https://www.mysql.com' },
  { name: 'MySQL2', submit: 'https://www.mysql.com/docs' },
  { name: 'MariaDB', submit: 'https://mariadb.org' },
  { name: 'MariaDB2', submit: 'https://mariadb.org/docs' },
  { name: 'SQLite', submit: 'https://sqlite.org' },
  { name: 'SQLite2', submit: 'https://sqlite.org/docs' },
  { name: 'Prisma', submit: 'https://www.prisma.io' },
  { name: 'Prisma2', submit: 'https://www.prisma.io/docs' },
  { name: 'Drizzle', submit: 'https://orm.drizzle.team' },
  { name: 'Drizzle2', submit: 'https://orm.drizzle.team/docs' },
  { name: 'Apollo', submit: 'https://www.apollographql.com' },
  { name: 'Apollo2', submit: 'https://www.apollographql.com/docs' },
  { name: 'Hasura', submit: 'https://hasura.io' },
  { name: 'Hasura2', submit: 'https://hasura.io/docs' },
  { name: 'GraphQL', submit: 'https://graphql.org' },
  { name: 'GraphQL2', submit: 'https://graphql.org/learn' },
  { name: 'Contentful', submit: 'https://www.contentful.com' },
  { name: 'Contentful2', submit: 'https://www.contentful.com/docs' },
  { name: 'Sanity', submit: 'https://www.sanity.io' },
  { name: 'Sanity2', submit: 'https://www.sanity.io/docs' },
  { name: 'Strapi', submit: 'https://strapi.io' },
  { name: 'Strapi2', submit: 'https://strapi.io/documentation' },
  { name: 'Directus', submit: 'https://directus.io' },
  { name: 'Directus2', submit: 'https://docs.directus.io' },
  { name: 'Keystatic', submit: 'https://keystatic.com' },
  { name: 'Keystatic2', submit: 'https://keystatic.com/docs' },
  { name: 'TinaCMS', submit: 'https://tina.io' },
  { name: 'TinaCMS2', submit: 'https://tina.io/docs' },
  { name: 'DecapCMS', submit: 'https://decapcms.org' },
  { name: 'DecapCMS2', submit: 'https://decapcms.org/docs' },
  { name: 'Forestry', submit: 'https://forestry.io' },
  { name: 'Forestry2', submit: 'https://forestry.io/docs' },
  { name: 'NetlifyCMS', submit: 'https://www.netlifycms.org' },
  { name: 'NetlifyCMS2', submit: 'https://www.netlifycms.org/docs' },
  { name: 'GitBook', submit: 'https://www.gitbook.com' },
  { name: 'GitBook2', submit: 'https://www.gitbook.com/docs' },
  { name: 'ReadMe', submit: 'https://readme.com' },
  { name: 'ReadMe2', submit: 'https://readme.com/docs' },
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
  console.log(`🚀 Batch 62 - Cloud, DB & CMS (${DIRECTORIES.length} directories)\n`);
  
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
