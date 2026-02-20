// Rust code formatter (rustfmt style)

export interface RustFormatOptions {
  indentSize: 2 | 4;
  maxWidth: number;
}

const DEFAULT_OPTIONS: RustFormatOptions = {
  indentSize: 4,
  maxWidth: 100,
};

// Format Rust code according to rustfmt conventions
export function formatRust(code: string, options: Partial<RustFormatOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const lines = code.split('\n');
  const indentStr = ' '.repeat(opts.indentSize);
  
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
    
    // Check if line starts with closing brace/bracket
    if (trimmedLine.startsWith('}') || trimmedLine.startsWith(']') || trimmedLine.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Handle match arms
    if (trimmedLine.endsWith('=>') || trimmedLine.includes('=> {')) {
      // Match arms stay at current level
    }
    
    // Format the line
    let formattedLine = formatRustLine(trimmedLine);
    
    // Apply indentation
    formattedLine = indentStr.repeat(indentLevel) + formattedLine;
    formattedLines.push(formattedLine);
    
    // Check if we need to increase indent
    const openBraces = (trimmedLine.match(/{/g) || []).length;
    const closeBraces = (trimmedLine.match(/}/g) || []).length;
    const openBrackets = (trimmedLine.match(/\[/g) || []).length;
    const closeBrackets = (trimmedLine.match(/\]/g) || []).length;
    const openParens = (trimmedLine.match(/\(/g) || []).length;
    const closeParens = (trimmedLine.match(/\)/g) || []).length;
    
    // Only count if line ends with opener
    if (trimmedLine.endsWith('{') || trimmedLine.endsWith('[') || trimmedLine.endsWith('(')) {
      indentLevel += 1;
    } else {
      indentLevel += (openBraces - closeBraces);
    }
    indentLevel = Math.max(0, indentLevel);
  }
  
  // Remove trailing empty lines and add single newline at end
  while (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] === '') {
    formattedLines.pop();
  }
  
  return formattedLines.join('\n') + '\n';
}

// Format a single line of Rust code
function formatRustLine(line: string): string {
  let result = line;
  
  // Add space after keywords
  const keywords = ['fn', 'let', 'mut', 'const', 'static', 'if', 'else', 'match', 'for', 'while', 'loop', 'return', 'struct', 'enum', 'impl', 'trait', 'pub', 'use', 'mod', 'crate', 'self', 'super', 'where', 'async', 'await', 'move', 'ref', 'type', 'unsafe', 'extern'];
  for (const kw of keywords) {
    const regex = new RegExp(`\\b${kw}\\(`, 'g');
    result = result.replace(regex, `${kw} (`);
    const regex2 = new RegExp(`\\b${kw}\\{`, 'g');
    result = result.replace(regex2, `${kw} {`);
  }
  
  // Add space around operators
  result = result.replace(/([^:=!<>])=([^=])/g, '$1 = $2');
  result = result.replace(/([^<>])([<>])([^<>=\-])/g, '$1 $2 $3');
  result = result.replace(/([^=!<>])([=!<>]=)([^=])/g, '$1 $2 $3');
  result = result.replace(/([^&])&&([^&])/g, '$1 && $2');
  result = result.replace(/([^|])\|\|([^|])/g, '$1 || $2');
  
  // Add space after commas
  result = result.replace(/,([^\s])/g, ', $1');
  
  // Add space after colons in type annotations
  result = result.replace(/:([^\s:])/g, ': $1');
  
  // Handle -> for return types
  result = result.replace(/\)->([^\s])/g, ') -> $1');
  result = result.replace(/([^\s])->/g, '$1 ->');
  
  // Handle => for match arms
  result = result.replace(/=>([^\s])/g, '=> $1');
  result = result.replace(/([^\s])=>/g, '$1 =>');
  
  // Remove trailing whitespace
  result = result.trimEnd();
  
  // Remove multiple spaces
  const leadingSpaces = result.match(/^(\s*)/)?.[1] || '';
  const content = result.slice(leadingSpaces.length);
  result = leadingSpaces + content.replace(/  +/g, ' ');
  
  return result;
}

// Validate Rust syntax (basic check)
export function validateRust(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const lines = code.split('\n');
  
  let openBraces = 0;
  let openParens = 0;
  let openBrackets = 0;
  let openAngles = 0;
  let inString = false;
  let inRawString = false;
  let inChar = false;
  let inComment = false;
  let inBlockComment = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    inComment = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = j < line.length - 1 ? line[j + 1] : '';
      const prevChar = j > 0 ? line[j - 1] : '';
      
      // Handle block comments
      if (!inString && !inRawString && !inChar && char === '/' && nextChar === '*') {
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
      if (!inString && !inRawString && !inChar && char === '/' && nextChar === '/') {
        break;
      }
      
      // Handle raw strings (r#"..."#)
      if (!inString && !inChar && char === 'r' && nextChar === '#') {
        inRawString = true;
        continue;
      }
      if (inRawString && char === '"' && nextChar === '#') {
        inRawString = false;
        j++;
        continue;
      }
      if (inRawString) continue;
      
      // Handle strings
      if (char === '"' && prevChar !== '\\' && !inChar) {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      
      // Handle char literals
      if (char === "'" && prevChar !== '\\' && !inString) {
        inChar = !inChar;
        continue;
      }
      if (inChar) continue;
      
      // Count brackets
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;
      if (char === '(') openParens++;
      if (char === ')') openParens--;
      if (char === '[') openBrackets++;
      if (char === ']') openBrackets--;
      if (char === '<' && nextChar !== '<' && prevChar !== '<') openAngles++;
      if (char === '>' && nextChar !== '>' && prevChar !== '>') openAngles--;
      
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
