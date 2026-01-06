/**
 * 内容深度属性测试
 * Property 6: Content Depth Requirements
 * Validates: Requirements 9.1, 9.2, 9.3, 9.5
 */

import { describe, it, expect } from 'vitest';
import {
  countWords,
  validateDescription,
  validateDetailedDescription,
  validateUsageSteps,
  validateExamples,
  validateFAQs,
  validateToolContentDepth,
  calculateContentDepthScore,
  getContentDepthRecommendations,
  CONTENT_DEPTH_CONFIG,
} from './content-depth';

describe('Content Depth Module', () => {
  describe('countWords', () => {
    it('should count English words correctly', () => {
      expect(countWords('Hello world')).toBe(2);
      expect(countWords('This is a test sentence')).toBe(5);
    });

    it('should count Chinese characters correctly', () => {
      expect(countWords('你好世界')).toBe(4);
      expect(countWords('这是一个测试')).toBe(6);
    });

    it('should count mixed content correctly', () => {
      expect(countWords('Hello 世界')).toBe(3); // 1 English + 2 Chinese
      expect(countWords('JSON 格式化工具')).toBe(6); // 1 English + 5 Chinese
    });

    it('should handle empty strings', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
    });

    it('should handle null/undefined', () => {
      expect(countWords(null as unknown as string)).toBe(0);
      expect(countWords(undefined as unknown as string)).toBe(0);
    });

    it('should strip HTML tags', () => {
      expect(countWords('<p>Hello world</p>')).toBe(2);
      expect(countWords('<strong>Test</strong> content')).toBe(2);
    });
  });

  describe('validateDescription', () => {
    it('should pass for descriptions meeting minimum word count', () => {
      const longDesc = 'This is a description that has enough words to meet the minimum requirement for SEO purposes and content quality standards.';
      const issues = validateDescription(longDesc, 10);
      expect(issues).toHaveLength(0);
    });

    it('should fail for short descriptions', () => {
      const issues = validateDescription('Short', 10);
      expect(issues).toHaveLength(1);
      expect(issues[0].severity).toBe('error');
    });

    it('should include current and required word counts', () => {
      const issues = validateDescription('Two words', 50);
      expect(issues[0].current).toBe(2);
      expect(issues[0].required).toBe(50);
    });
  });

  describe('validateDetailedDescription', () => {
    it('should fail for missing detailed description', () => {
      const issues = validateDetailedDescription('');
      expect(issues).toHaveLength(1);
      expect(issues[0].severity).toBe('error');
    });

    it('should warn for short detailed descriptions', () => {
      const shortDesc = 'This is a short description that does not meet the minimum.';
      const issues = validateDetailedDescription(shortDesc, 100);
      expect(issues.some(i => i.severity === 'warning')).toBe(true);
    });

    it('should pass for adequate detailed descriptions', () => {
      const longDesc = 'A'.repeat(200) + ' ' + 'word '.repeat(50);
      const issues = validateDetailedDescription(longDesc, 50);
      expect(issues).toHaveLength(0);
    });
  });

  describe('validateUsageSteps', () => {
    it('should fail for missing usage steps', () => {
      const issues = validateUsageSteps(undefined);
      expect(issues).toHaveLength(1);
      expect(issues[0].severity).toBe('error');
    });

    it('should warn for insufficient steps', () => {
      const issues = validateUsageSteps(['Step 1', 'Step 2'], 3);
      expect(issues.some(i => i.issue.includes('Not enough'))).toBe(true);
    });

    it('should pass for adequate steps', () => {
      const steps = [
        'Open the tool page',
        'Enter your data in the input field',
        'Click the convert button',
        'Copy the result',
      ];
      const issues = validateUsageSteps(steps, 3);
      const stepCountIssues = issues.filter(i => i.issue.includes('Not enough'));
      expect(stepCountIssues).toHaveLength(0);
    });

    it('should flag empty or short steps', () => {
      const steps = ['Good step with content', '', 'x'];
      const issues = validateUsageSteps(steps, 1);
      expect(issues.some(i => i.issue.includes('too short'))).toBe(true);
    });
  });

  describe('validateExamples', () => {
    it('should warn for missing examples', () => {
      const issues = validateExamples(undefined);
      expect(issues).toHaveLength(1);
      expect(issues[0].severity).toBe('warning');
    });

    it('should pass for adequate examples', () => {
      const examples = ['Example 1: Convert JSON to formatted output'];
      const issues = validateExamples(examples, 1);
      expect(issues).toHaveLength(0);
    });
  });

  describe('validateFAQs', () => {
    it('should warn for missing FAQs', () => {
      const issues = validateFAQs(undefined);
      expect(issues).toHaveLength(1);
      expect(issues[0].severity).toBe('warning');
    });

    it('should pass for adequate FAQs', () => {
      const faqs = [
        { question: 'What is this tool?', answer: 'This tool helps you format JSON data quickly and easily in your browser.' },
        { question: 'Is it free?', answer: 'Yes, this tool is completely free to use with no registration required.' },
        { question: 'Is my data safe?', answer: 'All processing happens in your browser. Your data never leaves your device.' },
      ];
      const issues = validateFAQs(faqs, 3);
      const faqCountIssues = issues.filter(i => i.issue.includes('Not enough'));
      expect(faqCountIssues).toHaveLength(0);
    });

    it('should flag short FAQ answers', () => {
      const faqs = [
        { question: 'What is this?', answer: 'A tool.' },
      ];
      const issues = validateFAQs(faqs, 1);
      expect(issues.some(i => i.issue.includes('too short'))).toBe(true);
    });
  });

  describe('validateToolContentDepth', () => {
    it('should return valid result for complete content', () => {
      const content = {
        description: 'This is a comprehensive description of the JSON formatter tool that helps developers format and validate JSON data quickly and easily online. It supports multiple formatting options including indentation levels, key sorting, and syntax highlighting. The tool provides instant results for all your JSON processing needs and works entirely in your browser.',
        detailedDescription: 'The JSON Formatter is a powerful online tool designed to help developers and data analysts work with JSON data more efficiently. It provides instant formatting, validation, and beautification of JSON strings. The tool supports large files and offers various formatting options including indentation levels and sorting keys. All processing happens locally in your browser, ensuring your data remains private and secure. Whether you are debugging API responses, validating configuration files, or simply making JSON more readable, this tool has you covered with its intuitive interface and powerful features.',
        usageSteps: [
          'Open the tool page and locate the input field',
          'Paste your JSON data into the input text area',
          'Select your preferred formatting options from the settings',
          'Click the Format button to process your data',
          'Copy the formatted result or download as a file',
        ],
        usageExamples: [
          'Format minified API responses for debugging',
          'Validate JSON configuration files',
        ],
        faqs: [
          { question: 'What is JSON?', answer: 'JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and write and easy for machines to parse.' },
          { question: 'Is this tool free?', answer: 'Yes, this JSON formatter is completely free to use with no registration or payment required. You can use it as many times as you need.' },
          { question: 'Is my data secure?', answer: 'Absolutely. All JSON processing happens entirely in your browser. Your data never leaves your device and is not sent to any server.' },
        ],
      };

      const result = validateToolContentDepth(content);
      expect(result.score).toBeGreaterThan(50);
      // 检查是否没有 error 级别的问题
      const errorIssues = result.issues.filter(i => i.severity === 'error');
      expect(errorIssues).toHaveLength(0);
    });

    it('should return invalid result for missing content', () => {
      const content = {
        description: 'Short',
      };

      const result = validateToolContentDepth(content);
      expect(result.isValid).toBe(false);
      expect(result.issues.some(i => i.severity === 'error')).toBe(true);
    });

    it('should calculate metrics correctly', () => {
      const content = {
        description: 'Test description with some words',
        detailedDescription: 'Detailed description here',
        usageSteps: ['Step 1', 'Step 2', 'Step 3'],
        usageExamples: ['Example 1'],
        faqs: [{ question: 'Q1', answer: 'A1' }],
      };

      const result = validateToolContentDepth(content);
      expect(result.metrics.usageStepsCount).toBe(3);
      expect(result.metrics.examplesCount).toBe(1);
      expect(result.metrics.faqCount).toBe(1);
    });
  });

  describe('calculateContentDepthScore', () => {
    it('should return 100 for perfect content', () => {
      const metrics = {
        descriptionWordCount: 100,
        detailedDescriptionWordCount: 300,
        usageStepsCount: 5,
        examplesCount: 3,
        faqCount: 5,
        totalWordCount: 500,
      };

      const score = calculateContentDepthScore(metrics);
      expect(score).toBe(100);
    });

    it('should return low score for minimal content', () => {
      const metrics = {
        descriptionWordCount: 10,
        detailedDescriptionWordCount: 20,
        usageStepsCount: 1,
        examplesCount: 0,
        faqCount: 0,
        totalWordCount: 30,
      };

      const score = calculateContentDepthScore(metrics);
      expect(score).toBeLessThan(50);
    });

    it('should return score between 0 and 100', () => {
      const testCases = [
        { descriptionWordCount: 0, detailedDescriptionWordCount: 0, usageStepsCount: 0, examplesCount: 0, faqCount: 0, totalWordCount: 0 },
        { descriptionWordCount: 50, detailedDescriptionWordCount: 100, usageStepsCount: 2, examplesCount: 1, faqCount: 2, totalWordCount: 200 },
        { descriptionWordCount: 1000, detailedDescriptionWordCount: 1000, usageStepsCount: 100, examplesCount: 100, faqCount: 100, totalWordCount: 5000 },
      ];

      testCases.forEach(metrics => {
        const score = calculateContentDepthScore(metrics);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('getContentDepthRecommendations', () => {
    it('should provide recommendations for low scores', () => {
      const result = {
        isValid: false,
        score: 30,
        issues: [],
        metrics: {
          descriptionWordCount: 10,
          detailedDescriptionWordCount: 20,
          usageStepsCount: 1,
          examplesCount: 0,
          faqCount: 0,
          totalWordCount: 30,
        },
      };

      const recommendations = getContentDepthRecommendations(result);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should not provide recommendations for perfect content', () => {
      const result = {
        isValid: true,
        score: 100,
        issues: [],
        metrics: {
          descriptionWordCount: 100,
          detailedDescriptionWordCount: 300,
          usageStepsCount: 5,
          examplesCount: 3,
          faqCount: 5,
          totalWordCount: 500,
        },
      };

      const recommendations = getContentDepthRecommendations(result);
      expect(recommendations.length).toBe(0);
    });
  });

  describe('CONTENT_DEPTH_CONFIG', () => {
    it('should have reasonable minimum word counts', () => {
      expect(CONTENT_DEPTH_CONFIG.minWordCount.description).toBeGreaterThan(0);
      expect(CONTENT_DEPTH_CONFIG.minWordCount.detailedDescription).toBeGreaterThan(CONTENT_DEPTH_CONFIG.minWordCount.description);
    });

    it('should have reasonable step limits', () => {
      expect(CONTENT_DEPTH_CONFIG.minUsageSteps).toBeGreaterThan(0);
      expect(CONTENT_DEPTH_CONFIG.maxUsageSteps).toBeGreaterThan(CONTENT_DEPTH_CONFIG.minUsageSteps);
    });

    it('should have reasonable FAQ limits', () => {
      expect(CONTENT_DEPTH_CONFIG.minFAQs).toBeGreaterThan(0);
      expect(CONTENT_DEPTH_CONFIG.maxFAQs).toBeGreaterThan(CONTENT_DEPTH_CONFIG.minFAQs);
    });
  });
});
