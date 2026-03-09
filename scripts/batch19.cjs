const https = require('https');

const DIRECTORIES = [
  { name: 'ProductHunt', submit: 'https://www.producthunt.com/posts/new' },
  { name: 'Crozdesk', submit: 'https://www.crozdesk.com/submit' },
  { name: 'SaaSGroups', submit: 'https://saasgroups.com/submit' },
  { name: 'Stackshare', submit: 'https://stackshare.io/submit' },
  { name: 'GitHub3', submit: 'https://github.com/settings/entries/new' },
  { name: 'AlternativeTo2', submit: 'https://alternativeto.net/software/u2tool/' },
  { name: 'Slant', submit: 'https://www.slant.co/submit' },
  { name: 'SaaSHub', submit: 'https://www.saashub.com/submit-product' },
  { name: 'GetApp', submit: 'https://www.getapp.com/submit' },
  { name: 'Capterra2', submit: 'https://www.capterra.com/submit' },
  { name: 'G2Stack', submit: 'https://www.g2.com/products/u2tool/write-review' },
  { name: 'TrustRadius', submit: 'https://www.trustradius.com/products/u2tool/write-review' },
  { name: 'Featuredc', submit: 'https://featuredc.com/submit' },
  { name: 'SaaSOptics', submit: 'https://www.saasoptics.com/submit' },
  { name: 'Vendr', submit: 'https://vendr.com/submit' },
  { name: 'Crozdesk2', submit: 'https://www.crozdesk.com/software/u2tool' },
  { name: 'StackCite', submit: 'https://stackcite.com/submit' },
  { name: 'DevTo3', submit: 'https://dev.to/spots' },
  { name: 'IndieHackers2', submit: 'https://www.indiehackers.com/post' },
  { name: 'HackerNews2', submit: 'https://news.ycombinator.com/submit' },
  { name: 'Reddit3', submit: 'https://www.reddit.com/r/software/submit' },
  { name: 'BetaList', submit: 'https://betalist.com/submit' },
  { name: 'LaunchingNext', submit: 'https://www.launchingnext.com/submit/' },
  { name: 'ProductPad', submit: 'https://productpad.io/submit' },
  { name: 'AppSumo2', submit: 'https://appsumo.com/submit-product/' },
  { name: 'Stacker', submit: 'https://stacker.com/submit' },
  { name: 'SoftwareWorld', submit: 'https://softwareworld.ca/submit' },
  { name: 'Techreviewer', submit: 'https://techreviewer.co/submit' },
  { name: 'PeerSpot2', submit: 'https://www.peerspot.com/products/u2tool/write_review' },
  { name: 'ITCentralStation', submit: 'https://www.itcentralstation.com/products/u2tool/write_review' },
  { name: 'TrustCloud', submit: 'https://www.trustcloud.com/submit' },
  { name: 'RatingSystem', submit: 'https://www.ratingsystem.info/submit' },
  { name: 'RateYourStack', submit: 'https://rateyourstack.com/submit' },
  { name: 'StackerNews', submit: 'https://stacker.news/submit' },
  { name: 'Lobsters', submit: 'https://lobste.rs/submit' },
  { name: 'Lemmy', submit: 'https://lemmy.world/submit' },
  { name: 'Tchno', submit: 'https://tchno.org/submit' },
  { name: 'Techs', submit: 'https://techs.org/submit' },
  { name: 'DirWiz', submit: 'https://dirwiz.com/submit' },
  { name: 'WebWiki', submit: 'https://webwiki.com/submit' },
  { name: 'URLDir', submit: 'https://urldir.org/submit' },
  { name: 'AddSite', submit: 'https://www.addsite.info/submit' },
  { name: 'SubmitSite', submit: 'https://www.submitsiteweb.com/submit' },
  { name: 'FreeSiteSubmit', submit: 'https://www.freesitesubmit.com/submit' },
  { name: 'AddURL', submit: 'https://www.addurl.org/submit' },
  { name: 'SubmitURL', submit: 'https://www.submit-url.com/submit' },
  { name: 'SubmitLink', submit: 'https://www.submitlink.org/submit' },
  { name: 'DirMania', submit: 'https://www.dirmania.com/submit' },
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
        const success = ['thank', 'success', 'submitted', 'received', 'added', 'created', 'thank you', 'published'].some(k => body.toLowerCase().includes(k));
        resolve(success ? '✅' : '❌');
      });
    });

    req.on('error', () => resolve('❌'));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log(`🚀 Batch 19 - Software & Tools (${DIRECTORIES.length} directories)\n`);
  
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
