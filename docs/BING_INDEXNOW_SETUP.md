# Bing Webmaster Tools IndexNow 配置指南

## 📋 当前状态

### ✅ 已完成的配置

1. **IndexNow Key 文件已部署**
   - 文件路径: `public/u2tool2026indexnowkey.txt`
   - 访问 URL: `https://www.u2tool.com/u2tool2026indexnowkey.txt`
   - 文件内容: `u2tool2026indexnowkey`
   - 状态: ✅ 可正常访问

2. **IndexNow API 提交**
   - 已通过 `npm run submit:indexnow` 提交
   - 支持批量提交 URL

### ⚠️ 需要在 Bing Webmaster Tools 中配置

Bing Webmaster Tools 需要在平台中手动配置 IndexNow Key，才能识别并启用 IndexNow 功能。

---

## 🔧 配置步骤

### 步骤 1: 访问 IndexNow 设置页面

1. 登录 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 选择站点: `u2tool.com`
3. 左侧菜单 → **IndexNow**
4. 或直接访问: https://www.bing.com/webmasters/indexnow

### 步骤 2: 配置 IndexNow Key

1. 在 IndexNow 设置页面，找到 **"IndexNow Key"** 或 **"API Key"** 设置
2. 输入以下信息：
   - **Key**: `u2tool2026indexnowkey`
   - **Key Location**: `https://www.u2tool.com/u2tool2026indexnowkey.txt`
3. 点击 **"保存"** 或 **"验证"** 按钮

### 步骤 3: 验证配置

1. Bing 会自动验证 Key 文件是否可以访问
2. 如果验证成功，会显示 **"IndexNow 已启用"** 或类似提示
3. 警告/推荐消息应该会消失

---

## 📝 IndexNow 配置信息

### Key 信息

- **IndexNow Key**: `u2tool2026indexnowkey`
- **Key 文件 URL**: `https://www.u2tool.com/u2tool2026indexnowkey.txt`
- **Key 文件内容**: `u2tool2026indexnowkey`

### 验证文件状态

```bash
# 检查验证文件
curl https://www.u2tool.com/u2tool2026indexnowkey.txt
# 应该返回: u2tool2026indexnowkey
```

---

## 🔍 故障排除

### 问题 1: Bing 无法访问 Key 文件

**症状**: Bing 显示 "无法访问 Key 文件"

**解决方案**:
1. 确认文件可以通过浏览器访问: `https://www.u2tool.com/u2tool2026indexnowkey.txt`
2. 检查文件内容是否正确（应该是 key 本身，没有换行）
3. 等待 5-10 分钟后重试（Bing 可能需要时间抓取）

### 问题 2: Key 验证失败

**症状**: Bing 显示 "Key 验证失败"

**解决方案**:
1. 确认 Key 文件内容与输入的 Key 完全一致
2. 确认 Key 文件在网站根目录（`/`）下
3. 确认使用 HTTPS URL

### 问题 3: 警告仍然存在

**症状**: 配置后警告仍然显示

**解决方案**:
1. 等待 24-48 小时让 Bing 更新状态
2. 尝试重新提交一些 URL 到 IndexNow
3. 检查 Bing Webmaster Tools 中的 IndexNow 状态页面

---

## 📊 IndexNow 使用

### 自动提交

IndexNow 已通过脚本配置，可以手动运行：

```bash
# 提交高价值恢复 URL
npm run submit:indexnow

# 测试模式
npm run submit:indexnow:dry
```

### 支持的搜索引擎

IndexNow 协议支持以下搜索引擎：
- ✅ Bing
- ✅ Yandex
- ✅ 其他支持 IndexNow 的搜索引擎

---

## 🔗 相关链接

- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [IndexNow 协议文档](https://www.indexnow.org/)
- [Bing IndexNow 文档](https://www.bing.com/indexnow)

---

## 📝 更新记录

- 2026-01-04: 创建配置指南
- IndexNow Key: `u2tool2026indexnowkey`
