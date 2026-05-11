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
        titleCase: 'Title Case',
        sentenceCase: 'Sentence case',
        uppercase: 'UPPERCASE',
        lowercase: 'lowercase',
        no: 'No',
        yes: 'Yes',
        noPassword: 'No password',
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
        titleCase: '标题式大小写',
        sentenceCase: '句首大写',
        uppercase: '全部大写',
        lowercase: '全部小写',
        no: '否',
        yes: '是',
        noPassword: '无密码',
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
      case 'youtube-thumbnail-generator':
        return { video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' };
      case 'ai-prompt-generator':
        return { task: 'writing', topic: text('placeholders', 'aiTopic'), audience: text('placeholders', 'aiAudience'), tone: 'professional', format: text('placeholders', 'aiFormat'), constraints: text('placeholders', 'aiConstraints') };
      case 'title-capitalization-tool':
        return { title: text('placeholders', 'title'), style: 'title' };
      case 'meta-description-generator':
        return { page: text('placeholders', 'page'), keyword: text('placeholders', 'keyword'), benefit: text('placeholders', 'benefit'), audience: text('placeholders', 'metaAudience') };
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
