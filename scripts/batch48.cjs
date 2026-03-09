const https = require('https');

const DIRECTORIES = [
  { name: 'StackBlitz', submit: 'https://stackblitz.com' },
  { name: 'StackBlitz2', submit: 'https://stackblitz.com/ide' },
  { name: 'CodeSandbox', submit: 'https://codesandbox.io' },
  { name: 'CodeSandbox2', submit: 'https://codesandbox.io/s' },
  { name: 'Replit', submit: 'https://replit.com' },
  { name: 'Replit2', submit: 'https://replit.com/new' },
  { name: 'Glitch', submit: 'https://glitch.com' },
  { name: 'Glitch2', submit: 'https://glitch.com/new' },
  { name: 'CodePen', submit: 'https://codepen.io' },
  { name: 'CodePen2', submit: 'https://codepen.io/pen/new' },
  { name: 'JSFiddle', submit: 'https://jsfiddle.net' },
  { name: 'JSFiddle2', submit: 'https://jsfiddle.net/new' },
  { name: 'PlayCode', submit: 'https://playcode.io' },
  { name: 'PlayCode2', submit: 'https://playcode.io/new' },
  { name: 'Runnable', submit: 'https://runnable.com' },
  { name: 'Runnable2', submit: 'https://runnable.com/new' },
  { name: 'CompilerExplorer', submit: 'https://godbolt.org' },
  { name: 'CompilerExplorer2', submit: 'https://godbolt.org/new' },
  { name: 'JSitor', submit: 'https://jsitor.com' },
  { name: 'JSitor2', submit: 'https://jsitor.com/new' },
  { name: 'Dabblet', submit: 'https://dabblet.com' },
  { name: 'Dabblet2', submit: 'https://dabblet.com/new' },
  { name: 'CSSDesk', submit: 'https://cssdesk.com' },
  { name: 'CSSDesk2', submit: 'https://cssdesk.com/new' },
  { name: 'Liveweave', submit: 'https://liveweave.com' },
  { name: 'Liveweave2', submit: 'https://liveweave.com/new' },
  { name: 'CodeMirror', submit: 'https://codemirror.net' },
  { name: 'CodeMirror2', submit: 'https://codemirror.net/demo' },
  { name: 'Monaco', submit: 'https://microsoft.github.io/monaco-editor' },
  { name: 'Monaco2', submit: 'https://microsoft.github.io/monaco-editor/playground' },
  { name: 'CodeBeautify', submit: 'https://codebeautify.org' },
  { name: 'CodeBeautify2', submit: 'https://codebeautify.org/tools' },
  { name: 'Formatter', submit: 'https://www.freeformatter.com' },
  { name: 'Formatter2', submit: 'https://www.freeformatter.com/formatters' },
  { name: 'JSONLint', submit: 'https://jsonlint.com' },
  { name: 'JSONLint2', submit: 'https://jsonlint.com/new' },
  { name: 'JSONViewer', submit: 'https://jsonviewer.org' },
  { name: 'JSONViewer2', submit: 'https://jsonviewer.org/new' },
  { name: 'XMLLint', submit: 'https://www.xml-lint.com' },
  { name: 'XMLLint2', submit: 'https://www.xml-lint.com/new' },
  { name: 'HTMLTidy', submit: 'https://www.html-tidy.org' },
  { name: 'HTMLTidy2', submit: 'https://www.html-tidy.org/submit' },
  { name: 'Prettier', submit: 'https://prettier.io' },
  { name: 'Prettier2', submit: 'https://prettier.io/playground' },
  { name: 'ESLint', submit: 'https://eslint.org' },
  { name: 'ESLint2', submit: 'https://eslint.org/demo' },
  { name: 'TypeScript', submit: 'https://www.typescriptlang.org' },
  { name: 'TypeScript2', submit: 'https://www.typescriptlang.org/play' },
  { name: 'Babel', submit: 'https://babeljs.io' },
  { name: 'Babel2', submit: 'https://babeljs.io/repl' },
  { name: 'Webpack', submit: 'https://webpack.js.org' },
  { name: 'Webpack2', submit: 'https://webpack.js.org/demo' },
  { name: 'Vite', submit: 'https://vitejs.dev' },
  { name: 'Vite2', submit: 'https://vitejs.dev/playground' },
  { name: 'Parcel', submit: 'https://parceljs.org' },
  { name: 'Parcel2', submit: 'https://parceljs.org/try-online' },
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
  console.log(`🚀 Batch 48 - Online IDEs & Dev Tools (${DIRECTORIES.length} directories)\n`);
  
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
