/**
 * 动态 OG 图片生成 API
 * 使用 Next.js ImageResponse 生成 1200x630 像素的 OG 图片
 * @see Requirements 2.4 - OG 图片缓存优化
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// OG 图片尺寸
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// 缓存配置
const CACHE_MAX_AGE = 60 * 60 * 24 * 7; // 7 天
const CACHE_STALE_WHILE_REVALIDATE = 60 * 60 * 24; // 1 天

// 品牌颜色
const BRAND_COLORS = {
  background: '#0f172a', // slate-900
  primary: '#3b82f6',    // blue-500
  secondary: '#8b5cf6',  // violet-500
  text: '#f8fafc',       // slate-50
  textMuted: '#94a3b8',  // slate-400
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取参数
    const title = searchParams.get('title') || 'ToolBox';
    const locale = searchParams.get('locale') || 'en';
    const icon = searchParams.get('icon') || '🛠️';

    // 根据语言获取副标题
    const subtitles: Record<string, string> = {
      en: 'Free Online Tools for Developers',
      zh: '开发者免费在线工具',
      es: 'Herramientas en línea gratuitas',
      pt: 'Ferramentas online gratuitas',
      ja: '開発者向け無料オンラインツール',
    };
    const subtitle = subtitles[locale] || subtitles.en;

    // 生成基于参数的缓存键（用于 ETag）
    const cacheKey = `og-${title}-${locale}-${icon}`;
    const etag = `"${Buffer.from(cacheKey).toString('base64').slice(0, 32)}"`;

    // 检查 If-None-Match 头部
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
        },
      });
    }

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: OG_WIDTH,
            height: OG_HEIGHT,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${BRAND_COLORS.background} 0%, #1e293b 50%, ${BRAND_COLORS.background} 100%)`,
            position: 'relative',
          }}
        >
          {/* 背景装饰 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 20% 30%, ${BRAND_COLORS.primary}20 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${BRAND_COLORS.secondary}20 0%, transparent 50%)`,
            }}
          />

          {/* 顶部品牌标识 */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 60,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 32 }}>🛠️</span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: BRAND_COLORS.text,
              }}
            >
              ToolBox
            </span>
          </div>

          {/* 主要内容 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 80px',
            }}
          >
            {/* 工具图标 */}
            <span
              style={{
                fontSize: 80,
                marginBottom: 24,
              }}
            >
              {icon}
            </span>

            {/* 标题 */}
            <h1
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: BRAND_COLORS.text,
                margin: 0,
                lineHeight: 1.2,
                maxWidth: 900,
                textAlign: 'center',
              }}
            >
              {title}
            </h1>

            {/* 副标题 */}
            <p
              style={{
                fontSize: 28,
                color: BRAND_COLORS.textMuted,
                margin: '24px 0 0 0',
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* 底部装饰线 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 6,
              background: `linear-gradient(90deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary})`,
            }}
          />
        </div>
      ),
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        headers: {
          'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
          'ETag': etag,
          'Vary': 'Accept',
        },
      }
    );

    return imageResponse;
  } catch (error) {
    console.error('OG Image generation error:', error);
    
    // 返回一个简单的错误图片
    return new ImageResponse(
      (
        <div
          style={{
            width: OG_WIDTH,
            height: OG_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: BRAND_COLORS.background,
            color: BRAND_COLORS.text,
            fontSize: 48,
          }}
        >
          🛠️ ToolBox
        </div>
      ),
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
      }
    );
  }
}
