<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['xml-to-json'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.xml-to-json.${key}`;
  }

  let input = $state(`<?xml version="1.0" encoding="UTF-8"?>
<root>
  <user id="1">
    <name>John Doe</name>
    <email>john@example.com</email>
    <active>true</active>
  </user>
  <user id="2">
    <name>Jane Smith</name>
    <email>jane@example.com</email>
    <active>false</active>
  </user>
</root>`);

  let output = $state('');

  let preserveAttributes = $state(true);

  // Functions
  function parseXml(xmlString: string): Record<string, unknown> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');
    
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Invalid XML: ' + parseError.textContent);
    }
    
    const nodeToJson = (node: Element): unknown => {
      const result: Record<string, unknown> = {};
      
      // Handle attributes
      if (preserveAttributes && node.attributes.length > 0) {
        const attrs: Record<string, string> = {};
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          attrs[`@${attr.name}`] = attr.value;
        }
        Object.assign(result, attrs);
      }
      
      // Handle child nodes
      const children = Array.from(node.childNodes);
      const textContent = children
        .filter(child => child.nodeType === Node.TEXT_NODE)
        .map(child => child.textContent?.trim())
        .filter(text => text)
        .join('');
      
      const elementChildren = children.filter(child => child.nodeType === Node.ELEMENT_NODE) as Element[];

      if (elementChildren.length === 0 && textContent) {
        // Leaf node with text content
        if (Object.keys(result).length === 0) {
          return textContent;
        }
        result['#text'] = textContent;
      } else {
        // Process element children
        const childGroups: Record<string, unknown[]> = {};
        
        for (const child of elementChildren) {
          const childName = child.tagName;
          const childValue = nodeToJson(child);
          
          if (!childGroups[childName]) {
            childGroups[childName] = [];
          }
          childGroups[childName].push(childValue);
        }
        
        for (const [name, values] of Object.entries(childGroups)) {
          result[name] = values.length === 1 ? values[0] : values;
        }
      }
      
      return Object.keys(result).length === 0 ? '' : result;
    };
    
    return { [doc.documentElement.tagName]: nodeToJson(doc.documentElement) };
  }
  function convert() {
    try {
      const json = parseXml(input);
      output = JSON.stringify(json, null, 2);
    } catch (_e) {
      output = `Error: ${_e instanceof Error ? _e.message : 'Invalid XML'}`;
    }
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <input type="checkbox" bind:checked={preserveAttributes}
            class="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
          Preserve Attributes (as @attr)
        </label>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label for="xml-to-json-field-4" class="tool-label">{t('input')}</label>
          <textarea bind:value={input}
            class="tool-textarea-tall"
            placeholder={t('inputPlaceholder')} id="xml-to-json-field-4"></textarea>
        </div>
        <div>
          <label for="xml-to-json-field-3" class="tool-label">{t('output')}</label>
          <textarea value={output} readOnly
            class="tool-textarea-tall"
            placeholder={t('outputPlaceholder')} id="xml-to-json-field-3"></textarea>
        </div>
      </div>

      <div class="flex gap-4">
        <button onclick={convert}
          class="btn-primary">
          {t('convert')}
        </button>
        <button onclick={copyToClipboard} disabled={!output}
          class="btn-secondary disabled:opacity-50">
          {t('copy')}
        </button>
      </div>
    </div>
  
