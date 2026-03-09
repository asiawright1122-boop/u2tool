const https = require('https');

const DIRECTORIES = [
  { name: 'Auth0', submit: 'https://auth0.com' },
  { name: 'Auth02', submit: 'https://auth0.com/submit' },
  { name: 'Clerk', submit: 'https://clerk.com' },
  { name: 'Clerk2', submit: 'https://clerk.com/submit' },
  { name: 'Okta', submit: 'https://www.okta.com' },
  { name: 'Okta2', submit: 'https://www.okta.com/submit' },
  { name: 'FirebaseAuth', submit: 'https://firebase.google.com/auth' },
  { name: 'FirebaseAuth2', submit: 'https://firebase.google.com/auth/submit' },
  { name: 'SupabaseAuth', submit: 'https://supabase.com/auth' },
  { name: 'SupabaseAuth2', submit: 'https://supabase.com/auth/submit' },
  { name: 'AWSAmplify', submit: 'https://aws.amazon.com/amplify' },
  { name: 'AWSAmplify2', submit: 'https://aws.amazon.com/amplify/submit' },
  { name: 'Cognito', submit: 'https://aws.amazon.com/cognito' },
  { name: 'Cognito2', submit: 'https://aws.amazon.com/cognito/submit' },
  { name: 'Keycloak', submit: 'https://www.keycloak.org' },
  { name: 'Keycloak2', submit: 'https://www.keycloak.org/submit' },
  { name: 'Logto', submit: 'https://logto.io' },
  { name: 'Logto2', submit: 'https://logto.io/submit' },
  { name: 'Casdoor', submit: 'https://casdoor.org' },
  { name: 'Casdoor2', submit: 'https://casdoor.org/submit' },
  { name: 'FusionAuth', submit: 'https://fusionauth.io' },
  { name: 'FusionAuth2', submit: 'https://fusionauth.io/submit' },
  { name: 'SuperTokens', submit: 'https://supertokens.com' },
  { name: 'SuperTokens2', submit: 'https://supertokens.com/submit' },
  { name: 'Kinde', submit: 'https://kinde.com' },
  { name: 'Kinde2', submit: 'https://kinde.com/submit' },
  { name: 'Stytch', submit: 'https://stytch.com' },
  { name: 'Stytch2', submit: 'https://stytch.com/submit' },
  { name: 'Userfront', submit: 'https://userfront.com' },
  { name: 'Userfront2', submit: 'https://userfront.com/submit' },
  { name: 'Magic', submit: 'https://magic.link' },
  { name: 'Magic2', submit: 'https://magic.link/submit' },
  { name: 'Passport', submit: 'https://www.passportjs.org' },
  { name: 'Passport2', submit: 'https://www.passportjs.org/submit' },
  { name: 'NextAuth', submit: 'https://next-auth.js.org' },
  { name: 'NextAuth2', submit: 'https://next-auth.js.org/submit' },
  { name: 'AuthJS', submit: 'https://authjs.dev' },
  { name: 'AuthJS2', submit: 'https://authjs.dev/submit' },
  { name: 'Lucia', submit: 'https://luciaauth.com' },
  { name: 'Lucia2', submit: 'https://luciaauth.com/submit' },
  { name: 'BetterAuth', submit: 'https://better-auth.com' },
  { name: 'BetterAuth2', submit: 'https://better-auth.com/submit' },
  { name: 'SendGrid', submit: 'https://sendgrid.com' },
  { name: 'SendGrid2', submit: 'https://sendgrid.com/submit' },
  { name: 'Mailgun', submit: 'https://www.mailgun.com' },
  { name: 'Mailgun2', submit: 'https://www.mailgun.com/submit' },
  { name: 'Postmark', submit: 'https://postmarkapp.com' },
  { name: 'Postmark2', submit: 'https://postmarkapp.com/submit' },
  { name: 'SparkPost', submit: 'https://www.sparkpost.com' },
  { name: 'SparkPost2', submit: 'https://www.sparkpost.com/submit' },
  { name: 'Mailchimp', submit: 'https://mailchimp.com' },
  { name: 'Mailchimp2', submit: 'https://mailchimp.com/submit' },
  { name: 'Sendinblue', submit: 'https://www.sendinblue.com' },
  { name: 'Sendinblue2', submit: 'https://www.sendinblue.com/submit' },
  { name: 'Resend', submit: 'https://resend.com' },
  { name: 'Resend2', submit: 'https://resend.com/submit' },
  { name: 'Loops', submit: 'https://loops.so' },
  { name: 'Loops2', submit: 'https://loops.so/submit' },
  { name: 'ConvertKit', submit: 'https://convertkit.com' },
  { name: 'ConvertKit2', submit: 'https://convertkit.com/submit' },
  { name: 'GetResponse', submit: 'https://www.getresponse.com' },
  { name: 'GetResponse2', submit: 'https://www.getresponse.com/submit' },
  { name: 'AWeber', submit: 'https://www.aweber.com' },
  { name: 'AWeber2', submit: 'https://www.aweber.com/submit' },
  { name: 'ActiveCampaign', submit: 'https://www.activecampaign.com' },
  { name: 'ActiveCampaign2', submit: 'https://www.activecampaign.com/submit' },
  { name: 'HubSpot', submit: 'https://www.hubspot.com' },
  { name: 'HubSpot2', submit: 'https://www.hubspot.com/submit' },
  { name: 'Salesforce', submit: 'https://www.salesforce.com' },
  { name: 'Salesforce2', submit: 'https://www.salesforce.com/submit' },
  { name: 'Zendesk', submit: 'https://www.zendesk.com' },
  { name: 'Zendesk2', submit: 'https://www.zendesk.com/submit' },
  { name: 'Intercom', submit: 'https://www.intercom.com' },
  { name: 'Intercom2', submit: 'https://www.intercom.com/submit' },
  { name: 'Freshdesk', submit: 'https://www.freshworks.com/freshdesk' },
  { name: 'Freshdesk2', submit: 'https://www.freshworks.com/freshdesk/submit' },
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
  console.log(`🚀 Batch 59 - Auth & Email Services (${DIRECTORIES.length} directories)\n`);
  
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
