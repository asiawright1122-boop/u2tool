'use client';

/**
 * 工具 FAQ 组件
 * 显示工具的常见问题解答，支持折叠/展开交互
 * 包含 FAQ JSON-LD 结构化数据用于 SEO
 */

import { useState } from 'react';
import { FAQItem, generateFAQJsonLd, faqJsonLdToString } from '@/lib/faq';

interface ToolFAQProps {
  /** FAQ 项目数组 */
  faqs: FAQItem[];
  /** 工具名称（用于标题） */
  toolName: string;
  /** 是否默认展开所有项目 */
  defaultExpanded?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * FAQ 项目组件（可折叠）
 */
function FAQItemComponent({
  faq,
  index,
  isExpanded,
  onToggle,
}: {
  faq: FAQItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      {/* 问题标题（h3 语义化） */}
      <h3 className="m-0">
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 text-left bg-gray-800/50 hover:bg-gray-800 transition-colors"
          aria-expanded={isExpanded}
          aria-controls={`faq-answer-${index}`}
        >
          <span className="font-medium text-white pr-4">{faq.question}</span>
          <svg
            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </h3>
      
      {/* 答案内容 */}
      <div
        id={`faq-answer-${index}`}
        className={`overflow-hidden transition-all duration-200 ${
          isExpanded ? 'max-h-96' : 'max-h-0'
        }`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
      >
        <div className="p-4 bg-gray-900/50 text-gray-300 leading-relaxed faq-answer">
          {faq.answer}
        </div>
      </div>
    </div>
  );
}

/**
 * 工具 FAQ 组件
 * 显示常见问题解答列表，支持折叠/展开
 */
export default function ToolFAQ({
  faqs,
  toolName,
  defaultExpanded = false,
  className = '',
}: ToolFAQProps) {
  // 管理每个 FAQ 项目的展开状态
  const [expandedItems, setExpandedItems] = useState<Set<number>>(
    defaultExpanded ? new Set(faqs.map((_, i) => i)) : new Set([0]) // 默认展开第一个
  );

  // 切换单个项目的展开状态
  const toggleItem = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // 展开/折叠所有
  const toggleAll = () => {
    if (expandedItems.size === faqs.length) {
      setExpandedItems(new Set());
    } else {
      setExpandedItems(new Set(faqs.map((_, i) => i)));
    }
  };

  // 生成 FAQ JSON-LD
  const faqJsonLd = generateFAQJsonLd(faqs);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className={`mt-8 ${className}`} aria-labelledby="faq-heading">
      {/* FAQ JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLdToString(faqJsonLd) }}
      />

      {/* 标题区域（h2 语义化） */}
      <div className="flex items-center justify-between mb-4">
        <h2 id="faq-heading" className="text-xl font-bold text-white">
          FAQ - {toolName}
        </h2>
        <button
          type="button"
          onClick={toggleAll}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {expandedItems.size === faqs.length ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* FAQ 列表 */}
      <div className="space-y-3" role="list">
        {faqs.map((faq, index) => (
          <FAQItemComponent
            key={index}
            faq={faq}
            index={index}
            isExpanded={expandedItems.has(index)}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * 服务端 FAQ 组件（用于 SSR，不含交互）
 * 用于搜索引擎爬虫可以直接看到所有内容
 */
export function ToolFAQStatic({
  faqs,
  toolName,
  className = '',
}: Omit<ToolFAQProps, 'defaultExpanded'>) {
  // 生成 FAQ JSON-LD
  const faqJsonLd = generateFAQJsonLd(faqs);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className={`mt-8 ${className}`} aria-labelledby="faq-heading-static">
      {/* FAQ JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLdToString(faqJsonLd) }}
      />

      {/* 标题（h2 语义化） */}
      <h2 id="faq-heading-static" className="text-xl font-bold text-white mb-4">
        FAQ - {toolName}
      </h2>

      {/* FAQ 列表（全部展开，便于 SEO） */}
      <div className="space-y-4" role="list">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
            <h3 className="p-4 bg-gray-800/50 font-medium text-white m-0">
              {faq.question}
            </h3>
            <div className="p-4 bg-gray-900/50 text-gray-300 leading-relaxed faq-answer">
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
