import { describe, it, expect } from 'vitest';
import {
  generateLinkedinHeadlines,
  generateLinkedinSummary,
  type LinkedinHeadlineInput,
  type LinkedinSummaryInput,
} from './linkedin-generator-helper';

describe('LinkedIn Generator Helper', () => {
  describe('generateLinkedinHeadlines', () => {
    it('generates headlines in English with professional tone', () => {
      const input: LinkedinHeadlineInput = {
        jobTitle: 'Software Engineer',
        keySkills: ['TypeScript', 'Svelte', 'Node.js'],
        experienceYears: 5,
        valueProp: 'Building scalable web applications',
        tone: 'professional',
        locale: 'en',
      };

      const headlines = generateLinkedinHeadlines(input);
      expect(headlines.length).toBeGreaterThanOrEqual(3);
      
      // Classic
      expect(headlines[0]).toContain('Software Engineer');
      expect(headlines[0]).toContain('TypeScript');
      expect(headlines[0]).toContain('5 Years');

      // Value-Driven
      expect(headlines[1]).toContain('Building scalable web applications');

      // Creative/Minimalist
      expect(headlines[2]).toContain('Software Engineer');
    });

    it('generates headlines in Chinese with creative tone', () => {
      const input: LinkedinHeadlineInput = {
        jobTitle: '产品经理',
        keySkills: 'Axure, PRD, 数据分析',
        experienceYears: 3,
        valueProp: '用数据驱动产品持续增长',
        tone: 'creative',
        locale: 'zh',
      };

      const headlines = generateLinkedinHeadlines(input);
      expect(headlines.length).toBeGreaterThanOrEqual(3);

      expect(headlines[0]).toContain('产品经理');
      expect(headlines[0]).toContain('Axure');
      expect(headlines[0]).toContain('3年');
      
      expect(headlines[1]).toContain('用数据驱动产品持续增长');
    });
  });

  describe('generateLinkedinSummary', () => {
    it('generates professional summary in English', () => {
      const input: LinkedinSummaryInput = {
        jobTitle: 'Product Manager',
        keySkills: ['Agile', 'Scrum', 'Roadmapping'],
        experienceYears: 6,
        valueProp: 'transforming complex ideas into user-loved products',
        tone: 'professional',
        locale: 'en',
      };

      const summary = generateLinkedinSummary(input);
      expect(summary).toContain('Product Manager');
      expect(summary).toContain('Agile');
      expect(summary).toContain('6 years');
      expect(summary).toContain('transforming complex ideas into user-loved products');
    });

    it('generates confident summary in Chinese', () => {
      const input: LinkedinSummaryInput = {
        jobTitle: '前端架构师',
        keySkills: 'React, 微前端, 性能优化',
        experienceYears: 8,
        valueProp: '主导大型复杂系统重构与架构升级',
        tone: 'confident',
        locale: 'zh',
      };

      const summary = generateLinkedinSummary(input);
      expect(summary).toContain('前端架构师');
      expect(summary).toContain('React');
      expect(summary).toContain('8 年');
      expect(summary).toContain('主导大型复杂系统重构与架构升级');
    });
  });
});
