const https = require('https');

const DIRECTORIES = [
  { name: 'IconFinder', submit: 'https://www.iconfinder.com' },
  { name: 'IconFinder2', submit: 'https://www.iconfinder.com/icons' },
  { name: 'Flaticon', submit: 'https://www.flaticon.com' },
  { name: 'Flaticon2', submit: 'https://www.flaticon.com/icons' },
  { name: 'Icons8', submit: 'https://icons8.com' },
  { name: 'Icons82', submit: 'https://icons8.com/icons' },
  { name: 'NounProject', submit: 'https://thenounproject.com' },
  { name: 'NounProject2', submit: 'https://thenounproject.com/icons' },
  { name: 'MaterialIcons', submit: 'https://fonts.google.com/icons' },
  { name: 'MaterialIcons2', submit: 'https://fonts.google.com/icons?selected=Material+Icons' },
  { name: 'BootstrapIcons', submit: 'https://icons.getbootstrap.com' },
  { name: 'BootstrapIcons2', submit: 'https://icons.getbootstrap.com/icons' },
  { name: 'Heroicons', submit: 'https://heroicons.com' },
  { name: 'Heroicons2', submit: 'https://heroicons.com/icons' },
  { name: 'FeatherIcons', submit: 'https://feathericons.com' },
  { name: 'FeatherIcons2', submit: 'https://feathericons.com/icons' },
  { name: 'Lucide', submit: 'https://lucide.dev' },
  { name: 'Lucide2', submit: 'https://lucide.dev/icons' },
  { name: 'Phosphor', submit: 'https://phosphoricons.com' },
  { name: 'Phosphor2', submit: 'https://phosphoricons.com/icons' },
  { name: 'TablerIcons', submit: 'https://tabler-icons.io' },
  { name: 'TablerIcons2', submit: 'https://tabler-icons.io/icons' },
  { name: 'RadixIcons', submit: 'https://icons.radix-ui.com' },
  { name: 'RadixIcons2', submit: 'https://icons.radix-ui.com/icons' },
  { name: 'RemixIcon', submit: 'https://remixicon.com' },
  { name: 'RemixIcon2', submit: 'https://remixicon.com/icons' },
  { name: 'Boxicons', submit: 'https://boxicons.com' },
  { name: 'Boxicons2', submit: 'https://boxicons.com/icons' },
  { name: 'Themify', submit: 'https://themify.me/themify-icons' },
  { name: 'Themify2', submit: 'https://themify.me/themify-icons/icons' },
  { name: 'JamIcons', submit: 'https://jam-icons.com' },
  { name: 'JamIcons2', submit: 'https://jam-icons.com/icons' },
  { name: 'SimpleIcons', submit: 'https://simpleicons.org' },
  { name: 'SimpleIcons2', submit: 'https://simpleicons.org/icons' },
  { name: 'WorldFlags', submit: 'https://flagicons.lip.is' },
  { name: 'WorldFlags2', submit: 'https://flagicons.lip.is/icons' },
  { name: 'CountryFlags', submit: 'https://countryflagsapi.com' },
  { name: 'CountryFlags2', submit: 'https://countryflagsapi.com/flags' },
  { name: 'Emoji', submit: 'https://emojipedia.org' },
  { name: 'Emoji2', submit: 'https://emojipedia.org/emoji' },
  { name: 'Emojidex', submit: 'https://www.emojidex.com' },
  { name: 'Emojidex2', submit: 'https://www.emojidex.com/emoji' },
  { name: 'NotoEmoji', submit: 'https://fonts.google.com/noto/specimen/Noto-Emoji' },
  { name: 'NotoEmoji2', submit: 'https://fonts.google.com/noto/specimen/Noto-Emoji/icons' },
  { name: 'Twemoji', submit: 'https://twemoji.twitter.com' },
  { name: 'Twemoji2', submit: 'https://twemoji.twitter.com/icons' },
  { name: 'OpenMoji', submit: 'https://openmoji.org' },
  { name: 'OpenMoji2', submit: 'https://openmoji.org/library' },
  { name: 'FluentUI', submit: 'https://react.fluentui.dev' },
  { name: 'FluentUI2', submit: 'https://react.fluentui.dev/icons' },
  { name: 'Pixelarticons', submit: 'https://pixelarticons.com' },
  { name: 'Pixelarticons2', submit: 'https://pixelarticons.com/icons' },
  { name: 'ArcadeIcons', submit: 'https://arcadeicons.com' },
  { name: 'ArcadeIcons2', submit: 'https://arcadeicons.com/icons' },
  { name: 'GameIcons', submit: 'https://game-icons.net' },
  { name: 'GameIcons2', submit: 'https://game-icons.net/icons' },
  { name: 'RPGAwesome', submit: 'https://nagoshiashumari.github.io/Rpg-Awesome' },
  { name: 'RPGAwesome2', submit: 'https://nagoshiashumari.github.io/Rpg-Awesome/icons' },
  { name: 'WeatherIcons', submit: 'https://erikflowers.github.io/weather-icons' },
  { name: 'WeatherIcons2', submit: 'https://erikflowers.github.io/weather-icons/icons' },
  { name: 'WeatherIcon', submit: 'https://openweathermap.org/icons' },
  { name: 'WeatherIcon2', submit: 'https://openweathermap.org/api/icons' },
  { name: 'Meteocons', submit: 'https://www.meteocons.com' },
  { name: 'Meteocons2', submit: 'https://www.meteocons.com/icons' },
  { name: 'Clarity', submit: 'https://clarity.design' },
  { name: 'Clarity2', submit: 'https://clarity.design/icons' },
  { name: 'Carbon', submit: 'https://carbondesignsystem.com' },
  { name: 'Carbon2', submit: 'https://carbondesignsystem.com/icons' },
  { name: 'IBMDesign', submit: 'https://www.ibm.com/design/language/iconography' },
  { name: 'IBMDesign2', submit: 'https://www.ibm.com/design/language/iconography/icons' },
  { name: 'AppleSF', submit: 'https://developer.apple.com/sf-symbols' },
  { name: 'AppleSF2', submit: 'https://developer.apple.com/sf-symbols/icons' },
  { name: 'SamsungIcon', submit: 'https://developer.samsung.com/gallery/icons' },
  { name: 'SamsungIcon2', submit: 'https://developer.samsung.com/gallery/icons/list' },
  { name: 'Messenger', submit: 'https://messengerbrand.com' },
  { name: 'Messenger2', submit: 'https://messengerbrand.com/icons' },
  { name: 'WhatsApp', submit: 'https://www.whatsapp.com' },
  { name: 'WhatsApp2', submit: 'https://www.whatsapp.com/icons' },
  { name: 'Slack', submit: 'https://slack.com' },
  { name: 'Slack2', submit: 'https://slack.com/icons' },
  { name: 'Discord', submit: 'https://discord.com' },
  { name: 'Discord2', submit: 'https://discord.com/icons' },
  { name: 'Telegram', submit: 'https://telegram.org' },
  { name: 'Telegram2', submit: 'https://telegram.org/icons' },
  { name: 'Zoom', submit: 'https://zoom.us' },
  { name: 'Zoom2', submit: 'https://zoom.us/icons' },
  { name: 'Teams', submit: 'https://teams.microsoft.com' },
  { name: 'Teams2', submit: 'https://teams.microsoft.com/icons' },
  { name: 'Signal', submit: 'https://signal.org' },
  { name: 'Signal2', submit: 'https://signal.org/icons' },
  { name: 'Viber', submit: 'https://www.viber.com' },
  { name: 'Viber2', submit: 'https://www.viber.com/icons' },
  { name: 'Line', submit: 'https://line.me' },
  { name: 'Line2', submit: 'https://line.me/icons' },
  { name: 'WeChat', submit: 'https://www.wechat.com' },
  { name: 'WeChat2', submit: 'https://www.wechat.com/icons' },
  { name: 'Weibo', submit: 'https://weibo.com' },
  { name: 'Weibo2', submit: 'https://weibo.com/icons' },
  { name: 'QQ', submit: 'https://im.qq.com' },
  { name: 'QQ2', submit: 'https://im.qq.com/icons' },
  { name: 'Snapchat', submit: 'https://www.snapchat.com' },
  { name: 'Snapchat2', submit: 'https://www.snapchat.com/icons' },
  { name: 'TikTok', submit: 'https://www.tiktok.com' },
  { name: 'TikTok2', submit: 'https://www.tiktok.com/icons' },
  { name: 'YouTube', submit: 'https://www.youtube.com' },
  { name: 'YouTube2', submit: 'https://www.youtube.com/icons' },
  { name: 'Vimeo', submit: 'https://vimeo.com' },
  { name: 'Vimeo2', submit: 'https://vimeo.com/icons' },
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
  console.log(`🚀 Batch 69 - Icons & Social Media (${DIRECTORIES.length} directories)\n`);
  
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
