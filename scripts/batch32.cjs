const https = require('https');

const DIRECTORIES = [
  { name: 'TestCafe', submit: 'https://testcafe.io' },
  { name: 'Cypress', submit: 'https://www.cypress.io' },
  { name: 'Playwright', submit: 'https://playwright.dev' },
  { name: 'Puppeteer', submit: 'https://pptr.dev' },
  { name: 'Nightwatch', submit: 'https://nightwatchjs.org' },
  { name: 'WebdriverIO', submit: 'https://webdriver.io' },
  { name: 'Jest', submit: 'https://jestjs.io' },
  { name: 'Vitest', submit: 'https://vitest.dev' },
  { name: 'Mocha', submit: 'https://mochajs.org' },
  { name: 'Chai', submit: 'https://www.chaijs.com' },
  { name: 'AVA', submit: 'https://avajs.dev' },
  { name: 'Tape', submit: 'https://github.com/substack/tape' },
  { name: 'Jasmine', submit: 'https://jasmine.github.io' },
  { name: 'Karma', submit: 'https://karma-runner.github.io' },
  { name: 'Enzyme', submit: 'https://enzymejs.github.io/enzyme' },
  { name: 'ReactTesting', submit: 'https://testing-library.com/docs/react-testing-library/intro' },
  { name: 'VueTestUtils', submit: 'https://test-utils.vuejs.org' },
  { name: 'SvelteTesting', submit: 'https://testing-library.com/docs/svelte-testing-library/intro' },
  { name: 'AngularTesting', submit: 'https://angular.io/guide/testing' },
  { name: 'Storybook', submit: 'https://storybook.js.org' },
  { name: 'Ladle', submit: 'https://ladle.dev' },
  { name: 'Chromatic', submit: 'https://www.chromatic.com' },
  { name: 'Percy', submit: 'https://percy.io' },
  { name: 'Applitools', submit: 'https://applitools.com' },
  { name: 'CrossBrowserTesting', submit: 'https://crossbrowsertesting.com' },
  { name: 'BrowserStack', submit: 'https://www.browserstack.com' },
  { name: 'SauceLabs', submit: 'https://saucelabs.com' },
  { name: 'LambdaTest', submit: 'https://www.lambdatest.com' },
  { name: 'TestingBot', submit: 'https://testingbot.com' },
  { name: 'CodeceptJS', submit: 'https://codecept.io' },
  { name: 'Codeception', submit: 'https://codeception.com' },
  { name: 'Behat', submit: 'https://behat.org' },
  { name: 'PHPUnit', submit: 'https://phpunit.de' },
  { name: 'PyTest', submit: 'https://docs.pytest.org' },
  { name: 'Unittest', submit: 'https://docs.python.org/3/library/unittest.html' },
  { name: 'Nose', submit: 'https://nose.readthedocs.io' },
  { name: 'Robot', submit: 'https://robotframework.org' },
  { name: 'RSpec', submit: 'https://rspec.info' },
  { name: 'Minitest', submit: 'https://github.com/seattlerb/minitest' },
  { name: 'Cucumber', submit: 'https://cucumber.io' },
  { name: 'Behave', submit: 'https://behave.readthedocs.io' },
  { name: 'Lettuce', submit: 'https://lettuce.it' },
  { name: 'Spinach', submit: 'https://github.com/codecraft-io/spinach' },
  { name: 'GoConvey', submit: 'https://goconvey.co' },
  { name: 'Testify', submit: 'https://github.com/stretchr/testify' },
  { name: 'Ginkgo', submit: 'https://onsi.github.io/ginkgo' },
  { name: 'FastCheck', submit: 'https://fast-check.dev' },
  { name: 'Stryker', submit: 'https://stryker-mutator.io' },
  { name: 'Wallaby', submit: 'https://wallabyjs.com' },
  { name: 'JestPreview', submit: 'https://www.jest-preview.com' },
  { name: 'MSW', submit: 'https://mswjs.io' },
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
  console.log(`🚀 Batch 32 - Testing (${DIRECTORIES.length} directories)\n`);
  
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
