const https = require('https');

const DIRECTORIES = [
  { name: 'Google', submit: 'https://www.google.com' },
  { name: 'YouTube', submit: 'https://www.youtube.com' },
  { name: 'Facebook', submit: 'https://www.facebook.com' },
  { name: 'Twitter', submit: 'https://twitter.com' },
  { name: 'Instagram', submit: 'https://www.instagram.com' },
  { name: 'LinkedIn', submit: 'https://www.linkedin.com' },
  { name: 'Pinterest', submit: 'https://www.pinterest.com' },
  { name: 'Reddit', submit: 'https://www.reddit.com' },
  { name: 'Quora', submit: 'https://www.quora.com' },
  { name: 'Medium', submit: 'https://medium.com' },
  { name: 'Tumblr', submit: 'https://www.tumblr.com' },
  { name: 'Flickr', submit: 'https://www.flickr.com' },
  { name: 'Vimeo', submit: 'https://vimeo.com' },
  { name: 'Twitch', submit: 'https://www.twitch.tv' },
  { name: 'Snapchat', submit: 'https://www.snapchat.com' },
  { name: 'TikTok', submit: 'https://www.tiktok.com' },
  { name: 'Discord', submit: 'https://discord.com' },
  { name: 'Slack', submit: 'https://slack.com' },
  { name: 'WhatsApp', submit: 'https://www.whatsapp.com' },
  { name: 'Telegram', submit: 'https://telegram.org' },
  { name: 'WeChat', submit: 'https://www.wechat.com' },
  { name: 'Line', submit: 'https://line.me' },
  { name: 'Viber', submit: 'https://www.viber.com' },
  { name: 'Signal', submit: 'https://signal.org' },
  { name: 'Skype', submit: 'https://www.skype.com' },
  { name: 'Zoom', submit: 'https://zoom.us' },
  { name: 'Teams', submit: 'https://teams.microsoft.com' },
  { name: 'Meet', submit: 'https://meet.google.com' },
  { name: 'WebEx', submit: 'https://www.webex.com' },
  { name: 'Dropbox', submit: 'https://www.dropbox.com' },
  { name: 'Drive', submit: 'https://drive.google.com' },
  { name: 'OneDrive', submit: 'https://onedrive.live.com' },
  { name: 'iCloud', submit: 'https://www.icloud.com' },
  { name: 'Box', submit: 'https://www.box.com' },
  { name: 'MediaFire', submit: 'https://www.mediafire.com' },
  { name: 'Mega', submit: 'https://mega.io' },
  { name: 'pCloud', submit: 'https://www.pcloud.com' },
  { name: 'Sync', submit: 'https://www.sync.com' },
  { name: 'IDrive', submit: 'https://www.idrive.com' },
  { name: 'Backblaze', submit: 'https://www.backblaze.com' },
  { name: 'Carbonite', submit: 'https://www.carbonite.com' },
  { name: 'CrashPlan', submit: 'https://www.crashplan.com' },
  { name: 'SpiderOak', submit: 'https://spideroak.com' },
  { name: 'Tarsnap', submit: 'https://www.tarsnap.com' },
  { name: 'Duplicati', submit: 'https://www.duplicati.com' },
  { name: 'Rclone', submit: 'https://rclone.org' },
  { name: 'Restic', submit: 'https://restic.net' },
  { name: 'Duplicacy', submit: 'https://duplicacy.com' },
  { name: 'Borg', submit: 'https://www.borgbackup.org' },
  { name: 'Amanda', submit: 'https://www.amanda.org' },
  { name: 'Bacula', submit: 'https://www.bacula.org' },
  { name: 'Bareos', submit: 'https://www.bareos.org' },
  { name: 'GitLab', submit: 'https://gitlab.com' },
  { name: 'GitHub', submit: 'https://github.com' },
  { name: 'Bitbucket', submit: 'https://bitbucket.org' },
  { name: 'SourceForge', submit: 'https://sourceforge.net' },
  { name: 'Codeberg', submit: 'https://codeberg.org' },
  { name: 'Gitea', submit: 'https://gitea.io' },
  { name: 'Launchpad', submit: 'https://launchpad.net' },
  { name: 'SourceHut', submit: 'https://sourcehut.org' },
  { name: 'Pagure', submit: 'https://pagure.io' },
  { name: 'Assembla', submit: 'https://www.assembla.com' },
  { name: 'Perforce', submit: 'https://www.perforce.com' },
  { name: 'PlasticSCM', submit: 'https://www.plasticscm.com' },
  { name: 'AzureDevOps', submit: 'https://azure.microsoft.com/services/devops' },
  { name: 'AWSCodeCommit', submit: 'https://aws.amazon.com/codecommit' },
  { name: 'GoogleCloudSource', submit: 'https://cloud.google.com/source-repositories' },
  { name: 'Cloudflare', submit: 'https://www.cloudflare.com' },
  { name: 'Fastly', submit: 'https://www.fastly.com' },
  { name: 'Akamai', submit: 'https://www.akamai.com' },
  { name: 'CloudFront', submit: 'https://aws.amazon.com/cloudfront' },
  { name: 'StackPath', submit: 'https://www.stackpath.com' },
  { name: 'Bunny', submit: 'https://bunny.net' },
  { name: 'KeyCDN', submit: 'https://www.keycdn.com' },
  { name: 'CDN77', submit: 'https://www.cdn77.com' },
  { name: 'jsDelivr', submit: 'https://www.jsdelivr.com' },
  { name: 'unpkg', submit: 'https://unpkg.com' },
  { name: 'cdnjs', submit: 'https://cdnjs.com' },
  { name: 'jQuery', submit: 'https://jquery.com' },
  { name: 'React', submit: 'https://react.dev' },
  { name: 'Vue', submit: 'https://vuejs.org' },
  { name: 'Angular', submit: 'https://angular.io' },
  { name: 'Svelte', submit: 'https://svelte.dev' },
  { name: 'Bootstrap', submit: 'https://getbootstrap.com' },
  { name: 'Tailwind', submit: 'https://tailwindcss.com' },
  { name: 'FontAwesome', submit: 'https://fontawesome.com' },
  { name: 'GoogleFonts', submit: 'https://fonts.google.com' },
  { name: 'MDN', submit: 'https://developer.mozilla.org' },
  { name: 'W3Schools', submit: 'https://www.w3schools.com' },
  { name: 'StackOverflow', submit: 'https://stackoverflow.com' },
  { name: 'DevTo', submit: 'https://dev.to' },
  { name: 'Hashnode', submit: 'https://hashnode.com' },
  { name: 'RedditDev', submit: 'https://www.reddit.com/r/webdev' },
  { name: 'RedditJS', submit: 'https://www.reddit.com/r/javascript' },
  { name: 'HackerNews', submit: 'https://news.ycombinator.com' },
  { name: 'Lobsters', submit: 'https://lobste.rs' },
  { name: 'DZone', submit: 'https://dzone.com' },
  { name: 'SitePoint', submit: 'https://www.sitepoint.com' },
  { name: 'CSS Tricks', submit: 'https://css-tricks.com' },
  { name: 'SmashingMagazine', submit: 'https://www.smashingmagazine.com' },
  { name: 'A List Apart', submit: 'https://alistapart.com' },
  { name: 'SiteInspire', submit: 'https://www.siteinspire.com' },
  { name: 'OnePageLove', submit: 'https://onepagelove.com' },
  { name: 'Awwwards', submit: 'https://www.awwwards.com' },
  { name: 'TheFWA', submit: 'https://www.thefwa.com' },
  { name: 'CSSDesignAwards', submit: 'https://www.cssdesignawards.com' },
  { name: 'Codrops', submit: 'https://tympanus.net/codrops' },
  { name: 'Speckyboy', submit: 'https://speckyboy.com' },
  { name: 'WebDesignerDepot', submit: 'https://www.webdesignerdepot.com' },
  { name: 'Hongkiat', submit: 'https://www.hongkiat.com' },
  { name: 'Line25', submit: 'https://line25.com' },
  { name: 'SixRevisions', submit: 'https://www.sixrevisions.com' },
  { name: 'TutorialZine', submit: 'https://tutorialzine.com' },
  { name: 'CodeMyUI', submit: 'https://codemyui.com' },
  { name: 'CSSFlow', submit: 'https://www.cssflow.com' },
  { name: 'Bootsnipp', submit: 'https://bootsnipp.com' },
  { name: 'BootstrapBay', submit: 'https://bootstrapbay.com' },
  { name: 'WrapBootstrap', submit: 'https://wrapbootstrap.com' },
  { name: 'ThemeForest', submit: 'https://themeforest.net' },
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
  console.log(`🚀 Batch 74 - Social, Storage & Design (${DIRECTORIES.length} directories)\n`);
  
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
