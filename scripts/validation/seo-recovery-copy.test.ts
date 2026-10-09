import { expect, it } from 'vitest';
import { loadToolPageMessages } from '../../src/lib/translations';

it('Chinese wordcloud copy describes whitespace counting, not upload or NLP', async () => {
  const messages = await loadToolPageMessages('zh', 'wordcloud-generator');
  expect(messages.detailed_description).toContain('最多保留前 100');
  expect(messages.detailed_description).toContain('不支持文件上传');
  expect(messages.usage_steps.join(' ')).not.toMatch(/上传|开始创建|字体类型/);
  expect(JSON.stringify(messages.faqs)).toContain('不支持。中文请先用空格');
});

it('Chinese graph copy matches the node/link editor without import or analysis claims', async () => {
  const messages = await loadToolPageMessages('zh', 'graph-chart-generator');
  expect(messages.detailed_description).toContain('力导向或环形');
  expect(messages.detailed_description).toContain('不提供 CSV/JSON');
  expect(messages.usage_steps.join(' ')).not.toMatch(/上传文件|标签.*选项卡|边的粗细/);
});

it.each(['en', 'zh'])('%s curl copy describes templates, implicit POST and verified scope', async locale => {
  const messages = await loadToolPageMessages(locale, 'curl-converter');
  expect(messages.detailed_description).toContain('POST');
  expect(messages.detailed_description).not.toMatch(/regex-based|基于正则/);
  expect(messages.detailed_description).toMatch(/may be ignored|可能被忽略/);
});

it.each(['en', 'zh'])('%s color-picker copy includes fixed-alpha RGBA output', async (locale) => {
  const messages = await loadToolPageMessages(locale, 'color-picker');
  expect(messages.detailed_description).toContain('RGBA');
  expect(messages.detailed_description).toContain('alpha');
  expect(messages.usage_steps.join(' ')).toContain('RGBA');
  expect(JSON.stringify(messages.faqs)).not.toMatch(/does not output RGBA|不输出 RGBA/);
  expect(JSON.stringify(messages.faqs)).toMatch(/fixed at 1|固定为 1/);
});

it('Chinese timezone copy matches the single-target Intl interface and its limits', async () => {
  const messages = await loadToolPageMessages('zh', 'timezone-converter');
  expect(messages.detailed_description).toContain('Intl');
  expect(messages.detailed_description).toContain('单个目标');
  expect(messages.detailed_description).not.toMatch(/Temporal|高精度|毫秒级误差/);
  expect(messages.usage_steps.join(' ')).not.toMatch(/Web Worker|勾选多个|分享链接|毫秒级/);
  expect(messages.usage_steps.join(' ')).toContain('自动更新');
  expect(JSON.stringify(messages.faqs)).toContain('不存在或重复');
});

it('English timezone instructions do not advertise a nonexistent Convert button', async () => {
  const messages = await loadToolPageMessages('en', 'timezone-converter');
  expect(messages.usage_steps.join(' ')).not.toContain('Click Convert');
  expect(messages.usage_steps.join(' ')).toContain('updates automatically');
});

it('French frosted-glass SSR copy describes only whole-image blur and PNG export', async () => {
  const messages = await loadToolPageMessages('fr', 'image-frosted-glass');
  expect(messages.detailed_description).toContain('0 à 50');
  expect(messages.usage_steps.join(' ')).not.toMatch(/Opacité|bruit|Glissez-déposez/);
  expect(JSON.stringify(messages.faqs)).toContain('PNG');
});

it('Japanese encoding SSR copy distinguishes hints from original-encoding detection', async () => {
  const messages = await loadToolPageMessages('ja', 'encoding-detector');
  expect(messages.detailed_description).toContain('元の文字コード');
  expect(messages.detailed_description).toContain('対応していません');
  expect(messages.usage_steps.join(' ')).not.toMatch(/検出深度|エクスポート|ドラッグ/);
  expect(JSON.stringify(messages.faqs)).toContain('Shift-JIS');
});

it('English SQL metadata and support copy describe heuristic inspection, not a security scanner', async () => {
  const messages = await loadToolPageMessages('en', 'sql-injection-tester');
  expect(messages.seo_title).toContain('Pattern Check');
  expect(messages.seo_description).not.toMatch(/i\.\.\.\.|Security Scanner/i);
  expect(messages.detailed_description).toContain('regular expressions');
  expect(messages.usage_steps.join(' ')).not.toContain('Click Test');
});
