const https = require('https');

const DIRECTORIES = [
  { name: 'JSONPlaceholder', submit: 'https://jsonplaceholder.typicode.com' },
  { name: 'JSONPlaceholder2', submit: 'https://jsonplaceholder.typicode.com/posts' },
  { name: 'ReqRes', submit: 'https://reqres.in' },
  { name: 'HTTPBin', submit: 'https://httpbin.org' },
  { name: 'PublicAPIs', submit: 'https://public-apis.io' },
  { name: 'PublicAPIs2', submit: 'https://public-apis.xyz' },
  { name: 'APIsList', submit: 'https://apilist.fun' },
  { name: 'RapidAPI', submit: 'https://rapidapi.com' },
  { name: 'RapidAPI2', submit: 'https://rapidapi.com/collection' },
  { name: 'APIForThat', submit: 'https://www.apiforthat.com' },
  { name: 'APIGarden', submit: 'https://apiguardian.io' },
  { name: 'APIStack', submit: 'https://www.apistack.io' },
  { name: 'APISpace', submit: 'https://apispace.com' },
  { name: 'WebCodeTools', submit: 'https://webcode.tools' },
  { name: 'OnlineToolHub', submit: 'https://www.onlinetoolhub.com' },
  { name: 'Listly', submit: 'https://listly.io' },
  { name: 'DevToys', submit: 'https://devtoys.app' },
  { name: 'DevToys2', submit: 'https://devtoys.app/about' },
  { name: 'DevUtils', submit: 'https://devutils.com' },
  { name: 'Carbon', submit: 'https://carbon.now.sh' },
  { name: 'Carbon2', submit: 'https://carbon.now.sh/create' },
  { name: 'RaySo', submit: 'https://ray.so' },
  { name: 'RaySo2', submit: 'https://ray.so/colors' },
  { name: 'CSSGradient', submit: 'https://cssgradient.io' },
  { name: 'CSSGradient2', submit: 'https://cssgradient.io/gradients' },
  { name: 'CoolBackgrounds', submit: 'https://coolbackgrounds.io' },
  { name: 'Glassmorphism', submit: 'https://glassmorphism.com' },
  { name: 'Neumorphism', submit: 'https://neumorphism.io' },
  { name: 'ColorHunt', submit: 'https://www.colorhunt.co' },
  { name: 'ColorPalettes', submit: 'https://www.colorpalettes.com' },
  { name: 'AdobeColor', submit: 'https://color.adobe.com' },
  { name: 'Coolors', submit: 'https://coolors.co' },
  { name: 'Colormind', submit: 'http://colormind.io' },
  { name: 'GradientGenerator', submit: 'https://cssgradient.io/gradient-generator' },
  { name: 'WebGradients', submit: 'https://webgradients.com' },
  { name: 'UIGradients', submit: 'https://uigradients.com' },
  { name: 'CSSMatic', submit: 'https://www.cssmatic.com' },
  { name: 'BorderRadius', submit: 'https://9elements.github.io/fancy-border-radius' },
  { name: 'BlobMaker', submit: 'https://www.blobmaker.app' },
  { name: 'GetWaves', submit: 'https://getwaves.io' },
  { name: 'SVGMaker', submit: 'https://svgmaker.com' },
  { name: 'Haikei', submit: 'https://haikei.app' },
  { name: 'MeshGradient', submit: 'https://meshgradient.in' },
  { name: 'CSSFilters', submit: 'https://www.cssfilters.co' },
  { name: 'CubicBezier', submit: 'https://cubic-bezier.com' },
  { name: 'Easing', submit: 'https://easings.net' },
  { name: 'Animista', submit: 'https://animista.net' },
  { name: 'Keyframes', submit: 'https://keyframes.app' },
  { name: 'WaitAnimate', submit: 'https://waitanimate.westone.io' },
  { name: 'TransitionCSS', submit: 'https://www.transition-css.com' },
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
  console.log(`🚀 Batch 25 - Developer Tools & APIs (${DIRECTORIES.length} directories)\n`);
  
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
