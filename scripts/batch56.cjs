const https = require('https');

const DIRECTORIES = [
  { name: 'GitHubActions', submit: 'https://github.com/features/actions' },
  { name: 'GitHubActions2', submit: 'https://github.com/features/actions/submit' },
  { name: 'GitHubPackages', submit: 'https://github.com/features/packages' },
  { name: 'GitHubPackages2', submit: 'https://github.com/features/packages/submit' },
  { name: 'GitHubPages', submit: 'https://pages.github.com' },
  { name: 'GitHubPages2', submit: 'https://pages.github.com/submit' },
  { name: 'GitHubCopilot', submit: 'https://github.com/features/copilot' },
  { name: 'GitHubCopilot2', submit: 'https://github.com/features/copilot/submit' },
  { name: 'GitHubCodespaces', submit: 'https://github.com/features/codespaces' },
  { name: 'GitHubCodespaces2', submit: 'https://github.com/features/codespaces/submit' },
  { name: 'GitHubMobile', submit: 'https://github.com/mobile' },
  { name: 'GitHubMobile2', submit: 'https://github.com/mobile/submit' },
  { name: 'GitHubEnterprise', submit: 'https://github.com/enterprise' },
  { name: 'GitHubEnterprise2', submit: 'https://github.com/enterprise/submit' },
  { name: 'GitLab', submit: 'https://gitlab.com' },
  { name: 'GitLab2', submit: 'https://gitlab.com/submit' },
  { name: 'GitLabCI', submit: 'https://docs.gitlab.com/ee/ci' },
  { name: 'GitLabCI2', submit: 'https://docs.gitlab.com/ee/ci/submit' },
  { name: 'GitLabRunner', submit: 'https://docs.gitlab.com/runner' },
  { name: 'GitLabRunner2', submit: 'https://docs.gitlab.com/runner/submit' },
  { name: 'GitLabPages', submit: 'https://docs.gitlab.com/ee/user/project/pages' },
  { name: 'GitLabPages2', submit: 'https://docs.gitlab.com/ee/user/project/pages/submit' },
  { name: 'Bitbucket', submit: 'https://bitbucket.org' },
  { name: 'Bitbucket2', submit: 'https://bitbucket.org/submit' },
  { name: 'BitbucketPipelines', submit: 'https://bitbucket.org/product/features/pipelines' },
  { name: 'BitbucketPipelines2', submit: 'https://bitbucket.org/product/features/pipelines/submit' },
  { name: 'SourceForge', submit: 'https://sourceforge.net' },
  { name: 'SourceForge2', submit: 'https://sourceforge.net/submit' },
  { name: 'Codeberg', submit: 'https://codeberg.org' },
  { name: 'Codeberg2', submit: 'https://codeberg.org/submit' },
  { name: 'Gitea', submit: 'https://gitea.io' },
  { name: 'Gitea2', submit: 'https://gitea.io/submit' },
  { name: 'Gogs', submit: 'https://gogs.io' },
  { name: 'Gogs2', submit: 'https://gogs.io/submit' },
  { name: 'Phabricator', submit: 'https://www.phacility.com' },
  { name: 'Phabricator2', submit: 'https://www.phacility.com/submit' },
  { name: 'AzureDevOps', submit: 'https://azure.microsoft.com/services/devops' },
  { name: 'AzureDevOps2', submit: 'https://azure.microsoft.com/services/devops/submit' },
  { name: 'AWSCodeCommit', submit: 'https://aws.amazon.com/codecommit' },
  { name: 'AWSCodeCommit2', submit: 'https://aws.amazon.com/codecommit/submit' },
  { name: 'GoogleCloudSource', submit: 'https://cloud.google.com/source-repositories' },
  { name: 'GoogleCloudSource2', submit: 'https://cloud.google.com/source-repositories/submit' },
  { name: 'Launchpad', submit: 'https://launchpad.net' },
  { name: 'Launchpad2', submit: 'https://launchpad.net/submit' },
  { name: 'SourceHut', submit: 'https://sourcehut.org' },
  { name: 'SourceHut2', submit: 'https://sourcehut.org/submit' },
  { name: 'Pagure', submit: 'https://pagure.io' },
  { name: 'Pagure2', submit: 'https://pagure.io/submit' },
  { name: 'Assembla', submit: 'https://www.assembla.com' },
  { name: 'Assembla2', submit: 'https://www.assembla.com/submit' },
  { name: 'Beanstalk', submit: 'https://beanstalkapp.com' },
  { name: 'Beanstalk2', submit: 'https://beanstalkapp.com/submit' },
  { name: 'FogBugz', submit: 'https://www.fogcreek.com/fogbugz' },
  { name: 'FogBugz2', submit: 'https://www.fogcreek.com/fogbugz/submit' },
  { name: 'Perforce', submit: 'https://www.perforce.com' },
  { name: 'Perforce2', submit: 'https://www.perforce.com/submit' },
  { name: 'PlasticSCM', submit: 'https://www.plasticscm.com' },
  { name: 'PlasticSCM2', submit: 'https://www.plasticscm.com/submit' },
  { name: 'SVN', submit: 'https://subversion.apache.org' },
  { name: 'SVN2', submit: 'https://subversion.apache.org/submit' },
  { name: 'Mercurial', submit: 'https://www.mercurial-scm.org' },
  { name: 'Mercurial2', submit: 'https://www.mercurial-scm.org/submit' },
  { name: 'Bazaar', submit: 'https://bazaar.canonical.com' },
  { name: 'Bazaar2', submit: 'https://bazaar.canonical.com/submit' },
  { name: 'Darcs', submit: 'https://darcs.net' },
  { name: 'Darcs2', submit: 'https://darcs.net/submit' },
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
  console.log(`🚀 Batch 56 - Version Control (${DIRECTORIES.length} directories)\n`);
  
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
