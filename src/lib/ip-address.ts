export type IpAddressFamily = 'ipv4' | 'ipv6';

export function isValidIpv4(input: string): boolean {
  const parts = input.trim().split('.');
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    if (!/^\d{1,3}$/.test(part)) return false;
    const value = Number(part);
    return value >= 0 && value <= 255;
  });
}
export function isValidIpv6(input: string): boolean {
  const value = input.trim();
  if (!value.includes(':') || value.includes('%')) return false;

  try {
    const url = new URL(`http://[${value}]/`);
    return url.hostname.startsWith('[') && url.hostname.endsWith(']');
  } catch {
    return false;
  }
}

export function classifyIpAddress(input: string): IpAddressFamily | null {
  if (isValidIpv4(input)) return 'ipv4';
  if (isValidIpv6(input)) return 'ipv6';
  return null;
}
