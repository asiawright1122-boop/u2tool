const https = require('https');

const DIRECTORIES = [
  { name: 'Git', submit: 'https://git-scm.com' },
  { name: 'GitHub', submit: 'https://github.com' },
  { name: 'GitLab2', submit: 'https://gitlab.com' },
  { name: 'Bitbucket2', submit: 'https://bitbucket.org' },
  { name: 'SourceForge2', submit: 'https://sourceforge.net' },
  { name: 'Gitee', submit: 'https://gitee.com' },
  { name: 'GitKraken', submit: 'https://www.gitkraken.com' },
  { name: 'Tower', submit: 'https://www.git-tower.com' },
  { name: 'Sourcetree', submit: 'https://www.sourcetreeapp.com' },
  { name: 'Fork', submit: 'https://git-fork.com' },
  { name: 'GitHubDesktop', submit: 'https://desktop.github.com' },
  { name: 'GitHubCLI', submit: 'https://cli.github.com' },
  { name: 'GitLabCLI', submit: 'https://gitlab.com/gitlab-org/gitlab-ce' },
  { name: 'GitExtensions', submit: 'https://gitextensions.github.io' },
  { name: 'TortoiseGit', submit: 'https://tortoisegit.org' },
  { name: 'GitFlow', submit: 'https://nvie.com/posts/introducing-gitflow' },
  { name: 'GitHubFlow', submit: 'https://github.flow.io' },
  { name: 'GitLabFlow', submit: 'https://about.gitlab.com/topics/version-control/what-is-gitlab-flow' },
  { name: 'ConventionalCommits', submit: 'https://www.conventionalcommits.org' },
  { name: 'CommitLint', submit: 'https://commitlint.js.org' },
  { name: 'Husky', submit: 'https://typicode.github.io/husky' },
  { name: 'LintStaged', submit: 'https://github.com/okonet/lint-staged' },
  { name: 'StandardVersion', submit: 'https://github.com/conventional-changelog/standard-version' },
  { name: 'ReleaseIt', submit: 'https://github.com/release-it/release-it' },
  { name: 'Changesets', submit: 'https://github.com/changesets/changesets' },
  { name: 'SemanticRelease', submit: 'https://semantic-release.org' },
  { name: 'AutoVersioning', submit: 'https://github.com/int128/auto-versioning' },
  { name: 'npm', submit: 'https://www.npmjs.com' },
  { name: 'Yarn2', submit: 'https://yarnpkg.com' },
  { name: 'PNPM2', submit: 'https://pnpm.io' },
  { name: 'Bun3', submit: 'https://bun.sh' },
  { name: 'NPMRegistry', submit: 'https://registry.npmjs.org' },
  { name: 'NPMScripts', submit: 'https://docs.npmjs.com/cli/v10/using-npm/scripts' },
  { name: 'NPMPackage', submit: 'https://docs.npmjs.com/cli/v10/commands/npm-pack' },
  { name: 'NPMPublish', submit: 'https://docs.npmjs.com/cli/v10/commands/npm-publish' },
  { name: 'YarnBerry', submit: 'https://yarnpkg.com/features/workspaces' },
  { name: 'Lerna', submit: 'https://lerna.js.org' },
  { name: 'Nx', submit: 'https://nx.dev' },
  { name: 'Turborepo', submit: 'https://turbo.build/repo' },
  { name: 'Moon', submit: 'https://moon.dev' },
  { name: 'Rush', submit: 'https://rushjs.io' },
  { name: 'Changesets2', submit: 'https://changesets.github.io' },
  { name: 'Beam', submit: 'https://moon.dev' },
  { name: 'Agrippa', submit: 'https://github.com/nicoespeon/agrippa' },
  { name: 'Plop', submit: 'https://plopjs.com' },
  { name: 'Hygen', submit: 'https://www.hygen.io' },
  { name: 'Yeoman', submit: 'https://yeoman.io' },
  { name: 'Scaffolding', submit: 'https://scaffolding.js.org' },
  { name: 'CreateReactApp', submit: 'https://create-react-app.dev' },
  { name: 'ViteCreate', submit: 'https://vitejs.dev/guide' },
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
  console.log(`🚀 Batch 31 - Git & NPM (${DIRECTORIES.length} directories)\n`);
  
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
