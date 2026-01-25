// iCal/ICS file parser

export interface ICalEvent {
  uid: string;
  summary: string;
  description?: string;
  location?: string;
  dtstart: Date | null;
  dtend?: Date | null;
  dtstartStr: string;
  dtendStr?: string;
  rrule?: string;
  organizer?: string;
  attendees: string[];
  status?: string;
  categories?: string[];
  created?: Date | null;
  lastModified?: Date | null;
  sequence?: number;
  transp?: string;
  url?: string;
}

export interface ICalParseResult {
  events: ICalEvent[];
  calendarName?: string;
  timezone?: string;
  prodId?: string;
  version?: string;
  errors: string[];
}

// Parse iCal date format (YYYYMMDD or YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ)
function parseICalDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Remove any TZID prefix
  const cleanStr = dateStr.replace(/^TZID=[^:]+:/, '');
  
  try {
    // Format: YYYYMMDD
    if (cleanStr.length === 8) {
      const year = parseInt(cleanStr.substring(0, 4));
      const month = parseInt(cleanStr.substring(4, 6)) - 1;
      const day = parseInt(cleanStr.substring(6, 8));
      return new Date(year, month, day);
    }
    
    // Format: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
    if (cleanStr.length >= 15) {
      const year = parseInt(cleanStr.substring(0, 4));
      const month = parseInt(cleanStr.substring(4, 6)) - 1;
      const day = parseInt(cleanStr.substring(6, 8));
      const hour = parseInt(cleanStr.substring(9, 11));
      const minute = parseInt(cleanStr.substring(11, 13));
      const second = parseInt(cleanStr.substring(13, 15));
      
      if (cleanStr.endsWith('Z')) {
        return new Date(Date.UTC(year, month, day, hour, minute, second));
      }
      return new Date(year, month, day, hour, minute, second);
    }
    
    return null;
  } catch {
    return null;
  }
}

// Unfold lines (iCal uses line folding for long lines)
function unfoldLines(content: string): string {
  return content.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

// Unescape iCal text
function unescapeText(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

// Parse a single property line
function parseProperty(line: string): { name: string; params: Record<string, string>; value: string } | null {
  const colonIndex = line.indexOf(':');
  if (colonIndex === -1) return null;
  
  const beforeColon = line.substring(0, colonIndex);
  const value = line.substring(colonIndex + 1);
  
  // Parse property name and parameters
  const semicolonIndex = beforeColon.indexOf(';');
  let name: string;
  const params: Record<string, string> = {};
  
  if (semicolonIndex === -1) {
    name = beforeColon;
  } else {
    name = beforeColon.substring(0, semicolonIndex);
    const paramStr = beforeColon.substring(semicolonIndex + 1);
    const paramParts = paramStr.split(';');
    for (const part of paramParts) {
      const eqIndex = part.indexOf('=');
      if (eqIndex !== -1) {
        params[part.substring(0, eqIndex)] = part.substring(eqIndex + 1);
      }
    }
  }
  
  return { name: name.toUpperCase(), params, value };
}

// Parse iCal content
export function parseICal(content: string): ICalParseResult {
  const result: ICalParseResult = {
    events: [],
    errors: [],
  };
  
  try {
    // Normalize line endings and unfold
    const normalizedContent = unfoldLines(content.replace(/\r\n/g, '\n').replace(/\r/g, '\n'));
    const lines = normalizedContent.split('\n');
    
    let inEvent = false;
    let currentEvent: Partial<ICalEvent> = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const prop = parseProperty(line);
      if (!prop) continue;
      
      const { name, params, value } = prop;
      
      // Calendar-level properties
      if (!inEvent) {
        switch (name) {
          case 'CALNAME':
          case 'X-WR-CALNAME':
            result.calendarName = unescapeText(value);
            break;
          case 'X-WR-TIMEZONE':
            result.timezone = value;
            break;
          case 'PRODID':
            result.prodId = value;
            break;
          case 'VERSION':
            result.version = value;
            break;
          case 'BEGIN':
            if (value === 'VEVENT') {
              inEvent = true;
              currentEvent = { attendees: [] };
            }
            break;
        }
      } else {
        // Event-level properties
        switch (name) {
          case 'END':
            if (value === 'VEVENT') {
              inEvent = false;
              if (currentEvent.uid && currentEvent.summary) {
                result.events.push(currentEvent as ICalEvent);
              }
              currentEvent = {};
            }
            break;
          case 'UID':
            currentEvent.uid = value;
            break;
          case 'SUMMARY':
            currentEvent.summary = unescapeText(value);
            break;
          case 'DESCRIPTION':
            currentEvent.description = unescapeText(value);
            break;
          case 'LOCATION':
            currentEvent.location = unescapeText(value);
            break;
          case 'DTSTART':
            currentEvent.dtstartStr = value;
            currentEvent.dtstart = parseICalDate(value);
            break;
          case 'DTEND':
            currentEvent.dtendStr = value;
            currentEvent.dtend = parseICalDate(value);
            break;
          case 'RRULE':
            currentEvent.rrule = value;
            break;
          case 'ORGANIZER':
            currentEvent.organizer = value.replace(/^mailto:/i, '');
            break;
          case 'ATTENDEE':
            const email = value.replace(/^mailto:/i, '');
            if (!currentEvent.attendees) currentEvent.attendees = [];
            currentEvent.attendees.push(email);
            break;
          case 'STATUS':
            currentEvent.status = value;
            break;
          case 'CATEGORIES':
            currentEvent.categories = value.split(',').map(c => c.trim());
            break;
          case 'CREATED':
            currentEvent.created = parseICalDate(value);
            break;
          case 'LAST-MODIFIED':
            currentEvent.lastModified = parseICalDate(value);
            break;
          case 'SEQUENCE':
            currentEvent.sequence = parseInt(value) || 0;
            break;
          case 'TRANSP':
            currentEvent.transp = value;
            break;
          case 'URL':
            currentEvent.url = value;
            break;
        }
      }
    }
    
    // Sort events by start date
    result.events.sort((a, b) => {
      if (!a.dtstart) return 1;
      if (!b.dtstart) return -1;
      return a.dtstart.getTime() - b.dtstart.getTime();
    });
    
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Failed to parse iCal content');
  }
  
  return result;
}

// Format date for display
export function formatEventDate(date: Date | null | undefined): string {
  if (!date) return 'N/A';
  return date.toLocaleString();
}

// Parse RRULE to human-readable format
export function parseRRule(rrule: string): string {
  if (!rrule) return '';
  
  const parts = rrule.split(';');
  const rules: Record<string, string> = {};
  
  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key && value) {
      rules[key] = value;
    }
  }
  
  let result = '';
  
  switch (rules.FREQ) {
    case 'DAILY':
      result = 'Daily';
      break;
    case 'WEEKLY':
      result = 'Weekly';
      if (rules.BYDAY) {
        const days = rules.BYDAY.split(',').map(d => {
          const dayMap: Record<string, string> = {
            'MO': 'Mon', 'TU': 'Tue', 'WE': 'Wed', 'TH': 'Thu',
            'FR': 'Fri', 'SA': 'Sat', 'SU': 'Sun'
          };
          return dayMap[d] || d;
        });
        result += ` on ${days.join(', ')}`;
      }
      break;
    case 'MONTHLY':
      result = 'Monthly';
      break;
    case 'YEARLY':
      result = 'Yearly';
      break;
    default:
      result = rrule;
  }
  
  if (rules.INTERVAL && rules.INTERVAL !== '1') {
    result = `Every ${rules.INTERVAL} ${rules.FREQ?.toLowerCase().replace('ly', 's') || 'times'}`;
  }
  
  if (rules.COUNT) {
    result += `, ${rules.COUNT} times`;
  }
  
  if (rules.UNTIL) {
    const untilDate = parseICalDate(rules.UNTIL);
    if (untilDate) {
      result += ` until ${untilDate.toLocaleDateString()}`;
    }
  }
  
  return result;
}
