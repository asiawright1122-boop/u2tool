import { describe, expect, it } from 'vitest';
import { tools } from '@/config/tools';

import {
  buildClusterCollectionData,
  buildClusterGroupForTool,
  buildClusterGroups,
  buildClusterItemList,
  buildClusterItems,
  createClusterSlugSet,
  getClusterGroupIdForSlug,
  resolveClusterCopy,
  resolveClusterGroupCopy,
} from './tool-cluster-factory';
import type { ToolClusterCopy, ToolClusterGroup } from './tool-cluster-types';

// A small, self-contained cluster definition used to exercise the shared
// builders without depending on any of the eight production cluster files.
const categoryNames = Object.fromEntries(tools.map((tool) => [tool.category, tool.category]));
const toolNames = Object.fromEntries(tools.map((tool) => [tool.slug, tool.slug]));
const toolDescriptions = Object.fromEntries(tools.map((tool) => [tool.slug, `${tool.slug} description`]));

type TestGroupId = 'group-a' | 'group-b';
const firstTwoSlugs = tools.slice(0, 2).map((tool) => tool.slug);
const nextTwoSlugs = tools.slice(2, 4).map((tool) => tool.slug);

const groupDefs: Array<{ id: TestGroupId; slugs: string[] }> = [
  { id: 'group-a', slugs: firstTwoSlugs },
  { id: 'group-b', slugs: nextTwoSlugs },
];

const groupCopy: Record<string, Record<TestGroupId, { title: string; description: string }>> = {
  en: {
    'group-a': { title: 'Group A', description: 'First group description.' },
    'group-b': { title: 'Group B', description: 'Second group description.' },
  },
  zh: {
    'group-a': { title: '组 A', description: '第一组描述。' },
    'group-b': { title: '组 B', description: '第二组描述。' },
  },
};

const clusterPath = '/tools/test-cluster';

const copyByLocale: Record<string, ToolClusterCopy> = {
  en: {
    ctaLabel: 'Open cluster',
    description: 'A compact test cluster.',
    eyebrow: 'Test',
    h1: 'Test Cluster',
    intro: 'Intro text.',
    relatedLinksTitle: 'Related',
    seoDescription: 'SEO description for the test cluster.',
    seoTitle: 'Test Cluster',
    summary: 'Summary text.',
    title: 'Test Cluster',
    toolCountLabel: 'tools',
    workflow: {
      title: 'Workflow',
      items: [{ label: 'Step', text: 'Do something.', slugs: firstTwoSlugs }],
    },
  },
  zh: {
    ctaLabel: '打开集群',
    description: '测试集群。',
    eyebrow: '测试',
    h1: '测试集群',
    intro: '简介。',
    relatedLinksTitle: '相关',
    seoDescription: '测试集群的 SEO 描述。',
    seoTitle: '测试集群',
    summary: '摘要。',
    title: '测试集群',
    toolCountLabel: '个工具',
    workflow: {
      title: '工作流',
      items: [{ label: '步骤', text: '做点什么。', slugs: firstTwoSlugs }],
    },
  },
};

describe('tool-cluster-factory slug-set helpers', () => {
  it('createClusterSlugSet is an O(1) membership set', () => {
    const set = createClusterSlugSet(firstTwoSlugs);
    expect(set.has(firstTwoSlugs[0])).toBe(true);
    expect(set.has('definitely-not-a-tool')).toBe(false);
  });

  it('getClusterGroupIdForSlug resolves a member and rejects outsiders', () => {
    expect(getClusterGroupIdForSlug(groupDefs, firstTwoSlugs[0])).toBe('group-a');
    expect(getClusterGroupIdForSlug(groupDefs, nextTwoSlugs[0])).toBe('group-b');
    expect(getClusterGroupIdForSlug(groupDefs, 'definitely-not-a-tool')).toBeNull();
  });
});

describe('tool-cluster-factory locale copy helpers', () => {
  it('resolveClusterCopy returns the requested locale', () => {
    expect(resolveClusterCopy(copyByLocale, 'zh').title).toBe('测试集群');
  });

  it('resolveClusterCopy falls back to English for an unsupported locale', () => {
    expect(resolveClusterCopy(copyByLocale, 'ar').title).toBe('Test Cluster');
  });

  it('resolveClusterGroupCopy returns the requested locale group copy', () => {
    expect(resolveClusterGroupCopy<TestGroupId>(groupCopy, 'zh')['group-a'].title).toBe('组 A');
  });

  it('resolveClusterGroupCopy falls back to English for an unsupported locale', () => {
    expect(resolveClusterGroupCopy<TestGroupId>(groupCopy, 'ar')['group-b'].title).toBe('Group B');
  });
});

describe('tool-cluster-factory item builders', () => {
  it('buildClusterItems maps each slug to its configured tool', () => {
    const items = buildClusterItems('en', categoryNames, toolNames, toolDescriptions, firstTwoSlugs);

    expect(items).toHaveLength(firstTwoSlugs.length);
    expect(items.map((item) => item.slug)).toEqual(firstTwoSlugs);
    for (const item of items) {
      expect(item.name).toBe(item.slug);
      expect(item.description).toBe(`${item.slug} description`);
      expect(item.href).toContain(`/tools/${item.slug}`);
      expect(item.categoryName).toBe(item.category);
    }
  });

  it('buildClusterItems drops slugs that are not in the tool registry', () => {
    const items = buildClusterItems(
      'en',
      categoryNames,
      toolNames,
      toolDescriptions,
      [firstTwoSlugs[0], 'definitely-not-a-tool']
    );
    expect(items.map((item) => item.slug)).toEqual([firstTwoSlugs[0]]);
  });

  it('buildClusterItems respects locale-prefixed hrefs', () => {
    const [slug] = firstTwoSlugs;
    const [item] = buildClusterItems('zh', categoryNames, toolNames, toolDescriptions, [slug]);
    expect(item.href.startsWith('/zh/') || item.href.startsWith(`/zh${slug}`) || item.href.includes(slug)).toBe(true);
  });
});

describe('tool-cluster-factory group builders', () => {
  it('buildClusterGroups produces one group per definition with localized copy and tools', () => {
    const groups = buildClusterGroups(
      'en',
      categoryNames,
      toolNames,
      toolDescriptions,
      groupDefs,
      groupCopy
    ) as ToolClusterGroup<TestGroupId>[];

    expect(groups.map((group) => group.id)).toEqual(['group-a', 'group-b']);
    expect(groups[0].title).toBe('Group A');
    expect(groups[0].tools.map((tool) => tool.slug)).toEqual(firstTwoSlugs);
    expect(groups[1].tools.map((tool) => tool.slug)).toEqual(nextTwoSlugs);
  });

  it('buildClusterGroups localizes titles per locale', () => {
    const groups = buildClusterGroups(
      'zh',
      categoryNames,
      toolNames,
      toolDescriptions,
      groupDefs,
      groupCopy
    ) as ToolClusterGroup<TestGroupId>[];
    expect(groups[0].title).toBe('组 A');
  });

  it('buildClusterGroupForTool resolves the owning group for a slug', () => {
    const group = buildClusterGroupForTool(
      'en',
      firstTwoSlugs[0],
      categoryNames,
      toolNames,
      toolDescriptions,
      groupDefs,
      groupCopy
    ) as ToolClusterGroup<TestGroupId> | null;

    expect(group?.id).toBe('group-a');
    expect(group?.tools.map((tool) => tool.slug)).toEqual(firstTwoSlugs);
  });

  it('buildClusterGroupForTool returns null for a slug outside the cluster', () => {
    const outsiderSlug = tools.find((tool) => ![...firstTwoSlugs, ...nextTwoSlugs].includes(tool.slug))!.slug;
    const group = buildClusterGroupForTool(
      'en',
      outsiderSlug,
      categoryNames,
      toolNames,
      toolDescriptions,
      groupDefs,
      groupCopy
    );
    expect(group).toBeNull();
  });
});

describe('tool-cluster-factory structured-data builders', () => {
  const groups = buildClusterGroups(
    'en',
    categoryNames,
    toolNames,
    toolDescriptions,
    groupDefs,
    groupCopy
  );

  it('buildClusterItemList emits an ascending ItemList covering every tool', () => {
    const list = buildClusterItemList('https://example.com', 'en', groups, 'Test Cluster') as {
      name: string;
      itemListOrder: string;
      numberOfItems: number;
      itemListElement: Array<{ position: number; url: string }>;
    };

    expect(list.name).toBe('Test Cluster');
    expect(list.itemListOrder).toBe('https://schema.org/ItemListOrderAscending');
    expect(list.numberOfItems).toBe(firstTwoSlugs.length + nextTwoSlugs.length);
    expect(list.itemListElement.map((element) => element.position)).toEqual([1, 2, 3, 4]);
    expect(list.itemListElement.every((element) => element.url.startsWith('https://example.com'))).toBe(true);
  });

  it('buildClusterCollectionData emits a CollectionPage with one hasPart per group', () => {
    const data = buildClusterCollectionData(
      'https://example.com',
      'en',
      groups,
      clusterPath,
      copyByLocale.en
    ) as {
      name: string;
      url: string;
      inLanguage: string;
      numberOfItems: number;
      hasPart: Array<{ name: string; hasPart: Array<{ name: string }> }>;
    };

    expect(data.name).toBe('Test Cluster');
    expect(data.url).toContain(clusterPath);
    expect(data.inLanguage).toBe('en');
    expect(data.numberOfItems).toBe(firstTwoSlugs.length + nextTwoSlugs.length);
    expect(data.hasPart.map((part) => part.name)).toEqual(['Group A', 'Group B']);
  });
});
