import { describe, expect, it } from 'vitest';
import { tools } from '@/config/tools';
import {
  buildPdfDocumentToolClusterGroupForTool,
  buildPdfDocumentToolClusterGroups,
  getPdfDocumentToolClusterGroupIdForSlug,
  pdfDocumentToolClusterSlugs,
} from './pdf-document-tool-cluster';

const categoryNames = Object.fromEntries(
  Array.from(new Set(tools.map((tool) => tool.category))).map((category) => [category, category])
);
const toolNames = Object.fromEntries(tools.map((tool) => [tool.slug, tool.slug]));
const toolDescriptions = Object.fromEntries(tools.map((tool) => [tool.slug, `${tool.slug} description`]));
const toolSlugSet = new Set(tools.map((tool) => tool.slug));

describe('pdf-document-tool-cluster', () => {
  it('only references existing tools', () => {
    for (const slug of pdfDocumentToolClusterSlugs) {
      expect(toolSlugSet.has(slug), `${slug} should exist in the tool registry`).toBe(true);
    }
  });

  it('does not duplicate cluster slugs', () => {
    const configuredSlugs = new Set(pdfDocumentToolClusterSlugs);
    expect(configuredSlugs.size).toBe(pdfDocumentToolClusterSlugs.length);
  });

  it('assigns every cluster tool to a group', () => {
    for (const slug of pdfDocumentToolClusterSlugs) {
      expect(getPdfDocumentToolClusterGroupIdForSlug(slug), `${slug} should belong to a group`).not.toBeNull();
    }
  });

  it('groups include the configured cluster tools exactly once', () => {
    const groups = buildPdfDocumentToolClusterGroups('en', categoryNames, toolNames, toolDescriptions);
    const groupedSlugs = groups.flatMap((group) => group.tools.map((tool) => tool.slug));

    expect(groupedSlugs.toSorted()).toEqual([...pdfDocumentToolClusterSlugs].toSorted());
  });

  it('builds a detail-card group for document tools only', () => {
    const pdfGroup = buildPdfDocumentToolClusterGroupForTool(
      'en',
      'pdf-merger',
      categoryNames,
      toolNames,
      toolDescriptions
    );
    const securityGroup = buildPdfDocumentToolClusterGroupForTool(
      'en',
      'password-generator',
      categoryNames,
      toolNames,
      toolDescriptions
    );

    expect(pdfGroup?.id).toBe('pdf-editing');
    expect(securityGroup).toBeNull();
  });
});
