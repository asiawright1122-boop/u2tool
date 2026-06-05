export interface DockerComposeService {
  image: string;
  container_name?: string;
  restart?: string;
  ports?: string[];
  volumes?: string[];
  environment?: Record<string, string>;
  env_file?: string[];
  networks?: string[];
  command?: string[];
  privileged?: boolean;
}

export function parseDockerRun(commandStr: string): DockerComposeService {
  if (!commandStr || !commandStr.trim()) {
    return { image: '' };
  }

  // 1. Clean line wraps like backslash-newline
  const cleanCmd = commandStr.replace(/\\\r?\n/g, ' ').replace(/\s+/g, ' ').trim();

  // 2. Tokenize command preserving quoted strings
  const tokens: string[] = [];
  let current = '';
  let inQuote: string | null = null;

  for (let i = 0; i < cleanCmd.length; i++) {
    const char = cleanCmd[i];
    if ((char === '"' || char === "'") && (i === 0 || cleanCmd[i - 1] !== '\\')) {
      if (inQuote === char) {
        inQuote = null;
      } else if (!inQuote) {
        inQuote = char;
      } else {
        current += char;
      }
    } else if (char === ' ' && !inQuote) {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  if (current) {
    tokens.push(current);
  }

  // 3. Remove leading docker run or run
  if (tokens[0] === 'docker' && tokens[1] === 'run') {
    tokens.splice(0, 2);
  } else if (tokens[0] === 'run') {
    tokens.shift();
  }

  const service: DockerComposeService = { image: '' };
  const trailingArgs: string[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    // If it looks like a flag
    if (token.startsWith('-')) {
      if (token === '-d' || token === '--detach') {
        i++;
      } else if (token === '--privileged') {
        service.privileged = true;
        i++;
      } else if (token === '--name') {
        if (i + 1 < tokens.length) {
          service.container_name = cleanQuote(tokens[i + 1]);
        }
        i += 2;
      } else if (token === '-p' || token === '--publish') {
        if (i + 1 < tokens.length) {
          service.ports = service.ports || [];
          service.ports.push(cleanQuote(tokens[i + 1]));
        }
        i += 2;
      } else if (token === '-v' || token === '--volume') {
        if (i + 1 < tokens.length) {
          service.volumes = service.volumes || [];
          service.volumes.push(cleanQuote(tokens[i + 1]));
        }
        i += 2;
      } else if (token === '-e' || token === '--env') {
        if (i + 1 < tokens.length) {
          const envVal = tokens[i + 1];
          const eqIdx = envVal.indexOf('=');
          if (eqIdx !== -1) {
            service.environment = service.environment || {};
            const key = envVal.substring(0, eqIdx);
            const val = envVal.substring(eqIdx + 1);
            service.environment[key] = cleanQuote(val);
          } else {
            // Env var without value (e.g. -e KEY)
            service.environment = service.environment || {};
            service.environment[envVal] = '';
          }
        }
        i += 2;
      } else if (token === '--env-file') {
        if (i + 1 < tokens.length) {
          service.env_file = service.env_file || [];
          service.env_file.push(cleanQuote(tokens[i + 1]));
        }
        i += 2;
      } else if (token === '--restart') {
        if (i + 1 < tokens.length) {
          service.restart = cleanQuote(tokens[i + 1]);
        }
        i += 2;
      } else if (token === '--network' || token === '--net') {
        if (i + 1 < tokens.length) {
          service.networks = service.networks || [];
          service.networks.push(cleanQuote(tokens[i + 1]));
        }
        i += 2;
      } else {
        // Unknown flag - if it takes an argument, skip both, or just skip one
        // For simple TDD, if next token doesn't start with '-', we assume it's a value
        if (i + 1 < tokens.length && !tokens[i + 1].startsWith('-')) {
          i += 2;
        } else {
          i++;
        }
      }
    } else {
      trailingArgs.push(token);
      i++;
    }
  }

  // 4. Resolve image and command
  if (trailingArgs.length > 0) {
    service.image = cleanQuote(trailingArgs[0]);
    if (trailingArgs.length > 1) {
      service.command = trailingArgs.slice(1).map(cleanQuote);
    }
  }

  return service;
}

function cleanQuote(str: string): string {
  if (!str) return '';
  return str.replace(/^["']|["']$/g, '').trim();
}
