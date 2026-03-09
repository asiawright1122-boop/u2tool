const https = require('https');

const DIRECTORIES = [
  { name: 'Figma', submit: 'https://www.figma.com' },
  { name: 'Sketch', submit: 'https://www.sketch.com' },
  { name: 'AdobeXD', submit: 'https://www.adobe.com/products/xd' },
  { name: 'InVision', submit: 'https://www.invisionapp.com' },
  { name: 'Framer', submit: 'https://www.framer.com' },
  { name: 'Principle', submit: 'https://principleformac.com' },
  { name: 'ProtoPie', submit: 'https://www.protopie.io' },
  { name: 'Origami', submit: 'https://origami.design' },
  { name: 'Form', submit: 'https://www.relativewave.com/forms' },
  { name: 'Pixate', submit: 'https://www.pixate.com' },
  { name: 'Fluid', submit: 'https://www.fluidui.com' },
  { name: 'Marvel', submit: 'https://marvelapp.com' },
  { name: 'InVisionStudio', submit: 'https://www.invisionapp.com/studio' },
  { name: 'Zeplin', submit: 'https://zeplin.io' },
  { name: 'Avocode', submit: 'https://avocode.com' },
  { name: 'Figma2', submit: 'https://www.figma.com' },
  { name: 'Excalidraw', submit: 'https://excalidraw.com' },
  { name: 'Miro', submit: 'https://miro.com' },
  { name: 'Mural', submit: 'https://www.mural.co' },
  { name: 'Lucidchart', submit: 'https://www.lucidchart.com' },
  { name: 'Draw.io', submit: 'https://draw.io' },
  { name: 'Creately', submit: 'https://creately.com' },
  { name: 'Cacoo', submit: 'https://cacoo.com' },
  { name: 'Gliffy', submit: 'https://www.gliffy.com' },
  { name: 'Balsamiq', submit: 'https://balsamiq.com' },
  { name: 'Mockflow', submit: 'https://www.mockflow.com' },
  { name: 'MockupBuilder', submit: 'https://mockupbuilder.com' },
  { name: 'HotGloo', submit: 'https://www.hotgloo.com' },
  { name: 'JustInMind', submit: 'https://www.justinmind.com' },
  { name: 'Axure', submit: 'https://www.axure.com' },
  { name: 'WireframePro', submit: 'https://wireframepro.invisionapp.com' },
  { name: 'Bolt', submit: 'https://www.bolt.com' },
  { name: 'UXPin', submit: 'https://www.uxpin.com' },
  { name: 'WebFlow', submit: 'https://webflow.com' },
  { name: 'Squarespace', submit: 'https://www.squarespace.com' },
  { name: 'Wix', submit: 'https://www.wix.com' },
  { name: 'Weebly', submit: 'https://www.weebly.com' },
  { name: 'Carrd', submit: 'https://carrd.co' },
  { name: 'Readymag', submit: 'https://readymag.com' },
  { name: 'Format', submit: 'https://format.com' },
  { name: 'Duda', submit: 'https://www.duda.co' },
  { name: 'Site123', submit: 'https://www.site123.com' },
  { name: 'Weblium', submit: 'https://weblium.com' },
  { name: 'Tilda', submit: 'https://tilda.cc' },
  { name: 'Ucraft', submit: 'https://www.ucraft.com' },
  { name: 'PageCloud', submit: 'https://www.pagecloud.com' },
  { name: 'Strikingly', submit: 'https://strikingly.com' },
  { name: 'ZohoSites', submit: 'https://www.zoho.com/sites' },
  { name: 'GoogleSites', submit: 'https://sites.google.com' },
  { name: 'Notion', submit: 'https://www.notion.so' },
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
  console.log(`🚀 Batch 35 - Design & Website Builders (${DIRECTORIES.length} directories)\n`);
  
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
