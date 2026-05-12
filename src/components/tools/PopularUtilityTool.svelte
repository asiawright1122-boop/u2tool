<script lang="ts">
  import { onDestroy } from 'svelte';
  import QRCode from 'qrcode';

  interface Props {
    slug?: string;
    locale: string;
    translations: Record<string, unknown>;
  }

  type Field = {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'textarea' | 'select';
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
  };

  type ResultCard = {
    label: string;
    value: string;
    tone?: 'good' | 'bad' | 'neutral';
  };

  type Result = {
    cards?: ResultCard[];
    output?: string;
    copyText?: string;
    rows?: Array<{ label: string; value: string }>;
    images?: Array<{ label: string; url: string }>;
    error?: string;
  };

  type CopySection = 'actions' | 'errors' | 'fields' | 'options' | 'results' | 'placeholders';
  type PopularCopy = Record<CopySection, Record<string, string>>;

  const FALLBACK_COPY: Record<'en' | 'zh', PopularCopy> = {
    en: {
      actions: {
        copy: 'Copy Result',
        copied: 'Copied',
        clear: 'Clear',
        output: 'Output',
        preview: 'Preview',
        downloadQr: 'Download QR Code',
      },
      errors: {
        invalidYoutube: 'Enter a valid YouTube video URL or video ID',
        invalidNumbers: 'Enter valid numbers',
        invalidData: 'Enter valid data',
        invalidCsv: 'Enter CSV rows with contact headers',
        invalidVcard: 'Enter one or more valid vCard contacts',
        invalidDockerRun: 'Enter a docker run command with an image name',
        unpayableDebt: 'Increase the monthly payment or lower the interest rate to create a payoff plan',
        wifiSsid: 'Enter a WiFi name',
        missingConfig: 'Tool configuration not found',
      },
      fields: {
        shares: 'Shares',
        buyPrice: 'Buy Price',
        sellPrice: 'Sell Price',
        buyFees: 'Buy Fees',
        sellFees: 'Sell Fees',
        sharePrice: 'Share Price',
        annualDividend: 'Annual Dividend Per Share',
        sharesOwned: 'Shares Owned',
        sharesOutstanding: 'Shares Outstanding',
        startValue: 'Starting Value',
        endValue: 'Ending Value',
        years: 'Years',
        accountSize: 'Account Size',
        riskPercent: 'Risk Percent',
        entryPrice: 'Entry Price',
        stopPrice: 'Stop Price',
        youtubeVideo: 'YouTube URL or Video ID',
        task: 'Task',
        topic: 'Topic',
        audience: 'Audience',
        tone: 'Tone',
        format: 'Output Format',
        constraints: 'Constraints',
        title: 'Title',
        style: 'Style',
        page: 'Page or Product',
        keyword: 'Target Keyword',
        benefit: 'Main Benefit',
        ssid: 'WiFi Name',
        password: 'Password',
        encryption: 'Encryption',
        hidden: 'Hidden Network',
        unit: 'Unit System',
        weight: 'Weight',
        height: 'Height',
        age: 'Age',
        sex: 'Sex',
        activity: 'Activity Level',
        goal: 'Goal',
        debts: 'Debts',
        extraPayment: 'Extra Monthly Payment',
        maintenanceCalories: 'Maintenance Calories',
        dailyCalories: 'Daily Calories',
        days: 'Days',
        jobTitle: 'Job Title',
        company: 'Company',
        experience: 'Experience',
        skills: 'Skills',
        achievement: 'Achievement',
        cta: 'Call to Action',
        links: 'Links',
        reps: 'Reps',
        preset: 'Preset',
        widthMm: 'Width (mm)',
        heightMm: 'Height (mm)',
        dpi: 'DPI',
        background: 'Background',
        amount: 'Amount',
        salePrice: 'Sale Price',
        shippingCharge: 'Shipping Charged',
        itemCost: 'Item Cost',
        shippingCost: 'Shipping Cost',
        listingFee: 'Listing Fee',
        transactionPercent: 'Transaction Fee Percent',
        paymentPercent: 'Payment Processing Percent',
        offsiteAdsPercent: 'Offsite Ads Percent',
        targetIncome: 'Target Take-Home Income',
        expenses: 'Annual Business Expenses',
        taxPercent: 'Tax Reserve Percent',
        billableHours: 'Billable Hours per Week',
        weeksOff: 'Weeks Off per Year',
        feePercent: 'Fee Percent',
        fixedFee: 'Fixed Fee',
        currency: 'Currency',
        headers: 'HTTP Response Headers',
        csv: 'CSV Contacts',
        vcard: 'vCard Contacts',
        dockerRun: 'docker run Command',
        siteName: 'Site Name',
        siteUrl: 'Site URL',
        summary: 'Summary',
        priorityPages: 'Priority Pages',
        delimiter: 'Delimiter',
        vcardVersion: 'vCard Version',
      },
      options: {
        writing: 'Writing',
        coding: 'Coding',
        analysis: 'Analysis',
        marketing: 'Marketing',
        professional: 'Professional',
        concise: 'Concise',
        friendly: 'Friendly',
        persuasive: 'Persuasive',
        playful: 'Playful',
        bold: 'Bold',
        titleCase: 'Title Case',
        sentenceCase: 'Sentence case',
        uppercase: 'UPPERCASE',
        lowercase: 'lowercase',
        no: 'No',
        yes: 'Yes',
        noPassword: 'No password',
        metric: 'Metric',
        imperial: 'Imperial',
        male: 'Male',
        female: 'Female',
        sedentary: 'Sedentary',
        light: 'Light',
        moderate: 'Moderate',
        active: 'Active',
        veryActive: 'Very active',
        fatLoss: 'Fat loss',
        maintain: 'Maintain',
        leanGain: 'Lean gain',
        muscleGain: 'Muscle gain',
        usPassport: 'US passport 2 x 2 in',
        euPassport: 'EU 35 x 45 mm',
        ukPassport: 'UK 35 x 45 mm',
        indiaPassport: 'India 51 x 51 mm',
        chinaVisa: 'China visa 33 x 48 mm',
        custom: 'Custom',
        white: 'White',
        offWhite: 'Off-white',
        lightBlue: 'Light blue',
        comma: 'Comma',
        semicolon: 'Semicolon',
        tab: 'Tab',
        vcard3: 'vCard 3.0',
        vcard4: 'vCard 4.0',
      },
      results: {
        totalCost: 'Total Cost',
        saleProceeds: 'Sale Proceeds',
        profitLoss: 'Profit / Loss',
        profit: 'Profit',
        dividendYield: 'Dividend Yield',
        annualIncome: 'Annual Income',
        dividendPerShare: 'Dividend / Share',
        marketCap: 'Market Cap',
        compact: 'Compact',
        totalReturn: 'Total Return',
        growthMultiple: 'Growth Multiple',
        riskAmount: 'Risk Amount',
        riskPerShare: 'Risk / Share',
        positionSize: 'Position Size',
        positionValue: 'Position Value',
        videoId: 'Video ID',
        encryption: 'Encryption',
        hidden: 'Hidden',
        option: 'Option',
        maxResolution: 'Max Resolution',
        highQuality: 'High Quality',
        mediumQuality: 'Medium Quality',
        defaultQuality: 'Default',
        calories: 'Calories',
        protein: 'Protein',
        carbs: 'Carbs',
        fat: 'Fat',
        bmr: 'BMR',
        tdee: 'TDEE',
        dailyDeficit: 'Daily Deficit',
        weeklyDeficit: 'Weekly Deficit',
        estimatedChange: 'Estimated Change',
        payoffMonths: 'Payoff Months',
        totalInterest: 'Total Interest',
        totalPaid: 'Total Paid',
        payoffOrder: 'Payoff Order',
        nextDebt: 'Next Debt',
        averageOneRepMax: 'Average 1RM',
        epley: 'Epley',
        brzycki: 'Brzycki',
        lombardi: 'Lombardi',
        fee: 'Fee',
        totalFees: 'Total Fees',
        transactionFee: 'Transaction Fee',
        paymentFee: 'Payment Fee',
        offsiteAdsFee: 'Offsite Ads Fee',
        netReceived: 'Net Received',
        netRevenue: 'Net Revenue',
        grossToReceive: 'Gross to Receive Target',
        grossRevenue: 'Gross Revenue',
        profitMargin: 'Profit Margin',
        hourlyRate: 'Hourly Rate',
        dayRate: 'Day Rate',
        monthlyRevenue: 'Monthly Revenue Target',
        yearlyRevenue: 'Yearly Revenue Target',
        csvRows: 'CSV Rows',
        service: 'Service',
        ports: 'Ports',
        envVars: 'Environment Variables',
        pages: 'Pages',
        pixelSize: 'Pixel Size',
        printSize: 'Print Size',
        aspectRatio: 'Aspect Ratio',
        background: 'Background',
        checklist: 'Checklist',
        score: 'Score',
        passed: 'Passed',
        missing: 'Missing',
        contacts: 'Contacts',
        vcardVersion: 'vCard Version',
      },
      placeholders: {
        aiTopic: 'launch copy for an online tools site',
        aiAudience: 'developers and marketers',
        aiFormat: 'bullet list with examples',
        aiConstraints: 'avoid invented data, keep it short',
        title: 'how to build better online tools',
        page: 'UTM Builder',
        keyword: 'free UTM builder',
        benefit: 'build campaign tracking links fast',
        metaAudience: 'marketers and founders',
        ssid: 'Office WiFi',
        password: 'correct-horse-battery-staple',
        debtsCsv: 'Card A,1200,24.9,40\nLoan B,5000,8.5,120\nStore Card,450,29.9,25',
        jobTitle: 'Product Marketing Manager',
        company: 'Northstar Labs',
        experience: '5 years growing B2B SaaS products',
        skills: 'positioning, lifecycle campaigns, analytics',
        achievement: 'increased qualified pipeline by 32%',
        instagramTopic: 'solo travel photography',
        instagramKeyword: 'travel tips',
        creatorAudience: 'new creators',
        cta: 'follow for weekly ideas',
        youtubeTopic: 'AI tools for small business',
        youtubeKeyword: 'AI productivity tools',
        youtubeAudience: 'busy founders',
        youtubeLinks: 'https://example.com/resources\nhttps://example.com/newsletter',
        emailTopic: 'spring product launch',
        emailBenefit: 'save 3 hours every week',
        priorityPages: 'Home, https://example.com/\nPricing, https://example.com/pricing\nDocs, https://example.com/docs',
        siteName: 'U2Tool',
        siteUrl: 'https://www.u2tool.com',
        siteSummary: 'A free collection of browser-based tools for developers, marketers, and operators.',
        dockerRun: 'docker run -d --name web -p 8080:80 -e NODE_ENV=production -v app-data:/data nginx:latest',
        vcardContacts: 'BEGIN:VCARD\nVERSION:3.0\nFN:Ada Lovelace\nN:Lovelace;Ada;;;\nEMAIL:ada@example.com\nTEL:+15551234567\nORG:Analytical Engines\nTITLE:Founder\nEND:VCARD',
        headers: 'strict-transport-security: max-age=31536000; includeSubDomains\ncontent-security-policy: default-src self\nx-content-type-options: nosniff',
        csvContacts: 'first_name,last_name,email,phone,company,title\nAda,Lovelace,ada@example.com,+15551234567,Analytical Engines,Founder',
      },
    },
    zh: {
      actions: {
        copy: '复制结果',
        copied: '已复制',
        clear: '清空',
        output: '结果',
        preview: '预览',
        downloadQr: '下载二维码',
      },
      errors: {
        invalidYoutube: '请输入有效的 YouTube 视频链接或视频 ID',
        invalidNumbers: '请输入有效数字',
        invalidData: '请输入有效数据',
        invalidCsv: '请输入带联系人表头的 CSV 行',
        invalidVcard: '请输入一个或多个有效 vCard 联系人',
        invalidDockerRun: '请输入包含镜像名称的 docker run 命令',
        unpayableDebt: '请提高每月还款额或降低利率，才能生成还款计划',
        wifiSsid: '请输入 WiFi 名称',
        missingConfig: '未找到工具配置',
      },
      fields: {
        shares: '股数',
        buyPrice: '买入价',
        sellPrice: '卖出价',
        buyFees: '买入费用',
        sellFees: '卖出费用',
        sharePrice: '股价',
        annualDividend: '每股年度股息',
        sharesOwned: '持有股数',
        sharesOutstanding: '流通/发行股数',
        startValue: '起始价值',
        endValue: '结束价值',
        years: '年数',
        accountSize: '账户金额',
        riskPercent: '单笔风险百分比',
        entryPrice: '入场价',
        stopPrice: '止损价',
        youtubeVideo: 'YouTube 链接或视频 ID',
        task: '任务',
        topic: '主题',
        audience: '受众',
        tone: '语气',
        format: '输出格式',
        constraints: '约束',
        title: '标题',
        style: '格式',
        page: '页面/产品',
        keyword: '目标关键词',
        benefit: '核心价值',
        ssid: 'WiFi 名称',
        password: '密码',
        encryption: '加密类型',
        hidden: '隐藏网络',
        unit: '单位体系',
        weight: '体重',
        height: '身高',
        age: '年龄',
        sex: '性别',
        activity: '活动水平',
        goal: '目标',
        debts: '债务',
        extraPayment: '每月额外还款',
        maintenanceCalories: '维持热量',
        dailyCalories: '每日摄入热量',
        days: '天数',
        jobTitle: '职位名称',
        company: '公司',
        experience: '经验',
        skills: '技能',
        achievement: '成就',
        cta: '行动号召',
        links: '链接',
        reps: '次数',
        preset: '预设',
        widthMm: '宽度（毫米）',
        heightMm: '高度（毫米）',
        dpi: 'DPI',
        background: '背景',
        amount: '金额',
        salePrice: '销售价格',
        shippingCharge: '向买家收取的运费',
        itemCost: '商品成本',
        shippingCost: '实际运费成本',
        listingFee: '刊登费',
        transactionPercent: '交易费百分比',
        paymentPercent: '支付处理费百分比',
        offsiteAdsPercent: '站外广告费百分比',
        targetIncome: '目标到手收入',
        expenses: '年度业务支出',
        taxPercent: '预留税费百分比',
        billableHours: '每周可计费小时',
        weeksOff: '每年休假周数',
        feePercent: '手续费百分比',
        fixedFee: '固定费用',
        currency: '货币',
        headers: 'HTTP 响应头',
        csv: 'CSV 联系人',
        vcard: 'vCard 联系人',
        dockerRun: 'docker run 命令',
        siteName: '网站名称',
        siteUrl: '网站 URL',
        summary: '摘要',
        priorityPages: '重点页面',
        delimiter: '分隔符',
        vcardVersion: 'vCard 版本',
      },
      options: {
        writing: '写作',
        coding: '代码',
        analysis: '分析',
        marketing: '营销',
        professional: '专业',
        concise: '简洁',
        friendly: '友好',
        persuasive: '有说服力',
        playful: '活泼',
        bold: '鲜明',
        titleCase: '标题式大小写',
        sentenceCase: '句首大写',
        uppercase: '全部大写',
        lowercase: '全部小写',
        no: '否',
        yes: '是',
        noPassword: '无密码',
        metric: '公制',
        imperial: '英制',
        male: '男性',
        female: '女性',
        sedentary: '久坐',
        light: '轻度活动',
        moderate: '中等活动',
        active: '高活动',
        veryActive: '非常活跃',
        fatLoss: '减脂',
        maintain: '维持',
        leanGain: '精益增肌',
        muscleGain: '增肌',
        usPassport: '美国护照 2 x 2 英寸',
        euPassport: '欧盟 35 x 45 毫米',
        ukPassport: '英国 35 x 45 毫米',
        indiaPassport: '印度 51 x 51 毫米',
        chinaVisa: '中国签证 33 x 48 毫米',
        custom: '自定义',
        white: '白色',
        offWhite: '近白色',
        lightBlue: '浅蓝色',
        comma: '逗号',
        semicolon: '分号',
        tab: '制表符',
        vcard3: 'vCard 3.0',
        vcard4: 'vCard 4.0',
      },
      results: {
        totalCost: '总成本',
        saleProceeds: '卖出收入',
        profitLoss: '盈亏',
        profit: '盈亏',
        dividendYield: '股息率',
        annualIncome: '年度股息收入',
        dividendPerShare: '每股股息',
        marketCap: '市值',
        compact: '简写',
        totalReturn: '总回报',
        growthMultiple: '增长倍数',
        riskAmount: '风险金额',
        riskPerShare: '每股风险',
        positionSize: '仓位股数',
        positionValue: '仓位金额',
        videoId: '视频 ID',
        encryption: '加密',
        hidden: '隐藏网络',
        option: '版本',
        maxResolution: '最高分辨率',
        highQuality: '高清',
        mediumQuality: '中等质量',
        defaultQuality: '默认',
        calories: '热量',
        protein: '蛋白质',
        carbs: '碳水',
        fat: '脂肪',
        bmr: '基础代谢',
        tdee: '每日总消耗',
        dailyDeficit: '每日缺口',
        weeklyDeficit: '每周缺口',
        estimatedChange: '预计变化',
        payoffMonths: '还清月数',
        totalInterest: '总利息',
        totalPaid: '总支付',
        payoffOrder: '偿还顺序',
        nextDebt: '下一笔债务',
        averageOneRepMax: '平均 1RM',
        epley: 'Epley',
        brzycki: 'Brzycki',
        lombardi: 'Lombardi',
        fee: '手续费',
        totalFees: '总费用',
        transactionFee: '交易费',
        paymentFee: '支付处理费',
        offsiteAdsFee: '站外广告费',
        netReceived: '实际到账',
        netRevenue: '净收入',
        grossToReceive: '达到目标需收款',
        grossRevenue: '总收入',
        profitMargin: '利润率',
        hourlyRate: '小时费率',
        dayRate: '日费率',
        monthlyRevenue: '月收入目标',
        yearlyRevenue: '年收入目标',
        csvRows: 'CSV 行数',
        service: '服务',
        ports: '端口',
        envVars: '环境变量',
        pages: '页面',
        pixelSize: '像素尺寸',
        printSize: '打印尺寸',
        aspectRatio: '宽高比',
        background: '背景',
        checklist: '检查清单',
        score: '得分',
        passed: '通过',
        missing: '缺失',
        contacts: '联系人',
        vcardVersion: 'vCard 版本',
      },
      placeholders: {
        aiTopic: '一个在线工具网站的发布文案',
        aiAudience: '开发者和营销人员',
        aiFormat: '要点列表 + 示例',
        aiConstraints: '不要编造数据，保持简短',
        title: 'how to build better online tools',
        page: 'UTM Builder',
        keyword: 'free UTM builder',
        benefit: '快速生成活动追踪链接',
        metaAudience: '营销人员和创业者',
        ssid: 'Office WiFi',
        password: 'correct-horse-battery-staple',
        debtsCsv: '信用卡A,1200,24.9,40\n贷款B,5000,8.5,120\n商店卡,450,29.9,25',
        jobTitle: '产品营销经理',
        company: '北星实验室',
        experience: '5 年 B2B SaaS 增长经验',
        skills: '定位、生命周期活动、数据分析',
        achievement: '将合格销售线索提升 32%',
        instagramTopic: '个人旅行摄影',
        instagramKeyword: '旅行技巧',
        creatorAudience: '新手创作者',
        cta: '关注获取每周灵感',
        youtubeTopic: '适合小企业的 AI 工具',
        youtubeKeyword: 'AI 效率工具',
        youtubeAudience: '忙碌的创业者',
        youtubeLinks: 'https://example.com/resources\nhttps://example.com/newsletter',
        emailTopic: '春季产品发布',
        emailBenefit: '每周节省 3 小时',
        priorityPages: '首页, https://example.com/\n价格, https://example.com/pricing\n文档, https://example.com/docs',
        siteName: 'U2Tool',
        siteUrl: 'https://www.u2tool.com',
        siteSummary: '一个面向开发者、营销人员和运营人员的免费浏览器工具集合。',
        dockerRun: 'docker run -d --name web -p 8080:80 -e NODE_ENV=production -v app-data:/data nginx:latest',
        vcardContacts: 'BEGIN:VCARD\nVERSION:3.0\nFN:Ada Lovelace\nN:Lovelace;Ada;;;\nEMAIL:ada@example.com\nTEL:+15551234567\nORG:Analytical Engines\nTITLE:Founder\nEND:VCARD',
        headers: 'strict-transport-security: max-age=31536000; includeSubDomains\ncontent-security-policy: default-src self\nx-content-type-options: nosniff',
        csvContacts: 'first_name,last_name,email,phone,company,title\nAda,Lovelace,ada@example.com,+15551234567,Analytical Engines,Founder',
      },
    },
  };

  let { slug = '', locale, translations }: Props = $props();

  const isZh = $derived(locale.startsWith('zh'));

  function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  function toStringRecord(value: unknown): Record<string, string> {
    if (!isRecord(value)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    );
  }

  function getPopularCopyFromTranslations(): Partial<Record<CopySection, Record<string, string>>> {
    const tools = isRecord(translations.tools) ? translations.tools : {};
    const popularUtility = isRecord(tools.popularUtility) ? tools.popularUtility : {};

    return {
      actions: toStringRecord(popularUtility.actions),
      errors: toStringRecord(popularUtility.errors),
      fields: toStringRecord(popularUtility.fields),
      options: toStringRecord(popularUtility.options),
      results: toStringRecord(popularUtility.results),
      placeholders: toStringRecord(popularUtility.placeholders),
    };
  }

  function resolvePopularCopy(): PopularCopy {
    const fallback = isZh ? FALLBACK_COPY.zh : FALLBACK_COPY.en;
    const override = getPopularCopyFromTranslations();

    return {
      actions: { ...fallback.actions, ...override.actions },
      errors: { ...fallback.errors, ...override.errors },
      fields: { ...fallback.fields, ...override.fields },
      options: { ...fallback.options, ...override.options },
      results: { ...fallback.results, ...override.results },
      placeholders: { ...fallback.placeholders, ...override.placeholders },
    };
  }

  const copy = $derived(resolvePopularCopy());

  function text(section: CopySection, key: string): string {
    return copy[section][key] || FALLBACK_COPY.en[section][key] || key;
  }

  const labels = $derived({
    copy: text('actions', 'copy'),
    copied: text('actions', 'copied'),
    clear: text('actions', 'clear'),
    output: text('actions', 'output'),
    preview: text('actions', 'preview'),
    invalidYoutube: text('errors', 'invalidYoutube'),
    invalidNumbers: text('errors', 'invalidNumbers'),
    downloadQr: text('actions', 'downloadQr'),
  });

  function getToolFields(toolSlug: string): Field[] {
    switch (toolSlug) {
      case 'stock-profit-calculator':
        return [
          { key: 'shares', label: text('fields', 'shares'), type: 'number', placeholder: '100' },
          { key: 'buyPrice', label: text('fields', 'buyPrice'), type: 'number', placeholder: '42' },
          { key: 'sellPrice', label: text('fields', 'sellPrice'), type: 'number', placeholder: '58' },
          { key: 'buyFees', label: text('fields', 'buyFees'), type: 'number', placeholder: '2' },
          { key: 'sellFees', label: text('fields', 'sellFees'), type: 'number', placeholder: '2' },
        ];
      case 'dividend-yield-calculator':
        return [
          { key: 'sharePrice', label: text('fields', 'sharePrice'), type: 'number', placeholder: '50' },
          { key: 'annualDividend', label: text('fields', 'annualDividend'), type: 'number', placeholder: '2.4' },
          { key: 'shares', label: text('fields', 'sharesOwned'), type: 'number', placeholder: '100' },
        ];
      case 'market-cap-calculator':
        return [
          { key: 'sharePrice', label: text('fields', 'sharePrice'), type: 'number', placeholder: '125' },
          { key: 'sharesOutstanding', label: text('fields', 'sharesOutstanding'), type: 'number', placeholder: '1000000000' },
        ];
      case 'cagr-calculator':
        return [
          { key: 'startValue', label: text('fields', 'startValue'), type: 'number', placeholder: '10000' },
          { key: 'endValue', label: text('fields', 'endValue'), type: 'number', placeholder: '18000' },
          { key: 'years', label: text('fields', 'years'), type: 'number', placeholder: '5' },
        ];
      case 'position-size-calculator':
        return [
          { key: 'accountSize', label: text('fields', 'accountSize'), type: 'number', placeholder: '10000' },
          { key: 'riskPercent', label: text('fields', 'riskPercent'), type: 'number', placeholder: '1' },
          { key: 'entryPrice', label: text('fields', 'entryPrice'), type: 'number', placeholder: '50' },
          { key: 'stopPrice', label: text('fields', 'stopPrice'), type: 'number', placeholder: '47.5' },
        ];
      case 'macro-calculator':
        return [
          { key: 'unit', label: text('fields', 'unit'), type: 'select', options: [
            { label: text('options', 'metric'), value: 'metric' },
            { label: text('options', 'imperial'), value: 'imperial' },
          ] },
          { key: 'weight', label: text('fields', 'weight'), type: 'number', placeholder: '75' },
          { key: 'height', label: text('fields', 'height'), type: 'number', placeholder: '178' },
          { key: 'age', label: text('fields', 'age'), type: 'number', placeholder: '32' },
          { key: 'sex', label: text('fields', 'sex'), type: 'select', options: [
            { label: text('options', 'male'), value: 'male' },
            { label: text('options', 'female'), value: 'female' },
          ] },
          { key: 'activity', label: text('fields', 'activity'), type: 'select', options: [
            { label: text('options', 'sedentary'), value: 'sedentary' },
            { label: text('options', 'light'), value: 'light' },
            { label: text('options', 'moderate'), value: 'moderate' },
            { label: text('options', 'active'), value: 'active' },
            { label: text('options', 'veryActive'), value: 'veryActive' },
          ] },
          { key: 'goal', label: text('fields', 'goal'), type: 'select', options: [
            { label: text('options', 'fatLoss'), value: 'fatLoss' },
            { label: text('options', 'maintain'), value: 'maintain' },
            { label: text('options', 'leanGain'), value: 'leanGain' },
            { label: text('options', 'muscleGain'), value: 'muscleGain' },
          ] },
        ];
      case 'debt-snowball-calculator':
        return [
          { key: 'debts', label: text('fields', 'debts'), type: 'textarea', placeholder: text('placeholders', 'debtsCsv') },
          { key: 'extraPayment', label: text('fields', 'extraPayment'), type: 'number', placeholder: '150' },
        ];
      case 'calorie-deficit-calculator':
        return [
          { key: 'maintenanceCalories', label: text('fields', 'maintenanceCalories'), type: 'number', placeholder: '2400' },
          { key: 'dailyCalories', label: text('fields', 'dailyCalories'), type: 'number', placeholder: '1900' },
          { key: 'days', label: text('fields', 'days'), type: 'number', placeholder: '30' },
        ];
      case 'cover-letter-generator':
        return [
          { key: 'jobTitle', label: text('fields', 'jobTitle'), type: 'text', placeholder: text('placeholders', 'jobTitle') },
          { key: 'company', label: text('fields', 'company'), type: 'text', placeholder: text('placeholders', 'company') },
          { key: 'experience', label: text('fields', 'experience'), type: 'text', placeholder: text('placeholders', 'experience') },
          { key: 'skills', label: text('fields', 'skills'), type: 'text', placeholder: text('placeholders', 'skills') },
          { key: 'achievement', label: text('fields', 'achievement'), type: 'text', placeholder: text('placeholders', 'achievement') },
          { key: 'tone', label: text('fields', 'tone'), type: 'select', options: [
            { label: text('options', 'professional'), value: 'professional' },
            { label: text('options', 'friendly'), value: 'friendly' },
            { label: text('options', 'persuasive'), value: 'persuasive' },
            { label: text('options', 'concise'), value: 'concise' },
          ] },
        ];
      case 'one-rep-max-calculator':
        return [
          { key: 'unit', label: text('fields', 'unit'), type: 'select', options: [
            { label: text('options', 'metric'), value: 'metric' },
            { label: text('options', 'imperial'), value: 'imperial' },
          ] },
          { key: 'weight', label: text('fields', 'weight'), type: 'number', placeholder: '100' },
          { key: 'reps', label: text('fields', 'reps'), type: 'number', placeholder: '5' },
        ];
      case 'passport-photo-maker':
        return [
          { key: 'preset', label: text('fields', 'preset'), type: 'select', options: [
            { label: text('options', 'usPassport'), value: 'usPassport' },
            { label: text('options', 'euPassport'), value: 'euPassport' },
            { label: text('options', 'ukPassport'), value: 'ukPassport' },
            { label: text('options', 'indiaPassport'), value: 'indiaPassport' },
            { label: text('options', 'chinaVisa'), value: 'chinaVisa' },
            { label: text('options', 'custom'), value: 'custom' },
          ] },
          { key: 'widthMm', label: text('fields', 'widthMm'), type: 'number', placeholder: '35' },
          { key: 'heightMm', label: text('fields', 'heightMm'), type: 'number', placeholder: '45' },
          { key: 'dpi', label: text('fields', 'dpi'), type: 'number', placeholder: '300' },
          { key: 'background', label: text('fields', 'background'), type: 'select', options: [
            { label: text('options', 'white'), value: 'white' },
            { label: text('options', 'offWhite'), value: 'offWhite' },
            { label: text('options', 'lightBlue'), value: 'lightBlue' },
          ] },
        ];
      case 'paypal-fee-calculator':
        return [
          { key: 'amount', label: text('fields', 'amount'), type: 'number', placeholder: '100' },
          { key: 'feePercent', label: text('fields', 'feePercent'), type: 'number', placeholder: '3.49' },
          { key: 'fixedFee', label: text('fields', 'fixedFee'), type: 'number', placeholder: '0.49' },
          { key: 'currency', label: text('fields', 'currency'), type: 'select', options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
            { label: 'CAD', value: 'CAD' },
            { label: 'AUD', value: 'AUD' },
            { label: 'BRL', value: 'BRL' },
            { label: 'PHP', value: 'PHP' },
          ] },
        ];
      case 'security-headers-checker':
        return [
          { key: 'headers', label: text('fields', 'headers'), type: 'textarea', placeholder: text('placeholders', 'headers') },
        ];
      case 'csv-to-vcard-converter':
        return [
          { key: 'csv', label: text('fields', 'csv'), type: 'textarea', placeholder: text('placeholders', 'csvContacts') },
          { key: 'delimiter', label: text('fields', 'delimiter'), type: 'select', options: [
            { label: text('options', 'comma'), value: 'comma' },
            { label: text('options', 'semicolon'), value: 'semicolon' },
            { label: text('options', 'tab'), value: 'tab' },
          ] },
          { key: 'vcardVersion', label: text('fields', 'vcardVersion'), type: 'select', options: [
            { label: text('options', 'vcard3'), value: '3.0' },
            { label: text('options', 'vcard4'), value: '4.0' },
          ] },
        ];
      case 'youtube-thumbnail-generator':
        return [
          { key: 'video', label: text('fields', 'youtubeVideo'), type: 'text', placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        ];
      case 'ai-prompt-generator':
        return [
          { key: 'task', label: text('fields', 'task'), type: 'select', options: [
            { label: text('options', 'writing'), value: 'writing' },
            { label: text('options', 'coding'), value: 'coding' },
            { label: text('options', 'analysis'), value: 'analysis' },
            { label: text('options', 'marketing'), value: 'marketing' },
          ] },
          { key: 'topic', label: text('fields', 'topic'), type: 'text', placeholder: text('placeholders', 'aiTopic') },
          { key: 'audience', label: text('fields', 'audience'), type: 'text', placeholder: text('placeholders', 'aiAudience') },
          { key: 'tone', label: text('fields', 'tone'), type: 'select', options: [
            { label: text('options', 'professional'), value: 'professional' },
            { label: text('options', 'concise'), value: 'concise' },
            { label: text('options', 'friendly'), value: 'friendly' },
            { label: text('options', 'persuasive'), value: 'persuasive' },
          ] },
          { key: 'format', label: text('fields', 'format'), type: 'text', placeholder: text('placeholders', 'aiFormat') },
          { key: 'constraints', label: text('fields', 'constraints'), type: 'textarea', placeholder: text('placeholders', 'aiConstraints') },
        ];
      case 'title-capitalization-tool':
        return [
          { key: 'title', label: text('fields', 'title'), type: 'textarea', placeholder: text('placeholders', 'title') },
          { key: 'style', label: text('fields', 'style'), type: 'select', options: [
            { label: text('options', 'titleCase'), value: 'title' },
            { label: text('options', 'sentenceCase'), value: 'sentence' },
            { label: text('options', 'uppercase'), value: 'upper' },
            { label: text('options', 'lowercase'), value: 'lower' },
          ] },
        ];
      case 'meta-description-generator':
        return [
          { key: 'page', label: text('fields', 'page'), type: 'text', placeholder: text('placeholders', 'page') },
          { key: 'keyword', label: text('fields', 'keyword'), type: 'text', placeholder: text('placeholders', 'keyword') },
          { key: 'benefit', label: text('fields', 'benefit'), type: 'text', placeholder: text('placeholders', 'benefit') },
          { key: 'audience', label: text('fields', 'audience'), type: 'text', placeholder: text('placeholders', 'metaAudience') },
        ];
      case 'youtube-title-generator':
        return [
          { key: 'topic', label: text('fields', 'topic'), type: 'text', placeholder: text('placeholders', 'youtubeTopic') },
          { key: 'keyword', label: text('fields', 'keyword'), type: 'text', placeholder: text('placeholders', 'youtubeKeyword') },
          { key: 'audience', label: text('fields', 'audience'), type: 'text', placeholder: text('placeholders', 'youtubeAudience') },
          { key: 'tone', label: text('fields', 'tone'), type: 'select', options: [
            { label: text('options', 'professional'), value: 'professional' },
            { label: text('options', 'friendly'), value: 'friendly' },
            { label: text('options', 'persuasive'), value: 'persuasive' },
            { label: text('options', 'concise'), value: 'concise' },
          ] },
        ];
      case 'instagram-bio-generator':
        return [
          { key: 'topic', label: text('fields', 'topic'), type: 'text', placeholder: text('placeholders', 'instagramTopic') },
          { key: 'keyword', label: text('fields', 'keyword'), type: 'text', placeholder: text('placeholders', 'instagramKeyword') },
          { key: 'audience', label: text('fields', 'audience'), type: 'text', placeholder: text('placeholders', 'creatorAudience') },
          { key: 'cta', label: text('fields', 'cta'), type: 'text', placeholder: text('placeholders', 'cta') },
          { key: 'tone', label: text('fields', 'tone'), type: 'select', options: [
            { label: text('options', 'friendly'), value: 'friendly' },
            { label: text('options', 'professional'), value: 'professional' },
            { label: text('options', 'playful'), value: 'playful' },
            { label: text('options', 'bold'), value: 'bold' },
          ] },
        ];
      case 'youtube-description-generator':
        return [
          { key: 'title', label: text('fields', 'title'), type: 'text', placeholder: text('placeholders', 'youtubeTopic') },
          { key: 'keyword', label: text('fields', 'keyword'), type: 'text', placeholder: text('placeholders', 'youtubeKeyword') },
          { key: 'audience', label: text('fields', 'audience'), type: 'text', placeholder: text('placeholders', 'youtubeAudience') },
          { key: 'cta', label: text('fields', 'cta'), type: 'text', placeholder: text('placeholders', 'cta') },
          { key: 'links', label: text('fields', 'links'), type: 'textarea', placeholder: text('placeholders', 'youtubeLinks') },
        ];
      case 'linkedin-headline-generator':
        return [
          { key: 'jobTitle', label: text('fields', 'jobTitle'), type: 'text', placeholder: text('placeholders', 'jobTitle') },
          { key: 'skills', label: text('fields', 'skills'), type: 'text', placeholder: text('placeholders', 'skills') },
          { key: 'audience', label: text('fields', 'audience'), type: 'text', placeholder: text('placeholders', 'metaAudience') },
          { key: 'achievement', label: text('fields', 'achievement'), type: 'text', placeholder: text('placeholders', 'achievement') },
          { key: 'tone', label: text('fields', 'tone'), type: 'select', options: [
            { label: text('options', 'professional'), value: 'professional' },
            { label: text('options', 'concise'), value: 'concise' },
            { label: text('options', 'persuasive'), value: 'persuasive' },
            { label: text('options', 'friendly'), value: 'friendly' },
          ] },
        ];
      case 'linkedin-summary-generator':
        return [
          { key: 'jobTitle', label: text('fields', 'jobTitle'), type: 'text', placeholder: text('placeholders', 'jobTitle') },
          { key: 'experience', label: text('fields', 'experience'), type: 'text', placeholder: text('placeholders', 'experience') },
          { key: 'skills', label: text('fields', 'skills'), type: 'text', placeholder: text('placeholders', 'skills') },
          { key: 'achievement', label: text('fields', 'achievement'), type: 'text', placeholder: text('placeholders', 'achievement') },
          { key: 'audience', label: text('fields', 'audience'), type: 'text', placeholder: text('placeholders', 'metaAudience') },
          { key: 'tone', label: text('fields', 'tone'), type: 'select', options: [
            { label: text('options', 'professional'), value: 'professional' },
            { label: text('options', 'friendly'), value: 'friendly' },
            { label: text('options', 'concise'), value: 'concise' },
            { label: text('options', 'persuasive'), value: 'persuasive' },
          ] },
        ];
      case 'email-subject-line-generator':
        return [
          { key: 'topic', label: text('fields', 'topic'), type: 'text', placeholder: text('placeholders', 'emailTopic') },
          { key: 'audience', label: text('fields', 'audience'), type: 'text', placeholder: text('placeholders', 'metaAudience') },
          { key: 'benefit', label: text('fields', 'benefit'), type: 'text', placeholder: text('placeholders', 'emailBenefit') },
          { key: 'tone', label: text('fields', 'tone'), type: 'select', options: [
            { label: text('options', 'professional'), value: 'professional' },
            { label: text('options', 'friendly'), value: 'friendly' },
            { label: text('options', 'persuasive'), value: 'persuasive' },
            { label: text('options', 'playful'), value: 'playful' },
          ] },
        ];
      case 'etsy-fee-calculator':
        return [
          { key: 'salePrice', label: text('fields', 'salePrice'), type: 'number', placeholder: '35' },
          { key: 'shippingCharge', label: text('fields', 'shippingCharge'), type: 'number', placeholder: '5' },
          { key: 'itemCost', label: text('fields', 'itemCost'), type: 'number', placeholder: '9' },
          { key: 'shippingCost', label: text('fields', 'shippingCost'), type: 'number', placeholder: '4' },
          { key: 'listingFee', label: text('fields', 'listingFee'), type: 'number', placeholder: '0.20' },
          { key: 'transactionPercent', label: text('fields', 'transactionPercent'), type: 'number', placeholder: '6.5' },
          { key: 'paymentPercent', label: text('fields', 'paymentPercent'), type: 'number', placeholder: '3' },
          { key: 'fixedFee', label: text('fields', 'fixedFee'), type: 'number', placeholder: '0.25' },
          { key: 'offsiteAdsPercent', label: text('fields', 'offsiteAdsPercent'), type: 'number', placeholder: '0' },
          { key: 'currency', label: text('fields', 'currency'), type: 'select', options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
            { label: 'CAD', value: 'CAD' },
            { label: 'AUD', value: 'AUD' },
          ] },
        ];
      case 'freelance-rate-calculator':
        return [
          { key: 'targetIncome', label: text('fields', 'targetIncome'), type: 'number', placeholder: '90000' },
          { key: 'expenses', label: text('fields', 'expenses'), type: 'number', placeholder: '12000' },
          { key: 'taxPercent', label: text('fields', 'taxPercent'), type: 'number', placeholder: '25' },
          { key: 'billableHours', label: text('fields', 'billableHours'), type: 'number', placeholder: '25' },
          { key: 'weeksOff', label: text('fields', 'weeksOff'), type: 'number', placeholder: '6' },
          { key: 'currency', label: text('fields', 'currency'), type: 'select', options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
            { label: 'CAD', value: 'CAD' },
            { label: 'AUD', value: 'AUD' },
          ] },
        ];
      case 'vcard-to-csv-converter':
        return [
          { key: 'vcard', label: text('fields', 'vcard'), type: 'textarea', placeholder: text('placeholders', 'vcardContacts') },
          { key: 'delimiter', label: text('fields', 'delimiter'), type: 'select', options: [
            { label: text('options', 'comma'), value: 'comma' },
            { label: text('options', 'semicolon'), value: 'semicolon' },
            { label: text('options', 'tab'), value: 'tab' },
          ] },
        ];
      case 'docker-run-to-docker-compose-converter':
        return [
          { key: 'dockerRun', label: text('fields', 'dockerRun'), type: 'textarea', placeholder: text('placeholders', 'dockerRun') },
        ];
      case 'llms-txt-generator':
        return [
          { key: 'siteName', label: text('fields', 'siteName'), type: 'text', placeholder: text('placeholders', 'siteName') },
          { key: 'siteUrl', label: text('fields', 'siteUrl'), type: 'text', placeholder: text('placeholders', 'siteUrl') },
          { key: 'summary', label: text('fields', 'summary'), type: 'textarea', placeholder: text('placeholders', 'siteSummary') },
          { key: 'audience', label: text('fields', 'audience'), type: 'text', placeholder: text('placeholders', 'metaAudience') },
          { key: 'priorityPages', label: text('fields', 'priorityPages'), type: 'textarea', placeholder: text('placeholders', 'priorityPages') },
        ];
      case 'wifi-qr-code-generator':
        return [
          { key: 'ssid', label: text('fields', 'ssid'), type: 'text', placeholder: text('placeholders', 'ssid') },
          { key: 'password', label: text('fields', 'password'), type: 'text', placeholder: text('placeholders', 'password') },
          { key: 'encryption', label: text('fields', 'encryption'), type: 'select', options: [
            { label: 'WPA/WPA2/WPA3', value: 'WPA' },
            { label: 'WEP', value: 'WEP' },
            { label: text('options', 'noPassword'), value: 'nopass' },
          ] },
          { key: 'hidden', label: text('fields', 'hidden'), type: 'select', options: [
            { label: text('options', 'no'), value: 'false' },
            { label: text('options', 'yes'), value: 'true' },
          ] },
        ];
      default:
        return [];
    }
  }

  function getDefaults(toolSlug: string): Record<string, string> {
    switch (toolSlug) {
      case 'stock-profit-calculator':
        return { shares: '100', buyPrice: '42', sellPrice: '58', buyFees: '2', sellFees: '2' };
      case 'dividend-yield-calculator':
        return { sharePrice: '50', annualDividend: '2.4', shares: '100' };
      case 'market-cap-calculator':
        return { sharePrice: '125', sharesOutstanding: '1000000000' };
      case 'cagr-calculator':
        return { startValue: '10000', endValue: '18000', years: '5' };
      case 'position-size-calculator':
        return { accountSize: '10000', riskPercent: '1', entryPrice: '50', stopPrice: '47.5' };
      case 'macro-calculator':
        return { unit: 'metric', weight: '75', height: '178', age: '32', sex: 'male', activity: 'moderate', goal: 'fatLoss' };
      case 'debt-snowball-calculator':
        return { debts: text('placeholders', 'debtsCsv'), extraPayment: '150' };
      case 'calorie-deficit-calculator':
        return { maintenanceCalories: '2400', dailyCalories: '1900', days: '30' };
      case 'cover-letter-generator':
        return {
          jobTitle: text('placeholders', 'jobTitle'),
          company: text('placeholders', 'company'),
          experience: text('placeholders', 'experience'),
          skills: text('placeholders', 'skills'),
          achievement: text('placeholders', 'achievement'),
          tone: 'professional',
        };
      case 'one-rep-max-calculator':
        return { unit: 'metric', weight: '100', reps: '5' };
      case 'passport-photo-maker':
        return { preset: 'usPassport', widthMm: '35', heightMm: '45', dpi: '300', background: 'white' };
      case 'paypal-fee-calculator':
        return { amount: '100', feePercent: '3.49', fixedFee: '0.49', currency: 'USD' };
      case 'security-headers-checker':
        return { headers: text('placeholders', 'headers') };
      case 'csv-to-vcard-converter':
        return { csv: text('placeholders', 'csvContacts'), delimiter: 'comma', vcardVersion: '3.0' };
      case 'youtube-thumbnail-generator':
        return { video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' };
      case 'ai-prompt-generator':
        return { task: 'writing', topic: text('placeholders', 'aiTopic'), audience: text('placeholders', 'aiAudience'), tone: 'professional', format: text('placeholders', 'aiFormat'), constraints: text('placeholders', 'aiConstraints') };
      case 'title-capitalization-tool':
        return { title: text('placeholders', 'title'), style: 'title' };
      case 'meta-description-generator':
        return { page: text('placeholders', 'page'), keyword: text('placeholders', 'keyword'), benefit: text('placeholders', 'benefit'), audience: text('placeholders', 'metaAudience') };
      case 'youtube-title-generator':
        return { topic: text('placeholders', 'youtubeTopic'), keyword: text('placeholders', 'youtubeKeyword'), audience: text('placeholders', 'youtubeAudience'), tone: 'professional' };
      case 'instagram-bio-generator':
        return { topic: text('placeholders', 'instagramTopic'), keyword: text('placeholders', 'instagramKeyword'), audience: text('placeholders', 'creatorAudience'), cta: text('placeholders', 'cta'), tone: 'friendly' };
      case 'youtube-description-generator':
        return { title: text('placeholders', 'youtubeTopic'), keyword: text('placeholders', 'youtubeKeyword'), audience: text('placeholders', 'youtubeAudience'), cta: text('placeholders', 'cta'), links: text('placeholders', 'youtubeLinks') };
      case 'linkedin-headline-generator':
        return { jobTitle: text('placeholders', 'jobTitle'), skills: text('placeholders', 'skills'), audience: text('placeholders', 'metaAudience'), achievement: text('placeholders', 'achievement'), tone: 'professional' };
      case 'linkedin-summary-generator':
        return { jobTitle: text('placeholders', 'jobTitle'), experience: text('placeholders', 'experience'), skills: text('placeholders', 'skills'), achievement: text('placeholders', 'achievement'), audience: text('placeholders', 'metaAudience'), tone: 'professional' };
      case 'email-subject-line-generator':
        return { topic: text('placeholders', 'emailTopic'), audience: text('placeholders', 'metaAudience'), benefit: text('placeholders', 'emailBenefit'), tone: 'persuasive' };
      case 'etsy-fee-calculator':
        return { salePrice: '35', shippingCharge: '5', itemCost: '9', shippingCost: '4', listingFee: '0.20', transactionPercent: '6.5', paymentPercent: '3', fixedFee: '0.25', offsiteAdsPercent: '0', currency: 'USD' };
      case 'freelance-rate-calculator':
        return { targetIncome: '90000', expenses: '12000', taxPercent: '25', billableHours: '25', weeksOff: '6', currency: 'USD' };
      case 'vcard-to-csv-converter':
        return { vcard: text('placeholders', 'vcardContacts'), delimiter: 'comma' };
      case 'docker-run-to-docker-compose-converter':
        return { dockerRun: text('placeholders', 'dockerRun') };
      case 'llms-txt-generator':
        return { siteName: text('placeholders', 'siteName'), siteUrl: text('placeholders', 'siteUrl'), summary: text('placeholders', 'siteSummary'), audience: text('placeholders', 'metaAudience'), priorityPages: text('placeholders', 'priorityPages') };
      case 'wifi-qr-code-generator':
        return { ssid: text('placeholders', 'ssid'), password: text('placeholders', 'password'), encryption: 'WPA', hidden: 'false' };
      default:
        return {};
    }
  }

  let inputs = $state<Record<string, string>>(getDefaults(slug));
  let copied = $state(false);
  let qrDataUrl = $state('');
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const fields = $derived(getToolFields(slug));

  function num(key: string): number {
    const value = Number.parseFloat(inputs[key] || '');
    return Number.isFinite(value) ? value : 0;
  }

  function money(value: number): string {
    return new Intl.NumberFormat(locale || 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: Math.abs(value) >= 1000000 ? 0 : 2,
    }).format(value);
  }

  function compact(value: number): string {
    return new Intl.NumberFormat(locale || 'en-US', {
      notation: Math.abs(value) >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 2,
    }).format(value);
  }

  function percent(value: number): string {
    const sign = value > 0 ? '+' : '';
    return `${sign}${new Intl.NumberFormat(locale || 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}%`;
  }

  function plainPercent(value: number): string {
    return `${new Intl.NumberFormat(locale || 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}%`;
  }

  function integer(value: number): string {
    return new Intl.NumberFormat(locale || 'en-US', {
      maximumFractionDigits: 0,
    }).format(value);
  }

  function decimal(value: number, maximumFractionDigits = 1): string {
    return new Intl.NumberFormat(locale || 'en-US', {
      maximumFractionDigits,
    }).format(value);
  }

  function kcal(value: number): string {
    return `${integer(Math.round(value))} kcal`;
  }

  function grams(value: number): string {
    return `${integer(Math.round(value))} g`;
  }

  function moneyFor(value: number, currency: string): string {
    const safeCurrency = /^[A-Z]{3}$/.test(currency) ? currency : 'USD';
    return new Intl.NumberFormat(locale || 'en-US', {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: Math.abs(value) >= 1000000 ? 0 : 2,
    }).format(value);
  }

  function normalizeNumber(value: string): number {
    const parsed = Number.parseFloat(value.replace(/[$,%\s,]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function delimiterValue(value: string): string {
    if (value === 'semicolon') return ';';
    if (value === 'tab') return '\t';
    return ',';
  }

  function parseDelimitedRows(input: string, delimiter: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;

    for (let index = 0; index < input.length; index += 1) {
      const char = input[index];
      const next = input[index + 1];

      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
        continue;
      }

      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }

      if (char === delimiter && !inQuotes) {
        row.push(cell.trim());
        cell = '';
        continue;
      }

      if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && next === '\n') {
          index += 1;
        }
        row.push(cell.trim());
        if (row.some(Boolean)) {
          rows.push(row);
        }
        row = [];
        cell = '';
        continue;
      }

      cell += char;
    }

    row.push(cell.trim());
    if (row.some(Boolean)) {
      rows.push(row);
    }

    return rows;
  }

  function compactMonths(months: number): string {
    if (months < 12) {
      return `${integer(months)} mo`;
    }
    const years = months / 12;
    return `${decimal(years, 1)} yr`;
  }

  function extractYouTubeId(value: string): string {
    const trimmed = value.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const patterns = [
      /youtube\.com\/watch\?[^#]*v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match?.[1]) {
        return match[1];
      }
    }
    return '';
  }

  function titleCase(value: string): string {
    const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'vs', 'via']);
    return value
      .toLowerCase()
      .split(/(\s+)/)
      .map((word, index, all) => {
        if (/^\s+$/.test(word)) return word;
        const isEdge = index === 0 || index === all.length - 1;
        if (!isEdge && smallWords.has(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join('');
  }

  function escapeWifi(value: string): string {
    return value.replace(/([\\;,":])/g, '\\$1');
  }

  function language(): string {
    return locale.split('-')[0] || 'en';
  }

  function promptOutput(): string {
    const tone = text('options', inputs.tone || 'professional');
    const task = text('options', inputs.task || 'writing');
    const topic = inputs.topic || text('placeholders', 'aiTopic');
    const audience = inputs.audience || text('placeholders', 'aiAudience');
    const format = inputs.format || text('placeholders', 'aiFormat');
    const constraints = inputs.constraints || text('placeholders', 'aiConstraints');

    switch (language()) {
      case 'zh':
        return `你是一名${tone}助手。请为${audience}完成${task}任务。\n\n主题：${topic}\n输出格式：${format}\n约束：${constraints}\n\n请先给出最佳答案，然后列出关键假设。`;
      case 'es':
        return `Eres un asistente con tono ${tone}. Completa una tarea de ${task} para ${audience}.\n\nTema: ${topic}\nFormato de salida: ${format}\nRestricciones: ${constraints}\n\nEntrega primero la mejor respuesta y después enumera los supuestos clave.`;
      case 'pt':
        return `Você é um assistente de tom ${tone}. Conclua uma tarefa de ${task} para ${audience}.\n\nTema: ${topic}\nFormato de saída: ${format}\nRestrições: ${constraints}\n\nEntregue a melhor resposta primeiro e depois liste as principais premissas.`;
      case 'ja':
        return `あなたは${tone}なアシスタントです。${audience}向けに${task}のタスクを完了してください。\n\nトピック: ${topic}\n出力形式: ${format}\n制約: ${constraints}\n\n最初に最良の回答を示し、その後に主要な前提を列挙してください。`;
      case 'ru':
        return `Вы ${tone} помощник. Выполните задачу «${task}» для аудитории: ${audience}.\n\nТема: ${topic}\nФормат вывода: ${format}\nОграничения: ${constraints}\n\nСначала дайте лучший ответ, затем перечислите ключевые допущения.`;
      case 'fr':
        return `Vous êtes un assistant au ton ${tone}. Réalisez une tâche de ${task} pour ${audience}.\n\nSujet : ${topic}\nFormat de sortie : ${format}\nContraintes : ${constraints}\n\nDonnez d'abord la meilleure réponse, puis listez les hypothèses clés.`;
      case 'ar':
        return `أنت مساعد بنبرة ${tone}. أنجز مهمة ${task} من أجل ${audience}.\n\nالموضوع: ${topic}\nتنسيق الإخراج: ${format}\nالقيود: ${constraints}\n\nقدّم أفضل إجابة أولًا، ثم اذكر الافتراضات الرئيسية.`;
      case 'de':
        return `Du bist ein Assistent mit ${tone}em Ton. Erledige eine ${task}-Aufgabe für ${audience}.\n\nThema: ${topic}\nAusgabeformat: ${format}\nEinschränkungen: ${constraints}\n\nGib zuerst die beste Antwort und liste danach die wichtigsten Annahmen auf.`;
      case 'ko':
        return `당신은 ${tone} 어시스턴트입니다. ${audience}을 위해 ${task} 작업을 완료하세요.\n\n주제: ${topic}\n출력 형식: ${format}\n제약 조건: ${constraints}\n\n가장 좋은 답변을 먼저 제시한 뒤 핵심 가정을 나열하세요.`;
      default:
        return `You are a ${tone} assistant. Complete a ${task} task for ${audience}.\n\nTopic: ${topic}\nOutput format: ${format}\nConstraints: ${constraints}\n\nReturn the best answer first, then list key assumptions.`;
    }
  }

  function metaDescriptionOptions(page: string, keyword: string, benefit: string, audience: string): string[] {
    switch (language()) {
      case 'zh':
        return [
          `${page} 帮助${audience}${benefit}。使用这个免费的在线 ${keyword} 工具，无需注册即可生成结果。`,
          `免费使用 ${page}，为${audience}${benefit}。在线处理，快速获得适合搜索和分享的结果。`,
          `用 ${page} 在线完成 ${keyword} 相关任务。适合${audience}，简单、快速、无需安装软件。`,
        ];
      case 'es':
        return [
          `${page} ayuda a ${audience} a ${benefit}. Usa esta herramienta online gratuita de ${keyword} sin registrarte.`,
          `Crea mejores resultados de ${keyword} con ${page}. Flujo rápido en el navegador para ${audience}.`,
          `Usa ${page} para ${benefit}. Una herramienta online gratuita de ${keyword} para ${audience}.`,
        ];
      case 'pt':
        return [
          `${page} ajuda ${audience} a ${benefit}. Use esta ferramenta online gratuita de ${keyword} sem cadastro.`,
          `Crie melhores resultados de ${keyword} com ${page}. Fluxo rápido no navegador para ${audience}.`,
          `Use ${page} para ${benefit}. Uma ferramenta online gratuita de ${keyword} para ${audience}.`,
        ];
      case 'ja':
        return [
          `${page} は${audience}が${benefit}ために役立ちます。無料のオンライン ${keyword} ツールを登録なしで使えます。`,
          `${page} で ${keyword} の結果を改善。${audience}向けの高速なブラウザベースのワークフローです。`,
          `${page} を使って${benefit}。${audience}向けの無料オンライン ${keyword} ツールです。`,
        ];
      case 'ru':
        return [
          `${page} помогает аудитории ${audience} ${benefit}. Используйте бесплатный онлайн-инструмент ${keyword} без регистрации.`,
          `Создавайте более качественные результаты для ${keyword} с ${page}. Быстрый браузерный процесс для ${audience}.`,
          `Используйте ${page}, чтобы ${benefit}. Бесплатный онлайн-инструмент ${keyword} для ${audience}.`,
        ];
      case 'fr':
        return [
          `${page} aide ${audience} à ${benefit}. Utilisez cet outil en ligne gratuit de ${keyword}, sans inscription.`,
          `Créez de meilleurs résultats ${keyword} avec ${page}. Un flux rapide dans le navigateur pour ${audience}.`,
          `Utilisez ${page} pour ${benefit}. Un outil ${keyword} en ligne gratuit conçu pour ${audience}.`,
        ];
      case 'ar':
        return [
          `${page} يساعد ${audience} على ${benefit}. استخدم أداة ${keyword} المجانية عبر الإنترنت بدون تسجيل.`,
          `أنشئ نتائج أفضل لـ ${keyword} باستخدام ${page}. سير عمل سريع في المتصفح من أجل ${audience}.`,
          `استخدم ${page} من أجل ${benefit}. أداة ${keyword} مجانية عبر الإنترنت مصممة لـ ${audience}.`,
        ];
      case 'de':
        return [
          `${page} hilft ${audience}, ${benefit}. Nutze dieses kostenlose Online-${keyword}-Tool ohne Anmeldung.`,
          `Erstelle bessere ${keyword}-Ergebnisse mit ${page}. Schneller Browser-Workflow für ${audience}.`,
          `Nutze ${page}, um ${benefit}. Ein kostenloses Online-${keyword}-Tool für ${audience}.`,
        ];
      case 'ko':
        return [
          `${page}는 ${audience}이 ${benefit}할 수 있도록 돕습니다. 가입 없이 무료 온라인 ${keyword} 도구를 사용하세요.`,
          `${page}로 더 나은 ${keyword} 결과를 만드세요. ${audience}을 위한 빠른 브라우저 기반 흐름입니다.`,
          `${benefit}하려면 ${page}를 사용하세요. ${audience}을 위해 만든 무료 온라인 ${keyword} 도구입니다.`,
        ];
      default:
        return [
          `${page} helps ${audience} ${benefit}. Use this free online ${keyword} tool with no signup required.`,
          `Create better ${keyword} results with ${page}. Fast browser-based workflow for ${audience}.`,
          `Use ${page} to ${benefit}. A free online ${keyword} tool built for ${audience}.`,
        ];
    }
  }

  function coverLetterOutput(): string {
    const jobTitle = inputs.jobTitle || text('placeholders', 'jobTitle');
    const company = inputs.company || text('placeholders', 'company');
    const experience = inputs.experience || text('placeholders', 'experience');
    const skills = inputs.skills || text('placeholders', 'skills');
    const achievement = inputs.achievement || text('placeholders', 'achievement');
    const tone = text('options', inputs.tone || 'professional');

    switch (language()) {
      case 'zh':
        return `尊敬的 ${company} 招聘团队：\n\n我想申请 ${jobTitle} 职位。我的背景包括${experience}，并擅长${skills}。在过往工作中，我曾${achievement}，这让我能够把策略、执行和结果连接起来。\n\n我很期待把这些经验带到 ${company}，帮助团队更快验证机会、提升协作效率，并交付可衡量的成果。\n\n此致\n敬礼`;
      case 'es':
        return `Estimado equipo de ${company}:\n\nMe gustaría postularme para el puesto de ${jobTitle}. Cuento con ${experience} y experiencia en ${skills}. En mi trabajo anterior, ${achievement}, lo que demuestra mi capacidad para convertir prioridades en resultados medibles.\n\nMe entusiasma la posibilidad de aportar esta experiencia a ${company} y colaborar con un enfoque ${tone} desde el primer día.\n\nAtentamente,`;
      case 'pt':
        return `Prezada equipe da ${company},\n\nGostaria de me candidatar à vaga de ${jobTitle}. Tenho ${experience} e experiência em ${skills}. Em trabalhos anteriores, ${achievement}, mostrando minha capacidade de transformar prioridades em resultados mensuráveis.\n\nTenho interesse em levar essa experiência para a ${company} com uma abordagem ${tone} e orientada a impacto.\n\nAtenciosamente,`;
      case 'fr':
        return `Bonjour l'équipe ${company},\n\nJe souhaite candidater au poste de ${jobTitle}. Mon parcours comprend ${experience}, avec de solides compétences en ${skills}. Dans mes expériences précédentes, j'ai ${achievement}, ce qui illustre ma capacité à transformer les priorités en résultats mesurables.\n\nJe serais ravi de mettre cette expérience au service de ${company} avec une approche ${tone} et orientée résultats.\n\nCordialement,`;
      case 'de':
        return `Sehr geehrtes ${company}-Team,\n\nich möchte mich für die Position ${jobTitle} bewerben. Meine Erfahrung umfasst ${experience}, außerdem bringe ich Stärken in ${skills} mit. In meiner bisherigen Arbeit habe ich ${achievement} und gezeigt, dass ich Prioritäten in messbare Ergebnisse übersetzen kann.\n\nGern würde ich diese Erfahrung bei ${company} einbringen und mit einem ${tone}en, ergebnisorientierten Ansatz unterstützen.\n\nMit freundlichen Grüßen`;
      case 'ja':
        return `${company} 採用ご担当者様\n\n${jobTitle} のポジションに応募いたします。私は${experience}の経験があり、${skills}を強みとしています。これまでに${achievement}し、優先事項を具体的な成果につなげてきました。\n\n${company} でもこの経験を活かし、${tone}な姿勢でチームの成果に貢献したいと考えています。\n\nよろしくお願いいたします。`;
      case 'ko':
        return `${company} 채용 담당자님께,\n\n${jobTitle} 포지션에 지원하고자 합니다. 저는 ${experience}의 경험과 ${skills} 역량을 갖추고 있습니다. 이전 업무에서는 ${achievement}하며 우선순위를 측정 가능한 성과로 연결했습니다.\n\n이 경험을 ${company}에서 살려 ${tone} 방식으로 팀의 성과에 기여하고 싶습니다.\n\n감사합니다.`;
      case 'ru':
        return `Команде ${company},\n\nХочу откликнуться на позицию ${jobTitle}. У меня есть опыт: ${experience}, а также навыки в области ${skills}. Ранее я ${achievement}, что показывает мою способность превращать приоритеты в измеримые результаты.\n\nБуду рад применить этот опыт в ${company} и работать в ${tone} стиле с фокусом на результат.\n\nС уважением,`;
      case 'ar':
        return `إلى فريق التوظيف في ${company}،\n\nأرغب في التقدم لوظيفة ${jobTitle}. لدي خبرة تشمل ${experience}، وأمتلك مهارات في ${skills}. في عملي السابق، ${achievement}، مما يوضح قدرتي على تحويل الأولويات إلى نتائج قابلة للقياس.\n\nأتطلع إلى توظيف هذه الخبرة في ${company} بأسلوب ${tone} يركز على الأثر.\n\nمع التحية،`;
      default:
        return `Dear ${company} Hiring Team,\n\nI am excited to apply for the ${jobTitle} role. My background includes ${experience}, with hands-on strengths in ${skills}. In my previous work, I ${achievement}, which reflects my ability to turn priorities into measurable outcomes.\n\nI would welcome the chance to bring that experience to ${company}, contribute quickly, and support the team with a ${tone.toLowerCase()} approach.\n\nSincerely,`;
    }
  }

  function youtubeTitleOptions(): string[] {
    const topic = inputs.topic || text('placeholders', 'youtubeTopic');
    const keyword = inputs.keyword || text('placeholders', 'youtubeKeyword');
    const audience = inputs.audience || text('placeholders', 'youtubeAudience');

    switch (language()) {
      case 'zh':
        return [
          `${audience} 必看的 ${topic}`,
          `${keyword}：从入门到实战`,
          `我测试了 ${topic}，结果很意外`,
          `${topic} 的 7 个高效用法`,
          `别再这样用 ${keyword}`,
          `${audience} 如何用 ${topic} 节省时间`,
          `${keyword} 完整指南`,
          `${topic} 值得关注吗？真实体验`,
        ];
      case 'es':
        return [
          `${topic}: guía práctica para ${audience}`,
          `Probé ${keyword} y esto fue lo que pasó`,
          `7 formas de usar ${topic} mejor`,
          `No cometas estos errores con ${keyword}`,
          `${keyword} explicado fácil`,
          `Cómo ${audience} puede ahorrar tiempo con ${topic}`,
          `${topic}: lo bueno, lo malo y lo útil`,
          `La forma más simple de empezar con ${keyword}`,
        ];
      case 'pt':
        return [
          `${topic}: guia prático para ${audience}`,
          `Testei ${keyword} e veja o resultado`,
          `7 formas de usar ${topic} melhor`,
          `Evite estes erros com ${keyword}`,
          `${keyword} explicado de forma simples`,
          `Como ${audience} pode economizar tempo com ${topic}`,
          `${topic}: pontos fortes, limites e usos reais`,
          `O jeito mais simples de começar com ${keyword}`,
        ];
      case 'fr':
        return [
          `${topic} : guide pratique pour ${audience}`,
          `J'ai testé ${keyword} : voici le résultat`,
          `7 façons de mieux utiliser ${topic}`,
          `Évitez ces erreurs avec ${keyword}`,
          `${keyword} expliqué simplement`,
          `Comment ${audience} peut gagner du temps avec ${topic}`,
          `${topic} : avantages, limites et usages réels`,
          `La méthode la plus simple pour commencer avec ${keyword}`,
        ];
      case 'de':
        return [
          `${topic}: Praxisleitfaden für ${audience}`,
          `Ich habe ${keyword} getestet: Das Ergebnis`,
          `7 bessere Wege, ${topic} zu nutzen`,
          `Vermeide diese Fehler mit ${keyword}`,
          `${keyword} einfach erklärt`,
          `Wie ${audience} mit ${topic} Zeit spart`,
          `${topic}: Stärken, Grenzen und echte Anwendung`,
          `Der einfachste Einstieg in ${keyword}`,
        ];
      case 'ja':
        return [
          `${audience}向け ${topic} 実践ガイド`,
          `${keyword}を試して分かったこと`,
          `${topic}をもっと上手に使う7つの方法`,
          `${keyword}で避けたいミス`,
          `${keyword}をわかりやすく解説`,
          `${audience}が${topic}で時間を節約する方法`,
          `${topic}のメリット・限界・実用例`,
          `${keyword}を始める一番シンプルな方法`,
        ];
      case 'ko':
        return [
          `${audience}을 위한 ${topic} 실전 가이드`,
          `${keyword}를 직접 써봤습니다`,
          `${topic}를 더 잘 쓰는 7가지 방법`,
          `${keyword}에서 피해야 할 실수`,
          `${keyword} 쉽게 이해하기`,
          `${audience}이 ${topic}로 시간을 아끼는 법`,
          `${topic}: 장점, 한계, 실제 활용`,
          `${keyword}를 가장 쉽게 시작하는 방법`,
        ];
      case 'ru':
        return [
          `${topic}: практическое руководство для ${audience}`,
          `Я протестировал ${keyword}: вот результат`,
          `7 способов лучше использовать ${topic}`,
          `Не допускайте эти ошибки с ${keyword}`,
          `${keyword} простыми словами`,
          `Как ${audience} экономит время с ${topic}`,
          `${topic}: плюсы, ограничения и реальные сценарии`,
          `Самый простой способ начать с ${keyword}`,
        ];
      case 'ar':
        return [
          `${topic}: دليل عملي لـ ${audience}`,
          `جرّبت ${keyword} وهذه هي النتيجة`,
          `7 طرق لاستخدام ${topic} بشكل أفضل`,
          `تجنب هذه الأخطاء مع ${keyword}`,
          `${keyword} بشرح مبسط`,
          `كيف يوفر ${audience} الوقت باستخدام ${topic}`,
          `${topic}: المزايا والحدود والاستخدام الحقيقي`,
          `أسهل طريقة للبدء مع ${keyword}`,
        ];
      default:
        return [
          `${topic}: A practical guide for ${audience}`,
          `I tested ${keyword}: here's what happened`,
          `7 ways to use ${topic} better`,
          `Stop making these ${keyword} mistakes`,
          `${keyword} explained in simple terms`,
          `How ${audience} can save time with ${topic}`,
          `${topic}: the good, the bad, and the useful`,
          `The easiest way to start with ${keyword}`,
        ];
    }
  }

  function numberedOutput(values: string[]): string {
    return values.map((value, index) => `${index + 1}. ${value}`).join('\n');
  }

  function splitNonEmptyLines(value: string): string[] {
    return value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function instagramBioOptions(): string[] {
    const topic = inputs.topic || text('placeholders', 'instagramTopic');
    const keyword = inputs.keyword || text('placeholders', 'instagramKeyword');
    const audience = inputs.audience || text('placeholders', 'creatorAudience');
    const cta = inputs.cta || text('placeholders', 'cta');
    const tone = text('options', inputs.tone || 'friendly');

    if (language() === 'zh') {
      return [
        `${topic}｜给${audience}的${keyword}灵感｜${cta}`,
        `把${keyword}讲清楚，也把${topic}拍好。${cta}`,
        `${tone}分享${topic}：路线、技巧和真实经验。${cta}`,
        `${audience}的${topic}笔记｜${keyword} / 灵感 / 避坑`,
        `用镜头记录${topic}，用实用建议帮你少走弯路。${cta}`,
        `${keyword} + ${topic}｜每周更新可直接用的小方法`,
        `为${audience}整理${topic}灵感。收藏、实践、再出发。`,
        `${topic}创作者｜专注${keyword}｜${cta}`,
      ];
    }

    return [
      `${topic} for ${audience} | ${keyword} | ${cta}`,
      `Making ${topic} simpler with practical ${keyword}. ${cta}.`,
      `${tone} notes on ${topic}: ideas, lessons, and useful finds.`,
      `${keyword} + ${topic} for ${audience}. Save this for later.`,
      `Helping ${audience} turn ${topic} into repeatable wins.`,
      `${topic} ideas, honest experiments, and quick ${keyword}.`,
      `For ${audience} who want better ${topic}. ${cta}.`,
      `${topic} creator | ${keyword} | practical, weekly, useful`,
    ];
  }

  function youtubeDescriptionOutput(): string {
    const title = inputs.title || text('placeholders', 'youtubeTopic');
    const keyword = inputs.keyword || text('placeholders', 'youtubeKeyword');
    const audience = inputs.audience || text('placeholders', 'youtubeAudience');
    const cta = inputs.cta || text('placeholders', 'cta');
    const links = splitNonEmptyLines(inputs.links || text('placeholders', 'youtubeLinks'));
    const linkBlock = links.length
      ? links.map((link) => `- ${link}`).join('\n')
      : '- Add your resources, product page, or newsletter link';

    if (language() === 'zh') {
      return `${title}\n\n这期视频面向${audience}，用简单方式拆解 ${keyword}，帮助你更快判断哪些方法值得尝试。\n\n你会看到：\n- ${title} 的核心思路\n- 适合${audience}的实用场景\n- 常见误区和更稳妥的做法\n- 下一步可以直接执行的清单\n\n相关链接：\n${linkBlock}\n\n${cta}\n\n#${keyword.replace(/\s+/g, '')} #效率工具 #实用教程`;
    }

    return `${title}\n\nIn this video, we break down ${keyword} for ${audience} so you can decide what is useful, what to skip, and what to try next.\n\nWhat you'll learn:\n- The main idea behind ${title}\n- Practical examples for ${audience}\n- Common mistakes to avoid\n- A simple next-step checklist\n\nLinks and resources:\n${linkBlock}\n\n${cta}\n\n#${keyword.replace(/\s+/g, '')} #productivity #tutorial`;
  }

  function linkedinHeadlineOptions(): string[] {
    const jobTitle = inputs.jobTitle || text('placeholders', 'jobTitle');
    const skills = inputs.skills || text('placeholders', 'skills');
    const audience = inputs.audience || text('placeholders', 'metaAudience');
    const achievement = inputs.achievement || text('placeholders', 'achievement');

    if (language() === 'zh') {
      return [
        `${jobTitle}｜专注${skills}｜帮助${audience}获得可衡量增长`,
        `${jobTitle}｜用${skills}把策略转化为结果`,
        `${jobTitle}，曾${achievement}｜${skills}`,
        `帮助${audience}提升转化与效率的${jobTitle}`,
        `${skills}专家｜${jobTitle}｜${achievement}`,
        `${jobTitle}｜增长、协作与可执行策略｜${skills}`,
        `为${audience}打造更清晰增长路径的${jobTitle}`,
        `${jobTitle} | ${skills} | ${achievement}`,
      ];
    }

    return [
      `${jobTitle} | ${skills} | Helping ${audience} grow with measurable systems`,
      `${jobTitle} turning ${skills} into practical business outcomes`,
      `${jobTitle} | ${achievement} | ${skills}`,
      `Helping ${audience} improve conversion and clarity through ${skills}`,
      `${skills} specialist | ${jobTitle} | Practical growth operator`,
      `${jobTitle} focused on positioning, execution, and measurable wins`,
      `Building sharper growth systems for ${audience} | ${jobTitle}`,
      `${jobTitle} | ${skills} | ${achievement}`,
    ];
  }

  function linkedinSummaryOutput(): string {
    const jobTitle = inputs.jobTitle || text('placeholders', 'jobTitle');
    const experience = inputs.experience || text('placeholders', 'experience');
    const skills = inputs.skills || text('placeholders', 'skills');
    const achievement = inputs.achievement || text('placeholders', 'achievement');
    const audience = inputs.audience || text('placeholders', 'metaAudience');
    const tone = text('options', inputs.tone || 'professional');

    if (language() === 'zh') {
      return `我是一名${jobTitle}，拥有${experience}，长期围绕${skills}解决增长和协作问题。\n\n我擅长把模糊目标拆成可执行计划，并用清晰指标验证进展。过去我曾${achievement}，这让我更重视策略、执行和复盘之间的闭环。\n\n我希望与${audience}合作，用${tone}、务实的方式推动更高质量的结果。`;
    }

    return `I am a ${jobTitle} with ${experience}, focused on ${skills}.\n\nI like turning ambiguous goals into clear operating plans, then using practical metrics to learn quickly. In previous work, I ${achievement}, which shaped how I connect strategy, execution, and measurable outcomes.\n\nI enjoy partnering with ${audience} and bringing a ${tone.toLowerCase()} approach to work that needs clarity, momentum, and results.`;
  }

  function emailSubjectOptions(): string[] {
    const topic = inputs.topic || text('placeholders', 'emailTopic');
    const audience = inputs.audience || text('placeholders', 'metaAudience');
    const benefit = inputs.benefit || text('placeholders', 'emailBenefit');

    if (language() === 'zh') {
      return [
        `${topic}：帮你${benefit}`,
        `${audience}的新方法：${benefit}`,
        `今天发布：${topic}`,
        `更快完成${topic}的实用方案`,
        `${benefit}，从这个小改动开始`,
        `给${audience}的${topic}清单`,
        `别错过：${topic}已经上线`,
        `用更少时间获得更好结果`,
        `${audience}正在关注的${topic}`,
        `本周值得尝试：${topic}`,
      ];
    }

    return [
      `${topic}: ${benefit}`,
      `A faster way for ${audience} to ${benefit}`,
      `Now live: ${topic}`,
      `Your practical ${topic} checklist`,
      `Start here if you want to ${benefit}`,
      `${audience}: try this before your next ${topic}`,
      `The simple version of ${topic}`,
      `New: ${benefit} without extra busywork`,
      `What changed in ${topic}`,
      `Steal this ${topic} workflow`,
    ];
  }

  type Debt = {
    name: string;
    balance: number;
    rate: number;
    minPayment: number;
    paidMonth?: number;
  };

  function parseDebts(): Debt[] {
    const rows = parseDelimitedRows(inputs.debts || '', ',');
    return rows
      .filter((row) => !row.join(',').toLowerCase().includes('balance'))
      .map((row, index) => {
        const name = row[0] || `${text('results', 'nextDebt')} ${index + 1}`;
        const balance = normalizeNumber(row[1] || '');
        const rate = normalizeNumber(row[2] || '');
        const minPayment = normalizeNumber(row[3] || '');
        return { name, balance, rate, minPayment };
      })
      .filter((debt) => debt.balance > 0 && debt.minPayment > 0);
  }

  function passportPreset() {
    const preset = inputs.preset || 'usPassport';
    const presets: Record<string, { width: number; height: number; label: string }> = {
      usPassport: { width: 50.8, height: 50.8, label: text('options', 'usPassport') },
      euPassport: { width: 35, height: 45, label: text('options', 'euPassport') },
      ukPassport: { width: 35, height: 45, label: text('options', 'ukPassport') },
      indiaPassport: { width: 51, height: 51, label: text('options', 'indiaPassport') },
      chinaVisa: { width: 33, height: 48, label: text('options', 'chinaVisa') },
      custom: { width: num('widthMm'), height: num('heightMm'), label: text('options', 'custom') },
    };
    return presets[preset] || presets.usPassport;
  }

  function parseHeaders(raw: string): Record<string, string> {
    const headers: Record<string, string> = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || /^HTTP\//i.test(trimmed)) {
        continue;
      }
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex <= 0) {
        continue;
      }
      const key = trimmed.slice(0, colonIndex).trim().toLowerCase();
      const value = trimmed.slice(colonIndex + 1).trim();
      headers[key] = headers[key] ? `${headers[key]}, ${value}` : value;
    }
    return headers;
  }

  function vcardEscape(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
  }

  function unfoldVcardLines(raw: string): string[] {
    const lines: string[] = [];
    for (const line of raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')) {
      if (/^[ \t]/.test(line) && lines.length > 0) {
        lines[lines.length - 1] += line.slice(1);
      } else {
        lines.push(line);
      }
    }
    return lines;
  }

  function splitVcardBlocks(raw: string): string[][] {
    const blocks: string[][] = [];
    let current: string[] = [];
    for (const line of unfoldVcardLines(raw)) {
      const trimmed = line.trim();
      if (/^BEGIN:VCARD$/i.test(trimmed)) {
        current = [trimmed];
        continue;
      }
      if (current.length > 0) {
        current.push(trimmed);
      }
      if (/^END:VCARD$/i.test(trimmed) && current.length > 0) {
        blocks.push(current);
        current = [];
      }
    }
    return blocks;
  }

  function vcardValue(lines: string[], key: string): string {
    const upperKey = key.toUpperCase();
    const line = lines.find((candidate) => {
      const property = candidate.slice(0, candidate.indexOf(':')).split(';')[0].toUpperCase();
      return property === upperKey;
    });
    const colonIndex = line?.indexOf(':') ?? -1;
    return colonIndex >= 0 ? (line || '').slice(colonIndex + 1).replace(/\\n/g, '\n').replace(/\\([,;\\])/g, '$1') : '';
  }

  function csvCell(value: string, delimiter: string): string {
    if (value.includes('"') || value.includes('\n') || value.includes('\r') || value.includes(delimiter)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  function vcardToCsv(): { output: string; count: number } | null {
    const delimiter = delimiterValue(inputs.delimiter || 'comma');
    const blocks = splitVcardBlocks(inputs.vcard || '');
    const headers = ['first_name', 'last_name', 'full_name', 'email', 'phone', 'company', 'title', 'address'];
    const rows = blocks.map((block) => {
      const nameParts = vcardValue(block, 'N').split(';');
      const fullName = vcardValue(block, 'FN') || [nameParts[1], nameParts[0]].filter(Boolean).join(' ');
      return [
        nameParts[1] || '',
        nameParts[0] || '',
        fullName,
        vcardValue(block, 'EMAIL'),
        vcardValue(block, 'TEL'),
        vcardValue(block, 'ORG'),
        vcardValue(block, 'TITLE'),
        vcardValue(block, 'ADR').split(';').filter(Boolean).join(' '),
      ];
    }).filter((row) => row.some(Boolean));

    if (rows.length === 0) {
      return null;
    }

    const output = [headers, ...rows]
      .map((row) => row.map((cell) => csvCell(cell, delimiter)).join(delimiter))
      .join('\n');
    return { output, count: rows.length };
  }

  function splitShellArgs(command: string): string[] {
    const args: string[] = [];
    let current = '';
    let quote = '';
    let escaped = false;

    for (const char of command.trim()) {
      if (escaped) {
        current += char;
        escaped = false;
        continue;
      }
      if (char === '\\') {
        escaped = true;
        continue;
      }
      if ((char === '"' || char === "'") && !quote) {
        quote = char;
        continue;
      }
      if (char === quote) {
        quote = '';
        continue;
      }
      if (/\s/.test(char) && !quote) {
        if (current) {
          args.push(current);
          current = '';
        }
        continue;
      }
      current += char;
    }

    if (current) {
      args.push(current);
    }
    return args;
  }

  function yamlQuote(value: string): string {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }

  function serviceNameFromImage(image: string): string {
    return image
      .split('/').pop()
      ?.split(':')[0]
      ?.replace(/[^a-zA-Z0-9_-]/g, '-')
      ?.replace(/^-+|-+$/g, '')
      || 'app';
  }

  function dockerRunToCompose(): Result {
    const args = splitShellArgs(inputs.dockerRun || '');
    let index = 0;
    if (args[index] === 'docker') index += 1;
    if (args[index] === 'run') index += 1;

    const ports: string[] = [];
    const env: string[] = [];
    const volumes: string[] = [];
    let name = '';
    let restart = '';
    let network = '';
    let image = '';
    let command: string[] = [];

    const readFlagValue = (arg: string) => {
      const equalsIndex = arg.indexOf('=');
      if (equalsIndex >= 0) {
        return arg.slice(equalsIndex + 1);
      }
      index += 1;
      return args[index] || '';
    };

    while (index < args.length) {
      const arg = args[index];
      if (!arg.startsWith('-')) {
        image = arg;
        command = args.slice(index + 1);
        break;
      }

      if (arg === '-d' || arg === '--detach' || arg === '--rm' || arg === '-i' || arg === '-t' || arg === '-it' || arg === '-ti') {
        index += 1;
        continue;
      }
      if (arg === '--name' || arg.startsWith('--name=')) {
        name = readFlagValue(arg);
      } else if (arg === '-p' || arg === '--publish' || arg.startsWith('--publish=')) {
        ports.push(readFlagValue(arg));
      } else if (arg.startsWith('-p') && arg.length > 2) {
        ports.push(arg.slice(2));
      } else if (arg === '-e' || arg === '--env' || arg.startsWith('--env=')) {
        env.push(readFlagValue(arg));
      } else if (arg.startsWith('-e') && arg.length > 2) {
        env.push(arg.slice(2));
      } else if (arg === '-v' || arg === '--volume' || arg.startsWith('--volume=')) {
        volumes.push(readFlagValue(arg));
      } else if (arg.startsWith('-v') && arg.length > 2) {
        volumes.push(arg.slice(2));
      } else if (arg === '--restart' || arg.startsWith('--restart=')) {
        restart = readFlagValue(arg);
      } else if (arg === '--network' || arg.startsWith('--network=')) {
        network = readFlagValue(arg);
      } else if (arg.includes('=')) {
        readFlagValue(arg);
      }
      index += 1;
    }

    if (!image) {
      return { error: text('errors', 'invalidDockerRun') };
    }

    const service = name || serviceNameFromImage(image);
    const lines = ['services:', `  ${service}:`, `    image: ${yamlQuote(image)}`];
    if (name) lines.push(`    container_name: ${yamlQuote(name)}`);
    if (restart) lines.push(`    restart: ${yamlQuote(restart)}`);
    if (network) lines.push(`    network_mode: ${yamlQuote(network)}`);
    if (ports.length) {
      lines.push('    ports:');
      for (const port of ports) lines.push(`      - ${yamlQuote(port)}`);
    }
    if (env.length) {
      lines.push('    environment:');
      for (const item of env) lines.push(`      - ${yamlQuote(item)}`);
    }
    if (volumes.length) {
      lines.push('    volumes:');
      for (const volume of volumes) lines.push(`      - ${yamlQuote(volume)}`);
    }
    if (command.length) {
      lines.push(`    command: [${command.map(yamlQuote).join(', ')}]`);
    }

    const output = lines.join('\n');
    return {
      cards: [
        { label: text('results', 'service'), value: service },
        { label: text('results', 'ports'), value: integer(ports.length) },
        { label: text('results', 'envVars'), value: integer(env.length) },
      ],
      output,
      copyText: output,
    };
  }

  function llmsTxtOutput(): string {
    const siteName = inputs.siteName || text('placeholders', 'siteName');
    const siteUrl = inputs.siteUrl || text('placeholders', 'siteUrl');
    const summary = inputs.summary || text('placeholders', 'siteSummary');
    const audience = inputs.audience || text('placeholders', 'metaAudience');
    const pages = splitNonEmptyLines(inputs.priorityPages || text('placeholders', 'priorityPages'));
    const pageLines = pages.map((line) => {
      const [title, url, note] = line.split(',').map((part) => part.trim());
      const safeTitle = title || url || siteName;
      const safeUrl = url || title || siteUrl;
      return `- [${safeTitle}](${safeUrl})${note ? `: ${note}` : ''}`;
    });

    return `# ${siteName}\n\n> ${summary}\n\nOfficial site: ${siteUrl}\nAudience: ${audience}\n\n## Key Pages\n${pageLines.join('\n')}\n\n## Usage Notes\n- Prefer the canonical URLs above when citing or linking to ${siteName}.\n- Summarize tools by their input, output, and whether they run in the browser.\n- Do not invent pricing, account requirements, or supported formats beyond the linked pages.\n`;
  }

  function calculate(): Result {
    switch (slug) {
      case 'stock-profit-calculator': {
        const shares = num('shares');
        const buy = num('buyPrice');
        const sell = num('sellPrice');
        const buyFees = num('buyFees');
        const sellFees = num('sellFees');
        if (!shares || !buy || !sell) return { error: labels.invalidNumbers };
        const cost = shares * buy + buyFees;
        const proceeds = shares * sell - sellFees;
        const profit = proceeds - cost;
        const roi = cost ? (profit / cost) * 100 : 0;
        return {
          cards: [
            { label: text('results', 'totalCost'), value: money(cost) },
            { label: text('results', 'saleProceeds'), value: money(proceeds) },
            { label: text('results', 'profitLoss'), value: money(profit), tone: profit >= 0 ? 'good' : 'bad' },
            { label: 'ROI', value: percent(roi), tone: roi >= 0 ? 'good' : 'bad' },
          ],
          copyText: `${text('results', 'profit')}: ${money(profit)} (${percent(roi)})`,
        };
      }
      case 'dividend-yield-calculator': {
        const price = num('sharePrice');
        const dividend = num('annualDividend');
        const shares = num('shares');
        if (!price || !dividend) return { error: labels.invalidNumbers };
        const yieldPct = (dividend / price) * 100;
        const income = dividend * shares;
        return {
          cards: [
            { label: text('results', 'dividendYield'), value: percent(yieldPct), tone: 'good' },
            { label: text('results', 'annualIncome'), value: money(income) },
            { label: text('results', 'dividendPerShare'), value: money(dividend) },
          ],
          copyText: `${text('results', 'dividendYield')}: ${percent(yieldPct)}`,
        };
      }
      case 'market-cap-calculator': {
        const price = num('sharePrice');
        const shares = num('sharesOutstanding');
        if (!price || !shares) return { error: labels.invalidNumbers };
        const cap = price * shares;
        return {
          cards: [
            { label: text('results', 'marketCap'), value: money(cap) },
            { label: text('results', 'compact'), value: compact(cap) },
          ],
          copyText: `${text('results', 'marketCap')}: ${money(cap)}`,
        };
      }
      case 'cagr-calculator': {
        const start = num('startValue');
        const end = num('endValue');
        const years = num('years');
        if (!start || !end || !years) return { error: labels.invalidNumbers };
        const cagr = (Math.pow(end / start, 1 / years) - 1) * 100;
        const totalReturn = ((end - start) / start) * 100;
        return {
          cards: [
            { label: 'CAGR', value: percent(cagr), tone: cagr >= 0 ? 'good' : 'bad' },
            { label: text('results', 'totalReturn'), value: percent(totalReturn), tone: totalReturn >= 0 ? 'good' : 'bad' },
            { label: text('results', 'growthMultiple'), value: `${(end / start).toFixed(2)}x` },
          ],
          copyText: `CAGR: ${percent(cagr)}`,
        };
      }
      case 'position-size-calculator': {
        const account = num('accountSize');
        const riskPct = num('riskPercent');
        const entry = num('entryPrice');
        const stop = num('stopPrice');
        const unitRisk = Math.abs(entry - stop);
        if (!account || !riskPct || !entry || !stop || !unitRisk) return { error: labels.invalidNumbers };
        const riskAmount = account * (riskPct / 100);
        const units = Math.floor(riskAmount / unitRisk);
        const positionValue = units * entry;
        return {
          cards: [
            { label: text('results', 'riskAmount'), value: money(riskAmount) },
            { label: text('results', 'riskPerShare'), value: money(unitRisk) },
            { label: text('results', 'positionSize'), value: compact(units) },
            { label: text('results', 'positionValue'), value: money(positionValue) },
          ],
          copyText: `${text('results', 'positionSize')}: ${compact(units)}`,
        };
      }
      case 'macro-calculator': {
        const unit = inputs.unit || 'metric';
        const weightInput = num('weight');
        const heightInput = num('height');
        const age = num('age');
        if (!weightInput || !heightInput || !age) return { error: labels.invalidNumbers };

        const weightKg = unit === 'imperial' ? weightInput * 0.45359237 : weightInput;
        const heightCm = unit === 'imperial' ? heightInput * 2.54 : heightInput;
        const sexOffset = inputs.sex === 'female' ? -161 : 5;
        const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + sexOffset;
        const activityFactor: Record<string, number> = {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          active: 1.725,
          veryActive: 1.9,
        };
        const goalFactor: Record<string, number> = {
          fatLoss: 0.8,
          maintain: 1,
          leanGain: 1.1,
          muscleGain: 1.15,
        };
        const tdee = bmr * (activityFactor[inputs.activity || 'moderate'] || 1.55);
        const calories = tdee * (goalFactor[inputs.goal || 'fatLoss'] || 0.8);
        const protein = weightKg * (inputs.goal === 'muscleGain' ? 2 : 1.8);
        const fat = calories * 0.25 / 9;
        const carbs = Math.max(0, (calories - protein * 4 - fat * 9) / 4);
        return {
          cards: [
            { label: text('results', 'calories'), value: kcal(calories), tone: 'good' },
            { label: text('results', 'protein'), value: grams(protein) },
            { label: text('results', 'carbs'), value: grams(carbs) },
            { label: text('results', 'fat'), value: grams(fat) },
          ],
          rows: [
            { label: text('results', 'bmr'), value: kcal(bmr) },
            { label: text('results', 'tdee'), value: kcal(tdee) },
            { label: text('fields', 'goal'), value: text('options', inputs.goal || 'fatLoss') },
          ],
          copyText: `${text('results', 'calories')}: ${kcal(calories)}; ${text('results', 'protein')}: ${grams(protein)}; ${text('results', 'carbs')}: ${grams(carbs)}; ${text('results', 'fat')}: ${grams(fat)}`,
        };
      }
      case 'debt-snowball-calculator': {
        const debts = parseDebts();
        const extraPayment = Math.max(0, num('extraPayment'));
        if (debts.length === 0) return { error: text('errors', 'invalidData') };

        const initialPrincipal = debts.reduce((sum, debt) => sum + debt.balance, 0);
        const baseBudget = debts.reduce((sum, debt) => sum + debt.minPayment, 0) + extraPayment;
        let active = debts.map((debt) => ({ ...debt }));
        let months = 0;
        let totalInterest = 0;
        const payoffOrder: Debt[] = [];

        while (active.length > 0 && months < 600) {
          months += 1;
          active = active.sort((a, b) => a.balance - b.balance);

          for (const debt of active) {
            const interest = debt.balance * (Math.max(0, debt.rate) / 100 / 12);
            debt.balance += interest;
            totalInterest += interest;
          }

          let remainingBudget = baseBudget;
          for (const debt of active) {
            const payment = Math.min(debt.minPayment, debt.balance, remainingBudget);
            debt.balance -= payment;
            remainingBudget -= payment;
          }

          active = active.sort((a, b) => a.balance - b.balance);
          for (const debt of active) {
            if (remainingBudget <= 0) break;
            const payment = Math.min(debt.balance, remainingBudget);
            debt.balance -= payment;
            remainingBudget -= payment;
          }

          const newlyPaid = active.filter((debt) => debt.balance <= 0.01);
          for (const debt of newlyPaid) {
            payoffOrder.push({ ...debt, paidMonth: months, balance: 0 });
          }
          active = active.filter((debt) => debt.balance > 0.01);
        }

        if (active.length > 0) {
          return { error: text('errors', 'unpayableDebt') };
        }

        const totalPaid = initialPrincipal + totalInterest;
        const orderText = payoffOrder
          .map((debt, index) => `${index + 1}. ${debt.name} (${compactMonths(debt.paidMonth || months)})`)
          .join('\n');
        return {
          cards: [
            { label: text('results', 'payoffMonths'), value: compactMonths(months), tone: 'good' },
            { label: text('results', 'totalInterest'), value: money(totalInterest) },
            { label: text('results', 'totalPaid'), value: money(totalPaid) },
            { label: text('results', 'nextDebt'), value: payoffOrder[0]?.name || '-' },
          ],
          output: orderText,
          rows: payoffOrder.slice(0, 8).map((debt, index) => ({
            label: `${text('results', 'payoffOrder')} ${index + 1}`,
            value: `${debt.name} - ${compactMonths(debt.paidMonth || months)}`,
          })),
          copyText: `${text('results', 'payoffMonths')}: ${compactMonths(months)}\n${text('results', 'totalInterest')}: ${money(totalInterest)}\n${orderText}`,
        };
      }
      case 'calorie-deficit-calculator': {
        const maintenance = num('maintenanceCalories');
        const daily = num('dailyCalories');
        const days = num('days') || 30;
        if (!maintenance || !daily || days <= 0) return { error: labels.invalidNumbers };
        const dailyDeficit = maintenance - daily;
        const weeklyDeficit = dailyDeficit * 7;
        const weeklyKg = weeklyDeficit / 7700;
        const weeklyLb = weeklyDeficit / 3500;
        const periodKg = dailyDeficit * days / 7700;
        const periodLb = dailyDeficit * days / 3500;
        const changeText = `${decimal(weeklyKg, 2)} kg / ${decimal(weeklyLb, 2)} lb`;
        return {
          cards: [
            { label: text('results', 'dailyDeficit'), value: kcal(dailyDeficit), tone: dailyDeficit >= 0 ? 'good' : 'bad' },
            { label: text('results', 'weeklyDeficit'), value: kcal(weeklyDeficit), tone: weeklyDeficit >= 0 ? 'good' : 'bad' },
            { label: text('results', 'estimatedChange'), value: changeText },
            { label: `${text('results', 'estimatedChange')} (${integer(days)}d)`, value: `${decimal(periodKg, 2)} kg / ${decimal(periodLb, 2)} lb` },
          ],
          copyText: `${text('results', 'dailyDeficit')}: ${kcal(dailyDeficit)}; ${text('results', 'estimatedChange')}: ${changeText}`,
        };
      }
      case 'cover-letter-generator': {
        const output = coverLetterOutput();
        return { output, copyText: output };
      }
      case 'one-rep-max-calculator': {
        const weight = num('weight');
        const reps = Math.max(1, Math.round(num('reps')));
        if (!weight || !reps) return { error: labels.invalidNumbers };
        const unitLabel = inputs.unit === 'imperial' ? 'lb' : 'kg';
        const epley = weight * (1 + reps / 30);
        const brzycki = reps === 1 ? weight : weight * 36 / (37 - Math.min(reps, 36));
        const lombardi = weight * Math.pow(reps, 0.1);
        const average = (epley + brzycki + lombardi) / 3;
        const lift = (value: number) => `${decimal(value, 1)} ${unitLabel}`;
        return {
          cards: [
            { label: text('results', 'averageOneRepMax'), value: lift(average), tone: 'good' },
            { label: text('results', 'epley'), value: lift(epley) },
            { label: text('results', 'brzycki'), value: lift(brzycki) },
            { label: text('results', 'lombardi'), value: lift(lombardi) },
          ],
          copyText: `${text('results', 'averageOneRepMax')}: ${lift(average)}`,
        };
      }
      case 'passport-photo-maker': {
        const preset = passportPreset();
        const dpi = num('dpi') || 300;
        if (!preset.width || !preset.height || !dpi) return { error: labels.invalidNumbers };
        const widthPx = Math.round((preset.width / 25.4) * dpi);
        const heightPx = Math.round((preset.height / 25.4) * dpi);
        const ratio = preset.width / preset.height;
        const background = text('options', inputs.background || 'white');
        const checklist = [
          `${text('results', 'printSize')}: ${decimal(preset.width, 1)} x ${decimal(preset.height, 1)} mm`,
          `${text('results', 'pixelSize')}: ${widthPx} x ${heightPx} px @ ${dpi} DPI`,
          `${text('results', 'background')}: ${background}`,
        ].join('\n');
        return {
          cards: [
            { label: text('results', 'pixelSize'), value: `${widthPx} x ${heightPx}` },
            { label: text('results', 'printSize'), value: `${decimal(preset.width, 1)} x ${decimal(preset.height, 1)} mm` },
            { label: 'DPI', value: integer(dpi) },
            { label: text('results', 'aspectRatio'), value: `${decimal(ratio, 2)}:1` },
          ],
          rows: [
            { label: text('fields', 'preset'), value: preset.label },
            { label: text('results', 'background'), value: background },
            { label: text('results', 'checklist'), value: checklist },
          ],
          output: checklist,
          copyText: checklist,
        };
      }
      case 'paypal-fee-calculator': {
        const amount = num('amount');
        const feePercent = num('feePercent');
        const fixedFee = num('fixedFee');
        const currency = inputs.currency || 'USD';
        if (!amount || feePercent < 0 || fixedFee < 0 || feePercent >= 100) return { error: labels.invalidNumbers };
        const rate = feePercent / 100;
        const fee = amount * rate + fixedFee;
        const net = amount - fee;
        const grossToReceive = (amount + fixedFee) / (1 - rate);
        return {
          cards: [
            { label: text('results', 'fee'), value: moneyFor(fee, currency), tone: fee > 0 ? 'bad' : 'neutral' },
            { label: text('results', 'netReceived'), value: moneyFor(net, currency), tone: 'good' },
            { label: text('results', 'grossToReceive'), value: moneyFor(grossToReceive, currency) },
            { label: text('fields', 'feePercent'), value: plainPercent(feePercent) },
          ],
          copyText: `${text('results', 'fee')}: ${moneyFor(fee, currency)}; ${text('results', 'netReceived')}: ${moneyFor(net, currency)}`,
        };
      }
      case 'security-headers-checker': {
        const headers = parseHeaders(inputs.headers || '');
        const csp = headers['content-security-policy'] || '';
        const checks = [
          { name: 'Strict-Transport-Security', present: Boolean(headers['strict-transport-security']), value: headers['strict-transport-security'] || 'max-age=31536000; includeSubDomains' },
          { name: 'Content-Security-Policy', present: Boolean(csp), value: csp || "default-src 'self'" },
          { name: 'X-Content-Type-Options', present: /nosniff/i.test(headers['x-content-type-options'] || ''), value: headers['x-content-type-options'] || 'nosniff' },
          { name: 'Referrer-Policy', present: Boolean(headers['referrer-policy']), value: headers['referrer-policy'] || 'strict-origin-when-cross-origin' },
          { name: 'Permissions-Policy', present: Boolean(headers['permissions-policy']), value: headers['permissions-policy'] || 'camera=(), microphone=(), geolocation=()' },
          { name: 'Frame Protection', present: Boolean(headers['x-frame-options']) || /frame-ancestors/i.test(csp), value: headers['x-frame-options'] || 'frame-ancestors in CSP' },
        ];
        const passed = checks.filter((check) => check.present).length;
        const missing = checks.length - passed;
        const score = Math.round((passed / checks.length) * 100);
        return {
          cards: [
            { label: text('results', 'score'), value: `${score}%`, tone: score >= 80 ? 'good' : score >= 50 ? 'neutral' : 'bad' },
            { label: text('results', 'passed'), value: integer(passed), tone: 'good' },
            { label: text('results', 'missing'), value: integer(missing), tone: missing ? 'bad' : 'good' },
          ],
          rows: checks.map((check) => ({
            label: check.name,
            value: check.present ? check.value : `${text('results', 'missing')}: ${check.value}`,
          })),
          copyText: `${text('results', 'score')}: ${score}% (${passed}/${checks.length})`,
        };
      }
      case 'csv-to-vcard-converter': {
        const delimiter = delimiterValue(inputs.delimiter || 'comma');
        const rows = parseDelimitedRows(inputs.csv || '', delimiter);
        if (rows.length < 2) return { error: text('errors', 'invalidCsv') };

        const headers = rows[0].map((header) => header.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const findValue = (row: string[], names: string[]) => {
          const index = headers.findIndex((header) => names.includes(header));
          return index >= 0 ? row[index] || '' : '';
        };
        const version = inputs.vcardVersion || '3.0';
        const vcards = rows.slice(1).map((row) => {
          const first = findValue(row, ['firstname', 'first', 'givenname', 'given']);
          const last = findValue(row, ['lastname', 'last', 'surname', 'familyname', 'family']);
          const fullName = findValue(row, ['name', 'fullname', 'fn']) || [first, last].filter(Boolean).join(' ');
          const email = findValue(row, ['email', 'emailaddress', 'mail']);
          const phone = findValue(row, ['phone', 'telephone', 'mobile', 'cell']);
          const company = findValue(row, ['company', 'organization', 'org']);
          const title = findValue(row, ['title', 'jobtitle', 'role']);
          const address = findValue(row, ['address', 'street']);
          if (!fullName && !email && !phone) {
            return '';
          }
          const lines = [
            'BEGIN:VCARD',
            `VERSION:${version}`,
            `FN:${vcardEscape(fullName || email || phone)}`,
            `N:${vcardEscape(last)};${vcardEscape(first)};;;`,
          ];
          if (company) lines.push(`ORG:${vcardEscape(company)}`);
          if (title) lines.push(`TITLE:${vcardEscape(title)}`);
          if (phone) lines.push(`TEL;TYPE=CELL:${vcardEscape(phone)}`);
          if (email) lines.push(`EMAIL:${vcardEscape(email)}`);
          if (address) lines.push(`ADR;TYPE=WORK:;;${vcardEscape(address)};;;;`);
          lines.push('END:VCARD');
          return lines.join('\n');
        }).filter(Boolean);

        if (vcards.length === 0) return { error: text('errors', 'invalidCsv') };

        const output = vcards.join('\n\n');
        return {
          cards: [
            { label: text('results', 'contacts'), value: integer(vcards.length), tone: 'good' },
            { label: text('results', 'vcardVersion'), value: version },
          ],
          output,
          copyText: output,
        };
      }
      case 'youtube-thumbnail-generator': {
        const id = extractYouTubeId(inputs.video || '');
        if (!id) return { error: labels.invalidYoutube };
        const variants = [
          [text('results', 'maxResolution'), `https://img.youtube.com/vi/${id}/maxresdefault.jpg`],
          [text('results', 'highQuality'), `https://img.youtube.com/vi/${id}/hqdefault.jpg`],
          [text('results', 'mediumQuality'), `https://img.youtube.com/vi/${id}/mqdefault.jpg`],
          [text('results', 'defaultQuality'), `https://img.youtube.com/vi/${id}/default.jpg`],
        ];
        return {
          cards: [{ label: text('results', 'videoId'), value: id }],
          rows: variants.map(([label, value]) => ({ label, value })),
          images: variants.slice(0, 2).map(([label, url]) => ({ label, url })),
          copyText: variants[0][1],
        };
      }
      case 'ai-prompt-generator': {
        const prompt = promptOutput();
        return { output: prompt, copyText: prompt };
      }
      case 'title-capitalization-tool': {
        const title = inputs.title || '';
        const style = inputs.style || 'title';
        const output = style === 'upper'
          ? title.toUpperCase()
          : style === 'lower'
            ? title.toLowerCase()
            : style === 'sentence'
              ? title.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase())
              : titleCase(title);
        return { output, copyText: output };
      }
      case 'meta-description-generator': {
        const page = inputs.page || text('placeholders', 'page');
        const keyword = inputs.keyword || text('placeholders', 'keyword');
        const benefit = inputs.benefit || text('placeholders', 'benefit');
        const audience = inputs.audience || text('placeholders', 'metaAudience');
        const options = metaDescriptionOptions(page, keyword, benefit, audience);
        return {
          output: options.join('\n\n'),
          rows: options.map((value, index) => ({ label: `${text('results', 'option')} ${index + 1}`, value })),
          copyText: options[0],
        };
      }
      case 'youtube-title-generator': {
        const options = youtubeTitleOptions();
        const output = options.map((value, index) => `${index + 1}. ${value}`).join('\n');
        return {
          output,
          rows: options.slice(0, 6).map((value, index) => ({ label: `${text('results', 'option')} ${index + 1}`, value })),
          copyText: output,
        };
      }
      case 'instagram-bio-generator': {
        const options = instagramBioOptions();
        const output = numberedOutput(options);
        return {
          output,
          rows: options.slice(0, 6).map((value, index) => ({ label: `${text('results', 'option')} ${index + 1}`, value })),
          copyText: output,
        };
      }
      case 'youtube-description-generator': {
        const output = youtubeDescriptionOutput();
        return {
          output,
          copyText: output,
        };
      }
      case 'linkedin-headline-generator': {
        const options = linkedinHeadlineOptions();
        const output = numberedOutput(options);
        return {
          output,
          rows: options.slice(0, 6).map((value, index) => ({ label: `${text('results', 'option')} ${index + 1}`, value })),
          copyText: output,
        };
      }
      case 'linkedin-summary-generator': {
        const output = linkedinSummaryOutput();
        return { output, copyText: output };
      }
      case 'email-subject-line-generator': {
        const options = emailSubjectOptions();
        const output = numberedOutput(options);
        return {
          output,
          rows: options.slice(0, 6).map((value, index) => ({ label: `${text('results', 'option')} ${index + 1}`, value })),
          copyText: output,
        };
      }
      case 'etsy-fee-calculator': {
        const salePrice = num('salePrice');
        const shippingCharge = Math.max(0, num('shippingCharge'));
        const itemCost = Math.max(0, num('itemCost'));
        const shippingCost = Math.max(0, num('shippingCost'));
        const listingFee = Math.max(0, num('listingFee'));
        const transactionPercent = Math.max(0, num('transactionPercent'));
        const paymentPercent = Math.max(0, num('paymentPercent'));
        const fixedFee = Math.max(0, num('fixedFee'));
        const offsiteAdsPercent = Math.max(0, num('offsiteAdsPercent'));
        const currency = inputs.currency || 'USD';
        if (!salePrice || transactionPercent >= 100 || paymentPercent >= 100 || offsiteAdsPercent >= 100) {
          return { error: labels.invalidNumbers };
        }

        const grossRevenue = salePrice + shippingCharge;
        const transactionFee = grossRevenue * (transactionPercent / 100);
        const paymentFee = grossRevenue * (paymentPercent / 100) + fixedFee;
        const offsiteAdsFee = grossRevenue * (offsiteAdsPercent / 100);
        const totalFees = listingFee + transactionFee + paymentFee + offsiteAdsFee;
        const netRevenue = grossRevenue - totalFees;
        const profit = netRevenue - itemCost - shippingCost;
        const margin = grossRevenue ? (profit / grossRevenue) * 100 : 0;

        return {
          cards: [
            { label: text('results', 'totalFees'), value: moneyFor(totalFees, currency), tone: totalFees > 0 ? 'bad' : 'neutral' },
            { label: text('results', 'netRevenue'), value: moneyFor(netRevenue, currency), tone: 'good' },
            { label: text('results', 'profit'), value: moneyFor(profit, currency), tone: profit >= 0 ? 'good' : 'bad' },
            { label: text('results', 'profitMargin'), value: plainPercent(margin), tone: margin >= 0 ? 'good' : 'bad' },
          ],
          rows: [
            { label: text('results', 'grossRevenue'), value: moneyFor(grossRevenue, currency) },
            { label: text('fields', 'listingFee'), value: moneyFor(listingFee, currency) },
            { label: text('results', 'transactionFee'), value: moneyFor(transactionFee, currency) },
            { label: text('results', 'paymentFee'), value: moneyFor(paymentFee, currency) },
            { label: text('results', 'offsiteAdsFee'), value: moneyFor(offsiteAdsFee, currency) },
          ],
          copyText: `${text('results', 'totalFees')}: ${moneyFor(totalFees, currency)}; ${text('results', 'profit')}: ${moneyFor(profit, currency)} (${plainPercent(margin)})`,
        };
      }
      case 'freelance-rate-calculator': {
        const targetIncome = num('targetIncome');
        const expenses = Math.max(0, num('expenses'));
        const taxPercent = Math.max(0, Math.min(95, num('taxPercent')));
        const billableHours = num('billableHours');
        const weeksOff = Math.max(0, Math.min(51, num('weeksOff')));
        const currency = inputs.currency || 'USD';
        if (!targetIncome || !billableHours) return { error: labels.invalidNumbers };

        const workingWeeks = 52 - weeksOff;
        const annualBillableHours = billableHours * workingWeeks;
        const yearlyRevenue = (targetIncome + expenses) / (1 - taxPercent / 100);
        const hourlyRate = yearlyRevenue / annualBillableHours;
        const dayRate = hourlyRate * 8;
        const monthlyRevenue = yearlyRevenue / 12;

        return {
          cards: [
            { label: text('results', 'hourlyRate'), value: moneyFor(hourlyRate, currency), tone: 'good' },
            { label: text('results', 'dayRate'), value: moneyFor(dayRate, currency) },
            { label: text('results', 'monthlyRevenue'), value: moneyFor(monthlyRevenue, currency) },
            { label: text('results', 'yearlyRevenue'), value: moneyFor(yearlyRevenue, currency) },
          ],
          rows: [
            { label: text('fields', 'billableHours'), value: `${integer(annualBillableHours)} / yr` },
            { label: text('fields', 'taxPercent'), value: plainPercent(taxPercent) },
            { label: text('fields', 'expenses'), value: moneyFor(expenses, currency) },
          ],
          copyText: `${text('results', 'hourlyRate')}: ${moneyFor(hourlyRate, currency)}; ${text('results', 'yearlyRevenue')}: ${moneyFor(yearlyRevenue, currency)}`,
        };
      }
      case 'vcard-to-csv-converter': {
        const converted = vcardToCsv();
        if (!converted) return { error: text('errors', 'invalidVcard') };
        return {
          cards: [
            { label: text('results', 'contacts'), value: integer(converted.count), tone: 'good' },
            { label: text('results', 'csvRows'), value: integer(converted.count + 1) },
          ],
          output: converted.output,
          copyText: converted.output,
        };
      }
      case 'docker-run-to-docker-compose-converter':
        return dockerRunToCompose();
      case 'llms-txt-generator': {
        const output = llmsTxtOutput();
        const pages = splitNonEmptyLines(inputs.priorityPages || text('placeholders', 'priorityPages')).length;
        return {
          cards: [
            { label: text('results', 'pages'), value: integer(pages), tone: 'good' },
            { label: text('fields', 'siteName'), value: inputs.siteName || text('placeholders', 'siteName') },
          ],
          output,
          copyText: output,
        };
      }
      case 'wifi-qr-code-generator': {
        const ssid = inputs.ssid || '';
        const encryption = inputs.encryption || 'WPA';
        const password = encryption === 'nopass' ? '' : (inputs.password || '');
        if (!ssid) return { error: text('errors', 'wifiSsid') };
        const payload = `WIFI:T:${encryption};S:${escapeWifi(ssid)};P:${escapeWifi(password)};H:${inputs.hidden === 'true' ? 'true' : 'false'};;`;
        return {
          output: payload,
          rows: [
            { label: 'SSID', value: ssid },
            { label: text('results', 'encryption'), value: encryption },
            { label: text('results', 'hidden'), value: inputs.hidden === 'true' ? text('options', 'yes') : text('options', 'no') },
          ],
          copyText: payload,
        };
      }
      default:
        return { error: text('errors', 'missingConfig') };
    }
  }

  const result = $derived(calculate());

  $effect(() => {
    if (slug !== 'wifi-qr-code-generator' || !result.copyText || result.error) {
      qrDataUrl = '';
      return;
    }

    QRCode.toDataURL(result.copyText, {
      width: 280,
      margin: 2,
      color: { dark: '#111827', light: '#ffffff' },
    }).then((dataUrl) => {
      qrDataUrl = dataUrl;
    }).catch(() => {
      qrDataUrl = '';
    });
  });

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });

  function updateInput(key: string, value: string) {
    inputs = { ...inputs, [key]: value };
  }

  function clearInputs() {
    inputs = Object.fromEntries(fields.map((field) => [field.key, '']));
  }

  async function copyResult() {
    if (!result.copyText) {
      return;
    }
    await navigator.clipboard.writeText(result.copyText);
    copied = true;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1800);
  }
</script>

<div class="space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each fields as field (field.key)}
      <div class={field.type === 'textarea' ? 'md:col-span-2' : ''}>
        <label for={`${slug}-${field.key}`} class="tool-label">{field.label}</label>
        {#if field.type === 'textarea'}
          <textarea
            id={`${slug}-${field.key}`}
            value={inputs[field.key] || ''}
            oninput={(event) => updateInput(field.key, event.currentTarget.value)}
            placeholder={field.placeholder || ''}
            class="tool-input min-h-24"
          ></textarea>
        {:else if field.type === 'select'}
          <select
            id={`${slug}-${field.key}`}
            value={inputs[field.key] || ''}
            onchange={(event) => updateInput(field.key, event.currentTarget.value)}
            class="tool-input"
          >
            {#each field.options || [] as option (option.value)}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        {:else}
          <input
            id={`${slug}-${field.key}`}
            type={field.type || 'text'}
            value={inputs[field.key] || ''}
            oninput={(event) => updateInput(field.key, event.currentTarget.value)}
            placeholder={field.placeholder || ''}
            class="tool-input"
            step="any"
          />
        {/if}
      </div>
    {/each}
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" onclick={copyResult} disabled={!result.copyText || Boolean(result.error)} class="btn-primary disabled:opacity-50">
      {copied ? labels.copied : labels.copy}
    </button>
    <button type="button" onclick={clearInputs} class="btn-secondary">
      {labels.clear}
    </button>
    {#if slug === 'wifi-qr-code-generator' && qrDataUrl}
      <a href={qrDataUrl} download="wifi-qr-code.png" class="btn-secondary">
        {labels.downloadQr}
      </a>
    {/if}
  </div>

  {#if result.error}
    <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
      {result.error}
    </div>
  {:else}
    {#if result.cards?.length}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {#each result.cards as card (card.label)}
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div class="text-sm text-gray-600 dark:text-gray-400">{card.label}</div>
            <div class={`text-2xl font-bold mt-1 ${
              card.tone === 'good'
                ? 'text-green-600 dark:text-green-400'
                : card.tone === 'bad'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
            }`}>
              {card.value}
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if result.output}
      <div>
        <label class="tool-label">{labels.output}</label>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-pre-wrap break-words text-sm text-gray-800 dark:text-gray-200">{result.output}</pre>
      </div>
    {/if}

    {#if qrDataUrl}
      <div class="flex justify-center p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <img src={qrDataUrl} alt="WiFi QR Code" width="280" height="280" class="w-[280px] h-[280px]" />
      </div>
    {/if}

    {#if result.rows?.length}
      <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table class="w-full text-sm">
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each result.rows as row (row.label)}
              <tr class="bg-white dark:bg-gray-900">
                <th class="px-4 py-3 text-left text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.label}</th>
                <td class="px-4 py-3 font-mono text-gray-900 dark:text-gray-100 break-all">{row.value}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}

    {#if result.images?.length}
      <div>
        <div class="tool-label mb-3">{labels.preview}</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each result.images as image (image.url)}
            <figure class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <img src={image.url} alt={image.label} class="w-full aspect-video object-cover" loading="lazy" />
              <figcaption class="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">{image.label}</figcaption>
            </figure>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>
