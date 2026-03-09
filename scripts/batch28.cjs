const https = require('https');

const DIRECTORIES = [
  { name: 'GitHubPages', submit: 'https://pages.github.com' },
  { name: 'GitLabPages', submit: 'https://pages.gitlab.io' },
  { name: 'CloudflarePages', submit: 'https://pages.cloudflare.com' },
  { name: 'Vercel4', submit: 'https://vercel.com' },
  { name: 'Netlify4', submit: 'https://netlify.com' },
  { name: 'Render4', submit: 'https://render.com' },
  { name: 'Railway4', submit: 'https://railway.app' },
  { name: 'Fly4', submit: 'https://fly.io' },
  { name: 'DenoDeploy', submit: 'https://deno.com/deploy' },
  { name: ' BunDeploy', submit: 'https://bun.com/deploy' },
  { name: 'Workers', submit: 'https://workers.cloudflare.com' },
  { name: 'EdgeFunctions', submit: 'https://vercel.com/docs/functions/edge-functions' },
  { name: 'Lambda', submit: 'https://aws.amazon.com/lambda' },
  { name: 'Functions', submit: 'https://azure.microsoft.com/functions' },
  { name: 'CloudFunctions', submit: 'https://cloud.google.com/functions' },
  { name: 'CloudRun', submit: 'https://cloud.google.com/run' },
  { name: 'AppRunner', submit: 'https://aws.amazon.com/apprunner' },
  { name: 'Fargate', submit: 'https://aws.amazon.com/fargate' },
  { name: 'Knative', submit: 'https://knative.dev' },
  { name: 'OpenFaaS', submit: 'https://www.openfaas.com' },
  { name: 'FnProject', submit: 'https://fnproject.io' },
  { name: 'OpenWhisk', submit: 'https://openwhisk.apache.org' },
  { name: 'IronFunctions', submit: 'https://iron.io' },
  { name: 'StdLib', submit: 'https://stdlib.com' },
  { name: 'WebTask', submit: 'https://webtask.io' },
  { name: 'Auth0', submit: 'https://auth0.com' },
  { name: 'Clerk', submit: 'https://clerk.com' },
  { name: 'SupabaseAuth', submit: 'https://supabase.com/auth' },
  { name: 'FirebaseAuth', submit: 'https://firebase.google.com/auth' },
  { name: 'AWSAmplify', submit: 'https://aws.amazon.com/amplify' },
  { name: 'Cognito', submit: 'https://aws.amazon.com/cognito' },
  { name: 'Okta', submit: 'https://www.okta.com' },
  { name: 'Keycloak', submit: 'https://www.keycloak.org' },
  { name: 'Logto', submit: 'https://logto.io' },
  { name: 'Casdoor', submit: 'https://casdoor.org' },
  { name: 'FusionAuth', submit: 'https://fusionauth.io' },
  { name: 'Supertokens', submit: 'https://supertokens.com' },
  { name: 'Kinde', submit: 'https://kinde.com' },
  { name: 'Stytch', submit: 'https://stytch.com' },
  { name: 'Userfront', submit: 'https://userfront.com' },
  { name: 'Magic', submit: 'https://magic.link' },
  { name: 'Passport', submit: 'https://www.passportjs.org' },
  { name: 'NextAuth', submit: 'https://next-auth.js.org' },
  { name: 'AuthJS', submit: 'https://authjs.dev' },
  { name: 'Lucia', submit: 'https://luciaauth.com' },
  { name: 'BetterAuth', submit: 'https://better-auth.com' },
  { name: 'Clerk2', submit: 'https://clerk.com' },
  { name: 'Auth0Forms', submit: 'https://auth0.com/form' },
  { name: 'LoginRadius', submit: 'https://www.loginradius.com' },
  { name: 'OneLogin', submit: 'https://www.onelogin.com' },
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
  console.log(`🚀 Batch 28 - Serverless & Auth (${DIRECTORIES.length} directories)\n`);
  
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
