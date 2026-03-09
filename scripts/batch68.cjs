const https = require('https');

const DIRECTORIES = [
  { name: 'FontAwesome', submit: 'https://fontawesome.com' },
  { name: 'FontAwesome2', submit: 'https://fontawesome.com/icons' },
  { name: 'GoogleFonts', submit: 'https://fonts.google.com' },
  { name: 'GoogleFonts2', submit: 'https://fonts.google.com/icons' },
  { name: 'AdobeFonts', submit: 'https://fonts.adobe.com' },
  { name: 'AdobeFonts2', submit: 'https://fonts.adobe.com/typefoundry' },
  { name: 'FontSpace', submit: 'https://www.fontspace.com' },
  { name: 'FontSpace2', submit: 'https://www.fontspace.com/font' },
  { name: 'Dafont', submit: 'https://www.dafont.com' },
  { name: 'Dafont2', submit: 'https://www.dafont.com/font' },
  { name: '1001Fonts', submit: 'https://www.1001fonts.com' },
  { name: '1001Fonts2', submit: 'https://www.1001fonts.com/fonts' },
  { name: 'FontSquirrel', submit: 'https://www.fontsquirrel.com' },
  { name: 'FontSquirrel2', submit: 'https://www.fontsquirrel.com/fonts' },
  { name: 'MyFonts', submit: 'https://www.myfonts.com' },
  { name: 'MyFonts2', submit: 'https://www.myfonts.com/fonts' },
  { name: 'Typekit', submit: 'https://fonts.adobe.com/typekit' },
  { name: 'Typekit2', submit: 'https://fonts.adobe.com/typekit' },
  { name: 'Fontdeck', submit: 'https://fontdeck.com' },
  { name: 'Fontdeck2', submit: 'https://fontdeck.com/fonts' },
  { name: 'WebINK', submit: 'https://www.webink.com' },
  { name: 'WebINK2', submit: 'https://www.webink.com/fonts' },
  { name: 'TypeFront', submit: 'https://typefront.com' },
  { name: 'TypeFront2', submit: 'https://typefront.com/fonts' },
  { name: 'Fontspring', submit: 'https://www.fontspring.com' },
  { name: 'Fontspring2', submit: 'https://www.fontspring.com/fonts' },
  { name: 'Designcuts', submit: 'https://www.designcuts.com' },
  { name: 'Designcuts2', submit: 'https://www.designcuts.com/fonts' },
  { name: 'CreativeMarket', submit: 'https://creativemarket.com' },
  { name: 'CreativeMarket2', submit: 'https://creativemarket.com/fonts' },
  { name: 'Envato', submit: 'https://envato.com' },
  { name: 'Envato2', submit: 'https://envato.com/marketplace' },
  { name: 'ThemeForest', submit: 'https://themeforest.net' },
  { name: 'ThemeForest2', submit: 'https://themeforest.net/category' },
  { name: 'CodeCanyon', submit: 'https://codecanyon.net' },
  { name: 'CodeCanyon2', submit: 'https://codecanyon.net/category' },
  { name: 'GraphicRiver', submit: 'https://graphicriver.net' },
  { name: 'GraphicRiver2', submit: 'https://graphicriver.net/category' },
  { name: 'AudioJungle', submit: 'https://audiojungle.net' },
  { name: 'AudioJungle2', submit: 'https://audiojungle.net/category' },
  { name: 'VideoHive', submit: 'https://videohive.net' },
  { name: 'VideoHive2', submit: 'https://videohive.net/category' },
  { name: 'PhotoDune', submit: 'https://photodune.net' },
  { name: 'PhotoDune2', submit: 'https://photodune.net/category' },
  { name: '3DOcean', submit: 'https://3docean.net' },
  { name: '3DOcean2', submit: 'https://3docean.net/category' },
  { name: 'ShapeStock', submit: 'https://shapestock.com' },
  { name: 'ShapeStock2', submit: 'https://shapestock.com/shapes' },
  { name: 'Illustration', submit: 'https://illustration.net' },
  { name: 'Illustration2', submit: 'https://illustration.net/illustrations' },
  { name: 'Unsplash', submit: 'https://unsplash.com' },
  { name: 'Unsplash2', submit: 'https://unsplash.com/photos' },
  { name: 'Pexels', submit: 'https://www.pexels.com' },
  { name: 'Pexels2', submit: 'https://www.pexels.com/photo' },
  { name: 'Pixabay', submit: 'https://pixabay.com' },
  { name: 'Pixabay2', submit: 'https://pixabay.com/images' },
  { name: 'Flickr', submit: 'https://www.flickr.com' },
  { name: 'Flickr2', submit: 'https://www.flickr.com/explore' },
  { name: 'Pinterest', submit: 'https://www.pinterest.com' },
  { name: 'Pinterest2', submit: 'https://www.pinterest.com/ideas' },
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
  console.log(`🚀 Batch 68 - Fonts & Stock Assets (${DIRECTORIES.length} directories)\n`);
  
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
