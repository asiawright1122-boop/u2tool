const https = require('https');

const DIRECTORIES = [
  { name: 'ProductHunt', submit: 'https://www.producthunt.com' },
  { name: 'ProductHunt2', submit: 'https://www.producthunt.com/products/u2tool' },
  { name: 'IndieHackers', submit: 'https://www.indiehackers.com' },
  { name: 'IndieHackers2', submit: 'https://www.indiehackers.com/post' },
  { name: 'HackerNews', submit: 'https://news.ycombinator.com' },
  { name: 'HackerNews2', submit: 'https://news.ycombinator.com/submit' },
  { name: 'Lobsters', submit: 'https://lobste.rs' },
  { name: 'Lobsters2', submit: 'https://lobste.rs/submit' },
  { name: 'RedditDev', submit: 'https://www.reddit.com/r/webdev' },
  { name: 'RedditDev2', submit: 'https://www.reddit.com/r/webdev/submit' },
  { name: 'RedditJS', submit: 'https://www.reddit.com/r/javascript' },
  { name: 'RedditJS2', submit: 'https://www.reddit.com/r/javascript/submit' },
  { name: 'RedditProg', submit: 'https://www.reddit.com/r/programming' },
  { name: 'RedditProg2', submit: 'https://www.reddit.com/r/programming/submit' },
  { name: 'RedditTech', submit: 'https://www.reddit.com/r/technology' },
  { name: 'RedditTools', submit: 'https://www.reddit.com/r/software' },
  { name: 'DevTo', submit: 'https://dev.to' },
  { name: 'DevTo2', submit: 'https://dev.to/new/article' },
  { name: 'Hashnode', submit: 'https://hashnode.com' },
  { name: 'Hashnode2', submit: 'https://hashnode.com/create-post' },
  { name: 'Medium', submit: 'https://medium.com' },
  { name: 'Medium2', submit: 'https://medium.com/new-story' },
  { name: 'DEV', submit: 'https://dev.to' },
  { name: 'DEV2', submit: 'https://dev.to/spots' },
  { name: 'CodeNewbie', submit: 'https://www.codenewbie.org' },
  { name: 'CodeNewbie2', submit: 'https://www.codenewbie.org/submit' },
  { name: 'CodinGame', submit: 'https://www.codingame.com' },
  { name: 'CodinGame2', submit: 'https://www.codingame.com/submit' },
  { name: 'HackerRank', submit: 'https://www.hackerrank.com' },
  { name: 'HackerRank2', submit: 'https://www.hackerrank.com/submit' },
  { name: 'LeetCode', submit: 'https://leetcode.com' },
  { name: 'LeetCode2', submit: 'https://leetcode.com/problemset' },
  { name: 'StackOverflow', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflow2', submit: 'https://stackoverflow.com/questions/ask' },
  { name: 'StackExchange', submit: 'https://stackexchange.com' },
  { name: 'StackExchange2', submit: 'https://stackexchange.com/questions/ask' },
  { name: 'SuperUser', submit: 'https://superuser.com' },
  { name: 'SuperUser2', submit: 'https://superuser.com/questions/ask' },
  { name: 'ServerFault', submit: 'https://serverfault.com' },
  { name: 'ServerFault2', submit: 'https://serverfault.com/questions/ask' },
  { name: 'AskUbuntu', submit: 'https://askubuntu.com' },
  { name: 'AskUbuntu2', submit: 'https://askubuntu.com/questions/ask' },
  { name: 'Unix', submit: 'https://unix.stackexchange.com' },
  { name: 'Unix2', submit: 'https://unix.stackexchange.com/questions/ask' },
  { name: 'MathOverflow', submit: 'https://mathoverflow.net' },
  { name: 'MathOverflow2', submit: 'https://mathoverflow.net/questions/ask' },
  { name: 'StackApps', submit: 'https://stackapps.com' },
  { name: 'StackApps2', submit: 'https://stackapps.com/questions/ask' },
  { name: 'SitePoint', submit: 'https://www.sitepoint.com' },
  { name: 'SitePoint2', submit: 'https://www.sitepoint.com/submit' },
  { name: 'DZone', submit: 'https://dzone.com' },
  { name: 'DZone2', submit: 'https://dzone.com/submit' },
  { name: 'TechBeamers', submit: 'https://www.techbeamers.com' },
  { name: 'TechBeamers2', submit: 'https://www.techbeamers.com/submit' },
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
  console.log(`🚀 Batch 45 - Developer Communities (${DIRECTORIES.length} directories)\n`);
  
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
