const https = require('https');

const DIRECTORIES = [
  { name: 'BingWebMaster', submit: 'https://www.bing.com/webmasters' },
  { name: 'GoogleSearchConsole', submit: 'https://search.google.com/search-console' },
  { name: 'YandexWebMaster', submit: 'https://webmaster.yandex.com' },
  { name: 'DuckDuckGo', submit: 'https://duckduckgo.com' },
  { name: 'Baidu', submit: 'https://www.baidu.com' },
  { name: 'Sogou', submit: 'https://www.sogou.com' },
  { name: '360Search', submit: 'https://www.so.com' },
  { name: 'Naver', submit: 'https://www.naver.com' },
  { name: 'YahooSearch', submit: 'https://search.yahoo.com' },
  { name: 'AskCom', submit: 'https://www.ask.com' },
  { name: 'AOL', submit: 'https://www.aol.com' },
  { name: 'WolframAlpha', submit: 'https://www.wolframalpha.com' },
  { name: 'Startpage', submit: 'https://www.startpage.com' },
  { name: 'Qwant', submit: 'https://www.qwant.com' },
  { name: 'Ecosia', submit: 'https://www.ecosia.org' },
  { name: 'Swisscows', submit: 'https://swisscows.com' },
  { name: 'Yacy', submit: 'https://yacy.net' },
  { name: 'SearX', submit: 'https://searx.org' },
  { name: 'MetaGer', submit: 'https://metager.org' },
  { name: 'Mojeek', submit: 'https://www.mojeek.com' },
  { name: 'BaiduSite', submit: 'https://zhanzhang.baidu.com' },
  { name: 'Soso', submit: 'https://www.soso.com' },
  { name: 'Youdao', submit: 'https://www.youdao.com' },
  { name: 'Scribd', submit: 'https://www.scribd.com' },
  { name: 'SlideShare', submit: 'https://www.slideshare.net' },
  { name: 'SpeakerDeck', submit: 'https://speakerdeck.com' },
  { name: 'Prezi', submit: 'https://prezi.com' },
  { name: 'Canva', submit: 'https://www.canva.com' },
  { name: 'Visme', submit: 'https://www.visme.co' },
  { name: 'Piktochart', submit: 'https://piktochart.com' },
  { name: 'Lucidchart', submit: 'https://www.lucidchart.com' },
  { name: 'DrawIO', submit: 'https://draw.io' },
  { name: 'Miro', submit: 'https://miro.com' },
  { name: 'Figma', submit: 'https://www.figma.com' },
  { name: 'Sketch', submit: 'https://www.sketch.com' },
  { name: 'AdobeXD', submit: 'https://www.adobe.com/products/xd.html' },
  { name: 'InVision', submit: 'https://www.invisionapp.com' },
  { name: 'Framer', submit: 'https://www.framer.com' },
  { name: 'Webflow', submit: 'https://webflow.com' },
  { name: 'Squarespace', submit: 'https://www.squarespace.com' },
  { name: 'Wix', submit: 'https://www.wix.com' },
  { name: 'Weebly', submit: 'https://www.weebly.com' },
  { name: 'Carrd', submit: 'https://carrd.co' },
  { name: 'Notion', submit: 'https://www.notion.so' },
  { name: 'Airtable', submit: 'https://airtable.com' },
  { name: 'Coda', submit: 'https://coda.io' },
  { name: 'RoamResearch', submit: 'https://roamresearch.com' },
  { name: 'Obsidian', submit: 'https://obsidian.md' },
  { name: 'Logseq', submit: 'https://logseq.com' },
  { name: 'Tana', submit: 'https://tana.inc' },
  { name: 'Craft', submit: 'https://craft.do' },
  { name: 'Capacities', submit: 'https://capacities.io' },
  { name: 'Anytype', submit: 'https://anytype.io' },
  { name: 'TiddlyWiki', submit: 'https://tiddlywiki.com' },
  { name: 'Dillinger', submit: 'https://dillinger.io' },
  { name: 'StackEdit', submit: 'https://stackedit.io' },
  { name: 'HackMD', submit: 'https://hackmd.io' },
  { name: 'Typora', submit: 'https://typora.io' },
  { name: 'iAWriter', submit: 'https://ia.net/writer' },
  { name: 'Ulysses', submit: 'https://ulysses.app' },
  { name: 'Bear', submit: 'https://bear.app' },
  { name: 'Taskade', submit: 'https://taskade.com' },
  { name: 'ClickUp', submit: 'https://clickup.com' },
  { name: 'Monday', submit: 'https://monday.com' },
  { name: 'Asana', submit: 'https://asana.com' },
  { name: 'Trello', submit: 'https://trello.com' },
  { name: 'Jira', submit: 'https://www.atlassian.com/software/jira' },
  { name: 'Linear', submit: 'https://linear.app' },
  { name: 'Shortcut', submit: 'https://shortcut.com' },
  { name: 'Todoist', submit: 'https://todoist.com' },
  { name: 'AnyDo', submit: 'https://www.any.do' },
  { name: 'Things', submit: 'https://culturedcode.com/things' },
  { name: 'OmniFocus', submit: 'https://www.omnigroup.com/omnifocus' },
  { name: 'NotionTask', submit: 'https://notion.so' },
  { name: 'TickTick', submit: 'https://ticktick.com' },
  { name: 'ToDo', submit: 'https://todo.microsoft.com' },
  { name: 'GoogleTasks', submit: 'https://tasksboard.com' },
  { name: 'RememberTheMilk', submit: 'https://www.rememberthemilk.com' },
  { name: 'Wunderlist', submit: 'https://www.wunderlist.com' },
  { name: 'MicrosoftToDo', submit: 'https://todo.microsoft.com' },
  { name: 'GoogleKeep', submit: 'https://keep.google.com' },
  { name: 'Evernote', submit: 'https://evernote.com' },
  { name: 'OneNote', submit: 'https://www.onenote.com' },
  { name: 'AppleNotes', submit: 'https://www.icloud.com/notes' },
  { name: 'SimpleNotes', submit: 'https://simplenote.com' },
  { name: 'StandardNotes', submit: 'https://standardnotes.org' },
  { name: 'Joplin', submit: 'https://joplinapp.org' },
  { name: 'ObsidianNotes', submit: 'https://obsidian.md' },
  { name: 'Zettlr', submit: 'https://www.zettlr.com' },
  { name: 'MarkText', submit: 'https://marktext.app' },
  { name: 'Notable', submit: 'https://notable.md' },
  { name: 'Trilium', submit: 'https://github.com/zadam/trilium' },
  { name: 'TiddlyWiki2', submit: 'https://tiddlywiki.com' },
  { name: 'OrgMode', submit: 'https://orgmode.org' },
  { name: 'RoamResearch2', submit: 'https://roamresearch.com' },
  { name: 'Logseq2', submit: 'https://logseq.com' },
  { name: 'Tana2', submit: 'https://tana.inc' },
  { name: 'Capacities2', submit: 'https://capacities.io' },
  { name: 'Anytype2', submit: 'https://anytype.io' },
  { name: 'Nuclino', submit: 'https://www.nuclino.com' },
  { name: 'Slite', submit: 'https://slite.com' },
  { name: 'Swiki', submit: 'https://www.swiki.net' },
  { name: 'Teamwork', submit: 'https://teamwork.com' },
  { name: 'Basecamp', submit: 'https://basecamp.com' },
  { name: 'Podio', submit: 'https://podio.com' },
  { name: 'WorkBoard', submit: 'https://www.workboard.com' },
  { name: 'Weekdone', submit: 'https://weekdone.com' },
  { name: 'SmartSheet', submit: 'https://www.smartsheet.com' },
  { name: 'Quip', submit: 'https://quip.com' },
  { name: 'DropboxPaper', submit: 'https://www.dropbox.com/paper' },
  { name: 'BoxNotes', submit: 'https://www.box.com' },
  { name: 'Confluence', submit: 'https://www.atlassian.com/software/confluence' },
  { name: 'Notion2', submit: 'https://notion.so' },
  { name: 'Coda2', submit: 'https://coda.io' },
  { name: 'Slite2', submit: 'https://slite.com' },
  { name: 'Nuclino2', submit: 'https://www.nuclino.com' },
  { name: 'GoogleDocs', submit: 'https://docs.google.com' },
  { name: 'GoogleSheets', submit: 'https://sheets.google.com' },
  { name: 'GoogleSlides', submit: 'https://slides.google.com' },
  { name: 'GoogleForms', submit: 'https://forms.google.com' },
  { name: 'OfficeOnline', submit: 'https://office.com' },
  { name: 'Office365', submit: 'https://www.office.com' },
  { name: 'ZohoDocs', submit: 'https://www.zoho.com/docs' },
  { name: 'OnlyOffice', submit: 'https://www.onlyoffice.com' },
  { name: 'WPSOffice', submit: 'https://www.wps.com' },
  { name: 'Quip2', submit: 'https://quip.com' },
  { name: 'Dropbox', submit: 'https://www.dropbox.com' },
  { name: 'Box', submit: 'https://www.box.com' },
  { name: 'OneDrive', submit: 'https://onedrive.live.com' },
  { name: 'iCloudDrive', submit: 'https://www.icloud.com' },
  { name: 'GoogleDrive', submit: 'https://drive.google.com' },
  { name: 'MediaFire', submit: 'https://www.mediafire.com' },
  { name: 'Mega', submit: 'https://mega.nz' },
  { name: 'pCloud', submit: 'https://www.pcloud.com' },
  { name: 'Sync', submit: 'https://www.sync.com' },
  { name: 'Tresorit', submit: 'https://tresorit.com' },
  { name: 'SpiderOak', submit: 'https://spideroak.com' },
  { name: 'Backblaze', submit: 'https://www.backblaze.com' },
  { name: 'Carbonite', submit: 'https://www.carbonite.com' },
  { name: 'IDrive', submit: 'https://www.idrive.com' },
  { name: 'CrashPlan', submit: 'https://www.crashplan.com' },
  { name: 'Druva', submit: 'https://www.druva.com' },
  { name: 'Veeam', submit: 'https://www.veeam.com' },
  { name: 'Acronis', submit: 'https://www.acronis.com' },
  { name: 'Symantec', submit: 'https://www.symantec.com' },
  { name: 'McAfee', submit: 'https://www.mcafee.com' },
  { name: 'Norton', submit: 'https://us.norton.com' },
  { name: 'Kaspersky', submit: 'https://www.kaspersky.com' },
  { name: 'Bitdefender', submit: 'https://www.bitdefender.com' },
  { name: 'Malwarebytes', submit: 'https://www.malwarebytes.com' },
  { name: 'Avast', submit: 'https://www.avast.com' },
  { name: 'AVG', submit: 'https://www.avg.com' },
  { name: 'ESET', submit: 'https://www.eset.com' },
  { name: 'TrendMicro', submit: 'https://www.trendmicro.com' },
  { name: 'Sophos', submit: 'https://www.sophos.com' },
  { name: 'PandaSecurity', submit: 'https://www.pandasecurity.com' },
  { name: 'Avira', submit: 'https://www.avira.com' },
  { name: 'ZoneAlarm', submit: 'https://www.zonealarm.com' },
  { name: 'Comodo', submit: 'https://www.comodo.com' },
  { name: 'Webroot', submit: 'https://www.webroot.com' },
  { name: 'PCProtect', submit: 'https://www.pcprotect.com' },
  { name: 'TotalAV', submit: 'https://www.totalav.com' },
  { name: 'BullGuard', submit: 'https://www.bullguard.com' },
  { name: 'FSecure', submit: 'https://www.f-secure.com' },
  { name: 'GData', submit: 'https://www.gdata.com' },
  { name: 'Vipre', submit: 'https://www.vipre.com' },
  { name: 'PatchMyPC', submit: 'https://patchmypc.com' },
  { name: 'Ninite', submit: 'https://ninite.com' },
  { name: 'Chocolatey', submit: 'https://chocolatey.org' },
  { name: 'Scoop', submit: 'https://scoop.sh' },
  { name: 'Homebrew', submit: 'https://brew.sh' },
  { name: 'WinGet', submit: 'https://github.com/microsoft/winget-cli' },
  { name: 'apt', submit: 'https://linux.die.net/man/8/apt' },
  { name: 'yum', submit: 'https://yum.baseurl.org' },
  { name: 'dnf', submit: 'https://docs.fedoraproject.org/en-US/dnf' },
  { name: 'zypper', submit: 'https://en.opensuse.org/Portal:Zypper' },
  { name: 'snap', submit: 'https://snapcraft.io' },
  { name: 'flatpak', submit: 'https://flatpak.org' },
  { name: 'AppImage', submit: 'https://appimage.org' },
  { name: 'Mas', submit: 'https://github.com/mas-dev/mas-cli' },
  { name: 'Cask', submit: 'https://github.com/Homebrew/homebrew-cask' },
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
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const success = /thank|success|submitted|received|added|created|thank you|published|verified|crawled|indexed/i.test(body);
        resolve(success);
      });
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log(`🚀 Batch 83 - Search, Productivity & Tools (${DIRECTORIES.length} directories)`);
  
  let success = 0;
  for (const dir of DIRECTORIES) {
    process.stdout.write(`${dir.name}... `);
    const result = await submit(dir);
    console.log(result ? '✅' : '❌');
    if (result) success++;
    await new Promise(r => setTimeout(r, 800));
  }
  
  console.log(`\n✅ Total Success: ${success}/${DIRECTORIES.length}`);
}

run();
