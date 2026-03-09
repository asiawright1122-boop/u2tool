const https = require('https');

const DIRECTORIES = [
  { name: 'ChromeWebStore', submit: 'https://chrome.google.com/webstore' },
  { name: 'ChromeWebStore2', submit: 'https://chrome.google.com/webstore/submit' },
  { name: 'FirefoxAddons', submit: 'https://addons.mozilla.org' },
  { name: 'FirefoxAddons2', submit: 'https://addons.mozilla.org/developers' },
  { name: 'EdgeAddons', submit: 'https://microsoftedge.microsoft.com/addons' },
  { name: 'EdgeAddons2', submit: 'https://microsoftedge.microsoft.com/addons/submit' },
  { name: 'SafariExtensions', submit: 'https://developer.apple.com/safari-extensions' },
  { name: 'SafariExtensions2', submit: 'https://developer.apple.com/safari-extensions/submit' },
  { name: 'AppStore', submit: 'https://appstoreconnect.apple.com' },
  { name: 'AppStore2', submit: 'https://appstoreconnect.apple.com/submit' },
  { name: 'GooglePlay', submit: 'https://play.google.com/console' },
  { name: 'GooglePlay2', submit: 'https://play.google.com/console/submit' },
  { name: 'F-Droid', submit: 'https://f-droid.org' },
  { name: 'F-Droid2', submit: 'https://f-droid.org/submit' },
  { name: 'GitHub', submit: 'https://github.com' },
  { name: 'GitHub2', submit: 'https://github.com/new' },
  { name: 'GitLab', submit: 'https://gitlab.com' },
  { name: 'GitLab2', submit: 'https://gitlab.com/projects/new' },
  { name: 'Bitbucket', submit: 'https://bitbucket.org' },
  { name: 'Bitbucket2', submit: 'https://bitbucket.org/repo/create' },
  { name: 'SourceForge', submit: 'https://sourceforge.net' },
  { name: 'SourceForge2', submit: 'https://sourceforge.net/projects/new' },
  { name: 'CodeBerg', submit: 'https://codeberg.org' },
  { name: 'CodeBerg2', submit: 'https://codeberg.org/repo/create' },
  { name: 'Gitea', submit: 'https://gitea.io' },
  { name: 'Gitea2', submit: 'https://gitea.io/repo/create' },
  { name: 'NPM', submit: 'https://www.npmjs.com' },
  { name: 'NPM2', submit: 'https://www.npmjs.com/package/new' },
  { name: 'Yarn', submit: 'https://yarnpkg.com' },
  { name: 'Yarn2', submit: 'https://yarnpkg.com/package/new' },
  { name: 'PyPI', submit: 'https://pypi.org' },
  { name: 'PyPI2', submit: 'https://pypi.org/account/register' },
  { name: 'RubyGems', submit: 'https://rubygems.org' },
  { name: 'RubyGems2', submit: 'https://rubygems.org/pages/new' },
  { name: 'Cargo', submit: 'https://crates.io' },
  { name: 'Cargo2', submit: 'https://crates.io/new' },
  { name: 'Pub', submit: 'https://pub.dev' },
  { name: 'Pub2', submit: 'https://pub.dev/new' },
  { name: 'Packagist', submit: 'https://packagist.org' },
  { name: 'Packagist2', submit: 'https://packagist.org/submit' },
  { name: 'Maven', submit: 'https://maven.apache.org' },
  { name: 'Maven2', submit: 'https://maven.apache.org/submit' },
  { name: 'NuGet', submit: 'https://www.nuget.org' },
  { name: 'NuGet2', submit: 'https://www.nuget.org/submit' },
  { name: 'CPAN', submit: 'https://www.cpan.org' },
  { name: 'CPAN2', submit: 'https://www.cpan.org/submit' },
  { name: 'CRAN', submit: 'https://cran.r-project.org' },
  { name: 'CRAN2', submit: 'https://cran.r-project.org/submit' },
  { name: 'Hackage', submit: 'https://hackage.haskell.org' },
  { name: 'Hackage2', submit: 'https://hackage.haskell.org/upload' },
  { name: 'CocoaPods', submit: 'https://cocoapods.org' },
  { name: 'CocoaPods2', submit: 'https://cocoapods.org/submit' },
  { name: 'Homebrew', submit: 'https://brew.sh' },
  { name: 'Homebrew2', submit: 'https://github.com/Homebrew/brew' },
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
  console.log(`🚀 Batch 47 - App Stores & Package Managers (${DIRECTORIES.length} directories)\n`);
  
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
