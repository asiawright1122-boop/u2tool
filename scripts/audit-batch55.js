const fs = require('fs');
const langs = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const tools = ['ip-geolocation', 'screen-recorder'];

// 组件中使用的所有翻译键
const ipGeoKeys = ['ipAddress', 'placeholder', 'lookup', 'loading', 'myIp', 'results', 'country', 'region', 'city', 'zipCode', 'timezone', 'coordinates', 'isp', 'organization', 'asn', 'viewOnMap', 'invalidIp', 'lookupError', 'name', 'description', 'seo_title', 'seo_description'];

const screenRecorderKeys = ['start', 'stop', 'pause', 'resume', 'recording', 'paused', 'preview', 'download', 'newRecording', 'notSupported', 'permissionDenied', 'startError', 'instructions', 'instruction1', 'instruction2', 'instruction3', 'name', 'description', 'seo_title', 'seo_description'];

console.log('=== 翻译完整性审查 ===\n');

let allComplete = true;

langs.forEach(lang => {
  const data = JSON.parse(fs.readFileSync('src/messages/' + lang + '.json', 'utf8'));
  
  tools.forEach(tool => {
    const toolData = data.tools && data.tools[tool];
    const keys = tool === 'ip-geolocation' ? ipGeoKeys : screenRecorderKeys;
    
    if (!toolData) {
      console.log('X ' + lang + '/' + tool + ': 工具不存在');
      allComplete = false;
      return;
    }
    
    const missing = keys.filter(k => !toolData[k]);
    if (missing.length > 0) {
      console.log('X ' + lang + '/' + tool + ': 缺少 ' + missing.join(', '));
      allComplete = false;
    } else {
      console.log('OK ' + lang + '/' + tool + ': 完整');
    }
  });
});

console.log('\n' + (allComplete ? 'ALL COMPLETE!' : 'MISSING TRANSLATIONS!'));
