const https = require('https');

const DIRECTORIES = [
  { name: 'DockerHub', submit: 'https://hub.docker.com' },
  { name: 'Quay', submit: 'https://quay.io' },
  { name: 'GHCR', submit: 'https://github.com/features/packages' },
  { name: 'GCR', submit: 'https://cloud.google.com/container-registry' },
  { name: 'ACR', submit: 'https://azure.microsoft.com/container-registry' },
  { name: 'ECR', submit: 'https://aws.amazon.com/ecr' },
  { name: 'Docker', submit: 'https://www.docker.com' },
  { name: 'Podman', submit: 'https://podman.io' },
  { name: 'Containerd', submit: 'https://containerd.io' },
  { name: 'Rocket', submit: 'https://coreos.com/rocket' },
  { name: 'Kata', submit: 'https://katacontainers.io' },
  { name: 'gVisor', submit: 'https://gvisor.dev' },
  { name: 'SysBox', submit: 'https://github.com/nestybox/sysbox' },
  { name: 'LXC', submit: 'https://linuxcontainers.org' },
  { name: 'LXD', submit: 'https://linuxcontainers.org/lxd' },
  { name: 'Kubernetes', submit: 'https://kubernetes.io' },
  { name: 'K3s', submit: 'https://k3s.io' },
  { name: 'Minikube', submit: 'https://minikube.sigs.k8s.io' },
  { name: 'MicroK8s', submit: 'https://microk8s.io' },
  { name: 'Kind', submit: 'https://kind.sigs.k8s.io' },
  { name: 'KubeEdge', submit: 'https://kubeedge.io' },
  { name: 'Rancher', submit: 'https://rancher.com' },
  { name: 'OpenShift', submit: 'https://www.openshift.com' },
  { name: 'Anthos', submit: 'https://cloud.google.com/anthos' },
  { name: 'EKS', submit: 'https://aws.amazon.com/eks' },
  { name: 'AKS', submit: 'https://azure.microsoft.com/azure-kubernetes-service' },
  { name: 'GKE', submit: 'https://cloud.google.com/kubernetes-engine' },
  { name: 'DOKS', submit: 'https://www.digitalocean.com/products/kubernetes' },
  { name: 'LinodeK8s', submit: 'https://www.linode.com/kubernetes' },
  { name: 'Helm', submit: 'https://helm.sh' },
  { name: 'Kustomize', submit: 'https://kustomize.io' },
  { name: 'Skaffold', submit: 'https://skaffold.dev' },
  { name: 'K9s', submit: 'https://k9scli.io' },
  { name: 'Lens', submit: 'https://k8slens.dev' },
  { name: 'Octant', submit: 'https://octant.dev' },
  { name: 'Portainer2', submit: 'https://www.portainer.io' },
  { name: 'RancherDesktop', submit: 'https://rancher.com/products/rancher-desktop' },
  { name: 'DevSpace', submit: 'https://devspace.sh' },
  { name: 'Tilt', submit: 'https://tilt.dev' },
  { name: 'Sloop', submit: 'https://sloop.dev' },
  { name: 'Arkade', submit: 'https://alexellis.github.io/arkade' },
  { name: 'ArtifactHub', submit: 'https://artifacthub.io' },
  { name: 'ChartMuseum', submit: 'https://chartmuseum.com' },
  { name: 'Harbor', submit: 'https://goharbor.io' },
  { name: 'Jfrog', submit: 'https://jfrog.com' },
  { name: 'Sonatype', submit: 'https://www.sonatype.com' },
  { name: 'Nexus', submit: 'https://www.sonatype.com/nexus-repository-sonatype' },
  { name: 'Cloudsmith', submit: 'https://cloudsmith.com' },
  { name: 'PackageCloud', submit: 'https://packagecloud.io' },
  { name: 'MyGet', submit: 'https://www.myget.org' },
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
  console.log(`🚀 Batch 30 - Containers & Kubernetes (${DIRECTORIES.length} directories)\n`);
  
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
