# U2Tool 性能诊断和优化工具集

这是一个专门为部署在 Vercel 上、使用 Cloudflare DNS/CDN 的 Next.js 应用设计的性能诊断和优化工具集。

## 🎯 功能特性

- **性能诊断**：分析 Core Web Vitals、Middleware 性能、Bundle 大小、翻译文件加载
- **配置检查**：验证 Vercel 和 Cloudflare 配置的最佳实践
- **自动优化**：Middleware、Bundle、翻译文件的自动优化
- **实时监控**：Web Vitals 收集、性能告警、错误追踪
- **CLI 工具**：命令行工具快速诊断和优化

## 📦 安装

```bash
cd .kiro/performance-tools
npm install
```

## 🚀 快速开始

### 运行完整诊断

```bash
npm run diagnose -- --url https://www.u2tool.com
```

### 检查配置

```bash
npm run check-config
```

### 应用优化

```bash
npm run optimize -- --target middleware
```

### 启动监控

```bash
npm run monitor
```

## 📚 文档

详细文档请查看 `docs/` 目录：

- [Vercel 配置最佳实践](docs/vercel-best-practices.md)
- [Cloudflare 配置最佳实践](docs/cloudflare-best-practices.md)
- [性能优化检查清单](docs/optimization-checklist.md)
- [故障排查手册](docs/troubleshooting.md)

## 🧪 测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式
npm run test:watch
```

## 📝 开发

```bash
# 代码检查
npm run lint

# 代码格式化
npm run format

# 构建
npm run build
```

## 📄 许可证

MIT
