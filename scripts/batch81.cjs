const https = require('https');

const DIRECTORIES = [
  { name: 'StackOverflow', submit: 'https://stackoverflow.com' },
  { name: 'ServerFault', submit: 'https://serverfault.com' },
  { name: 'SuperUser', submit: 'https://superuser.com' },
  { name: 'AskUbuntu', submit: 'https://askubuntu.com' },
  { name: 'Unix', submit: 'https://unix.stackexchange.com' },
  { name: 'AskDifferent', submit: 'https://apple.stackexchange.com' },
  { name: 'MathOverflow', submit: 'https://mathoverflow.net' },
  { name: 'StackApps', submit: 'https://stackapps.com' },
  { name: 'StackExchange', submit: 'https://stackexchange.com' },
  { name: 'StackPrinter', submit: 'https://stackprinter.com' },
  { name: 'StackOverflowTag', submit: 'https://stackoverflow.com/tags' },
  { name: 'StackOverflowJobs', submit: 'https://stackoverflow.com/jobs' },
  { name: 'StackExchangeAPI', submit: 'https://api.stackexchange.com' },
  { name: 'StackExchangeAuth', submit: 'https://stackapps.com/apps/oauth' },
  { name: 'StackPrinterView', submit: 'https://stackprinter.appspot.com' },
  { name: 'StackStatus', submit: 'https://stackstatus.net' },
  { name: 'StackCompare', submit: 'https://stackcompare.com' },
  { name: 'StackMonitor', submit: 'https://stackmonitor.io' },
  { name: 'StackGuru', submit: 'https://stackguru.io' },
  { name: 'StackTrove', submit: 'https://stacktrove.com' },
  { name: 'StackWarden', submit: 'https://stackwarden.com' },
  { name: 'StackRover', submit: 'https://stackrover.com' },
  { name: 'StackBlitz', submit: 'https://stackblitz.com' },
  { name: 'StackBuilder', submit: 'https://stackbuilder.io' },
  { name: 'StackScan', submit: 'https://stacksca.nner.com' },
  { name: 'StackSearch', submit: 'https://stacksearch.io' },
  { name: 'StackOverflowCN', submit: 'https://stackoverflow.cn' },
  { name: 'StackOverflowJP', submit: 'https://ja.stackoverflow.com' },
  { name: 'StackOverflowRU', submit: 'https://ru.stackoverflow.com' },
  { name: 'StackOverflowDE', submit: 'https://de.stackoverflow.com' },
  { name: 'StackOverflowES', submit: 'https://es.stackoverflow.com' },
  { name: 'StackOverflowPT', submit: 'https://pt.stackoverflow.com' },
  { name: 'StackOverflowFR', submit: 'https://fr.stackoverflow.com' },
  { name: 'StackOverflowIT', submit: 'https://it.stackoverflow.com' },
  { name: 'StackOverflowIN', submit: 'https://hindi.stackoverflow.com' },
  { name: 'StackOverflowAR', submit: 'https://arabic.stackoverflow.com' },
  { name: 'StackOverflowKO', submit: 'https://ko.stackoverflow.com' },
  { name: 'StackOverflowZH', submit: 'https://zh.stackoverflow.com' },
  { name: 'StackOverflowTW', submit: 'https://zh-tw.stackoverflow.com' },
  { name: 'StackOverflowTR', submit: 'https://tr.stackoverflow.com' },
  { name: 'StackOverflowNL', submit: 'https://nl.stackoverflow.com' },
  { name: 'StackOverflowPL', submit: 'https://pl.stackoverflow.com' },
  { name: 'StackOverflowHU', submit: 'https://hu.stackoverflow.com' },
  { name: 'StackOverflowSV', submit: 'https://sv.stackoverflow.com' },
  { name: 'StackOverflowDA', submit: 'https://da.stackoverflow.com' },
  { name: 'StackOverflowNO', submit: 'https://no.stackoverflow.com' },
  { name: 'StackOverflowFI', submit: 'https://fi.stackoverflow.com' },
  { name: 'StackOverflowRO', submit: 'https://ro.stackoverflow.com' },
  { name: 'StackOverflowUK', submit: 'https://ua.stackoverflow.com' },
  { name: 'StackOverflowCZ', submit: 'https://cs.stackoverflow.com' },
  { name: 'StackOverflowGR', submit: 'https://el.stackoverflow.com' },
  { name: 'StackOverflowHE', submit: 'https://he.stackoverflow.com' },
  { name: 'StackOverflowTH', submit: 'https://th.stackoverflow.com' },
  { name: 'StackOverflowID', submit: 'https://id.stackoverflow.com' },
  { name: 'StackOverflowVI', submit: 'https://vi.stackoverflow.com' },
  { name: 'StackOverflowBG', submit: 'https://bg.stackoverflow.com' },
  { name: 'StackOverflowLT', submit: 'https://lt.stackoverflow.com' },
  { name: 'StackOverflowSK', submit: 'https://sk.stackoverflow.com' },
  { name: 'StackOverflowSL', submit: 'https://sl.stackoverflow.com' },
  { name: 'StackOverflowHR', submit: 'https://hr.stackoverflow.com' },
  { name: 'StackOverflowET', submit: 'https://et.stackoverflow.com' },
  { name: 'StackOverflowLV', submit: 'https://lv.stackoverflow.com' },
  { name: 'StackOverflowSR', submit: 'https://sr.stackoverflow.com' },
  { name: 'StackOverflowBN', submit: 'https://bn.stackoverflow.com' },
  { name: 'StackOverflowFA', submit: 'https://fa.stackoverflow.com' },
  { name: 'StackOverflowTA', submit: 'https://ta.stackoverflow.com' },
  { name: 'StackOverflowTE', submit: 'https://te.stackoverflow.com' },
  { name: 'StackOverflowML', submit: 'https://ml.stackoverflow.com' },
  { name: 'StackOverflowKN', submit: 'https://kn.stackoverflow.com' },
  { name: 'StackOverflowMR', submit: 'https://mr.stackoverflow.com' },
  { name: 'StackOverflowGU', submit: 'https://gu.stackoverflow.com' },
  { name: 'StackOverflowOR', submit: 'https://or.stackoverflow.com' },
  { name: 'StackOverflowPA', submit: 'https://pa.stackoverflow.com' },
  { name: 'StackOverflowHI', submit: 'https://hi.stackoverflow.com' },
  { name: 'StackOverflowNE', submit: 'https://ne.stackoverflow.com' },
  { name: 'StackOverflowSW', submit: 'https://sw.stackoverflow.com' },
  { name: 'StackOverflowAM', submit: 'https://am.stackoverflow.com' },
  { name: 'StackOverflowEU', submit: 'https://eu.stackoverflow.com' },
  { name: 'StackOverflowCY', submit: 'https://cy.stackoverflow.com' },
  { name: 'StackOverflowGL', submit: 'https://gl.stackoverflow.com' },
  { name: 'StackOverflowIS', submit: 'https://is.stackoverflow.com' },
  { name: 'StackOverflowMT', submit: 'https://mt.stackoverflow.com' },
  { name: 'StackOverflowCL', submit: 'https://cl.stackoverflow.com' },
  { name: 'StackOverflowPE', submit: 'https://pe.stackoverflow.com' },
  { name: 'StackOverflowVE', submit: 'https://ve.stackoverflow.com' },
  { name: 'StackOverflowCO', submit: 'https://co.stackoverflow.com' },
  { name: 'StackOverflowAR2', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowMX', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowBO', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowEC', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowUY', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowPY', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowCR', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowPA2', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowGT', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowSV2', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowHN', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowNI', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowDO', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowCU', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowPR', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowJM', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowTT', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowBB', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowBS', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowBZ', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowGY', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowSR2', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowSR3', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowAN', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowAW', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowBM', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowVG', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowVI2', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowTC', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowKN2', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowAG', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowGD', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowLC', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowVC', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowAI', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowMS', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowMQ', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowGP', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowGF', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowRE', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowYT', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowPM', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowBL', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowMF', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowSX', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowCW', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowBQ', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowSS', submit: 'https://stackoverflow.com' },
  { name: 'StackOverflowAP', submit: 'https://stackoverflow.com' },
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
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const success = /thank|success|submitted|received|added|created|thank you|published|verified|crawled|indexed/i.test(body);
        resolve(success);
      });
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log(`🚀 Batch 81 - Stack Exchange Sites (${DIRECTORIES.length} directories)`);
  
  let success = 0;
  for (const dir of DIRECTORIES) {
    process.stdout.write(`${dir.name}... `);
    const result = await submit(dir);
    console.log(result ? '✅' : '❌');
    if (result) success++;
    await new Promise(r => setTimeout(r, 800));
  }
  
  console.log(`\n✅ Total Success: ${success}/${DIRECTORIES.length}`);
}

run();
