/**
 * Calculator Utilities
 * Shared utility functions for calculator tools
 */

import { calculateTimedTypingResult } from './typing-speed-test';

// ============================================
// Loan Calculator Functions
// ============================================

export interface LoanInput {
  principal: number;
  interestRate: number; // Annual interest rate as percentage (e.g., 5 for 5%)
  termMonths: number;
  paymentFrequency: 'monthly' | 'biweekly' | 'weekly';
}

export interface AmortizationEntry {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanResult {
  periodicPayment: number;
  totalInterest: number;
  totalAmount: number;
  amortizationSchedule: AmortizationEntry[];
}

export function calculateLoan(input: LoanInput): LoanResult {
  const { principal, interestRate, termMonths, paymentFrequency } = input;
  
  // Convert annual rate to periodic rate
  const periodsPerYear = paymentFrequency === 'monthly' ? 12 : paymentFrequency === 'biweekly' ? 26 : 52;
  const totalPeriods = Math.round(termMonths * (periodsPerYear / 12));
  const periodicRate = (interestRate / 100) / periodsPerYear;
  
  // Calculate periodic payment using amortization formula
  // P = L[c(1 + c)^n]/[(1 + c)^n - 1]
  let periodicPayment: number;
  if (periodicRate === 0) {
    periodicPayment = principal / totalPeriods;
  } else {
    const factor = Math.pow(1 + periodicRate, totalPeriods);
    periodicPayment = principal * (periodicRate * factor) / (factor - 1);
  }
  
  // Generate amortization schedule
  const amortizationSchedule: AmortizationEntry[] = [];
  let balance = principal;
  let totalInterest = 0;
  
  for (let period = 1; period <= totalPeriods; period++) {
    const interestPayment = balance * periodicRate;
    const principalPayment = periodicPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);
    totalInterest += interestPayment;
    
    amortizationSchedule.push({
      period,
      payment: periodicPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance,
    });
  }
  
  return {
    periodicPayment,
    totalInterest,
    totalAmount: principal + totalInterest,
    amortizationSchedule,
  };
}

// ============================================
// BMI Calculator Functions
// ============================================

export interface BmiInput {
  weight: number;
  height: number;
  unit: 'metric' | 'imperial';
}

export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  healthyWeightRange: { min: number; max: number };
}

export function calculateBmi(input: BmiInput): BmiResult {
  const { weight, height, unit } = input;
  
  let bmi: number;
  let heightInMeters: number;
  
  if (unit === 'metric') {
    // Weight in kg, height in cm
    heightInMeters = height / 100;
    bmi = weight / (heightInMeters * heightInMeters);
  } else {
    // Weight in lbs, height in inches
    heightInMeters = height * 0.0254;
    const weightInKg = weight * 0.453592;
    bmi = weightInKg / (heightInMeters * heightInMeters);
  }
  
  // Determine category based on WHO standards
  let category: BmiCategory;
  if (bmi < 18.5) {
    category = 'underweight';
  } else if (bmi < 25) {
    category = 'normal';
  } else if (bmi < 30) {
    category = 'overweight';
  } else {
    category = 'obese';
  }
  
  // Calculate healthy weight range (BMI 18.5-24.9)
  const heightSquared = heightInMeters * heightInMeters;
  let healthyWeightRange: { min: number; max: number };
  
  if (unit === 'metric') {
    healthyWeightRange = {
      min: 18.5 * heightSquared,
      max: 24.9 * heightSquared,
    };
  } else {
    healthyWeightRange = {
      min: (18.5 * heightSquared) / 0.453592,
      max: (24.9 * heightSquared) / 0.453592,
    };
  }
  
  return { bmi, category, healthyWeightRange };
}

// ============================================
// Age Calculator Functions
// ============================================

export interface AgeInput {
  birthDate: Date;
  referenceDate?: Date;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthday: Date;
  daysUntilBirthday: number;
}

export function calculateAge(input: AgeInput): AgeResult {
  const { birthDate, referenceDate = new Date() } = input;
  
  // Calculate total days
  const diffTime = referenceDate.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate years, months, days
  let years = referenceDate.getFullYear() - birthDate.getFullYear();
  let months = referenceDate.getMonth() - birthDate.getMonth();
  let days = referenceDate.getDate() - birthDate.getDate();
  
  if (days < 0) {
    months--;
    const prevMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Calculate next birthday
  let nextBirthday = new Date(
    referenceDate.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  
  if (nextBirthday <= referenceDate) {
    nextBirthday = new Date(
      referenceDate.getFullYear() + 1,
      birthDate.getMonth(),
      birthDate.getDate()
    );
  }
  
  const daysUntilBirthday = Math.ceil(
    (nextBirthday.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return {
    years,
    months,
    days,
    totalDays,
    nextBirthday,
    daysUntilBirthday,
  };
}

// ============================================
// Tip Calculator Functions
// ============================================

export interface TipInput {
  billAmount: number;
  tipPercentage: number;
  splitCount: number;
}

export interface TipResult {
  tipAmount: number;
  totalAmount: number;
  perPersonAmount: number;
  perPersonTip: number;
}

export function calculateTip(input: TipInput): TipResult {
  const { billAmount, tipPercentage, splitCount } = input;
  
  const tipAmount = billAmount * (tipPercentage / 100);
  const totalAmount = billAmount + tipAmount;
  const perPersonAmount = totalAmount / splitCount;
  const perPersonTip = tipAmount / splitCount;
  
  return {
    tipAmount,
    totalAmount,
    perPersonAmount,
    perPersonTip,
  };
}

// ============================================
// Discount Calculator Functions
// ============================================

export interface DiscountInput {
  originalPrice: number;
  discountPercentage: number;
  additionalDiscounts?: number[];
}

export interface DiscountResult {
  discountedPrice: number;
  amountSaved: number;
  totalDiscountPercentage: number;
}

export function calculateDiscount(input: DiscountInput): DiscountResult {
  const { originalPrice, discountPercentage, additionalDiscounts = [] } = input;
  
  // Apply primary discount
  let currentPrice = originalPrice * (1 - discountPercentage / 100);
  
  // Apply additional discounts sequentially
  for (const discount of additionalDiscounts) {
    currentPrice = currentPrice * (1 - discount / 100);
  }
  
  const amountSaved = originalPrice - currentPrice;
  const totalDiscountPercentage = (amountSaved / originalPrice) * 100;
  
  return {
    discountedPrice: currentPrice,
    amountSaved,
    totalDiscountPercentage,
  };
}

// Reverse calculation: find discount percentage from prices
export function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
  return ((originalPrice - salePrice) / originalPrice) * 100;
}

// ============================================
// Compound Interest Calculator Functions
// ============================================

export interface CompoundInterestInput {
  principal: number;
  annualRate: number; // As percentage (e.g., 5 for 5%)
  years: number;
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
  regularContribution?: number;
  contributionFrequency?: 'monthly' | 'annually';
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalInterest: number;
  totalContributions: number;
  growthData: { year: number; balance: number }[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const {
    principal,
    annualRate,
    years,
    compoundingFrequency,
    regularContribution = 0,
    contributionFrequency = 'monthly',
  } = input;
  
  // Compounding periods per year
  const n = compoundingFrequency === 'daily' ? 365 :
            compoundingFrequency === 'monthly' ? 12 :
            compoundingFrequency === 'quarterly' ? 4 : 1;
  
  const r = annualRate / 100;
  const growthData: { year: number; balance: number }[] = [];
  
  let balance = principal;
  let totalContributions = 0;
  
  // Calculate year by year for growth data
  for (let year = 1; year <= years; year++) {
    // Compound interest for this year
    balance = balance * Math.pow(1 + r / n, n);
    
    // Add contributions
    if (regularContribution > 0) {
      const contributionsThisYear = contributionFrequency === 'monthly' 
        ? regularContribution * 12 
        : regularContribution;
      balance += contributionsThisYear;
      totalContributions += contributionsThisYear;
    }
    
    growthData.push({ year, balance });
  }
  
  const finalAmount = balance;
  const totalInterest = finalAmount - principal - totalContributions;
  
  return {
    finalAmount,
    totalInterest,
    totalContributions,
    growthData,
  };
}


// ============================================
// Binary Calculator Functions
// ============================================

export interface BinaryResult {
  binary: string;
  decimal: number;
  hexadecimal: string;
}

export function validateBinary(value: string): boolean {
  return /^[01]+$/.test(value);
}

export function binaryToDecimal(binary: string): number {
  return parseInt(binary, 2);
}

export function decimalToBinary(decimal: number): string {
  return (decimal >>> 0).toString(2);
}

export function performBinaryOperation(
  operand1: string,
  operand2: string | undefined,
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor' | 'not' | 'leftShift' | 'rightShift',
  shiftAmount?: number
): BinaryResult {
  const num1 = binaryToDecimal(operand1);
  const num2 = operand2 ? binaryToDecimal(operand2) : 0;
  
  let result: number;
  
  switch (operation) {
    case 'add':
      result = num1 + num2;
      break;
    case 'subtract':
      result = num1 - num2;
      break;
    case 'multiply':
      result = num1 * num2;
      break;
    case 'divide':
      result = Math.floor(num1 / num2);
      break;
    case 'and':
      result = num1 & num2;
      break;
    case 'or':
      result = num1 | num2;
      break;
    case 'xor':
      result = num1 ^ num2;
      break;
    case 'not':
      result = ~num1 >>> 0; // Unsigned NOT
      break;
    case 'leftShift':
      result = num1 << (shiftAmount || 1);
      break;
    case 'rightShift':
      result = num1 >>> (shiftAmount || 1);
      break;
    default:
      result = 0;
  }
  
  return {
    binary: decimalToBinary(result),
    decimal: result,
    hexadecimal: result.toString(16).toUpperCase(),
  };
}

// ============================================
// Hex Calculator Functions
// ============================================

export interface HexResult {
  hexadecimal: string;
  decimal: number;
  binary: string;
}

export function validateHex(value: string): boolean {
  return /^[0-9A-Fa-f]+$/.test(value);
}

export function hexToDecimal(hex: string): number {
  return parseInt(hex, 16);
}

export function decimalToHex(decimal: number): string {
  return (decimal >>> 0).toString(16).toUpperCase();
}

export function performHexOperation(
  operand1: string,
  operand2: string | undefined,
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor' | 'not'
): HexResult {
  const num1 = hexToDecimal(operand1);
  const num2 = operand2 ? hexToDecimal(operand2) : 0;
  
  let result: number;
  
  switch (operation) {
    case 'add':
      result = num1 + num2;
      break;
    case 'subtract':
      result = num1 - num2;
      break;
    case 'multiply':
      result = num1 * num2;
      break;
    case 'divide':
      result = Math.floor(num1 / num2);
      break;
    case 'and':
      result = num1 & num2;
      break;
    case 'or':
      result = num1 | num2;
      break;
    case 'xor':
      result = num1 ^ num2;
      break;
    case 'not':
      result = ~num1 >>> 0;
      break;
    default:
      result = 0;
  }
  
  return {
    hexadecimal: decimalToHex(result),
    decimal: result,
    binary: decimalToBinary(result),
  };
}

// ============================================
// IP Subnet Calculator Functions
// ============================================

export interface SubnetInput {
  ipAddress: string;
  subnetMask: string | number; // CIDR notation (e.g., 24) or dotted decimal
}

export interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  usableHosts: number;
  subnetMask: string;
  cidr: number;
  wildcardMask: string;
}

export function validateIpAddress(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  return parts.every(part => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
}

export function validateSubnetMask(mask: string | number): boolean {
  if (typeof mask === 'number') {
    return mask >= 0 && mask <= 32;
  }
  
  // Validate dotted decimal format
  if (!validateIpAddress(mask)) return false;
  
  // Check if it's a valid subnet mask (contiguous 1s followed by 0s)
  const binary = mask.split('.')
    .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
    .join('');
  
  return /^1*0*$/.test(binary);
}

function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function numberToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

function cidrToMask(cidr: number): number {
  return cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
}

function maskToCidr(mask: number): number {
  let cidr = 0;
  let m = mask;
  while (m) {
    cidr += m & 1;
    m >>>= 1;
  }
  return cidr;
}

export function calculateSubnet(input: SubnetInput): SubnetResult {
  const { ipAddress, subnetMask } = input;
  
  const ipNum = ipToNumber(ipAddress);
  
  let maskNum: number;
  let cidr: number;
  
  if (typeof subnetMask === 'number') {
    cidr = subnetMask;
    maskNum = cidrToMask(cidr);
  } else {
    maskNum = ipToNumber(subnetMask);
    cidr = maskToCidr(maskNum);
  }
  
  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | (~maskNum >>> 0)) >>> 0;
  const wildcardNum = (~maskNum) >>> 0;
  
  const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr) - 2;
  
  return {
    networkAddress: numberToIp(networkNum),
    broadcastAddress: numberToIp(broadcastNum),
    firstHost: numberToIp(networkNum + 1),
    lastHost: numberToIp(broadcastNum - 1),
    usableHosts,
    subnetMask: numberToIp(maskNum),
    cidr,
    wildcardMask: numberToIp(wildcardNum),
  };
}

// ============================================
// Aspect Ratio Calculator Functions
// ============================================

export interface AspectRatioResult {
  ratioWidth: number;
  ratioHeight: number;
  decimal: number;
  percentage: string;
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function calculateAspectRatio(width: number, height: number): AspectRatioResult {
  const divisor = gcd(width, height);
  const ratioWidth = width / divisor;
  const ratioHeight = height / divisor;
  const decimal = width / height;
  const percentage = ((width / height) * 100).toFixed(2) + '%';
  
  return {
    ratioWidth,
    ratioHeight,
    decimal,
    percentage,
  };
}

export function calculateDimensionFromRatio(
  knownDimension: number,
  isWidth: boolean,
  ratioWidth: number,
  ratioHeight: number
): number {
  if (isWidth) {
    // Known dimension is width, calculate height
    return (knownDimension * ratioHeight) / ratioWidth;
  } else {
    // Known dimension is height, calculate width
    return (knownDimension * ratioWidth) / ratioHeight;
  }
}

// ============================================
// Typing Speed Calculator Functions
// ============================================

export interface TypingTestResult {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  duration: number; // in seconds
}

export function calculateTypingStats(
  targetText: string,
  typedText: string,
  durationMs: number
): TypingTestResult {
  const timedResult = calculateTimedTypingResult({
    targetText,
    typedText,
    elapsedMs: durationMs,
    intervalCorrectCharCounts: [],
  });

  return {
    wpm: timedResult.wpm,
    accuracy: timedResult.accuracy,
    correctChars: timedResult.correctChars,
    incorrectChars: timedResult.incorrectChars,
    totalChars: Array.from(typedText).length,
    duration: timedResult.elapsedSeconds,
  };
}

// ============================================
// Morse Code Functions
// ============================================

const MORSE_CODE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
  '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  ' ': '/',
};

const REVERSE_MORSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE_MAP).map(([k, v]) => [v, k])
);

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map(char => MORSE_CODE_MAP[char] || '')
    .filter(code => code !== '')
    .join(' ');
}

export function morseToText(morse: string): string {
  return morse
    .split(' ')
    .map(code => {
      if (code === '/') return ' ';
      return REVERSE_MORSE_MAP[code] || '';
    })
    .join('');
}

// ============================================
// Input Validation Utilities
// ============================================

export function isPositiveNumber(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && value > 0;
}

export function isNonNegativeNumber(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
}

export function isValidPercentage(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && value >= 0 && value <= 100;
}

export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function isFutureDate(date: Date, referenceDate: Date = new Date()): boolean {
  return date.getTime() > referenceDate.getTime();
}
