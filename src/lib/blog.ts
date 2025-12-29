/**
 * 博客工具函数
 * 处理博客文章的读取和解析
 */

import fs from 'fs';
import path from 'path';
import { blogPosts, BlogPost } from '@/config/blog';

// 博客文章内容接口
export interface BlogPostContent extends BlogPost {
  title: string;
  description: string;
  content: string;
}

// 博客文章元数据（用于列表页）
export interface BlogPostMeta extends BlogPost {
  title: string;
  description: string;
}

/**
 * 从 Markdown 文件中提取标题和描述
 */
function extractMetaFromMarkdown(content: string): { title: string; description: string } {
  const lines = content.split('\n');
  let title = '';
  let description = '';
  
  // 提取标题（第一个 # 开头的行）
  for (const line of lines) {
    if (line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
      break;
    }
  }
  
  // 提取描述（标题后的第一个非空段落）
  let foundTitle = false;
  for (const line of lines) {
    if (line.startsWith('# ')) {
      foundTitle = true;
      continue;
    }
    if (foundTitle && line.trim() && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('```')) {
      description = line.trim().slice(0, 160);
      if (line.length > 160) {
        description += '...';
      }
      break;
    }
  }
  
  return { title, description };
}

/**
 * 获取博客文章内容
 */
export function getBlogPostContent(slug: string, locale: string): BlogPostContent | null {
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return null;
  
  // 尝试读取对应语言的文章，如果不存在则回退到英文
  const contentPath = path.join(process.cwd(), 'content', 'blog', locale, `${slug}.md`);
  const fallbackPath = path.join(process.cwd(), 'content', 'blog', 'en', `${slug}.md`);
  
  let filePath = contentPath;
  if (!fs.existsSync(contentPath)) {
    if (!fs.existsSync(fallbackPath)) {
      return null;
    }
    filePath = fallbackPath;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const { title, description } = extractMetaFromMarkdown(content);
  
  return {
    ...post,
    title,
    description,
    content,
  };
}

/**
 * 获取所有博客文章元数据（用于列表页）
 */
export function getAllBlogPostsMeta(locale: string): BlogPostMeta[] {
  return blogPosts
    .map(post => {
      const contentPath = path.join(process.cwd(), 'content', 'blog', locale, `${post.slug}.md`);
      const fallbackPath = path.join(process.cwd(), 'content', 'blog', 'en', `${post.slug}.md`);
      
      let filePath = contentPath;
      if (!fs.existsSync(contentPath)) {
        if (!fs.existsSync(fallbackPath)) {
          return null;
        }
        filePath = fallbackPath;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const { title, description } = extractMetaFromMarkdown(content);
      
      return {
        ...post,
        title,
        description,
      };
    })
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/**
 * 获取所有博客文章 slug（用于静态生成）
 */
export function getAllBlogSlugs(): string[] {
  return blogPosts.map(post => post.slug);
}
