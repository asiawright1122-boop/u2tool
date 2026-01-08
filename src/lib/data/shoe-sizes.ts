// Shoe size conversion data
// Supports US, UK, EU, and Asian (JP/CN) sizing systems

export interface ShoeSizeRow {
  us_men: number;
  us_women: number;
  uk: number;
  eu: number;
  jp: number; // Japanese size (cm)
  cn: number; // Chinese size
}

// Men's shoe size conversion table
export const mensShoeSizes: ShoeSizeRow[] = [
  { us_men: 6, us_women: 7.5, uk: 5.5, eu: 39, jp: 24, cn: 39 },
  { us_men: 6.5, us_women: 8, uk: 6, eu: 39.5, jp: 24.5, cn: 39.5 },
  { us_men: 7, us_women: 8.5, uk: 6.5, eu: 40, jp: 25, cn: 40 },
  { us_men: 7.5, us_women: 9, uk: 7, eu: 40.5, jp: 25.5, cn: 40.5 },
  { us_men: 8, us_women: 9.5, uk: 7.5, eu: 41, jp: 26, cn: 41 },
  { us_men: 8.5, us_women: 10, uk: 8, eu: 42, jp: 26.5, cn: 42 },
  { us_men: 9, us_women: 10.5, uk: 8.5, eu: 42.5, jp: 27, cn: 42.5 },
  { us_men: 9.5, us_women: 11, uk: 9, eu: 43, jp: 27.5, cn: 43 },
  { us_men: 10, us_women: 11.5, uk: 9.5, eu: 44, jp: 28, cn: 44 },
  { us_men: 10.5, us_women: 12, uk: 10, eu: 44.5, jp: 28.5, cn: 44.5 },
  { us_men: 11, us_women: 12.5, uk: 10.5, eu: 45, jp: 29, cn: 45 },
  { us_men: 11.5, us_women: 13, uk: 11, eu: 45.5, jp: 29.5, cn: 45.5 },
  { us_men: 12, us_women: 13.5, uk: 11.5, eu: 46, jp: 30, cn: 46 },
  { us_men: 13, us_women: 14.5, uk: 12.5, eu: 47, jp: 31, cn: 47 },
  { us_men: 14, us_women: 15.5, uk: 13.5, eu: 48, jp: 32, cn: 48 },
];

// Women's shoe size conversion table
export const womensShoeSizes: ShoeSizeRow[] = [
  { us_men: 3.5, us_women: 5, uk: 2.5, eu: 35, jp: 21.5, cn: 35 },
  { us_men: 4, us_women: 5.5, uk: 3, eu: 35.5, jp: 22, cn: 35.5 },
  { us_men: 4.5, us_women: 6, uk: 3.5, eu: 36, jp: 22.5, cn: 36 },
  { us_men: 5, us_women: 6.5, uk: 4, eu: 36.5, jp: 23, cn: 36.5 },
  { us_men: 5.5, us_women: 7, uk: 4.5, eu: 37, jp: 23.5, cn: 37 },
  { us_men: 6, us_women: 7.5, uk: 5, eu: 37.5, jp: 24, cn: 37.5 },
  { us_men: 6.5, us_women: 8, uk: 5.5, eu: 38, jp: 24.5, cn: 38 },
  { us_men: 7, us_women: 8.5, uk: 6, eu: 38.5, jp: 25, cn: 38.5 },
  { us_men: 7.5, us_women: 9, uk: 6.5, eu: 39, jp: 25.5, cn: 39 },
  { us_men: 8, us_women: 9.5, uk: 7, eu: 40, jp: 26, cn: 40 },
  { us_men: 8.5, us_women: 10, uk: 7.5, eu: 40.5, jp: 26.5, cn: 40.5 },
  { us_men: 9, us_women: 10.5, uk: 8, eu: 41, jp: 27, cn: 41 },
  { us_men: 9.5, us_women: 11, uk: 8.5, eu: 42, jp: 27.5, cn: 42 },
  { us_men: 10, us_women: 11.5, uk: 9, eu: 42.5, jp: 28, cn: 42.5 },
];

export type SizeSystem = 'us_men' | 'us_women' | 'uk' | 'eu' | 'jp' | 'cn';
export type Gender = 'men' | 'women';

// Get shoe sizes table based on gender
export function getShoeSizes(gender: Gender): ShoeSizeRow[] {
  return gender === 'men' ? mensShoeSizes : womensShoeSizes;
}

// Convert shoe size from one system to another
export function convertShoeSize(
  size: number,
  fromSystem: SizeSystem,
  toSystem: SizeSystem,
  gender: Gender
): number | null {
  const sizes = getShoeSizes(gender);
  
  // Find the closest matching size
  let closestRow: ShoeSizeRow | null = null;
  let minDiff = Infinity;
  
  for (const row of sizes) {
    const diff = Math.abs(row[fromSystem] - size);
    if (diff < minDiff) {
      minDiff = diff;
      closestRow = row;
    }
  }
  
  if (!closestRow || minDiff > 1) {
    return null;
  }
  
  return closestRow[toSystem];
}

// Get all available sizes for a system
export function getAvailableSizes(system: SizeSystem, gender: Gender): number[] {
  const sizes = getShoeSizes(gender);
  return sizes.map(row => row[system]);
}

// Size system display names
export const sizeSystemNames: Record<SizeSystem, string> = {
  us_men: 'US Men',
  us_women: 'US Women',
  uk: 'UK',
  eu: 'EU',
  jp: 'JP (cm)',
  cn: 'CN',
};
