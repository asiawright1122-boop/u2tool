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
  { name: 'Marvel', submit: 'https://marvelapp.com' },
  { name: 'Zeplin', submit: 'https://zeplin.io' },
  { name: 'Avocode', submit: 'https://avocode.com' },
  { name: 'Excalidraw', submit: 'https://excalidraw.com' },
  { name: 'Miro', submit: 'https://miro.com' },
  { name: 'Mural', submit: 'https://www.mural.co' },
  { name: 'Lucidchart', submit: 'https://www.lucidchart.com' },
  { name: 'DrawIO', submit: 'https://draw.io' },
  { name: 'Canva', submit: 'https://www.canva.com' },
  { name: 'Visme', submit: 'https://www.visme.co' },
  { name: 'Piktochart', submit: 'https://piktochart.com' },
  { name: 'Venngage', submit: 'https://venngage.com' },
  { name: 'Infogram', submit: 'https://infogram.com' },
  { name: 'Prezi', submit: 'https://prezi.com' },
  { name: 'SlidesCarnival', submit: 'https://www.slidescarnival.com' },
  { name: 'Dribbble', submit: 'https://dribbble.com' },
  { name: 'Behance', submit: 'https://www.behance.net' },
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
  { name: 'HeroPatterns', submit: 'https://www.heropatterns.com' },
  { name: 'ColorHunt', submit: 'https://www.colorhunt.co' },
  { name: 'AdobeColor', submit: 'https://color.adobe.com' },
  { name: 'Coolors', submit: 'https://coolors.co' },
  { name: 'Colormind', submit: 'http://colormind.io' },
  { name: 'WebGradients', submit: 'https://webgradients.com' },
  { name: 'IconFinder', submit: 'https://www.iconfinder.com' },
  { name: 'Flaticon', submit: 'https://www.flaticon.com' },
  { name: 'Icons8', submit: 'https://icons8.com' },
  { name: 'NounProject', submit: 'https://thenounproject.com' },
  { name: 'BootstrapIcons', submit: 'https://icons.getbootstrap.com' },
  { name: 'Heroicons', submit: 'https://heroicons.com' },
  { name: 'FeatherIcons', submit: 'https://feathericons.com' },
  { name: 'Lucide', submit: 'https://lucide.dev' },
  { name: 'Phosphor', submit: 'https://phosphoricons.com' },
  { name: 'TablerIcons', submit: 'https://tabler-icons.io' },
  { name: 'RemixIcon', submit: 'https://remixicon.com' },
  { name: 'Boxicons', submit: 'https://boxicons.com' },
  { name: 'SimpleIcons', submit: 'https://simpleicons.org' },
  { name: 'FontAwesome', submit: 'https://fontawesome.com' },
  { name: 'GoogleFonts', submit: 'https://fonts.google.com' },
  { name: 'AdobeFonts', submit: 'https://fonts.adobe.com' },
  { name: 'FontSpace', submit: 'https://www.fontspace.com' },
  { name: 'Dafont', submit: 'https://www.dafont.com' },
  { name: '1001Fonts', submit: 'https://www.1001fonts.com' },
  { name: 'FontSquirrel', submit: 'https://www.fontsquirrel.com' },
  { name: 'MyFonts', submit: 'https://www.myfonts.com' },
  { name: 'Unsplash', submit: 'https://unsplash.com' },
  { name: 'Pexels', submit: 'https://www.pexels.com' },
  { name: 'Pixabay', submit: 'https://pixabay.com' },
  { name: 'Flickr', submit: 'https://www.flickr.com' },
  { name: 'PexelsVideo', submit: 'https://www.pexels.com/videos' },
  { name: 'Coverr', submit: 'https://coverr.co' },
  { name: 'Mixkit', submit: 'https://mixkit.co' },
  { name: 'Videvo', submit: 'https://www.videvo.net' },
  { name: 'Pond5', submit: 'https://www.pond5.com' },
  { name: 'Shutterstock', submit: 'https://www.shutterstock.com' },
  { name: 'GettyImages', submit: 'https://www.gettyimages.com' },
  { name: 'Freepik', submit: 'https://www.freepik.com' },
  { name: 'Vecteezy', submit: 'https://www.vecteezy.com' },
  { name: 'Flaticon2', submit: 'https://www.flaticon.com' },
  { name: 'Icon54', submit: 'https://www.icon54.com' },
  { name: 'Icons8', submit: 'https://icons8.com' },
  { name: 'NounProject', submit: 'https://thenounproject.com' },
  { name: 'TheNounProject', submit: 'https://thenounproject.com' },
  { name: 'WorldVectorLogo', submit: 'https://worldvectorlogo.com' },
  { name: 'LogoDev', submit: 'https://logo.dev' },
  { name: 'LogoStock', submit: 'https://www.logostock.com' },
  { name: 'FreeLogoDesign', submit: 'https://www.freelogodesign.org' },
  { name: 'CanvaLogo', submit: 'https://www.canva.com/logo-maker' },
  { name: 'DesignEvo', submit: 'https://www.designevo.com' },
  { name: 'LogoMaker', submit: 'https://logomaker.com' },
  { name: 'TailorBrands', submit: 'https://www.tailorbrands.com' },
  { name: 'Looka', submit: 'https://looka.com' },
  { name: 'BrandCrowd', submit: 'https://www.brandcrowd.com' },
  { name: 'Fiverr', submit: 'https://www.fiverr.com' },
  { name: 'Upwork', submit: 'https://www.upwork.com' },
  { name: 'Toptal', submit: 'https://www.toptal.com' },
  { name: '99designs', submit: 'https://99designs.com' },
  { name: 'DesignHill', submit: 'https://www.designhill.com' },
  { name: 'Crowdspring', submit: 'https://www.crowdspring.com' },
  { name: 'Krisp', submit: 'https://krisp.ai' },
  { name: 'Descript', submit: 'https://www.descript.com' },
  { name: 'Otter', submit: 'https://otter.ai' },
  { name: 'Rev', submit: 'https://www.rev.com' },
  { name: 'Temi', submit: 'https://temi.com' },
  { name: 'Sonix', submit: 'https://sonix.ai' },
  { name: 'Trint', submit: 'https://trint.com' },
  { name: 'HappyScribe', submit: 'https://www.happyscribe.com' },
  { name: 'GoTranscript', submit: 'https://gotranscript.com' },
  { name: 'TranscribeMe', submit: 'https://transcribeme.com' },
  { name: 'SpeechText', submit: 'https://speechtext.ai' },
  { name: 'Notta', submit: 'https://www.notta.com' },
  { name: 'Speecheasy', submit: 'https://speecheasy.ai' },
  { name: 'Voxrec', submit: 'https://voicemod.net' },
  { name: 'Woord', submit: 'https://getwoord.com' },
  { name: 'NaturalReader', submit: 'https://www.naturalreaders.com' },
  { name: 'ReadAloud', submit: 'https://readaloud.net' },
  { name: 'PlayHT', submit: 'https://play.ht' },
  { name: 'Murf', submit: 'https://murf.ai' },
  { name: 'Lovo', submit: 'https://lovo.ai' },
  { name: 'WellSaidLabs', submit: 'https://wellsaidlabs.com' },
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
  console.log(`🚀 Batch 76 - Design & Media (${DIRECTORIES.length} directories)\n`);
  
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
