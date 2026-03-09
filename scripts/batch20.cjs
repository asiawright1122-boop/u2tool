const https = require('https');

const DIRECTORIES = [
  { name: 'XML sitemap', submit: 'https://www.xml-sitemap.com/submit' },
  { name: 'FreeSubmit', submit: 'https://www.freesubmit.com/submit' },
  { name: 'WorldDirectory', submit: 'https://www.worlddirectory.info/submit' },
  { name: 'BestDirectory', submit: 'https://www.bestdirectory.info/submit' },
  { name: 'TopDirectory', submit: 'https://www.topdirectory.com/submit' },
  { name: 'SiteDiri', submit: 'https://www.sitediri.com/submit' },
  { name: 'AddTo', submit: 'https://addto.org/submit' },
  { name: 'URL opaque', submit: 'https://urlopener.com/submit' },
  { name: 'Link centre', submit: 'https://www.linkcentre.com/submit' },
  { name: 'DirBusiness', submit: 'https://www.dirbusiness.com/submit' },
  { name: 'Hot vs', submit: 'https://www.hotvsnot.com/submit' },
  { name: 'Gimpsy', submit: 'https://www.gimpsy.com/submit' },
  { name: 'Zoommatcher', submit: 'https://www.zoommatcher.com/submit' },
  { name: 'A1WebDirectory', submit: 'https://www.a1webdirectory.org/submit' },
  { name: 'JustDir', submit: 'https://www.justdir.info/submit' },
  { name: 'WebDir', submit: 'https://www.webdir.net/submit' },
  { name: 'DirCont', submit: 'https://www.dircont.com/submit' },
  { name: 'Dir365', submit: 'https://dir365.co/submit' },
  { name: 'DirList', submit: 'https://dirlist.net/submit' },
  { name: 'DirIC', submit: 'https://dir.ic/submit' },
  { name: 'AllSubmitter', submit: 'https://www.all-submitter.com/submit' },
  { name: 'FreeWebDir', submit: 'https://www.freewebdir.org/submit' },
  { name: 'AddSiteFree', submit: 'https://www.addsitefree.com/submit' },
  { name: 'SublimeWeb', submit: 'https://www.sublimeweb.com/submit' },
  { name: 'Add URL Online', submit: 'https://www.addurlonline.com/submit' },
  { name: 'SEO Directories', submit: 'https://www.seo-directories.com/submit' },
  { name: 'WebIndex', submit: 'https://webindex.globred.com/submit' },
  { name: 'TopGradeDirs', submit: 'https://www.topgradedirs.com/submit' },
  { name: 'URL Submissions', submit: 'https://www.urlsubmissions.net/submit' },
  { name: 'PrimeLinks', submit: 'https://www.primelinks.net/submit' },
  { name: 'LinksAlpha', submit: 'https://www.linksalpha.com/submit' },
  { name: 'LinkMachine', submit: 'https://www.linkmachine.com/submit' },
  { name: 'SubmitWiz', submit: 'https://www.submitwiz.com/submit' },
  { name: 'WebMaster', submit: 'https://www.webmaster.com/submit' },
  { name: 'SEO Auto', submit: 'https://www.seo-auto.com/submit' },
  { name: 'AutoSubmit', submit: 'https://www.autosubmit.com/submit' },
  { name: 'URLSubmit', submit: 'https://www.urlsubmit.net/submit' },
  { name: 'FastSub', submit: 'https://www.fastsub.com/submit' },
  { name: 'SubmitEdge', submit: 'https://www.submitedge.com/submit' },
  { name: 'SubmitHere', submit: 'https://www.submithere.com/submit' },
  { name: 'AddLink', submit: 'https://www.addlink.com/submit' },
  { name: 'LinkAdd', submit: 'https://www.linkadd.com/submit' },
  { name: 'SubmitHub', submit: 'https://www.submithub.com/submit' },
  { name: 'FreeLinks', submit: 'https://www.freelinks.com/submit' },
  { name: 'LinkLand', submit: 'https://www.linkland.com/submit' },
  { name: 'SubmitIt', submit: 'https://www.submitit.com/submit' },
  { name: 'AddURL net', submit: 'https://www.addurl.net/submit' },
  { name: 'DirectoryFree', submit: 'https://www.directoryfree.com/submit' },
  { name: 'W3Dir', submit: 'https://w3dir.com/submit' },
  { name: 'DirList org', submit: 'https://dirlist.org/submit' },
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
  console.log(`🚀 Batch 20 - Web Directories (${DIRECTORIES.length} directories)\n`);
  
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
