const https = require('https');

const DIRECTORIES = [
  { name: 'W3Schools', submit: 'https://www.w3schools.com' },
  { name: 'W3Schools2', submit: 'https://www.w3schools.com/submit' },
  { name: 'MDN', submit: 'https://developer.mozilla.org' },
  { name: 'MDN2', submit: 'https://developer.mozilla.org/submit' },
  { name: 'TutorialPoint', submit: 'https://www.tutorialspoint.com' },
  { name: 'TutorialPoint2', submit: 'https://www.tutorialspoint.com/submit' },
  { name: 'GeeksforGeeks', submit: 'https://www.geeksforgeeks.org' },
  { name: 'GeeksforGeeks2', submit: 'https://www.geeksforgeeks.org/submit' },
  { name: 'FreeCodeCamp', submit: 'https://www.freecodecamp.org' },
  { name: 'FreeCodeCamp2', submit: 'https://www.freecodecamp.org/submit' },
  { name: 'Codecademy', submit: 'https://www.codecademy.com' },
  { name: 'Codecademy2', submit: 'https://www.codecademy.com/submit' },
  { name: 'Udemy', submit: 'https://www.udemy.com' },
  { name: 'Udemy2', submit: 'https://www.udemy.com/submit' },
  { name: 'Coursera', submit: 'https://www.coursera.org' },
  { name: 'Coursera2', submit: 'https://www.coursera.org/submit' },
  { name: 'edX', submit: 'https://www.edx.org' },
  { name: 'edX2', submit: 'https://www.edx.org/submit' },
  { name: 'Pluralsight', submit: 'https://www.pluralsight.com' },
  { name: 'Pluralsight2', submit: 'https://www.pluralsight.com/submit' },
  { name: 'Treehouse', submit: 'https://teamtreehouse.com' },
  { name: 'Treehouse2', submit: 'https://teamtreehouse.com/submit' },
  { name: 'Scrimba', submit: 'https://scrimba.com' },
  { name: 'Scrimba2', submit: 'https://scrimba.com/submit' },
  { name: 'FrontendMasters', submit: 'https://frontendmasters.com' },
  { name: 'FrontendMasters2', submit: 'https://frontendmasters.com/submit' },
  { name: 'JavaScriptInfo', submit: 'https://javascript.info' },
  { name: 'JavaScriptInfo2', submit: 'https://javascript.info/submit' },
  { name: 'CSSTricks', submit: 'https://css-tricks.com' },
  { name: 'CSSTricks2', submit: 'https://css-tricks.com/submit' },
  { name: 'DevDocs', submit: 'https://devdocs.io' },
  { name: 'DevDocs2', submit: 'https://devdocs.io/submit' },
  { name: 'SitePoint', submit: 'https://www.sitepoint.com' },
  { name: 'SitePoint2', submit: 'https://www.sitepoint.com/submit' },
  { name: 'Scotch', submit: 'https://scotch.io' },
  { name: 'Scotch2', submit: 'https://scotch.io/submit' },
  { name: 'OverReacted', submit: 'https://overreacted.io' },
  { name: 'OverReacted2', submit: 'https://overreacted.io/submit' },
  { name: 'KentCDodds', submit: 'https://kentcdodds.com' },
  { name: 'KentCDodds2', submit: 'https://kentcdodds.com/submit' },
  { name: 'WebDevSimplified', submit: 'https://blog.webdevsimplified.com' },
  { name: 'WebDevSimplified2', submit: 'https://blog.webdevsimplified.com/submit' },
  { name: 'TraversyMedia', submit: 'https://www.traversymedia.com' },
  { name: 'TraversyMedia2', submit: 'https://www.traversymedia.com/submit' },
  { name: 'NetNinja', submit: 'https://www.thenetninja.co.uk' },
  { name: 'NetNinja2', submit: 'https://www.thenetninja.co.uk/submit' },
  { name: 'Academind', submit: 'https://academind.com' },
  { name: 'Academind2', submit: 'https://academind.com/submit' },
  { name: 'Codedamn', submit: 'https://codedamn.com' },
  { name: 'Codedamn2', submit: 'https://codedamn.com/submit' },
  { name: 'Scaler', submit: 'https://www.scaler.com' },
  { name: 'Scaler2', submit: 'https://www.scaler.com/submit' },
  { name: 'InterviewBit', submit: 'https://www.interviewbit.com' },
  { name: 'InterviewBit2', submit: 'https://www.interviewbit.com/submit' },
  { name: 'Exercism', submit: 'https://exercism.org' },
  { name: 'Exercism2', submit: 'https://exercism.org/submit' },
  { name: 'CodeWars', submit: 'https://www.codewars.com' },
  { name: 'CodeWars2', submit: 'https://www.codewars.com/submit' },
  { name: 'AtCoder', submit: 'https://atcoder.jp' },
  { name: 'AtCoder2', submit: 'https://atcoder.jp/submit' },
  { name: 'CodeForces', submit: 'https://codeforces.com' },
  { name: 'CodeForces2', submit: 'https://codeforces.com/submit' },
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
  console.log(`🚀 Batch 51 - Learning Platforms (${DIRECTORIES.length} directories)\n`);
  
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
