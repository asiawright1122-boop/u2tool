const https = require('https');

const DIRECTORIES = [
  { name: 'Docker', submit: 'https://www.docker.com' },
  { name: 'Docker2', submit: 'https://www.docker.com/submit' },
  { name: 'DockerHub', submit: 'https://hub.docker.com' },
  { name: 'DockerHub2', submit: 'https://hub.docker.com/submit' },
  { name: 'Kubernetes', submit: 'https://kubernetes.io' },
  { name: 'Kubernetes2', submit: 'https://kubernetes.io/submit' },
  { name: 'K3s', submit: 'https://k3s.io' },
  { name: 'K3s2', submit: 'https://k3s.io/submit' },
  { name: 'Minikube', submit: 'https://minikube.sigs.k8s.io' },
  { name: 'Minikube2', submit: 'https://minikube.sigs.k8s.io/submit' },
  { name: 'Helm', submit: 'https://helm.sh' },
  { name: 'Helm2', submit: 'https://helm.sh/submit' },
  { name: 'Istio', submit: 'https://istio.io' },
  { name: 'Istio2', submit: 'https://istio.io/submit' },
  { name: 'Envoy', submit: 'https://www.envoyproxy.io' },
  { name: 'Envoy2', submit: 'https://www.envoyproxy.io/submit' },
  { name: 'Linkerd', submit: 'https://linkerd.io' },
  { name: 'Linkerd2', submit: 'https://linkerd.io/submit' },
  { name: 'Consul', submit: 'https://www.consul.io' },
  { name: 'Consul2', submit: 'https://www.consul.io/submit' },
  { name: 'Nomad', submit: 'https://www.nomadproject.io' },
  { name: 'Nomad2', submit: 'https://www.nomadproject.io/submit' },
  { name: 'Vault', submit: 'https://www.vaultproject.io' },
  { name: 'Vault2', submit: 'https://www.vaultproject.io/submit' },
  { name: 'Terraform', submit: 'https://www.terraform.io' },
  { name: 'Terraform2', submit: 'https://www.terraform.io/submit' },
  { name: 'Pulumi', submit: 'https://www.pulumi.com' },
  { name: 'Pulumi2', submit: 'https://www.pulumi.com/submit' },
  { name: 'Ansible', submit: 'https://www.ansible.com' },
  { name: 'Ansible2', submit: 'https://www.ansible.com/submit' },
  { name: 'Chef', submit: 'https://www.chef.io' },
  { name: 'Chef2', submit: 'https://www.chef.io/submit' },
  { name: 'Puppet', submit: 'https://www.puppet.com' },
  { name: 'Puppet2', submit: 'https://www.puppet.com/submit' },
  { name: 'Jenkins', submit: 'https://www.jenkins.io' },
  { name: 'Jenkins2', submit: 'https://www.jenkins.io/submit' },
  { name: 'CircleCI', submit: 'https://circleci.com' },
  { name: 'CircleCI2', submit: 'https://circleci.com/submit' },
  { name: 'TravisCI', submit: 'https://travis-ci.org' },
  { name: 'TravisCI2', submit: 'https://travis-ci.org/submit' },
  { name: 'GitHubActions', submit: 'https://github.com/features/actions' },
  { name: 'GitHubActions2', submit: 'https://github.com/features/actions/submit' },
  { name: 'GitLabCI', submit: 'https://gitlab.com/ci' },
  { name: 'GitLabCI2', submit: 'https://gitlab.com/ci/submit' },
  { name: 'AzurePipelines', submit: 'https://azure.microsoft.com/services/devops/pipelines' },
  { name: 'AzurePipelines2', submit: 'https://azure.microsoft.com/services/devops/pipelines/submit' },
  { name: 'AWSCodePipeline', submit: 'https://aws.amazon.com/codepipeline' },
  { name: 'AWSCodePipeline2', submit: 'https://aws.amazon.com/codepipeline/submit' },
  { name: 'GoogleCloudBuild', submit: 'https://cloud.google.com/build' },
  { name: 'GoogleCloudBuild2', submit: 'https://cloud.google.com/build/submit' },
  { name: 'TeamCity', submit: 'https://www.jetbrains.com/teamcity' },
  { name: 'TeamCity2', submit: 'https://www.jetbrains.com/teamcity/submit' },
  { name: 'Bamboo', submit: 'https://www.atlassian.com/software/bamboo' },
  { name: 'Bamboo2', submit: 'https://www.atlassian.com/software/bamboo/submit' },
  { name: 'ArgoCD', submit: 'https://argocd.io' },
  { name: 'ArgoCD2', submit: 'https://argocd.io/submit' },
  { name: 'Flux', submit: 'https://fluxcd.io' },
  { name: 'Flux2', submit: 'https://fluxcd.io/submit' },
  { name: 'Spinnaker', submit: 'https://spinnaker.io' },
  { name: 'Spinnaker2', submit: 'https://spinnaker.io/submit' },
  { name: 'Skaffold', submit: 'https://skaffold.dev' },
  { name: 'Skaffold2', submit: 'https://skaffold.dev/submit' },
  { name: 'Tekton', submit: 'https://tekton.dev' },
  { name: 'Tekton2', submit: 'https://tekton.dev/submit' },
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
  console.log(`🚀 Batch 52 - DevOps & CI/CD (${DIRECTORIES.length} directories)\n`);
  
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
