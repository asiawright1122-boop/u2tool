# ToolBox - 多语言在线工具站

一个 SEO 友好、支持多语言的免费在线工具站，基于 Next.js 14 构建。

## 特性

- 🌍 **多语言支持**: 英语、中文、西班牙语、葡萄牙语、日语
- 🔍 **SEO 优化**: 自动生成 sitemap、多语言 hreflang 标签
- ⚡ **高性能**: 静态生成、边缘部署
- 🎨 **现代 UI**: Tailwind CSS、暗色主题
- 📱 **响应式**: 完美适配移动端
- 💰 **商业化就绪**: 支持 Google AdSense

## 包含工具

### 编码工具
- JSON 格式化
- Base64 编解码
- URL 编解码
- HTML 编解码

### 生成器
- UUID 生成器
- 密码生成器
- 哈希生成器 (SHA-1/256/384/512)
- 二维码生成器
- Lorem Ipsum 生成器

### 文本工具
- 字数统计
- 大小写转换
- Markdown 预览

### 转换器
- 颜色转换器 (HEX/RGB/HSL)
- 时间戳转换器

### 开发工具
- 正则表达式测试器

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 启动生产服务
npm start
```

## 部署到 Vercel

1. Fork 这个仓库
2. 在 Vercel 中导入项目
3. 设置环境变量 `NEXT_PUBLIC_BASE_URL`
4. 部署完成！

## 添加新工具

1. 在 `src/config/tools.ts` 添加工具配置
2. 在 `src/messages/*.json` 添加多语言文案
3. 在 `src/components/tools/` 创建工具组件
4. 在 `src/components/tools/ToolWrapper.tsx` 注册组件

## 环境变量

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **国际化**: next-intl
- **部署**: Vercel

## 成本估算

- **托管**: Vercel 免费版 (0元/月)
- **域名**: 约 100元/年
- **总计**: 约 10元/月

## License

MIT
