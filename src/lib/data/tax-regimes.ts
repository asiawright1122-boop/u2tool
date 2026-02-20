/**
 * Tax Regime Data Structures and Configurations
 * 
 * This file contains the data structures and configurations for tax regimes
 * across different countries. Each country has its own tax brackets, deductions,
 * and special rules.
 * 
 * Data sources:
 * - US: IRS 2024 Tax Tables
 * - CN: China State Taxation Administration 2024
 * - JP: National Tax Agency Japan 2024
 * - KR: National Tax Service Korea 2024
 * - ES: Agencia Tributaria Spain 2024
 * - BR: Receita Federal Brazil 2024
 * - FR: Direction générale des Finances publiques 2024
 * - DE: Bundesministerium der Finanzen 2024
 * - RU: Federal Tax Service Russia 2024
 * - SA: General Authority of Zakat and Tax 2024
 */

// Tax bracket definition
export interface TaxBracket {
  min: number;           // Minimum income for this bracket
  max: number;           // Maximum income for this bracket (Infinity for no upper limit)
  rate: number;          // Tax rate as percentage
  deduction?: number;    // Quick deduction amount (optional, used in some countries like China)
}

// Deduction item definition
export interface Deduction {
  id: string;            // Unique identifier for the deduction
  nameKey: string;       // Translation key for the deduction name
  amount: number;        // Default/maximum deduction amount
  optional: boolean;     // Whether this deduction is optional
  customizable: boolean; // Whether user can input custom amount
  minAmount?: number;    // Minimum allowed amount
  maxAmount?: number;    // Maximum allowed amount
  perUnit?: string;      // Unit for the deduction (e.g., 'year', 'month', 'child')
  unitNameKey?: string;  // Translation key for the unit name
}

// Filing status definition
export interface FilingStatus {
  id: string;            // Unique identifier for the filing status
  nameKey: string;       // Translation key for the filing status name
  brackets: TaxBracket[]; // Tax brackets for this filing status
  standardDeduction: number; // Standard deduction amount
}

// Tax regime configuration for a country
export interface TaxRegime {
  countryCode: string;   // ISO country code (e.g., 'US', 'CN')
  countryNameKey: string; // Translation key for country name
  currency: string;      // ISO currency code (e.g., 'USD', 'CNY')
  currencySymbol: string; // Currency symbol for display
  year: number;          // Tax year for this data
  filingStatuses: FilingStatus[]; // Available filing statuses
  additionalDeductions: Deduction[]; // Additional deduction options
  hasLocalTax: boolean;  // Whether this country has local/regional tax
  localTaxRate?: number; // Local tax rate if applicable
  specialRules?: {       // Special rules or notes
    type: string;
    description: string;
  }[];
}

// Tax calculation result
export interface TaxResult {
  grossIncome: number;
  deductions: number;
  taxableIncome: number;
  totalTax: number;
  localTax?: number;     // Local tax amount if applicable
  effectiveRate: number;
  takeHomePay: number;
  bracketBreakdown: {
    bracket: TaxBracket;
    taxableInBracket: number;
    taxInBracket: number;
  }[];
}

// Tax regime data for all supported countries
export const TAX_REGIMES: Record<string, TaxRegime> = {
  // United States - 2024 Federal Tax Tables
  US: {
    countryCode: 'US',
    countryNameKey: 'countries.unitedStates',
    currency: 'USD',
    currencySymbol: '$',
    year: 2024,
    filingStatuses: [
      {
        id: 'single',
        nameKey: 'tax.filingStatus.single',
        standardDeduction: 14600,
        brackets: [
          { min: 0, max: 11600, rate: 10 },
          { min: 11600, max: 47150, rate: 12 },
          { min: 47150, max: 100525, rate: 22 },
          { min: 100525, max: 191950, rate: 24 },
          { min: 191950, max: 243725, rate: 32 },
          { min: 243725, max: 609350, rate: 35 },
          { min: 609350, max: Infinity, rate: 37 },
        ],
      },
      {
        id: 'married',
        nameKey: 'tax.filingStatus.married',
        standardDeduction: 29200,
        brackets: [
          { min: 0, max: 23200, rate: 10 },
          { min: 23200, max: 94300, rate: 12 },
          { min: 94300, max: 201050, rate: 22 },
          { min: 201050, max: 383900, rate: 24 },
          { min: 383900, max: 487450, rate: 32 },
          { min: 487450, max: 731200, rate: 35 },
          { min: 731200, max: Infinity, rate: 37 },
        ],
      },
      {
        id: 'headOfHousehold',
        nameKey: 'tax.filingStatus.headOfHousehold',
        standardDeduction: 21900,
        brackets: [
          { min: 0, max: 16550, rate: 10 },
          { min: 16550, max: 63100, rate: 12 },
          { min: 63100, max: 100500, rate: 22 },
          { min: 100500, max: 191950, rate: 24 },
          { min: 191950, max: 243700, rate: 32 },
          { min: 243700, max: 609350, rate: 35 },
          { min: 609350, max: Infinity, rate: 37 },
        ],
      },
    ],
    additionalDeductions: [
      // US itemized deductions (only used when itemizing instead of standard deduction)
      {
        id: 'mortgageInterest',
        nameKey: 'tax.deductions.mortgageInterest',
        amount: 0,
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 750000, // Interest on up to $750k mortgage
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'saltDeduction',
        nameKey: 'tax.deductions.saltDeduction',
        amount: 10000,
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 10000, // SALT cap
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'charitableDonations',
        nameKey: 'tax.deductions.charitableDonations',
        amount: 0,
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 100000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'medicalExpensesUS',
        nameKey: 'tax.deductions.medicalExpensesUS',
        amount: 0,
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 100000, // Expenses exceeding 7.5% of AGI
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
    ],
    hasLocalTax: false,
  },

  // China - 2024 Individual Income Tax
  CN: {
    countryCode: 'CN',
    countryNameKey: 'countries.china',
    currency: 'CNY',
    currencySymbol: '¥',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 60000, // Basic deduction: 5000 CNY/month * 12
        brackets: [
          { min: 0, max: 36000, rate: 3 },
          { min: 36000, max: 144000, rate: 10, deduction: 2520 },
          { min: 144000, max: 300000, rate: 20, deduction: 16920 },
          { min: 300000, max: 420000, rate: 25, deduction: 31920 },
          { min: 420000, max: 660000, rate: 30, deduction: 52920 },
          { min: 660000, max: 960000, rate: 35, deduction: 85920 },
          { min: 960000, max: Infinity, rate: 45, deduction: 181920 },
        ],
      },
    ],
    additionalDeductions: [
      { 
        id: 'childEducation', 
        nameKey: 'tax.deductions.childEducation', 
        amount: 24000,  // Per child per year (2000/month * 12)
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 240000, // Up to 10 children
        perUnit: 'child',
        unitNameKey: 'tax.units.perChildPerYear'
      },
      { 
        id: 'continuingEducation', 
        nameKey: 'tax.deductions.continuingEducation', 
        amount: 4800,  // Academic: 400/month, Vocational: 3600/year
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 4800,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      { 
        id: 'medicalExpenses', 
        nameKey: 'tax.deductions.medicalExpenses', 
        amount: 0,  // Actual expenses above 15000, max 80000
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 80000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      { 
        id: 'housingLoan', 
        nameKey: 'tax.deductions.housingLoan', 
        amount: 12000,  // 1000/month * 12
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 12000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      { 
        id: 'housingRent', 
        nameKey: 'tax.deductions.housingRent', 
        amount: 18000,  // Varies by city: 800-1500/month
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 18000,  // Max for tier-1 cities
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      { 
        id: 'elderCare', 
        nameKey: 'tax.deductions.elderCare', 
        amount: 36000,  // Only child: 3000/month, shared: varies
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 36000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      { 
        id: 'childUnder3', 
        nameKey: 'tax.deductions.childUnder3', 
        amount: 24000,  // Per child under 3: 2000/month
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 240000,
        perUnit: 'child',
        unitNameKey: 'tax.units.perChildPerYear'
      },
    ],
    hasLocalTax: false,
  },

  // Japan - 2024 Income Tax
  JP: {
    countryCode: 'JP',
    countryNameKey: 'countries.japan',
    currency: 'JPY',
    currencySymbol: '¥',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 480000, // Basic deduction
        brackets: [
          { min: 0, max: 1950000, rate: 5 },
          { min: 1950000, max: 3300000, rate: 10, deduction: 97500 },
          { min: 3300000, max: 6950000, rate: 20, deduction: 427500 },
          { min: 6950000, max: 9000000, rate: 23, deduction: 636000 },
          { min: 9000000, max: 18000000, rate: 33, deduction: 1536000 },
          { min: 18000000, max: 40000000, rate: 40, deduction: 2796000 },
          { min: 40000000, max: Infinity, rate: 45, deduction: 4796000 },
        ],
      },
    ],
    additionalDeductions: [
      {
        id: 'spouseDeduction',
        nameKey: 'tax.deductions.spouseDeduction',
        amount: 380000, // Spouse deduction
        optional: true,
        customizable: false,
        minAmount: 0,
        maxAmount: 380000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'dependentDeduction',
        nameKey: 'tax.deductions.dependentDeduction',
        amount: 380000, // Per dependent
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 1900000, // Up to 5 dependents
        perUnit: 'dependent',
        unitNameKey: 'tax.units.perDependent'
      },
      {
        id: 'socialInsurance',
        nameKey: 'tax.deductions.socialInsurance',
        amount: 0, // Actual amount paid
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 2000000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'lifeInsurance',
        nameKey: 'tax.deductions.lifeInsurance',
        amount: 0,
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 120000, // Max life insurance deduction
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'medicalExpensesJP',
        nameKey: 'tax.deductions.medicalExpensesJP',
        amount: 0, // Expenses exceeding 100,000 yen
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 2000000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
    ],
    hasLocalTax: true,
    localTaxRate: 10, // Resident tax approximately 10%
  },

  // South Korea - 2024 Income Tax
  KR: {
    countryCode: 'KR',
    countryNameKey: 'countries.southKorea',
    currency: 'KRW',
    currencySymbol: '₩',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 1500000, // Basic deduction
        brackets: [
          { min: 0, max: 14000000, rate: 6 },
          { min: 14000000, max: 50000000, rate: 15, deduction: 1260000 },
          { min: 50000000, max: 88000000, rate: 24, deduction: 5760000 },
          { min: 88000000, max: 150000000, rate: 35, deduction: 15440000 },
          { min: 150000000, max: 300000000, rate: 38, deduction: 19940000 },
          { min: 300000000, max: 500000000, rate: 40, deduction: 25940000 },
          { min: 500000000, max: 1000000000, rate: 42, deduction: 35940000 },
          { min: 1000000000, max: Infinity, rate: 45, deduction: 65940000 },
        ],
      },
    ],
    additionalDeductions: [
      {
        id: 'pensionInsurance',
        nameKey: 'tax.deductions.pensionInsurance',
        amount: 0, // National Pension contributions
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 5000000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'healthInsurance',
        nameKey: 'tax.deductions.healthInsurance',
        amount: 0, // Health insurance premiums
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 5000000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'creditCardDeduction',
        nameKey: 'tax.deductions.creditCardDeduction',
        amount: 0, // Credit card spending deduction
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 3000000, // Max deduction
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'educationExpenses',
        nameKey: 'tax.deductions.educationExpenses',
        amount: 0, // Education expenses
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 9000000, // University max
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'housingFundKR',
        nameKey: 'tax.deductions.housingFundKR',
        amount: 0, // Housing subscription savings
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 3000000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
    ],
    hasLocalTax: false,
  },

  // Spain - 2024 Income Tax
  ES: {
    countryCode: 'ES',
    countryNameKey: 'countries.spain',
    currency: 'EUR',
    currencySymbol: '€',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 5550, // Basic deduction
        brackets: [
          { min: 0, max: 12450, rate: 19 },
          { min: 12450, max: 20200, rate: 24 },
          { min: 20200, max: 35200, rate: 30 },
          { min: 35200, max: 60000, rate: 37 },
          { min: 60000, max: 300000, rate: 45 },
          { min: 300000, max: Infinity, rate: 47 },
        ],
      },
    ],
    additionalDeductions: [
      {
        id: 'socialSecurityES',
        nameKey: 'tax.deductions.socialSecurityES',
        amount: 0, // Social security contributions
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 15000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'pensionPlanES',
        nameKey: 'tax.deductions.pensionPlanES',
        amount: 0, // Private pension plan contributions
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 1500, // Max €1,500/year
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'mortgageDeductionES',
        nameKey: 'tax.deductions.mortgageDeductionES',
        amount: 0, // Primary residence mortgage (pre-2013)
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 9040, // Max €9,040/year
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'donationsES',
        nameKey: 'tax.deductions.donationsES',
        amount: 0, // Charitable donations
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 50000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
    ],
    hasLocalTax: false,
  },

  // Brazil - 2024 Income Tax
  BR: {
    countryCode: 'BR',
    countryNameKey: 'countries.brazil',
    currency: 'BRL',
    currencySymbol: 'R$',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 24511.92, // Annual basic deduction
        brackets: [
          { min: 0, max: 24511.92, rate: 0 },
          { min: 24511.92, max: 33919.80, rate: 7.5 },
          { min: 33919.80, max: 45012.60, rate: 15 },
          { min: 45012.60, max: 55976.16, rate: 22.5 },
          { min: 55976.16, max: Infinity, rate: 27.5 },
        ],
      },
    ],
    additionalDeductions: [
      {
        id: 'dependentBR',
        nameKey: 'tax.deductions.dependentBR',
        amount: 2275.08, // Per dependent per year
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 22750.80, // Up to 10 dependents
        perUnit: 'dependent',
        unitNameKey: 'tax.units.perDependent'
      },
      {
        id: 'educationBR',
        nameKey: 'tax.deductions.educationBR',
        amount: 0, // Education expenses
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 3561.50, // Max per person
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'healthExpensesBR',
        nameKey: 'tax.deductions.healthExpensesBR',
        amount: 0, // Medical expenses (no limit)
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 100000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'privatePensionBR',
        nameKey: 'tax.deductions.privatePensionBR',
        amount: 0, // PGBL contributions (up to 12% of income)
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 50000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
    ],
    hasLocalTax: false,
  },

  // France - 2024 Income Tax
  FR: {
    countryCode: 'FR',
    countryNameKey: 'countries.france',
    currency: 'EUR',
    currencySymbol: '€',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 10777, // Basic deduction
        brackets: [
          { min: 0, max: 10777, rate: 0 },
          { min: 10777, max: 27478, rate: 11 },
          { min: 27478, max: 78570, rate: 30 },
          { min: 78570, max: 168994, rate: 41 },
          { min: 168994, max: Infinity, rate: 45 },
        ],
      },
    ],
    additionalDeductions: [
      {
        id: 'professionalExpensesFR',
        nameKey: 'tax.deductions.professionalExpensesFR',
        amount: 0, // 10% automatic or actual expenses
        optional: true,
        customizable: true,
        minAmount: 505, // Minimum €505
        maxAmount: 14171, // Maximum €14,171
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'childcareFR',
        nameKey: 'tax.deductions.childcareFR',
        amount: 0, // Childcare expenses (50% tax credit)
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 3500, // Max €3,500 per child
        perUnit: 'child',
        unitNameKey: 'tax.units.perChildPerYear'
      },
      {
        id: 'donationsFR',
        nameKey: 'tax.deductions.donationsFR',
        amount: 0, // Charitable donations (66-75% tax reduction)
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 50000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'homeServicesFR',
        nameKey: 'tax.deductions.homeServicesFR',
        amount: 0, // Home services (50% tax credit)
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 12000, // Max €12,000/year
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'pensionSavingsFR',
        nameKey: 'tax.deductions.pensionSavingsFR',
        amount: 0, // PER retirement savings
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 35194, // 10% of income, max €35,194
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
    ],
    hasLocalTax: false,
  },

  // Germany - 2024 Income Tax
  DE: {
    countryCode: 'DE',
    countryNameKey: 'countries.germany',
    currency: 'EUR',
    currencySymbol: '€',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 10908, // Basic tax-free amount
        brackets: [
          { min: 0, max: 10908, rate: 0 },
          { min: 10908, max: 62809, rate: 14 }, // Progressive rate starts at 14%
          { min: 62809, max: 277825, rate: 42 },
          { min: 277825, max: Infinity, rate: 45 },
        ],
      },
    ],
    additionalDeductions: [
      {
        id: 'werbungskosten',
        nameKey: 'tax.deductions.werbungskosten',
        amount: 1230, // Employee lump sum (Arbeitnehmer-Pauschbetrag)
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 50000, // Can claim actual expenses if higher
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'sonderausgaben',
        nameKey: 'tax.deductions.sonderausgaben',
        amount: 36, // Special expenses lump sum
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 10000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'churchTaxDE',
        nameKey: 'tax.deductions.churchTaxDE',
        amount: 0, // Church tax (8-9% of income tax)
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 20000,
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'insuranceDE',
        nameKey: 'tax.deductions.insuranceDE',
        amount: 0, // Health, pension, unemployment insurance
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 25639, // Max for pension insurance
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
      {
        id: 'childAllowanceDE',
        nameKey: 'tax.deductions.childAllowanceDE',
        amount: 8952, // Child allowance per child (Kinderfreibetrag)
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 44760, // Up to 5 children
        perUnit: 'child',
        unitNameKey: 'tax.units.perChildPerYear'
      },
      {
        id: 'commuterAllowanceDE',
        nameKey: 'tax.deductions.commuterAllowanceDE',
        amount: 0, // Commuter allowance (€0.30/km first 20km, €0.38/km after)
        optional: true,
        customizable: true,
        minAmount: 0,
        maxAmount: 4500, // Typical max
        perUnit: 'year',
        unitNameKey: 'tax.units.perYear'
      },
    ],
    hasLocalTax: false,
  },

  // Russia - 2024 Income Tax
  RU: {
    countryCode: 'RU',
    countryNameKey: 'countries.russia',
    currency: 'RUB',
    currencySymbol: '₽',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 0,
        brackets: [
          { min: 0, max: Infinity, rate: 13 }, // Flat tax rate of 13%
        ],
      },
    ],
    additionalDeductions: [],
    hasLocalTax: false,
    specialRules: [
      {
        type: 'flatTax',
        description: 'Russia uses a flat tax rate of 13% for most income',
      },
    ],
  },

  // Saudi Arabia - 2024 (No Personal Income Tax)
  SA: {
    countryCode: 'SA',
    countryNameKey: 'countries.saudiArabia',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 0,
        brackets: [
          { min: 0, max: Infinity, rate: 0 }, // No personal income tax
        ],
      },
    ],
    additionalDeductions: [],
    hasLocalTax: false,
    specialRules: [
      {
        type: 'noIncomeTax',
        description: 'Saudi Arabia does not impose personal income tax on individuals',
      },
    ],
  },
};

/**
 * Get the default country code based on the user's locale
 * @param locale - User's locale code (e.g., 'en', 'zh', 'ja')
 * @returns Country code (e.g., 'US', 'CN', 'JP')
 */
export function getDefaultCountryForLocale(locale: string): string {
  const localeToCountry: Record<string, string> = {
    en: 'US',
    zh: 'CN',
    ja: 'JP',
    ko: 'KR',
    es: 'ES',
    pt: 'BR',
    fr: 'FR',
    de: 'DE',
    ru: 'RU',
    ar: 'SA',
  };
  return localeToCountry[locale] || 'US';
}
