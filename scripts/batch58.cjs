const https = require('https');

const DIRECTORIES = [
  { name: 'IconFinder', submit: 'https://www.iconfinder.com' },
  { name: 'IconFinder2', submit: 'https://www.iconfinder.com/submit' },
  { name: 'Flaticon', submit: 'https://www.flaticon.com' },
  { name: 'Flaticon2', submit: 'https://www.flaticon.com/submit' },
  { name: 'Icons8', submit: 'https://icons8.com' },
  { name: 'Icons82', submit: 'https://icons8.com/submit' },
  { name: 'NounProject', submit: 'https://thenounproject.com' },
  { name: 'NounProject2', submit: 'https://thenounproject.com/submit' },
  { name: 'MaterialIcons', submit: 'https://fonts.google.com/icons' },
  { name: 'MaterialIcons2', submit: 'https://fonts.google.com/icons/submit' },
  { name: 'BootstrapIcons', submit: 'https://icons.getbootstrap.com' },
  { name: 'BootstrapIcons2', submit: 'https://icons.getbootstrap.com/submit' },
  { name: 'Heroicons', submit: 'https://heroicons.com' },
  { name: 'Heroicons2', submit: 'https://heroicons.com/submit' },
  { name: 'FeatherIcons', submit: 'https://feathericons.com' },
  { name: 'FeatherIcons2', submit: 'https://feathericons.com/submit' },
  { name: 'Lucide', submit: 'https://lucide.dev' },
  { name: 'Lucide2', submit: 'https://lucide.dev/submit' },
  { name: 'Phosphor', submit: 'https://phosphoricons.com' },
  { name: 'Phosphor2', submit: 'https://phosphoricons.com/submit' },
  { name: 'TablerIcons', submit: 'https://tabler-icons.io' },
  { name: 'TablerIcons2', submit: 'https://tabler-icons.io/submit' },
  { name: 'RadixIcons', submit: 'https://icons.radix-ui.com' },
  { name: 'RadixIcons2', submit: 'https://icons.radix-ui.com/submit' },
  { name: 'RemixIcon', submit: 'https://remixicon.com' },
  { name: 'RemixIcon2', submit: 'https://remixicon.com/submit' },
  { name: 'Boxicons', submit: 'https://boxicons.com' },
  { name: 'Boxicons2', submit: 'https://boxicons.com/submit' },
  { name: 'SimpleIcons', submit: 'https://simpleicons.org' },
  { name: 'SimpleIcons2', submit: 'https://simpleicons.org/submit' },
  { name: 'FontAwesome', submit: 'https://fontawesome.com' },
  { name: 'FontAwesome2', submit: 'https://fontawesome.com/submit' },
  { name: 'GoogleFonts', submit: 'https://fonts.google.com' },
  { name: 'GoogleFonts2', submit: 'https://fonts.google.com/submit' },
  { name: 'AdobeFonts', submit: 'https://fonts.adobe.com' },
  { name: 'AdobeFonts2', submit: 'https://fonts.adobe.com/submit' },
  { name: 'FontSpace', submit: 'https://www.fontspace.com' },
  { name: 'FontSpace2', submit: 'https://www.fontspace.com/submit' },
  { name: 'Dafont', submit: 'https://www.dafont.com' },
  { name: 'Dafont2', submit: 'https://www.dafont.com/submit' },
  { name: '1001Fonts', submit: 'https://www.1001fonts.com' },
  { name: '1001Fonts2', submit: 'https://www.1001fonts.com/submit' },
  { name: 'FontSquirrel', submit: 'https://www.fontsquirrel.com' },
  { name: 'FontSquirrel2', submit: 'https://www.fontsquirrel.com/submit' },
  { name: 'MyFonts', submit: 'https://www.myfonts.com' },
  { name: 'MyFonts2', submit: 'https://www.myfonts.com/submit' },
  { name: 'Unsplash', submit: 'https://unsplash.com' },
  { name: 'Unsplash2', submit: 'https://unsplash.com/submit' },
  { name: 'Pexels', submit: 'https://www.pexels.com' },
  { name: 'Pexels2', submit: 'https://www.pexels.com/submit' },
  { name: 'Pixabay', submit: 'https://pixabay.com' },
  { name: 'Pixabay2', submit: 'https://pixabay.com/submit' },
  { name: 'Flickr', submit: 'https://www.flickr.com' },
  { name: 'Flickr2', submit: 'https://www.flickr.com/submit' },
  { name: 'PexelsVideo', submit: 'https://www.pexels.com/videos' },
  { name: 'PexelsVideo2', submit: 'https://www.pexels.com/videos/submit' },
  { name: 'Coverr', submit: 'https://coverr.co' },
  { name: 'Coverr2', submit: 'https://coverr.co/submit' },
  { name: 'Mixkit', submit: 'https://mixkit.co' },
  { name: 'Mixkit2', submit: 'https://mixkit.co/submit' },
  { name: 'Videvo', submit: 'https://www.videvo.net' },
  { name: 'Videvo2', submit: 'https://www.videvo.net/submit' },
  { name: 'Pond5', submit: 'https://www.pond5.com' },
  { name: 'Pond52', submit: 'https://www.pond5.com/submit' },
  { name: ' Shutterstock', submit: 'https://www.shutterstock.com' },
  { name: 'Shutterstock2', submit: 'https://www.shutterstock.com/submit' },
  { name: 'GettyImages', submit: 'https://www.gettyimages.com' },
  { name: 'GettyImages2', submit: 'https://www.gettyimages.com/submit' },
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
  console.log(`🚀 Batch 58 - Icons, Fonts & Assets (${DIRECTORIES.length} directories)\n`);
  
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
