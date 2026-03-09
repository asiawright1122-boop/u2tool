const https = require('https');

const DIRECTORIES = [
  { name: 'Google', submit: 'https://www.google.com' },
  { name: 'Google2', submit: 'https://www.google.com/submit' },
  { name: 'Bing', submit: 'https://www.bing.com' },
  { name: 'Bing2', submit: 'https://www.bing.com/submit' },
  { name: 'Yahoo', submit: 'https://search.yahoo.com' },
  { name: 'Yahoo2', submit: 'https://search.yahoo.com/submit' },
  { name: 'DuckDuckGo', submit: 'https://duckduckgo.com' },
  { name: 'DuckDuckGo2', submit: 'https://duckduckgo.com/submit' },
  { name: 'Yandex', submit: 'https://yandex.com' },
  { name: 'Yandex2', submit: 'https://yandex.com/submit' },
  { name: 'Baidu', submit: 'https://www.baidu.com' },
  { name: 'Baidu2', submit: 'https://www.baidu.com/submit' },
  { name: 'Naver', submit: 'https://www.naver.com' },
  { name: 'Naver2', submit: 'https://www.naver.com/submit' },
  { name: 'Ask', submit: 'https://www.ask.com' },
  { name: 'Ask2', submit: 'https://www.ask.com/submit' },
  { name: 'AOL', submit: 'https://www.aol.com' },
  { name: 'AOL2', submit: 'https://www.aol.com/submit' },
  { name: 'Startpage', submit: 'https://www.startpage.com' },
  { name: 'Startpage2', submit: 'https://www.startpage.com/submit' },
  { name: 'Ecosia', submit: 'https://www.ecosia.org' },
  { name: 'Ecosia2', submit: 'https://www.ecosia.org/submit' },
  { name: 'Qwant', submit: 'https://www.qwant.com' },
  { name: 'Qwant2', submit: 'https://www.qwant.com/submit' },
  { name: 'Brave', submit: 'https://search.brave.com' },
  { name: 'Brave2', submit: 'https://search.brave.com/submit' },
  { name: 'Kagi', submit: 'https://kagi.com' },
  { name: 'Kagi2', submit: 'https://kagi.com/submit' },
  { name: 'You', submit: 'https://you.com' },
  { name: 'You2', submit: 'https://you.com/submit' },
  { name: 'WolframAlpha', submit: 'https://www.wolframalpha.com' },
  { name: 'WolframAlpha2', submit: 'https://www.wolframalpha.com/submit' },
  { name: 'Wikipedia', submit: 'https://en.wikipedia.org' },
  { name: 'Wikipedia2', submit: 'https://en.wikipedia.org/submit' },
  { name: 'Wikidata', submit: 'https://www.wikidata.org' },
  { name: 'Wikidata2', submit: 'https://www.wikidata.org/submit' },
  { name: 'WikiMedia', submit: 'https://commons.wikimedia.org' },
  { name: 'WikiMedia2', submit: 'https://commons.wikimedia.org/submit' },
  { name: 'DMOZ', submit: 'https://www.dmoz.org' },
  { name: 'DMOZ2', submit: 'https://www.dmoz.org/submit' },
  { name: 'Curlie', submit: 'https://curlie.org' },
  { name: 'Curlie2', submit: 'https://curlie.org/submit' },
  { name: 'StartSpa', submit: 'https://www.startspa.com' },
  { name: 'StartSpa2', submit: 'https://www.startspa.com/submit' },
  { name: 'SearchLinks', submit: 'https://www.searchlinks.com' },
  { name: 'SearchLinks2', submit: 'https://www.searchlinks.com/submit' },
  { name: 'Ahrefs', submit: 'https://ahrefs.com' },
  { name: 'Ahrefs2', submit: 'https://ahrefs.com/submit' },
  { name: 'Moz', submit: 'https://moz.com' },
  { name: 'Moz2', submit: 'https://moz.com/submit' },
  { name: 'SEMrush', submit: 'https://www.semrush.com' },
  { name: 'SEMrush2', submit: 'https://www.semrush.com/submit' },
  { name: 'Majestic', submit: 'https://majestic.com' },
  { name: 'Majestic2', submit: 'https://majestic.com/submit' },
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
  console.log(`🚀 Batch 46 - Search Engines & SEO (${DIRECTORIES.length} directories)\n`);
  
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
