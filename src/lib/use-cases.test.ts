/**
 * 使用场景模块属性测试
 * Property 7: Use Case Content Quality
 * @see Requirements 7.2, 7.3, 7.5
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  getUseCasesForTool,
  generateUseCaseFAQs,
  getUseCasesForPersona,
  getPersonaDescription,
  getPersonasForTool,
  generateUseCaseJsonLd,
  validateUseCase,
  type UseCase,
  type UserPersona,
} from './use-cases';
import { tools } from '@/config/tools';

// 有效的工具 slugs
const validToolSlugs = tools.map(t => t.slug);

// 有效的角色
const validPersonas: UserPersona[] = ['developer', 'designer', 'marketer', 'general'];

describe('Use Cases - Property Tests', () => {
  describe('Property 7.1: Use Case Retrieval', () => {
    it('should return use cases for valid tools', () => {
      // 测试部分工具
      const testTools = validToolSlugs.slice(0, 30);
      
      for (const slug of testTools) {
        const useCases = getUseCasesForTool(slug);
        expect(Array.isArray(useCases)).toBe(true);
        
        // 每个使用场景应该包含当前工具
        for (const uc of useCases) {
          expect(uc.tools).toContain(slug);
        }
      }
    });

    it('should return empty array for invalid tools', () => {
      const invalidSlugs = ['invalid-tool', 'non-existent', 'fake-tool'];
      
      for (const slug of invalidSlugs) {
        const useCases = getUseCasesForTool(slug);
        expect(useCases).toHaveLength(0);
      }
    });
  });

  describe('Property 7.2: Use Case Structure', () => {
    it('should have valid structure for all use cases', () => {
      for (const slug of validToolSlugs.slice(0, 20)) {
        const useCases = getUseCasesForTool(slug);
        
        for (const uc of useCases) {
          expect(uc).toHaveProperty('id');
          expect(uc).toHaveProperty('title');
          expect(uc).toHaveProperty('description');
          expect(uc).toHaveProperty('persona');
          expect(uc).toHaveProperty('tools');
          expect(uc).toHaveProperty('steps');
          expect(uc).toHaveProperty('examples');
          
          // 验证步骤结构
          for (const step of uc.steps) {
            expect(step).toHaveProperty('order');
            expect(step).toHaveProperty('title');
            expect(step).toHaveProperty('description');
          }
        }
      }
    });

    it('should have steps in correct order', () => {
      for (const slug of validToolSlugs.slice(0, 20)) {
        const useCases = getUseCasesForTool(slug);
        
        for (const uc of useCases) {
          const orders = uc.steps.map(s => s.order);
          const sorted = [...orders].sort((a, b) => a - b);
          expect(orders).toEqual(sorted);
        }
      }
    });
  });

  describe('Property 7.3: FAQ Generation', () => {
    it('should generate FAQs for use cases', () => {
      for (const slug of validToolSlugs.slice(0, 10)) {
        const useCases = getUseCasesForTool(slug);
        
        for (const uc of useCases) {
          const faqs = generateUseCaseFAQs(uc);
          
          expect(faqs.length).toBeGreaterThan(0);
          
          for (const faq of faqs) {
            expect(faq).toHaveProperty('question');
            expect(faq).toHaveProperty('answer');
            expect(faq).toHaveProperty('useCase');
            expect(faq.question.length).toBeGreaterThan(0);
            expect(faq.answer.length).toBeGreaterThan(0);
          }
        }
      }
    });

    it('should generate FAQs in different locales', () => {
      const locales = ['en', 'zh'];
      const testTool = validToolSlugs[0];
      const useCases = getUseCasesForTool(testTool);
      
      if (useCases.length > 0) {
        for (const locale of locales) {
          const faqs = generateUseCaseFAQs(useCases[0], locale);
          expect(faqs.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Property 7.4: Persona Handling', () => {
    it('should return use cases for all personas', () => {
      for (const persona of validPersonas) {
        const useCases = getUseCasesForPersona(persona);
        expect(Array.isArray(useCases)).toBe(true);
        
        // 每个使用场景应该匹配请求的角色
        for (const uc of useCases) {
          expect(uc.persona).toBe(persona);
        }
      }
    });

    it('should return persona descriptions for all locales', () => {
      const locales = ['en', 'zh'];
      
      for (const persona of validPersonas) {
        for (const locale of locales) {
          const description = getPersonaDescription(persona, locale);
          expect(description).toBeTruthy();
          expect(typeof description).toBe('string');
        }
      }
    });

    it('should return valid personas for tools', () => {
      for (const slug of validToolSlugs.slice(0, 20)) {
        const personas = getPersonasForTool(slug);
        
        expect(personas.length).toBeGreaterThan(0);
        
        for (const persona of personas) {
          expect(validPersonas).toContain(persona);
        }
      }
    });
  });

  describe('Property 7.5: JSON-LD Generation', () => {
    it('should generate valid HowTo JSON-LD', () => {
      for (const slug of validToolSlugs.slice(0, 10)) {
        const useCases = getUseCasesForTool(slug);
        
        for (const uc of useCases) {
          const jsonLd = generateUseCaseJsonLd(uc) as {
            '@context': string;
            '@type': string;
            name: string;
            step: { '@type': string; position: number }[];
          };
          
          expect(jsonLd['@context']).toBe('https://schema.org');
          expect(jsonLd['@type']).toBe('HowTo');
          expect(jsonLd.name).toBe(uc.title);
          expect(jsonLd.step.length).toBe(uc.steps.length);
          
          // 验证步骤结构
          for (let i = 0; i < jsonLd.step.length; i++) {
            expect(jsonLd.step[i]['@type']).toBe('HowToStep');
            expect(jsonLd.step[i].position).toBe(uc.steps[i].order);
          }
        }
      }
    });
  });

  describe('Property 7.6: Use Case Validation', () => {
    it('should validate correct use cases', () => {
      for (const slug of validToolSlugs.slice(0, 10)) {
        const useCases = getUseCasesForTool(slug);
        
        for (const uc of useCases) {
          const result = validateUseCase(uc);
          expect(result.valid).toBe(true);
          expect(result.errors).toHaveLength(0);
        }
      }
    });

    it('should detect invalid use cases', () => {
      const invalidUseCase: UseCase = {
        id: '',
        title: '',
        description: '',
        persona: 'developer',
        tools: [],
        steps: [],
        examples: [],
      };
      
      const result = validateUseCase(invalidUseCase);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect incorrect step order', () => {
      const badOrderUseCase: UseCase = {
        id: 'test',
        title: 'Test',
        description: 'Test description',
        persona: 'developer',
        tools: ['test-tool'],
        steps: [
          { order: 1, title: 'Step 1', description: 'First' },
          { order: 3, title: 'Step 3', description: 'Third' }, // 跳过了 2
        ],
        examples: [],
      };
      
      const result = validateUseCase(badOrderUseCase);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('顺序'))).toBe(true);
    });
  });
});

describe('Use Cases - Unit Tests', () => {
  describe('getUseCasesForTool', () => {
    it('should work with different locales', () => {
      const locales = ['en', 'zh', 'ja'];
      const testTool = 'json-formatter';
      
      for (const locale of locales) {
        const useCases = getUseCasesForTool(testTool, locale);
        expect(Array.isArray(useCases)).toBe(true);
      }
    });
  });

  describe('getPersonasForTool', () => {
    it('should return general for unknown tools', () => {
      const personas = getPersonasForTool('unknown-tool');
      expect(personas).toContain('general');
    });
  });

  describe('generateUseCaseFAQs', () => {
    it('should include how-to question', () => {
      const useCase: UseCase = {
        id: 'test',
        title: 'Test Use Case',
        description: 'A test use case',
        persona: 'developer',
        tools: ['test-tool'],
        steps: [
          { order: 1, title: 'Step 1', description: 'Do something' },
        ],
        examples: ['Example 1'],
      };
      
      const faqs = generateUseCaseFAQs(useCase, 'en');
      
      const howToFaq = faqs.find(f => f.question.toLowerCase().includes('how'));
      expect(howToFaq).toBeDefined();
    });

    it('should include what-is question', () => {
      const useCase: UseCase = {
        id: 'test',
        title: 'Test Use Case',
        description: 'A test use case',
        persona: 'developer',
        tools: ['test-tool'],
        steps: [
          { order: 1, title: 'Step 1', description: 'Do something' },
        ],
        examples: [],
      };
      
      const faqs = generateUseCaseFAQs(useCase, 'en');
      
      const whatIsFaq = faqs.find(f => f.question.toLowerCase().includes('what'));
      expect(whatIsFaq).toBeDefined();
    });
  });
});
