import { describe, expect, it } from 'vitest';
import yaml from 'js-yaml';
import { getOpenApiSpec, getOpenApiYaml } from './openapi-spec';

describe('openapi-spec', () => {
  it('generates a valid OpenAPI 3.1.0 specification object', () => {
    const spec = getOpenApiSpec('https://www.u2tool.com') as any;

    expect(spec.openapi).toBe('3.1.0');
    expect(spec.info.title).toBe('U2Tool API');
    expect(spec.servers[0].url).toBe('https://www.u2tool.com');

    // Check essential paths
    expect(spec.paths['/api/ai-discovery/search']).toBeDefined();
    expect(spec.paths['/{locale}/tools-index.json']).toBeDefined();
    expect(spec.paths['/openapi.json']).toBeDefined();
    expect(spec.paths['/api/openapi.yaml']).toBeDefined();

    // Check schemas
    const errorSchema = spec.components.schemas.ErrorResponse;
    expect(errorSchema).toBeDefined();
    expect(errorSchema.required).toContain('error');
    expect(errorSchema.required).toContain('message');
    expect(errorSchema.required).toContain('resolution');
  });

  it('generates valid YAML string that parses cleanly', () => {
    const yamlString = getOpenApiYaml('https://www.u2tool.com');
    expect(typeof yamlString).toBe('string');
    expect(yamlString).toContain('openapi: 3.1.0');

    const parsed = yaml.load(yamlString) as any;
    expect(parsed.openapi).toBe('3.1.0');
    expect(parsed.info.title).toBe('U2Tool API');
  });
});
