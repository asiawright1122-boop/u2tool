import { describe, expect, it } from 'vitest';
import { buildDiscoveryIndex, DISCOVERY_ALIASES } from './index-builder';

const tools = [
  {
    slug: 'json-to-csv',
    category: 'converters',
    icon: 'arrow-left-right',
    component: 'JsonToCsv',
  },
  {
    slug: 'cron-generator',
    category: 'generators',
    icon: 'clock',
    component: 'CronGenerator',
  },
] as const;

describe('buildDiscoveryIndex', () => {
  it('maps tools into discovery candidates with localized names/descriptions', () => {
    const toolsObj = {
      'json-to-csv': {
        name: 'JSON to CSV',
        description: 'Convert json quickly',
        seo_title: 'JSON to CSV Converter',
        seo_description: 'Convert JSON data to CSV format online',
      },
      'cron-generator': {
        name: 'Cron Generator',
        description: 'Build cron expression',
      },
    } as const;

    const categoryMessages = {
      converters: 'Converters',
      generators: 'Generators',
    } as const;

    const result = buildDiscoveryIndex(tools, toolsObj, categoryMessages);
    expect(result[0]).toMatchObject({
      slug: 'json-to-csv',
      name: 'JSON to CSV',
      description: 'Convert json quickly',
      seoTitle: 'JSON to CSV Converter',
      seoDescription: 'Convert JSON data to CSV format online',
      categoryName: 'Converters',
    });
  });

  it('falls back to slug/category id when translations are missing', () => {
    const result = buildDiscoveryIndex(tools, {}, {});
    expect(result[0]).toMatchObject({
      slug: 'json-to-csv',
      name: 'json-to-csv',
      categoryName: 'converters',
    });
  });

  it('injects configured aliases for known slugs', () => {
    const result = buildDiscoveryIndex(tools, {}, {});
    const cron = result.find((item) => item.slug === 'cron-generator');
    expect(cron?.aliases ?? []).toEqual(DISCOVERY_ALIASES['cron-generator']);
  });
});
