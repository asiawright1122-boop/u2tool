const https = require('https');

const DIRECTORIES = [
  { name: 'Figma', submit: 'https://www.figma.com' },
  { name: 'Figma2', submit: 'https://www.figma.com/design' },
  { name: 'Sketch', submit: 'https://www.sketch.com' },
  { name: 'Sketch2', submit: 'https://www.sketch.com/vector-files' },
  { name: 'AdobeXD', submit: 'https://www.adobe.com/products/xd' },
  { name: 'AdobeXD2', submit: 'https://www.adobe.com/products/xd/features' },
  { name: 'InVision', submit: 'https://www.invisionapp.com' },
  { name: 'InVision2', submit: 'https://www.invisionapp.com/design' },
  { name: 'Framer', submit: 'https://www.framer.com' },
  { name: 'Framer2', submit: 'https://www.framer.com/design' },
  { name: 'Zeplin', submit: 'https://zeplin.io' },
  { name: 'Zeplin2', submit: 'https://zeplin.io/features' },
  { name: 'Avocode', submit: 'https://avocode.com' },
  { name: 'Avocode2', submit: 'https://avocode.com/features' },
  { name: 'Excalidraw', submit: 'https://excalidraw.com' },
  { name: 'Excalidraw2', submit: 'https://excalidraw.com/features' },
  { name: 'Miro', submit: 'https://miro.com' },
  { name: 'Miro2', submit: 'https://miro.com/features' },
  { name: 'Mural', submit: 'https://www.mural.co' },
  { name: 'Mural2', submit: 'https://www.mural.co/features' },
  { name: 'Lucidchart', submit: 'https://www.lucidchart.com' },
  { name: 'Lucidchart2', submit: 'https://www.lucidchart.com/features' },
  { name: 'DrawIO', submit: 'https://draw.io' },
  { name: 'DrawIO2', submit: 'https://draw.io/features' },
  { name: 'Canva', submit: 'https://www.canva.com' },
  { name: 'Canva2', submit: 'https://www.canva.com/features' },
  { name: 'Visme', submit: 'https://www.visme.co' },
  { name: 'Visme2', submit: 'https://www.visme.co/features' },
  { name: 'Piktochart', submit: 'https://piktochart.com' },
  { name: 'Piktochart2', submit: 'https://piktochart.com/features' },
  { name: 'Venngage', submit: 'https://venngage.com' },
  { name: 'Venngage2', submit: 'https://venngage.com/features' },
  { name: 'Infogram', submit: 'https://infogram.com' },
  { name: 'Infogram2', submit: 'https://infogram.com/features' },
  { name: 'Prezi', submit: 'https://prezi.com' },
  { name: 'Prezi2', submit: 'https://prezi.com/features' },
  { name: 'SlidesCarnival', submit: 'https://www.slidescarnival.com' },
  { name: 'SlidesCarnival2', submit: 'https://www.slidescarnival.com/templates' },
  { name: 'GoogleSlides', submit: 'https://docs.google.com/presentation' },
  { name: 'GoogleSlides2', submit: 'https://docs.google.com/presentation/about' },
  { name: 'Dribbble', submit: 'https://dribbble.com' },
  { name: 'Dribbble2', submit: 'https://dribbble.com/shots' },
  { name: 'Behance', submit: 'https://www.behance.net' },
  { name: 'Behance2', submit: 'https://www.behance.net/galleries' },
  { name: 'DeviantArt', submit: 'https://www.deviantart.com' },
  { name: 'DeviantArt2', submit: 'https://www.deviantart.com/discover' },
  { name: 'ArtStation', submit: 'https://www.artstation.com' },
  { name: 'ArtStation2', submit: 'https://www.artstation.com/artworks' },
  { name: 'CGTrader', submit: 'https://www.cgtrader.com' },
  { name: 'CGTrader2', submit: 'https://www.cgtrader.com/3d-models' },
  { name: 'Sketchfab', submit: 'https://sketchfab.com' },
  { name: 'Sketchfab2', submit: 'https://sketchfab.com/3d-models' },
  { name: 'TurboSquid', submit: 'https://www.turbosquid.com' },
  { name: 'TurboSquid2', submit: 'https://www.turbosquid.com/3d-models' },
  { name: 'Mixamo', submit: 'https://www.mixamo.com' },
  { name: 'Mixamo2', submit: 'https://www.mixamo.com/characters' },
  { name: 'Placeit', submit: 'https://placeit.net' },
  { name: 'Placeit2', submit: 'https://placeit.net/mockups' },
  { name: 'MockupWorld', submit: 'https://www.mockupworld.co' },
  { name: 'MockupWorld2', submit: 'https://www.mockupworld.co/templates' },
  { name: 'CleanPng', submit: 'https://www.cleanpng.com' },
  { name: 'CleanPng2', submit: 'https://www.cleanpng.com/png' },
  { name: 'Transparent', submit: 'https://www.transparenttextures.com' },
  { name: 'Transparent2', submit: 'https://www.transparenttextures.com/patterns' },
  { name: 'SubtlePatterns', submit: 'https://www.toptal.com/designers/subtlepatterns' },
  { name: 'SubtlePatterns2', submit: 'https://www.toptal.com/designers/subtlepatterns/all' },
  { name: 'PatternLibrary', submit: 'https://pattern-library.com' },
  { name: 'PatternLibrary2', submit: 'https://pattern-library.com/patterns' },
  { name: 'HeroPatterns', submit: 'https://www.heropatterns.com' },
  { name: 'HeroPatterns2', submit: 'https://www.heropatterns.com/patterns' },
  { name: 'PatternCool', submit: 'https://patterncool.com' },
  { name: 'PatternCool2', submit: 'https://patterncool.com/patterns' },
  { name: 'BGJar', submit: 'https://bgjar.com' },
  { name: 'BGJar2', submit: 'https://bgjar.com/templates' },
  { name: 'SvgBackgrounds', submit: 'https://svgbackgrounds.com' },
  { name: 'SvgBackgrounds2', submit: 'https://svgbackgrounds.com/templates' },
  { name: 'GradientGraphics', submit: 'https://gradient.graphics' },
  { name: 'GradientGraphics2', submit: 'https://gradient.graphics/gradients' },
  { name: 'MeshGradient', submit: 'https://meshgradient.in' },
  { name: 'MeshGradient2', submit: 'https://meshgradient.in/gradients' },
  { name: 'ColorHunt', submit: 'https://www.colorhunt.co' },
  { name: 'ColorHunt2', submit: 'https://www.colorhunt.co/palettes' },
  { name: 'ColorPalettes', submit: 'https://www.colorpalettes.com' },
  { name: 'ColorPalettes2', submit: 'https://www.colorpalettes.com/palettes' },
  { name: 'AdobeColor', submit: 'https://color.adobe.com' },
  { name: 'AdobeColor2', submit: 'https://color.adobe.com/create/color-wheel' },
  { name: 'Coolors', submit: 'https://coolors.co' },
  { name: 'Coolors2', submit: 'https://coolors.co/palettes' },
  { name: 'Colormind', submit: 'http://colormind.io' },
  { name: 'Colormind2', submit: 'http://colormind.io/palettes' },
  { name: 'GradientGenerator', submit: 'https://cssgradient.io/gradient-generator' },
  { name: 'GradientGenerator2', submit: 'https://cssgradient.io/gradients' },
  { name: 'WebGradients', submit: 'https://webgradients.com' },
  { name: 'WebGradients2', submit: 'https://webgradients.com/index.php' },
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
  console.log(`🚀 Batch 67 - Design Assets & Tools (${DIRECTORIES.length} directories)\n`);
  
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
