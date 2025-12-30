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
