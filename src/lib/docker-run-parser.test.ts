import { describe, it, expect } from 'vitest';
import { parseDockerRun } from './docker-run-parser';

describe('Docker Run Parser', () => {
  it('should parse standard docker run options correctly', () => {
    const command = 'docker run -d --name test-nginx -p 8080:80 -v /host/path:/container/path -e MY_ENV=prod --restart always nginx:alpine';
    const result = parseDockerRun(command);
    expect(result).toEqual({
      image: 'nginx:alpine',
      container_name: 'test-nginx',
      restart: 'always',
      ports: ['8080:80'],
      volumes: ['/host/path:/container/path'],
      environment: { MY_ENV: 'prod' }
    });
  });

  it('should handle missing docker prefix and only contain run', () => {
    const command = 'run --name test-db postgres:15';
    const result = parseDockerRun(command);
    expect(result.image).toBe('postgres:15');
    expect(result.container_name).toBe('test-db');
  });

  it('should parse multiple environment variables, ports and volumes', () => {
    const command = `docker run \\
      -e KEY1=val1 \\
      -e KEY2="val2 space" \\
      -p 3000:3000 -p 80:80 \\
      -v /var/run/docker.sock:/var/run/docker.sock \\
      -v config_vol:/app/config \\
      node:20-alpine npm run dev`;
    const result = parseDockerRun(command);
    expect(result.image).toBe('node:20-alpine');
    expect(result.ports).toEqual(['3000:3000', '80:80']);
    expect(result.volumes).toEqual(['/var/run/docker.sock:/var/run/docker.sock', 'config_vol:/app/config']);
    expect(result.environment).toEqual({
      KEY1: 'val1',
      KEY2: 'val2 space'
    });
    expect(result.command).toEqual(['npm', 'run', 'dev']);
  });

  it('should handle edge cases with no options', () => {
    const command = 'ubuntu';
    const result = parseDockerRun(command);
    expect(result).toEqual({
      image: 'ubuntu'
    });
  });

  it('should return empty if command is empty or invalid', () => {
    const result = parseDockerRun('');
    expect(result).toEqual({
      image: ''
    });
  });
});
