'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

type Language = 'typescript' | 'javascript' | 'python' | 'go' | 'java';

interface OpenAPIPath {
  [method: string]: {
    operationId?: string;
    summary?: string;
    parameters?: Array<{
      name: string;
      in: string;
      required?: boolean;
      schema?: { type: string };
    }>;
    requestBody?: {
      content?: {
        [contentType: string]: {
          schema?: { $ref?: string; type?: string };
        };
      };
    };
    responses?: {
      [code: string]: {
        description?: string;
        content?: {
          [contentType: string]: {
            schema?: { $ref?: string; type?: string };
          };
        };
      };
    };
  };
}

interface OpenAPISpec {
  openapi?: string;
  swagger?: string;
  info?: { title?: string; version?: string };
  servers?: Array<{ url: string }>;
  paths?: { [path: string]: OpenAPIPath };
  components?: {
    schemas?: { [name: string]: unknown };
  };
}

function generateTypeScript(spec: OpenAPISpec): string {
  const lines: string[] = [];
  const baseUrl = spec.servers?.[0]?.url || 'https://api.example.com';
  
  lines.push(`// Generated from OpenAPI spec: ${spec.info?.title || 'API'} v${spec.info?.version || '1.0'}`);
  lines.push(`const BASE_URL = '${baseUrl}';`);
  lines.push('');
  lines.push('interface ApiResponse<T> {');
  lines.push('  data: T;');
  lines.push('  status: number;');
  lines.push('}');
  lines.push('');
  lines.push('async function apiRequest<T>(');
  lines.push('  method: string,');
  lines.push('  path: string,');
  lines.push('  options?: { body?: unknown; params?: Record<string, string> }');
  lines.push('): Promise<ApiResponse<T>> {');
  lines.push('  const url = new URL(path, BASE_URL);');
  lines.push('  if (options?.params) {');
  lines.push('    Object.entries(options.params).forEach(([k, v]) => url.searchParams.set(k, v));');
  lines.push('  }');
  lines.push('  const response = await fetch(url.toString(), {');
  lines.push('    method,');
  lines.push('    headers: { "Content-Type": "application/json" },');
  lines.push('    body: options?.body ? JSON.stringify(options.body) : undefined,');
  lines.push('  });');
  lines.push('  return { data: await response.json(), status: response.status };');
  lines.push('}');
  lines.push('');

  if (spec.paths) {
    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          const funcName = operation.operationId || `${method}${path.replace(/[^a-zA-Z]/g, '_')}`;
          const params = operation.parameters || [];
          const pathParams = params.filter(p => p.in === 'path');
          const queryParams = params.filter(p => p.in === 'query');
          const hasBody = ['post', 'put', 'patch'].includes(method) && operation.requestBody;
          
          const args: string[] = [];
          pathParams.forEach(p => args.push(`${p.name}: string`));
          if (queryParams.length > 0) {
            args.push(`params?: { ${queryParams.map(p => `${p.name}?: string`).join('; ')} }`);
          }
          if (hasBody) args.push('body: unknown');
          
          lines.push(`/** ${operation.summary || funcName} */`);
          lines.push(`export async function ${funcName}(${args.join(', ')}) {`);
          
          let pathStr = path;
          pathParams.forEach(p => {
            pathStr = pathStr.replace(`{${p.name}}`, `\${${p.name}}`);
          });
          
          const options: string[] = [];
          if (hasBody) options.push('body');
          if (queryParams.length > 0) options.push('params');
          
          lines.push(`  return apiRequest<unknown>('${method.toUpperCase()}', \`${pathStr}\`${options.length > 0 ? `, { ${options.join(', ')} }` : ''});`);
          lines.push('}');
          lines.push('');
        }
      }
    }
  }

  return lines.join('\n');
}

function generatePython(spec: OpenAPISpec): string {
  const lines: string[] = [];
  const baseUrl = spec.servers?.[0]?.url || 'https://api.example.com';
  
  lines.push(`# Generated from OpenAPI spec: ${spec.info?.title || 'API'} v${spec.info?.version || '1.0'}`);
  lines.push('import requests');
  lines.push('from typing import Optional, Dict, Any');
  lines.push('');
  lines.push(`BASE_URL = "${baseUrl}"`);
  lines.push('');
  lines.push('class ApiClient:');
  lines.push('    def __init__(self, base_url: str = BASE_URL):');
  lines.push('        self.base_url = base_url');
  lines.push('        self.session = requests.Session()');
  lines.push('        self.session.headers.update({"Content-Type": "application/json"})');
  lines.push('');

  if (spec.paths) {
    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          const funcName = operation.operationId || `${method}_${path.replace(/[^a-zA-Z]/g, '_')}`;
          const params = operation.parameters || [];
          const pathParams = params.filter(p => p.in === 'path');
          const queryParams = params.filter(p => p.in === 'query');
          const hasBody = ['post', 'put', 'patch'].includes(method) && operation.requestBody;
          
          const args: string[] = ['self'];
          pathParams.forEach(p => args.push(`${p.name}: str`));
          queryParams.forEach(p => args.push(`${p.name}: Optional[str] = None`));
          if (hasBody) args.push('body: Optional[Dict[str, Any]] = None');
          
          lines.push(`    def ${funcName.toLowerCase()}(${args.join(', ')}):`);
          lines.push(`        """${operation.summary || funcName}"""`);
          
          let pathStr = path;
          pathParams.forEach(p => {
            pathStr = pathStr.replace(`{${p.name}}`, `{${p.name}}`);
          });
          
          lines.push(`        url = f"{self.base_url}${pathStr}"`);
          
          if (queryParams.length > 0) {
            lines.push(`        params = {${queryParams.map(p => `"${p.name}": ${p.name}`).join(', ')}}`);
            lines.push('        params = {k: v for k, v in params.items() if v is not None}');
          }
          
          const reqArgs = [`url`];
          if (queryParams.length > 0) reqArgs.push('params=params');
          if (hasBody) reqArgs.push('json=body');
          
          lines.push(`        response = self.session.${method}(${reqArgs.join(', ')})`);
          lines.push('        return response.json()');
          lines.push('');
        }
      }
    }
  }

  return lines.join('\n');
}

function generateGo(spec: OpenAPISpec): string {
  const lines: string[] = [];
  const baseUrl = spec.servers?.[0]?.url || 'https://api.example.com';
  
  lines.push(`// Generated from OpenAPI spec: ${spec.info?.title || 'API'} v${spec.info?.version || '1.0'}`);
  lines.push('package api');
  lines.push('');
  lines.push('import (');
  lines.push('    "bytes"');
  lines.push('    "encoding/json"');
  lines.push('    "fmt"');
  lines.push('    "net/http"');
  lines.push(')');
  lines.push('');
  lines.push(`const BaseURL = "${baseUrl}"`);
  lines.push('');
  lines.push('type Client struct {');
  lines.push('    BaseURL    string');
  lines.push('    HTTPClient *http.Client');
  lines.push('}');
  lines.push('');
  lines.push('func NewClient() *Client {');
  lines.push('    return &Client{');
  lines.push('        BaseURL:    BaseURL,');
  lines.push('        HTTPClient: &http.Client{},');
  lines.push('    }');
  lines.push('}');
  lines.push('');

  if (spec.paths) {
    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          const funcName = operation.operationId || `${method}${path.replace(/[^a-zA-Z]/g, '')}`;
          const params = operation.parameters || [];
          const pathParams = params.filter(p => p.in === 'path');
          const hasBody = ['post', 'put', 'patch'].includes(method) && operation.requestBody;
          
          const args: string[] = [];
          pathParams.forEach(p => args.push(`${p.name} string`));
          if (hasBody) args.push('body interface{}');
          
          lines.push(`// ${funcName} - ${operation.summary || ''}`);
          lines.push(`func (c *Client) ${funcName}(${args.join(', ')}) (map[string]interface{}, error) {`);
          
          let pathStr = path;
          pathParams.forEach(p => {
            pathStr = pathStr.replace(`{${p.name}}`, `%s`);
          });
          
          if (pathParams.length > 0) {
            lines.push(`    url := fmt.Sprintf("%s${pathStr}", c.BaseURL, ${pathParams.map(p => p.name).join(', ')})`);
          } else {
            lines.push(`    url := c.BaseURL + "${pathStr}"`);
          }
          
          if (hasBody) {
            lines.push('    jsonBody, _ := json.Marshal(body)');
            lines.push(`    req, _ := http.NewRequest("${method.toUpperCase()}", url, bytes.NewBuffer(jsonBody))`);
          } else {
            lines.push(`    req, _ := http.NewRequest("${method.toUpperCase()}", url, nil)`);
          }
          
          lines.push('    req.Header.Set("Content-Type", "application/json")');
          lines.push('    resp, err := c.HTTPClient.Do(req)');
          lines.push('    if err != nil { return nil, err }');
          lines.push('    defer resp.Body.Close()');
          lines.push('    var result map[string]interface{}');
          lines.push('    json.NewDecoder(resp.Body).Decode(&result)');
          lines.push('    return result, nil');
          lines.push('}');
          lines.push('');
        }
      }
    }
  }

  return lines.join('\n');
}

const EXAMPLE_SPEC = {
  openapi: "3.0.0",
  info: { title: "Pet Store API", version: "1.0.0" },
  servers: [{ url: "https://api.petstore.com/v1" }],
  paths: {
    "/pets": {
      get: {
        operationId: "listPets",
        summary: "List all pets",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer" } }
        ]
      },
      post: {
        operationId: "createPet",
        summary: "Create a pet",
        requestBody: { content: { "application/json": { schema: { type: "object" } } } }
      }
    },
    "/pets/{petId}": {
      get: {
        operationId: "getPet",
        summary: "Get a pet by ID",
        parameters: [
          { name: "petId", in: "path", required: true, schema: { type: "string" } }
        ]
      },
      delete: {
        operationId: "deletePet",
        summary: "Delete a pet",
        parameters: [
          { name: "petId", in: "path", required: true, schema: { type: "string" } }
        ]
      }
    }
  }
};

export default function SwaggerToCodeGenerator() {
  const t = useTranslations('tools.swagger-to-code-generator');
  const tCommon = useTranslations('tools');
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>('typescript');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const spec = JSON.parse(input) as OpenAPISpec;
      switch (language) {
        case 'typescript':
        case 'javascript':
          return generateTypeScript(spec);
        case 'python':
          return generatePython(spec);
        case 'go':
          return generateGo(spec);
        default:
          return generateTypeScript(spec);
      }
    } catch {
      return null;
    }
  }, [input, language]);

  const handleCopy = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const loadExample = useCallback(() => {
    setInput(JSON.stringify(EXAMPLE_SPEC, null, 2));
  }, []);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            OpenAPI/Swagger Spec (JSON)
          </label>
          <button
            onClick={loadExample}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t('loadExample')}
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
        />
      </div>

      {/* Language Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Language
        </label>
        <div className="flex flex-wrap gap-2">
          {(['typescript', 'python', 'go'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                language === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {lang === 'typescript' ? 'TypeScript' : lang === 'python' ? 'Python' : 'Go'}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {input.trim() && !result && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          Invalid OpenAPI/Swagger spec. Please check the JSON format.
        </div>
      )}

      {/* Result */}
      {result && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated API Client
            </label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-96">
            {result}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Supported Features</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• OpenAPI 3.0 and Swagger 2.0 specs</li>
          <li>• Path parameters and query parameters</li>
          <li>• Request body for POST/PUT/PATCH</li>
          <li>• Generates typed API client functions</li>
        </ul>
      </div>
    </div>
  );
}
