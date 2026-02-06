/**
 * 动态 OG 图片生成 API
 * 
 * 注意：ImageResponse 在 Cloudflare Workers 上有兼容性问题
 * 暂时返回重定向到静态 OG 图片
 */

import { NextRequest, NextResponse } from 'next/server';

// 缓存配置
const CACHE_MAX_AGE = 60 * 60 * 24 * 7; // 7 天

export async function GET(request: NextRequest) {
  // 暂时返回一个简单的 JSON 响应
  // TODO: 实现 Cloudflare Workers 兼容的 OG 图片生成
  // 可以考虑使用 Cloudflare Images 或预生成的静态图片
  
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'ToolBox';
  
  return NextResponse.json(
    { 
      message: 'OG image generation temporarily disabled for Cloudflare Workers compatibility',
      title,
      fallback: '/og-default.png'
    },
    {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
      },
    }
  );
}
