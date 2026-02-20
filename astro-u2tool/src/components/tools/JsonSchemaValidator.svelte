<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ValidationError {
  path: string;
  message: string;
}

  let jsonInput = $state('');

  let schemaInput = $state('');

  let errors = $state([]);

  let isValid = $state(null);

  // Functions
  function validateType(value: unknown, type: string): boolean {
    if (type === 'string') return typeof value === 'string';
    if (type === 'number') return typeof value === 'number';
    if (type === 'integer') return typeof value === 'number' && Number.isInteger(value);
    if (type === 'boolean') return typeof value === 'boolean';
    if (type === 'array') return Array.isArray(value);
    if (type === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value);
    if (type === 'null') return value === null;
    return true;
  }
  function validate(data: unknown, schema: Record<string, unknown>, path = '') {
    const errs: ValidationError[] = [];
    
    // Type check
    if (schema.type) {
      const types = Array.isArray(schema.type) ? schema.type : [schema.type];
      if (!types.some(tp => validateType(data, tp as string))) {
        errs.push({ path: path || 'root', message: t('schemaValidator.expectedType', { expected: String(schema.type), actual: typeof data }) });
      }
    }

    // Required properties
    if (schema.required && Array.isArray(schema.required) && typeof data === 'object' && data !== null) {
      for (const prop of schema.required as string[]) {
        if (!(prop in (data as Record<string, unknown>))) {
          errs.push({ path: `${path}.${prop}`, message: t('schemaValidator.missingRequired', { prop }) });
        }
      }
    }

    // Properties
    if (schema.properties && typeof data === 'object' && data !== null) {
      const props = schema.properties as Record<string, Record<string, unknown>>;
      for (const [key, propSchema] of Object.entries(props)) {
        if (key in (data as Record<string, unknown>)) {
          errs.push(...validate((data as Record<string, unknown>)[key], propSchema, `${path}.${key}`));
        }
      }
    }

    // Array items
    if (schema.items && Array.isArray(data)) {
      data.forEach((item, i) => {
        errs.push(...validate(item, schema.items as Record<string, unknown>, `${path}[${i}]`));
      });
    }

    // Min/max length for strings
    if (typeof data === 'string') {
      if (schema.minLength && data.length < (schema.minLength as number)) {
        errs.push({ path, message: t('schemaValidator.stringTooShort', { min: String(schema.minLength) }) });
      }
      if (schema.maxLength && data.length > (schema.maxLength as number)) {
        errs.push({ path, message: t('schemaValidator.stringTooLong', { max: String(schema.maxLength) }) });
      }
    }

    // Min/max for numbers
    if (typeof data === 'number') {
      if (schema.minimum !== undefined && data < (schema.minimum as number)) {
        errs.push({ path, message: t('schemaValidator.numberTooSmall', { min: String(schema.minimum) }) });
      }
      if (schema.maximum !== undefined && data > (schema.maximum as number)) {
        errs.push({ path, message: t('schemaValidator.numberTooLarge', { max: String(schema.maximum) }) });
      }
    }

    return errs;
  }
  function handleValidate() {
    try {
      const data = JSON.parse(jsonInput);
      const schema = JSON.parse(schemaInput);
      const validationErrors = validate(data, schema);
      errors = validationErrors;
      isValid = validationErrors.length === 0;
    } catch (_e) {
      errors = [{ path: 'parse', message: (_e as Error).message }];
      isValid = false;
    }
  }
  function loadExample() {
    jsonInput = JSON.stringify({
      name: "John",
      age: 30,
      email: "john@example.com"
    }, null, 2);
    schemaInput = JSON.stringify({
      type: "object",
      required: ["name", "age"],
      properties: {
        name: { type: "string", minLength: 1 },
        age: { type: "integer", minimum: 0 },
        email: { type: "string" }
      }
    }, null, 2);
  }

</script>


    <div class="space-y-4">
      <div class="flex justify-end">
        <button onclick={loadExample} class="text-sm text-blue-400 hover:text-blue-300">
          {t('schemaValidator.loadExample')}
        </button>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">JSON</label>
          <textarea
            bind:value={jsonInput}
            class="w-full h-48 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 font-mono text-sm text-gray-900 dark:text-gray-100"
            placeholder={t('schemaValidator.jsonPlaceholder')}></textarea>
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">JSON Schema</label>
          <textarea
            bind:value={schemaInput}
            class="w-full h-48 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 font-mono text-sm text-gray-900 dark:text-gray-100"
            placeholder={t('schemaValidator.schemaPlaceholder')}></textarea>
        </div>
      </div>

      <button
        onclick={handleValidate}
        class="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium"
      >
        {t('schemaValidator.validate')}
      </button>

      {#if isValid !== null}
<div class={`p-4 rounded ${isValid ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl">{isValid ? '✅' : '❌'}</span>
            <span class="font-medium">
              {isValid ? t('schemaValidator.valid') : t('schemaValidator.invalid')}
            </span>
          </div>
          {#if errors.length > 0}
<ul class="text-sm space-y-1">
              {#each errors as err, i (i)}
<li  class="text-red-300">
                  <code class="text-yellow-400">{err.path}</code>: {err.message}
                </li>
{/each}
            </ul>
{/if}
        </div>
{/if}
    </div>
  
