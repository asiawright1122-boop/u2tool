# SEO 监控清单

## 日常检查 (每日)

### 索引状态
- [ ] 检查 Google Search Console 索引覆盖率
- [ ] 查看是否有新的索引错误
- [ ] 监控 sitemap 提交状态

### 网站可用性
- [ ] 确认网站正常访问
- [ ] 检查关键页面加载速度
- [ ] 验证 SSL 证书状态

---

## 周度检查 (每周一)

### 搜索表现
- [ ] 查看 Google Search Console 搜索表现报告
  - 总点击量变化
  - 总展示量变化
  - 平均点击率 (CTR)
  - 平均排名位置
- [ ] 检查 Bing Webmaster 搜索表现
- [ ] 查看百度站长平台流量数据

### 索引分析
- [ ] 检查新增索引页面数量
- [ ] 查看被移除的页面
- [ ] 分析索引覆盖率趋势

### 关键词排名
- [ ] 检查核心关键词排名变化
  - "json formatter online"
  - "base64 encoder"
  - "uuid generator"
  - "qr code generator"
  - "password generator"
- [ ] 发现新的排名关键词
- [ ] 分析长尾关键词表现

### 技术健康
- [ ] 运行 Lighthouse 测试
- [ ] 检查 Core Web Vitals 报告
- [ ] 验证移动端可用性

---

## 月度检查 (每月1日)

### 综合分析
- [ ] 对比上月搜索流量
- [ ] 分析流量来源变化
- [ ] 评估转化率变化

### 竞争分析
- [ ] 检查竞争对手排名变化
- [ ] 分析新进入的竞争者
- [ ] 评估市场份额变化

### 内容审计
- [ ] 检查低表现页面
- [ ] 识别需要更新的内容
- [ ] 规划新内容方向

### 外链分析
- [ ] 检查新增外链
- [ ] 分析外链质量
- [ ] 识别失效外链

### 技术审计
- [ ] 完整站点爬取检查
- [ ] 检查 404 错误页面
- [ ] 验证重定向链

---

## 关键指标追踪表

### 搜索表现指标

| 指标 | 本周 | 上周 | 变化 | 目标 |
|------|------|------|------|------|
| 总点击量 | | | | +10% |
| 总展示量 | | | | +15% |
| 平均 CTR | | | | >3% |
| 平均排名 | | | | <20 |
| 索引页面数 | | | | 1000+ |

### Core Web Vitals

| 指标 | 当前值 | 目标值 | 状态 |
|------|--------|--------|------|
| LCP | | <2.5s | |
| FID | | <100ms | |
| CLS | | <0.1 | |
| TTFB | | <800ms | |

### 关键词排名追踪

| 关键词 | 当前排名 | 上周排名 | 目标排名 |
|--------|----------|----------|----------|
| json formatter | | | Top 10 |
| base64 encoder | | | Top 10 |
| uuid generator | | | Top 10 |
| qr code generator | | | Top 20 |
| online dev tools | | | Top 20 |

---

## 工具和资源

### 必备工具
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [百度站长平台](https://ziyuan.baidu.com/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)

### 推荐工具
- [Ahrefs](https://ahrefs.com/) - 外链分析
- [SEMrush](https://www.semrush.com/) - 关键词追踪
- [Screaming Frog](https://www.screamingfrog.co.uk/) - 站点爬取

### 命令行工具
```bash
# 检查 sitemap 可访问性
curl -I https://www.u2tool.com/sitemap.xml

# 检查 robots.txt
curl https://www.u2tool.com/robots.txt

# 运行 Lighthouse
npx lighthouse https://www.u2tool.com --output=json

# 提交 IndexNow
npx ts-node scripts/submit-indexnow.ts --dry-run
```

---

## 异常处理流程

### 索引量下降
1. 检查 robots.txt 是否有变更
2. 验证 sitemap 是否正常
3. 查看是否有手动操作惩罚
4. 检查服务器日志中的爬虫访问

### 排名下降
1. 检查是否有算法更新
2. 分析竞争对手变化
3. 审查近期内容变更
4. 检查外链是否有异常

### 流量下降
1. 区分自然搜索和其他来源
2. 检查是否有技术问题
3. 分析用户行为变化
4. 评估季节性因素

---

## 报告模板

### 周报格式
```
# SEO 周报 - [日期范围]

## 概要
- 本周点击量: [数字] ([变化%])
- 本周展示量: [数字] ([变化%])
- 平均排名: [数字] ([变化])

## 亮点
- [正面发现1]
- [正面发现2]

## 问题
- [需要关注的问题]

## 下周计划
- [行动项1]
- [行动项2]
```
