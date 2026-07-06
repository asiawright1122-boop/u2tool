import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

const messagesDir = path.join(process.cwd(), 'src/messages');
const locales = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
type Locale = typeof locales[number];

const prioritySeoKeywords = {
  en: {
    'base64': {
      title: ['base64', 'encoder', 'decoder'],
      description: ['base64', 'convert'],
    },
    'html-encoder': {
      title: ['html', 'encoder', 'decoder'],
      description: ['html', 'entities'],
    },
    'jwt-decoder': {
      title: ['jwt', 'decoder'],
      description: ['jwt', 'claims', 'without verification'],
    },
    'xml-formatter': {
      title: ['xml', 'formatter', 'minifier'],
      description: ['xml', 'validate'],
    },
    'uuid-generator': {
      title: ['uuid', 'generator'],
      description: ['uuid', 'v4'],
    },
    'password-generator': {
      title: ['password', 'generator'],
      description: ['password', 'uppercase'],
    },
    'qr-generator': {
      title: ['qr', 'generator'],
      description: ['qr', 'downloadable'],
    },
    'regex-tester': {
      title: ['regex', 'tester'],
      description: ['regex', 'highlighting'],
    },
    'regex-generator': {
      title: ['regex', 'generator'],
      description: ['regex', 'pattern', 'validation'],
    },
    'regex-visualizer': {
      title: ['regex', 'visualizer'],
      description: ['regex', 'railroad', 'teaching'],
    },
    'code-minifier': {
      title: ['code', 'minifier'],
      description: ['html', 'css', 'javascript'],
    },
    'json-schema-validator': {
      title: ['json', 'schema', 'validator'],
      description: ['json', 'schema', 'validation'],
    },
    'diff-checker': {
      title: ['diff', 'checker'],
      description: ['compare', 'texts'],
    },
    'statistics-calculator': {
      title: ['statistics', 'calculator'],
      description: ['mean', 'median', 'variance'],
    },
    'whois-lookup': {
      title: ['whois', 'lookup'],
      description: ['domain', 'registrar'],
    },
    'dependency-vulnerability-checker': {
      title: ['dependency', 'vulnerability', 'checker'],
      description: ['package.json', 'requirements.txt', 'security'],
    },
    'base-calculator': {
      title: ['base', 'calculator'],
      description: ['binary', 'hexadecimal', 'bitwise'],
    },
    'lorem-picsum': {
      title: ['lorem', 'picsum', 'image'],
      description: ['placeholder', 'grayscale', 'seed'],
    },
    'neumorphism-generator': {
      title: ['neumorphism', 'css', 'generator'],
      description: ['soft ui', 'shadows', 'buttons'],
    },
  },
  zh: {
    'base64': {
      title: ['base64', '编码', '解码'],
      description: ['base64', '转换'],
    },
    'html-encoder': {
      title: ['html', '实体', '编码', '解码'],
      description: ['html', '实体', 'xss'],
    },
    'jwt-decoder': {
      title: ['jwt', '调试器', '签名'],
      description: ['jwt', '验证', '认证'],
    },
    'xml-formatter': {
      title: ['xml', '格式化', '压缩'],
      description: ['xml', '校验'],
    },
    'uuid-generator': {
      title: ['uuid', '生成器'],
      description: ['uuid', 'v4'],
    },
    'password-generator': {
      title: ['密码', '生成器'],
      description: ['密码', '符号'],
    },
    'qr-generator': {
      title: ['二维码', '生成器'],
      description: ['二维码', 'png'],
    },
    'regex-tester': {
      title: ['正则表达式', '测试器'],
      description: ['regex', '捕获组'],
    },
    'code-minifier': {
      title: ['代码', '压缩器'],
      description: ['html', 'css', 'javascript'],
    },
    'json-schema-validator': {
      title: ['json', 'schema', '验证器'],
      description: ['json', 'schema', '错误信息'],
    },
    'diff-checker': {
      title: ['文本', '差异', '对比'],
      description: ['新增', '删除', '修改'],
    },
    'statistics-calculator': {
      title: ['统计', '计算器'],
      description: ['均值', '中位数', '方差'],
    },
    'whois-lookup': {
      title: ['whois', '查询'],
      description: ['域名', '注册商'],
    },
    'dependency-vulnerability-checker': {
      title: ['依赖', '漏洞', '检测'],
      description: ['npm', 'pip', '漏洞'],
    },
    'database-migration-generator': {
      title: ['数据库', '迁移', '生成器'],
      description: ['数据库', '变更脚本'],
    },
    'js-beautifier': {
      title: ['javascript', '美化'],
      description: ['javascript', '格式化'],
    },
    'regex-to-code-generator': {
      title: ['正则表达式', '转代码', '生成器'],
      description: ['regex', 'python', 'javascript'],
    },
    'timestamp-converter': {
      title: ['时间戳', '转换器'],
      description: ['时间戳', '日期时间'],
    },
    'vigenere-cipher': {
      title: ['维吉尼亚密码', '加密', '解密'],
      description: ['关键词', '加密', '解密'],
    },
    'api-tester': {
      title: ['api', '测试器'],
      description: ['http', '请求头'],
    },
    'ascii-table': {
      title: ['ascii', '码表'],
      description: ['字符', '十进制', '十六进制'],
    },
    'audio-to-base64': {
      title: ['音频', 'base64'],
      description: ['mp3', 'wav', 'ogg'],
    },
    'base32': {
      title: ['base32', '编码', '解码'],
      description: ['base32', '转换'],
    },
    'base58': {
      title: ['base58', '编码', '解码'],
      description: ['base58', '地址'],
    },
    'base85': {
      title: ['base85', '编码', '解码'],
      description: ['base85', '二进制'],
    },
    'cidr-calculator': {
      title: ['cidr', '子网', '计算器'],
      description: ['cidr', '子网掩码', '主机范围'],
    },
    'code-complexity-analyzer': {
      title: ['代码', '复杂度', '分析'],
      description: ['圈复杂度', '代码行数', '重构'],
    },
    'code-duplication-finder': {
      title: ['代码', '重复', '检测'],
      description: ['重复代码', '相似逻辑', '重构'],
    },
    'code-screenshot-generator': {
      title: ['代码', '截图', '生成器'],
      description: ['代码片段', '语法高亮', '图片'],
    },
    'crc32-calculator': {
      title: ['crc32', '校验和', '计算器'],
      description: ['crc32', '文本', '文件'],
    },
    'color-blindness-simulator': {
      title: ['色盲', '模拟器'],
      description: ['图像', '配色', '无障碍'],
    },
    'color-contrast-checker': {
      title: ['颜色', '对比度', '检查器'],
      description: ['wcag', '前景色', '背景色'],
    },
    'color-converter': {
      title: ['颜色', '转换器'],
      description: ['hex', 'rgb', 'hsl'],
    },
    'color-extractor': {
      title: ['颜色提取器', '主色'],
      description: ['颜色提取器', '配色方案', '图片'],
    },
    'color-palette': {
      title: ['颜色', '调色板', '生成器'],
      description: ['互补色', '类似色', '配色'],
    },
    'commit-message-generator': {
      title: ['git', '提交信息', '生成器'],
      description: ['提交说明', '提交历史', '规范化'],
    },
    'coin-flipper': {
      title: ['硬币翻转器', '抛硬币'],
      description: ['硬币翻转器', '正面', '反面'],
    },
    'cookie-policy-generator': {
      title: ['cookie', '政策', '生成器'],
      description: ['cookie', '类型', '隐私合规'],
    },
    'cors-tester': {
      title: ['cors', '测试器'],
      description: ['cors', '跨域响应头', 'api'],
    },
    'wordcloud-generator': {
      title: ['词云', '生成器'],
      description: ['词云图', '关键词', '可视化'],
    },
    'citation-formatter': {
      title: ['引用', '格式化', '工具'],
      description: ['参考文献', '论文', '引用'],
    },
    'noise-texture-generator': {
      title: ['噪点', '纹理', '生成器'],
      description: ['噪点', '颗粒', '背景'],
    },
    'project-estimation-calculator': {
      title: ['项目', '估算', '计算器'],
      description: ['任务工时', '项目周期', '故事点'],
    },
    'anagram-solver': {
      title: ['字母', '重组', '求解器'],
      description: ['单词', '谜题', '字母排列'],
    },
    'area-chart-generator': {
      title: ['区域图', '生成器'],
      description: ['面积图', '累计数据', '时间序列'],
    },
    'aspect-ratio-box-generator': {
      title: ['长宽比', '盒子', '生成器'],
      description: ['响应式', 'css', '容器'],
    },
    'aspect-ratio-calculator-enhanced': {
      title: ['宽高比', '计算器'],
      description: ['尺寸比例', '裁剪', '分辨率'],
    },
    'aspect-ratio-resizer': {
      title: ['纵横比', '调整', '工具'],
      description: ['图片尺寸', '裁剪', '比例'],
    },
    'bandwidth-calculator': {
      title: ['带宽', '计算器'],
      description: ['文件大小', '传输时间', '网络带宽'],
    },
    'cron-explainer': {
      title: ['cron', '表达式', '解释器'],
      description: ['调度语法', '下次运行', '定时任务'],
    },
    'crontab-calendar': {
      title: ['crontab', '日历'],
      description: ['定时任务', '运行时间', '调度计划'],
    },
    'csp-generator': {
      title: ['csp', '生成器'],
      description: ['内容安全策略', '响应头', 'xss'],
    },
    'css-minifier': {
      title: ['css', '压缩器'],
      description: ['空格', '注释', '文件体积'],
    },
    'curl-converter': {
      title: ['curl', '命令', '转换器'],
      description: ['请求命令', '多种语言', 'api'],
    },
    'barcode-generator': {
      title: ['条形码', '生成器'],
      description: ['商品', '库存', '物流'],
    },
    'bra-size-calculator': {
      title: ['胸罩尺码计算器', '罩杯'],
      description: ['胸罩尺码计算器', '姐妹尺码', '胸围尺码'],
    },
    'bubble-chart-generator': {
      title: ['气泡图生成器', '气泡图'],
      description: ['气泡图生成器', '三维数据', '气泡大小'],
    },
    'budget-variance-analyzer': {
      title: ['预算差异分析器', '预算差异'],
      description: ['预算差异分析器', '费用差异', '执行率'],
    },
    'bic-swift-lookup': {
      title: ['bic', 'swift', '查询'],
      description: ['银行代码', '国际汇款', '转账'],
    },
    'bionic-reading-converter': {
      title: ['仿生阅读', '转换器'],
      description: ['阅读格式', '长文阅读', '注意力辅助'],
    },
    'blob-generator': {
      title: ['blob', '形状', '生成器'],
      description: ['有机曲线', '网页背景', '视觉点缀'],
    },
    'border-radius-generator': {
      title: ['边框圆角', '生成器'],
      description: ['css', '圆角代码', '组件样式'],
    },
    'database-backup-scheduler': {
      title: ['数据库', '备份', '计划'],
      description: ['备份计划', '脚本模板', '容灾'],
    },
    'database-schema-visualizer': {
      title: ['数据库', '架构', '可视化'],
      description: ['表结构', '字段关系', '数据模型'],
    },
    'css-variables-generator': {
      title: ['css', '变量', '生成器'],
      description: ['css', '自定义属性', '主题管理'],
    },
    'calendar-availability-finder': {
      title: ['日历可用时间查找器', '空闲时段'],
      description: ['日历可用时间查找器', '共同空闲时段', '会议安排'],
    },
    'calendar-heatmap-generator': {
      title: ['日历热力图生成器', '日历热力图'],
      description: ['日历热力图生成器', '每日数值', '活跃度'],
    },
    'candlestick-chart-generator': {
      title: ['蜡烛图生成器', 'k线'],
      description: ['蜡烛图生成器', '开盘价', '收盘价'],
    },
    'changelog-generator': {
      title: ['更新日志生成器', '更新日志'],
      description: ['更新日志生成器', '新增', '修复'],
    },
    'changelog-generator-advanced': {
      title: ['变更日志生成器', '变更日志'],
      description: ['变更日志生成器', 'git', '发布说明'],
    },
    'char-frequency': {
      title: ['字符频率', '分析仪'],
      description: ['出现次数', '占比', '高频字符'],
    },
    'character-map': {
      title: ['字符映射表'],
      description: ['特殊字符', 'unicode', '一键复制'],
    },
    'chinese-lorem-ipsum': {
      title: ['中文', '占位符文本', '生成器'],
      description: ['中文占位符文本', '中文假文', '网页内容占位'],
    },
    'cost-benefit-analyzer': {
      title: ['成本效益分析器', '成本效益'],
      description: ['成本效益分析器', '净收益', '投资价值'],
    },
    'countdown-days-calculator': {
      title: ['倒计时天数计算器', '倒计时'],
      description: ['倒计时天数计算器', '目标日期', '项目节点'],
    },
    'countdown-timer': {
      title: ['倒计时', '计时器'],
      description: ['倒计时计时器', '提示音', '会议提醒'],
    },
    'credit-card-validator': {
      title: ['信用卡验证器', '信用卡'],
      description: ['信用卡验证器', '校验位', '无效卡号'],
    },
    'carbon-footprint-calculator': {
      title: ['碳足迹计算器', '碳足迹'],
      description: ['碳足迹计算器', '碳排放', '生活方式'],
    },
    'color-name-finder': {
      title: ['颜色名称查找器', '颜色名称'],
      description: ['颜色名称查找器', '十六进制颜色值', '最接近'],
    },
    'css-grid-generator': {
      title: ['css网格生成器', '网格布局'],
      description: ['css网格生成器', '行', '列'],
    },
    'currency-converter': {
      title: ['货币转换器', '汇率'],
      description: ['货币转换器', '即时汇率', '人民币'],
    },
    'css-flexbox-generator': {
      title: ['css', '弹性布局', '生成器'],
      description: ['css', '弹性布局', '样式代码'],
    },
    'css-to-tailwind': {
      title: ['css', 'tailwind', '转换器'],
      description: ['css', 'tailwind', '实用类'],
    },
    'csv-to-excel': {
      title: ['csv', 'excel', '工具'],
      description: ['csv', 'excel', '表格文件'],
    },
    'database-connection-tester': {
      title: ['数据库连接测试工具', '连接'],
      description: ['数据库连接测试工具', '连接字符串', '认证配置'],
    },
    'decision-wheel': {
      title: ['决策转盘'],
      description: ['决策转盘', '随机抽取', '做决定'],
    },
    'dice-roller': {
      title: ['骰子掷骰器', '骰子'],
      description: ['骰子掷骰器', '多面骰', '随机结果'],
    },
    'document-formatter': {
      title: ['文档格式化工具', '格式化'],
      description: ['文档格式化工具', '段落结构', '换行'],
    },
    'document-outline-generator': {
      title: ['文档大纲生成器', '文档大纲'],
      description: ['文档大纲生成器', '标题层级', '章节结构'],
    },
    'document-word-counter': {
      title: ['文档字数统计工具', '字数统计'],
      description: ['文档字数统计工具', '句子数', '段落数'],
    },
    'due-date-calculator': {
      title: ['预产期计算器', '预产期'],
      description: ['预产期计算器', '孕周', '产检时间'],
    },
    'electricity-cost-calculator': {
      title: ['电费计算器', '电费'],
      description: ['电费计算器', '月度电费', '电价'],
    },
    'data-transfer-calculator': {
      title: ['数据传输计算器', '传输时间'],
      description: ['数据传输计算器', '文件大小', '网络带宽'],
    },
    'download-time-calculator': {
      title: ['下载时间计算器', '下载时间'],
      description: ['下载时间计算器', '文件大小', '网络速度'],
    },
    'email-signature-generator': {
      title: ['电子邮件签名生成器', '邮件签名'],
      description: ['电子邮件签名生成器', '联系方式', 'html'],
    },
    'email-validator': {
      title: ['电子邮件验证器', '邮箱格式'],
      description: ['电子邮件验证器', '域名状态', '表单校验'],
    },
    'excel-merger': {
      title: ['excel合并器', '工作簿'],
      description: ['excel合并器', '报表汇总', '数据整合'],
    },
    'excel-to-csv': {
      title: ['excel转csv', 'csv文件'],
      description: ['excel转csv工具', '工作表', '数据导入'],
    },
    'exif-viewer': {
      title: ['exif', '查看器'],
      description: ['exif', '元数据', '拍摄时间'],
    },
    'expense-report-generator': {
      title: ['费用报告生成器', '报销'],
      description: ['费用报告生成器', '报销', '日常支出'],
    },
    'fake-data-generator': {
      title: ['假数据生成器', '测试数据'],
      description: ['假数据生成器', '测试用样本数据', '数据填充'],
    },
    'fake-name-generator': {
      title: ['随机姓名生成器', '测试姓名'],
      description: ['随机姓名生成器', '国家和地区', '虚拟人物'],
    },
    'file-size-calculator': {
      title: ['文件大小计算器', '存储单位'],
      description: ['文件大小计算器', '字节', '二进制'],
    },
    'financial-forecast-calculator': {
      title: ['财务预测计算器', '现金流'],
      description: ['财务预测计算器', '现金流', '预算编制'],
    },
    'flip-text': {
      title: ['翻转文字'],
      description: ['翻转文字', '倒序', '镜像'],
    },
    'doughnut-chart-generator': {
      title: ['圆环图', '生成器'],
      description: ['圆环图生成器', '分类占比', '构成关系'],
    },
    'funnel-chart-generator': {
      title: ['漏斗图生成器', '转化流程'],
      description: ['漏斗图生成器', '转化率', '流失情况'],
    },
    'gantt-chart-generator': {
      title: ['甘特图生成器', '项目排期'],
      description: ['甘特图生成器', '任务', '进度'],
    },
    'gauge-chart-generator': {
      title: ['仪表图生成器', '指标范围'],
      description: ['仪表图生成器', '完成进度', '报表看板'],
    },
    'gif-compressor': {
      title: ['gif压缩工具', '动图文件体积'],
      description: ['gif压缩工具', '颜色数量', '网页优化'],
    },
    'gif-maker': {
      title: ['gif制作工具', 'gif动图'],
      description: ['gif制作工具', '帧间隔', '循环次数'],
    },
    'gif-splitter': {
      title: ['gif拆帧工具', '动图每一帧'],
      description: ['gif拆帧工具', '帧图片', '批量下载'],
    },
    'gdpr-consent-generator': {
      title: ['gdpr', '同意', '生成器'],
      description: ['gdpr', 'cookie', 'html/css'],
    },
    'github-readme-generator': {
      title: ['github', 'readme', '生成器'],
      description: ['github', 'readme', '项目展示'],
    },
    'glassmorphism-generator': {
      title: ['玻璃拟态生成器', 'css'],
      description: ['玻璃拟态生成器', '磨砂玻璃', '卡片组件'],
    },
    'grammar-checker': {
      title: ['语法检查工具'],
      description: ['语法检查工具', '病句', '校对'],
    },
    'graph-chart-generator': {
      title: ['关系图生成器'],
      description: ['关系图生成器', '网络图', '节点'],
    },
    'grouped-bar-chart-generator': {
      title: ['分组柱状图生成器'],
      description: ['分组柱状图生成器', '多个系列', '数据差异'],
    },
    'grouped-line-chart-generator': {
      title: ['分组折线图生成器'],
      description: ['分组折线图生成器', '趋势变化', '数据系列'],
    },
    'habit-tracker': {
      title: ['习惯追踪器'],
      description: ['习惯追踪器', '连续天数', '打卡'],
    },
    'half-doughnut-chart-generator': {
      title: ['半圆环图生成器'],
      description: ['半圆环图生成器', '分类占比', '核心指标'],
    },
    'dead-code-analyzer': {
      title: ['无效代码', '分析器'],
      description: ['未调用函数', '冗余逻辑', '可维护性'],
    },
    'docker-compose-generator': {
      title: ['docker', 'compose', '生成器'],
      description: ['多容器', '配置文件', '部署准备'],
    },
    'docker-compose-generator-advanced': {
      title: ['docker', 'compose', '高级'],
      description: ['多服务', '多网络', '部署编排'],
    },
    'dockerfile-generator': {
      title: ['dockerfile', '生成器'],
      description: ['容器镜像', '构建配置', '部署准备'],
    },
    'editorconfig-generator': {
      title: ['editorconfig', '生成器'],
      description: ['编码风格', '缩进规范', '换行规则'],
    },
    'encoding-detector': {
      title: ['编码', '检测器'],
      description: ['字符编码', '乱码排查', '多语言'],
    },
    'environment-variables-generator': {
      title: ['环境变量', '生成器'],
      description: ['环境变量模板', '部署准备', '密钥占位'],
    },
    'eslint-config-generator': {
      title: ['eslint', '配置', '生成器'],
      description: ['代码检查规则', '团队规范', '自动校验'],
    },
    'favicon-generator': {
      title: ['favicon', '生成器'],
      description: ['网站图标', '浏览器标签', '书签图标'],
    },
    'file-hash': {
      title: ['文件', '哈希', '计算器'],
      description: ['文件哈希值', '完整性校验', '下载验证'],
    },
    'gitignore-generator': {
      title: ['gitignore', '生成器'],
      description: ['忽略规则', '团队协作', '项目模板'],
    },
    'git-commit-message-generator': {
      title: ['git', '提交信息', '生成器'],
      description: ['常规提交', '版本管理', '变更日志'],
    },
    'git-tag-manager': {
      title: ['git', '标签', '管理器'],
      description: ['发布标签', '语义化版本', '团队协作'],
    },
    'go-formatter': {
      title: ['go', '格式化', '工具'],
      description: ['缩进', '换行', '代码审查'],
    },
    'gradient-generator': {
      title: ['css', '渐变', '生成器'],
      description: ['线性', '径向', '网页背景'],
    },
    'graphql-formatter': {
      title: ['graphql', '格式化', '工具'],
      description: ['查询语句', 'schema', '开发协作'],
    },
    'hash-generator': {
      title: ['哈希', '生成器'],
      description: ['文本摘要', '完整性校验', '内容比对'],
    },
    'hmac-generator': {
      title: ['hmac', '生成器'],
      description: ['消息认证', '接口验签', '完整性'],
    },
    'htaccess-generator': {
      title: ['htaccess', '生成器'],
      description: ['重定向', '重写', '访问控制'],
    },
    'htaccess-to-nginx': {
      title: ['htaccess', 'nginx', '配置'],
      description: ['重定向', '站点迁移', '部署调整'],
    },
    'hex-base64-converter': {
      title: ['十六进制', 'base64', '转换器'],
      description: ['十六进制', 'base64', '数据编码'],
    },
    'hex-editor': {
      title: ['十六进制', '编辑器'],
      description: ['十六进制编辑器', '字节数据', '二进制分析'],
    },
    'html-minifier': {
      title: ['html', '压缩器'],
      description: ['空格', '注释', '性能优化'],
    },
    'image-compressor': {
      title: ['图片', '压缩器'],
      description: ['文件大小', '页面提速', '资源优化'],
    },
    'image-converter': {
      title: ['图像格式', '转换器'],
      description: ['格式互转', '兼容性', '素材整理'],
    },
    'image-adjustment': {
      title: ['图片调整工具', '亮度', '对比度'],
      description: ['图片调整工具', '饱和度', '修图'],
    },
    'image-collage': {
      title: ['图片拼贴工具', '拼贴'],
      description: ['图片拼贴工具', '多张图片', '布局'],
    },
    'image-cropper': {
      title: ['图片裁剪工具', '裁剪'],
      description: ['图片裁剪工具', '比例', '封面'],
    },
    'image-to-ico': {
      title: ['图片转ico工具', '图标'],
      description: ['图片转ico工具', 'ico', '尺寸'],
    },
    'image-to-pdf': {
      title: ['图片转 pdf 工具', 'pdf'],
      description: ['图片转 pdf 工具', '多张图片', 'pdf'],
    },
    'image-watermark': {
      title: ['图片水印工具'],
      description: ['图片水印工具', '文字水印', '版权保护'],
    },
    'json-minifier': {
      title: ['json', '压缩器'],
      description: ['空格', '接口响应', '文件瘦身'],
    },
    'json-path-finder': {
      title: ['json', '路径', '查找器'],
      description: ['字段位置', '接口调试', '数据提取'],
    },
    'json-path-tester': {
      title: ['jsonpath', '测试器'],
      description: ['路径表达式', '字段定位', '数据提取'],
    },
    'json-viewer': {
      title: ['json', '查看器'],
      description: ['树状数据结构', '字段检查', '数据排查'],
    },
    'jwt-payload-decoder': {
      title: ['jwt', '负载', '解码器'],
      description: ['令牌载荷', '声明检查', '认证排查'],
    },
    'keyboard-tester': {
      title: ['键盘', '测试器'],
      description: ['按键响应', '键位识别', '键盘异常'],
    },
    'kubernetes-manifest-generator': {
      title: ['kubernetes', '清单', '生成器'],
      description: ['部署配置文件', '集群部署', '资源编排'],
    },
    'markdown-preview': {
      title: ['markdown', '预览'],
      description: ['渲染效果', '导出 html', '自述文档'],
    },
    'lorem-ipsum': {
      title: ['lorem', 'ipsum', '生成器'],
      description: ['占位文本', '原型设计', '内容占位'],
    },
    'markdown-to-html': {
      title: ['markdown', 'html'],
      description: ['文档内容', '导出代码', '博客发布'],
    },
    'memory-leak-detector': {
      title: ['内存泄漏', '检测器'],
      description: ['事件监听', '定时器', '性能优化'],
    },
    'merge-conflict-resolver': {
      title: ['git', '合并冲突', '解决器'],
      description: ['冲突内容', '合并结果', '版本协作'],
    },
    'word-counter': {
      title: ['单词', '字数', '统计器'],
      description: ['单词', '字数', '篇幅控制'],
    },
    'number-base-converter': {
      title: ['数制', '转换器'],
      description: ['二进制', '十进制', '十六进制'],
    },
    'password-strength': {
      title: ['密码强度', '检测器'],
      description: ['密码复杂度', '破解风险', '密码优化'],
    },
    'package-json-generator': {
      title: ['package.json', '生成器'],
      description: ['脚本', '依赖项', '项目配置'],
    },
    'timezone-converter': {
      title: ['时区', '转换器'],
      description: ['全球时间', '城市时差', '会议安排'],
    },
    'mime-type-lookup': {
      title: ['mime', '类型', '查询'],
      description: ['扩展名', '媒体类型', '响应头'],
    },
    'morse-code-player': {
      title: ['摩尔斯电码', '播放器'],
      description: ['文本', '摩尔斯电码', '音频'],
    },
    'opengraph-preview': {
      title: ['opengraph', '预览'],
      description: ['分享卡片', '元标签', '发布前预览'],
    },
    'performance-profiler': {
      title: ['代码性能', '分析器'],
      description: ['执行瓶颈', '耗时函数', '基准测试'],
    },
    'prettier-config-generator': {
      title: ['prettier', '配置', '生成器'],
      description: ['代码格式规则', '缩进', 'prettierrc'],
    },
    'query-execution-planner': {
      title: ['查询执行计划', '工具'],
      description: ['sql', '执行路径', '慢查询'],
    },
    'regex-escape': {
      title: ['正则表达式', '转义'],
      description: ['特殊字符', '取消转义', '规则调试'],
    },
    'regex-generator': {
      title: ['正则表达式', '生成器'],
      description: ['文本匹配', '数据提取', '表单校验'],
    },
    'regex-visualizer': {
      title: ['正则表达式', '可视化'],
      description: ['铁路图', '模式匹配', '教学演示'],
    },
    'rot13-encoder': {
      title: ['rot13', '编码', '解码'],
      description: ['rot13', '凯撒密码', '字母替换'],
    },
    'rust-formatter': {
      title: ['rust', '格式化'],
      description: ['缩进', '换行', '代码结构'],
    },
    'screen-resolution-tester': {
      title: ['屏幕分辨率', '测试器'],
      description: ['视口大小', '设备像素比', '响应式'],
    },
    'swagger-to-code-generator': {
      title: ['swagger', '代码', '生成器'],
      description: ['openapi', 'api', 'sdk'],
    },
    'sql-to-mongodb-converter': {
      title: ['sql', 'mongodb', '转换器'],
      description: ['查询语句', '数据库迁移', '开发调试'],
    },
    'sri-hash-generator': {
      title: ['sri', '哈希', '生成器'],
      description: ['完整性哈希', 'cdn', '前端安全'],
    },
    'ssl-checker': {
      title: ['ssl', '证书', '检查器'],
      description: ['证书有效期', '证书链', '网站安全'],
    },
    'image-to-base64': {
      title: ['图片', 'base64'],
      description: ['html', 'css', 'json'],
    },
    'text-encryption': {
      title: ['文本', '加密', '工具'],
      description: ['加密', '解密', '敏感信息'],
    },
    'text-statistics': {
      title: ['文本', '统计', '工具'],
      description: ['字数', '字符数', '阅读时间'],
    },
    'text-to-hex': {
      title: ['文本转十六进制', '工具'],
      description: ['文本', '十六进制', '编码调试'],
    },
    'totp-generator': {
      title: ['totp', '生成器'],
      description: ['一次性密码', '双重验证', '动态口令'],
    },
    'tsconfig-generator': {
      title: ['tsconfig', '生成器'],
      description: ['tsconfig.json', 'typescript', '编译选项'],
    },
    'text-to-slug': {
      title: ['文本', 'slug'],
      description: ['url', '路径', '内容发布'],
    },
    'unused-imports-finder': {
      title: ['未使用导入', '查找器'],
      description: ['未使用导入', '依赖项', '代码清理'],
    },
    'unit-converter': {
      title: ['单位', '转换器'],
      description: ['长度', '重量', '温度'],
    },
    'unicode-converter': {
      title: ['unicode', '转换器'],
      description: ['unicode', 'html', 'css'],
    },
    'webhook-tester': {
      title: ['webhook', '测试', '工具'],
      description: ['自定义请求', '响应结果', '回调验证'],
    },
    'hashtag-generator': {
      title: ['标签', '生成器'],
      description: ['标签', '社交媒体', '话题'],
    },
    'heatmap-chart-generator': {
      title: ['热力图', '图表', '生成器'],
      description: ['热力图', '访问热度', '矩阵'],
    },
    'iban-validator': {
      title: ['iban', '验证器'],
      description: ['iban', '银行账户', '校验位'],
    },
    'ical-parser': {
      title: ['ical', '解析器'],
      description: ['ics', '日历文件', '事件'],
    },
    'image-border': {
      title: ['图片边框工具', '边框'],
      description: ['图片边框工具', '留白', '描边'],
    },
    'image-flip-rotate': {
      title: ['图片翻转与旋转', '旋转'],
      description: ['图片翻转与旋转', '水平翻转', '垂直翻转'],
    },
    'image-frosted-glass': {
      title: ['磨砂玻璃效果', '毛玻璃'],
      description: ['磨砂玻璃效果', '毛玻璃', '背景虚化'],
    },
    'image-resizer': {
      title: ['图像缩放器', '图片尺寸'],
      description: ['图像缩放器', '宽高', '比例'],
    },
    'image-rounder': {
      title: ['图片圆角工具', '圆角'],
      description: ['图片圆角工具', '圆形裁切', '头像圆框'],
    },
    'image-splitter': {
      title: ['图片分割器', '切图'],
      description: ['图片分割器', '行列', '切图'],
    },
    'instagram-font-generator': {
      title: ['instagram', '字体生成器'],
      description: ['instagram', 'unicode', '花体字'],
    },
    'invisible-character-generator': {
      title: ['不可见字符生成器', '隐形字符'],
      description: ['不可见字符', '零宽字符', 'unicode'],
    },
    'inflation-calculator': {
      title: ['通货膨胀计算器'],
      description: ['通货膨胀计算器', '购买力', '历史价格'],
    },
    'invoice-generator': {
      title: ['发票生成器', 'pdf'],
      description: ['发票生成器', '模板', '开票'],
    },
    'json-to-dart': {
      title: ['json', 'dart'],
      description: ['json', 'dart', 'flutter'],
    },
    'json-to-form': {
      title: ['json', '表单', '生成器'],
      description: ['json', 'schema', 'html'],
    },
    'json-to-proto': {
      title: ['json', 'proto'],
      description: ['json', 'protobuf', 'proto'],
    },
    'keyword-density-checker': {
      title: ['关键词', '密度', '检查器'],
      description: ['关键词', '频率', '密度'],
    },
    'license-generator': {
      title: ['许可证', '生成器'],
      description: ['许可证', '开源项目', '软件发布'],
    },
    'liquid-fill-chart-generator': {
      title: ['液体填充', '图表', '生成器'],
      description: ['液体填充图表生成器', '波浪', '百分比'],
    },
    'list-randomizer': {
      title: ['列表随机化器', '随机'],
      description: ['列表随机化器', '打乱', '抽签'],
    },
    'lorem-picsum': {
      title: ['随机图片生成器', '占位图'],
      description: ['随机图片生成器', '占位图', '测试图片'],
    },
    'meeting-agenda-builder': {
      title: ['会议议程构建器', '会议议程'],
      description: ['会议议程构建器', '议程项目', '时长'],
    },
    'meeting-minutes-generator': {
      title: ['会议纪要生成器', '会议纪要'],
      description: ['会议纪要生成器', '决议', '行动项'],
    },
    'meeting-room-finder': {
      title: ['会议室查找工具', '会议室'],
      description: ['会议室查找工具', '容量', '设施'],
    },
    'mesh-gradient-generator': {
      title: ['网格渐变生成器', '渐变'],
      description: ['网格渐变生成器', '多色渐变', '背景'],
    },
    'meta-tag-generator': {
      title: ['元标签生成器', 'seo'],
      description: ['元标签生成器', '页面标题', '描述'],
    },
    'milestone-tracker': {
      title: ['里程碑追踪器', '里程碑'],
      description: ['里程碑追踪器', '截止日期', '进度'],
    },
    'multi-ring-chart-generator': {
      title: ['多环进度图生成器', '进度'],
      description: ['多环进度图生成器', '同心圆', '完成度'],
    },
    'name-generator': {
      title: ['名字生成器', '名字'],
      description: ['名字生成器', '角色名', '宝宝名'],
    },
    'nested-pie-chart-generator': {
      title: ['嵌套饼图生成器', '嵌套饼图'],
      description: ['嵌套饼图生成器', '子分类', '占比'],
    },
    'note-pad': {
      title: ['便签本', '便签'],
      description: ['便签本', '待办', '笔记'],
    },
    'project-risk-analyzer': {
      title: ['项目风险分析器', '风险'],
      description: ['项目风险分析器', '风险矩阵', '缓解策略'],
    },
    'radar-chart-generator': {
      title: ['雷达图生成器', '雷达图'],
      description: ['雷达图生成器', '多指标', '对比'],
    },
    'random-color-generator': {
      title: ['随机颜色生成器', '颜色值'],
      description: ['随机颜色生成器', '配色', '调色板'],
    },
    'readability-checker': {
      title: ['可读性检测工具', '可读性'],
      description: ['可读性检测工具', '评分标准', '阅读难度'],
    },
    'resource-allocation-planner': {
      title: ['资源分配规划器', '资源分配'],
      description: ['资源分配规划器', '团队资源', '排期'],
    },
    'ring-progress-chart-generator': {
      title: ['环形进度图表生成器', '进度环图'],
      description: ['环形进度图表生成器', '完成度', '进度'],
    },
    'ring-size-calculator': {
      title: ['戒指尺寸计算器', '戒圈尺码'],
      description: ['戒指尺寸计算器', '手指周长', '直径'],
    },
    'robots-txt-generator': {
      title: ['robots.txt', '生成器'],
      description: ['robots.txt', '抓取规则', '爬虫'],
    },
    'roman-numeral-converter': {
      title: ['罗马数字转换器', '罗马数字'],
      description: ['罗马数字转换器', '阿拉伯数字', '互转'],
    },
    'sankey-chart-generator': {
      title: ['桑基图生成器', '桑基图'],
      description: ['桑基图生成器', '流向图', '转化路径'],
    },
    'scatter-chart-generator': {
      title: ['散点图生成器', '散点图'],
      description: ['散点图生成器', '相关性', '离群点'],
    },
    'shoe-size-converter': {
      title: ['鞋码转换器', '鞋码'],
      description: ['鞋码转换器', '美码', '欧码'],
    },
    'sitemap-generator': {
      title: ['网站地图生成器', '网站地图'],
      description: ['网站地图生成器', 'xml', '抓取'],
    },
    'small-text-generator': {
      title: ['小字生成器', '小字'],
      description: ['小字生成器', '上标', '下标'],
    },
    'social-media-size-guide': {
      title: ['社交媒体尺寸指南', '尺寸'],
      description: ['社交媒体尺寸指南', '图片', '视频'],
    },
    'speech-timer': {
      title: ['演讲计时器', '演讲时长'],
      description: ['演讲计时器', '字数', '演讲练习'],
    },
    'sprint-velocity-calculator': {
      title: ['敏捷团队冲刺速度计算器', '故事点'],
      description: ['敏捷团队冲刺速度计算器', '平均速度', '交付预测'],
    },
    'stacked-area-chart-generator': {
      title: ['堆叠面积图生成器', '堆叠面积图'],
      description: ['堆叠面积图生成器', '累计趋势', '占比贡献'],
    },
    'stacked-bar-chart-generator': {
      title: ['堆叠柱状图生成器', '堆叠柱状图'],
      description: ['堆叠柱状图生成器', '总量', '内部构成'],
    },
    'stopwatch': {
      title: ['秒表', '计次'],
      description: ['秒表', '分段计时', '运动训练'],
    },
    'strikethrough-text': {
      title: ['删除线文字生成器', '删除线文字'],
      description: ['删除线文字生成器', '下划线', '交叉线'],
    },
    'sunburst-chart-generator': {
      title: ['旭日图生成器', '旭日图'],
      description: ['旭日图生成器', '层级数据', '占比'],
    },
    'table-of-contents-generator': {
      title: ['目录生成器', '目录'],
      description: ['目录生成器', '文档标题', '长文档'],
    },
    'tax-calculator': {
      title: ['个人所得税计算器', '联邦所得税'],
      description: ['个人所得税计算器', '有效税率', '应纳税额'],
    },
    'team-capacity-planner': {
      title: ['团队容量规划器', '可用工时'],
      description: ['团队容量规划器', '任务分配', '资源平衡'],
    },
    'terms-generator': {
      title: ['服务条款生成器', '服务条款'],
      description: ['服务条款生成器', '用户协议', '责任限制'],
    },
    'text-case-counter': {
      title: ['文本大小写计数器', '字符类型'],
      description: ['文本大小写计数器', '空格', '特殊字符'],
    },
    'text-cleaner': {
      title: ['文本清理器', '空格换行'],
      description: ['文本清理器', 'html', 'json', 'base64'],
    },
    'text-diff-patch': {
      title: ['文本差异对比与补丁工具', '补丁'],
      description: ['文本差异对比与补丁工具', '文本差异', '内容合并'],
    },
    'text-repeater': {
      title: ['文本重复器', '分隔符'],
      description: ['文本重复器', '编号', '测试数据'],
    },
    'text-shadow-generator': {
      title: ['文本阴影生成器', '文字阴影'],
      description: ['文本阴影生成器', '模糊半径', 'css'],
    },
    'text-sorter': {
      title: ['文本排序器', '排序'],
      description: ['文本排序器', '长度', '数据清洗'],
    },
    'text-spinner': {
      title: ['文本改写器', '改写文本'],
      description: ['文本改写器', '同义词', '内容扩写'],
    },
    'text-to-handwriting': {
      title: ['文字转手写体', '手写风格'],
      description: ['文字转手写体工具', '手写便签', '课堂演示'],
    },
    'text-to-image': {
      title: ['文字转图片', '文字图片'],
      description: ['文字转图片工具', 'png', '封面制作'],
    },
    'text-to-nato': {
      title: ['文本转北约音标转换器', '北约音标'],
      description: ['文本转北约音标转换器', '通话词', '无线电通信'],
    },
    'text-wrapper': {
      title: ['文本换行器', '换行'],
      description: ['文本换行器', '行宽', '文档排版'],
    },
    'theme-river-generator': {
      title: ['主题河流图生成器', '主题河流图'],
      description: ['主题河流图生成器', '占比趋势', '舆情分析'],
    },
    'time-calculator': {
      title: ['时间计算器', '时间差'],
      description: ['时间计算器', '总时长', '日程规划'],
    },
    'timeline-chart-generator': {
      title: ['时间线图表生成器', '时间线'],
      description: ['时间线图表生成器', '项目里程碑', '历史事件'],
    },
    'timezone-meeting-scheduler': {
      title: ['时区会议调度器', '跨时区会议'],
      description: ['时区会议调度器', '多个城市时区', '国际团队'],
    },
    'tree-chart-generator': {
      title: ['树状图生成器', '树状图'],
      description: ['树状图生成器', '组织架构', '层级关系'],
    },
    'twitter-card-generator': {
      title: ['twittercard生成器', '分享预览'],
      description: ['twittercard生成器', '摘要卡', '播放器卡片'],
    },
    'unit-price-calculator': {
      title: ['单价计算器', '商品单价'],
      description: ['单价计算器', '重量', '性价比'],
    },
    'vcard-parser': {
      title: ['vcard解析工具', '联系人文件'],
      description: ['vcard解析工具', '姓名', '电话'],
    },
    'water-intake-calculator': {
      title: ['每日饮水量计算器', '饮水需求'],
      description: ['每日饮水量计算器', '运动补水', '健康管理'],
    },
    'waterfall-chart-generator': {
      title: ['瀑布图生成器', '瀑布图'],
      description: ['瀑布图生成器', '递增递减', '利润'],
    },
    'wave-generator': {
      title: ['波浪生成器', '波浪'],
      description: ['波浪生成器', 'svg', '网页设计'],
    },
    'word-to-html': {
      title: ['word转html', 'html'],
      description: ['word转html工具', '网页发布', '邮件模板'],
    },
    'word-to-txt': {
      title: ['word转文本', '纯文本'],
      description: ['word转文本工具', '内容提取', '文本归档'],
    },
    'bar-chart-generator': {
      title: ['柱状图生成器', '柱状图'],
      description: ['柱状图生成器', '分类', '对比分析'],
    },
    'base-calculator': {
      title: ['基数计算器', '进制'],
      description: ['基数计算器', '二进制', '按位运算'],
    },
    'batch-timestamp-converter': {
      title: ['批量时间戳转换器', '时间戳'],
      description: ['批量时间戳转换器', 'csv', 'json'],
    },
    'binary-to-decimal': {
      title: ['二进制转十进制', '十进制互转'],
      description: ['二进制转十进制工具', '十六进制', '位运算'],
    },
    'boxplot-chart-generator': {
      title: ['箱线图生成器', '异常值'],
      description: ['箱线图生成器', '四分位数', '离群值'],
    },
    'break-even-calculator': {
      title: ['盈亏平衡计算器', '盈亏平衡'],
      description: ['盈亏平衡计算器', '固定成本', '盈亏平衡点'],
    },
    'business-days-calculator': {
      title: ['工作日计算器', '工作日'],
      description: ['工作日计算器', '周末', '节假日'],
    },
    'byte-counter': {
      title: ['字节计数器', '字节'],
      description: ['字节计数器', '编码格式', '字节数'],
    },
    'calorie-calculator': {
      title: ['卡路里计算器', '卡路里'],
      description: ['卡路里计算器', '每日卡路里需求', '饮食管理'],
    },
    'pinyin-converter': {
      title: ['拼音', '转换器'],
      description: ['汉字', '声调', '发音'],
    },
    'checksum-verifier': {
      title: ['文件', '校验和', '验证'],
      description: ['哈希值', '完整性', '篡改'],
    },
    'text-hash-comparator': {
      title: ['文本', '哈希', '比较'],
      description: ['文本', '哈希', '完整性'],
    },
    'binary-to-text': {
      title: ['二进制', '文本', '工具'],
      description: ['二进制', '文本', '互转'],
    },
    'case-converter': {
      title: ['文本', '大小写', '转换器'],
      description: ['大写', '小写', '命名'],
    },
    'chinese-converter': {
      title: ['中文', '简繁体', '转换器'],
      description: ['简体', '繁体', '本地化'],
    },
    'ip-address-generator': {
      title: ['ip', '地址', '生成器'],
      description: ['随机网络地址', '接口测试', '网络模拟'],
    },
    'json-to-rust': {
      title: ['json', 'rust', '转换器'],
      description: ['json', 'rust', '结构体'],
    },
    'json-to-swift': {
      title: ['json', 'swift', '转换器'],
      description: ['json', 'swift', '结构体'],
    },
    'octal-converter': {
      title: ['八进制', '转换器'],
      description: ['十进制', '十六进制', '数制学习'],
    },
    'paint-calculator': {
      title: ['油漆计算器', '墙面'],
      description: ['油漆用量', '装修预算', '材料采购'],
    },
    'percentage-change-calculator': {
      title: ['百分比变化', '计算器'],
      description: ['增减百分比', '价格对比', '薪资变化'],
    },
    'phone-formatter': {
      title: ['电话号码', '格式化'],
      description: ['国家区号', '表单校验', '客户数据'],
    },
    'salary-calculator': {
      title: ['工资计算器', '时薪', '年薪'],
      description: ['月薪', '兼职核算', '收入对比'],
    },
    'signature-pad': {
      title: ['电子签名板', '手写签名'],
      description: ['数字签名', '合同签字', '授权文件'],
    },
    'sql-to-json': {
      title: ['sql', 'json', '转换器'],
      description: ['json', '数据库迁移', '测试数据'],
    },
    'sql-to-mongo': {
      title: ['sql', 'mongodb', '转换器'],
      description: ['mongodb', '数据库迁移', '查询写法'],
    },
    'step-line-chart-generator': {
      title: ['阶梯折线图', '生成器'],
      description: ['离散节点', '库存变化', '阶段数据'],
    },
    'screen-time-calculator': {
      title: ['屏幕使用时间', '计算器'],
      description: ['设备使用时长', '数字习惯', '健康作息'],
    },
    'svg-to-image': {
      title: ['svg', '图片', '转换器'],
      description: ['矢量图', '网页导出', '印刷素材'],
    },
    'team-generator': {
      title: ['团队生成器', '随机分组'],
      description: ['课堂分组', '活动分队', '比赛抽签'],
    },
    'text-to-pdf': {
      title: ['文本转', 'pdf', '工具'],
      description: ['纯文本', '页面设置', '打印分享'],
    },
    'treemap-chart-generator': {
      title: ['矩形树图', '生成器'],
      description: ['分层数据', '占比', '业务构成'],
    },
    'typing-speed-test': {
      title: ['打字速度测试', '准确率'],
      description: ['输入字数', '错误数', '打字能力'],
    },
    'url-shortener-preview': {
      title: ['短链接', '预览', '工具'],
      description: ['跳转目标', '分享前检查', '安全确认'],
    },
    'venn-diagram-generator': {
      title: ['维恩图', '生成器'],
      description: ['交集', '并集', '差异关系'],
    },
    'word-unscrambler': {
      title: ['字母重组解密器', '单词重组'],
      description: ['输入字母', '单词游戏', '词汇学习'],
    },
  },
} satisfies Record<'en' | 'zh', Record<string, { title: string[]; description: string[] }>>;

const allowedZhTechnicalTokens = new Set(
  [
    'base64',
    'base32',
    'base58',
    'base85',
    'ascii',
    'mp3',
    'wav',
    'ogg',
    'u2tool',
    'cidr',
    'crc32',
    'wcag',
    'cron',
    'crontab',
    'curl',
    'bic',
    'swift',
    'blob',
    'docker',
    'compose',
    'dockerfile',
    'editorconfig',
    'eslint',
    'exif',
    'favicon',
    'gitignore',
    'graphql',
    'instagram',
    'iban',
    'ical',
    'hmac',
    'htaccess',
    'nginx',
    'jsonpath',
    'cookie',
    'cors',
    'gdpr',
    'github',
    'readme',
    'readme.md',
    'kubernetes',
    'markdown',
    'lorem',
    'ipsum',
    'luhn',
    'mime',
    'opengraph',
    'prettier',
    'prettierrc',
    'rot13',
    'rust',
    'mongodb',
    'slug',
    'unicode',
    'swagger',
    'openapi',
    'totp',
    'tsconfig',
    'tsconfig.json',
    'webhook',
    'html',
    'css',
    'javascript',
    'typescript',
    'dart',
    'flutter',
    'tailwind',
    'excel',
    'proto',
    'protobuf',
    'js',
    'jwt',
    'xml',
    'uuid',
    'v4',
    'url',
    'xss',
    'regex',
    'header',
    'payload',
    'signature',
    'json',
    'schema',
    'whois',
    'png',
    'package.json',
    'requirements.txt',
    'npm',
    'pip',
    'python',
    'java',
    'kotlin',
    'go',
    'http',
    'api',
    'robots.txt',
    'twittercard',
    'vcard',
    'word',
  ].map(token => token.toLowerCase())
);

const defaultForbiddenSeoTerms = ['json', 'base64', 'svg'] as const;

const repairedLocaleSeoCases: Partial<
  Record<
    Locale,
    Record<
      string,
      {
        title: string[];
        description: string[];
        forbidden?: string[];
      }
    >
  >
> = {
  ar: {
    'expense-report-generator': {
      title: ['تقارير', 'النفقات'],
      description: ['الإيصالات', 'السداد'],
    },
    'budget-variance-analyzer': {
      title: ['فروق', 'الميزانية'],
      description: ['الإنفاق', 'الرقابة'],
    },
    'cost-benefit-analyzer': {
      title: ['الفوائد', 'التكاليف'],
      description: ['العائد', 'الاسترداد'],
    },
    'financial-forecast-calculator': {
      title: ['التنبؤ', 'المالي'],
      description: ['الأرباح', 'التدفق'],
    },
    'query-execution-planner': {
      title: ['خطة', 'الاستعلام'],
      description: ['sql', 'explain', 'الفهارس'],
    },
    'database-backup-scheduler': {
      title: ['النسخ', 'الاحتياطي'],
      description: ['cron', 'mysql', 'postgresql'],
    },
    'project-estimation-calculator': {
      title: ['تقدير', 'المشروع'],
      description: ['الجهد', 'pert'],
    },
    'resource-allocation-planner': {
      title: ['توزيع', 'الموارد'],
      description: ['عبء', 'الفريق'],
    },
    'meeting-minutes-generator': {
      title: ['محاضر', 'الاجتماعات'],
      description: ['القرارات', 'المهام'],
    },
  },
  ru: {
    'image-splitter': {
      title: ['разделитель', 'изображений'],
      description: ['png', 'строкам', 'столбцам'],
    },
    'expense-report-generator': {
      title: ['отчетов', 'расходах'],
      description: ['чеками', 'возмещений'],
    },
    'budget-variance-analyzer': {
      title: ['отклонений', 'бюджета'],
      description: ['перерасход', 'экономию'],
    },
    'cost-benefit-analyzer': {
      title: ['затрат', 'выгод'],
      description: ['roi', 'окупаемости'],
    },
    'query-execution-planner': {
      title: ['плана', 'запросов'],
      description: ['explain', 'индексов'],
    },
    'database-backup-scheduler': {
      title: ['резервного', 'копирования'],
      description: ['cron', 'mysql'],
    },
    'project-estimation-calculator': {
      title: ['оценки', 'проекта'],
      description: ['pert', 'спринтов'],
    },
    'resource-allocation-planner': {
      title: ['распределения', 'ресурсов'],
      description: ['загрузку', 'доступность'],
    },
    'meeting-minutes-generator': {
      title: ['протоколов', 'совещаний'],
      description: ['решениями', 'сроками'],
    },
  },
  fr: {
    'image-splitter': {
      title: ['diviseur', 'images'],
      description: ['png', 'lignes', 'colonnes'],
    },
    'invoice-template-generator': {
      title: ['facture', 'modèle'],
      description: ['taxes', 'total'],
    },
    'expense-report-generator': {
      title: ['rapport', 'frais'],
      description: ['reçus', 'remboursement'],
    },
    'cost-benefit-analyzer': {
      title: ['coût', 'bénéfice'],
      description: ['roi', 'récupération'],
    },
    'meeting-minutes-generator': {
      title: ['comptes rendus', 'réunion'],
      description: ['décisions', 'actions'],
    },
  },
  pt: {
    'image-splitter': {
      title: ['divisor', 'imagens'],
      description: ['png', 'linhas', 'colunas'],
    },
    'meeting-minutes-generator': {
      title: ['atas', 'reunião'],
      description: ['participantes', 'itens de ação'],
    },
    'invoice-template-generator': {
      title: ['modelo', 'fatura'],
      description: ['impostos', 'vencimento'],
    },
    'expense-report-generator': {
      title: ['relatório', 'despesas'],
      description: ['recibos', 'reembolsos'],
    },
    'budget-variance-analyzer': {
      title: ['variações', 'orçamentárias'],
      description: ['categoria', 'desfavoráveis'],
    },
    'cost-benefit-analyzer': {
      title: ['custo-benefício'],
      description: ['vpl', 'payback'],
    },
  },
  de: {
    'image-splitter': {
      title: ['bildteiler'],
      description: ['png', 'zeilen', 'spalten'],
    },
    'database-backup-scheduler': {
      title: ['datenbank', 'backups'],
      description: ['cron-jobs', 'postgresql'],
    },
  },
  es: {
    'image-splitter': {
      title: ['divisor', 'imágenes'],
      description: ['png', 'filas', 'columnas'],
    },
    'query-execution-planner': {
      title: ['ejecución', 'consultas'],
      description: ['explain', 'consultas lentas'],
    },
  },
  ko: {
    'image-splitter': {
      title: ['이미지', '분할기'],
      description: ['png', '행', '열'],
    },
    'budget-variance-analyzer': {
      title: ['예산', '변동'],
      description: ['집행률', '불리한'],
    },
  },
};

function loadJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

function loadRootMessages(locale: Locale): Record<string, unknown> {
  return loadJson(path.join(messagesDir, `${locale}.json`));
}

function loadBaseMessages(locale: Locale): Record<string, unknown> {
  return loadJson(path.join(messagesDir, locale, 'base.json'));
}

function loadMergedMessages(locale: Locale): Record<string, unknown> {
  return {
    ...loadBaseMessages(locale),
    ...loadRootMessages(locale),
  };
}

function expectNonEmptyString(value: unknown, label: string) {
  expect(typeof value, `${label} should be a string`).toBe('string');
  expect((value as string).trim().length, `${label} should not be empty`).toBeGreaterThan(0);
}

function getNestedValue(obj: Record<string, unknown>, keyPath: string): unknown {
  return keyPath.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object' || !(key in current)) {
      return undefined;
    }
    return (current as Record<string, unknown>)[key];
  }, obj);
}

function getToolSeo(
  messages: Record<string, unknown>,
  slug: string,
  namespace: 'tools' | 'tool'
) {
  const entry = (messages[namespace] as Record<string, unknown> | undefined)?.[slug] as
    | Record<string, unknown>
    | undefined;

  expect(entry, `Missing ${namespace}.${slug}`).toBeDefined();

  return {
    title: entry?.seo_title,
    description: entry?.seo_description,
  };
}

function normalize(value: string) {
  return value.toLowerCase();
}

describe('SEO Governance', () => {
  it('keeps page and category SEO metadata available in every locale', () => {
    const enMerged = loadMergedMessages('en');
    const categories = Object.keys(
      (enMerged.categories_seo as Record<string, unknown> | undefined) ?? {}
    );

    expect(categories.length).toBeGreaterThan(0);

    for (const locale of locales) {
      const merged = loadMergedMessages(locale);

      expectNonEmptyString(
        getNestedValue(merged, 'pages.tools.seo_title'),
        `${locale} pages.tools.seo_title`
      );
      expectNonEmptyString(
        getNestedValue(merged, 'pages.tools.seo_description'),
        `${locale} pages.tools.seo_description`
      );

      for (const category of categories) {
        expectNonEmptyString(
          getNestedValue(merged, `categories_seo.${category}.seo_title`),
          `${locale} categories_seo.${category}.seo_title`
        );
        expectNonEmptyString(
          getNestedValue(merged, `categories_seo.${category}.seo_description`),
          `${locale} categories_seo.${category}.seo_description`
        );
      }
    }
  });

  it('keeps priority en/zh tool SEO copy aligned between root and base translations', () => {
    for (const locale of ['en', 'zh'] as const) {
      const rootMessages = loadRootMessages(locale);
      const baseMessages = loadBaseMessages(locale);

      for (const slug of Object.keys(prioritySeoKeywords[locale])) {
        const rootSeo = getToolSeo(rootMessages, slug, 'tools');
        const baseSeo = getToolSeo(baseMessages, slug, 'tools');

        expectNonEmptyString(rootSeo.title, `${locale} root tools.${slug}.seo_title`);
        expectNonEmptyString(rootSeo.description, `${locale} root tools.${slug}.seo_description`);
        expectNonEmptyString(baseSeo.title, `${locale} base tools.${slug}.seo_title`);
        expectNonEmptyString(baseSeo.description, `${locale} base tools.${slug}.seo_description`);

        expect(baseSeo.title).toBe(rootSeo.title);
        expect(baseSeo.description).toBe(rootSeo.description);
      }
    }
  });

  it('keeps priority tool SEO copy pinned to the intended keywords', () => {
    for (const locale of ['en', 'zh'] as const) {
      const messages = loadRootMessages(locale);

      for (const [slug, expected] of Object.entries(prioritySeoKeywords[locale])) {
        const seo = getToolSeo(messages, slug, 'tools');
        const title = normalize(String(seo.title));
        const description = normalize(String(seo.description));

        for (const keyword of expected.title) {
          expect(title).toContain(keyword.toLowerCase());
        }

        for (const keyword of expected.description) {
          expect(description).toContain(keyword.toLowerCase());
        }
      }
    }
  });

  it('keeps suspicious English residue out of priority Chinese SEO copy', () => {
    const messages = loadRootMessages('zh');

    for (const slug of Object.keys(prioritySeoKeywords.zh)) {
      const seo = getToolSeo(messages, slug, 'tools');
      const combined = `${String(seo.title)} ${String(seo.description)}`;
      const englishTokens = combined.match(/[A-Za-z][A-Za-z0-9.+_-]{3,}/g) ?? [];
      const unexpected = englishTokens.filter(
        token => !allowedZhTechnicalTokens.has(token.toLowerCase())
      );

      expect(unexpected, `Unexpected English residue in zh tools.${slug}`).toEqual([]);
    }
  });

  it('keeps repaired multi-locale business SEO copy precise and residue-free', () => {
    for (const [locale, cases] of Object.entries(repairedLocaleSeoCases) as Array<
      [Locale, Record<string, { title: string[]; description: string[]; forbidden?: string[] }>]
    >) {
      const messages = loadRootMessages(locale);

      for (const [slug, expected] of Object.entries(cases)) {
        const seo = getToolSeo(messages, slug, 'tools');
        const title = normalize(String(seo.title));
        const description = normalize(String(seo.description));
        const combined = `${title} ${description}`;

        for (const keyword of expected.title) {
          expect(title).toContain(keyword.toLowerCase());
        }

        for (const keyword of expected.description) {
          expect(description).toContain(keyword.toLowerCase());
        }

        for (const token of [...defaultForbiddenSeoTerms, ...(expected.forbidden ?? [])]) {
          expect(combined).not.toContain(token.toLowerCase());
        }

        expect(String(seo.title)).not.toMatch(/\p{Extended_Pictographic}/u);
        expect(String(seo.description)).not.toMatch(/\p{Extended_Pictographic}/u);
      }
    }
  });

  it('keeps GSC duplicate-canonical non-Latin title repairs out of English source titles', () => {
    const cases = [
      {
        locale: 'ko',
        slug: 'percentage-stacked-bar-chart-generator',
        expectedTitle: '무료 온라인 100% 누적 막대 차트 생성기',
        forbidden: ['Percentage Stacked Bar Chart'],
      },
      {
        locale: 'ja',
        slug: 'dependency-vulnerability-checker',
        expectedTitle: '無料オンライン依存関係脆弱性チェッカー',
        forbidden: ['Dependency Vulnerability Checker'],
      },
    ] as const;

    for (const { locale, slug, expectedTitle, forbidden } of cases) {
      for (const [label, messages] of [
        ['root', loadRootMessages(locale)],
        ['base', loadBaseMessages(locale)],
      ] as const) {
        const seo = getToolSeo(messages, slug, 'tools');

        expect(seo.title, `${locale} ${label} tools.${slug}.seo_title`).toBe(expectedTitle);
        for (const phrase of forbidden) {
          expect(String(seo.title)).not.toContain(phrase);
        }
      }
    }
  });

  it('keeps JWT decoder SEO metadata truthful about signature verification', () => {
    const forbidden = [
      /signature verifier/i,
      /verify jwt signatures/i,
      /verify signatures/i,
      /signature validation/i,
    ];
    const enRoot = loadRootMessages('en');
    const enBase = loadBaseMessages('en');

    for (const [label, messages] of [
      ['root.tools.jwt-decoder', enRoot],
      ['base.tools.jwt-decoder', enBase],
      ['root.tool.jwt-decoder', enRoot],
      ['base.tool.jwt-decoder', enBase],
    ] as const) {
      const namespace = label.includes('.tool.') ? 'tool' : 'tools';
      const seo = getToolSeo(messages, 'jwt-decoder', namespace);
      const combined = `${String(seo.title)} ${String(seo.description)}`;

      for (const pattern of forbidden) {
        expect(combined, `${label} should not claim signature verification`).not.toMatch(pattern);
      }
    }
  });
});
