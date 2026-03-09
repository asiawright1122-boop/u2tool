const https = require('https');

const DIRECTORIES = [
  { name: 'Docker', submit: 'https://www.docker.com' },
  { name: 'DockerHub', submit: 'https://hub.docker.com' },
  { name: 'DockerDocs', submit: 'https://docs.docker.com' },
  { name: 'Podman', submit: 'https://podman.io' },
  { name: 'PodmanDocs', submit: 'https://docs.podman.io' },
  { name: 'Kubernetes', submit: 'https://kubernetes.io' },
  { name: 'K8sDocs', submit: 'https://kubernetes.io/docs' },
  { name: 'K3s', submit: 'https://k3s.io' },
  { name: 'K3sDocs', submit: 'https://docs.k3s.io' },
  { name: 'Minikube', submit: 'https://minikube.sigs.k8s.io' },
  { name: 'MinikubeDocs', submit: 'https://minikube.sigs.k8s.io/docs' },
  { name: 'Helm', submit: 'https://helm.sh' },
  { name: 'HelmDocs', submit: 'https://helm.sh/docs' },
  { name: 'Istio', submit: 'https://istio.io' },
  { name: 'IstioDocs', submit: 'https://istio.io/latest/docs' },
  { name: 'Envoy', submit: 'https://www.envoyproxy.io' },
  { name: 'EnvoyDocs', submit: 'https://www.envoyproxy.io/docs' },
  { name: 'Linkerd', submit: 'https://linkerd.io' },
  { name: 'LinkerdDocs', submit: 'https://linkerd.io/2.14/getting-started' },
  { name: 'Consul', submit: 'https://www.consul.io' },
  { name: 'ConsulDocs', submit: 'https://www.consul.io/docs' },
  { name: 'Nomad', submit: 'https://www.nomadproject.io' },
  { name: 'NomadDocs', submit: 'https://www.nomadproject.io/docs' },
  { name: 'Vault', submit: 'https://www.vaultproject.io' },
  { name: 'VaultDocs', submit: 'https://developer.hashicorp.com/vault/docs' },
  { name: 'Terraform', submit: 'https://www.terraform.io' },
  { name: 'TerraformDocs', submit: 'https://developer.hashicorp.com/terraform/docs' },
  { name: 'Pulumi', submit: 'https://www.pulumi.com' },
  { name: 'PulumiDocs', submit: 'https://www.pulumi.com/docs' },
  { name: 'Ansible', submit: 'https://www.ansible.com' },
  { name: 'AnsibleDocs', submit: 'https://docs.ansible.com' },
  { name: 'Chef', submit: 'https://www.chef.io' },
  { name: 'ChefDocs', submit: 'https://docs.chef.io' },
  { name: 'Puppet', submit: 'https://www.puppet.com' },
  { name: 'PuppetDocs', submit: 'https://puppet.com/docs' },
  { name: 'Salt', submit: 'https://saltproject.io' },
  { name: 'SaltDocs', submit: 'https://docs.saltproject.io' },
  { name: 'Bolt', submit: 'https://puppet.com/bolt' },
  { name: 'CloudInit', submit: 'https://cloudinit.readthedocs.io' },
  { name: 'Vagrant', submit: 'https://www.vagrantup.com' },
  { name: 'VagrantDocs', submit: 'https://developer.hashicorp.com/vagrant/docs' },
  { name: 'Packer', submit: 'https://www.packer.io' },
  { name: 'PackerDocs', submit: 'https://developer.hashicorp.com/packer/docs' },
  { name: 'Vagrant2', submit: 'https://www.vagrantup.com' },
  { name: 'Waypoint', submit: 'https://www.waypointproject.io' },
  { name: 'WaypointDocs', submit: 'https://developer.hashicorp.com/waypoint/docs' },
  { name: 'Nomad2', submit: 'https://www.nomadproject.io' },
  { name: 'Serf', submit: 'https://www.serf.io' },
  { name: 'SerfDocs', submit: 'https://www.serf.io/docs' },
  { name: 'Containerd', submit: 'https://containerd.io' },
  { name: 'ContainerdDocs', submit: 'https://containerd.io/docs' },
  { name: 'Crictl', submit: 'https://github.com/kubernetes-sigs/cri-tools' },
  { name: 'Skopeo', submit: 'https://github.com/containers/skopeo' },
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
  console.log(`🚀 Batch 41 - DevOps & Infrastructure (${DIRECTORIES.length} directories)\n`);
  
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
