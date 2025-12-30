'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function XmlToJson() {
  const t = useTranslations('tools.xml-to-json');
  const [input, setInput] = useState(`<?xml version="1.0" encoding="UTF-8"?>
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
  const [output, setOutput] = useState('');
  const [preserveAttributes, setPreserveAttributes] = useState(true);

  const parseXml = (xmlString: string): Record<string, unknown> => {
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
  };

  const convert = () => {
    try {
      const json = parseXml(input);
      setOutput(JSON.stringify(json, null, 2));
    } catch (_e) {
      setOutput(`Error: ${_e instanceof Error ? _e.message : 'Invalid XML'}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <input type="checkbox" checked={preserveAttributes}
            onChange={(e) => setPreserveAttributes(e.target.checked)}
            className="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
          Preserve Attributes (as @attr)
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="tool-label">{t('input')}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            className="tool-textarea-tall"
            placeholder={t('inputPlaceholder')} />
        </div>
        <div>
          <label className="tool-label">{t('output')}</label>
          <textarea value={output} readOnly
            className="tool-textarea-tall"
            placeholder={t('outputPlaceholder')} />
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={convert}
          className="btn-primary">
          {t('convert')}
        </button>
        <button onClick={copyToClipboard} disabled={!output}
          className="btn-secondary disabled:opacity-50">
          {t('copy')}
        </button>
      </div>
    </div>
  );
}
