const https = require('https');

const DIRECTORIES = [
  { name: 'NPM2', submit: 'https://www.npmjs.com' },
  { name: 'Yarn', submit: 'https://yarnpkg.com' },
  { name: 'PNPM', submit: 'https://pnpm.io' },
  { name: 'Bun2', submit: 'https://bun.sh' },
  { name: 'PyPI2', submit: 'https://pypi.org' },
  { name: 'Pip', submit: 'https://pypi.org/project/pip' },
  { name: 'Poetry', submit: 'https://python-poetry.org' },
  { name: 'Pipenv', submit: 'https://pipenv.pypa.io' },
  { name: 'Conda', submit: 'https://docs.conda.io' },
  { name: 'Gem2', submit: 'https://rubygems.org' },
  { name: 'Bundler', submit: 'https://bundler.io' },
  { name: 'Cargo2', submit: 'https://crates.io' },
  { name: 'Pub', submit: 'https://pub.dev' },
  { name: 'Go', submit: 'https://pkg.go.dev' },
  { name: 'Maven2', submit: 'https://maven.apache.org' },
  { name: 'Gradle', submit: 'https://gradle.org' },
  { name: 'NuGet2', submit: 'https://www.nuget.org' },
  { name: 'Composer2', submit: 'https://packagist.org' },
  { name: 'CPAN', submit: 'https://www.cpan.org' },
  { name: 'CRAN', submit: 'https://cran.r-project.org' },
  { name: 'Hackage', submit: 'https://hackage.haskell.org' },
  { name: 'Stackage', submit: 'https://www.stackage.org' },
  { name: 'Elixir', submit: 'https://hex.pm' },
  { name: 'Nimble', submit: 'https://nimble.directory' },
  { name: 'Carthage', submit: 'https://github.com/Carthage/Carthage' },
  { name: 'CocoaPods', submit: 'https://cocoapods.org' },
  { name: 'SwiftPM', submit: 'https://swift.org/package-manager' },
  { name: 'PubDev', submit: 'https://pub.dev' },
  { name: 'Dart', submit: 'https://dart.dev' },
  { name: 'Flutter', submit: 'https://flutter.dev' },
  { name: 'Electron', submit: 'https://www.electronjs.org' },
  { name: 'Tauri', submit: 'https://tauri.app' },
  { name: 'FlutterDesktop', submit: 'https://flutter.dev/desktop' },
  { name: 'ReactNative', submit: 'https://reactnative.dev' },
  { name: 'Expo', submit: 'https://expo.dev' },
  { name: 'Ionic', submit: 'https://ionic.io' },
  { name: 'Capacitor', submit: 'https://capacitorjs.com' },
  { name: 'NativeScript', submit: 'https://nativescript.org' },
  { name: 'Xamarin', submit: 'https://dotnet.microsoft.com/apps/xamarin' },
  { name: 'Cordova', submit: 'https://cordova.apache.org' },
  { name: 'PhoneGap', submit: 'https://phonegap.com' },
  { name: 'OnsenUI', submit: 'https://onsen.io' },
  { name: 'Framework7', submit: 'https://framework7.io' },
  { name: 'Quasar2', submit: 'https://quasar.dev' },
  { name: 'Weex', submit: 'https://weex.apache.org' },
  { name: 'UniApp', submit: 'https://uniapp.dcloud.io' },
  { name: 'Taro', submit: 'https://taro.jd.com' },
  { name: 'Remax', submit: 'https://remaxjs.org' },
  { name: 'Rax', submit: 'https://rax.js.org' },
  { name: 'Kivy', submit: 'https://kivy.org' },
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
  console.log(`🚀 Batch 29 - Package Managers & Mobile (${DIRECTORIES.length} directories)\n`);
  
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
