const https = require('https');

const DIRECTORIES = [
  { name: 'StackOverflow', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflow2', submit: 'https://stackoverflow.com/users' },
  { name: 'ServerFault', submit: 'https://serverfault.com' },
  { name: 'SuperUser', submit: 'https://superuser.com' },
  { name: 'AskUbuntu', submit: 'https://askubuntu.com' },
  { name: 'Unix', submit: 'https://unix.stackexchange.com' },
  { name: 'U&L', submit: 'https://unixandlinux.stackexchange.com' },
  { name: 'AppleDev', submit: 'https://developer.apple.com' },
  { name: 'MSDN', submit: 'https://learn.microsoft.com' },
  { name: 'AWS', submit: 'https://aws.amazon.com' },
  { name: 'GoogleDev', submit: 'https://developers.google.com' },
  { name: 'MetaDev', submit: 'https://developers.facebook.com' },
  { name: 'MSDev', submit: 'https://developer.microsoft.com' },
  { name: 'TwitterDev', submit: 'https://developer.twitter.com' },
  { name: 'StripeDev', submit: 'https://stripe.com/docs' },
  { name: 'PayPalDev', submit: 'https://developer.paypal.com' },
  { name: 'TwilioDev', submit: 'https://www.twilio.com/docs' },
  { name: 'SendGrid', submit: 'https://sendgrid.com/docs' },
  { name: 'Mailgun', submit: 'https://documentation.mailgun.com' },
  { name: 'AWSdocs', submit: 'https://docs.aws.amazon.com' },
  { name: 'AzureDocs', submit: 'https://learn.microsoft.com/azure' },
  { name: 'GCPdocs', submit: 'https://cloud.google.com/docs' },
  { name: 'HerokuDev', submit: 'https://devcenter.heroku.com' },
  { name: 'DigitalOcean', submit: 'https://www.digitalocean.com/community' },
  { name: 'Linode', submit: 'https://www.linode.com/docs' },
  { name: 'Vultr', submit: 'https://www.vultr.com/docs' },
  { name: 'Cloudflare', submit: 'https://developers.cloudflare.com' },
  { name: 'Fastly', submit: 'https://docs.fastly.com' },
  { name: 'Akamai', submit: 'https://developer.akamai.com' },
  { name: 'Mux', submit: 'https://docs.mux.com' },
  { name: 'Cloudinary', submit: 'https://cloudinary.com/documentation' },
  { name: 'Imgix', submit: 'https://docs.imgix.com' },
  { name: 'UploadCare', submit: 'https://uploadcare.com/docs' },
  { name: 'FileStack', submit: 'https://www.filestack.com/docs' },
  { name: 'BunnyNet', submit: 'https://docs.bunny.net' },
  { name: 'Sirv', submit: 'https://sirv.com/help' },
  { name: 'ImageKit', submit: 'https://imagekit.io/docs' },
  { name: 'Cloudinary2', submit: 'https://cloudinary.com' },
  { name: 'Sanity', submit: 'https://www.sanity.io/docs' },
  { name: 'Contentful', submit: 'https://www.contentful.com/developers' },
  { name: 'Strapi', submit: 'https://docs.strapi.io' },
  { name: 'Directus', submit: 'https://docs.directus.io' },
  { name: 'Keystatic', submit: 'https://keystatic.com/docs' },
  { name: 'DecapCMS', submit: 'https://decapcms.org/docs' },
  { name: 'Forestry', submit: 'https://forestry.io/docs' },
  { name: 'NetlifyCMS', submit: 'https://www.netlifycms.org/docs' },
  { name: ' TinaCMS', submit: 'https://tina.io/docs' },
  { name: 'Docusaurus3', submit: 'https://docusaurus.io/docs' },
  { name: 'GitBook', submit: 'https://docs.gitbook.com' },
  { name: 'ReadMe', submit: 'https://readme.com/docs' },
  { name: 'DevHub', submit: 'https://dev.to' },
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
  console.log(`🚀 Batch 38 - Dev Communities & Docs (${DIRECTORIES.length} directories)\n`);
  
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
