export interface BicInfo {
  bankName: string;
  city: string;
  country: string;
  branch?: string;
}

export interface PhysicalConstant {
  symbol: string;
  name: string;
  value: number;
  unit: string;
}

export const runtimeBicDatabase: Record<string, BicInfo> = {
  // United States
  'CHASUS33XXX': { bankName: 'JPMorgan Chase Bank, N.A.', city: 'New York', country: 'US', branch: 'Head Office' },
  'BOFAUS3NXXX': { bankName: 'Bank of America, N.A.', city: 'Charlotte', country: 'US', branch: 'Head Office' },
  'CITIUS33XXX': { bankName: 'Citibank, N.A.', city: 'New York', country: 'US', branch: 'Head Office' },
  'WFBIUS6SXXX': { bankName: 'Wells Fargo Bank, N.A.', city: 'San Francisco', country: 'US', branch: 'Head Office' },

  // China
  'ICBKCNBJXXX': { bankName: 'Industrial and Commercial Bank of China', city: 'Beijing', country: 'CN', branch: 'Head Office' },
  'BKCHCNBJXXX': { bankName: 'Bank of China', city: 'Beijing', country: 'CN', branch: 'Head Office' },
  'PCBCCNBJXXX': { bankName: 'China Construction Bank', city: 'Beijing', country: 'CN', branch: 'Head Office' },
  'ABOCCNBJXXX': { bankName: 'Agricultural Bank of China', city: 'Beijing', country: 'CN', branch: 'Head Office' },

  // United Kingdom
  'HSBCGB2DXXX': { bankName: 'HSBC Bank plc', city: 'London', country: 'GB', branch: 'Head Office' },
  'BARCGB22XXX': { bankName: 'Barclays Bank PLC', city: 'London', country: 'GB', branch: 'Head Office' },
  'LOYDGB2LXXX': { bankName: 'Lloyds Bank plc', city: 'London', country: 'GB', branch: 'Head Office' },

  // Germany
  'DEUTDEDDFXX': { bankName: 'Deutsche Bank AG', city: 'Frankfurt am Main', country: 'DE', branch: 'Head Office' },
  'COBATEDDFXX': { bankName: 'Commerzbank AG', city: 'Frankfurt am Main', country: 'DE', branch: 'Head Office' },

  // France
  'BNPAFRPPXXX': { bankName: 'BNP Paribas', city: 'Paris', country: 'FR', branch: 'Head Office' },
  'SOGEFRPPXXX': { bankName: 'Societe Generale', city: 'Paris', country: 'FR', branch: 'Head Office' },

  // Japan
  'BOTKJPJTXXX': { bankName: 'MUFG Bank, Ltd.', city: 'Tokyo', country: 'JP', branch: 'Head Office' },
  'MHCBJPJTXXX': { bankName: 'Mizuho Bank, Ltd.', city: 'Tokyo', country: 'JP', branch: 'Head Office' }
};

export const runtimeK: PhysicalConstant[] = [
  { symbol: 'c', name: 'Speed of Light in Vacuum', value: 299792458, unit: 'm/s' },
  { symbol: 'G', name: 'Newtonian Constant of Gravitation', value: 6.6743e-11, unit: 'm^3 kg^-1 s^-2' },
  { symbol: 'h', name: 'Planck Constant', value: 6.62607015e-34, unit: 'J s' },
  { symbol: 'k_B', name: 'Boltzmann Constant', value: 1.380649e-23, unit: 'J/K' },
  { symbol: 'e', name: 'Elementary Charge', value: 1.602176634e-19, unit: 'C' },
  { symbol: 'N_A', name: 'Avogadro Constant', value: 6.02214076e23, unit: 'mol^-1' },
  { symbol: 'R', name: 'Molar Gas Constant', value: 8.314462618, unit: 'J mol^-1 K^-1' }
];
