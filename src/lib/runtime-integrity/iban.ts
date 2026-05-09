export interface IbanSpec {
  name: string;
  length: number;
  example: string;
}

interface IbanCountrySpec {
  code: string;
  name: string;
  length: number;
}

const IBAN_COUNTRIES: IbanCountrySpec[] = [
  { code: 'DE', name: 'Germany', length: 22 },
  { code: 'GB', name: 'United Kingdom', length: 22 },
  { code: 'FR', name: 'France', length: 27 },
  { code: 'ES', name: 'Spain', length: 24 },
  { code: 'IT', name: 'Italy', length: 27 },
  { code: 'NL', name: 'Netherlands', length: 18 },
  { code: 'BE', name: 'Belgium', length: 16 },
  { code: 'AT', name: 'Austria', length: 20 },
  { code: 'CH', name: 'Switzerland', length: 21 },
  { code: 'PL', name: 'Poland', length: 28 },
  { code: 'PT', name: 'Portugal', length: 25 },
  { code: 'IE', name: 'Ireland', length: 22 },
  { code: 'AD', name: 'Andorra', length: 24 },
  { code: 'AE', name: 'United Arab Emirates', length: 23 },
  { code: 'AL', name: 'Albania', length: 28 },
  { code: 'AX', name: 'Aland Islands', length: 18 },
  { code: 'AZ', name: 'Azerbaijan', length: 28 },
  { code: 'BA', name: 'Bosnia and Herzegovina', length: 20 },
  { code: 'BG', name: 'Bulgaria', length: 22 },
  { code: 'BH', name: 'Bahrain', length: 22 },
  { code: 'BR', name: 'Brazil', length: 29 },
  { code: 'BY', name: 'Belarus', length: 28 },
  { code: 'CR', name: 'Costa Rica', length: 22 },
  { code: 'CY', name: 'Cyprus', length: 28 },
  { code: 'CZ', name: 'Czech Republic', length: 24 },
  { code: 'DK', name: 'Denmark', length: 18 },
  { code: 'DO', name: 'Dominican Republic', length: 28 },
  { code: 'EE', name: 'Estonia', length: 20 },
  { code: 'EG', name: 'Egypt', length: 29 },
  { code: 'FI', name: 'Finland', length: 18 },
  { code: 'FO', name: 'Faroe Islands', length: 18 },
  { code: 'GE', name: 'Georgia', length: 22 },
  { code: 'GF', name: 'French Guiana', length: 27 },
  { code: 'GI', name: 'Gibraltar', length: 23 },
  { code: 'GL', name: 'Greenland', length: 18 },
  { code: 'GP', name: 'Guadeloupe', length: 27 },
  { code: 'GR', name: 'Greece', length: 27 },
  { code: 'GT', name: 'Guatemala', length: 28 },
  { code: 'HR', name: 'Croatia', length: 21 },
  { code: 'HU', name: 'Hungary', length: 28 },
  { code: 'IL', name: 'Israel', length: 23 },
  { code: 'IQ', name: 'Iraq', length: 23 },
  { code: 'IS', name: 'Iceland', length: 26 },
  { code: 'JO', name: 'Jordan', length: 30 },
  { code: 'KW', name: 'Kuwait', length: 30 },
  { code: 'KZ', name: 'Kazakhstan', length: 20 },
  { code: 'LB', name: 'Lebanon', length: 28 },
  { code: 'LC', name: 'Saint Lucia', length: 32 },
  { code: 'LI', name: 'Liechtenstein', length: 21 },
  { code: 'LT', name: 'Lithuania', length: 20 },
  { code: 'LU', name: 'Luxembourg', length: 20 },
  { code: 'LV', name: 'Latvia', length: 21 },
  { code: 'LY', name: 'Libya', length: 25 },
  { code: 'MC', name: 'Monaco', length: 27 },
  { code: 'MD', name: 'Moldova', length: 24 },
  { code: 'ME', name: 'Montenegro', length: 22 },
  { code: 'MF', name: 'Saint Martin', length: 27 },
  { code: 'MK', name: 'North Macedonia', length: 19 },
  { code: 'MN', name: 'Mongolia', length: 20 },
  { code: 'MQ', name: 'Martinique', length: 27 },
  { code: 'MR', name: 'Mauritania', length: 27 },
  { code: 'MT', name: 'Malta', length: 31 },
  { code: 'MU', name: 'Mauritius', length: 30 },
  { code: 'NC', name: 'New Caledonia', length: 27 },
  { code: 'NI', name: 'Nicaragua', length: 28 },
  { code: 'NO', name: 'Norway', length: 15 },
  { code: 'OM', name: 'Oman', length: 23 },
  { code: 'PF', name: 'French Polynesia', length: 27 },
  { code: 'PK', name: 'Pakistan', length: 24 },
  { code: 'PM', name: 'Saint Pierre and Miquelon', length: 27 },
  { code: 'PS', name: 'Palestine', length: 29 },
  { code: 'QA', name: 'Qatar', length: 29 },
  { code: 'RE', name: 'Reunion', length: 27 },
  { code: 'RO', name: 'Romania', length: 24 },
  { code: 'RS', name: 'Serbia', length: 22 },
  { code: 'RU', name: 'Russia', length: 33 },
  { code: 'SA', name: 'Saudi Arabia', length: 24 },
  { code: 'SC', name: 'Seychelles', length: 31 },
  { code: 'SD', name: 'Sudan', length: 18 },
  { code: 'SE', name: 'Sweden', length: 24 },
  { code: 'SI', name: 'Slovenia', length: 19 },
  { code: 'SK', name: 'Slovakia', length: 24 },
  { code: 'SM', name: 'San Marino', length: 27 },
  { code: 'SO', name: 'Somalia', length: 23 },
  { code: 'ST', name: 'Sao Tome and Principe', length: 25 },
  { code: 'SV', name: 'El Salvador', length: 28 },
  { code: 'TF', name: 'French Southern Territories', length: 27 },
  { code: 'TL', name: 'Timor-Leste', length: 23 },
  { code: 'TN', name: 'Tunisia', length: 24 },
  { code: 'TR', name: 'Turkey', length: 26 },
  { code: 'UA', name: 'Ukraine', length: 29 },
  { code: 'VA', name: 'Vatican City', length: 22 },
  { code: 'VG', name: 'Virgin Islands, British', length: 24 },
  { code: 'WF', name: 'Wallis and Futuna', length: 27 },
  { code: 'XK', name: 'Kosovo', length: 20 },
  { code: 'YT', name: 'Mayotte', length: 27 },
];

const KNOWN_EXAMPLES: Record<string, string> = {
  AT: 'AT611904300234573201',
  BE: 'BE68539007547034',
  CH: 'CH9300762011623852957',
  DE: 'DE89370400440532013000',
  ES: 'ES9121000418450200051332',
  FR: 'FR7630006000011234567890189',
  GB: 'GB82WEST12345698765432',
  IE: 'IE29AIBK93115212345678',
  IT: 'IT60X0542811101000000123456',
  NL: 'NL91ABNA0417164300',
  PL: 'PL61109010140000071219812874',
};

function ibanCharacterValue(char: string): string {
  return /[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char;
}

function ibanMod97(input: string): number {
  let remainder = 0;
  for (const char of input.toUpperCase()) {
    const value = ibanCharacterValue(char);
    for (const digit of value) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder;
}

function isValidIbanExample(example: string, length: number): boolean {
  const cleaned = example.replace(/\s/g, '').toUpperCase();
  if (cleaned.length !== length || !/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleaned)) {
    return false;
  }

  return ibanMod97(cleaned.slice(4) + cleaned.slice(0, 4)) === 1;
}

function buildSyntheticExample(countryCode: string, length: number): string {
  const bban = '0'.repeat(length - 4);
  const checkDigits = String(98 - ibanMod97(`${bban}${countryCode}00`)).padStart(2, '0');
  return `${countryCode}${checkDigits}${bban}`;
}

export const ibanSpecs: Record<string, IbanSpec> = Object.fromEntries(
  IBAN_COUNTRIES.map((country) => {
    const knownExample = KNOWN_EXAMPLES[country.code];
    const example =
      knownExample && isValidIbanExample(knownExample, country.length)
        ? knownExample
        : buildSyntheticExample(country.code, country.length);

    return [country.code, { name: country.name, length: country.length, example }];
  })
);
