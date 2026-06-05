export interface AuditReport {
  score: number;
  grade: string;
  headers: Record<string, string>;
  missing: string[];
  warnings: string[];
}

export function auditHeaders(rawText: string): AuditReport {
  const headers: Record<string, string> = {};
  
  if (rawText) {
    const lines = rawText.split('\n');
    for (const line of lines) {
      const cleanLine = line.trim();
      if (!cleanLine || cleanLine.startsWith('#') || cleanLine.startsWith('//')) continue;
      const colonIdx = cleanLine.indexOf(':');
      if (colonIdx !== -1) {
        const key = cleanLine.substring(0, colonIdx).trim().toLowerCase();
        const val = cleanLine.substring(colonIdx + 1).trim();
        headers[key] = val;
      }
    }
  }

  let score = 0;
  const missing: string[] = [];
  const warnings: string[] = [];

  // 1. Content-Security-Policy (Max 30)
  if (headers['content-security-policy']) {
    score += 30;
    const csp = headers['content-security-policy'].toLowerCase();
    if (csp.includes("'unsafe-inline'")) {
      score -= 10;
      warnings.push("CSP allows 'unsafe-inline' which bypasses XSS protection.");
    }
    if (csp.includes('*')) {
      score -= 10;
      warnings.push("CSP directive uses wildcard '*' which is over-permissive.");
    }
  } else {
    missing.push('Content-Security-Policy');
  }

  // 2. Strict-Transport-Security (Max 20)
  if (headers['strict-transport-security']) {
    score += 20;
    const hsts = headers['strict-transport-security'].toLowerCase();
    if (!hsts.includes('max-age')) {
      score -= 10;
      warnings.push('HSTS is missing max-age directive.');
    } else {
      const match = hsts.match(/max-age=(\d+)/);
      if (match) {
        const seconds = parseInt(match[1], 10);
        if (seconds < 15768000) {
          score -= 5;
          warnings.push('HSTS max-age is set to less than 6 months (15,768,000s).');
        }
      }
    }
  } else {
    missing.push('Strict-Transport-Security');
  }

  // 3. X-Frame-Options (Max 15)
  if (headers['x-frame-options']) {
    score += 15;
    const xfo = headers['x-frame-options'].toUpperCase();
    if (xfo !== 'DENY' && xfo !== 'SAMEORIGIN') {
      score -= 5;
      warnings.push('X-Frame-Options value should be set to DENY or SAMEORIGIN.');
    }
  } else {
    missing.push('X-Frame-Options');
  }

  // 4. X-Content-Type-Options (Max 15)
  if (headers['x-content-type-options']) {
    if (headers['x-content-type-options'].toLowerCase() === 'nosniff') {
      score += 15;
    } else {
      warnings.push('X-Content-Type-Options value should be set to nosniff.');
    }
  } else {
    missing.push('X-Content-Type-Options');
  }

  // 5. Referrer-Policy (Max 10)
  if (headers['referrer-policy']) {
    score += 10;
    const ref = headers['referrer-policy'].toLowerCase();
    if (ref.includes('unsafe-url') || ref.includes('no-referrer-when-downgrade')) {
      score -= 5;
      warnings.push('Referrer-Policy is configured to a weak security model.');
    }
  } else {
    missing.push('Referrer-Policy');
  }

  // 6. Permissions-Policy (Max 10)
  if (headers['permissions-policy']) {
    score += 10;
  } else {
    missing.push('Permissions-Policy');
  }

  // Grade Mapping
  let grade = 'F';
  if (score >= 90) {
    grade = missing.length === 0 ? 'A+' : 'A';
  } else if (score >= 75) {
    grade = 'B';
  } else if (score >= 60) {
    grade = 'C';
  } else if (score >= 40) {
    grade = 'D';
  }

  return { score, grade, headers, missing, warnings };
}
