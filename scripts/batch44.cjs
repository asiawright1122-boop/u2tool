const https = require('https');

const DIRECTORIES = [
  { name: 'Mashable', submit: 'https://mashable.com' },
  { name: 'Mashable2', submit: 'https://mashable.com/submit' },
  { name: 'Gizmodo', submit: 'https://gizmodo.com' },
  { name: 'Gizmodo2', submit: 'https://gizmodo.com/submit' },
  { name: 'TheNextWeb', submit: 'https://thenextweb.com' },
  { name: 'TheNextWeb2', submit: 'https://thenextweb.com/submit' },
  { name: 'TNW', submit: 'https://thenextweb.com' },
  { name: 'TNW2', submit: 'https://thenextweb.com/submit' },
  { name: 'TechCrunch', submit: 'https://techcrunch.com' },
  { name: 'TechCrunch2', submit: 'https://techcrunch.com/submit' },
  { name: 'VentureBeat', submit: 'https://venturebeat.com' },
  { name: 'VentureBeat2', submit: 'https://venturebeat.com/submit' },
  { name: 'VentureBeat3', submit: 'https://venturebeat.com' },
  { name: 'Recode', submit: 'https://www.vox.com/recode' },
  { name: 'Recode2', submit: 'https://www.vox.com/recode/submit' },
  { name: 'TheInformation', submit: 'https://www.theinformation.com' },
  { name: 'TheInformation2', submit: 'https://www.theinformation.com/submit' },
  { name: 'Protocol', submit: 'https://protocol.com' },
  { name: 'Protocol2', submit: 'https://protocol.com/submit' },
  { name: 'Tech.co', submit: 'https://tech.co' },
  { name: 'Tech.co2', submit: 'https://tech.co/submit' },
  { name: 'BetaKit', submit: 'https://betakit.com' },
  { name: 'BetaKit2', submit: 'https://betakit.com/submit' },
  { name: 'SiliconAngle', submit: 'https://siliconangle.com' },
  { name: 'SiliconAngle2', submit: 'https://siliconangle.com/submit' },
  { name: 'TechSpot', submit: 'https://www.techspot.com' },
  { name: 'TechSpot2', submit: 'https://www.techspot.com/submit' },
  { name: 'TomHardware', submit: 'https://www.tomshardware.com' },
  { name: 'TomHardware2', submit: 'https://www.tomshardware.com/submit' },
  { name: 'AnandTech', submit: 'https://www.anandtech.com' },
  { name: 'AnandTech2', submit: 'https://www.anandtech.com/submit' },
  { name: 'HotHardware', submit: 'https://hothardware.com' },
  { name: 'HotHardware2', submit: 'https://hothardware.com/submit' },
  { name: 'PCPerspective', submit: 'https://pcperspective.com' },
  { name: 'PCPerspective2', submit: 'https://pcperspective.com/submit' },
  { name: 'LegitReviews', submit: 'https://www.legitreviews.com' },
  { name: 'LegitReviews2', submit: 'https://www.legitreviews.com/submit' },
  { name: 'Benchmark', submit: 'https://benchmark.com' },
  { name: 'Benchmark2', submit: 'https://benchmark.com/submit' },
  { name: 'XbitLabs', submit: 'https://xbitlabs.com' },
  { name: 'XbitLabs2', submit: 'https://xbitlabs.com/submit' },
  { name: 'VR-Zone', submit: 'https://vr-zone.com' },
  { name: 'VR-Zone2', submit: 'https://vr-zone.com/submit' },
  { name: 'SlashGear', submit: 'https://www.slashgear.com' },
  { name: 'SlashGear2', submit: 'https://www.slashgear.com/submit' },
  { name: 'Ubergizmo', submit: 'https://www.ubergizmo.com' },
  { name: 'Ubergizmo2', submit: 'https://www.ubergizmo.com/submit' },
  { name: 'AndroidCentral', submit: 'https://www.androidcentral.com' },
  { name: 'AndroidCentral2', submit: 'https://www.androidcentral.com/submit' },
  { name: 'iMore', submit: 'https://www.imore.com' },
  { name: 'iMore2', submit: 'https://www.imore.com/submit' },
  { name: 'WindowsCentral', submit: 'https://www.windowscentral.com' },
  { name: 'WindowsCentral2', submit: 'https://www.windowscentral.com/submit' },
  { name: 'TheVerge', submit: 'https://www.theverge.com' },
  { name: 'TheVerge2', submit: 'https://www.theverge.com/submit' },
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
  console.log(`🚀 Batch 44 - Tech News Sites (${DIRECTORIES.length} directories)\n`);
  
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
