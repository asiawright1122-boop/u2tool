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

// 尝试动态导入 DOMPurify（如果已安装）
let DOMPurify: typeof import('dompurify') | null = null;

// 尝试加载 DOMPurify
if (typeof window !== 'undefined') {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        DOMPurify = require('dompurify');
    } catch {
        console.warn('DOMPurify not installed. Using basic sanitization. Run: npm install dompurify');
    }
}

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
function basicSanitize(html: string): string {
    // 允许的标签（基础）
    const allowedTags = [
        'p', 'br', 'b', 'i', 'u', 'strong', 'em', 'span', 'div',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'blockquote', 'pre', 'code',
    ];

    // 移除脚本标签和事件处理器
    let sanitized = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, 'data-removed=');

    // 移除不在白名单中的标签（保留内容）
    const tagPattern = /<\/?(\w+)[^>]*>/g;
    sanitized = sanitized.replace(tagPattern, (match, tag) => {
        if (allowedTags.includes(tag.toLowerCase())) {
            return match;
        }
        return '';
    });

    return sanitized;
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
    if (DOMPurify && typeof window !== 'undefined') {
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

        return DOMPurify.default
            ? DOMPurify.default.sanitize(html, config)
            : (DOMPurify as unknown as { sanitize: (html: string, config: Record<string, unknown>) => string }).sanitize(html, config);
    }

    // 备选：使用基础净化
    return basicSanitize(html);
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
    if (DOMPurify && typeof window !== 'undefined') {
        const config = {
            USE_PROFILES: { svg: true, svgFilters: true },
            // 移除可能的脚本元素
            FORBID_TAGS: ['script', 'style'],
            FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover'],
        };

        return DOMPurify.default
            ? DOMPurify.default.sanitize(svg, config)
            : (DOMPurify as unknown as { sanitize: (html: string, config: Record<string, unknown>) => string }).sanitize(svg, config);
    }

    // 备选：基础 SVG 净化
    return svg
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, 'data-removed=');
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

/**
 * 检查 DOMPurify 是否可用
 * 
 * @returns 是否使用 DOMPurify
 */
export function isDOMPurifyAvailable(): boolean {
    return DOMPurify !== null && typeof window !== 'undefined';
}
