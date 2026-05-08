/**
 * HTML 净化工具
 * 
 * 用于防止 XSS 攻击，对用户输入的 HTML/Markdown 进行净化。
 * 支持 DOMPurify（推荐）或基础净化作为备选。
 * 
 * @usage
 * import { sanitizeHtml, sanitizeSvg } from '@/lib/sanitize';
 * 
 * // 净化用户 HTML
 * const safeHtml = sanitizeHtml(userInput);
 * 
 * // 净化 SVG
 * const safeSvg = sanitizeSvg(userSvg);
 */

import DOMPurify from 'dompurify';

type DomPurifySanitizer = {
    sanitize: (html: string, config?: Record<string, unknown>) => string;
    isSupported?: boolean;
};

/**
 * 基础 HTML 转义（作为备选方案）
 * 仅在 DOMPurify 不可用时使用
 */
function escapeHtml(str: string): string {
    const htmlEscapes: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };
    return str.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

/**
 * 基础 HTML 标签白名单净化
 * 仅在 DOMPurify 不可用时使用
 */
function isSafeUrlAttribute(value: string): boolean {
    const trimmed = value.trim().replace(/[\u0000-\u001f\u007f\s]+/g, '');
    if (!trimmed) {
        return true;
    }

    return /^(?:https?:|mailto:|tel:|\/|#|data:image\/(?:png|gif|jpe?g|webp);)/i.test(trimmed);
}

function normalizeAttributeValue(value: string): string {
    return escapeHtml(value);
}

function stripUnsafeSvgAttributeValue(
    svg: string,
    attributeNames: string[],
    isSafeValue: (value: string) => boolean
): string {
    const pattern = attributeNames
        .map((attributeName) => attributeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');
    const attributePattern = new RegExp(
        "\\s(?:" + pattern + ")\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s\"'=<>`]+))",
        'gi'
    );

    return svg.replace(attributePattern, (match, doubleQuoted, singleQuoted, bare) => {
        const value = doubleQuoted ?? singleQuoted ?? bare ?? '';
        return isSafeValue(value) ? match : '';
    });
}

function normalizeUrlLikeValue(value: string): string {
    return value.trim().replace(/[\u0000-\u001f\u007f\s]+/g, '');
}

function isSafeSvgReference(value: string): boolean {
    const normalized = normalizeUrlLikeValue(value);
    if (!normalized || normalized.startsWith('#')) {
        return true;
    }

    if (/^(?:https?:|data:image\/(?:png|gif|jpe?g|webp);)/i.test(normalized)) {
        return true;
    }

    return !/^[a-z][a-z0-9+.-]*:/i.test(normalized);
}

function isSafeSvgStyleAttribute(value: string): boolean {
    if (/expression\s*\(|javascript:/i.test(value)) {
        return false;
    }

    const urlPattern = /url\(\s*(['"]?)(.*?)\1\s*\)/gi;
    let match: RegExpExecArray | null;
    while ((match = urlPattern.exec(value)) !== null) {
        if (!isSafeSvgReference(match[2] ?? '')) {
            return false;
        }
    }

    return true;
}

function stripUnsafeSvgActiveContent(svg: string): string {
    let sanitized = svg
        .replace(/<\?(?:xml-stylesheet|import|processing-instruction)\b[\s\S]*?\?>/gi, '')
        .replace(/<(script|style|iframe|object|embed|foreignObject)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/<\/?(script|style|iframe|object|embed|foreignObject|link|meta)\b[^>]*\/?>/gi, '')
        .replace(/\s+on[a-z0-9:-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+)/gi, '');

    sanitized = stripUnsafeSvgAttributeValue(
        sanitized,
        ['href', 'xlink:href', 'src'],
        isSafeSvgReference
    );
    sanitized = stripUnsafeSvgAttributeValue(sanitized, ['style'], isSafeSvgStyleAttribute);

    return sanitized.replace(/javascript:/gi, '');
}

function basicSanitize(
    html: string,
    options?: {
        allowedTags?: string[];
        allowedAttributes?: string[];
    }
): string {
    // 允许的标签（基础）
    const allowedTags = new Set((options?.allowedTags ?? [
        'p', 'br', 'b', 'i', 'u', 'strong', 'em', 'span', 'div',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'blockquote', 'pre', 'code',
    ]).map((tag) => tag.toLowerCase()));
    const allowedAttributes = new Set((options?.allowedAttributes ?? [
        'href', 'src', 'alt', 'title', 'class', 'id',
        'target', 'rel', 'width', 'height',
        'colspan', 'rowspan',
    ]).map((attr) => attr.toLowerCase()));

    // 移除脚本标签和事件处理器
    let sanitized = html
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, 'data-removed=');

    // 移除不在白名单中的标签（保留内容）
    const tagPattern = /<\/?([a-z][a-z0-9-]*)\b([^>]*)>/gi;
    sanitized = sanitized.replace(tagPattern, (match, tag, rawAttributes = '') => {
        const normalizedTag = String(tag).toLowerCase();
        if (!allowedTags.has(normalizedTag)) {
            return '';
        }

        if (match.startsWith('</')) {
            return `</${normalizedTag}>`;
        }

        const attributes: string[] = [];
        const attrPattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
        let attrMatch: RegExpExecArray | null;
        while ((attrMatch = attrPattern.exec(String(rawAttributes))) !== null) {
            const attrName = attrMatch[1].toLowerCase();
            if (attrName.startsWith('on') || !allowedAttributes.has(attrName)) {
                continue;
            }

            const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
            if ((attrName === 'href' || attrName === 'src') && !isSafeUrlAttribute(attrValue)) {
                continue;
            }

            attributes.push(`${attrName}="${normalizeAttributeValue(attrValue)}"`);
        }

        return attributes.length > 0
            ? `<${normalizedTag} ${attributes.join(' ')}>`
            : `<${normalizedTag}>`;
    });

    return sanitized;
}

function getDOMPurify(): DomPurifySanitizer | null {
    const sanitizer = DOMPurify as unknown as DomPurifySanitizer;
    if (
        typeof window !== 'undefined' &&
        typeof sanitizer.sanitize === 'function' &&
        sanitizer.isSupported !== false
    ) {
        return sanitizer;
    }

    return null;
}

/**
 * 净化 HTML 内容
 * 
 * 使用 DOMPurify（如果可用）或基础净化作为备选。
 * 
 * @param html - 需要净化的 HTML 字符串
 * @param options - DOMPurify 配置选项
 * @returns 净化后的 HTML 字符串
 */
export function sanitizeHtml(
    html: string,
    options?: {
        allowedTags?: string[];
        allowedAttributes?: string[];
        forceBody?: boolean;
    }
): string {
    if (!html || typeof html !== 'string') {
        return '';
    }

    // 使用 DOMPurify（推荐）
    const sanitizer = getDOMPurify();
    if (sanitizer) {
        const config: Record<string, unknown> = {
            ALLOWED_TAGS: options?.allowedTags,
            ALLOWED_ATTR: options?.allowedAttributes,
            FORCE_BODY: options?.forceBody ?? false,
        };

        // 移除 undefined 的配置项
        Object.keys(config).forEach(key => {
            if (config[key] === undefined) {
                delete config[key];
            }
        });

        return sanitizer.sanitize(html, config);
    }

    // 备选：使用基础净化
    return basicSanitize(html, options);
}

/**
 * 净化 SVG 内容
 * 
 * SVG 可能包含恶意脚本，需要特殊处理。
 * 
 * @param svg - 需要净化的 SVG 字符串
 * @returns 净化后的 SVG 字符串
 */
export function sanitizeSvg(svg: string): string {
    if (!svg || typeof svg !== 'string') {
        return '';
    }

    // 使用 DOMPurify（推荐）
    const sanitizer = getDOMPurify();
    if (sanitizer) {
        const config = {
            USE_PROFILES: { svg: true, svgFilters: true },
            // 移除可能的脚本元素
            FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'foreignObject'],
            FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover'],
        };

        return stripUnsafeSvgActiveContent(sanitizer.sanitize(svg, config));
    }

    // 备选：基础 SVG 净化
    return stripUnsafeSvgActiveContent(svg);
}

/**
 * 将 SVG/CSS 颜色输入限制为不会逃逸属性上下文的安全值。
 */
export function normalizeSvgColor(value: string, fallback = '#000000'): string {
    if (typeof value !== 'string') {
        return fallback;
    }

    const color = value.trim();
    if (/^#[0-9a-f]{3,8}$/i.test(color) || /^[a-z]+$/i.test(color)) {
        return color;
    }

    return fallback;
}

/**
 * 净化 Markdown 转换后的 HTML
 * 
 * 专门用于 Markdown 渲染器的输出，允许常见的 Markdown 元素。
 * 
 * @param html - Markdown 转换后的 HTML
 * @returns 净化后的 HTML
 */
export function sanitizeMarkdownHtml(html: string): string {
    return sanitizeHtml(html, {
        allowedTags: [
            // 标题
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            // 段落和换行
            'p', 'br', 'hr',
            // 文本格式
            'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark',
            // 链接和图片
            'a', 'img',
            // 列表
            'ul', 'ol', 'li',
            // 代码
            'pre', 'code', 'kbd', 'samp',
            // 引用
            'blockquote', 'q', 'cite',
            // 表格
            'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
            // 其他
            'div', 'span', 'details', 'summary',
        ],
        allowedAttributes: [
            'href', 'src', 'alt', 'title', 'class', 'id',
            'target', 'rel', 'width', 'height',
            'colspan', 'rowspan',
        ],
    });
}

/**
 * 转义用于在 HTML 属性中使用的字符串
 * 
 * @param str - 需要转义的字符串
 * @returns 转义后的字符串
 */
export function escapeHtmlAttribute(str: string): string {
    return escapeHtml(str).replace(/`/g, '&#96;');
}

const fallbackHtmlEntities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: '\u00a0',
    copy: '\u00a9',
    reg: '\u00ae',
    trade: '\u2122',
    hellip: '\u2026',
    ndash: '\u2013',
    mdash: '\u2014',
};

function decodeHtmlEntity(entity: string): string {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
        const codePoint = Number.parseInt(entity.slice(2), 16);
        return Number.isFinite(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
            ? String.fromCodePoint(codePoint)
            : `&${entity};`;
    }

    if (entity.startsWith('#')) {
        const codePoint = Number.parseInt(entity.slice(1), 10);
        return Number.isFinite(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
            ? String.fromCodePoint(codePoint)
            : `&${entity};`;
    }

    return fallbackHtmlEntities[entity.toLowerCase()] ?? `&${entity};`;
}

/**
 * 将 HTML 文本解码为纯文本。浏览器端使用 inert DOMParser，Node 端保留基础备选。
 */
export function decodeHtmlText(html: string): string {
    if (!html || typeof html !== 'string') {
        return '';
    }

    if (typeof DOMParser !== 'undefined') {
        const document = new DOMParser().parseFromString(html, 'text/html');
        return document.body.textContent ?? '';
    }

    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&(#x?[0-9a-f]+|[a-z][a-z0-9]+);/gi, (_, entity: string) => decodeHtmlEntity(entity));
}

/**
 * 生成不会穿越路径或伪装扩展名的下载文件名。
 */
export function safeDownloadFileName(name: string, fallback = 'download', extension?: string): string {
    const safeExtension = extension?.replace(/^\.+/, '').replace(/[^a-z0-9]/gi, '') ?? '';
    const extensionSuffix = safeExtension ? `.${safeExtension}` : '';
    const safeFallback = fallback.trim().replace(/[^a-z0-9._-]/gi, '-') || 'download';
    const maxStemLength = Math.max(1, 180 - extensionSuffix.length);
    let stem = (typeof name === 'string' ? name : '')
        .normalize('NFKC')
        .trim()
        .replace(/[\u0000-\u001f\u007f<>:"/\\|?*\u202a-\u202e\u2066-\u2069]/g, '-')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^[.\-]+|[.\-]+$/g, '')
        .slice(0, maxStemLength)
        .replace(/[.\-]+$/g, '');

    if (!stem) {
        stem = safeFallback;
    }

    if (/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(stem)) {
        stem = `${stem}-file`;
    }

    return `${stem}${extensionSuffix}`;
}

/**
 * 检查 DOMPurify 是否可用
 * 
 * @returns 是否使用 DOMPurify
 */
export function isDOMPurifyAvailable(): boolean {
    return getDOMPurify() !== null;
}
