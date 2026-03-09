const https = require('https');

const DIRECTORIES = [
  { name: 'ProductHunt', submit: 'https://www.producthunt.com' },
  { name: 'ProductHunt2', submit: 'https://www.producthunt.com/products' },
  { name: 'BetaList', submit: 'https://betalist.com' },
  { name: 'BetaList2', submit: 'https://betalist.com/submit' },
  { name: 'LaunchingNext', submit: 'https://www.launchingnext.com' },
  { name: 'LaunchingNext2', submit: 'https://www.launchingnext.com/submit' },
  { name: 'AlternativeTo', submit: 'https://alternativeto.net' },
  { name: 'AlternativeTo2', submit: 'https://alternativeto.net/software/u2tool' },
  { name: 'SaaSHub', submit: 'https://www.saashub.com' },
  { name: 'SaaSHub2', submit: 'https://www.saashub.com/compare' },
  { name: 'Crozdesk', submit: 'https://www.crozdesk.com' },
  { name: 'Crozdesk2', submit: 'https://www.crozdesk.com/submit' },
  { name: 'GetApp', submit: 'https://www.getapp.com' },
  { name: 'GetApp2', submit: 'https://www.getapp.com/submit-app' },
  { name: 'Capterra', submit: 'https://www.capterra.com' },
  { name: 'Capterra2', submit: 'https://www.capterra.com/submit' },
  { name: 'G2', submit: 'https://www.g2.com' },
  { name: 'G22', submit: 'https://www.g2.com/products/u2tool' },
  { name: 'TrustRadius', submit: 'https://www.trustradius.com' },
  { name: 'TrustRadius2', submit: 'https://www.trustradius.com/products/u2tool' },
  { name: 'PeerSpot', submit: 'https://www.peerspot.com' },
  { name: 'PeerSpot2', submit: 'https://www.peerspot.com/products/u2tool' },
  { name: 'SoftwareWorld', submit: 'https://softwareworld.ca' },
  { name: 'SoftwareWorld2', submit: 'https://softwareworld.ca/submit' },
  { name: 'StackShare', submit: 'https://stackshare.io' },
  { name: 'StackShare2', submit: 'https://stackshare.io/submit' },
  { name: 'Slant', submit: 'https://www.slant.co' },
  { name: 'Slant2', submit: 'https://www.slant.co/submit' },
  { name: 'LibHunt', submit: 'https://www.libhunt.com' },
  { name: 'LibHunt2', submit: 'https://www.libhunt.com/submit' },
  { name: 'OpenSource', submit: 'https://opensource.com' },
  { name: 'OpenSource2', submit: 'https://opensource.com/submit' },
  { name: 'Softpedia', submit: 'https://www.softpedia.com' },
  { name: 'Softpedia2', submit: 'https://www.softpedia.com/submit' },
  { name: 'Softonic', submit: 'https://www.softonic.com' },
  { name: 'Softonic2', submit: 'https://www.softonic.com/submit' },
  { name: 'FileHippo', submit: 'https://filehippo.com' },
  { name: 'FileHippo2', submit: 'https://filehippo.com/submit' },
  { name: 'Download82', submit: 'https://download82.com' },
  { name: 'Download822', submit: 'https://download82.com/submit' },
  { name: 'SoftwareInformer', submit: 'https://software.informer.com' },
  { name: 'SoftwareInformer2', submit: 'https://software.informer.com/submit' },
  { name: 'SnapFiles', submit: 'https://www.snapfiles.com' },
  { name: 'SnapFiles2', submit: 'https://www.snapfiles.com/submit' },
  { name: 'Brothersoft', submit: 'www.brothersoft.com' },
  { name: 'Brothersoft2', submit: 'www.brothersoft.com/submit' },
  { name: 'FreewareFiles', submit: 'https://www.freewarefiles.com' },
  { name: 'FreewareFiles2', submit: 'https://www.freewarefiles.com/submit' },
  { name: 'FreeDownload', submit: 'https://www.freedownloadmanager.org' },
  { name: 'FreeDownload2', submit: 'https://www.freedownloadmanager.org/submit' },
  { name: 'SharewareLand', submit: 'https://www.sharewareland.com' },
  { name: 'SharewareLand2', submit: 'https://www.sharewareland.com/submit' },
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
  console.log(`🚀 Batch 42 - Software Directories (${DIRECTORIES.length} directories)\n`);
  
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
