/**
 * Yandex Webmaster 验证文件路由
 * 通过 API 路由确保返回正确的验证内容
 */
export async function GET() {
  const html = `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>Verification: d3e0d052e17a742e</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
