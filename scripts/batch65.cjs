const https = require('https');

const DIRECTORIES = [
  { name: 'StackOverflow', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflow2', submit: 'https://stackoverflow.com/users' },
  { name: 'ServerFault', submit: 'https://serverfault.com' },
  { name: 'SuperUser', submit: 'https://superuser.com' },
  { name: 'AskUbuntu', submit: 'https://askubuntu.com' },
  { name: 'UnixLinux', submit: 'https://unix.stackexchange.com' },
  { name: 'ServerFault2', submit: 'https://serverfault.com/questions' },
  { name: 'SuperUser2', submit: 'https://superuser.com/questions' },
  { name: 'AskUbuntu2', submit: 'https://askubuntu.com/questions' },
  { name: 'MathOverflow', submit: 'https://mathoverflow.net' },
  { name: 'StackApps', submit: 'https://stackapps.com' },
  { name: 'StackOverflowTag', submit: 'https://stackoverflow.com/tags' },
  { name: 'StackExchange', submit: 'https://stackexchange.com' },
  { name: 'StackExchange2', submit: 'https://stackexchange.com/sites' },
  { name: 'RedditDev', submit: 'https://www.reddit.com/r/webdev' },
  { name: 'RedditJS', submit: 'https://www.reddit.com/r/javascript' },
  { name: 'RedditProg', submit: 'https://www.reddit.com/r/programming' },
  { name: 'RedditTech', submit: 'https://www.reddit.com/r/technology' },
  { name: 'RedditLearnProg', submit: 'https://www.reddit.com/r/learnprogramming' },
  { name: 'RedditCS', submit: 'https://www.reddit.com/r/computerscience' },
  { name: 'HackerNews', submit: 'https://news.ycombinator.com' },
  { name: 'HackerNews2', submit: 'https://news.ycombinator.com/submit' },
  { name: 'Lobsters', submit: 'https://lobste.rs' },
  { name: 'Lobsters2', submit: 'https://lobste.rs/submit' },
  { name: 'DEV', submit: 'https://dev.to' },
  { name: 'DEV2', submit: 'https://dev.to/tags' },
  { name: 'Hashnode', submit: 'https://hashnode.com' },
  { name: 'Hashnode2', submit: 'https://hashnode.com/explore' },
  { name: 'CodeNewbie', submit: 'https://www.codenewbie.org' },
  { name: 'CodinGame', submit: 'https://www.codingame.com' },
  { name: 'CodeProject', submit: 'https://www.codeproject.com' },
  { name: 'DZone', submit: 'https://dzone.com' },
  { name: 'DZone2', submit: 'https://dzone.com/links' },
  { name: 'SitePoint', submit: 'https://www.sitepoint.com' },
  { name: 'SitePoint2', submit: 'https://www.sitepoint.com/community' },
  { name: 'DreamInCode', submit: 'https://www.dreamincode.net' },
  { name: 'DreamInCode2', submit: 'https://www.dreamincode.net/forums' },
  { name: 'JavaForums', submit: 'https://www.java-forums.org' },
  { name: 'PHPForums', submit: 'https://www.phpforums.com' },
  { name: 'ForumsPython', submit: 'https://python-forums.com' },
  { name: 'WebDeveloper', submit: 'https://www.webdeveloper.com' },
  { name: 'WebDeveloperForum', submit: 'https://www.webdeveloper.com/forum' },
  { name: 'SitePointForum', submit: 'https://www.sitepoint.com/community' },
  { name: 'RedditCSS', submit: 'https://www.reddit.com/r/css' },
  { name: 'RedditHTML', submit: 'https://www.reddit.com/r/HTML' },
  { name: 'RedditReact', submit: 'https://www.reddit.com/r/reactjs' },
  { name: 'RedditVue', submit: 'https://www.reddit.com/r/vuejs' },
  { name: 'RedditAngular', submit: 'https://www.reddit.com/r/angular' },
  { name: 'RedditNode', submit: 'https://www.reddit.com/r/node' },
  { name: 'RedditDocker', submit: 'https://www.reddit.com/r/docker' },
  { name: 'RedditKubernetes', submit: 'https://www.reddit.com/r/kubernetes' },
  { name: 'RedditAWS', submit: 'https://www.reddit.com/r/aws' },
  { name: 'RedditGCP', submit: 'https://www.reddit.com/r/googlecloud' },
  { name: 'RedditAzure', submit: 'https://www.reddit.com/r/azure' },
  { name: 'RedditDevOps', submit: 'https://www.reddit.com/r/devops' },
  { name: 'RedditSysAdmin', submit: 'https://www.reddit.com/r/sysadmin' },
  { name: 'RedditCoding', submit: 'https://www.reddit.com/r/coding' },
  { name: 'RedditCompSci', submit: 'https://www.reddit.com/r/computerscience' },
  { name: 'RedditStartups', submit: 'https://www.reddit.com/r/startups' },
  { name: 'RedditEntrepreneur', submit: 'https://www.reddit.com/r/entrepreneur' },
  { name: 'IndieHackers', submit: 'https://www.indiehackers.com' },
  { name: 'IndieHackers2', submit: 'https://www.indiehackers.com/forum' },
  { name: 'ProductHunt', submit: 'https://www.producthunt.com' },
  { name: 'ProductHunt2', submit: 'https://www.producthunt.com/topics' },
  { name: 'BetaList', submit: 'https://betalist.com' },
  { name: 'BetaList2', submit: 'https://betalist.com/submit' },
  { name: 'LaunchingNext', submit: 'https://www.launchingnext.com' },
  { name: 'Crozdesk', submit: 'https://www.crozdesk.com' },
  { name: 'SaaSHub', submit: 'https://www.saashub.com' },
  { name: 'GetApp', submit: 'https://www.getapp.com' },
  { name: 'Capterra', submit: 'https://www.capterra.com' },
  { name: 'G2', submit: 'https://www.g2.com' },
  { name: 'TrustRadius', submit: 'https://www.trustradius.com' },
  { name: 'PeerSpot', submit: 'https://www.peerspot.com' },
  { name: 'SoftwareWorld', submit: 'https://softwareworld.ca' },
  { name: 'TrustArc', submit: 'https://www.trustarc.com' },
  { name: 'AlternativeTo', submit: 'https://alternativeto.net' },
  { name: 'Slant', submit: 'https://www.slant.co' },
  { name: 'StackShare', submit: 'https://stackshare.io' },
  { name: 'LibHunt', submit: 'https://www.libhunt.com' },
  { name: 'OpenSource', submit: 'https://opensource.com' },
  { name: 'Softpedia', submit: 'https://www.softpedia.com' },
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
  console.log(`🚀 Batch 65 - Forums & Communities (${DIRECTORIES.length} directories)\n`);
  
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
