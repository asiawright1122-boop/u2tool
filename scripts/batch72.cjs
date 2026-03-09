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
  { name: 'Auth0', submit: 'https://auth0.com' },
  { name: 'Clerk', submit: 'https://clerk.com' },
  { name: 'Okta', submit: 'https://www.okta.com' },
  { name: 'Keycloak', submit: 'https://www.keycloak.org' },
  { name: 'Logto', submit: 'https://logto.io' },
  { name: 'FusionAuth', submit: 'https://fusionauth.io' },
  { name: 'SuperTokens', submit: 'https://supertokens.com' },
  { name: 'Kinde', submit: 'https://kinde.com' },
  { name: 'Stytch', submit: 'https://stytch.com' },
  { name: 'NextAuth', submit: 'https://next-auth.js.org' },
  { name: 'Lucia', submit: 'https://luciaauth.com' },
  { name: 'BetterAuth', submit: 'https://better-auth.com' },
  { name: 'SendGrid', submit: 'https://sendgrid.com' },
  { name: 'Mailgun', submit: 'https://www.mailgun.com' },
  { name: 'Postmark', submit: 'https://postmarkapp.com' },
  { name: 'SparkPost', submit: 'https://www.sparkpost.com' },
  { name: 'Mailchimp', submit: 'https://mailchimp.com' },
  { name: 'Resend', submit: 'https://resend.com' },
  { name: 'Loops', submit: 'https://loops.so' },
  { name: 'Sentry', submit: 'https://sentry.io' },
  { name: 'Bugsnag', submit: 'https://www.bugsnag.com' },
  { name: 'Rollbar', submit: 'https://rollbar.com' },
  { name: 'Airbrake', submit: 'https://airbrake.io' },
  { name: 'LogRocket', submit: 'https://logrocket.com' },
  { name: 'Datadog', submit: 'https://www.datadoghq.com' },
  { name: 'NewRelic', submit: 'https://newrelic.com' },
  { name: 'AppDynamics', submit: 'https://www.appdynamics.com' },
  { name: 'Dynatrace', submit: 'https://www.dynatrace.com' },
  { name: 'Grafana', submit: 'https://grafana.com' },
  { name: 'Prometheus', submit: 'https://prometheus.io' },
  { name: 'Kibana', submit: 'https://www.elastic.co/kibana' },
  { name: 'Splunk', submit: 'https://www.splunk.com' },
  { name: 'SumoLogic', submit: 'https://www.sumologic.com' },
  { name: 'PagerDuty', submit: 'https://www.pagerduty.com' },
  { name: 'OpsGenie', submit: 'https://www.opsgenie.com' },
  { name: 'StatusPage', submit: 'https://www.atlassian.com/software/statuspage' },
  { name: 'Instatus', submit: 'https://instatus.com' },
  { name: 'Docker', submit: 'https://www.docker.com' },
  { name: 'Kubernetes', submit: 'https://kubernetes.io' },
  { name: 'Helm', submit: 'https://helm.sh' },
  { name: 'Terraform', submit: 'https://www.terraform.io' },
  { name: 'Ansible', submit: 'https://www.ansible.com' },
  { name: 'Puppet', submit: 'https://www.puppet.com' },
  { name: 'Jenkins', submit: 'https://www.jenkins.io' },
  { name: 'CircleCI', submit: 'https://circleci.com' },
  { name: 'TravisCI', submit: 'https://travis-ci.org' },
  { name: 'ArgoCD', submit: 'https://argocd.io' },
  { name: 'Flux', submit: 'https://fluxcd.io' },
  { name: 'Spinnaker', submit: 'https://spinnaker.io' },
  { name: 'Istio', submit: 'https://istio.io' },
  { name: 'Linkerd', submit: 'https://linkerd.io' },
  { name: 'Vault', submit: 'https://www.vaultproject.io' },
  { name: 'Consul', submit: 'https://www.consul.io' },
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
  console.log(`🚀 Batch 72 - Cloud, DB, DevOps (${DIRECTORIES.length} directories)\n`);
  
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
