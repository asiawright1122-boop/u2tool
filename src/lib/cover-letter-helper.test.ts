import { describe, it, expect } from 'vitest';
import {
  generateCoverLetter,
  type CoverLetterInput,
} from './cover-letter-helper';

describe('generateCoverLetter', () => {
  it('generates cover letter in English with professional tone', () => {
    const input: CoverLetterInput = {
      candidateName: 'John Doe',
      jobTitle: 'Software Engineer',
      companyName: 'TechCorp',
      keySkills: ['TypeScript', 'Svelte', 'Node.js'],
      experienceYears: 5,
      tone: 'professional',
      locale: 'en',
    };

    const text = generateCoverLetter(input);
    expect(text).toContain('Dear Hiring Manager');
    expect(text).toContain('John Doe');
    expect(text).toContain('Software Engineer');
    expect(text).toContain('TechCorp');
    expect(text).toContain('5 years of experience');
    expect(text).toContain('TypeScript, Svelte, and Node.js');
  });

  it('generates cover letter in Chinese with enthusiastic tone', () => {
    const input: CoverLetterInput = {
      candidateName: '张三',
      jobTitle: '前端工程师',
      companyName: '创新科技',
      keySkills: 'Vue, React, Webpack',
      experienceYears: 3,
      tone: 'enthusiastic',
      locale: 'zh',
    };

    const text = generateCoverLetter(input);
    expect(text).toContain('尊敬的招聘经理');
    expect(text).toContain('张三');
    expect(text).toContain('前端工程师');
    expect(text).toContain('创新科技');
    expect(text).toContain('3 年');
    expect(text).toContain('非常兴奋');
    expect(text).toContain('Vue、React和Webpack');
  });

  it('handles empty skills and fallback to generic text', () => {
    const input: CoverLetterInput = {
      candidateName: 'Alice',
      jobTitle: 'Product Manager',
      companyName: 'FutureInc',
      keySkills: [],
      experienceYears: 0,
      tone: 'professional',
      locale: 'en',
    };

    const text = generateCoverLetter(input);
    expect(text).toContain('Dear Hiring Manager');
    expect(text).toContain('FutureInc');
    expect(text).not.toContain('undefined');
  });
});
