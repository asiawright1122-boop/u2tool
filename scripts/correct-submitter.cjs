const https = require('https');

const INDEXNOW_KEY = 'u2tool2026indexnowkey';

const URLS_TO_SUBMIT = [
  'https://u2tool.com',
  'https://u2tool.com/en',
  'https://u2tool.com/zh',
];

async function indexNowSubmit(engine, urls) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      host: 'u2tool.com',
      key: INDEXNOW_KEY,
      keyLocation: `https://u2tool.com/${INDEXNOW_KEY}.txt`,
      urlList: urls
    });

    const options = {
      hostname: engine.host,
      path: engine.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      resolve({ name: engine.name, status: res.statusCode, success: res.statusCode === 200 || res.statusCode === 202 });
    });
    req.on('error', () => resolve({ name: engine.name, status: 0, success: false }));
    req.on('timeout', () => { req.destroy(); resolve({ name: engine.name, status: 0, success: false }); });
    req.write(data);
    req.end();
  });
}

async function waybackSave(url) {
  return new Promise((resolve) => {
    https.get(`https://web.archive.org/save/${url}`, (res) => {
      resolve({ name: 'Wayback Machine', status: res.statusCode, success: res.statusCode === 200 || res.statusCode === 302 });
    }).on('error', () => resolve({ name: 'Wayback Machine', status: 0, success: false }));
  });
}

async function submitToDirectory(dir) {
  return new Promise((resolve) => {
    const postData = new URLSearchParams(dir.data || {
      url: 'https://u2tool.com',
      name: 'U2Tool',
      description: 'Free online developer tools - 200+ utilities for JSON, XML, text, encoding, decoding, hashing, color conversion and more',
      email: 'contact@u2tool.com'
    }).toString();

    const url = new URL(dir.submit);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const success = res.statusCode >= 200 && res.statusCode < 400;
        resolve({ name: dir.name, status: res.statusCode, success });
      });
    });
    req.on('error', () => resolve({ name: dir.name, status: 0, success: false }));
    req.on('timeout', () => { req.destroy(); resolve({ name: dir.name, status: 0, success: false }); });
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('🚀 U2Tool 正确提交脚本 v3\n');
  
  console.log('📌 第一步: IndexNow 提交到搜索引擎');
  console.log('='.repeat(50));
  
  const indexNowEngines = [
    { name: 'Bing', host: 'www.bing.com', path: '/indexnow' },
    { name: 'Yandex', host: 'yandex.com', path: '/indexnow' },
    { name: 'Naver', host: 'searchadvisor.naver.com', path: '/indexnow' },
    { name: 'Seznam', host: 'search.seznam.cz', path: '/indexnow' },
    { name: 'Yep', host: 'indexnow.yep.com', path: '/indexnow' },
  ];
  
  for (const engine of indexNowEngines) {
    process.stdout.write(`  ${engine.name}... `);
    const result = await indexNowSubmit(engine, URLS_TO_SUBMIT);
    console.log(`${result.success ? '✅' : '❌'} (HTTP ${result.status})`);
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('\n📌 第二步: Wayback Machine 归档');
  console.log('='.repeat(50));
  
  for (const url of URLS_TO_SUBMIT) {
    process.stdout.write(`  ${url}... `);
    const result = await waybackSave(url);
    console.log(`${result.success ? '✅' : '❌'}`);
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n📌 第三步: 目录网站提交');
  console.log('='.repeat(50));
  
  const directories = [
    { name: 'Softpedia', submit: 'https://www.softpedia.com/submit/', data: { url: 'https://u2tool.com', email: 'contact@u2tool.com' } },
    { name: 'AlternativeTo', submit: 'https://alternativeto.net/submit/', data: { url: 'https://u2tool.com' } },
    { name: 'SaaSHub', submit: 'https://www.saashub.com/submit', data: { url: 'https://u2tool.com' } },
    { name: 'Betalist', submit: 'https://betalist.com/submit', data: { url: 'https://u2tool.com' } },
    { name: 'ProductHunt', submit: 'https://www.producthunt.com/posts/new', data: { url: 'https://u2tool.com' } },
    { name: 'ScrubTheWeb', submit: 'https://www.scrubtheweb.com/submit/', data: { url: 'https://u2tool.com' } },
    { name: 'SoMuch', submit: 'https://www.somuch.com/submit/', data: { url: 'https://u2tool.com' } },
    { name: 'FreeWebSubmission', submit: 'https://www.freewebsubmission.com/submit/', data: { url: 'https://u2tool.com' } },
    { name: 'PRLog', submit: 'https://www.prlog.org/submit/', data: { url: 'https://u2tool.com' } },
    { name: 'WebWiki', submit: 'https://www.webwiki.com/submit/', data: { url: 'https://u2tool.com' } },
  ];
  
  for (const dir of directories) {
    process.stdout.write(`  ${dir.name}... `);
    const result = await submitToDirectory(dir);
    console.log(`${result.success ? '✅' : '❌'} (HTTP ${result.status})`);
    await new Promise(r => setTimeout(r, 800));
  }
  
  console.log('\n📌 需要手动提交的高价值网站');
  console.log('='.repeat(50));
  console.log('  1. ProductHunt: https://www.producthunt.com/posts/new (需登录)');
  console.log('  2. G2: https://www.g2.com/products/new (需登录)');
  console.log('  3. Capterra: https://www.capterra.com/submit-software (需登录)');
  console.log('  4. AlternativeTo: https://alternativeto.net/submit/ (需登录)');
  console.log('  5. There\'s An AI For That: https://theresanaiforthat.com/submit/ ($49起)');
  console.log('  6. Futurepedia: https://www.futurepedia.io/submit');
  console.log('  7. Toolify: https://www.toolify.io/submit');
  console.log('  8. StackShare: https://stackshare.io/submissions/new (需登录)');
  console.log('  9. Reddit: https://reddit.com/r/webdev/submit');
  console.log('  10. Hacker News: https://news.ycombinator.com/submit');
  
  console.log('\n✅ 自动提交完成！');
}

run();
