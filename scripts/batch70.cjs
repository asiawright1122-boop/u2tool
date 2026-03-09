const https = require('https');

const DIRECTORIES = [
  { name: 'Cypress', submit: 'https://www.cypress.io' },
  { name: 'Cypress2', submit: 'https://www.cypress.io/features' },
  { name: 'Playwright', submit: 'https://playwright.dev' },
  { name: 'Playwright2', submit: 'https://playwright.dev/docs' },
  { name: 'Puppeteer', submit: 'https://pptr.dev' },
  { name: 'Puppeteer2', submit: 'https://pptr.dev/docs' },
  { name: 'TestCafe', submit: 'https://testcafe.io' },
  { name: 'TestCafe2', submit: 'https://testcafe.io/features' },
  { name: 'Nightwatch', submit: 'https://nightwatchjs.org' },
  { name: 'Nightwatch2', submit: 'https://nightwatchjs.org/features' },
  { name: 'WebdriverIO', submit: 'https://webdriver.io' },
  { name: 'WebdriverIO2', submit: 'https://webdriver.io/features' },
  { name: 'Jest', submit: 'https://jestjs.io' },
  { name: 'Jest2', submit: 'https://jestjs.io/docs' },
  { name: 'Vitest', submit: 'https://vitest.dev' },
  { name: 'Vitest2', submit: 'https://vitest.dev/guide' },
  { name: 'Mocha', submit: 'https://mochajs.org' },
  { name: 'Mocha2', submit: 'https://mochajs.org/api' },
  { name: 'Chai', submit: 'https://www.chaijs.com' },
  { name: 'Chai2', submit: 'https://www.chaijs.com/api' },
  { name: 'AVA', submit: 'https://avajs.dev' },
  { name: 'AVA2', submit: 'https://avajs.dev/docs' },
  { name: 'Tape', submit: 'https://github.com/substack/tape' },
  { name: 'Tape2', submit: 'https://github.com/substack/tape#usage' },
  { name: 'Jasmine', submit: 'https://jasmine.github.io' },
  { name: 'Jasmine2', submit: 'https://jasmine.github.io/pages/docs' },
  { name: 'Karma', submit: 'https://karma-runner.github.io' },
  { name: 'Karma2', submit: 'https://karma-runner.github.io/latest/config/configuration-file' },
  { name: 'Enzyme', submit: 'https://enzymejs.github.io/enzyme' },
  { name: 'Enzyme2', submit: 'https://enzymejs.github.io/enzyme/docs/api' },
  { name: 'ReactTesting', submit: 'https://testing-library.com' },
  { name: 'ReactTesting2', submit: 'https://testing-library.com/docs/react-testing-library/intro' },
  { name: 'VueTestUtils', submit: 'https://test-utils.vuejs.org' },
  { name: 'VueTestUtils2', submit: 'https://test-utils.vuejs.org/guide' },
  { name: 'SvelteTesting', submit: 'https://testing-library.com/docs/svelte-testing-library/intro' },
  { name: 'AngularTesting', submit: 'https://angular.io/guide/testing' },
  { name: 'Storybook', submit: 'https://storybook.js.org' },
  { name: 'Storybook2', submit: 'https://storybook.js.org/docs' },
  { name: 'Ladle', submit: 'https://ladle.dev' },
  { name: 'Ladle2', submit: 'https://ladle.dev/docs' },
  { name: 'Chromatic', submit: 'https://www.chromatic.com' },
  { name: 'Chromatic2', submit: 'https://www.chromatic.com/features' },
  { name: 'Percy', submit: 'https://percy.io' },
  { name: 'Percy2', submit: 'https://percy.io/features' },
  { name: 'Applitools', submit: 'https://applitools.com' },
  { name: 'Applitools2', submit: 'https://applitools.com/features' },
  { name: 'CrossBrowserTesting', submit: 'https://crossbrowsertesting.com' },
  { name: 'CrossBrowserTesting2', submit: 'https://crossbrowsertesting.com/features' },
  { name: 'BrowserStack', submit: 'https://www.browserstack.com' },
  { name: 'BrowserStack2', submit: 'https://www.browserstack.com/products' },
  { name: 'SauceLabs', submit: 'https://saucelabs.com' },
  { name: 'SauceLabs2', submit: 'https://saucelabs.com/products' },
  { name: 'LambdaTest', submit: 'https://www.lambdatest.com' },
  { name: 'LambdaTest2', submit: 'https://www.lambdatest.com/platform' },
  { name: 'TestingBot', submit: 'https://testingbot.com' },
  { name: 'TestingBot2', submit: 'https://testingbot.com/features' },
  { name: 'CodeceptJS', submit: 'https://codecept.io' },
  { name: 'CodeceptJS2', submit: 'https://codecept.io/quickstart' },
  { name: 'Codeception', submit: 'https://codeception.com' },
  { name: 'Codeception2', submit: 'https://codeception.com/docs' },
  { name: 'Behat', submit: 'https://behat.org' },
  { name: 'Behat2', submit: 'https://behat.org/en/latest/quick_start' },
  { name: 'PHPUnit', submit: 'https://phpunit.de' },
  { name: 'PHPUnit2', submit: 'https://phpunit.de/documentation' },
  { name: 'PyTest', submit: 'https://docs.pytest.org' },
  { name: 'PyTest2', submit: 'https://docs.pytest.org/en/latest' },
  { name: 'Unittest', submit: 'https://docs.python.org/3/library/unittest.html' },
  { name: 'Unittest2', submit: 'https://docs.python.org/3/library/unittest' },
  { name: 'Nose', submit: 'https://nose.readthedocs.io' },
  { name: 'Nose2', submit: 'https://nose.readthedocs.io/en/latest' },
  { name: 'Robot', submit: 'https://robotframework.org' },
  { name: 'Robot2', submit: 'https://robotframework.org/quickstart' },
  { name: 'RSpec', submit: 'https://rspec.info' },
  { name: 'RSpec2', submit: 'https://rspec.info/documentation' },
  { name: 'Minitest', submit: 'https://github.com/seattlerb/minitest' },
  { name: 'Minitest2', submit: 'https://github.com/seattlerb/minitest' },
  { name: 'Cucumber', submit: 'https://cucumber.io' },
  { name: 'Cucumber2', submit: 'https://cucumber.io/docs' },
  { name: 'Behave', submit: 'https://behave.readthedocs.io' },
  { name: 'Behave2', submit: 'https://behave.readthedocs.io/en/latest' },
  { name: 'GoConvey', submit: 'https://goconvey.co' },
  { name: 'GoConvey2', submit: 'https://goconvey.co/docs' },
  { name: 'Testify', submit: 'https://github.com/stretchr/testify' },
  { name: 'Testify2', submit: 'https://github.com/stretchr/testify' },
  { name: 'Ginkgo', submit: 'https://onsi.github.io/ginkgo' },
  { name: 'Ginkgo2', submit: 'https://onsi.github.io/ginkgo/getting_started' },
  { name: 'FastCheck', submit: 'https://fast-check.dev' },
  { name: 'FastCheck2', submit: 'https://fast-check.dev/quick-start' },
  { name: 'Stryker', submit: 'https://stryker-mutator.io' },
  { name: 'Stryker2', submit: 'https://stryker-mutator.io/docs' },
  { name: 'Wallaby', submit: 'https://wallabyjs.com' },
  { name: 'Wallaby2', submit: 'https://wallabyjs.com/docs' },
  { name: 'JestPreview', submit: 'https://www.jest-preview.com' },
  { name: 'JestPreview2', submit: 'https://www.jest-preview.com/examples' },
  { name: 'MSW', submit: 'https://mswjs.io' },
  { name: 'MSW2', submit: 'https://mswjs.io/docs' },
  { name: 'MirageJS', submit: 'https://miragejs.com' },
  { name: 'MirageJS2', submit: 'https://miragejs.com/docs' },
  { name: 'JSONServer', submit: 'https://github.com/typicode/json-server' },
  { name: 'JSONServer2', submit: 'https://github.com/typicode/json-server#getting-started' },
  { name: 'Mockoon', submit: 'https://mockoon.com' },
  { name: 'Mockoon2', submit: 'https://mockoon.com/docs' },
  { name: 'Postman', submit: 'https://www.postman.com' },
  { name: 'Postman2', submit: 'https://www.postman.com/product' },
  { name: 'Insomnia', submit: 'https://insomnia.rest' },
  { name: 'Insomnia2', submit: 'https://insomnia.rest/docs' },
  { name: 'Hoppscotch', submit: 'https://hoppscotch.io' },
  { name: 'Hoppscotch2', submit: 'https://hoppscotch.io/features' },
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
  console.log(`🚀 Batch 70 - Testing & API Tools (${DIRECTORIES.length} directories)\n`);
  
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
