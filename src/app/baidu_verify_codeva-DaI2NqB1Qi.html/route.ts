/**
 * 百度站长平台验证文件路由
 * 通过 API 路由确保返回正确的验证内容
 */
export async function GET() {
  // 返回纯文本验证码
  return new Response('codeva-DaI2NqB1Qi', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
