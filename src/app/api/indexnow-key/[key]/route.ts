/**
 * IndexNow Key 验证文件路由
 * 通过 API 路由处理 IndexNow key 验证请求
 * 配合 next.config.js 重写规则使用
 */

import { NextRequest } from 'next/server';
import { getIndexNowKey, isValidIndexNowKey } from '@/lib/indexnow';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  
  // 获取配置的 IndexNow key
  const configuredKey = getIndexNowKey();
  
  // 验证 key 是否匹配
  if (!configuredKey || key !== configuredKey) {
    return new Response('Not Found', { status: 404 });
  }
  
  // 验证 key 格式
  if (!isValidIndexNowKey(key)) {
    return new Response('Invalid key format', { status: 400 });
  }
  
  // 返回 key 内容（IndexNow 验证要求）
  return new Response(key, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
