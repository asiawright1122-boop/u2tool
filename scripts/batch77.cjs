const https = require('https');

const DIRECTORIES = [
  { name: 'Trello', submit: 'https://trello.com' },
  { name: 'Asana', submit: 'https://asana.com' },
  { name: 'Monday', submit: 'https://monday.com' },
  { name: 'Jira', submit: 'https://www.atlassian.com/software/jira' },
  { name: 'Notion', submit: 'https://www.notion.so' },
  { name: 'Airtable', submit: 'https://airtable.com' },
  { name: 'ClickUp', submit: 'https://clickup.com' },
  { name: 'Todoist', submit: 'https://todoist.com' },
  { name: 'AnyDo', submit: 'https://www.any.do' },
  { name: 'Things', submit: 'https://culturedcode.com/things' },
  { name: 'OmniFocus', submit: 'https://www.omnigroup.com/omnifocus' },
  { name: 'Evernote', submit: 'https://evernote.com' },
  { name: 'OneNote', submit: 'https://www.onenote.com' },
  { name: 'Bear', submit: 'https://bear.app' },
  { name: 'Obsidian', submit: 'https://obsidian.md' },
  { name: 'RoamResearch', submit: 'https://roamresearch.com' },
  { name: 'Logseq', submit: 'https://logseq.com' },
  { name: 'Craft', submit: 'https://craft.do' },
  { name: 'RemNote', submit: 'https://www.remnote.com' },
  { name: 'Mem', submit: 'https://mem.ai' },
  { name: 'Tana', submit: 'https://tana.inc' },
  { name: 'Fibery', submit: 'https://fibery.io' },
  { name: 'Coda', submit: 'https://coda.io' },
  { name: 'Nuclino', submit: 'https://nuclino.com' },
  { name: 'Slite', submit: 'https://slite.com' },
  { name: 'Outline', submit: 'https://www.getoutline.org' },
  { name: 'Confluence', submit: 'https://www.atlassian.com/software/confluence' },
  { name: 'Notion2', submit: 'https://notion.so' },
  { name: 'ClickUp2', submit: 'https://clickup.com/docs' },
  { name: 'Asana2', submit: 'https://asana.com/guide' },
  { name: 'Trello2', submit: 'https://trello.com/guide' },
  { name: 'Monday2', submit: 'https://monday.com/guide' },
  { name: 'Jira2', submit: 'https://support.atlassian.com/jira' },
  { name: 'Linear', submit: 'https://linear.app' },
  { name: 'Shortcut', submit: 'https://shortcut.com' },
  { name: 'Clubhouse', submit: 'https://clubhouse.io' },
  { name: 'Taskade', submit: 'https://taskade.com' },
  { name: 'Motion', submit: 'https://usemotion.com' },
  { name: 'Height', submit: 'https://height.app' },
  { name: 'Lattice', submit: 'https://lattice.com' },
  { name: '15Five', submit: 'https://www.15five.com' },
  { name: 'CultureAmp', submit: 'https://www.cultureamp.com' },
  { name: '15Five2', submit: 'https://www.15five.com/products' },
  { name: 'Workboard', submit: 'https://www.workboard.com' },
  { name: 'ActivTrak', submit: 'https://www.activtrak.com' },
  { name: 'TimeDoctor', submit: 'https://www.timedoctor.com' },
  { name: 'Toggl', submit: 'https://toggl.com' },
  { name: 'TogglTrack', submit: 'https://toggl.com/track' },
  { name: 'Clockify', submit: 'https://clockify.me' },
  { name: 'Harvest', submit: 'https://www.getharvest.com' },
  { name: 'FreshBooks', submit: 'https://www.freshbooks.com' },
  { name: 'QuickBooks', submit: 'https://quickbooks.intuit.com' },
  { name: 'Xero', submit: 'https://www.xero.com' },
  { name: 'Wave', submit: 'https://www.waveapps.com' },
  { name: 'Zoho', submit: 'https://www.zoho.com' },
  { name: 'Bench', submit: 'https://bench.co' },
  { name: 'Sage', submit: 'https://www.sage.com' },
  { name: 'NetSuite', submit: 'https://www.netsuite.com' },
  { name: 'SAP', submit: 'https://www.sap.com' },
  { name: 'MicrosoftDynamics', submit: 'https://dynamics.microsoft.com' },
  { name: 'Salesforce', submit: 'https://www.salesforce.com' },
  { name: 'HubSpot', submit: 'https://www.hubspot.com' },
  { name: 'Pipedrive', submit: 'https://www.pipedrive.com' },
  { name: 'Zendesk', submit: 'https://www.zendesk.com' },
  { name: 'Intercom', submit: 'https://www.intercom.com' },
  { name: 'Freshdesk', submit: 'https://www.freshworks.com/freshdesk' },
  { name: 'HelpScout', submit: 'https://www.helpscout.com' },
  { name: 'LiveAgent', submit: 'https://www.liveagent.com' },
  { name: 'Olark', submit: 'https://www.olark.com' },
  { name: 'Crisp', submit: 'https://crisp.chat' },
  { name: 'Tawkto', submit: 'https://www.tawk.to' },
  { name: 'ZohoDesk', submit: 'https://www.zoho.com/desk' },
  { name: 'FreshService', submit: 'https://www.freshworks.com/freshservice' },
  { name: 'JiraService', submit: 'https://www.atlassian.com/software/jira/service-management' },
  { name: 'Slack2', submit: 'https://slack.com' },
  { name: 'Teams', submit: 'https://teams.microsoft.com' },
  { name: 'Zoom', submit: 'https://zoom.us' },
  { name: 'Meet', submit: 'https://meet.google.com' },
  { name: 'WebEx', submit: 'https://www.webex.com' },
  { name: 'GoToMeeting', submit: 'https://www.gotomeeting.com' },
  { name: 'BlueJeans', submit: 'https://www.bluejeans.com' },
  { name: 'Jitsi', submit: 'https://jitsi.org' },
  { name: 'Whereby', submit: 'https://whereby.com' },
  { name: 'Discord2', submit: 'https://discord.com' },
  { name: 'Telegram', submit: 'https://telegram.org' },
  { name: 'WhatsApp', submit: 'https://www.whatsapp.com' },
  { name: 'Signal', submit: 'https://signal.org' },
  { name: 'Skype', submit: 'https://www.skype.com' },
  { name: 'Viber', submit: 'https://www.viber.com' },
  { name: 'Line', submit: 'https://line.me' },
  { name: 'WeChat', submit: 'https://www.wechat.com' },
  { name: 'Slack3', submit: 'https://slack.com' },
  { name: 'Mattermost', submit: 'https://mattermost.com' },
  { name: 'RocketChat', submit: 'https://rocket.chat' },
  { name: 'Zulip', submit: 'https://zulip.com' },
  { name: 'Gitter', submit: 'https://gitter.im' },
  { name: 'Twitch', submit: 'https://www.twitch.tv' },
  { name: 'YouTube', submit: 'https://www.youtube.com' },
  { name: 'Vimeo', submit: 'https://vimeo.com' },
  { name: 'Wistia', submit: 'https://wistia.com' },
  { name: 'Vidyard', submit: 'https://www.vidyard.com' },
  { name: 'Loom', submit: 'https://www.loom.com' },
  { name: 'ScreenStudio', submit: 'https://screen.studio' },
  { name: 'Camtasia', submit: 'https://www.techsmith.com/camtasia' },
  { name: 'OBS', submit: 'https://obsproject.com' },
  { name: 'StreamYard', submit: 'https://streamyard.com' },
  { name: 'Restream', submit: 'https://restream.io' },
  { name: 'BeLive', submit: 'https://belive.tv' },
  { name: 'VimeoLive', submit: 'https://vimeo.com/live' },
  { name: 'YouTubeLive', submit: 'https://www.youtube.com/live' },
  { name: 'TwitchLive', submit: 'https://www.twitch.tv/directory' },
  { name: 'Kick', submit: 'https://kick.com' },
  { name: 'TikTokLive', submit: 'https://www.tiktok.com/live' },
  { name: 'InstagramLive', submit: 'https://www.instagram.com' },
  { name: 'FacebookLive', submit: 'https://www.facebook.com' },
  { name: 'TwitterSpaces', submit: 'https://twitter.com' },
  { name: 'Clubhouse', submit: 'https://www.clubhouse.com' },
  { name: 'Twitter', submit: 'https://twitter.com' },
  { name: 'LinkedIn', submit: 'https://www.linkedin.com' },
  { name: 'Facebook', submit: 'https://www.facebook.com' },
  { name: 'Instagram', submit: 'https://www.instagram.com' },
  { name: 'Pinterest', submit: 'https://www.pinterest.com' },
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
  console.log(`🚀 Batch 77 - Productivity & Collaboration (${DIRECTORIES.length} directories)\n`);
  
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
