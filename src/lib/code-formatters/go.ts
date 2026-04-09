// Go code formatter (gofmt style)

export interface GoFormatOptions {
  tabWidth: number;
  useSpaces: boolean;
}

const DEFAULT_OPTIONS: GoFormatOptions = {
  tabWidth: 4,
  useSpaces: false, // Go uses tabs by default
};

// Format Go code according to gofmt conventions
export function formatGo(code: string, options: Partial<GoFormatOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const lines = code.split('\n');
  const indentChar = opts.useSpaces ? ' '.repeat(opts.tabWidth) : '\t';
  
  let indentLevel = 0;
  const formattedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip empty lines but preserve them
    if (trimmedLine === '') {
      formattedLines.push('');
      continue;
    }
    
    // Check if line starts with closing brace
    if (trimmedLine.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Check for case/default in switch
    if (trimmedLine.startsWith('case ') || trimmedLine === 'default:') {
      // case statements are at same level as switch body
    }
    
    // Format the line
    let formattedLine = formatGoLine(trimmedLine);
    
    // Apply indentation
    formattedLine = indentChar.repeat(indentLevel) + formattedLine;
    formattedLines.push(formattedLine);
    
    // Check if we need to increase indent
    const openBraces = (trimmedLine.match(/{/g) || []).length;
    const closeBraces = (trimmedLine.match(/}/g) || []).length;
    indentLevel += openBraces - closeBraces;
    indentLevel = Math.max(0, indentLevel);
  }
  
  // Remove trailing empty lines and add single newline at end
  while (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] === '') {
    formattedLines.pop();
  }
  
  return formattedLines.join('\n') + '\n';
}

// Format a single line of Go code
function formatGoLine(line: string): string {
  let result = line;
  
  // Add space after keywords
  const keywords = ['if', 'else', 'for', 'switch', 'case', 'return', 'func', 'var', 'const', 'type', 'struct', 'interface', 'package', 'import', 'defer', 'go', 'select', 'chan', 'map', 'range'];
  for (const kw of keywords) {
    const regex = new RegExp(`\\b${kw}\\(`, 'g');
    result = result.replace(regex, `${kw} (`);
  }
  
  // Add space around operators
  result = result.replace(/([^:=!<>])=([^=])/g, '$1 = $2');
  result = result.replace(/:=([^\s])/g, ':= $1');
  result = result.replace(/([^\s]):=/g, '$1 :=');
  result = result.replace(/([^<>])([<>])([^<>=\-])/g, '$1 $2 $3');
  result = result.replace(/([^=!<>])([=!<>]=)([^=])/g, '$1 $2 $3');
  result = result.replace(/([^&])&&([^&])/g, '$1 && $2');
  result = result.replace(/([^|])\|\|([^|])/g, '$1 || $2');
  
  // Add space after commas
  result = result.replace(/,([^\s])/g, ', $1');
  
  // Opening brace on same line
  result = result.replace(/\)\s*\n\s*{/, ') {');
  
  // Remove trailing whitespace
  result = result.trimEnd();
  
  // Remove multiple spaces
  const leadingSpaces = result.match(/^(\s*)/)?.[1] || '';
  const content = result.slice(leadingSpaces.length);
  result = leadingSpaces + content.replace(/  +/g, ' ');
  
  return result;
}

// Validate Go syntax (basic check)
export function validateGo(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const lines = code.split('\n');
  
  let openBraces = 0;
  let openParens = 0;
  let openBrackets = 0;
  let inString = false;
  let inRawString = false;
  let inBlockComment = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = j < line.length - 1 ? line[j + 1] : '';
      const prevChar = j > 0 ? line[j - 1] : '';
      
      // Handle block comments
      if (!inString && !inRawString && char === '/' && nextChar === '*') {
        inBlockComment = true;
        j++;
        continue;
      }
      if (inBlockComment && char === '*' && nextChar === '/') {
        inBlockComment = false;
        j++;
        continue;
      }
      if (inBlockComment) continue;
      
      // Handle line comments
      if (!inString && !inRawString && char === '/' && nextChar === '/') {
        break; // Rest of line is comment
      }
      
      // Handle strings
      if (char === '`' && !inString) {
        inRawString = !inRawString;
        continue;
      }
      if (inRawString) continue;
      
      if (char === '"' && prevChar !== '\\' && !inRawString) {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      
      // Count brackets
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;
      if (char === '(') openParens++;
      if (char === ')') openParens--;
      if (char === '[') openBrackets++;
      if (char === ']') openBrackets--;
      
      // Check for negative counts
      if (openBraces < 0) {
        errors.push(`Line ${i + 1}: Unexpected closing brace`);
        openBraces = 0;
      }
      if (openParens < 0) {
        errors.push(`Line ${i + 1}: Unexpected closing parenthesis`);
        openParens = 0;
      }
      if (openBrackets < 0) {
        errors.push(`Line ${i + 1}: Unexpected closing bracket`);
        openBrackets = 0;
      }
    }
  }
  
  // Check for unclosed brackets
  if (openBraces > 0) errors.push('Unclosed brace');
  if (openParens > 0) errors.push('Unclosed parenthesis');
  if (openBrackets > 0) errors.push('Unclosed bracket');
  if (inString) errors.push('Unclosed string');
  if (inRawString) errors.push('Unclosed raw string');
  if (inBlockComment) errors.push('Unclosed block comment');
  
  return { valid: errors.length === 0, errors };
}
