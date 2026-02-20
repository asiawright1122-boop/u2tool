// Ring size conversion data
// Supports US, UK, EU, and Asian sizing systems

export interface RingSizeRow {
  us: number;        // US/Canada size
  uk: string;        // UK/Australia/Ireland (letter)
  eu: number;        // EU/France/Russia (circumference mm)
  jp: number;        // Japan
  diameter: number;  // Inner diameter in mm
  circumference: number; // Inner circumference in mm
}

export const ringSizes: RingSizeRow[] = [
  { us: 3, uk: 'F', eu: 44, jp: 4, diameter: 14.1, circumference: 44.2 },
  { us: 3.5, uk: 'G', eu: 45, jp: 5, diameter: 14.5, circumference: 45.5 },
  { us: 4, uk: 'H', eu: 46.5, jp: 7, diameter: 14.9, circumference: 46.8 },
  { us: 4.5, uk: 'I', eu: 48, jp: 8, diameter: 15.3, circumference: 48.0 },
  { us: 5, uk: 'J', eu: 49, jp: 9, diameter: 15.7, circumference: 49.3 },
  { us: 5.5, uk: 'K', eu: 50, jp: 10, diameter: 16.1, circumference: 50.6 },
  { us: 6, uk: 'L', eu: 51.5, jp: 12, diameter: 16.5, circumference: 51.9 },
  { us: 6.5, uk: 'M', eu: 52.5, jp: 13, diameter: 16.9, circumference: 53.1 },
  { us: 7, uk: 'N', eu: 54, jp: 14, diameter: 17.3, circumference: 54.4 },
  { us: 7.5, uk: 'O', eu: 55, jp: 15, diameter: 17.7, circumference: 55.7 },
  { us: 8, uk: 'P', eu: 57, jp: 16, diameter: 18.1, circumference: 57.0 },
  { us: 8.5, uk: 'Q', eu: 58, jp: 17, diameter: 18.5, circumference: 58.3 },
  { us: 9, uk: 'R', eu: 59, jp: 18, diameter: 18.9, circumference: 59.5 },
  { us: 9.5, uk: 'S', eu: 60.5, jp: 19, diameter: 19.4, circumference: 60.8 },
  { us: 10, uk: 'T', eu: 62, jp: 20, diameter: 19.8, circumference: 62.1 },
  { us: 10.5, uk: 'U', eu: 63, jp: 22, diameter: 20.2, circumference: 63.4 },
  { us: 11, uk: 'V', eu: 64, jp: 23, diameter: 20.6, circumference: 64.6 },
  { us: 11.5, uk: 'W', eu: 65.5, jp: 24, diameter: 21.0, circumference: 65.9 },
  { us: 12, uk: 'X', eu: 66.5, jp: 25, diameter: 21.4, circumference: 67.2 },
  { us: 12.5, uk: 'Y', eu: 68, jp: 26, diameter: 21.8, circumference: 68.5 },
  { us: 13, uk: 'Z', eu: 69, jp: 27, diameter: 22.2, circumference: 69.7 },
  { us: 13.5, uk: 'Z+1', eu: 70, jp: 28, diameter: 22.6, circumference: 71.0 },
  { us: 14, uk: 'Z+2', eu: 71.5, jp: 29, diameter: 23.0, circumference: 72.3 },
  { us: 15, uk: 'Z+4', eu: 74, jp: 31, diameter: 23.8, circumference: 74.8 },
];

export type RingSizeSystem = 'us' | 'uk' | 'eu' | 'jp' | 'diameter' | 'circumference';

// Get ring size by US size
export function getRingSizeByUS(usSize: number): RingSizeRow | null {
  return ringSizes.find(row => row.us === usSize) || null;
}

// Convert ring size from one system to another
export function convertRingSize(
  size: number | string,
  fromSystem: RingSizeSystem,
  toSystem: RingSizeSystem
): number | string | null {
  let row: RingSizeRow | undefined;
  
  if (fromSystem === 'uk') {
    row = ringSizes.find(r => r.uk === size);
  } else {
    const numSize = typeof size === 'string' ? parseFloat(size) : size;
    let minDiff = Infinity;
    
    for (const r of ringSizes) {
      const diff = Math.abs(r[fromSystem as keyof Omit<RingSizeRow, 'uk'>] - numSize);
      if (diff < minDiff) {
        minDiff = diff;
        row = r;
      }
    }
  }
  
  if (!row) return null;
  
  return row[toSystem as keyof RingSizeRow];
}

// Calculate ring size from finger measurement
export function calculateRingSizeFromMeasurement(
  measurement: number,
  measurementType: 'diameter' | 'circumference'
): RingSizeRow | null {
  let closestRow: RingSizeRow | null = null;
  let minDiff = Infinity;
  
  for (const row of ringSizes) {
    const diff = Math.abs(row[measurementType] - measurement);
    if (diff < minDiff) {
      minDiff = diff;
      closestRow = row;
    }
  }
  
  return closestRow;
}

// Get all available sizes for a system
export function getAvailableRingSizes(system: RingSizeSystem): (number | string)[] {
  if (system === 'uk') {
    return ringSizes.map(row => row.uk);
  }
  return ringSizes.map(row => row[system as keyof Omit<RingSizeRow, 'uk'>]);
}

// Size system display names
export const ringSizeSystemNames: Record<RingSizeSystem, string> = {
  us: 'US/Canada',
  uk: 'UK/AU/IE',
  eu: 'EU/FR/RU',
  jp: 'Japan',
  diameter: 'Diameter (mm)',
  circumference: 'Circumference (mm)',
};

// Tips for measuring ring size
export const measurementTips = [
  'Measure your finger at the end of the day when it\'s largest',
  'Measure multiple times for accuracy',
  'Consider the width of the ring - wider bands need larger sizes',
  'Temperature affects finger size - avoid measuring when very cold or hot',
  'If between sizes, choose the larger size',
];
