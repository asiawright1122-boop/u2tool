/**
 * 上下文链接模块
 * 在工具描述中自动添加相关工具链接
 * @see Requirements 8.3
 */

// 工具关键词映射
const TOOL_KEYWORDS: Record<string, string[]> = {
  'json-formatter': ['JSON', 'json', 'JSON 格式化', 'JSON formatter'],
  'base64': ['Base64', 'base64', 'Base64 编码', 'Base64 encoding'],
  'url-encoder': ['URL 编码', 'URL encoding', 'URL encode', 'percent encoding'],
  'html-encoder': ['HTML 编码', 'HTML encoding', 'HTML entities'],
  'uuid-generator': ['UUID', 'uuid', 'GUID', 'guid', '唯一标识符'],
  'password-generator': ['密码生成', 'password generator', '强密码'],
  'hash-generator': ['哈希', 'hash', 'MD5', 'SHA', 'SHA-256'],
  'qr-generator': ['二维码', 'QR code', 'QR 码'],
  'color-converter': ['颜色转换', 'color converter', 'HEX', 'RGB', 'HSL'],
  'timestamp-converter': ['时间戳', 'timestamp', 'Unix 时间'],
  'regex-tester': ['正则表达式', 'regex', 'regular expression'],
  'diff-checker': ['差异对比', 'diff', 'compare', '文本对比'],
  'word-counter': ['字数统计', 'word count', '字符统计'],
  'image-compressor': ['图片压缩', 'image compression', '图像压缩'],
  'image-resizer': ['图片调整', 'image resize', '图片尺寸'],
  'jwt-decoder': ['JWT', 'jwt', 'JSON Web Token'],
  'xml-formatter': ['XML', 'xml', 'XML 格式化'],
  'yaml-json': ['YAML', 'yaml', 'YAML 转换'],
  'markdown-preview': ['Markdown', 'markdown', 'MD'],
  'csv-to-json': ['CSV', 'csv', 'CSV 转换'],
};

// 链接模板
interface ContextualLink {
  toolSlug: string;
  keyword: string;
  startIndex: number;
  endIndex: number;
}

/**
 * 在文本中查找可以添加链接的关键词
 * @param text - 原始文本
 * @param excludeSlug - 排除的工具 slug（当前工具）
 * @returns 可添加链接的位置数组
 */
export function findLinkableKeywords(
  text: string,
  excludeSlug?: string
): ContextualLink[] {
  const links: ContextualLink[] = [];
  const usedPositions = new Set<number>();

  for (const [toolSlug, keywords] of Object.entries(TOOL_KEYWORDS)) {
    // 跳过当前工具
    if (toolSlug === excludeSlug) continue;

    for (const keyword of keywords) {
      // 使用正则查找关键词（区分大小写）
      const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'g');
      let match;

      while ((match = regex.exec(text)) !== null) {
        const startIndex = match.index;
        const endIndex = startIndex + keyword.length;

        // 检查位置是否已被使用
        let overlap = false;
        for (let i = startIndex; i < endIndex; i++) {
          if (usedPositions.has(i)) {
            overlap = true;
            break;
          }
        }

        if (!overlap) {
          links.push({
            toolSlug,
            keyword,
            startIndex,
            endIndex,
          });

          // 标记位置为已使用
          for (let i = startIndex; i < endIndex; i++) {
            usedPositions.add(i);
          }

          // 每个工具只添加一个链接
          break;
        }
      }
    }
  }

  // 按位置排序
  return links.sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * 在文本中添加上下文链接
 * @param text - 原始文本
 * @param locale - 语言
 * @param excludeSlug - 排除的工具 slug
 * @param maxLinks - 最大链接数量
 * @returns 带链接的 HTML 文本
 */
export function addContextualLinks(
  text: string,
  locale: string,
  excludeSlug?: string,
  maxLinks: number = 3
): string {
  const links = findLinkableKeywords(text, excludeSlug).slice(0, maxLinks);
  
  if (links.length === 0) {
    return text;
  }

  // 从后向前替换，避免位置偏移
  let result = text;
  for (let i = links.length - 1; i >= 0; i--) {
    const link = links[i];
    const href = `/${locale}/tools/${link.toolSlug}`;
    const linkedText = `<a href="${href}" class="text-blue-600 dark:text-blue-400 hover:underline">${link.keyword}</a>`;
    result = result.slice(0, link.startIndex) + linkedText + result.slice(link.endIndex);
  }

  return result;
}

/**
 * 获取文本中提到的相关工具
 * @param text - 文本内容
 * @param excludeSlug - 排除的工具 slug
 * @returns 相关工具 slug 数组
 */
export function getMentionedTools(
  text: string,
  excludeSlug?: string
): string[] {
  const links = findLinkableKeywords(text, excludeSlug);
  return [...new Set(links.map(l => l.toolSlug))];
}

/**
 * 转义正则表达式特殊字符
 * @param str - 原始字符串
 * @returns 转义后的字符串
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 验证上下文链接
 * @param text - 原始文本
 * @param linkedText - 带链接的文本
 * @returns 验证结果
 */
export function validateContextualLinks(
  text: string,
  linkedText: string
): {
  valid: boolean;
  linkCount: number;
  errors: string[];
} {
  const errors: string[] = [];
  
  // 计算链接数量
  const linkMatches = linkedText.match(/<a\s+href=/g);
  const linkCount = linkMatches ? linkMatches.length : 0;

  // 检查链接格式
  const hrefPattern = /<a\s+href="\/[a-z]{2}\/tools\/[a-z0-9-]+"/g;
  const validLinks = linkedText.match(hrefPattern);
  
  if (linkCount > 0 && (!validLinks || validLinks.length !== linkCount)) {
    errors.push('存在格式不正确的链接');
  }

  // 检查是否有未闭合的标签
  const openTags = (linkedText.match(/<a\s/g) || []).length;
  const closeTags = (linkedText.match(/<\/a>/g) || []).length;
  
  if (openTags !== closeTags) {
    errors.push('存在未闭合的链接标签');
  }

  return {
    valid: errors.length === 0,
    linkCount,
    errors,
  };
}
