#!/usr/bin/env tsx

/**
 * 翻译键生成器
 * 
 * 功能：为缺失的翻译键生成合理的默认值
 */

import fs from 'fs';
import path from 'path';

export interface TranslationTemplate {
  key: string;
  value: string;
  category: 'ui' | 'data' | 'message' | 'label' | 'action';
  confidence: number; // 0-1，生成质量的置信度
}

// 通用 UI 翻译模板（所有语言通用）
const COMMON_UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    input: 'Input',
    output: 'Output',
    copy: 'Copy',
    copied: 'Copied!',
    clear: 'Clear',
    generate: 'Generate',
    convert: 'Convert',
    format: 'Format',
    download: 'Download',
    upload: 'Upload',
    paste: 'Paste',
    result: 'Result',
    error: 'Error',
    loading: 'Loading...',
    placeholder: 'Enter text here...',
    inputPlaceholder: 'Enter text here...',
    outputPlaceholder: 'Result will appear here...',
  },
  zh: {
    input: '输入',
    output: '输出',
    copy: '复制',
    copied: '已复制！',
    clear: '清空',
    generate: '生成',
    convert: '转换',
    format: '格式化',
    download: '下载',
    upload: '上传',
    paste: '粘贴',
    result: '结果',
    error: '错误',
    loading: '加载中...',
    placeholder: '在此输入文本...',
    inputPlaceholder: '在此输入文本...',
    outputPlaceholder: '结果将显示在这里...',
  },
  ja: {
    input: '入力',
    output: '出力',
    copy: 'コピー',
    copied: 'コピーしました！',
    clear: 'クリア',
    generate: '生成',
    convert: '変換',
    format: 'フォーマット',
    download: 'ダウンロード',
    upload: 'アップロード',
    paste: '貼り付け',
    result: '結果',
    error: 'エラー',
    loading: '読み込み中...',
    placeholder: 'ここにテキストを入力...',
    inputPlaceholder: 'ここにテキストを入力...',
    outputPlaceholder: '結果がここに表示されます...',
  },
  ko: {
    input: '입력',
    output: '출력',
    copy: '복사',
    copied: '복사됨!',
    clear: '지우기',
    generate: '생성',
    convert: '변환',
    format: '포맷',
    download: '다운로드',
    upload: '업로드',
    paste: '붙여넣기',
    result: '결과',
    error: '오류',
    loading: '로딩 중...',
    placeholder: '여기에 텍스트 입력...',
    inputPlaceholder: '여기에 텍스트 입력...',
    outputPlaceholder: '결과가 여기에 표시됩니다...',
  },
  es: {
    input: 'Entrada',
    output: 'Salida',
    copy: 'Copiar',
    copied: '¡Copiado!',
    clear: 'Limpiar',
    generate: 'Generar',
    convert: 'Convertir',
    format: 'Formatear',
    download: 'Descargar',
    upload: 'Subir',
    paste: 'Pegar',
    result: 'Resultado',
    error: 'Error',
    loading: 'Cargando...',
    placeholder: 'Ingrese texto aquí...',
    inputPlaceholder: 'Ingrese texto aquí...',
    outputPlaceholder: 'El resultado aparecerá aquí...',
  },
  pt: {
    input: 'Entrada',
    output: 'Saída',
    copy: 'Copiar',
    copied: 'Copiado!',
    clear: 'Limpar',
    generate: 'Gerar',
    convert: 'Converter',
    format: 'Formatar',
    download: 'Baixar',
    upload: 'Enviar',
    paste: 'Colar',
    result: 'Resultado',
    error: 'Erro',
    loading: 'Carregando...',
    placeholder: 'Digite o texto aqui...',
    inputPlaceholder: 'Digite o texto aqui...',
    outputPlaceholder: 'O resultado aparecerá aqui...',
  },
  fr: {
    input: 'Entrée',
    output: 'Sortie',
    copy: 'Copier',
    copied: 'Copié!',
    clear: 'Effacer',
    generate: 'Générer',
    convert: 'Convertir',
    format: 'Formater',
    download: 'Télécharger',
    upload: 'Téléverser',
    paste: 'Coller',
    result: 'Résultat',
    error: 'Erreur',
    loading: 'Chargement...',
    placeholder: 'Entrez le texte ici...',
    inputPlaceholder: 'Entrez le texte ici...',
    outputPlaceholder: 'Le résultat apparaîtra ici...',
  },
  de: {
    input: 'Eingabe',
    output: 'Ausgabe',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    clear: 'Löschen',
    generate: 'Generieren',
    convert: 'Konvertieren',
    format: 'Formatieren',
    download: 'Herunterladen',
    upload: 'Hochladen',
    paste: 'Einfügen',
    result: 'Ergebnis',
    error: 'Fehler',
    loading: 'Laden...',
    placeholder: 'Text hier eingeben...',
    inputPlaceholder: 'Text hier eingeben...',
    outputPlaceholder: 'Das Ergebnis wird hier angezeigt...',
  },
  ru: {
    input: 'Ввод',
    output: 'Вывод',
    copy: 'Копировать',
    copied: 'Скопировано!',
    clear: 'Очистить',
    generate: 'Генерировать',
    convert: 'Конвертировать',
    format: 'Форматировать',
    download: 'Скачать',
    upload: 'Загрузить',
    paste: 'Вставить',
    result: 'Результат',
    error: 'Ошибка',
    loading: 'Загрузка...',
    placeholder: 'Введите текст здесь...',
    inputPlaceholder: 'Введите текст здесь...',
    outputPlaceholder: 'Результат появится здесь...',
  },
  ar: {
    input: 'إدخال',
    output: 'إخراج',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    clear: 'مسح',
    generate: 'توليد',
    convert: 'تحويل',
    format: 'تنسيق',
    download: 'تحميل',
    upload: 'رفع',
    paste: 'لصق',
    result: 'نتيجة',
    error: 'خطأ',
    loading: 'جاري التحميل...',
    placeholder: 'أدخل النص هنا...',
    inputPlaceholder: 'أدخل النص هنا...',
    outputPlaceholder: 'ستظهر النتيجة هنا...',
  },
};

/**
 * 生成翻译键
 */
export function generateTranslation(
  key: string,
  locale: string,
  context?: {
    toolSlug?: string;
    similarTools?: string[];
    keyContext?: string;
  }
): TranslationTemplate | null {
  // 1. 检查是否是通用 UI 键
  const commonTranslation = COMMON_UI_TRANSLATIONS[locale]?.[key];
  if (commonTranslation) {
    return {
      key,
      value: commonTranslation,
      category: 'ui',
      confidence: 1.0,
    };
  }

  // 2. 处理嵌套键
  if (key.includes('.')) {
    const parts = key.split('.');
    const lastPart = parts[parts.length - 1];
    
    // 检查最后一部分是否是通用键
    const nestedCommon = COMMON_UI_TRANSLATIONS[locale]?.[lastPart];
    if (nestedCommon) {
      return {
        key,
        value: nestedCommon,
        category: 'ui',
        confidence: 0.9,
      };
    }
  }

  // 3. 基于键名生成翻译
  const generated = generateFromKeyName(key, locale);
  if (generated) {
    return generated;
  }

  // 4. 查找相似工具的翻译
  if (context?.similarTools && context.similarTools.length > 0) {
    const similar = findSimilarTranslation(key, locale, context.similarTools);
    if (similar) {
      return similar;
    }
  }

  // 5. 使用英文作为 fallback
  return {
    key,
    value: key,
    category: 'label',
    confidence: 0.3,
  };
}

/**
 * 基于键名生成翻译
 */
function generateFromKeyName(key: string, locale: string): TranslationTemplate | null {
  // 移除嵌套路径，只处理最后一部分
  const simplifiedKey = key.includes('.') ? key.split('.').pop()! : key;
  
  // 转换驼峰命名或下划线命名为单词
  const words = simplifiedKey
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ');

  // 根据语言生成翻译
  const translations: Record<string, (words: string[]) => string> = {
    en: (w) => w.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    zh: (w) => {
      // 简单的英文到中文映射
      const map: Record<string, string> = {
        title: '标题',
        name: '名称',
        description: '描述',
        settings: '设置',
        options: '选项',
        theme: '主题',
        color: '颜色',
        size: '大小',
        width: '宽度',
        height: '高度',
        data: '数据',
        chart: '图表',
        table: '表格',
        list: '列表',
        item: '项目',
        row: '行',
        column: '列',
        value: '值',
        key: '键',
        type: '类型',
        format: '格式',
        style: '样式',
        preview: '预览',
        editor: '编辑器',
        viewer: '查看器',
        default: '默认',
        custom: '自定义',
        sample: '示例',
        example: '示例',
        demo: '演示',
      };
      return w.map(word => map[word] || word).join('');
    },
  };

  const translator = translations[locale];
  if (translator) {
    return {
      key,
      value: translator(words),
      category: 'label',
      confidence: 0.7,
    };
  }

  return null;
}

/**
 * 从相似工具查找翻译
 */
function findSimilarTranslation(
  key: string,
  locale: string,
  similarTools: string[]
): TranslationTemplate | null {
  try {
    const translationPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
    const translations = JSON.parse(fs.readFileSync(translationPath, 'utf-8'));

    for (const toolSlug of similarTools) {
      const toolTranslations = translations.tools?.[toolSlug];
      if (!toolTranslations) continue;

      // 检查是否有相同的键
      const value = getNestedValue(toolTranslations, key);
      if (value && typeof value === 'string') {
        return {
          key,
          value,
          category: 'label',
          confidence: 0.8,
        };
      }
    }
  } catch (error) {
    // 忽略错误
  }

  return null;
}

/**
 * 获取嵌套值
 */
function getNestedValue(obj: any, keyPath: string): any {
  const parts = keyPath.split('.');
  let current = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * 批量生成翻译
 */
export function generateTranslations(
  keys: string[],
  locale: string,
  context?: {
    toolSlug?: string;
    similarTools?: string[];
  }
): TranslationTemplate[] {
  return keys
    .map(key => generateTranslation(key, locale, context))
    .filter((t): t is TranslationTemplate => t !== null);
}

/**
 * 生成所有语言的翻译
 */
export function generateAllLocales(
  keys: string[],
  context?: {
    toolSlug?: string;
    similarTools?: string[];
  }
): Record<string, TranslationTemplate[]> {
  const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
  const result: Record<string, TranslationTemplate[]> = {};

  for (const locale of locales) {
    result[locale] = generateTranslations(keys, locale, context);
  }

  return result;
}

/**
 * 评估翻译质量
 */
export function evaluateTranslationQuality(
  templates: TranslationTemplate[]
): {
  averageConfidence: number;
  highQuality: number;
  mediumQuality: number;
  lowQuality: number;
} {
  const total = templates.length;
  const avgConfidence = templates.reduce((sum, t) => sum + t.confidence, 0) / total;

  const highQuality = templates.filter(t => t.confidence >= 0.8).length;
  const mediumQuality = templates.filter(t => t.confidence >= 0.5 && t.confidence < 0.8).length;
  const lowQuality = templates.filter(t => t.confidence < 0.5).length;

  return {
    averageConfidence: avgConfidence,
    highQuality,
    mediumQuality,
    lowQuality,
  };
}

/**
 * 生成翻译报告
 */
export function generateTranslationReport(
  allTranslations: Record<string, TranslationTemplate[]>
): string {
  let report = '# 翻译生成报告\n\n';

  for (const [locale, templates] of Object.entries(allTranslations)) {
    const quality = evaluateTranslationQuality(templates);

    report += `## ${locale.toUpperCase()}\n\n`;
    report += `- 总数: ${templates.length}\n`;
    report += `- 平均置信度: ${(quality.averageConfidence * 100).toFixed(1)}%\n`;
    report += `- 高质量 (≥80%): ${quality.highQuality}\n`;
    report += `- 中等质量 (50-80%): ${quality.mediumQuality}\n`;
    report += `- 低质量 (<50%): ${quality.lowQuality}\n\n`;

    // 显示低质量的翻译
    const lowQualityTemplates = templates.filter(t => t.confidence < 0.5);
    if (lowQualityTemplates.length > 0) {
      report += '**需要人工审核的翻译:**\n';
      lowQualityTemplates.forEach(t => {
        report += `- ${t.key}: "${t.value}" (置信度: ${(t.confidence * 100).toFixed(0)}%)\n`;
      });
      report += '\n';
    }
  }

  return report;
}

// CLI 支持
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: tsx translation-generator.ts <key> <locale>');
    console.error('Example: tsx translation-generator.ts input zh');
    process.exit(1);
  }

  const key = args[0];
  const locale = args[1];

  console.log(`🔍 生成翻译: ${key} (${locale})\n`);

  const template = generateTranslation(key, locale);

  if (template) {
    console.log(`键: ${template.key}`);
    console.log(`值: ${template.value}`);
    console.log(`类别: ${template.category}`);
    console.log(`置信度: ${(template.confidence * 100).toFixed(0)}%`);
  } else {
    console.log('无法生成翻译');
  }
}
