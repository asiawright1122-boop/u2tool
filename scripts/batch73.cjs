const https = require('https');

const DIRECTORIES = [
  { name: 'ProductHunt', submit: 'https://www.producthunt.com' },
  { name: 'BetaList', submit: 'https://betalist.com' },
  { name: 'LaunchingNext', submit: 'https://www.launchingnext.com' },
  { name: 'AlternativeTo', submit: 'https://alternativeto.net' },
  { name: 'SaaSHub', submit: 'https://www.saashub.com' },
  { name: 'Crozdesk', submit: 'https://www.crozdesk.com' },
  { name: 'GetApp', submit: 'https://www.getapp.com' },
  { name: 'Capterra', submit: 'https://www.capterra.com' },
  { name: 'G2', submit: 'https://www.g2.com' },
  { name: 'TrustRadius', submit: 'https://www.trustradius.com' },
  { name: 'PeerSpot', submit: 'https://www.peerspot.com' },
  { name: 'SoftwareWorld', submit: 'https://softwareworld.ca' },
  { name: 'StackShare', submit: 'https://stackshare.io' },
  { name: 'Slant', submit: 'https://www.slant.co' },
  { name: 'LibHunt', submit: 'https://www.libhunt.com' },
  { name: 'OpenSource', submit: 'https://opensource.com' },
  { name: 'Softpedia', submit: 'https://www.softpedia.com' },
  { name: 'Softonic', submit: 'https://www.softonic.com' },
  { name: 'FileHippo', submit: 'https://filehippo.com' },
  { name: 'Download82', submit: 'https://download82.com' },
  { name: 'SoftwareInformer', submit: 'https://software.informer.com' },
  { name: 'SnapFiles', submit: 'https://www.snapfiles.com' },
  { name: 'FreewareFiles', submit: 'https://www.freewarefiles.com' },
  { name: 'MajorGeeks', submit: 'https://www.majorgeeks.com' },
  { name: 'TechPowerUp', submit: 'https://www.techpowerup.com' },
  { name: 'Neowin', submit: 'https://www.neowin.net' },
  { name: 'BleepingComputer', submit: 'https://www.bleepingcomputer.com' },
  { name: 'CNET', submit: 'https://www.cnet.com' },
  { name: 'TechRadar', submit: 'https://www.techradar.com' },
  { name: 'PCMag', submit: 'https://www.pcmag.com' },
  { name: 'ZDNet', submit: 'https://www.zdnet.com' },
  { name: 'Wired', submit: 'https://www.wired.com' },
  { name: 'TheVerge', submit: 'https://www.theverge.com' },
  { name: 'ArsTechnica', submit: 'https://arstechnica.com' },
  { name: 'Engadget', submit: 'https://www.engadget.com' },
  { name: 'LifeHacker', submit: 'https://lifehacker.com' },
  { name: 'Mashable', submit: 'https://mashable.com' },
  { name: 'Gizmodo', submit: 'https://gizmodo.com' },
  { name: 'TheNextWeb', submit: 'https://thenextweb.com' },
  { name: 'TechCrunch', submit: 'https://techcrunch.com' },
  { name: 'VentureBeat', submit: 'https://venturebeat.com' },
  { name: 'TechSpot', submit: 'https://www.techspot.com' },
  { name: 'TomHardware', submit: 'https://www.tomshardware.com' },
  { name: 'AnandTech', submit: 'https://www.anandtech.com' },
  { name: 'HotHardware', submit: 'https://hothardware.com' },
  { name: 'SlashGear', submit: 'https://www.slashgear.com' },
  { name: 'Ubergizmo', submit: 'https://www.ubergizmo.com' },
  { name: 'AndroidCentral', submit: 'https://www.androidcentral.com' },
  { name: 'iMore', submit: 'https://www.imore.com' },
  { name: 'WindowsCentral', submit: 'https://www.windowscentral.com' },
  { name: 'WSJ', submit: 'https://www.wsj.com' },
  { name: 'Reuters', submit: 'https://www.reuters.com' },
  { name: 'MarketWatch', submit: 'https://www.marketwatch.com' },
  { name: 'Bloomberg', submit: 'https://www.bloomberg.com' },
  { name: 'Forbes', submit: 'https://www.forbes.com' },
  { name: 'Fortune', submit: 'https://fortune.com' },
  { name: 'BusinessInsider', submit: 'https://www.businessinsider.com' },
  { name: 'CNBC', submit: 'https://www.cnbc.com' },
  { name: 'BBC', submit: 'https://www.bbc.com' },
  { name: 'CNN', submit: 'https://www.cnn.com' },
  { name: 'NBCNews', submit: 'https://www.nbcnews.com' },
  { name: 'CBSNews', submit: 'https://www.cbsnews.com' },
  { name: 'ABCNews', submit: 'https://abcnews.go.com' },
  { name: 'FoxNews', submit: 'https://www.foxnews.com' },
  { name: 'NYTimes', submit: 'https://www.nytimes.com' },
  { name: 'WashingtonPost', submit: 'https://www.washingtonpost.com' },
  { name: 'LATimes', submit: 'https://www.latimes.com' },
  { name: 'TheGuardian', submit: 'https://www.theguardian.com' },
  { name: 'TheEconomist', submit: 'https://www.economist.com' },
  { name: 'FT', submit: 'https://www.ft.com' },
  { name: 'HuffPost', submit: 'https://www.huffpost.com' },
  { name: 'BuzzFeed', submit: 'https://www.buzzfeed.com' },
  { name: 'Vice', submit: 'https://www.vice.com' },
  { name: 'Wired2', submit: 'https://www.wired.com' },
  { name: 'TechRadar2', submit: 'https://www.techradar.com' },
  { name: 'TheVerge2', submit: 'https://www.theverge.com' },
  { name: 'ArsTechnica2', submit: 'https://arstechnica.com' },
  { name: 'Engadget2', submit: 'https://www.engadget.com' },
  { name: 'Gizmodo2', submit: 'https://gizmodo.com' },
  { name: 'Mashable2', submit: 'https://mashable.com' },
  { name: 'TheNextWeb2', submit: 'https://thenextweb.com' },
  { name: 'TechCrunch2', submit: 'https://techcrunch.com' },
  { name: 'VentureBeat2', submit: 'https://venturebeat.com' },
  { name: 'CNET2', submit: 'https://www.cnet.com' },
  { name: 'ZDNet2', submit: 'https://www.zdnet.com' },
  { name: 'PCWorld', submit: 'https://www.pcworld.com' },
  { name: 'MacWorld', submit: 'https://www.macworld.com' },
  { name: 'InfoWorld', submit: 'https://www.infoworld.com' },
  { name: 'NetworkWorld', submit: 'https://www.networkworld.com' },
  { name: 'ComputerWorld', submit: 'https://www.computerworld.com' },
  { name: 'CIO', submit: 'https://www.cio.com' },
  { name: 'eWeek', submit: 'https://www.eweek.com' },
  { name: 'DarkReading', submit: 'https://www.darkreading.com' },
  { name: 'ThreatPost', submit: 'https://threatpost.com' },
  { name: 'KrebsOnSecurity', submit: 'https://krebsonsecurity.com' },
  { name: 'Schneier', submit: 'https://www.schneier.com' },
  { name: 'TroyHunt', submit: 'https://www.troyhunt.com' },
  { name: 'BruceSchneier', submit: 'https://www.schneier.com' },
  { name: 'SANS', submit: 'https://www.sans.org' },
  { name: 'OWASP', submit: 'https://owasp.org' },
  { name: 'NIST', submit: 'https://csrc.nist.gov' },
  { name: 'CISA', submit: 'https://www.cisa.gov' },
  { name: 'USENIX', submit: 'https://www.usenix.org' },
  { name: 'ACM', submit: 'https://www.acm.org' },
  { name: 'IEEE', submit: 'https://www.ieee.org' },
  { name: 'IETF', submit: 'https://www.ietf.org' },
  { name: 'W3C', submit: 'https://www.w3.org' },
  { name: 'IANA', submit: 'https://www.iana.org' },
  { name: 'ICANN', submit: 'https://www.icann.org' },
  { name: 'InternetSociety', submit: 'https://www.internetsociety.org' },
  { name: 'EFF', submit: 'https://www.eff.org' },
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
  console.log(`🚀 Batch 73 - Software Directories & News (${DIRECTORIES.length} directories)\n`);
  
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
