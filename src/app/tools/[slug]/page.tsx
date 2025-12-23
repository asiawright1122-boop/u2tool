import { redirect } from 'next/navigation';

export default async function ToolRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // 重定向到默认语言的工具页面
  redirect(`/en/tools/${slug}`);
}
