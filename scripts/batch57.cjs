const https = require('https');

const DIRECTORIES = [
  { name: 'Slack', submit: 'https://slack.com' },
  { name: 'Slack2', submit: 'https://slack.com/submit' },
  { name: 'Discord', submit: 'https://discord.com' },
  { name: 'Discord2', submit: 'https://discord.com/submit' },
  { name: 'Telegram', submit: 'https://telegram.org' },
  { name: 'Telegram2', submit: 'https://telegram.org/submit' },
  { name: 'WhatsApp', submit: 'https://www.whatsapp.com' },
  { name: 'WhatsApp2', submit: 'https://www.whatsapp.com/submit' },
  { name: 'Signal', submit: 'https://signal.org' },
  { name: 'Signal2', submit: 'https://signal.org/submit' },
  { name: 'Zoom', submit: 'https://zoom.us' },
  { name: 'Zoom2', submit: 'https://zoom.us/submit' },
  { name: 'MicrosoftTeams', submit: 'https://teams.microsoft.com' },
  { name: 'MicrosoftTeams2', submit: 'https://teams.microsoft.com/submit' },
  { name: 'GoogleMeet', submit: 'https://meet.google.com' },
  { name: 'GoogleMeet2', submit: 'https://meet.google.com/submit' },
  { name: 'WebEx', submit: 'https://www.webex.com' },
  { name: 'WebEx2', submit: 'https://www.webex.com/submit' },
  { name: 'GoToMeeting', submit: 'https://www.gotomeeting.com' },
  { name: 'GoToMeeting2', submit: 'https://www.gotomeeting.com/submit' },
  { name: 'BlueJeans', submit: 'https://www.bluejeans.com' },
  { name: 'BlueJeans2', submit: 'https://www.bluejeans.com/submit' },
  { name: 'Jitsi', submit: 'https://jitsi.org' },
  { name: 'Jitsi2', submit: 'https://jitsi.org/submit' },
  { name: 'Matrix', submit: 'https://matrix.org' },
  { name: 'Matrix2', submit: 'https://matrix.org/submit' },
  { name: 'RocketChat', submit: 'https://rocket.chat' },
  { name: 'RocketChat2', submit: 'https://rocket.chat/submit' },
  { name: 'Mattermost', submit: 'https://mattermost.com' },
  { name: 'Mattermost2', submit: 'https://mattermost.com/submit' },
  { name: 'Zulip', submit: 'https://zulip.com' },
  { name: 'Zulip2', submit: 'https://zulip.com/submit' },
  { name: 'Gitter', submit: 'https://gitter.im' },
  { name: 'Gitter2', submit: 'https://gitter.im/submit' },
  { name: 'IRC', submit: 'https://irc.com' },
  { name: 'IRC2', submit: 'https://irc.com/submit' },
  { name: 'Twitch', submit: 'https://www.twitch.tv' },
  { name: 'Twitch2', submit: 'https://www.twitch.tv/submit' },
  { name: 'YouTubeLive', submit: 'https://www.youtube.com/live' },
  { name: 'YouTubeLive2', submit: 'https://www.youtube.com/live/submit' },
  { name: ' Vimeo', submit: 'https://vimeo.com' },
  { name: 'Vimeo2', submit: 'https://vimeo.com/submit' },
  { name: 'DailyMotion', submit: 'https://www.dailymotion.com' },
  { name: 'DailyMotion2', submit: 'https://www.dailymotion.com/submit' },
  { name: 'LinkedIn', submit: 'https://www.linkedin.com' },
  { name: 'LinkedIn2', submit: 'https://www.linkedin.com/submit' },
  { name: 'Twitter', submit: 'https://twitter.com' },
  { name: 'Twitter2', submit: 'https://twitter.com/submit' },
  { name: 'Facebook', submit: 'https://www.facebook.com' },
  { name: 'Facebook2', submit: 'https://www.facebook.com/submit' },
  { name: 'Instagram', submit: 'https://www.instagram.com' },
  { name: 'Instagram2', submit: 'https://www.instagram.com/submit' },
  { name: 'Pinterest', submit: 'https://www.pinterest.com' },
  { name: 'Pinterest2', submit: 'https://www.pinterest.com/submit' },
  { name: 'TikTok', submit: 'https://www.tiktok.com' },
  { name: 'TikTok2', submit: 'https://www.tiktok.com/submit' },
  { name: 'Snapchat', submit: 'https://www.snapchat.com' },
  { name: 'Snapchat2', submit: 'https://www.snapchat.com/submit' },
  { name: 'Reddit', submit: 'https://www.reddit.com' },
  { name: 'Reddit2', submit: 'https://www.reddit.com/submit' },
  { name: 'Quora', submit: 'https://www.quora.com' },
  { name: 'Quora2', submit: 'https://www.quora.com/submit' },
  { name: 'Medium', submit: 'https://medium.com' },
  { name: 'Medium2', submit: 'https://medium.com/submit' },
  { name: 'DevTo', submit: 'https://dev.to' },
  { name: 'DevTo2', submit: 'https://dev.to/submit' },
  { name: 'Hashnode', submit: 'https://hashnode.com' },
  { name: 'Hashnode2', submit: 'https://hashnode.com/submit' },
  { name: 'IndieHackers', submit: 'https://www.indiehackers.com' },
  { name: 'IndieHackers2', submit: 'https://www.indiehackers.com/submit' },
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
  console.log(`🚀 Batch 57 - Communication & Social (${DIRECTORIES.length} directories)\n`);
  
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
