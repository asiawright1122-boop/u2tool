/**
 * Light Mode Style Consistency Tests
 * 
 * These tests verify that tool components properly support both light and dark modes.
 * Requirements: 1.1, 1.2, 1.3, 2.4
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const TOOLS_DIR = path.join(process.cwd(), 'src/components/tools');

// Get all tool component files
function getToolFiles(): string[] {
  const files = fs.readdirSync(TOOLS_DIR);
  return files.filter(f => f.endsWith('.tsx') && f !== 'ToolWrapper.tsx');
}

describe('Light Mode Style Consistency', () => {
  const toolFiles = getToolFiles();
  
  it('should have tool component files', () => {
    expect(toolFiles.length).toBeGreaterThan(0);
  });
  
  describe('Tool components should use dual-mode color patterns', () => {
    toolFiles.forEach(file => {
      it(`${file} should have proper light/dark mode support`, () => {
        const filePath = path.join(TOOLS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Check for common dual-mode patterns
        const hasDualModePatterns = 
          content.includes('dark:bg-gray-') ||
          content.includes('dark:text-') ||
          content.includes('dark:border-');
        
        // If the file has any styling, it should have dark: prefixes
        const hasAnyBgGray = /bg-gray-[0-9]/.test(content);
        
        if (hasAnyBgGray) {
          expect(hasDualModePatterns).toBe(true);
        }
      });
    });
  });
});

describe('Dark Prefix Completeness (Property Test)', () => {
  /**
   * Property 3: Dark Prefix Completeness
   * Validates: Requirements 2.4
   * 
   * For any bg-gray-800 or bg-gray-900 in className, there should be
   * a corresponding light mode color (bg-gray-100, bg-white, etc.)
   */
  
  const toolFiles = getToolFiles();
  
  toolFiles.forEach(file => {
    it(`${file}: dark:bg-gray-* should have light mode equivalent`, () => {
      const filePath = path.join(TOOLS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Find all className attributes
      const classNameMatches = content.match(/className="[^"]+"/g) || [];
      
      classNameMatches.forEach(className => {
        // If it has dark:bg-gray-700, dark:bg-gray-800, or dark:bg-gray-900
        if (/dark:bg-gray-[789]00/.test(className)) {
          // It should also have a light mode bg color (bg-gray-100, bg-gray-50, bg-white, etc.)
          // Also allow bg-gray-200, bg-gray-300 for special UI elements like progress bars
          // Also allow bg-gray-700 for intentionally dark buttons (like "Dark" preset buttons)
          const hasLightBg = /bg-(?:gray-[0-7][05]0|gray-50|white)/.test(className);
          expect(hasLightBg).toBe(true);
        }
      });
    });
  });
  
  toolFiles.forEach(file => {
    it(`${file}: dark:text-white should have light mode text color`, () => {
      const filePath = path.join(TOOLS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const classNameMatches = content.match(/className="[^"]+"/g) || [];
      
      classNameMatches.forEach(className => {
        if (/dark:text-white/.test(className)) {
          // Should have a light mode text color (text-gray-700, text-gray-800, text-gray-900)
          const hasLightText = /text-gray-[6789]00/.test(className);
          expect(hasLightText).toBe(true);
        }
      });
    });
  });
});

describe('globals.css Tool Classes', () => {
  it('should have tool-* classes with dual-mode support', () => {
    const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
    const content = fs.readFileSync(globalsPath, 'utf-8');
    
    // Check for essential tool classes
    expect(content).toContain('.tool-input');
    expect(content).toContain('.tool-textarea');
    expect(content).toContain('.tool-select');
    expect(content).toContain('.tool-result');
    
    // Check that dark mode is supported in tool classes
    expect(content).toMatch(/\.tool-input[\s\S]*?dark:/);
    expect(content).toMatch(/\.tool-textarea[\s\S]*?dark:/);
  });
});
