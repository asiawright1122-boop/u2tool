/**
 * 结构化数据验证模块
 * 验证JSON-LD结构化数据的有效性
 * 支持 Schema.org 类型验证
 */

// 结构化数据验证结果接口
export interface StructuredDataValidationResult {
  isValid: boolean;
  errors: SchemaError[];
  warnings: SchemaWarning[];
  schemaTypes: string[];
}

// Schema 错误接口
export interface SchemaError {
  type: string;
  field: string;
  message: string;
  expected?: string;
  actual?: string;
}

// Schema 警告接口
export interface SchemaWarning {
  type: string;
  field: string;
  message: string;
  suggestion?: string;
}

// 支持的 Schema.org 类型
export const SUPPORTED_SCHEMA_TYPES = [
  'WebSite',
  'SoftwareApplication',
  'BreadcrumbList',
  'Organization',
  'FAQPage',
  'ItemList',
  'CollectionPage',
  'HowTo',
  'WebPage',
] as const;

export type SupportedSchemaType = typeof SUPPORTED_SCHEMA_TYPES[number];

// 每种类型的必需属性
const REQUIRED_PROPERTIES: Record<string, string[]> = {
  WebSite: ['name', 'url'],
  SoftwareApplication: ['name', 'applicationCategory', 'operatingSystem'],
  BreadcrumbList: ['itemListElement'],
  Organization: ['name', 'url'],
  FAQPage: ['mainEntity'],
  ItemList: ['itemListElement'],
  CollectionPage: ['name', 'url'],
  HowTo: ['name', 'step'],
  WebPage: ['name', 'url'],
};

// 推荐属性
const RECOMMENDED_PROPERTIES: Record<string, string[]> = {
  WebSite: ['potentialAction'],
  SoftwareApplication: ['description', 'offers', 'url'],
  BreadcrumbList: [],
  Organization: ['logo', 'sameAs'],
  FAQPage: [],
  ItemList: [],
  CollectionPage: ['description', 'mainEntity'],
  HowTo: ['description'],
  WebPage: ['description'],
};

/**
 * 验证 JSON-LD 数据
 * @param jsonLd - JSON-LD 对象或数组
 * @returns 验证结果
 */
export function validateJsonLd(
  jsonLd: unknown
): StructuredDataValidationResult {
  const errors: SchemaError[] = [];
  const warnings: SchemaWarning[] = [];
  const schemaTypes: string[] = [];

  // 处理数组情况
  const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

  for (const item of items) {
    if (!item || typeof item !== 'object') {
      errors.push({
        type: 'unknown',
        field: '@type',
        message: 'Invalid JSON-LD: must be an object',
      });
      continue;
    }

    const data = item as Record<string, unknown>;

    // 验证 @context
    if (!data['@context']) {
      errors.push({
        type: 'unknown',
        field: '@context',
        message: '@context is required',
        expected: 'https://schema.org',
      });
    } else if (data['@context'] !== 'https://schema.org') {
      warnings.push({
        type: 'unknown',
        field: '@context',
        message: 'Non-standard @context value',
        suggestion: 'Use "https://schema.org" for best compatibility',
      });
    }

    // 验证 @type
    if (!data['@type']) {
      errors.push({
        type: 'unknown',
        field: '@type',
        message: '@type is required',
      });
      continue;
    }

    const schemaType = data['@type'] as string;
    schemaTypes.push(schemaType);

    // 验证特定类型
    const typeResult = validateSchemaType(data, schemaType);
    errors.push(...typeResult.errors);
    warnings.push(...typeResult.warnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    schemaTypes,
  };
}

/**
 * 验证特定 Schema 类型
 * @param data - JSON-LD 数据对象
 * @param expectedType - 期望的 Schema 类型
 * @returns 验证结果
 */
export function validateSchemaType(
  data: Record<string, unknown>,
  expectedType: string
): StructuredDataValidationResult {
  const errors: SchemaError[] = [];
  const warnings: SchemaWarning[] = [];
  const schemaTypes: string[] = [expectedType];

  // 检查是否是支持的类型
  if (!SUPPORTED_SCHEMA_TYPES.includes(expectedType as SupportedSchemaType)) {
    warnings.push({
      type: expectedType,
      field: '@type',
      message: `Schema type "${expectedType}" is not in the commonly validated types`,
      suggestion: 'This type may still be valid, but validation is limited',
    });
    return { isValid: true, errors, warnings, schemaTypes };
  }

  // 验证必需属性
  const requiredProps = REQUIRED_PROPERTIES[expectedType] || [];
  for (const prop of requiredProps) {
    if (data[prop] === undefined || data[prop] === null) {
      errors.push({
        type: expectedType,
        field: prop,
        message: `Required property "${prop}" is missing`,
      });
    }
  }

  // 检查推荐属性
  const recommendedProps = RECOMMENDED_PROPERTIES[expectedType] || [];
  for (const prop of recommendedProps) {
    if (data[prop] === undefined || data[prop] === null) {
      warnings.push({
        type: expectedType,
        field: prop,
        message: `Recommended property "${prop}" is missing`,
        suggestion: `Consider adding "${prop}" for better SEO`,
      });
    }
  }

  // 类型特定验证
  switch (expectedType) {
    case 'BreadcrumbList':
      validateBreadcrumbList(data, errors, warnings);
      break;
    case 'FAQPage':
      validateFAQPage(data, errors, warnings);
      break;
    case 'SoftwareApplication':
      validateSoftwareApplication(data, errors, warnings);
      break;
    case 'ItemList':
      validateItemList(data, errors, warnings);
      break;
    case 'HowTo':
      validateHowTo(data, errors, warnings);
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    schemaTypes,
  };
}

/**
 * 验证 BreadcrumbList
 */
function validateBreadcrumbList(
  data: Record<string, unknown>,
  errors: SchemaError[],
  warnings: SchemaWarning[]
): void {
  const items = data.itemListElement as unknown[];
  
  if (!Array.isArray(items)) {
    errors.push({
      type: 'BreadcrumbList',
      field: 'itemListElement',
      message: 'itemListElement must be an array',
    });
    return;
  }

  if (items.length === 0) {
    warnings.push({
      type: 'BreadcrumbList',
      field: 'itemListElement',
      message: 'BreadcrumbList is empty',
      suggestion: 'Add at least one breadcrumb item',
    });
    return;
  }

  // 验证每个项目
  for (let i = 0; i < items.length; i++) {
    const item = items[i] as Record<string, unknown>;
    
    if (!item || typeof item !== 'object') {
      errors.push({
        type: 'BreadcrumbList',
        field: `itemListElement[${i}]`,
        message: 'Invalid breadcrumb item',
      });
      continue;
    }

    if (item['@type'] !== 'ListItem') {
      errors.push({
        type: 'BreadcrumbList',
        field: `itemListElement[${i}].@type`,
        message: 'Breadcrumb item must have @type "ListItem"',
        expected: 'ListItem',
        actual: String(item['@type']),
      });
    }

    if (typeof item.position !== 'number') {
      errors.push({
        type: 'BreadcrumbList',
        field: `itemListElement[${i}].position`,
        message: 'Position must be a number',
      });
    } else if (item.position !== i + 1) {
      warnings.push({
        type: 'BreadcrumbList',
        field: `itemListElement[${i}].position`,
        message: 'Position should be sequential starting from 1',
        suggestion: `Expected ${i + 1}, got ${item.position}`,
      });
    }

    if (!item.name) {
      errors.push({
        type: 'BreadcrumbList',
        field: `itemListElement[${i}].name`,
        message: 'Breadcrumb item must have a name',
      });
    }

    // 最后一项不需要 item URL
    if (i < items.length - 1 && !item.item) {
      warnings.push({
        type: 'BreadcrumbList',
        field: `itemListElement[${i}].item`,
        message: 'Non-final breadcrumb item should have an item URL',
      });
    }
  }
}

/**
 * 验证 FAQPage
 */
function validateFAQPage(
  data: Record<string, unknown>,
  errors: SchemaError[],
  warnings: SchemaWarning[]
): void {
  const mainEntity = data.mainEntity as unknown[];
  
  if (!Array.isArray(mainEntity)) {
    errors.push({
      type: 'FAQPage',
      field: 'mainEntity',
      message: 'mainEntity must be an array',
    });
    return;
  }

  if (mainEntity.length === 0) {
    warnings.push({
      type: 'FAQPage',
      field: 'mainEntity',
      message: 'FAQPage has no questions',
      suggestion: 'Add at least one FAQ item',
    });
    return;
  }

  // 验证每个 FAQ 项目
  for (let i = 0; i < mainEntity.length; i++) {
    const item = mainEntity[i] as Record<string, unknown>;
    
    if (!item || typeof item !== 'object') {
      errors.push({
        type: 'FAQPage',
        field: `mainEntity[${i}]`,
        message: 'Invalid FAQ item',
      });
      continue;
    }

    if (item['@type'] !== 'Question') {
      errors.push({
        type: 'FAQPage',
        field: `mainEntity[${i}].@type`,
        message: 'FAQ item must have @type "Question"',
        expected: 'Question',
        actual: String(item['@type']),
      });
    }

    if (!item.name) {
      errors.push({
        type: 'FAQPage',
        field: `mainEntity[${i}].name`,
        message: 'Question must have a name (the question text)',
      });
    }

    const answer = item.acceptedAnswer as Record<string, unknown>;
    if (!answer) {
      errors.push({
        type: 'FAQPage',
        field: `mainEntity[${i}].acceptedAnswer`,
        message: 'Question must have an acceptedAnswer',
      });
    } else if (answer['@type'] !== 'Answer') {
      errors.push({
        type: 'FAQPage',
        field: `mainEntity[${i}].acceptedAnswer.@type`,
        message: 'acceptedAnswer must have @type "Answer"',
      });
    } else if (!answer.text) {
      errors.push({
        type: 'FAQPage',
        field: `mainEntity[${i}].acceptedAnswer.text`,
        message: 'Answer must have text',
      });
    }
  }
}

/**
 * 验证 SoftwareApplication
 */
function validateSoftwareApplication(
  data: Record<string, unknown>,
  errors: SchemaError[],
  _warnings: SchemaWarning[]
): void {
  // 验证 offers
  const offers = data.offers as Record<string, unknown>;
  if (offers) {
    if (offers['@type'] !== 'Offer') {
      errors.push({
        type: 'SoftwareApplication',
        field: 'offers.@type',
        message: 'offers must have @type "Offer"',
      });
    }
    if (offers.price === undefined) {
      _warnings.push({
        type: 'SoftwareApplication',
        field: 'offers.price',
        message: 'Offer should have a price',
        suggestion: 'Use "0" for free applications',
      });
    }
    if (!offers.priceCurrency) {
      _warnings.push({
        type: 'SoftwareApplication',
        field: 'offers.priceCurrency',
        message: 'Offer should have a priceCurrency',
        suggestion: 'Use "USD" or appropriate currency code',
      });
    }
  }

  // 验证 operatingSystem
  if (data.operatingSystem && typeof data.operatingSystem !== 'string') {
    errors.push({
      type: 'SoftwareApplication',
      field: 'operatingSystem',
      message: 'operatingSystem must be a string',
    });
  }
}

/**
 * 验证 ItemList
 */
function validateItemList(
  data: Record<string, unknown>,
  errors: SchemaError[],
  warnings: SchemaWarning[]
): void {
  const items = data.itemListElement as unknown[];
  
  if (!Array.isArray(items)) {
    errors.push({
      type: 'ItemList',
      field: 'itemListElement',
      message: 'itemListElement must be an array',
    });
    return;
  }

  // 验证每个项目
  for (let i = 0; i < items.length; i++) {
    const item = items[i] as Record<string, unknown>;
    
    if (!item || typeof item !== 'object') {
      errors.push({
        type: 'ItemList',
        field: `itemListElement[${i}]`,
        message: 'Invalid list item',
      });
      continue;
    }

    if (item['@type'] !== 'ListItem') {
      errors.push({
        type: 'ItemList',
        field: `itemListElement[${i}].@type`,
        message: 'List item must have @type "ListItem"',
      });
    }

    if (typeof item.position !== 'number') {
      warnings.push({
        type: 'ItemList',
        field: `itemListElement[${i}].position`,
        message: 'Position should be a number',
      });
    }
  }
}

/**
 * 验证 HowTo
 */
function validateHowTo(
  data: Record<string, unknown>,
  errors: SchemaError[],
  _warnings: SchemaWarning[]
): void {
  const steps = data.step as unknown[];
  
  if (!Array.isArray(steps)) {
    errors.push({
      type: 'HowTo',
      field: 'step',
      message: 'step must be an array',
    });
    return;
  }

  if (steps.length === 0) {
    errors.push({
      type: 'HowTo',
      field: 'step',
      message: 'HowTo must have at least one step',
    });
    return;
  }

  // 验证每个步骤
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i] as Record<string, unknown>;
    
    if (!step || typeof step !== 'object') {
      errors.push({
        type: 'HowTo',
        field: `step[${i}]`,
        message: 'Invalid step',
      });
      continue;
    }

    if (step['@type'] !== 'HowToStep') {
      errors.push({
        type: 'HowTo',
        field: `step[${i}].@type`,
        message: 'Step must have @type "HowToStep"',
      });
    }

    if (!step.name && !step.text) {
      errors.push({
        type: 'HowTo',
        field: `step[${i}]`,
        message: 'Step must have either name or text',
      });
    }
  }
}

/**
 * 批量验证多个 JSON-LD 数据
 * @param jsonLdArray - JSON-LD 数组
 * @returns 验证结果数组
 */
export function validateMultipleJsonLd(
  jsonLdArray: unknown[]
): StructuredDataValidationResult[] {
  return jsonLdArray.map(jsonLd => validateJsonLd(jsonLd));
}

/**
 * 检查工具页面是否包含必需的结构化数据类型
 * @param schemaTypes - 页面中的 Schema 类型数组
 * @returns 验证结果
 */
export function validateToolPageSchemaTypes(
  schemaTypes: string[]
): { isValid: boolean; missing: string[]; present: string[] } {
  const requiredTypes = ['SoftwareApplication', 'BreadcrumbList'];
  const recommendedTypes = ['FAQPage', 'HowTo'];
  
  const missing: string[] = [];
  const present: string[] = [];

  for (const type of requiredTypes) {
    if (schemaTypes.includes(type)) {
      present.push(type);
    } else {
      missing.push(type);
    }
  }

  // 检查推荐类型
  for (const type of recommendedTypes) {
    if (schemaTypes.includes(type)) {
      present.push(type);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    present,
  };
}
