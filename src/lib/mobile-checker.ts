/**
 * 移动端优化检查模块
 * 检查页面的移动端优化状态
 * 包括触摸目标大小、字体大小、输入类型等
 */

// 移动端检查结果接口
export interface MobileCheckResult {
  isOptimized: boolean;
  touchTargetSize: CheckDetail;
  fontSize: CheckDetail;
  viewport: CheckDetail;
  inputTypes: CheckDetail;
  score: number; // 0-100
}

// 检查详情接口
export interface CheckDetail {
  passed: boolean;
  issues: string[];
  suggestions?: string[];
}

// 移动端优化配置
export const MOBILE_CONFIG = {
  // 最小触摸目标大小（像素）
  minTouchTargetSize: 44,
  // 最小基础字体大小（像素）
  minBaseFontSize: 16,
  // 推荐的输入类型映射
  recommendedInputTypes: {
    email: 'email',
    phone: 'tel',
    url: 'url',
    number: 'number',
    search: 'search',
    date: 'date',
    time: 'time',
  } as Record<string, string>,
};

// CSS 样式接口（用于静态分析）
export interface CSSStyles {
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  fontSize?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
}

// 元素信息接口（用于静态分析）
export interface ElementInfo {
  tagName: string;
  type?: string;
  name?: string;
  className?: string;
  styles?: CSSStyles;
  computedWidth?: number;
  computedHeight?: number;
}

/**
 * 检查触摸目标大小
 * @param element - 元素信息
 * @returns 检查结果
 */
export function checkTouchTargetSize(element: ElementInfo): CheckDetail {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  const minSize = MOBILE_CONFIG.minTouchTargetSize;
  
  // 检查计算后的尺寸
  if (element.computedWidth !== undefined && element.computedHeight !== undefined) {
    if (element.computedWidth < minSize) {
      issues.push(`Width (${element.computedWidth}px) is less than ${minSize}px`);
      suggestions.push(`Increase width to at least ${minSize}px`);
    }
    if (element.computedHeight < minSize) {
      issues.push(`Height (${element.computedHeight}px) is less than ${minSize}px`);
      suggestions.push(`Increase height to at least ${minSize}px`);
    }
  }
  
  // 检查 CSS 样式
  if (element.styles) {
    const width = parseCSSValue(element.styles.width || element.styles.minWidth);
    const height = parseCSSValue(element.styles.height || element.styles.minHeight);
    
    if (width !== null && width < minSize) {
      issues.push(`CSS width (${width}px) is less than ${minSize}px`);
    }
    if (height !== null && height < minSize) {
      issues.push(`CSS height (${height}px) is less than ${minSize}px`);
    }
    
    // 检查 padding 是否足够
    const paddingTop = parseCSSValue(element.styles.paddingTop || element.styles.padding);
    const paddingBottom = parseCSSValue(element.styles.paddingBottom || element.styles.padding);
    
    if (paddingTop !== null && paddingBottom !== null) {
      const totalVerticalPadding = paddingTop + paddingBottom;
      if (totalVerticalPadding < 12) {
        suggestions.push('Consider increasing vertical padding for better touch targets');
      }
    }
  }
  
  return {
    passed: issues.length === 0,
    issues,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * 检查字体大小
 * @param element - 元素信息
 * @returns 检查结果
 */
export function checkFontSize(element: ElementInfo): CheckDetail {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  const minSize = MOBILE_CONFIG.minBaseFontSize;
  
  if (element.styles?.fontSize) {
    const fontSize = parseCSSValue(element.styles.fontSize);
    
    if (fontSize !== null && fontSize < minSize) {
      issues.push(`Font size (${fontSize}px) is less than ${minSize}px`);
      suggestions.push(`Increase font size to at least ${minSize}px for better readability on mobile`);
    }
  }
  
  return {
    passed: issues.length === 0,
    issues,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * 检查输入类型
 * @param inputs - 输入元素数组
 * @returns 检查结果
 */
export function checkInputTypes(
  inputs: Array<{ type?: string; name?: string; placeholder?: string }>
): CheckDetail {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  for (const input of inputs) {
    const name = input.name?.toLowerCase() || '';
    const placeholder = input.placeholder?.toLowerCase() || '';
    const currentType = input.type || 'text';
    
    // 检查是否使用了正确的输入类型
    for (const [keyword, recommendedType] of Object.entries(MOBILE_CONFIG.recommendedInputTypes)) {
      if (
        (name.includes(keyword) || placeholder.includes(keyword)) &&
        currentType !== recommendedType &&
        currentType === 'text'
      ) {
        issues.push(
          `Input "${input.name || 'unnamed'}" appears to be for ${keyword} but uses type="${currentType}"`
        );
        suggestions.push(
          `Consider using type="${recommendedType}" for better mobile keyboard support`
        );
      }
    }
  }
  
  return {
    passed: issues.length === 0,
    issues,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * 检查视口配置
 * @param viewportContent - viewport meta 标签的 content 值
 * @returns 检查结果
 */
export function checkViewport(viewportContent: string | null): CheckDetail {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  if (!viewportContent) {
    issues.push('Viewport meta tag is missing');
    suggestions.push('Add <meta name="viewport" content="width=device-width, initial-scale=1">');
    return { passed: false, issues, suggestions };
  }
  
  const content = viewportContent.toLowerCase();
  
  // 检查必需的属性
  if (!content.includes('width=device-width')) {
    issues.push('Viewport should include width=device-width');
  }
  
  if (!content.includes('initial-scale')) {
    suggestions.push('Consider adding initial-scale=1 for consistent rendering');
  }
  
  // 检查是否禁用了缩放（不推荐）
  if (content.includes('user-scalable=no') || content.includes('maximum-scale=1')) {
    issues.push('Viewport disables user scaling, which is not recommended for accessibility');
    suggestions.push('Allow users to zoom by removing user-scalable=no and maximum-scale restrictions');
  }
  
  return {
    passed: issues.length === 0,
    issues,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * 解析 CSS 值为数字（像素）
 * @param value - CSS 值字符串
 * @returns 数字值或 null
 */
function parseCSSValue(value: string | undefined): number | null {
  if (!value) return null;
  
  // 处理 px 值
  if (value.endsWith('px')) {
    return parseFloat(value);
  }
  
  // 处理 rem 值（假设基础字体大小为 16px）
  if (value.endsWith('rem')) {
    return parseFloat(value) * 16;
  }
  
  // 处理 em 值（假设为 16px）
  if (value.endsWith('em')) {
    return parseFloat(value) * 16;
  }
  
  // 处理纯数字
  const num = parseFloat(value);
  if (!isNaN(num)) {
    return num;
  }
  
  return null;
}

/**
 * 运行完整的移动端优化检查
 * @param config - 检查配置
 * @returns 移动端检查结果
 */
export function runMobileCheck(config: {
  interactiveElements?: ElementInfo[];
  textElements?: ElementInfo[];
  inputs?: Array<{ type?: string; name?: string; placeholder?: string }>;
  viewportContent?: string | null;
}): MobileCheckResult {
  const results: MobileCheckResult = {
    isOptimized: true,
    touchTargetSize: { passed: true, issues: [] },
    fontSize: { passed: true, issues: [] },
    viewport: { passed: true, issues: [] },
    inputTypes: { passed: true, issues: [] },
    score: 100,
  };
  
  // 检查触摸目标
  if (config.interactiveElements && config.interactiveElements.length > 0) {
    const touchIssues: string[] = [];
    const touchSuggestions: string[] = [];
    
    for (const element of config.interactiveElements) {
      const check = checkTouchTargetSize(element);
      touchIssues.push(...check.issues);
      if (check.suggestions) {
        touchSuggestions.push(...check.suggestions);
      }
    }
    
    results.touchTargetSize = {
      passed: touchIssues.length === 0,
      issues: touchIssues,
      suggestions: touchSuggestions.length > 0 ? touchSuggestions : undefined,
    };
  }
  
  // 检查字体大小
  if (config.textElements && config.textElements.length > 0) {
    const fontIssues: string[] = [];
    const fontSuggestions: string[] = [];
    
    for (const element of config.textElements) {
      const check = checkFontSize(element);
      fontIssues.push(...check.issues);
      if (check.suggestions) {
        fontSuggestions.push(...check.suggestions);
      }
    }
    
    results.fontSize = {
      passed: fontIssues.length === 0,
      issues: fontIssues,
      suggestions: fontSuggestions.length > 0 ? fontSuggestions : undefined,
    };
  }
  
  // 检查视口
  if (config.viewportContent !== undefined) {
    results.viewport = checkViewport(config.viewportContent);
  }
  
  // 检查输入类型
  if (config.inputs && config.inputs.length > 0) {
    results.inputTypes = checkInputTypes(config.inputs);
  }
  
  // 计算总体分数
  const checks = [
    results.touchTargetSize,
    results.fontSize,
    results.viewport,
    results.inputTypes,
  ];
  
  const passedChecks = checks.filter(c => c.passed).length;
  results.score = Math.round((passedChecks / checks.length) * 100);
  results.isOptimized = results.score >= 75;
  
  return results;
}

/**
 * 验证 Tailwind CSS 类是否满足移动端要求
 * @param classes - CSS 类名字符串
 * @returns 检查结果
 */
export function validateTailwindClasses(classes: string): CheckDetail {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  const classList = classes.split(/\s+/);
  
  // 检查是否有响应式类
  const hasResponsiveClasses = classList.some(c => 
    c.startsWith('sm:') || c.startsWith('md:') || c.startsWith('lg:') || c.startsWith('xl:')
  );
  
  if (!hasResponsiveClasses) {
    suggestions.push('Consider adding responsive classes for better mobile support');
  }
  
  // 检查按钮/链接是否有足够的 padding
  const hasSufficientPadding = classList.some(c => 
    /^p-[3-9]$/.test(c) || /^p-1[0-9]$/.test(c) ||
    /^py-[2-9]$/.test(c) || /^px-[3-9]$/.test(c)
  );
  
  if (!hasSufficientPadding && classList.some(c => c.includes('btn') || c.includes('button'))) {
    suggestions.push('Consider adding more padding (p-3 or higher) for better touch targets');
  }
  
  // 检查文本大小
  const hasSmallText = classList.some(c => 
    c === 'text-xs' || c === 'text-sm'
  );
  
  if (hasSmallText) {
    suggestions.push('Small text (text-xs, text-sm) may be hard to read on mobile');
  }
  
  return {
    passed: issues.length === 0,
    issues,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * 生成移动端优化建议
 * @param result - 移动端检查结果
 * @returns 建议数组
 */
export function generateMobileSuggestions(result: MobileCheckResult): string[] {
  const suggestions: string[] = [];
  
  if (!result.touchTargetSize.passed) {
    suggestions.push('增加交互元素的尺寸至少为 44x44 像素');
  }
  
  if (!result.fontSize.passed) {
    suggestions.push('将基础字体大小设置为至少 16px');
  }
  
  if (!result.viewport.passed) {
    suggestions.push('添加正确的 viewport meta 标签');
  }
  
  if (!result.inputTypes.passed) {
    suggestions.push('为表单输入使用正确的 input type 以优化移动键盘');
  }
  
  if (result.score < 100) {
    suggestions.push(`当前移动端优化分数: ${result.score}/100`);
  }
  
  return suggestions;
}
