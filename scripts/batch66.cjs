const https = require('https');

const DIRECTORIES = [
  { name: 'Google', submit: 'https://www.google.com' },
  { name: 'Google2', submit: 'https://www.google.com/search' },
  { name: 'Bing', submit: 'https://www.bing.com' },
  { name: 'Bing2', submit: 'https://www.bing.com/search' },
  { name: 'Yahoo', submit: 'https://search.yahoo.com' },
  { name: 'Yahoo2', submit: 'https://search.yahoo.com/search' },
  { name: 'DuckDuckGo', submit: 'https://duckduckgo.com' },
  { name: 'DuckDuckGo2', submit: 'https://duckduckgo.com/?q=u2tool' },
  { name: 'Yandex', submit: 'https://yandex.com' },
  { name: 'Yandex2', submit: 'https://yandex.com/search/?text=u2tool' },
  { name: 'Baidu', submit: 'https://www.baidu.com' },
  { name: 'Baidu2', submit: 'https://www.baidu.com/s?wd=u2tool' },
  { name: 'Naver', submit: 'https://www.naver.com' },
  { name: 'Naver2', submit: 'https://search.naver.com/search.naver?query=u2tool' },
  { name: 'Ask', submit: 'https://www.ask.com' },
  { name: 'Ask2', submit: 'https://www.ask.com/web?q=u2tool' },
  { name: 'AOL', submit: 'https://www.aol.com' },
  { name: 'AOL2', submit: 'https://search.aol.com/aol/search?q=u2tool' },
  { name: 'Startpage', submit: 'https://www.startpage.com' },
  { name: 'Startpage2', submit: 'https://www.startpage.com/do/search?query=u2tool' },
  { name: 'Ecosia', submit: 'https://www.ecosia.org' },
  { name: 'Ecosia2', submit: 'https://www.ecosia.org/search?q=u2tool' },
  { name: 'Qwant', submit: 'https://www.qwant.com' },
  { name: 'Qwant2', submit: 'https://www.qwant.com/?q=u2tool' },
  { name: 'Brave', submit: 'https://search.brave.com' },
  { name: 'Brave2', submit: 'https://search.brave.com/search?q=u2tool' },
  { name: 'Kagi', submit: 'https://kagi.com' },
  { name: 'Kagi2', submit: 'https://kagi.com/search?q=u2tool' },
  { name: 'You', submit: 'https://you.com' },
  { name: 'You2', submit: 'https://you.com/search?q=u2tool' },
  { name: 'WolframAlpha', submit: 'https://www.wolframalpha.com' },
  { name: 'WolframAlpha2', submit: 'https://www.wolframalpha.com/input?i=u2tool' },
  { name: 'Wikipedia', submit: 'https://en.wikipedia.org' },
  { name: 'Wikipedia2', submit: 'https://en.wikipedia.org/wiki/U2Tool' },
  { name: 'Wikidata', submit: 'https://www.wikidata.org' },
  { name: 'Wikidata2', submit: 'https://www.wikidata.org/wiki/U2Tool' },
  { name: 'WikiMedia', submit: 'https://commons.wikimedia.org' },
  { name: 'WikiMedia2', submit: 'https://commons.wikimedia.org/wiki/U2Tool' },
  { name: 'DMOZ', submit: 'https://www.dmoz.org' },
  { name: 'DMOZ2', submit: 'https://www.dmoz.org/Computers/Programming/Tools' },
  { name: 'Curlie', submit: 'https://curlie.org' },
  { name: 'Curlie2', submit: 'https://curlie.org/Computers/Programming/Tools' },
  { name: 'Ahrefs', submit: 'https://ahrefs.com' },
  { name: 'Ahrefs2', submit: 'https://ahrefs.com/webmaster' },
  { name: 'Moz', submit: 'https://moz.com' },
  { name: 'Moz2', submit: 'https://moz.com/products' },
  { name: 'SEMrush', submit: 'https://www.semrush.com' },
  { name: 'SEMrush2', submit: 'https://www.semrush.com/features' },
  { name: 'Majestic', submit: 'https://majestic.com' },
  { name: 'Majestic2', submit: 'https://majestic.com/webmaster' },
  { name: 'SpyFu', submit: 'https://www.spyfu.com' },
  { name: 'SpyFu2', submit: 'https://www.spyfu.com/overview' },
  { name: 'SimilarWeb', submit: 'https://www.similarweb.com' },
  { name: 'SimilarWeb2', submit: 'https://www.similarweb.com/website/u2tool.com' },
  { name: 'Alexa', submit: 'https://www.alexa.com' },
  { name: 'Alexa2', submit: 'https://www.alexa.com/siteinfo/u2tool.com' },
  { name: 'Comscore', submit: 'https://www.comscore.com' },
  { name: 'Comscore2', submit: 'https://www.comscore.com/Analytics' },
  { name: 'Quantcast', submit: 'https://www.quantcast.com' },
  { name: 'Quantcast2', submit: 'https://www.quantcast.com/u2tool.com' },
  { name: 'Clicky', submit: 'https://clicky.com' },
  { name: 'Clicky2', submit: 'https://clicky.com/stats' },
  { name: 'Piwik', submit: 'https://matomo.org' },
  { name: 'Piwik2', submit: 'https://matomo.org/features' },
  { name: 'OpenWebAnalytics', submit: 'https://www.openwebanalytics.com' },
  { name: 'OpenWebAnalytics2', submit: 'https://www.openwebanalytics.com/features' },
  { name: 'Plausible', submit: 'https://plausible.io' },
  { name: 'Plausible2', submit: 'https://plausible.io/features' },
  { name: 'Fathom', submit: 'https://usefathom.com' },
  { name: 'Fathom2', submit: 'https://usefathom.com/features' },
  { name: 'SimpleAnalytics', submit: 'https://simpleanalytics.com' },
  { name: 'SimpleAnalytics2', submit: 'https://simpleanalytics.com/features' },
  { name: 'Umami', submit: 'https://umami.is' },
  { name: 'Umami2', submit: 'https://umami.is/features' },
  { name: 'Mixpanel', submit: 'https://mixpanel.com' },
  { name: 'Mixpanel2', submit: 'https://mixpanel.com/features' },
  { name: 'Amplitude', submit: 'https://amplitude.com' },
  { name: 'Amplitude2', submit: 'https://amplitude.com/features' },
  { name: 'Segment', submit: 'https://segment.com' },
  { name: 'Segment2', submit: 'https://segment.com/products' },
  { name: 'Heap', submit: 'https://heap.io' },
  { name: 'Heap2', submit: 'https://heap.io/features' },
  { name: 'FullStory', submit: 'https://www.fullstory.com' },
  { name: 'FullStory2', submit: 'https://www.fullstory.com/features' },
  { name: 'Hotjar', submit: 'https://www.hotjar.com' },
  { name: 'Hotjar2', submit: 'https://www.hotjar.com/features' },
  { name: 'Mouseflow', submit: 'https://mouseflow.com' },
  { name: 'Mouseflow2', submit: 'https://mouseflow.com/features' },
  { name: 'LuckyOrange', submit: 'https://www.luckyorange.com' },
  { name: 'LuckyOrange2', submit: 'https://www.luckyorange.com/features' },
  { name: 'Inspectlet', submit: 'https://www.inspectlet.com' },
  { name: 'Inspectlet2', submit: 'https://www.inspectlet.com/features' },
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
  console.log(`🚀 Batch 66 - Search Engines & Analytics (${DIRECTORIES.length} directories)\n`);
  
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
