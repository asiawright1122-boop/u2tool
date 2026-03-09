const https = require('https');

const DIRECTORIES = [
  { name: 'G2Category', submit: 'https://www.g2.com/categories/developer-tools' },
  { name: 'CapterraDev', submit: 'https://www.capterra.com/developer-tools/' },
  { name: 'GetAppDev', submit: 'https://www.getapp.com/developer-tools-software/' },
  { name: 'SoftwareAdvice', submit: 'https://www.softwareadvice.com/developer-tools/' },
  { name: 'TrustRadiusDev', submit: 'https://www.trustradius.com/developer-tools' },
  { name: 'PeerSpotDev', submit: 'https://www.peerspot.com/products/developer-tools' },
  { name: 'AlternativeToDev', submit: 'https://alternativeto.net/category/developer-tools/' },
  { name: 'StackShareDev', submit: 'https://stackshare.io/developer-tools' },
  { name: 'SlantDev', submit: 'https://www.slant.dev' },
  { name: 'LibHuntDev', submit: 'https://www.libhunt.com/tags/developer-tools' },
  { name: 'OpenSourceDev', submit: 'https://opensourcemiles.com' },
  { name: 'SaaSHubDev', submit: 'https://www.saashub.com/developer-tools' },
  { name: 'ProductHuntTools', submit: 'https://www.producthunt.com/categories/developer-tools' },
  { name: 'BetaListDev', submit: 'https://betalist.com' },
  { name: 'LaunchingNextDev', submit: 'https://www.launchingnext.com' },
  { name: 'Futurepedia', submit: 'https://www.futurepedia.io' },
  { name: 'Toolify', submit: 'https://www.toolify.io' },
  { name: 'TheresAnAI', submit: 'https://theresanaiforthat.com' },
  { name: 'AIToolsHub', submit: 'https://www.aitoolshub.com' },
  { name: 'ToolAI', submit: 'https://www.toolai.io' },
  { name: 'AllInOneTools', submit: 'https://allinonetools.com' },
  { name: 'ToolBucks', submit: 'https://www.toolbucks.io' },
  { name: 'AIInspector', submit: 'https://www.aiinspector.io' },
  { name: 'AIToolsDirectory', submit: 'https://www.aitoolsdirectory.com' },
  { name: 'TopTools', submit: 'https://toptools.ai' },
  { name: 'AIHub', submit: 'https://www.aihub.dev' },
  { name: 'ToolifyAI', submit: 'https://toolify.ai' },
  { name: 'GPTTools', submit: 'https://www.gpttools.io' },
  { name: 'AIFreeTools', submit: 'https://www.aifreetools.com' },
  { name: 'AIToolNet', submit: 'https://www.aitoolnet.com' },
  { name: 'CodingCategory', submit: 'https://www.codingcategory.com' },
  { name: 'CodeWealthy', submit: 'https://www.codewealthy.com' },
  { name: 'DevUtils', submit: 'https://devutils.com' },
  { name: 'OnlineTools', submit: 'https://onlinetools.com' },
  { name: 'MiniTools', submit: 'https://www.minitools.io' },
  { name: 'WebToolHub', submit: 'https://www.webtoolhub.com' },
  { name: 'ToolList', submit: 'https://www.toollist.org' },
  { name: 'DevToolsChecker', submit: 'https://www.devtoolschecker.com' },
  { name: 'CodeCalculator', submit: 'https://codecalculator.com' },
  { name: 'DevSearch', submit: 'https://www.devsearch.org' },
  { name: 'ToolsFinder', submit: 'https://www.toolsfinder.com' },
  { name: 'DevToolStore', submit: 'https://www.devtoolstore.com' },
  { name: 'FreeDevTools', submit: 'https://www.freedevtools.com' },
  { name: 'DevToolbox', submit: 'https://www.devtoolbox.io' },
  { name: 'WebDevTools', submit: 'https://webdevtools.io' },
  { name: 'CodeGenerator', submit: 'https://codegenerator.io' },
  { name: 'JSONFormatter', submit: 'https://jsonformatter.org' },
  { name: 'XMLFormatter', submit: 'https://xmlformatter.org' },
  { name: 'HashTools', submit: 'https://hashtools.io' },
  { name: 'ColorTools', submit: 'https://colortools.io' },
  { name: 'EncoderTools', submit: 'https://encodertools.io' },
  { name: 'RegexTester', submit: 'https://regextester.org' },
  { name: 'JWTDecoder', submit: 'https://jwtdecoder.io' },
  { name: 'Base64Decoder', submit: 'https://base64decoder.org' },
  { name: 'URLEncoder', submit: 'https://urlencoder.org' },
  { name: 'HTMLPrettify', submit: 'https://htmlprettify.com' },
  { name: 'CSSEditor', submit: 'https://csseditor.io' },
  { name: 'JSEditor', submit: 'https://jseditor.io' },
  { name: 'PythonRunner', submit: 'https://pythonrunner.io' },
  { name: 'BashRunner', submit: 'https://bashrunner.io' },
  { name: 'SQLFormatter', submit: 'https://sqlformatter.org' },
  { name: 'MarkdownEditor', submit: 'https://markdowneditor.io' },
  { name: 'DiffChecker', submit: 'https://diffchecker.org' },
  { name: 'TextCompare', submit: 'https://textcompare.org' },
  { name: 'JSONCompare', submit: 'https://jsoncompare.org' },
  { name: 'XMLCompare', submit: 'https://xmlcompare.org' },
  { name: 'CSVTools', submit: 'https://csvtools.io' },
  { name: 'ExcelTools', submit: 'https://exceltools.io' },
  { name: 'PDFTools', submit: 'https://pdftools.io' },
  { name: 'ImageTools', submit: 'https://imagetools.io' },
  { name: 'VideoTools', submit: 'https://videotools.io' },
  { name: 'AudioTools', submit: 'https://audiotools.io' },
  { name: 'CryptoTools', submit: 'https://cryptotools.io' },
  { name: 'SecurityTools', submit: 'https://securitytools.io' },
  { name: 'NetworkTools', submit: 'https://networktools.io' },
  { name: 'DevOpsTools', submit: 'https://devopstools.io' },
  { name: 'CloudTools', submit: 'https://cloudtools.io' },
  { name: 'GitTools', submit: 'https://gittools.io' },
  { name: 'APITools', submit: 'https://apitools.io' },
  { name: 'RestTools', submit: 'https://resttools.io' },
  { name: 'GraphQLTools', submit: 'https://graphqltools.io' },
  { name: 'WebSocketTools', submit: 'https://websockettools.io' },
  { name: 'WebRTC', submit: 'https://webrtc.tools' },
  { name: 'WebhookTester', submit: 'https://webhooktester.io' },
  { name: 'PostmanAPI', submit: 'https://www.postman.com' },
  { name: 'Insomnia', submit: 'https://insomnia.rest' },
  { name: 'Hoppscotch', submit: 'https://hoppscotch.io' },
  { name: 'RapidAPI', submit: 'https://rapidapi.com' },
  { name: 'PublicAPIs', submit: 'https://publicapis.io' },
  { name: 'AnyAPI', submit: 'https://anyapi.io' },
  { name: 'APIFinder', submit: 'https://apifinder.com' },
  { name: 'APIDirectory', submit: 'https://apidirectory.io' },
  { name: 'DevCommunity', submit: 'https://devcommunity.com' },
  { name: 'DevForums', submit: 'https://devforums.io' },
  { name: 'CodeMentor', submit: 'https://codementor.io' },
  { name: 'Toptal', submit: 'https://www.toptal.com' },
  { name: 'UpworkDev', submit: 'https://www.upwork.com' },
  { name: 'FiverrDev', submit: 'https://www.fiverr.com' },
  { name: 'FreelancerDev', submit: 'https://www.freelancer.com' },
  { name: 'GuruDev', submit: 'https://www.guru.com' },
  { name: 'PeoplePerHour', submit: 'https://www.peopleperhour.com' },
  { name: 'DevJobsScanner', submit: 'https://devjobsscanner.com' },
  { name: 'WeWorkRemotely', submit: 'https://weworkremotely.com' },
  { name: 'RemoteOK', submit: 'https://remoteok.com' },
  { name: 'AngelList', submit: 'https://angel.co' },
  { name: 'LinkedInJobs', submit: 'https://www.linkedin.com/jobs' },
  { name: 'IndeedDev', submit: 'https://www.indeed.com' },
  { name: 'Glassdoor', submit: 'https://www.glassdoor.com' },
  { name: 'StackOverflowJobs', submit: 'https://stackoverflow.com/jobs' },
  { name: 'GitHubJobs', submit: 'https://jobs.github.com' },
  { name: 'ProductHuntJobs', submit: 'https://www.producthunt.com/jobs' },
  { name: 'HackerRank', submit: 'https://www.hackerrank.com' },
  { name: 'LeetCode', submit: 'https://leetcode.com' },
  { name: 'CodeWars', submit: 'https://www.codewars.com' },
  { name: 'HackerEarth', submit: 'https://www.hackerearth.com' },
  { name: 'TopCoder', submit: 'https://www.topcoder.com' },
  { name: 'Codeforces', submit: 'https://codeforces.com' },
  { name: 'AtCoder', submit: 'https://atcoder.jp' },
  { name: 'InterviewBit', submit: 'https://www.interviewbit.com' },
  { name: 'Interviewing', submit: 'https://interviewing.io' },
  { name: 'Pramp', submit: 'https://www.pramp.com' },
  { name: 'Exercism', submit: 'https://exercism.io' },
  { name: 'CodeCademyPlus', submit: 'https://codecademy.com' },
  { name: 'Treehouse', submit: 'https://teamtreehouse.com' },
  { name: 'Pluralsight', submit: 'https://www.pluralsight.com' },
  { name: 'UdemyDev', submit: 'https://www.udemy.com' },
  { name: 'CourseraDev', submit: 'https://www.coursera.org' },
  { name: 'edXDev', submit: 'https://www.edx.org' },
  { name: 'Udacity', submit: 'https://www.udacity.com' },
  { name: 'Skillshare', submit: 'https://www.skillshare.com' },
  { name: 'LinkedInLearning', submit: 'https://www.linkedin.com/learning' },
  { name: 'FrontendMasters', submit: 'https://frontendmasters.com' },
  { name: 'Egghead', submit: 'https://egghead.io' },
  { name: 'Scrimba', submit: 'https://scrimba.com' },
  { name: 'Academind', submit: 'https://academind.com' },
  { name: 'NetNinja', submit: 'https://netninja.com' },
  { name: 'TraversyMedia', submit: 'https://traversymedia.com' },
  { name: 'LevelUpTuts', submit: 'https://leveluptutorials.com' },
  { name: 'DesignCode', submit: 'https://designcode.io' },
  { name: 'SwiftUI', submit: 'https://developer.apple.com/swiftui' },
  { name: 'KotlinLang', submit: 'https://kotlinlang.org' },
  { name: 'RustLang', submit: 'https://www.rust-lang.org' },
  { name: 'GoLang', submit: 'https://go.dev' },
  { name: 'TypeScriptLang', submit: 'https://www.typescriptlang.org' },
  { name: 'PythonOrg', submit: 'https://www.python.org' },
  { name: 'RubyLang', submit: 'https://www.ruby-lang.org' },
  { name: 'PHPLang', submit: 'https://www.php.net' },
  { name: 'JavaLang', submit: 'https://www.java.com' },
  { name: 'CSharpLang', submit: 'https://docs.microsoft.com/en-us/dotnet/csharp' },
  { name: 'CPPLang', submit: 'https://isocpp.org' },
  { name: 'SwiftLang', submit: 'https://docs.swift.org/swift-book' },
  { name: 'KotlinAndroid', submit: 'https://developer.android.com/kotlin' },
  { name: 'FlutterDev', submit: 'https://flutter.dev' },
  { name: 'ReactNative', submit: 'https://reactnative.dev' },
  { name: 'IonicFramework', submit: 'https://ionicframework.com' },
  { name: 'Xamarin', submit: 'https://dotnet.microsoft.com/apps/xamarin' },
  { name: 'ElectronJS', submit: 'https://www.electronjs.org' },
  { name: 'NWJS', submit: 'https://nwjs.io' },
  { name: 'TauriApp', submit: 'https://tauri.app' },
  { name: 'NodeJS', submit: 'https://nodejs.org' },
  { name: 'DenoDeploy', submit: 'https://deno.com' },
  { name: 'BunLang', submit: 'https://bun.sh' },
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
  console.log(`🚀 Batch 80 - Dev Tools, Jobs & Learning (${DIRECTORIES.length} directories)`);
  
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
