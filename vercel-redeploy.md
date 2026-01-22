# Vercel 重新部署指南

## 如果图表工具仍然无法加载

### 方法 1：Vercel CLI 强制重新部署

```bash
# 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 登录
vercel login

# 强制重新部署（跳过缓存）
vercel --prod --force
```

### 方法 2：在 Vercel Dashboard 手动操作

1. 登录 https://vercel.com
2. 进入项目 u2tool
3. 点击 "Deployments" 标签
4. 找到最新的部署
5. 点击右侧的 "..." 菜单
6. 选择 "Redeploy"
7. 勾选 "Use existing Build Cache" 的反选项（不使用缓存）
8. 点击 "Redeploy"

### 方法 3：删除 .vercel 目录并重新链接

```bash
rm -rf .vercel
vercel link
vercel --prod
```

### 方法 4：检查环境变量

确保 Vercel 项目设置中没有设置会影响构建的环境变量。

## 验证部署成功

1. 检查部署日志中是否有 "Build successful"
2. 访问 https://www.u2tool.com/en/tools/gauge-chart-generator
3. 打开浏览器开发者工具（F12）
4. 查看 Console 是否有错误
5. 查看 Network 标签，确认 JS 文件加载成功

## 当前 Git 状态

- 最新提交: f2ab77a
- 修复内容: 38 个图表组件的 React Hooks 依赖项
- 推送时间: 2026-01-22

## 如果问题持续

可能需要检查：
1. Vercel 的 Node.js 版本是否与本地一致
2. 是否有 Vercel 特定的构建错误
3. 是否需要更新 next.config.js 配置
