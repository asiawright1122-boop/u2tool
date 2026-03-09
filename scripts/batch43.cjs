const https = require('https');

const DIRECTORIES = [
  { name: 'Brothersoft', submit: 'https://www.brothersoft.com' },
  { name: 'Brothersoft2', submit: 'https://www.brothersoft.com/submit' },
  { name: 'FreewareFiles', submit: 'https://www.freewarefiles.com' },
  { name: 'FreewareFiles2', submit: 'https://www.freewarefiles.com/submit' },
  { name: 'FreeDownload', submit: 'https://www.freedownloadmanager.org' },
  { name: 'FreeDownload2', submit: 'https://www.freedownloadmanager.org/submit' },
  { name: 'SharewareLand', submit: 'https://www.sharewareland.com' },
  { name: 'SharewareLand2', submit: 'https://www.sharewareland.com/submit' },
  { name: 'Programmers', submit: 'https://www.programmersheaven.com' },
  { name: 'Programmers2', submit: 'https://www.programmersheaven.com/submit' },
  { name: 'MacUpdate', submit: 'https://www.macupdate.com' },
  { name: 'MacUpdate2', submit: 'https://www.macupdate.com/submit' },
  { name: 'VersionTracker', submit: 'https://www.versiontracker.com' },
  { name: 'VersionTracker2', submit: 'https://www.versiontracker.com/submit' },
  { name: 'AppDB', submit: 'https://appdb.to' },
  { name: 'AppDB2', submit: 'https://appdb.to/submit' },
  { name: 'WineHQ', submit: 'https://www.winehq.org' },
  { name: 'WineHQ2', submit: 'https://www.winehq.org/submit' },
  { name: 'PortableApps', submit: 'https://portableapps.com' },
  { name: 'PortableApps2', submit: 'https://portableapps.com/submit' },
  { name: 'Softpedia2', submit: 'https://www.softpedia.com' },
  { name: 'Softpedia3', submit: 'https://www.softpedia.com/submit' },
  { name: 'FileHorse', submit: 'https://filehorse.com' },
  { name: 'FileHorse2', submit: 'https://filehorse.com/submit' },
  { name: 'FileHippo2', submit: 'https://filehippo.com' },
  { name: 'FileHippo3', submit: 'https://filehippo.com/submit' },
  { name: 'CCleaner', submit: 'https://www.ccleaner.com' },
  { name: 'CCleaner2', submit: 'https://www.ccleaner.com/submit' },
  { name: 'MajorGeeks', submit: 'https://www.majorgeeks.com' },
  { name: 'MajorGeeks2', submit: 'https://www.majorgeeks.com/submit' },
  { name: 'TechPowerUp', submit: 'https://www.techpowerup.com' },
  { name: 'TechPowerUp2', submit: 'https://www.techpowerup.com/submit' },
  { name: 'Neowin', submit: 'https://www.neowin.net' },
  { name: 'Neowin2', submit: 'https://www.neowin.net/submit' },
  { name: 'BleepingComputer', submit: 'https://www.bleepingcomputer.com' },
  { name: 'BleepingComputer2', submit: 'https://www.bleepingcomputer.com/submit' },
  { name: 'CNET', submit: 'https://www.cnet.com' },
  { name: 'CNET2', submit: 'https://www.cnet.com/submit' },
  { name: 'TechRadar', submit: 'https://www.techradar.com' },
  { name: 'TechRadar2', submit: 'https://www.techradar.com/submit' },
  { name: 'PCMag', submit: 'https://www.pcmag.com' },
  { name: 'PCMag2', submit: 'https://www.pcmag.com/submit' },
  { name: 'ZDNet', submit: 'https://www.zdnet.com' },
  { name: 'ZDNet2', submit: 'https://www.zdnet.com/submit' },
  { name: 'Wired', submit: 'https://www.wired.com' },
  { name: 'Wired2', submit: 'https://www.wired.com/submit' },
  { name: 'TheVerge', submit: 'https://www.theverge.com' },
  { name: 'TheVerge2', submit: 'https://www.theverge.com/submit' },
  { name: 'ArsTechnica', submit: 'https://arstechnica.com' },
  { name: 'ArsTechnica2', submit: 'https://arstechnica.com/submit' },
  { name: 'Engadget', submit: 'https://www.engadget.com' },
  { name: 'Engadget2', submit: 'https://www.engadget.com/submit' },
  { name: 'LifeHacker', submit: 'https://lifehacker.com' },
  { name: 'LifeHacker2', submit: 'https://lifehacker.com/submit' },
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
  console.log(`🚀 Batch 43 - More Software Directories (${DIRECTORIES.length} directories)\n`);
  
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
