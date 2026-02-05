/**
 * On-Demand Revalidation API
 * 
 * 功能：
 * - 按路径触发页面重新验证
 * - 支持批量重新验证
 * - API 密钥验证
 * 
 * @see Requirements 1.5, 15.7, 16.3
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// 支持的语言列表
const SUPPORTED_LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ko', 'fr', 'de', 'ru', 'ar'];

// 验证 API 密钥
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || request.nextUrl.searchParams.get('key');
  const expectedKey = process.env.REVALIDATE_API_KEY;
  
  if (!expectedKey) {
    // 如果没有配置 API 密钥，在开发环境允许访问
    return process.env.NODE_ENV === 'development';
  }
  
  return apiKey === expectedKey;
}

// POST /api/revalidate
export async function POST(request: NextRequest) {
  // 验证 API 密钥
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid or missing API key' },
      { status: 401 }
    );
  }
  
  try {
    const body = await request.json();
    const { paths, tags, type = 'path' } = body as {
      paths?: string[];
      tags?: string[];
      type?: 'path' | 'tag';
    };
    
    const results: { path?: string; tag?: string; success: boolean; error?: string }[] = [];
    
    // 按路径重新验证
    if (type === 'path' && paths && paths.length > 0) {
      for (const path of paths) {
        try {
          revalidatePath(path);
          results.push({ path, success: true });
        } catch (error) {
          results.push({
            path,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }
    
    // 按标签重新验证
    if (type === 'tag' && tags && tags.length > 0) {
      for (const tag of tags) {
        try {
          revalidateTag(tag);
          results.push({ tag, success: true });
        } catch (error) {
          results.push({
            tag,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    return NextResponse.json({
      success: failCount === 0,
      message: `Revalidated ${successCount} items, ${failCount} failed`,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Bad Request',
        message: error instanceof Error ? error.message : 'Invalid request body',
      },
      { status: 400 }
    );
  }
}

// GET /api/revalidate?path=/en/tools/json-formatter
export async function GET(request: NextRequest) {
  // 验证 API 密钥
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid or missing API key' },
      { status: 401 }
    );
  }
  
  const path = request.nextUrl.searchParams.get('path');
  const tag = request.nextUrl.searchParams.get('tag');
  const tool = request.nextUrl.searchParams.get('tool');
  const locale = request.nextUrl.searchParams.get('locale');
  const category = request.nextUrl.searchParams.get('category');
  
  try {
    const results: { path?: string; tag?: string; success: boolean }[] = [];
    
    // 按路径重新验证
    if (path) {
      revalidatePath(path);
      results.push({ path, success: true });
    }
    
    // 按标签重新验证
    if (tag) {
      revalidateTag(tag);
      results.push({ tag, success: true });
    }
    
    // 按工具重新验证（所有语言）
    if (tool) {
      const locales = locale ? [locale] : SUPPORTED_LOCALES;
      for (const loc of locales) {
        const toolPath = `/${loc}/tools/${tool}`;
        revalidatePath(toolPath);
        results.push({ path: toolPath, success: true });
      }
    }
    
    // 按分类重新验证（所有语言）
    if (category) {
      const locales = locale ? [locale] : SUPPORTED_LOCALES;
      for (const loc of locales) {
        const categoryPath = `/${loc}/tools/category/${category}`;
        revalidatePath(categoryPath);
        results.push({ path: categoryPath, success: true });
      }
    }
    
    if (results.length === 0) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'No path, tag, tool, or category specified',
          usage: {
            path: '/api/revalidate?path=/en/tools/json-formatter',
            tag: '/api/revalidate?tag=tools',
            tool: '/api/revalidate?tool=json-formatter',
            toolWithLocale: '/api/revalidate?tool=json-formatter&locale=en',
            category: '/api/revalidate?category=converters',
          },
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Revalidated ${results.length} paths`,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Revalidation failed',
      },
      { status: 500 }
    );
  }
}
