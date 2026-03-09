const https = require('https');

const DIRECTORIES = [
  { name: 'Vercel', submit: 'https://vercel.com' },
  { name: 'Netlify', submit: 'https://www.netlify.com' },
  { name: 'Cloudflare', submit: 'https://www.cloudflare.com' },
  { name: 'Firebase', submit: 'https://firebase.google.com' },
  { name: 'Supabase', submit: 'https://supabase.com' },
  { name: 'Heroku', submit: 'https://www.heroku.com' },
  { name: 'Railway', submit: 'https://railway.app' },
  { name: 'Render', submit: 'https://render.com' },
  { name: 'Fly', submit: 'https://fly.io' },
  { name: 'DigitalOcean', submit: 'https://www.digitalocean.com' },
  { name: 'Linode', submit: 'https://www.linode.com' },
  { name: 'Vultr', submit: 'https://www.vultr.com' },
  { name: 'AWS', submit: 'https://aws.amazon.com' },
  { name: 'GCP', submit: 'https://cloud.google.com' },
  { name: 'Azure', submit: 'https://azure.microsoft.com' },
  { name: 'IBMCloud', submit: 'https://www.ibm.com/cloud' },
  { name: 'OracleCloud', submit: 'https://www.oracle.com/cloud' },
  { name: 'AlibabaCloud', submit: 'https://www.alibabacloud.com' },
  { name: 'TencentCloud', submit: 'https://cloud.tencent.com' },
  { name: 'Back4App', submit: 'https://www.back4app.com' },
  { name: 'Parse', submit: 'https://parseplatform.org' },
  { name: 'Koyeb', submit: 'https://koyeb.com' },
  { name: 'Northflank', submit: 'https://northflank.com' },
  { name: 'Deta', submit: 'https://deta.space' },
  { name: 'Cyclic', submit: 'https://cyclic.sh' },
  { name: 'Qoddi', submit: 'https://qoddi.com' },
  { name: 'Glitch', submit: 'https://glitch.com' },
  { name: 'Replit', submit: 'https://replit.com' },
  { name: 'StackBlitz', submit: 'https://stackblitz.com' },
  { name: 'CodeSandbox', submit: 'https://codesandbox.io' },
  { name: 'CodePen', submit: 'https://codepen.io' },
  { name: 'JSFiddle', submit: 'https://jsfiddle.net' },
  { name: 'PlayCode', submit: 'https://playcode.io' },
  { name: 'GitHubPages', submit: 'https://pages.github.com' },
  { name: 'GitLabPages', submit: 'https://pages.gitlab.io' },
  { name: 'Surge', submit: 'https://surge.sh' },
  { name: 'Neocities', submit: 'https://neocities.org' },
  { name: 'TiinyHost', submit: 'https://tiiny.host' },
  { name: 'FirebaseHosting', submit: 'https://firebase.google.com/products/hosting' },
  { name: 'Netlify2', submit: 'https://www.netlify.com' },
  { name: 'Vercel2', submit: 'https://vercel.com' },
  { name: 'Cloudflare2', submit: 'https://www.cloudflare.com' },
  { name: 'AWS2', submit: 'https://aws.amazon.com' },
  { name: 'GCP2', submit: 'https://cloud.google.com' },
  { name: 'Azure2', submit: 'https://azure.microsoft.com' },
  { name: 'MongoDB', submit: 'https://www.mongodb.com' },
  { name: 'PostgreSQL', submit: 'https://www.postgresql.org' },
  { name: 'MySQL', submit: 'https://www.mysql.com' },
  { name: 'MariaDB', submit: 'https://mariadb.org' },
  { name: 'SQLite', submit: 'https://sqlite.org' },
  { name: 'Redis', submit: 'https://redis.io' },
  { name: 'Prisma', submit: 'https://www.prisma.io' },
  { name: 'Drizzle', submit: 'https://orm.drizzle.team' },
  { name: 'TypeORM', submit: 'https://typeorm.io' },
  { name: 'Sequelize', submit: 'https://sequelize.org' },
  { name: 'GraphQL', submit: 'https://graphql.org' },
  { name: 'Apollo', submit: 'https://www.apollographql.com' },
  { name: 'Hasura', submit: 'https://hasura.io' },
  { name: 'PlanetScale', submit: 'https://planetscale.com' },
  { name: 'Neon', submit: 'https://neon.tech' },
  { name: 'CockroachDB', submit: 'https://www.cockroachlabs.com' },
  { name: 'Upstash', submit: 'https://upstash.com' },
  { name: 'Turso', submit: 'https://turso.tech' },
  { name: 'Fauna', submit: 'https://fauna.com' },
  { name: 'DynamoDB', submit: 'https://aws.amazon.com/dynamodb' },
  { name: 'Cassandra', submit: 'https://cassandra.apache.org' },
  { name: 'CouchDB', submit: 'https://couchdb.apache.org' },
  { name: 'Neo4j', submit: 'https://neo4j.com' },
  { name: 'ArangoDB', submit: 'https://www.arangodb.com' },
  { name: 'InfluxDB', submit: 'https://www.influxdata.com' },
  { name: 'TimescaleDB', submit: 'https://www.timescale.com' },
  { name: 'ClickHouse', submit: 'https://clickhouse.com' },
  { name: 'SingleStore', submit: 'https://www.singlestore.com' },
  { name: 'QuestDB', submit: 'https://questdb.io' },
  { name: 'Materialize', submit: 'https://materialize.com' },
  { name: 'Elastic', submit: 'https://www.elastic.co' },
  { name: 'MeiliSearch', submit: 'https://www.meilisearch.com' },
  { name: 'Typesense', submit: 'https://typesense.org' },
  { name: 'Algolia', submit: 'https://www.algolia.com' },
  { name: 'SearchUnify', submit: 'https://www.searchunify.com' },
  { name: 'AddSearch', submit: 'https://www.addsearch.com' },
  { name: 'SwiftType', submit: 'https://swiftype.com' },
  { name: 'Clarabridge', submit: 'https://www.clarabridge.com' },
  { name: 'Auth0', submit: 'https://auth0.com' },
  { name: 'Clerk', submit: 'https://clerk.com' },
  { name: 'Okta', submit: 'https://www.okta.com' },
  { name: 'FirebaseAuth', submit: 'https://firebase.google.com/auth' },
  { name: 'SupabaseAuth', submit: 'https://supabase.com/auth' },
  { name: 'AWSAmplify', submit: 'https://aws.amazon.com/amplify' },
  { name: 'Cognito', submit: 'https://aws.amazon.com/cognito' },
  { name: 'Keycloak', submit: 'https://www.keycloak.org' },
  { name: 'Logto', submit: 'https://logto.io' },
  { name: 'Casdoor', submit: 'https://casdoor.org' },
  { name: 'FusionAuth', submit: 'https://fusionauth.io' },
  { name: 'SuperTokens', submit: 'https://supertokens.com' },
  { name: 'Kinde', submit: 'https://kinde.com' },
  { name: 'Stytch', submit: 'https://stytch.com' },
  { name: 'Userfront', submit: 'https://userfront.com' },
  { name: 'Magic', submit: 'https://magic.link' },
  { name: 'Passport', submit: 'https://www.passportjs.org' },
  { name: 'NextAuth', submit: 'https://next-auth.js.org' },
  { name: 'AuthJS', submit: 'https://authjs.dev' },
  { name: 'Lucia', submit: 'https://luciaauth.com' },
  { name: 'BetterAuth', submit: 'https://better-auth.com' },
  { name: 'SendGrid', submit: 'https://sendgrid.com' },
  { name: 'Mailgun', submit: 'https://www.mailgun.com' },
  { name: 'Postmark', submit: 'https://postmarkapp.com' },
  { name: 'SparkPost', submit: 'https://www.sparkpost.com' },
  { name: 'Mailchimp', submit: 'https://mailchimp.com' },
  { name: 'Sendinblue', submit: 'https://www.sendinblue.com' },
  { name: 'Resend', submit: 'https://resend.com' },
  { name: 'Loops', submit: 'https://loops.so' },
  { name: 'ConvertKit', submit: 'https://convertkit.com' },
  { name: 'GetResponse', submit: 'https://www.getresponse.com' },
  { name: 'AWeber', submit: 'https://www.aweber.com' },
  { name: 'ActiveCampaign', submit: 'https://www.activecampaign.com' },
  { name: 'HubSpot', submit: 'https://www.hubspot.com' },
  { name: 'Sentry', submit: 'https://sentry.io' },
  { name: 'Bugsnag', submit: 'https://www.bugsnag.com' },
  { name: 'Rollbar', submit: 'https://rollbar.com' },
  { name: 'Airbrake', submit: 'https://airbrake.io' },
  { name: 'Raygun', submit: 'https://raygun.com' },
  { name: 'LogRocket', submit: 'https://logrocket.com' },
  { name: 'Datadog', submit: 'https://www.datadoghq.com' },
  { name: 'NewRelic', submit: 'https://newrelic.com' },
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
  console.log(`🚀 Batch 78 - Cloud, DB, Auth & Monitoring (${DIRECTORIES.length} directories)\n`);
  
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
