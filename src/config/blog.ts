/**
 * 博客文章配置
 * 支持多语言博客文章
 */

export interface BlogPost {
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  featured?: boolean;
  relatedTools?: string[]; // 相关工具的 slug 列表
}

// 博客文章列表
export const blogPosts: BlogPost[] = [
  // 新文章 - 2025年1月（第二批）
  {
    slug: 'markdown-syntax-guide',
    publishedAt: '2025-01-13',
    author: 'U2Tool Team',
    tags: ['markdown', 'documentation', 'tutorial', 'developer-tools'],
    featured: true,
    relatedTools: ['markdown-preview', 'html-to-markdown', 'text-diff'],
  },
  {
    slug: 'image-optimization-web',
    publishedAt: '2025-01-13',
    author: 'U2Tool Team',
    tags: ['image', 'optimization', 'web-performance', 'tutorial'],
    featured: true,
    relatedTools: ['image-compressor', 'image-converter', 'image-resizer'],
  },
  {
    slug: 'hash-algorithms-explained',
    publishedAt: '2025-01-13',
    author: 'U2Tool Team',
    tags: ['hash', 'security', 'cryptography', 'tutorial'],
    featured: true,
    relatedTools: ['hash-generator', 'md5-generator', 'sha256-generator'],
  },
  {
    slug: 'url-encoding-guide',
    publishedAt: '2025-01-13',
    author: 'U2Tool Team',
    tags: ['url', 'encoding', 'web-development', 'tutorial'],
    featured: false,
    relatedTools: ['url-encoder', 'url-parser', 'base64'],
  },
  {
    slug: 'unix-timestamp-guide',
    publishedAt: '2025-01-13',
    author: 'U2Tool Team',
    tags: ['timestamp', 'datetime', 'programming', 'tutorial'],
    featured: false,
    relatedTools: ['timestamp-converter', 'date-calculator', 'timezone-converter'],
  },
  // 新文章 - 2025年1月（第一批）
  {
    slug: 'regex-complete-guide',
    publishedAt: '2025-01-12',
    author: 'U2Tool Team',
    tags: ['regex', 'programming', 'tutorial', 'developer-tools'],
    featured: true,
    relatedTools: ['regex-tester', 'text-diff', 'string-utilities'],
  },
  {
    slug: 'jwt-tokens-explained',
    publishedAt: '2025-01-12',
    author: 'U2Tool Team',
    tags: ['jwt', 'authentication', 'security', 'web-development'],
    featured: true,
    relatedTools: ['jwt-decoder', 'base64', 'hash-generator'],
  },
  {
    slug: 'password-security-best-practices',
    publishedAt: '2025-01-11',
    author: 'U2Tool Team',
    tags: ['security', 'password', 'best-practices', 'tutorial'],
    featured: true,
    relatedTools: ['password-generator', 'password-strength', 'hash-generator'],
  },
  {
    slug: 'color-formats-conversion-guide',
    publishedAt: '2025-01-10',
    author: 'U2Tool Team',
    tags: ['color', 'design', 'css', 'tutorial'],
    featured: false,
    relatedTools: ['color-converter', 'color-picker', 'gradient-generator'],
  },
  {
    slug: 'qr-code-complete-guide',
    publishedAt: '2025-01-09',
    author: 'U2Tool Team',
    tags: ['qr-code', 'generator', 'tutorial', 'marketing'],
    featured: false,
    relatedTools: ['qr-generator', 'barcode-generator', 'url-encoder'],
  },
  // 原有文章
  {
    slug: 'best-json-formatter-tools-2025',
    publishedAt: '2025-01-02',
    author: 'U2Tool Team',
    tags: ['json', 'formatter', 'developer-tools'],
    featured: true,
    relatedTools: ['json-formatter', 'json-to-csv', 'xml-formatter'],
  },
  {
    slug: 'base64-encoding-explained',
    publishedAt: '2025-01-01',
    author: 'U2Tool Team',
    tags: ['base64', 'encoding', 'tutorial'],
    featured: true,
    relatedTools: ['base64', 'image-to-base64', 'url-encoder'],
  },
  {
    slug: 'uuid-generator-guide',
    publishedAt: '2024-12-30',
    author: 'U2Tool Team',
    tags: ['uuid', 'generator', 'guide'],
    featured: false,
    relatedTools: ['uuid-generator', 'password-generator', 'hash-generator'],
  },
];

// 获取所有博客文章
export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// 获取精选文章
export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

// 根据 slug 获取文章
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// 根据标签获取文章
export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.includes(tag));
}

// 获取所有标签
export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}
