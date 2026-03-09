const https = require('https');

const DIRECTORIES = [
  { name: 'GitHub', submit: 'https://github.com' },
  { name: 'GitHub2', submit: 'https://github.com/trending' },
  { name: 'GitHub3', submit: 'https://github.com/explore' },
  { name: 'GitLab', submit: 'https://gitlab.com/explore' },
  { name: 'Bitbucket', submit: 'https://bitbucket.org/product' },
  { name: 'SourceForge', submit: 'https://sourceforge.net' },
  { name: 'Codeberg', submit: 'https://codeberg.org' },
  { name: 'Gitea', submit: 'https://gitea.io' },
  { name: 'Gogs', submit: 'https://gogs.io' },
  { name: 'GitHubActions', submit: 'https://github.com/features/actions' },
  { name: 'GitHubPackages', submit: 'https://github.com/features/packages' },
  { name: 'GitHubPages', submit: 'https://pages.github.com' },
  { name: 'GitHubCopilot', submit: 'https://github.com/features/copilot' },
  { name: 'GitHubCodespaces', submit: 'https://github.com/features/codespaces' },
  { name: 'GitHubMobile', submit: 'https://github.com/mobile' },
  { name: 'GitHubEnterprise', submit: 'https://github.com/enterprise' },
  { name: 'GitLabCI', submit: 'https://docs.gitlab.com/ee/ci' },
  { name: 'GitLabRunner', submit: 'https://docs.gitlab.com/runner' },
  { name: 'GitLabPages', submit: 'https://docs.gitlab.com/ee/user/project/pages' },
  { name: 'BitbucketPipelines', submit: 'https://bitbucket.org/product/features/pipelines' },
  { name: 'BitbucketCloud', submit: 'https://bitbucket.org/product/cloud' },
  { name: 'CircleCI', submit: 'https://circleci.com' },
  { name: 'TravisCI', submit: 'https://travis-ci.org' },
  { name: 'Jenkins', submit: 'https://www.jenkins.io' },
  { name: 'GitHubActions2', submit: 'https://github.com/features/actions' },
  { name: 'GitLabCI2', submit: 'https://gitlab.com/ci' },
  { name: 'BitbucketCI', submit: 'https://bitbucket.org/product/ci' },
  { name: 'AzurePipelines', submit: 'https://azure.microsoft.com/services/devops/pipelines' },
  { name: 'AWSCodePipeline', submit: 'https://aws.amazon.com/codepipeline' },
  { name: 'GoogleCloudBuild', submit: 'https://cloud.google.com/build' },
  { name: 'TeamCity', submit: 'https://www.jetbrains.com/teamcity' },
  { name: 'Bamboo', submit: 'https://www.atlassian.com/software/bamboo' },
  { name: 'GitLabCD', submit: 'https://about.gitlab.com/features/cd' },
  { name: 'ArgoCD', submit: 'https://argocd.io' },
  { name: 'Flux', submit: 'https://fluxcd.io' },
  { name: 'Spinnaker', submit: 'https://spinnaker.io' },
  { name: 'Skaffold', submit: 'https://skaffold.dev' },
  { name: 'Tektite', submit: 'https://tekton.dev' },
  { name: 'JenkinsX', submit: 'https://jenkins-x.io' },
  { name: 'GitHubActions3', submit: 'https://docs.github.com/en/actions' },
  { name: 'GitLabCI3', submit: 'https://docs.gitlab.com/ee/ci' },
  { name: 'BitbucketCI2', submit: 'https://support.atlassian.com' },
  { name: 'CircleCI2', submit: 'https://circleci.com/docs' },
  { name: 'TravisCI2', submit: 'https://docs.travis-ci.com' },
  { name: 'Codeship', submit: 'https://codeship.com' },
  { name: 'Semaphore', submit: 'https://semaphoreci.com' },
  { name: 'Drone', submit: 'https://www.drone.io' },
  { name: 'Woodpecker', submit: 'https://woodpecker-ci.org' },
  { name: 'Buildkite', submit: 'https://buildkite.com' },
  { name: 'Nevercode', submit: 'https://nevercode.io' },
  { name: 'Codemagic', submit: 'https://codemagic.io' },
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
  console.log(`🚀 Batch 39 - Git & CI/CD (${DIRECTORIES.length} directories)\n`);
  
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
