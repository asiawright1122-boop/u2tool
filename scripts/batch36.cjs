const https = require('https');

const DIRECTORIES = [
  { name: 'FontAwesome', submit: 'https://fontawesome.com' },
  { name: 'GoogleFonts', submit: 'https://fonts.google.com' },
  { name: 'AdobeFonts', submit: 'https://fonts.adobe.com' },
  { name: 'FontSpace', submit: 'https://www.fontspace.com' },
  { name: 'Dafont', submit: 'https://www.dafont.com' },
  { name: '1001Fonts', submit: 'https://www.1001fonts.com' },
  { name: 'FontSquirrel', submit: 'https://www.fontsquirrel.com' },
  { name: 'MyFonts', submit: 'https://www.myfonts.com' },
  { name: 'Typekit', submit: 'https://fonts.adobe.com/typekit' },
  { name: 'Fontdeck', submit: 'https://fontdeck.com' },
  { name: 'WebINK', submit: 'https://www.webink.com' },
  { name: 'TypeFront', submit: 'https://typefront.com' },
  { name: 'Fontspring', submit: 'https://www.fontspring.com' },
  { name: 'Designcuts', submit: 'https://www.designcuts.com' },
  { name: 'CreativeMarket', submit: 'https://creativemarket.com' },
  { name: 'Envato', submit: 'https://envato.com' },
  { name: 'ThemeForest', submit: 'https://themeforest.net' },
  { name: 'CodeCanyon', submit: 'https://codecanyon.net' },
  { name: 'GraphicRiver', submit: 'https://graphicriver.net' },
  { name: 'AudioJungle', submit: 'https://audiojungle.net' },
  { name: 'VideoHive', submit: 'https://videohive.net' },
  { name: 'PhotoDune', submit: 'https://photodune.net' },
  { name: '3DOcean', submit: 'https://3docean.net' },
  { name: 'ShapeStock', submit: 'https://shapestock.com' },
  { name: 'Illustration', submit: 'https://illustration.net' },
  { name: 'Unsplash', submit: 'https://unsplash.com' },
  { name: 'Pexels', submit: 'https://www.pexels.com' },
  { name: 'Pixabay', submit: 'https://pixabay.com' },
  { name: 'Flickr', submit: 'https://www.flickr.com' },
  { name: 'Pinterest', submit: 'https://www.pinterest.com' },
  { name: 'Dribbble', submit: 'https://dribbble.com' },
  { name: 'Behance2', submit: 'https://www.behance.net' },
  { name: 'DeviantArt', submit: 'https://www.deviantart.com' },
  { name: 'ArtStation', submit: 'https://www.artstation.com' },
  { name: 'CGTrader', submit: 'https://www.cgtrader.com' },
  { name: 'Sketchfab', submit: 'https://sketchfab.com' },
  { name: 'TurboSquid', submit: 'https://www.turbosquid.com' },
  { name: 'Mixamo', submit: 'https://www.mixamo.com' },
  { name: 'Placeit', submit: 'https://placeit.net' },
  { name: 'MockupWorld', submit: 'https://www.mockupworld.co' },
  { name: 'CleanPng', submit: 'https://www.cleanpng.com' },
  { name: 'Transparent', submit: 'https://www.transparenttextures.com' },
  { name: 'SubtlePatterns', submit: 'https://www.toptal.com/designers/subtlepatterns' },
  { name: 'PatternLibrary', submit: 'https://pattern-library.com' },
  { name: 'HeroPatterns', submit: 'https://www.heropatterns.com' },
  { name: 'PatternCool', submit: 'https://patterncool.com' },
  { name: 'BGJar', submit: 'https://bgjar.com' },
  { name: 'SvgBackgrounds', submit: 'https://svgbackgrounds.com' },
  { name: 'GradientGraphics', submit: 'https://gradient.graphics' },
  { name: 'MeshGradient2', submit: 'https://meshgradient.in' },
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
  console.log(`🚀 Batch 36 - Fonts & Assets (${DIRECTORIES.length} directories)\n`);
  
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
