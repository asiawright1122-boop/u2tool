const https = require('https');

const DIRECTORIES = [
  { name: 'Sentry', submit: 'https://sentry.io' },
  { name: 'Sentry2', submit: 'https://sentry.io/submit' },
  { name: 'Bugsnag', submit: 'https://www.bugsnag.com' },
  { name: 'Bugsnag2', submit: 'https://www.bugsnag.com/submit' },
  { name: 'Rollbar', submit: 'https://rollbar.com' },
  { name: 'Rollbar2', submit: 'https://rollbar.com/submit' },
  { name: 'Airbrake', submit: 'https://airbrake.io' },
  { name: 'Airbrake2', submit: 'https://airbrake.io/submit' },
  { name: 'Raygun', submit: 'https://raygun.com' },
  { name: 'Raygun2', submit: 'https://raygun.com/submit' },
  { name: 'LogRocket', submit: 'https://logrocket.com' },
  { name: 'LogRocket2', submit: 'https://logrocket.com/submit' },
  { name: 'Datadog', submit: 'https://www.datadoghq.com' },
  { name: 'Datadog2', submit: 'https://www.datadoghq.com/submit' },
  { name: 'NewRelic', submit: 'https://newrelic.com' },
  { name: 'NewRelic2', submit: 'https://newrelic.com/submit' },
  { name: 'AppDynamics', submit: 'https://www.appdynamics.com' },
  { name: 'AppDynamics2', submit: 'https://www.appdynamics.com/submit' },
  { name: 'Dynatrace', submit: 'https://www.dynatrace.com' },
  { name: 'Dynatrace2', submit: 'https://www.dynatrace.com/submit' },
  { name: 'Grafana', submit: 'https://grafana.com' },
  { name: 'Grafana2', submit: 'https://grafana.com/submit' },
  { name: 'Prometheus', submit: 'https://prometheus.io' },
  { name: 'Prometheus2', submit: 'https://prometheus.io/submit' },
  { name: 'Kibana', submit: 'https://www.elastic.co/kibana' },
  { name: 'Kibana2', submit: 'https://www.elastic.co/kibana/submit' },
  { name: 'Elastic', submit: 'https://www.elastic.co' },
  { name: 'Elastic2', submit: 'https://www.elastic.co/submit' },
  { name: 'Splunk', submit: 'https://www.splunk.com' },
  { name: 'Splunk2', submit: 'https://www.splunk.com/submit' },
  { name: 'SumoLogic', submit: 'https://www.sumologic.com' },
  { name: 'SumoLogic2', submit: 'https://www.sumologic.com/submit' },
  { name: 'PagerDuty', submit: 'https://www.pagerduty.com' },
  { name: 'PagerDuty2', submit: 'https://www.pagerduty.com/submit' },
  { name: 'VictorOps', submit: 'https://victorops.com' },
  { name: 'VictorOps2', submit: 'https://victorops.com/submit' },
  { name: 'OpsGenie', submit: 'https://www.opsgenie.com' },
  { name: 'OpsGenie2', submit: 'https://www.opsgenie.com/submit' },
  { name: 'StatusPage', submit: 'https://www.atlassian.com/software/statuspage' },
  { name: 'StatusPage2', submit: 'https://www.atlassian.com/software/statuspage/submit' },
  { name: 'Cachet', submit: 'https://cachethq.io' },
  { name: 'Cachet2', submit: 'https://cachethq.io/submit' },
  { name: 'Instatus', submit: 'https://instatus.com' },
  { name: 'Instatus2', submit: 'https://instatus.com/submit' },
  { name: 'DownDetector', submit: 'https://downdetector.com' },
  { name: 'DownDetector2', submit: 'https://downdetector.com/submit' },
  { name: 'GitHub', submit: 'https://github.com' },
  { name: 'GitHub2', submit: 'https://github.com/submit' },
  { name: 'GitLab', submit: 'https://gitlab.com' },
  { name: 'GitLab2', submit: 'https://gitlab.com/submit' },
  { name: 'Bitbucket', submit: 'https://bitbucket.org' },
  { name: 'Bitbucket2', submit: 'https://bitbucket.org/submit' },
  { name: 'StackShare', submit: 'https://stackshare.io' },
  { name: 'StackShare2', submit: 'https://stackshare.io/submit' },
  { name: 'Slant', submit: 'https://www.slant.co' },
  { name: 'Slant2', submit: 'https://www.slant.co/submit' },
  { name: 'AlternativeTo', submit: 'https://alternativeto.net' },
  { name: 'AlternativeTo2', submit: 'https://alternativeto.net/submit' },
  { name: 'ProductHunt', submit: 'https://www.producthunt.com' },
  { name: 'ProductHunt2', submit: 'https://www.producthunt.com/submit' },
  { name: 'BetaList', submit: 'https://betalist.com' },
  { name: 'BetaList2', submit: 'https://betalist.com/submit' },
  { name: 'SaaSHub', submit: 'https://www.saashub.com' },
  { name: 'SaaSHub2', submit: 'https://www.saashub.com/submit' },
  { name: 'Crozdesk', submit: 'https://www.crozdesk.com' },
  { name: 'Crozdesk2', submit: 'https://www.crozdesk.com/submit' },
  { name: 'GetApp', submit: 'https://www.getapp.com' },
  { name: 'GetApp2', submit: 'https://www.getapp.com/submit' },
  { name: 'Capterra', submit: 'https://www.capterra.com' },
  { name: 'Capterra2', submit: 'https://www.capterra.com/submit' },
  { name: 'G2', submit: 'https://www.g2.com' },
  { name: 'G22', submit: 'https://www.g2.com/submit' },
  { name: 'TrustRadius', submit: 'https://www.trustradius.com' },
  { name: 'TrustRadius2', submit: 'https://www.trustradius.com/submit' },
  { name: 'PeerSpot', submit: 'https://www.peerspot.com' },
  { name: 'PeerSpot2', submit: 'https://www.peerspot.com/submit' },
  { name: 'SoftwareWorld', submit: 'https://softwareworld.ca' },
  { name: 'SoftwareWorld2', submit: 'https://softwareworld.ca/submit' },
  { name: 'TrustArc', submit: 'https://www.trustarc.com' },
  { name: 'TrustArc2', submit: 'https://www.trustarc.com/submit' },
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
  console.log(`🚀 Batch 61 - Monitoring & Software Directories (${DIRECTORIES.length} directories)\n`);
  
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
