const https = require('https');

const DIRECTORIES = [
  { name: 'JSONLint', submit: 'https://jsonlint.com' },
  { name: 'JSONValidate', submit: 'https://jsonvalidate.com' },
  { name: 'JSONFormatter', submit: 'https://jsonformatter.org' },
  { name: 'JSONViewer', submit: 'https://jsonviewer.org' },
  { name: 'CodeBeautify', submit: 'https://codebeautify.org' },
  { name: 'Formatter', submit: 'https://www.freeformatter.com' },
  { name: 'OnlineJSON', submit: 'https://onlinejsontools.com' },
  { name: 'JSONOps', submit: 'https://jsonops.com' },
  { name: 'JSONBuddy', submit: 'https://www.jsonbuddy.com' },
  { name: 'XMLLint', submit: 'https://www.xml-lint.com' },
  { name: 'XMLFormatter', submit: 'https://www.freeformatter.com/xml-formatter' },
  { name: 'CodeBeautifyXML', submit: 'https://codebeautify.org/xmlviewer' },
  { name: 'FreeFormatterXML', submit: 'https://www.freeformatter.com' },
  { name: 'HTMLCleaner', submit: 'https://html-cleaner.com' },
  { name: 'HTMLTidy', submit: 'https://www.html-tidy.org' },
  { name: 'W3SchoolsHTML', submit: 'https://www.w3schools.com/html' },
  { name: 'PrettierCode', submit: 'https://prettier.io' },
  { name: 'ESLintPlayground', submit: 'https://eslint.org/play' },
  { name: 'BabelREPL', submit: 'https://babeljs.io/repl' },
  { name: 'TypeScriptPlayground', submit: 'https://www.typescriptlang.org/play' },
  { name: 'StackBlitz2', submit: 'https://stackblitz.com' },
  { name: 'CodeSandbox3', submit: 'https://codesandbox.io/s' },
  { name: 'JSFiddle3', submit: 'https://jsfiddle.net' },
  { name: 'CodePen3', submit: 'https://codepen.io/pen' },
  { name: 'PlayCode', submit: 'https://playcode.io' },
  { name: 'Replit2', submit: 'https://replit.com' },
  { name: 'Glitch2', submit: 'https://glitch.com' },
  { name: 'Runnable', submit: 'https://runnable.com' },
  { name: 'JSitor', submit: 'https://jsitor.com' },
  { name: 'Dabblet2', submit: 'https://dabblet.com' },
  { name: 'CSSDesk', submit: 'https://cssdesk.com' },
  { name: 'Liveweave2', submit: 'https://liveweave.com' },
  { name: 'Neocities', submit: 'https://neocities.org' },
  { name: 'Surge', submit: 'https://surge.sh' },
  { name: 'Vercel2', submit: 'https://vercel.com' },
  { name: 'Netlify2', submit: 'https://netlify.com' },
  { name: 'Render2', submit: 'https://render.com' },
  { name: 'Railway2', submit: 'https://railway.app' },
  { name: 'Fly2', submit: 'https://fly.io' },
  { name: 'Cyclic2', submit: 'https://cyclic.sh' },
  { name: 'Deta2', submit: 'https://deta.space' },
  { name: 'Koyeb', submit: 'https://koyeb.com' },
  { name: 'Northflank', submit: 'https://northflank.com' },
  { name: 'Gigalixir', submit: 'https://gigalixir.com' },
  { name: 'Dokku', submit: 'https://dokku.com' },
  { name: 'CapRover', submit: 'https://caprover.com' },
  { name: 'Portainer', submit: 'https://www.portainer.io' },
  { name: 'Watchtower', submit: 'https://containrrr.dev/watchtower' },
  { name: 'Traefik', submit: 'https://traefik.io' },
  { name: 'Nginx', submit: 'https://www.nginx.com' },
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
  console.log(`🚀 Batch 26 - Formatters & Hosting (${DIRECTORIES.length} directories)\n`);
  
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
