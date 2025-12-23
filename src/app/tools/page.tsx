import { redirect } from 'next/navigation';

export default function ToolsRedirectPage() {
  // 重定向到默认语言的工具页面
  redirect('/en/tools');
}
