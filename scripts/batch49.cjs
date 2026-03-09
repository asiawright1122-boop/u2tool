const https = require('https');

const DIRECTORIES = [
  { name: 'Vercel', submit: 'https://vercel.com' },
  { name: 'Vercel2', submit: 'https://vercel.com/new' },
  { name: 'Netlify', submit: 'https://www.netlify.com' },
  { name: 'Netlify2', submit: 'https://app.netlify.com/signup' },
  { name: 'Cloudflare', submit: 'https://www.cloudflare.com' },
  { name: 'Cloudflare2', submit: 'https://www.cloudflare.com/submit' },
  { name: 'Firebase', submit: 'https://firebase.google.com' },
  { name: 'Firebase2', submit: 'https://console.firebase.google.com' },
  { name: 'Supabase', submit: 'https://supabase.com' },
  { name: 'Supabase2', submit: 'https://supabase.com/dashboard' },
  { name: 'Heroku', submit: 'https://www.heroku.com' },
  { name: 'Heroku2', submit: 'https://dashboard.heroku.com/new-app' },
  { name: 'Railway', submit: 'https://railway.app' },
  { name: 'Railway2', submit: 'https://railway.app/new' },
  { name: 'Render', submit: 'https://render.com' },
  { name: 'Render2', submit: 'https://dashboard.render.com/new' },
  { name: 'Fly', submit: 'https://fly.io' },
  { name: 'Fly2', submit: 'https://fly.io/launch' },
  { name: 'DigitalOcean', submit: 'https://www.digitalocean.com' },
  { name: 'DigitalOcean2', submit: 'https://cloud.digitalocean.com/new' },
  { name: 'Linode', submit: 'https://www.linode.com' },
  { name: 'Linode2', submit: 'https://cloud.linode.com/new' },
  { name: 'Vultr', submit: 'https://www.vultr.com' },
  { name: 'Vultr2', submit: 'https://my.vultr.com/deploy' },
  { name: 'AWS', submit: 'https://aws.amazon.com' },
  { name: 'AWS2', submit: 'https://console.aws.amazon.com' },
  { name: 'GCP', submit: 'https://cloud.google.com' },
  { name: 'GCP2', submit: 'https://console.cloud.google.com' },
  { name: 'Azure', submit: 'https://azure.microsoft.com' },
  { name: 'Azure2', submit: 'https://portal.azure.com' },
  { name: 'IBMCloud', submit: 'https://www.ibm.com/cloud' },
  { name: 'IBMCloud2', submit: 'https://cloud.ibm.com/new' },
  { name: 'OracleCloud', submit: 'https://www.oracle.com/cloud' },
  { name: 'OracleCloud2', submit: 'https://cloud.oracle.com' },
  { name: 'AlibabaCloud', submit: 'https://www.alibabacloud.com' },
  { name: 'AlibabaCloud2', submit: 'https://.console.aliyun.com' },
  { name: 'TencentCloud', submit: 'https://cloud.tencent.com' },
  { name: 'TencentCloud2', submit: 'https://console.cloud.tencent.com' },
  { name: 'BaiduCloud', submit: 'https://login.bce.baidu.com' },
  { name: 'BaiduCloud2', submit: 'https://console.bce.baidu.com' },
  { name: 'HuaweiCloud', submit: 'https://www.huaweicloud.com' },
  { name: 'HuaweiCloud2', submit: 'https://console.huaweicloud.com' },
  { name: 'Back4App', submit: 'https://www.back4app.com' },
  { name: 'Back4App2', submit: 'https://dashboard.back4app.com/new' },
  { name: 'Parse', submit: 'https://parseplatform.org' },
  { name: 'Parse2', submit: 'https://dashboard.parseplatform.org' },
  { name: 'Koyeb', submit: 'https://koyeb.com' },
  { name: 'Koyeb2', submit: 'https://app.koyeb.com' },
  { name: 'Northflank', submit: 'https://northflank.com' },
  { name: 'Northflank2', submit: 'https://app.northflank.com' },
  { name: 'Deta', submit: 'https://deta.space' },
  { name: 'Deta2', submit: 'https://deta.space/new' },
  { name: 'Cyclic', submit: 'https://cyclic.sh' },
  { name: 'Cyclic2', submit: 'https://app.cyclic.sh' },
  { name: 'Qoddi', submit: 'https://qoddi.com' },
  { name: 'Qoddi2', submit: 'https://app.qoddi.com' },
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
  console.log(`🚀 Batch 49 - Cloud Hosting Platforms (${DIRECTORIES.length} directories)\n`);
  
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
