const fs = require('fs');
const path = require('path');

// 通用 UI 翻译映射（英文 -> 翻译键）
const commonTranslations = {
  // 按钮和操作
  'Submit': 'submit',
  'Cancel': 'cancel',
  'Save': 'save',
  'Delete': 'delete',
  'Remove': 'remove',
  'Add': 'add',
  'Edit': 'edit',
  'Update': 'update',
  'Reset': 'reset',
  'Clear': 'clear',
  'Copy': 'copy',
  'Copied': 'copied',
  'Download': 'download',
  'Upload': 'upload',
  'Generate': 'generate',
  'Convert': 'convert',
  'Process': 'process',
  'Analyze': 'analyze',
  'Preview': 'preview',
  'Export': 'export',
  'Import': 'import',
  
  // 表单标签
  'Name': 'name',
  'Title': 'title',
  'Description': 'description',
  'Type': 'type',
  'Value': 'value',
  'Input': 'input',
  'Output': 'output',
  'Options': 'options',
  'Settings': 'settings',
  'Configuration': 'configuration',
  'Format': 'format',
  'Style': 'style',
  'Size': 'size',
  'Width': 'width',
  'Height': 'height',
  'Color': 'color',
  'Font': 'font',
  'Text': 'text',
  'Content': 'content',
  'File': 'file',
  'Folder': 'folder',
  'Path': 'path',
  'URL': 'url',
  'Email': 'email',
  'Phone': 'phone',
  'Address': 'address',
  'Date': 'date',
  'Time': 'time',
  'Duration': 'duration',
  'Status': 'status',
  'Priority': 'priority',
  'Category': 'category',
  'Tags': 'tags',
  'Notes': 'notes',
  'Comments': 'comments',
  
  // 状态和结果
  'Success': 'success',
  'Error': 'error',
  'Warning': 'warning',
  'Info': 'info',
  'Loading': 'loading',
  'Processing': 'processing',
  'Complete': 'complete',
  'Pending': 'pending',
  'Active': 'active',
  'Inactive': 'inactive',
  'Enabled': 'enabled',
  'Disabled': 'disabled',
  'Valid': 'valid',
  'Invalid': 'invalid',
  'Required': 'required',
  'Optional': 'optional',
  
  // 导航和布局
  'Back': 'back',
  'Next': 'next',
  'Previous': 'previous',
  'First': 'first',
  'Last': 'last',
  'Home': 'home',
  'Menu': 'menu',
  'Search': 'search',
  'Filter': 'filter',
  'Sort': 'sort',
  'View': 'view',
  'List': 'list',
  'Grid': 'grid',
  'Table': 'table',
  'Details': 'details',
  'Summary': 'summary',
  'Overview': 'overview',
  
  // 时间相关
  'Today': 'today',
  'Yesterday': 'yesterday',
  'Tomorrow': 'tomorrow',
  'Now': 'now',
  'Never': 'never',
  'Always': 'always',
  'Daily': 'daily',
  'Weekly': 'weekly',
  'Monthly': 'monthly',
  'Yearly': 'yearly',
  'Quarterly': 'quarterly',
  
  // 数量和度量
  'Total': 'total',
  'Count': 'count',
  'Amount': 'amount',
  'Quantity': 'quantity',
  'Percentage': 'percentage',
  'Average': 'average',
  'Minimum': 'minimum',
  'Maximum': 'maximum',
  'Range': 'range',
  
  // 其他常用
  'Yes': 'yes',
  'No': 'no',
  'All': 'all',
  'None': 'none',
  'Other': 'other',
  'Default': 'default',
  'Custom': 'custom',
  'Auto': 'auto',
  'Manual': 'manual',
  'Basic': 'basic',
  'Advanced': 'advanced',
  'Simple': 'simple',
  'Complex': 'complex',
  'Public': 'public',
  'Private': 'private',
  'Shared': 'shared',
  'Personal': 'personal',
  'General': 'general',
  'Specific': 'specific',
  'Example': 'example',
  'Sample': 'sample',
  'Template': 'template',
  'Result': 'result',
  'Results': 'results',
  'Legend': 'legend',
  'Help': 'help',
  'About': 'about',
  'Version': 'version',
  'Author': 'author',
  'License': 'license',
  'Source': 'source',
  'Target': 'target',
  'Destination': 'destination',
  'Origin': 'origin',
  'Start': 'start',
  'End': 'end',
  'Begin': 'begin',
  'Finish': 'finish',
  'Open': 'open',
  'Close': 'close',
  'Show': 'show',
  'Hide': 'hide',
  'Expand': 'expand',
  'Collapse': 'collapse',
  'Select': 'select',
  'Deselect': 'deselect',
  'Check': 'check',
  'Uncheck': 'uncheck',
  'Enable': 'enable',
  'Disable': 'disable',
  'Lock': 'lock',
  'Unlock': 'unlock',
  'Refresh': 'refresh',
  'Reload': 'reload',
  'Retry': 'retry',
  'Undo': 'undo',
  'Redo': 'redo',
};

// 多语言翻译
const translations = {
  en: commonTranslations,
  zh: {
    submit: '提交', cancel: '取消', save: '保存', delete: '删除', remove: '移除',
    add: '添加', edit: '编辑', update: '更新', reset: '重置', clear: '清空',
    copy: '复制', copied: '已复制', download: '下载', upload: '上传', generate: '生成',
    convert: '转换', process: '处理', analyze: '分析', preview: '预览', export: '导出',
    import: '导入', name: '名称', title: '标题', description: '描述', type: '类型',
    value: '值', input: '输入', output: '输出', options: '选项', settings: '设置',
    configuration: '配置', format: '格式', style: '样式', size: '大小', width: '宽度',
    height: '高度', color: '颜色', font: '字体', text: '文本', content: '内容',
    file: '文件', folder: '文件夹', path: '路径', url: '网址', email: '邮箱',
    phone: '电话', address: '地址', date: '日期', time: '时间', duration: '时长',
    status: '状态', priority: '优先级', category: '分类', tags: '标签', notes: '备注',
    comments: '评论', success: '成功', error: '错误', warning: '警告', info: '信息',
    loading: '加载中', processing: '处理中', complete: '完成', pending: '待处理',
    active: '活跃', inactive: '非活跃', enabled: '已启用', disabled: '已禁用',
    valid: '有效', invalid: '无效', required: '必填', optional: '可选',
    back: '返回', next: '下一步', previous: '上一步', first: '第一个', last: '最后一个',
    home: '首页', menu: '菜单', search: '搜索', filter: '筛选', sort: '排序',
    view: '查看', list: '列表', grid: '网格', table: '表格', details: '详情',
    summary: '摘要', overview: '概览', today: '今天', yesterday: '昨天', tomorrow: '明天',
    now: '现在', never: '从不', always: '总是', daily: '每日', weekly: '每周',
    monthly: '每月', yearly: '每年', quarterly: '每季度', total: '总计', count: '数量',
    amount: '金额', quantity: '数量', percentage: '百分比', average: '平均', minimum: '最小',
    maximum: '最大', range: '范围', yes: '是', no: '否', all: '全部', none: '无',
    other: '其他', default: '默认', custom: '自定义', auto: '自动', manual: '手动',
    basic: '基础', advanced: '高级', simple: '简单', complex: '复杂', public: '公开',
    private: '私有', shared: '共享', personal: '个人', general: '通用', specific: '特定',
    example: '示例', sample: '样本', template: '模板', result: '结果', results: '结果',
    legend: '图例', help: '帮助', about: '关于', version: '版本', author: '作者',
    license: '许可证', source: '来源', target: '目标', destination: '目的地', origin: '起点',
    start: '开始', end: '结束', begin: '开始', finish: '完成', open: '打开', close: '关闭',
    show: '显示', hide: '隐藏', expand: '展开', collapse: '折叠', select: '选择',
    deselect: '取消选择', check: '勾选', uncheck: '取消勾选', enable: '启用', disable: '禁用',
    lock: '锁定', unlock: '解锁', refresh: '刷新', reload: '重新加载', retry: '重试',
    undo: '撤销', redo: '重做'
  }
};

// 检查翻译文件中是否已有这些通用键
const enMessages = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'messages', 'en.json'), 'utf8'));

// 检查 tools 下是否有 common 或 ui 命名空间
const hasCommonUI = enMessages.tools && (enMessages.tools.common || enMessages.tools.ui);

console.log('📊 通用 UI 翻译键检查');
console.log('='.repeat(50));
console.log(`tools.common 存在: ${enMessages.tools?.common ? '✓' : '✗'}`);
console.log(`tools.ui 存在: ${enMessages.tools?.ui ? '✓' : '✗'}`);

// 检查哪些通用键已经存在于 tools 根级别
const existingKeys = Object.keys(enMessages.tools || {}).filter(k => typeof enMessages.tools[k] === 'string');
console.log(`\n已存在的通用翻译键 (${existingKeys.length} 个):`);
existingKeys.slice(0, 20).forEach(k => console.log(`  - ${k}: "${enMessages.tools[k]}"`));
if (existingKeys.length > 20) console.log(`  ... 还有 ${existingKeys.length - 20} 个`);

// 检查缺失的通用键
const missingKeys = Object.entries(commonTranslations).filter(([text, key]) => {
  return !enMessages.tools?.[key];
});

console.log(`\n缺失的通用翻译键 (${missingKeys.length} 个):`);
missingKeys.slice(0, 20).forEach(([text, key]) => console.log(`  - ${key} (${text})`));
if (missingKeys.length > 20) console.log(`  ... 还有 ${missingKeys.length - 20} 个`);

console.log('\n✅ 检查完成！');
console.log('\n建议: 大部分通用 UI 文本应该已经在 tools 根级别定义。');
console.log('对于工具特定的文本，应该在 tools.{tool-slug} 下定义。');
