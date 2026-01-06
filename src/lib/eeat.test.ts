/**
 * E-E-A-T 模块测试
 * 测试专家信息、组织信息和信任信号功能
 */

import { describe, it, expect } from 'vitest';
import {
  ExpertInfo,
  OrganizationInfo,
  DEFAULT_EXPERT,
  DEFAULT_ORGANIZATION,
  generateExpertJsonLd,
  generateEnhancedOrganizationJsonLd,
  getToolAuthor,
  getOrganizationInfo,
  getTrustSignals,
  getTrustSignalTexts,
  validateExpertInfo,
  validateOrganizationInfo,
} from './eeat';

describe('E-E-A-T Module', () => {
  describe('generateExpertJsonLd', () => {
    it('should generate valid Person JSON-LD with basic info', () => {
      const expert: ExpertInfo = {
        name: 'John Doe',
        role: 'Senior Developer',
        credentials: ['Software Engineering', 'Web Development'],
      };
      
      const jsonLd = generateExpertJsonLd(expert);
      
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('Person');
      expect(jsonLd.name).toBe('John Doe');
      expect(jsonLd.jobTitle).toBe('Senior Developer');
      expect(jsonLd.description).toBe('Software Engineering, Web Development');
    });
    
    it('should include social profiles as sameAs', () => {
      const expert: ExpertInfo = {
        name: 'Jane Smith',
        role: 'Tech Lead',
        credentials: ['Cloud Architecture'],
        socialProfiles: {
          twitter: 'https://twitter.com/janesmith',
          linkedin: 'https://linkedin.com/in/janesmith',
          github: 'https://github.com/janesmith',
        },
      };
      
      const jsonLd = generateExpertJsonLd(expert);
      
      expect(jsonLd.sameAs).toContain('https://twitter.com/janesmith');
      expect(jsonLd.sameAs).toContain('https://linkedin.com/in/janesmith');
      expect(jsonLd.sameAs).toContain('https://github.com/janesmith');
    });
    
    it('should include expertise as knowsAbout', () => {
      const expert: ExpertInfo = {
        name: 'Expert User',
        role: 'Developer',
        credentials: ['Programming'],
        expertise: ['JavaScript', 'TypeScript', 'React'],
      };
      
      const jsonLd = generateExpertJsonLd(expert);
      
      expect(jsonLd.knowsAbout).toEqual(['JavaScript', 'TypeScript', 'React']);
    });
    
    it('should include avatar as image', () => {
      const expert: ExpertInfo = {
        name: 'Avatar User',
        role: 'Designer',
        credentials: ['UI/UX'],
        avatar: 'https://example.com/avatar.jpg',
      };
      
      const jsonLd = generateExpertJsonLd(expert);
      
      expect(jsonLd.image).toBe('https://example.com/avatar.jpg');
    });
  });
  
  describe('generateEnhancedOrganizationJsonLd', () => {
    it('should generate valid Organization JSON-LD', () => {
      const org: OrganizationInfo = {
        name: 'Test Company',
        description: 'A test company for testing',
        foundedYear: 2020,
        logo: 'https://example.com/logo.png',
        contactEmail: 'contact@example.com',
        socialProfiles: {},
      };
      
      const jsonLd = generateEnhancedOrganizationJsonLd(org, 'en');
      
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('Organization');
      expect(jsonLd.name).toBe('Test Company');
      expect(jsonLd.description).toBe('A test company for testing');
      expect(jsonLd.logo).toBe('https://example.com/logo.png');
      expect(jsonLd.foundingDate).toBe('2020-01-01');
      expect(jsonLd.email).toBe('contact@example.com');
    });
    
    it('should include contactPoint with available languages', () => {
      const jsonLd = generateEnhancedOrganizationJsonLd(DEFAULT_ORGANIZATION, 'en');
      
      expect(jsonLd.contactPoint).toBeDefined();
      expect(jsonLd.contactPoint?.contactType).toBe('customer support');
      expect(jsonLd.contactPoint?.availableLanguage).toContain('en');
      expect(jsonLd.contactPoint?.availableLanguage).toContain('zh');
      expect(jsonLd.contactPoint?.availableLanguage?.length).toBe(10);
    });
    
    it('should include social profiles as sameAs', () => {
      const org: OrganizationInfo = {
        name: 'Social Company',
        description: 'Company with social profiles',
        foundedYear: 2021,
        logo: 'https://example.com/logo.png',
        contactEmail: 'contact@example.com',
        socialProfiles: {
          twitter: 'https://twitter.com/company',
          github: 'https://github.com/company',
        },
      };
      
      const jsonLd = generateEnhancedOrganizationJsonLd(org, 'en');
      
      expect(jsonLd.sameAs).toContain('https://twitter.com/company');
      expect(jsonLd.sameAs).toContain('https://github.com/company');
    });
    
    it('should include address when provided', () => {
      const org: OrganizationInfo = {
        name: 'Address Company',
        description: 'Company with address',
        foundedYear: 2022,
        logo: 'https://example.com/logo.png',
        contactEmail: 'contact@example.com',
        socialProfiles: {},
        address: {
          streetAddress: '123 Main St',
          addressLocality: 'San Francisco',
          addressRegion: 'CA',
          postalCode: '94102',
          addressCountry: 'US',
        },
      };
      
      const jsonLd = generateEnhancedOrganizationJsonLd(org, 'en');
      
      expect(jsonLd.address).toBeDefined();
      expect(jsonLd.address?.['@type']).toBe('PostalAddress');
      expect(jsonLd.address?.streetAddress).toBe('123 Main St');
      expect(jsonLd.address?.addressCountry).toBe('US');
    });
  });
  
  describe('getToolAuthor', () => {
    it('should return default expert for any tool', () => {
      const author = getToolAuthor('json-formatter');
      
      expect(author.name).toBe(DEFAULT_EXPERT.name);
      expect(author.role).toBe(DEFAULT_EXPERT.role);
    });
  });
  
  describe('getOrganizationInfo', () => {
    it('should return default organization info', () => {
      const org = getOrganizationInfo();
      
      expect(org.name).toBe('U2Tool');
      expect(org.foundedYear).toBe(2024);
    });
  });
  
  describe('getTrustSignals', () => {
    it('should return trust signals object', () => {
      const signals = getTrustSignals('en');
      
      expect(signals.totalTools).toBeGreaterThan(0);
      expect(signals.freeToUse).toBe(true);
      expect(signals.noRegistration).toBe(true);
      expect(signals.browserBased).toBe(true);
      expect(signals.dataPrivacy).toBe(true);
      expect(signals.supportedLanguages).toBe(10);
    });
  });
  
  describe('getTrustSignalTexts', () => {
    it('should return English texts for en locale', () => {
      const texts = getTrustSignalTexts('en');
      
      expect(texts.freeToUse).toBe('100% Free to Use');
      expect(texts.noRegistration).toBe('No Registration Required');
    });
    
    it('should return Chinese texts for zh locale', () => {
      const texts = getTrustSignalTexts('zh');
      
      expect(texts.freeToUse).toBe('100% 免费使用');
      expect(texts.noRegistration).toBe('无需注册');
    });
    
    it('should fallback to English for unknown locale', () => {
      const texts = getTrustSignalTexts('unknown');
      
      expect(texts.freeToUse).toBe('100% Free to Use');
    });
    
    it('should have texts for all supported locales', () => {
      const locales = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];
      
      for (const locale of locales) {
        const texts = getTrustSignalTexts(locale);
        expect(texts.freeToUse).toBeTruthy();
        expect(texts.noRegistration).toBeTruthy();
        expect(texts.browserBased).toBeTruthy();
        expect(texts.dataPrivacy).toBeTruthy();
      }
    });
  });
  
  describe('validateExpertInfo', () => {
    it('should return true for valid expert info', () => {
      const expert: ExpertInfo = {
        name: 'Valid Expert',
        role: 'Developer',
        credentials: ['Programming'],
      };
      
      expect(validateExpertInfo(expert)).toBe(true);
    });
    
    it('should return false for empty name', () => {
      const expert: ExpertInfo = {
        name: '',
        role: 'Developer',
        credentials: ['Programming'],
      };
      
      expect(validateExpertInfo(expert)).toBe(false);
    });
    
    it('should return false for empty credentials', () => {
      const expert: ExpertInfo = {
        name: 'Expert',
        role: 'Developer',
        credentials: [],
      };
      
      expect(validateExpertInfo(expert)).toBe(false);
    });
  });
  
  describe('validateOrganizationInfo', () => {
    it('should return true for valid organization info', () => {
      expect(validateOrganizationInfo(DEFAULT_ORGANIZATION)).toBe(true);
    });
    
    it('should return false for invalid founding year', () => {
      const org: OrganizationInfo = {
        ...DEFAULT_ORGANIZATION,
        foundedYear: 1990,
      };
      
      expect(validateOrganizationInfo(org)).toBe(false);
    });
    
    it('should return false for empty name', () => {
      const org: OrganizationInfo = {
        ...DEFAULT_ORGANIZATION,
        name: '',
      };
      
      expect(validateOrganizationInfo(org)).toBe(false);
    });
  });
  
  describe('DEFAULT_EXPERT', () => {
    it('should have valid default expert info', () => {
      expect(DEFAULT_EXPERT.name).toBeTruthy();
      expect(DEFAULT_EXPERT.role).toBeTruthy();
      expect(DEFAULT_EXPERT.credentials.length).toBeGreaterThan(0);
    });
  });
  
  describe('DEFAULT_ORGANIZATION', () => {
    it('should have valid default organization info', () => {
      expect(DEFAULT_ORGANIZATION.name).toBe('U2Tool');
      expect(DEFAULT_ORGANIZATION.foundedYear).toBeGreaterThan(2000);
      expect(DEFAULT_ORGANIZATION.logo).toContain('u2tool');
    });
  });
});

/**
 * Property Tests for E-E-A-T Module
 * Feature: comprehensive-seo-review, Property 1: Structured Data Completeness
 * Validates: Requirements 1.3, 1.5, 6.1, 6.2, 6.4, 6.5
 */
describe('E-E-A-T Property Tests', () => {
  describe('Property 1: Expert JSON-LD Completeness', () => {
    it('should always include @context and @type', () => {
      const experts: ExpertInfo[] = [
        { name: 'A', role: 'B', credentials: ['C'] },
        { name: 'Long Name Here', role: 'Complex Role', credentials: ['Cred1', 'Cred2', 'Cred3'] },
        { name: '中文名字', role: '开发者', credentials: ['技能'] },
      ];
      
      for (const expert of experts) {
        const jsonLd = generateExpertJsonLd(expert);
        expect(jsonLd['@context']).toBe('https://schema.org');
        expect(jsonLd['@type']).toBe('Person');
        expect(jsonLd.name).toBe(expert.name);
      }
    });
  });
  
  describe('Property 1: Organization JSON-LD Completeness', () => {
    it('should always include required fields', () => {
      const locales = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];
      
      for (const locale of locales) {
        const jsonLd = generateEnhancedOrganizationJsonLd(DEFAULT_ORGANIZATION, locale);
        
        expect(jsonLd['@context']).toBe('https://schema.org');
        expect(jsonLd['@type']).toBe('Organization');
        expect(jsonLd.name).toBeTruthy();
        expect(jsonLd.url).toBeTruthy();
        expect(jsonLd.logo).toBeTruthy();
        expect(jsonLd.contactPoint).toBeDefined();
      }
    });
  });
});
