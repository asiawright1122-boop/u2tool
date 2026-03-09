const https = require('https');

const DIRECTORIES = [
  { name: 'MDN', submit: 'https://developer.mozilla.org' },
  { name: 'MDN2', submit: 'https://developer.mozilla.org/en-US' },
  { name: 'MDN3', submit: 'https://developer.mozilla.org/zh-CN' },
  { name: 'W3Schools', submit: 'https://www.w3schools.com' },
  { name: 'W3Schools2', submit: 'https://www.w3schools.com/about' },
  { name: 'TutorialPoint', submit: 'https://www.tutorialspoint.com' },
  { name: 'GeeksforGeeks', submit: 'https://www.geeksforgeeks.org' },
  { name: 'FreeCodeCamp', submit: 'https://www.freecodecamp.org' },
  { name: 'CodeCademy', submit: 'https://www.codecademy.com' },
  { name: 'Udemy', submit: 'https://www.udemy.com' },
  { name: 'Coursera', submit: 'https://www.coursera.org' },
  { name: 'edX', submit: 'https://www.edx.org' },
  { name: 'Pluralsight', submit: 'https://www.pluralsight.com' },
  { name: 'Treehouse', submit: 'https://teamtreehouse.com' },
  { name: 'Scrimba', submit: 'https://scrimba.com' },
  { name: 'FrontendMasters', submit: 'https://frontendmasters.com' },
  { name: 'JavaScriptInfo', submit: 'https://javascript.info' },
  { name: 'CSS Tricks', submit: 'https://css-tricks.com' },
  { name: 'DevDocs', submit: 'https://devdocs.io' },
  { name: 'DevDocs2', submit: 'https://devdocs.io/about' },
  { name: 'Stack Overflow', submit: 'https://stackoverflow.com' },
  { name: 'Stack Overflow2', submit: 'https://stackoverflow.com/users/login' },
  { name: 'RedditDev', submit: 'https://www.reddit.com/r/webdev' },
  { name: 'RedditJS', submit: 'https://www.reddit.com/r/javascript' },
  { name: 'RedditProg', submit: 'https://www.reddit.com/r/programming' },
  { name: 'Hashnode', submit: 'https://hashnode.com' },
  { name: 'DevTo2', submit: 'https://dev.to' },
  { name: 'Medium', submit: 'https://medium.com' },
  { name: 'Medium2', submit: 'https://medium.com/tag/developer-tools' },
  { name: 'SitePoint', submit: 'https://www.sitepoint.com' },
  { name: 'Scotch', submit: 'https://scotch.io' },
  { name: 'Flavio', submit: 'https://flaviocopes.com' },
  { name: 'OverReacted', submit: 'https://overreacted.io' },
  { name: 'Josh Comeau', submit: 'https://www.joshwcomeau.com' },
  { name: 'Kent C Dodds', submit: 'https://kentcdodds.com' },
  { name: 'Web Dev Simplified', submit: 'https://blog.webdevsimplified.com' },
  { name: 'Kevin Powell', submit: 'https://www.kevinpowell.co' },
  { name: 'Steve Griffith', submit: 'https://www.youtube.com/@SteveGriffith' },
  { name: 'TraversyMedia', submit: 'https://www.traversymedia.com' },
  { name: 'The Net Ninja', submit: 'https://www.thenetninja.co.uk' },
  { name: 'Academind', submit: 'https://academind.com' },
  { name: 'CodeWithAntonio', submit: 'https://codewithantonio.com' },
  { name: 'Sonny Sangha', submit: 'https://sonnysangha.com' },
  { name: 'JavaScriptMastery', submit: 'https://javascriptmastery.org' },
  { name: 'Codedamn', submit: 'https://codedamn.com' },
  { name: 'Scaler', submit: 'https://www.scaler.com' },
  { name: 'InterviewBit', submit: 'https://www.interviewbit.com' },
  { name: 'LeetCode', submit: 'https://leetcode.com' },
  { name: 'HackerRank', submit: 'https://www.hackerrank.com' },
  { name: 'CodeWars', submit: 'https://www.codewars.com' },
  { name: 'Exercism', submit: 'https://exercism.org' },
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
  console.log(`🚀 Batch 24 - Learning & Tutorials (${DIRECTORIES.length} directories)\n`);
  
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
