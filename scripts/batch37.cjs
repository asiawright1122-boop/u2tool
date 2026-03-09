const https = require('https');

const DIRECTORIES = [
  { name: 'IconFinder', submit: 'https://www.iconfinder.com' },
  { name: 'Flaticon', submit: 'https://www.flaticon.com' },
  { name: 'Icons8', submit: 'https://icons8.com' },
  { name: 'NounProject', submit: 'https://thenounproject.com' },
  { name: 'MaterialIcons', submit: 'https://fonts.google.com/icons' },
  { name: 'BootstrapIcons', submit: 'https://icons.getbootstrap.com' },
  { name: 'Heroicons', submit: 'https://heroicons.com' },
  { name: 'FeatherIcons', submit: 'https://feathericons.com' },
  { name: 'Lucide', submit: 'https://lucide.dev' },
  { name: 'Phosphor', submit: 'https://phosphoricons.com' },
  { name: 'Tabler', submit: 'https://tabler-icons.io' },
  { name: 'RadixIcons', submit: 'https://icons.radix-ui.com' },
  { name: 'EvaIcons', submit: 'https://akveo.github.io/eva-icons' },
  { name: 'RemixIcon', submit: 'https://remixicon.com' },
  { name: 'Boxicons', submit: 'https://boxicons.com' },
  { name: 'Themify', submit: 'https://themify.me/themify-icons' },
  { name: 'Stroke7', submit: 'https://www.iconarchive.com/artist/pixeden/Stroke-7-Social.html' },
  { name: 'JamIcons', submit: 'https://jam-icons.com' },
  { name: 'SimpleIcons', submit: 'https://simpleicons.org' },
  { name: 'WorldFlags', submit: 'https://flagicons.lip.is' },
  { name: 'CountryFlags', submit: 'https://countryflagsapi.com' },
  { name: 'Emoji', submit: 'https://emojipedia.org' },
  { name: 'Emojidex', submit: 'https://www.emojidex.com' },
  { name: 'NotoEmoji', submit: 'https://fonts.google.com/noto/specimen/Noto-Emoji' },
  { name: 'Twemoji', submit: 'https://twemoji.twitter.com' },
  { name: 'OpenMoji', submit: 'https://openmoji.org' },
  { name: 'FluentUI', submit: 'https://react.fluentui.dev' },
  { name: 'Pixelarticons', submit: 'https://pixelarticons.com' },
  { name: 'ArcadeIcons', submit: 'https://arcadeicons.com' },
  { name: 'GameIcons', submit: 'https://game-icons.net' },
  { name: 'RPGAwesome', submit: 'https://nagoshiashumari.github.io/Rpg-Awesome' },
  { name: 'DinosaurIcons', submit: 'https://github.com/praveenp29/dinosauricons' },
  { name: 'WeatherIcons', submit: 'https://erikflowers.github.io/weather-icons' },
  { name: 'WeatherIcon', submit: 'https://openweathermap.org/icons' },
  { name: 'Meteocons', submit: 'https://www.meteocons.com' },
  { name: 'Clarity', submit: 'https://clarity.design' },
  { name: 'Carbon2', submit: 'https://carbondesignsystem.com' },
  { name: 'IBMDesign', submit: 'https://www.ibm.com/design/language/iconography' },
  { name: 'AppleSF', submit: 'https://developer.apple.com/sf-symbols' },
  { name: 'SamsungIcon', submit: 'https://developer.samsung.com/gallery/icons' },
  { name: 'Messenger', submit: 'https://messengerbrand.com' },
  { name: 'WhatsApp', submit: 'https://www.whatsapp.com' },
  { name: 'Slack', submit: 'https://slack.com' },
  { name: 'Discord', submit: 'https://discord.com' },
  { name: 'Telegram', submit: 'https://telegram.org' },
  { name: 'Zoom2', submit: 'https://zoom.us' },
  { name: 'Teams2', submit: 'https://teams.microsoft.com' },
  { name: 'Signal', submit: 'https://signal.org' },
  { name: 'Viber', submit: 'https://www.viber.com' },
  { name: 'Line', submit: 'https://line.me' },
  { name: 'WeChat', submit: 'https://www.wechat.com' },
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
  console.log(`🚀 Batch 37 - Icons & Emojis (${DIRECTORIES.length} directories)\n`);
  
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
