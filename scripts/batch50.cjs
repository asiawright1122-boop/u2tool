const https = require('https');

const DIRECTORIES = [
  { name: 'Figma', submit: 'https://www.figma.com' },
  { name: 'Figma2', submit: 'https://www.figma.com/file/new' },
  { name: 'Sketch', submit: 'https://www.sketch.com' },
  { name: 'Sketch2', submit: 'https://www.sketch.com/new' },
  { name: 'AdobeXD', submit: 'https://www.adobe.com/products/xd' },
  { name: 'AdobeXD2', submit: 'https://www.adobe.com/products/xd/new' },
  { name: 'InVision', submit: 'https://www.invisionapp.com' },
  { name: 'InVision2', submit: 'https://www.invisionapp.com/new' },
  { name: 'Framer', submit: 'https://www.framer.com' },
  { name: 'Framer2', submit: 'https://www.framer.com/new' },
  { name: 'Zeplin', submit: 'https://zeplin.io' },
  { name: 'Zeplin2', submit: 'https://zeplin.io/new' },
  { name: 'Avocode', submit: 'https://avocode.com' },
  { name: 'Avocode2', submit: 'https://avocode.com/new' },
  { name: 'Excalidraw', submit: 'https://excalidraw.com' },
  { name: 'Excalidraw2', submit: 'https://excalidraw.com/new' },
  { name: 'Miro', submit: 'https://miro.com' },
  { name: 'Miro2', submit: 'https://miro.com/new' },
  { name: 'Mural', submit: 'https://www.mural.co' },
  { name: 'Mural2', submit: 'https://www.mural.co/new' },
  { name: 'Lucidchart', submit: 'https://www.lucidchart.com' },
  { name: 'Lucidchart2', submit: 'https://www.lucidchart.com/new' },
  { name: 'DrawIO', submit: 'https://draw.io' },
  { name: 'DrawIO2', submit: 'https://draw.io/new' },
  { name: 'Canva', submit: 'https://www.canva.com' },
  { name: 'Canva2', submit: 'https://www.canva.com/new' },
  { name: 'Visme', submit: 'https://www.visme.co' },
  { name: 'Visme2', submit: 'https://www.visme.co/new' },
  { name: 'Piktochart', submit: 'https://piktochart.com' },
  { name: 'Piktochart2', submit: 'https://piktochart.com/new' },
  { name: 'Venngage', submit: 'https://venngage.com' },
  { name: 'Venngage2', submit: 'https://venngage.com/new' },
  { name: 'Infogram', submit: 'https://infogram.com' },
  { name: 'Infogram2', submit: 'https://infogram.com/new' },
  { name: 'Prezi', submit: 'https://prezi.com' },
  { name: 'Prezi2', submit: 'https://prezi.com/new' },
  { name: 'SlidesCarnival', submit: 'https://www.slidescarnival.com' },
  { name: 'SlidesCarnival2', submit: 'https://www.slidescarnival.com/new' },
  { name: 'GoogleSlides', submit: 'https://docs.google.com/presentation' },
  { name: 'GoogleSlides2', submit: 'https://docs.google.com/presentation/create' },
  { name: 'LinkedIn', submit: 'https://www.linkedin.com' },
  { name: 'LinkedIn2', submit: 'https://www.linkedin.com/submit' },
  { name: 'Twitter', submit: 'https://twitter.com' },
  { name: 'Twitter2', submit: 'https://twitter.com/i/flow/signup' },
  { name: 'Facebook', submit: 'https://www.facebook.com' },
  { name: 'Facebook2', submit: 'https://www.facebook.com/submit' },
  { name: 'Instagram', submit: 'https://www.instagram.com' },
  { name: 'Instagram2', submit: 'https://www.instagram.com/submit' },
  { name: 'YouTube', submit: 'https://www.youtube.com' },
  { name: 'YouTube2', submit: 'https://www.youtube.com/submit' },
  { name: 'Dribbble', submit: 'https://dribbble.com' },
  { name: 'Dribbble2', submit: 'https://dribbble.com/signup' },
  { name: 'Behance', submit: 'https://www.behance.net' },
  { name: 'Behance2', submit: 'https://www.behance.net/submit' },
  { name: 'DeviantArt', submit: 'https://www.deviantart.com' },
  { name: 'DeviantArt2', submit: 'https://www.deviantart.com/submit' },
  { name: 'ArtStation', submit: 'https://www.artstation.com' },
  { name: 'ArtStation2', submit: 'https://www.artstation.com/submit' },
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
  console.log(`🚀 Batch 50 - Design & Social Media (${DIRECTORIES.length} directories)\n`);
  
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
