import yaml from 'js-yaml';
import { locales } from './i18n';

export function getOpenApiSpec(baseUrl = 'https://www.u2tool.com'): Record<string, unknown> {
  const normalizedBase = baseUrl.replace(/\/+$/, '');

  return {
    openapi: '3.1.0',
    info: {
      title: 'U2Tool API',
      version: '1.0.0',
      description:
        'Machine-readable OpenAPI specification for U2Tool (https://u2tool.com), a collection of 564+ free developer, data, and design tools. Designed for AI agent discovery, automation, and programmatic tool search.',
      contact: {
        name: 'U2Tool Team',
        url: `${normalizedBase}/en/about/`,
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: normalizedBase,
        description: 'Production Server',
      },
    ],
    paths: {
      '/api/ai-discovery/search': {
        get: {
          summary: 'Search developer tools',
          description:
            'Search the U2Tool collection by keyword, intent, or utility name across multiple languages.',
          operationId: 'searchTools',
          parameters: [
            {
              name: 'q',
              in: 'query',
              required: true,
              description: 'Search query string (up to 300 characters)',
              schema: {
                type: 'string',
                maxLength: 300,
                example: 'json formatter',
              },
            },
            {
              name: 'locale',
              in: 'query',
              required: false,
              description: 'Language locale for localized tool titles and descriptions',
              schema: {
                type: 'string',
                enum: [...locales],
                default: 'en',
                example: 'en',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Successful search results matching query',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SearchResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Invalid search parameters (e.g. empty query or invalid locale)',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            '404': {
              description: 'Discovery search disabled or endpoint not available',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/api/ai-discovery/events': {
        post: {
          summary: 'Submit discovery telemetry events',
          description: 'Submit client interaction telemetry for tool searches and navigation.',
          operationId: 'submitDiscoveryEvents',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DiscoveryEventPayload',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Events recorded successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      ok: { type: 'boolean', example: true },
                      count: { type: 'integer', example: 1 },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid telemetry event format',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
        get: {
          summary: 'Export discovery telemetry events',
          description: 'Export discovery telemetry events with authorization token.',
          operationId: 'exportDiscoveryEvents',
          responses: {
            '200': {
              description: 'Telemetry events dump',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      events: {
                        type: 'array',
                        items: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized export token',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/{locale}/tools-index.json': {
        get: {
          summary: 'Get full localized tools catalog',
          description:
            'Retrieve the comprehensive catalog of 564+ tools indexed for the given locale.',
          operationId: 'getToolsIndex',
          parameters: [
            {
              name: 'locale',
              in: 'path',
              required: true,
              description: 'Supported locale identifier',
              schema: {
                type: 'string',
                enum: [...locales],
                example: 'en',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Complete array of tool definitions',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/ToolIndexItem',
                    },
                  },
                },
              },
            },
            '404': {
              description: 'Locale not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/openapi.json': {
        get: {
          summary: 'OpenAPI specification (JSON)',
          description: 'Returns the OpenAPI 3.1.0 specification document in JSON format.',
          operationId: 'getOpenApiJson',
          responses: {
            '200': {
              description: 'OpenAPI 3.1.0 specification in JSON format',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                  },
                },
              },
            },
          },
        },
      },
      '/api/openapi.yaml': {
        get: {
          summary: 'OpenAPI specification (YAML)',
          description: 'Returns the OpenAPI 3.1.0 specification document in YAML format.',
          operationId: 'getOpenApiYaml',
          responses: {
            '200': {
              description: 'OpenAPI 3.1.0 specification in YAML format',
              content: {
                'application/yaml': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        ErrorResponse: {
          type: 'object',
          required: ['error', 'message', 'resolution'],
          properties: {
            error: {
              type: 'string',
              description: 'Machine-readable error code',
              example: 'NOT_FOUND',
            },
            message: {
              type: 'string',
              description: 'Human-readable error description',
              example: 'The requested resource was not found.',
            },
            resolution: {
              type: 'string',
              description: 'Actionable guidance on how an agent or client can resolve the issue',
              example: 'Check available endpoints in /openapi.json or catalog in /llms.txt.',
            },
          },
        },
        SearchResponse: {
          type: 'object',
          required: ['query', 'locale', 'results'],
          properties: {
            query: {
              type: 'string',
              example: 'json',
            },
            locale: {
              type: 'string',
              example: 'en',
            },
            results: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/SearchResultItem',
              },
            },
          },
        },
        SearchResultItem: {
          type: 'object',
          required: ['slug', 'name', 'category', 'url'],
          properties: {
            slug: {
              type: 'string',
              example: 'json-formatter',
            },
            name: {
              type: 'string',
              example: 'JSON Formatter',
            },
            description: {
              type: 'string',
              example: 'Format, validate, and beautify JSON online.',
            },
            category: {
              type: 'string',
              example: 'development',
            },
            categoryName: {
              type: 'string',
              example: 'Development',
            },
            url: {
              type: 'string',
              example: 'https://www.u2tool.com/en/tools/json-formatter/',
            },
          },
        },
        ToolIndexItem: {
          type: 'object',
          required: ['slug', 'name', 'category', 'categoryName', 'href', 'categoryHref'],
          properties: {
            slug: {
              type: 'string',
              example: 'json-formatter',
            },
            name: {
              type: 'string',
              example: 'JSON Formatter',
            },
            description: {
              type: 'string',
              example: 'Format, validate, and beautify JSON online.',
            },
            category: {
              type: 'string',
              example: 'development',
            },
            categoryName: {
              type: 'string',
              example: 'Development',
            },
            href: {
              type: 'string',
              example: '/en/tools/json-formatter/',
            },
            categoryHref: {
              type: 'string',
              example: '/en/categories/development/',
            },
          },
        },
        DiscoveryEventPayload: {
          type: 'object',
          required: ['events'],
          properties: {
            events: {
              type: 'array',
              items: {
                type: 'object',
                required: ['type'],
                properties: {
                  type: {
                    type: 'string',
                    example: 'search_query',
                  },
                  query: {
                    type: 'string',
                    example: 'base64',
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

export function getOpenApiYaml(baseUrl = 'https://www.u2tool.com'): string {
  const spec = getOpenApiSpec(baseUrl);
  return yaml.dump(spec, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
  });
}
