const BASE_URL = process.env.PROD_BASE_URL || 'https://www.u2tool.com';

const checks = [
  { name: 'robots.txt', url: '/robots.txt', expect: { status: 200, contentTypeIncludes: 'text/plain' } },
  { name: 'sitemap index', url: '/sitemap.xml', expect: { status: 200, contentTypeIncludes: 'application/xml' } },
  { name: 'sitemap pages', url: '/sitemap-pages.xml', expect: { status: 200, contentTypeIncludes: 'application/xml' } },
  { name: 'sitemap tools', url: '/sitemap-tools.xml', expect: { status: 200, contentTypeIncludes: 'application/xml' } },
  { name: 'llms.txt', url: '/llms.txt', expect: { status: 200, contentTypeIncludes: 'text/plain' } },
  { name: 'messages base en', url: '/messages/en/base.json', expect: { status: 200, contentTypeIncludes: 'application/json' } },
  { name: 'messages root en', url: '/messages/en.json', expect: { status: 200, contentTypeIncludes: 'application/json' } },
  { name: 'home en', url: '/en/', expect: { status: 200 } },
  { name: 'tools en', url: '/en/tools/', expect: { status: 200 } },
  { name: 'privacy en', url: '/en/privacy/', expect: { status: 200 } },
  { name: 'terms en', url: '/en/terms/', expect: { status: 200 } },
  { name: 'contact en', url: '/en/contact/', expect: { status: 200 } },
  { name: 'home schema placeholders', url: '/en/', expect: { status: 200 }, bodyMustNotInclude: '${BASE_URL}' },
  { name: 'tools schema placeholders', url: '/en/tools/', expect: { status: 200 }, bodyMustNotInclude: '${BASE_URL}' },
  { name: 'home translated tool labels', url: '/en/', expect: { status: 200 }, bodyMustInclude: 'JSON Formatter' },
  { name: 'home translated category labels', url: '/en/', expect: { status: 200 }, bodyMustInclude: 'Text Tools' },
  { name: 'legacy /tools', url: '/tools', expect: { status: [301, 302, 307, 308], locationEndsWith: '/en/tools/' } },
  { name: 'legacy /compare', url: '/compare', expect: { status: [301, 302, 307, 308], locationEndsWith: '/en/compare/' } },
  { name: 'legacy /ai', url: '/ai', expect: { status: [301, 302, 307, 308], locationEndsWith: '/en/ai/' } },
  { name: 'legacy /privacy', url: '/privacy', expect: { status: [301, 302, 307, 308], locationEndsWith: '/en/privacy/' } },
  { name: 'legacy /models', url: '/models', expect: { status: [301, 302, 307, 308], locationEndsWith: '/en/ai/' } },
  { name: 'legacy favicon ico', url: '/favicon.ico', expect: { status: [301, 302, 307, 308], locationEndsWith: '/favicon.svg' } },
  { name: 'legacy blog guide', url: '/ru/blog/regex-complete-guide', expect: { status: [301, 302, 307, 308], locationEndsWith: '/ru/tools/regex-tester/' } },
  { name: 'legacy unlocalized compare pair guide', url: '/compare/image-border/image-splitter', expect: { status: [301, 302, 307, 308], locationEndsWith: '/en/compare/choose-image-tool/' } },
  { name: 'legacy unlocalized compare pair guide slash', url: '/compare/image-border/image-splitter/', expect: { status: [301, 302, 307, 308], locationEndsWith: '/en/compare/choose-image-tool/' } },
  { name: 'legacy compare pair guide', url: '/zh/compare/image-border/image-splitter', expect: { status: [301, 302, 307, 308], locationEndsWith: '/zh/compare/choose-image-tool/' } },
  { name: 'legacy compare pair guide slash', url: '/zh/compare/image-border/image-splitter/', expect: { status: [301, 302, 307, 308], locationEndsWith: '/zh/compare/choose-image-tool/' } },
  { name: 'ranking newest', url: '/en/tools/ranking/newest', expect: { status: [301, 302, 307, 308], locationEndsWith: '/en/tools/' } },
  { name: 'ranking popular', url: '/en/tools/ranking/popular', expect: { status: [301, 302, 307, 308], locationEndsWith: '/en/tools/' } },
  { name: 'legacy category under tools', url: '/en/tools/category/text', expect: { status: [301, 302, 307, 308], locationEndsWith: '/en/categories/text/' } },
  { name: 'legacy nonlocalized category under tools', url: '/tools/category/text', expect: { status: [301, 302, 307, 308], locationEndsWith: '/en/categories/text/' } },
  { name: 'missing url', url: '/en/this-route-should-not-exist-xyz', expect: { status: 404 } },
  { name: 'legacy tool redirect', url: '/tools/jwt-decoder', expect: { status: [301, 302, 307, 308], locationEndsWith: '/en/tools/jwt-decoder/' } },
  { name: 'tool page', url: '/en/tools/venn-diagram-generator/', expect: { status: 200 } },
];

function normalizeLocation(location) {
  if (!location) return '';
  if (location.startsWith('http')) return new URL(location).pathname;
  return location;
}

async function fetchManual(url) {
  const res = await fetch(url, { redirect: 'manual' });
  return {
    status: res.status,
    contentType: res.headers.get('content-type') || '',
    location: normalizeLocation(res.headers.get('location')),
  };
}

async function fetchFollow(url) {
  const res = await fetch(url, { redirect: 'follow' });
  return {
    status: res.status,
    finalUrl: res.url,
  };
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow' });
  return {
    status: res.status,
    finalUrl: res.url,
    text: await res.text(),
  };
}

async function runCheck(check) {
  const target = `${BASE_URL}${check.url}`;
  const manual = await fetchManual(target);
  const details = [];
  let ok = true;

  if (check.expect.status) {
    const expected = Array.isArray(check.expect.status) ? check.expect.status : [check.expect.status];
    if (!expected.includes(manual.status)) {
      ok = false;
      details.push(`status ${manual.status} (expected ${expected.join(', ')})`);
    }
  }
  if (check.allowRedirectTo && [301, 302, 307, 308].includes(manual.status)) {
    if (manual.location.endsWith(check.allowRedirectTo)) {
      return { ok: true, details: [`redirected to ${manual.location}`], manual };
    }
  }
  if (check.expect.contentTypeIncludes && !manual.contentType.includes(check.expect.contentTypeIncludes)) {
    ok = false;
    details.push(`content-type "${manual.contentType}"`);
  }
  if (check.expect.locationEndsWith && !manual.location.endsWith(check.expect.locationEndsWith)) {
    ok = false;
    details.push(`location "${manual.location || '(none)'}"`);
  }

  if (check.expect.status === 404) {
    const followed = await fetchFollow(target);
    const targetPath = new URL(target).pathname;
    const followedPath = new URL(followed.finalUrl).pathname;
    const normalized404Path = targetPath.endsWith('/') ? targetPath : `${targetPath}/`;

    if (
      [301, 302, 307, 308].includes(manual.status)
      && manual.location === normalized404Path
      && followed.status === 404
      && followedPath === normalized404Path
    ) {
      return { ok: true, details: [`slash-normalized 404 via ${manual.location}`], manual };
    }

    if (followed.status === 200 && /\/en\/?$/.test(followedPath)) {
      ok = false;
      details.push(`soft-redirect to ${followed.finalUrl}`);
    }
  }

  if (check.bodyMustNotInclude) {
    const followed = await fetchText(target);
    if (followed.text.includes(check.bodyMustNotInclude)) {
      ok = false;
      details.push(`body contains "${check.bodyMustNotInclude}"`);
    }
  }

  if (check.bodyMustInclude) {
    const followed = await fetchText(target);
    if (!followed.text.includes(check.bodyMustInclude)) {
      ok = false;
      details.push(`body missing "${check.bodyMustInclude}"`);
    }
  }

  return { ok, details, manual };
}

async function main() {
  const results = [];
  for (const check of checks) {
    const result = await runCheck(check);
    results.push({ check, ...result });
  }

  const failed = results.filter((r) => !r.ok);
  for (const entry of results) {
    const status = entry.ok ? 'OK ' : 'FAIL';
    const details = entry.ok ? '' : ` -> ${entry.details.join('; ')}`;
    console.log(`${status} ${entry.check.name} ${entry.check.url}${details}`);
  }

  if (failed.length) {
    console.log(`\n${failed.length} checks failed. BASE_URL=${BASE_URL}`);
    process.exitCode = 1;
  } else {
    console.log(`\nAll checks passed. BASE_URL=${BASE_URL}`);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exitCode = 1;
});
