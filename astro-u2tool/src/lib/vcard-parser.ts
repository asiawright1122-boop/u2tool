// vCard/VCF file parser

export interface VCardPhone {
  type: string;
  number: string;
}

export interface VCardEmail {
  type: string;
  address: string;
}

export interface VCardAddress {
  type: string;
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  formatted: string;
}

export interface VCardContact {
  fullName: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  prefix?: string;
  suffix?: string;
  nickname?: string;
  organization?: string;
  title?: string;
  phones: VCardPhone[];
  emails: VCardEmail[];
  addresses: VCardAddress[];
  urls: string[];
  notes?: string;
  birthday?: string;
  photo?: string;
  categories?: string[];
  uid?: string;
  version?: string;
}

export interface VCardParseResult {
  contacts: VCardContact[];
  errors: string[];
}

// Unfold lines (vCard uses line folding for long lines)
function unfoldLines(content: string): string {
  return content.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

// Unescape vCard text
function unescapeText(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

// Parse type parameters
function parseTypes(params: string): string[] {
  const types: string[] = [];
  const parts = params.split(';');
  
  for (const part of parts) {
    if (part.startsWith('TYPE=')) {
      types.push(...part.substring(5).split(','));
    } else if (['HOME', 'WORK', 'CELL', 'FAX', 'VOICE', 'PREF', 'INTERNET'].includes(part.toUpperCase())) {
      types.push(part);
    }
  }
  
  return types.map(t => t.toUpperCase());
}

// Parse a single property line
function parseProperty(line: string): { name: string; params: string; value: string } | null {
  const colonIndex = line.indexOf(':');
  if (colonIndex === -1) return null;
  
  const beforeColon = line.substring(0, colonIndex);
  const value = line.substring(colonIndex + 1);
  
  // Parse property name and parameters
  const semicolonIndex = beforeColon.indexOf(';');
  let name: string;
  let params = '';
  
  if (semicolonIndex === -1) {
    name = beforeColon;
  } else {
    name = beforeColon.substring(0, semicolonIndex);
    params = beforeColon.substring(semicolonIndex + 1);
  }
  
  return { name: name.toUpperCase(), params, value };
}

// Parse N (structured name) field
function parseName(value: string): { lastName?: string; firstName?: string; middleName?: string; prefix?: string; suffix?: string } {
  const parts = value.split(';');
  return {
    lastName: parts[0] ? unescapeText(parts[0]) : undefined,
    firstName: parts[1] ? unescapeText(parts[1]) : undefined,
    middleName: parts[2] ? unescapeText(parts[2]) : undefined,
    prefix: parts[3] ? unescapeText(parts[3]) : undefined,
    suffix: parts[4] ? unescapeText(parts[4]) : undefined,
  };
}

// Parse ADR (address) field
function parseAddress(value: string, params: string): VCardAddress {
  const parts = value.split(';');
  const types = parseTypes(params);
  
  const address: VCardAddress = {
    type: types.length > 0 ? types.join(', ') : 'OTHER',
    street: parts[2] ? unescapeText(parts[2]) : undefined,
    city: parts[3] ? unescapeText(parts[3]) : undefined,
    region: parts[4] ? unescapeText(parts[4]) : undefined,
    postalCode: parts[5] ? unescapeText(parts[5]) : undefined,
    country: parts[6] ? unescapeText(parts[6]) : undefined,
    formatted: '',
  };
  
  // Build formatted address
  const formattedParts = [
    address.street,
    address.city,
    address.region,
    address.postalCode,
    address.country,
  ].filter(Boolean);
  address.formatted = formattedParts.join(', ');
  
  return address;
}

// Parse vCard content
export function parseVCard(content: string): VCardParseResult {
  const result: VCardParseResult = {
    contacts: [],
    errors: [],
  };
  
  try {
    // Normalize line endings and unfold
    const normalizedContent = unfoldLines(content.replace(/\r\n/g, '\n').replace(/\r/g, '\n'));
    const lines = normalizedContent.split('\n');
    
    let inCard = false;
    let currentContact: Partial<VCardContact> = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const prop = parseProperty(line);
      if (!prop) continue;
      
      const { name, params, value } = prop;
      
      switch (name) {
        case 'BEGIN':
          if (value.toUpperCase() === 'VCARD') {
            inCard = true;
            currentContact = {
              fullName: '',
              phones: [],
              emails: [],
              addresses: [],
              urls: [],
            };
          }
          break;
          
        case 'END':
          if (value.toUpperCase() === 'VCARD' && inCard) {
            inCard = false;
            if (currentContact.fullName) {
              result.contacts.push(currentContact as VCardContact);
            }
            currentContact = {};
          }
          break;
          
        case 'VERSION':
          if (inCard) {
            currentContact.version = value;
          }
          break;
          
        case 'FN':
          if (inCard) {
            currentContact.fullName = unescapeText(value);
          }
          break;
          
        case 'N':
          if (inCard) {
            const nameParts = parseName(value);
            Object.assign(currentContact, nameParts);
          }
          break;
          
        case 'NICKNAME':
          if (inCard) {
            currentContact.nickname = unescapeText(value);
          }
          break;
          
        case 'ORG':
          if (inCard) {
            currentContact.organization = unescapeText(value.split(';')[0]);
          }
          break;
          
        case 'TITLE':
          if (inCard) {
            currentContact.title = unescapeText(value);
          }
          break;
          
        case 'TEL':
          if (inCard) {
            const types = parseTypes(params);
            currentContact.phones?.push({
              type: types.length > 0 ? types.join(', ') : 'OTHER',
              number: value,
            });
          }
          break;
          
        case 'EMAIL':
          if (inCard) {
            const types = parseTypes(params);
            currentContact.emails?.push({
              type: types.length > 0 ? types.join(', ') : 'OTHER',
              address: value,
            });
          }
          break;
          
        case 'ADR':
          if (inCard) {
            const address = parseAddress(value, params);
            if (address.formatted) {
              currentContact.addresses?.push(address);
            }
          }
          break;
          
        case 'URL':
          if (inCard) {
            currentContact.urls?.push(value);
          }
          break;
          
        case 'NOTE':
          if (inCard) {
            currentContact.notes = unescapeText(value);
          }
          break;
          
        case 'BDAY':
          if (inCard) {
            currentContact.birthday = value;
          }
          break;
          
        case 'PHOTO':
          if (inCard) {
            // Store photo data (could be URL or base64)
            currentContact.photo = value;
          }
          break;
          
        case 'CATEGORIES':
          if (inCard) {
            currentContact.categories = value.split(',').map(c => unescapeText(c.trim()));
          }
          break;
          
        case 'UID':
          if (inCard) {
            currentContact.uid = value;
          }
          break;
      }
    }
    
    // Sort contacts by name
    result.contacts.sort((a, b) => a.fullName.localeCompare(b.fullName));
    
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Failed to parse vCard content');
  }
  
  return result;
}

// Format phone number for display
export function formatPhone(phone: VCardPhone): string {
  return `${phone.type}: ${phone.number}`;
}

// Format email for display
export function formatEmail(email: VCardEmail): string {
  return `${email.type}: ${email.address}`;
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}
