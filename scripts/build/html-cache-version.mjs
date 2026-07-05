import { createHash } from 'node:crypto';

function read(args, readGitValue) {
  return readGitValue(args).trim();
}

function fingerprint(value) {
  return createHash('sha256').update(value).digest('hex').slice(0, 12);
}

export function getHtmlCacheVersion({ env = process.env, readGitValue } = {}) {
  const explicitVersion = env.U2TOOL_HTML_CACHE_VERSION?.trim();
  if (explicitVersion) {
    return explicitVersion;
  }

  const gitReader = readGitValue ?? (() => '');
  const commit = read(['rev-parse', '--short=12', 'HEAD'], gitReader) || 'unknown';
  const status = read(['status', '--porcelain'], gitReader);

  if (!status) {
    return commit;
  }

  const dirtyInput = [
    status,
    read(['diff', '--binary', 'HEAD'], gitReader),
    read(['ls-files', '--others', '--exclude-standard'], gitReader),
  ].join('\n');

  return `${commit}-dirty-${fingerprint(dirtyInput)}`;
}
