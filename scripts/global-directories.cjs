#!/usr/bin/env node

/**
 * Global Directories - Asia, Europe, Latin America
 * Run: node scripts/global-directories.cjs
 */

const https = require('https');

const SITE = {
  name: 'U2Tool',
  url: 'https://www.u2tool.com',
  description: 'Free online developer tools - 200+ tools for JSON, Base64, QR codes, passwords, hashing, UUID.',
  email: 'contact@u2tool.com'
};

const DIRECTORIES = [
  // Chinese Platforms
  { name: 'Juejin', url: 'https://juejin.cn/', submit: 'https://juejin.cn/submit' },
  { name: 'SegmentFault', url: 'https://segmentfault.com/', submit: 'https://segmentfault.com/submit' },
  { name: 'OSChina', url: 'https://www.oschina.net/', submit: 'https://www.oschina.net/submit' },
  { name: 'Cnblogs', url: 'https://www.cnblogs.com/', submit: 'https://www.cnblogs.com/submit' },
  { name: 'CSDN', url: 'https://blog.csdn.net/', submit: 'https://blog.csdn.net/submit' },
  { name: '51CTO', url: 'https://blog.51cto.com/', submit: 'https://blog.51cto.com/submit' },
  { name: 'ChinaUnix', url: 'https://www.chinaunix.net/', submit: 'https://www.chinaunix.net/submit' },
  { name: 'ITEye', url: 'https://www.iteye.com/', submit: 'https://www.iteye.com/submit' },
  { name: ' ZhiHu', url: 'https://www.zhihu.com/', submit: 'https://www.zhihu.com/submit' },
  { name: 'Baidu', url: 'https://www.baidu.com/', submit: 'https://www.baidu.com/submit' },
  
  // Japanese Platforms
  { name: 'Qiita', url: 'https://qiita.com/', submit: 'https://qiita.com/submit' },
  { name: 'Hatena', url: 'https://hatena.ne.jp/', submit: 'https://hatena.ne.jp/submit' },
  { name: 'FC2', url: 'https://fc2.com/', submit: 'https://fc2.com/submit' },
  { name: 'Livedoor', url: 'https://livedoor.com/', submit: 'https://livedoor.com/submit' },
  { name: 'YahooJP', url: 'https://www.yahoo.co.jp/', submit: 'https://www.yahoo.co.jp/submit' },
  
  // Korean Platforms
  { name: 'Naver', url: 'https://www.naver.com/', submit: 'https://www.naver.com/submit' },
  { name: 'Kakao', url: 'https://www.kakao.com/', submit: 'https://www.kakao.com/submit' },
  { name: 'NaverCafe', url: 'https://cafe.naver.com/', submit: 'https://cafe.naver.com/submit' },
  
  // Indian Platforms
  { name: 'IndiaTimes', url: 'https://timesofindia.indiatimes.com/', submit: 'https://timesofindia.indiatimes.com/submit' },
  { name: 'Sulekha', url: 'https://www.sulekha.com/', submit: 'https://www.sulekha.com/submit' },
  { name: 'BuzzIn', url: 'https://buzzin.io/', submit: 'https://buzzin.io/submit' },
  { name: 'Iguru', url: 'https://www.iguru.in/', submit: 'https://www.iguru.in/submit' },
  
  // European Platforms
  { name: '01net', url: 'https://www.01net.com/', submit: 'https://www.01net.com/submit' },
  { name: 'Numerama', url: 'https://www.numerama.com/', submit: 'https://www.numerama.com/submit' },
  { name: 'Heise', url: 'https://www.heise.de/', submit: 'https://www.heise.de/submit' },
  { name: 'Chip', url: 'https://www.chip.de/', submit: 'https://www.chip.de/submit' },
  { name: 'TOnline', url: 'https://www.t-online.de/', submit: 'https://www.t-online.de/submit' },
  { name: 'Web.de', url: 'https://web.de/', submit: 'https://web.de/submit' },
  { name: 'GMX', url: 'https://www.gmx.net/', submit: 'https://www.gmx.net/submit' },
  
  // Russian Platforms
  { name: 'Habr', url: 'https://habr.com/', submit: 'https://habr.com/submit' },
  { name: 'VC', url: 'https://vc.ru/', submit: 'https://vc.ru/submit' },
  { name: 'Toster', url: 'https://toster.ru/', submit: 'https://toster.ru/submit' },
  { name: 'MailRu', url: 'https://mail.ru/', submit: 'https://mail.ru/submit' },
  { name: 'Yandex', url: 'https://yandex.ru/', submit: 'https://yandex.ru/submit' },
  
  // Brazilian/Portuguese
  { name: 'Imasters', url: 'https://imasters.com.br/', submit: 'https://imasters.com.br/submit' },
  { name: 'DevMedia', url: 'https://www.devmedia.com.br/', submit: 'https://www.devmedia.com.br/submit' },
  { name: 'Tableless', url: 'https://tableless.com.br/', submit: 'https://tableless.com.br/submit' },
  { name: 'UOL', url: 'https://www.uol.com.br/', submit: 'https://www.uol.com.br/submit' },
  { name: 'Globo', url: 'https://www.globo.com/', submit: 'https://www.globo.com/submit' },
  
  // Spanish
  { name: 'Genbeta', url: 'https://www.genbeta.com/', submit: 'https://www.genbeta.com/submit' },
  { name: 'Incuba', url: 'https://incuba.es/', submit: 'https://incuba.es/submit' },
  { name: 'Bloguers', url: 'https://bloguers.net/', submit: 'https://bloguers.net/submit' },
  { name: 'Marca', url: 'https://www.marca.com/', submit: 'https://www.marca.com/submit' },
  
  // French
  { name: 'LeMonde', url: 'https://www.lemonde.fr/', submit: 'https://www.lemonde.fr/submit' },
  { name: 'LeFigaro', url: 'https://www.lefigaro.fr/', submit: 'https://www.lefigaro.fr/submit' },
  { name: '01netFR', url: 'https://www.01net.com/', submit: 'https://www.01net.com/submit' },
  
  // Arabic
  { name: 'AlArabiya', url: 'https://www.alarabiya.net/', submit: 'https://www.alarabiya.net/submit' },
  { name: 'TechWadi', url: 'https://www.techwadi.com/', submit: 'https://www.techwadi.com/submit' },
  
  // Southeast Asia
  { name: 'TechInAsia', url: 'https://www.techinasia.com/', submit: 'https://www.techinasia.com/submit' },
  { name: 'VNExpress', url: 'https://vnexpress.net/', submit: 'https://vnexpress.net/submit' },
  { name: 'ZingVN', url: 'https://zingnews.vn/', submit: 'https://zingnews.vn/submit' },
  { name: 'Kenh14', url: 'https://kenh14.vn/', submit: 'https://kenh14.vn/submit' },
  
  // Australia
  { name: 'CNETAU', url: 'https://www.cnet.com/', submit: 'https://www.cnet.com/submit' },
  { name: 'PCWorldAU', url: 'https://www.pcworld.idg.com.au/', submit: 'https://www.pcworld.idg.com.au/submit' },
  
  // Canada
  { name: 'CBC', url: 'https://www.cbc.ca/', submit: 'https://www.cbc.ca/submit' },
  { name: 'GlobalCA', url: 'https://globalnews.ca/', submit: 'https://globalnews.ca/submit' },
  
  // More Asia
  { name: 'Hindustan', url: 'https://www.hindustantimes.com/', submit: 'https://www.hindustantimes.com/submit' },
  { name: 'TimesIndia', url: 'https://timesofindia.indiatimes.com/', submit: 'https://timesofindia.indiatimes.com/submit' },
  { name: 'GulfNews', url: 'https://gulfnews.com/', submit: 'https://gulfnews.com/submit' },
  { name: 'Khaleej', url: 'https://www.khaleejtimes.com/', submit: 'https://www.khaleejtimes.com/submit' },
];

function submit(dir) {
  return new Promise((resolve) => {
    try {
      const data = `name=${encodeURIComponent(SITE.name)}&url=${encodeURIComponent(SITE.url)}&description=${encodeURIComponent(SITE.description)}`;
      
      const options = {
        hostname: new URL(dir.submit).hostname,
        port: 443,
        path: new URL(dir.submit).pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,*/*'
        }
      };
      
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const bl = body.toLowerCase();
          const success = bl.includes('thank') || bl.includes('success') || bl.includes('submitted') || bl.includes('received') || bl.includes('added');
          resolve({ name: dir.name, success });
        });
      });
      
      req.on('error', () => resolve({ name: dir.name, success: false }));
      req.setTimeout(10000, () => { req.destroy(); resolve({ name: dir.name, success: false }); });
      
      req.write(data);
      req.end();
    } catch(e) {
      resolve({ name: dir.name, success: false });
    }
  });
}

async function main() {
  console.log(`\n🚀 Global Directories - Asia/Europe/LatAm (${DIRECTORIES.length} directories)\n`);
  
  let successCount = 0;
  
  for (const dir of DIRECTORIES) {
    process.stdout.write(`${dir.name}... `);
    const result = await submit(dir);
    console.log(result.success ? '✅' : '❌');
    if (result.success) successCount++;
    await new Promise(r => setTimeout(r, 1200));
  }
  
  console.log(`\n✅ Total Success: ${successCount}/${DIRECTORIES.length}`);
}

main();
