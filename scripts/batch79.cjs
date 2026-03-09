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
  { name: 'StackShare', submit: 'https://stackshare.io' },
  { name: 'Slant', submit: 'https://www.slant.co' },
  { name: 'LibHunt', submit: 'https://www.libhunt.com' },
  { name: 'OpenSource', submit: 'https://opensource.com' },
  { name: 'Softpedia', submit: 'https://www.softpedia.com' },
  { name: 'Softonic', submit: 'https://www.softonic.com' },
  { name: 'FileHippo', submit: 'https://filehippo.com' },
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
  { name: 'SANS', submit: 'https://www.sans.org' },
  { name: 'OWASP', submit: 'https://owasp.org' },
  { name: 'NIST', submit: 'https://csrc.nist.gov' },
  { name: 'CISA', submit: 'https://www.cisa.gov' },
  { name: 'EFF', submit: 'https://www.eff.org' },
  { name: 'Wikipedia', submit: 'https://en.wikipedia.org' },
  { name: 'Wikidata', submit: 'https://www.wikidata.org' },
  { name: 'WikiMedia', submit: 'https://commons.wikimedia.org' },
  { name: 'StackOverflow', submit: 'https://stackoverflow.com' },
  { name: 'ServerFault', submit: 'https://serverfault.com' },
  { name: 'SuperUser', submit: 'https://superuser.com' },
  { name: 'AskUbuntu', submit: 'https://askubuntu.com' },
  { name: 'HackerNews', submit: 'https://news.ycombinator.com' },
  { name: 'Lobsters', submit: 'https://lobste.rs' },
  { name: 'RedditDev', submit: 'https://www.reddit.com/r/webdev' },
  { name: 'RedditJS', submit: 'https://www.reddit.com/r/javascript' },
  { name: 'RedditProg', submit: 'https://www.reddit.com/r/programming' },
  { name: 'DEV', submit: 'https://dev.to' },
  { name: 'Hashnode', submit: 'https://hashnode.com' },
  { name: 'CodinGame', submit: 'https://www.codingame.com' },
  { name: 'CodeProject', submit: 'https://www.codeproject.com' },
  { name: 'DZone', submit: 'https://dzone.com' },
  { name: 'SitePoint', submit: 'https://www.sitepoint.com' },
  { name: 'IndieHackers', submit: 'https://www.indiehackers.com' },
  { name: 'ProductHunt2', submit: 'https://www.producthunt.com/topics' },
  { name: 'BetaList2', submit: 'https://betalist.com/submit' },
  { name: 'AlternativeTo2', submit: 'https://alternativeto.net/software/u2tool' },
  { name: 'StackShare2', submit: 'https://stackshare.io/submit' },
  { name: 'Slant2', submit: 'https://www.slant.co/submit' },
  { name: 'LibHunt2', submit: 'https://www.libhunt.com/submit' },
  { name: 'Softpedia2', submit: 'https://www.softpedia.com/submit' },
  { name: 'TechCrunch2', submit: 'https://techcrunch.com/submit' },
  { name: 'TheVerge2', submit: 'https://www.theverge.com/submit' },
  { name: 'Wired2', submit: 'https://www.wired.com/submit' },
  { name: 'Gizmodo2', submit: 'https://gizmodo.com/submit' },
  { name: 'Mashable2', submit: 'https://mashable.com/submit' },
  { name: 'Engadget2', submit: 'https://www.engadget.com/submit' },
  { name: 'ArsTechnica2', submit: 'https://arstechnica.com/submit' },
  { name: 'LifeHacker2', submit: 'https://lifehacker.com/submit' },
  { name: 'Neowin2', submit: 'https://www.neowin.net/submit' },
  { name: 'CNET2', submit: 'https://www.cnet.com/submit' },
  { name: 'ZDNet2', submit: 'https://www.zdnet.com/submit' },
  { name: 'PCWorld2', submit: 'https://www.pcworld.com/submit' },
  { name: 'PCMag2', submit: 'https://www.pcmag.com/submit' },
  { name: 'TechRadar2', submit: 'https://www.techradar.com/submit' },
  { name: 'W3Schools', submit: 'https://www.w3schools.com' },
  { name: 'MDN', submit: 'https://developer.mozilla.org' },
  { name: 'TutorialPoint', submit: 'https://www.tutorialspoint.com' },
  { name: 'GeeksforGeeks', submit: 'https://www.geeksforgeeks.org' },
  { name: 'FreeCodeCamp', submit: 'https://www.freecodecamp.org' },
  { name: 'Codecademy', submit: 'https://www.codecademy.com' },
  { name: 'Udemy', submit: 'https://www.udemy.com' },
  { name: 'Coursera', submit: 'https://www.coursera.org' },
  { name: 'edX', submit: 'https://www.edx.org' },
  { name: 'Pluralsight', submit: 'https://www.pluralsight.com' },
  { name: 'Treehouse', submit: 'https://teamtreehouse.com' },
  { name: 'Scrimba', submit: 'https://scrimba.com' },
  { name: 'FrontendMasters', submit: 'https://frontendmasters.com' },
  { name: 'JavaScriptInfo', submit: 'https://javascript.info' },
  { name: 'CSSTricks', submit: 'https://css-tricks.com' },
  { name: 'DevDocs', submit: 'https://devdocs.io' },
  { name: 'Scotch', submit: 'https://scotch.io' },
  { name: 'OverReacted', submit: 'https://overreacted.io' },
  { name: 'KentCDodds', submit: 'https://kentcdodds.com' },
  { name: 'WebDevSimplified', submit: 'https://blog.webdevsimplified.com' },
  { name: 'TraversyMedia', submit: 'https://www.traversymedia.com' },
  { name: 'NetNinja', submit: 'https://www.thenetninja.co.uk' },
  { name: 'Academind', submit: 'https://academind.com' },
  { name: 'Codedamn', submit: 'https://codedamn.com' },
  { name: 'Scaler', submit: 'https://www.scaler.com' },
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
  console.log(`🚀 Batch 79 - Directories, News & Learning (${DIRECTORIES.length} directories)\n`);
  
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
