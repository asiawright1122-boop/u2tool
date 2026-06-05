import { describe, it, expect } from 'vitest';
import { generateLlmsTxt, type LlmsTxtData } from './llms-txt-generator-helper';

describe('llms.txt Generator Helper', () => {
  it('should generate a standard llms.txt markdown document', () => {
    const data: LlmsTxtData = {
      title: 'My Awesome API',
      summary: 'Brief description of what this API is for.',
      detail: 'This is a long description with markdown formatting allowed.\n- Rule 1\n- Rule 2',
      sections: [
        {
          title: 'Main Documentation',
          items: [
            { title: 'Intro', url: '/docs/intro', description: 'Getting started' },
            { title: 'Auth', url: '/docs/auth', description: 'Authentication flow', type: 'docs' }
          ]
        },
        {
          title: 'API References',
          items: [
            { title: 'Users Endpoint', url: '/api/v1/users', type: 'api' }
          ]
        }
      ]
    };

    const output = generateLlmsTxt(data);

    expect(output).toBe(
`# My Awesome API

> Brief description of what this API is for.

This is a long description with markdown formatting allowed.
- Rule 1
- Rule 2

## Main Documentation

- [Intro](/docs/intro): Getting started
- [Auth](/docs/auth) [docs]: Authentication flow

## API References

- [Users Endpoint](/api/v1/users) [api]`
    );
  });

  it('should ignore empty sections and items gracefully', () => {
    const data: LlmsTxtData = {
      title: 'Minimal Project',
      summary: '',
      sections: [
        {
          title: '', // empty title, ignore section
          items: [
            { title: 'Valid', url: '/val' }
          ]
        },
        {
          title: 'Section 2',
          items: [
            { title: '', url: '/invalid' }, // empty title, ignore
            { title: 'No URL', url: '' }, // empty url, ignore
            { title: 'Valid 2', url: '/val2' }
          ]
        }
      ]
    };

    const output = generateLlmsTxt(data);
    expect(output).toBe(
`# Minimal Project

## Section 2

- [Valid 2](/val2)`
    );
  });
});
