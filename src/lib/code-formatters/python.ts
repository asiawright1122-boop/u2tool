// Python code formatter (PEP 8 style)

export interface PythonFormatOptions {
  indentSize: 2 | 4;
  maxLineLength: number;
  sortImports: boolean;
}

const DEFAULT_OPTIONS: PythonFormatOptions = {
  indentSize: 4,
  maxLineLength: 79,
  sortImports: true,
};

// Format Python code according to PEP 8 guidelines
export function formatPython(code: string, options: Partial<PythonFormatOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lines = code.split('\n');
  
  // Track indentation level
  let indentLevel = 0;
  const indentStr = ' '.repeat(opts.indentSize);
  
  // Keywords that increase indentation
  const increaseIndentKeywords = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'async'];
  
  // Process each line
  const formattedLines: string[] = [];
  const imports: string[] = [];
  const fromImports: string[] = [];
  let inImportSection = true;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip empty lines in import section
    if (inImportSection && trimmedLine === '') {
      continue;
    }
    
    // Collect imports
    if (inImportSection) {
      if (trimmedLine.startsWith('import ')) {
        imports.push(trimmedLine);
        continue;
      } else if (trimmedLine.startsWith('from ')) {
        fromImports.push(trimmedLine);
        continue;
      } else if (trimmedLine !== '' && !trimmedLine.startsWith('#')) {
        inImportSection = false;
        
        // Add sorted imports
        if (opts.sortImports) {
          imports.sort();
          fromImports.sort();
        }
        
        if (imports.length > 0) {
          formattedLines.push(...imports);
        }
        if (fromImports.length > 0) {
          if (imports.length > 0) formattedLines.push('');
          formattedLines.push(...fromImports);
        }
        if (imports.length > 0 || fromImports.length > 0) {
          formattedLines.push('');
          formattedLines.push('');
        }
      }
    }
    
    // Handle empty lines
    if (trimmedLine === '') {
      // Don't add multiple consecutive empty lines
      if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== '') {
        formattedLines.push('');
      }
      continue;
    }
    
    // Handle comments
    if (trimmedLine.startsWith('#')) {
      formattedLines.push(indentStr.repeat(indentLevel) + trimmedLine);
      continue;
    }
    
    // Check for dedent keywords
    if (trimmedLine.startsWith('elif ') || 
        trimmedLine.startsWith('else:') || 
        trimmedLine.startsWith('except') ||
        trimmedLine.startsWith('finally:')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Check for return/break/continue/pass (dedent after)
    const dedentAfter = ['return', 'break', 'continue', 'pass', 'raise'].some(
      kw => trimmedLine === kw || trimmedLine.startsWith(kw + ' ')
    );
    
    // Format the line
    let formattedLine = formatPythonLine(trimmedLine);
    
    // Apply indentation
    formattedLine = indentStr.repeat(indentLevel) + formattedLine;
    formattedLines.push(formattedLine);
    
    // Check if we need to increase indent
    if (trimmedLine.endsWith(':')) {
      const startsWithKeyword = increaseIndentKeywords.some(kw => 
        trimmedLine.startsWith(kw + ' ') || 
        trimmedLine.startsWith(kw + ':') ||
        trimmedLine === kw + ':'
      );
      if (startsWithKeyword) {
        indentLevel++;
      }
    }
    
    // Dedent after return/break/continue/pass
    if (dedentAfter) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
  }
  
  // Handle case where file only has imports
  if (inImportSection && (imports.length > 0 || fromImports.length > 0)) {
    if (opts.sortImports) {
      imports.sort();
      fromImports.sort();
    }
    formattedLines.push(...imports);
    if (imports.length > 0 && fromImports.length > 0) {
      formattedLines.push('');
    }
    formattedLines.push(...fromImports);
  }
  
  // Remove trailing empty lines and add single newline at end
  while (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] === '') {
    formattedLines.pop();
  }
  
  return formattedLines.join('\n') + '\n';
}

// Format a single line of Python code
function formatPythonLine(line: string): string {
  let result = line;
  
  // Add spaces around operators
  result = result.replace(/([^=!<>])=([^=])/g, '$1 = $2');
  result = result.replace(/([^=!<>+\-*/%&|^])([+\-*/%&|^])=([^=])/g, '$1 $2= $3');
  result = result.replace(/([^<>])([<>])([^<>=])/g, '$1 $2 $3');
  result = result.replace(/([^=!<>])([=!<>]=)([^=])/g, '$1 $2 $3');
  
  // Add space after commas
  result = result.replace(/,([^\s])/g, ', $1');
  
  // Add space after colons in dictionaries (but not in slices)
  result = result.replace(/:\s*([^\s\]])/g, ': $1');
  
  // Remove trailing whitespace
  result = result.trimEnd();
  
  // Remove multiple spaces (except for indentation)
  const leadingSpaces = result.match(/^(\s*)/)?.[1] || '';
  const content = result.slice(leadingSpaces.length);
  result = leadingSpaces + content.replace(/  +/g, ' ');
  
  return result;
}

// Validate Python syntax (basic check)
export function validatePython(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const lines = code.split('\n');
  
  let openParens = 0;
  let openBrackets = 0;
  let openBraces = 0;
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const prevChar = j > 0 ? line[j - 1] : '';
      
      // Handle strings
      if ((char === '"' || char === "'") && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
        continue;
      }
      
      if (inString) continue;
      
      // Count brackets
      if (char === '(') openParens++;
      if (char === ')') openParens--;
      if (char === '[') openBrackets++;
      if (char === ']') openBrackets--;
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;
      
      // Check for negative counts (closing without opening)
      if (openParens < 0) {
        errors.push(`Line ${i + 1}: Unexpected closing parenthesis`);
        openParens = 0;
      }
      if (openBrackets < 0) {
        errors.push(`Line ${i + 1}: Unexpected closing bracket`);
        openBrackets = 0;
      }
      if (openBraces < 0) {
        errors.push(`Line ${i + 1}: Unexpected closing brace`);
        openBraces = 0;
      }
    }
  }
  
  // Check for unclosed brackets
  if (openParens > 0) errors.push('Unclosed parenthesis');
  if (openBrackets > 0) errors.push('Unclosed bracket');
  if (openBraces > 0) errors.push('Unclosed brace');
  if (inString) errors.push('Unclosed string');
  
  return { valid: errors.length === 0, errors };
}
