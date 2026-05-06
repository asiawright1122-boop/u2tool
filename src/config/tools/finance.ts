import type { Tool } from './types';

export const FINANCE_TOOLS: Tool[] = [
  { slug: 'currency-converter', category: 'finance', icon: 'wallet', component: 'CurrencyConverter' },
  { slug: 'roi-calculator', category: 'finance', icon: 'wallet', component: 'RoiCalculator' },
  { slug: 'mortgage-calculator', category: 'finance', icon: 'wallet', component: 'MortgageCalculator' },
  { slug: 'tax-calculator', category: 'finance', icon: 'wallet', component: 'TaxCalculator' },
  { slug: 'iban-validator', category: 'finance', icon: 'wallet', component: 'IbanValidator' },
  { slug: 'vat-calculator', category: 'finance', icon: 'wallet', component: 'VatCalculator' },
  { slug: 'bic-swift-lookup', category: 'finance', icon: 'wallet', component: 'BicSwiftLookup' },
  { slug: 'credit-card-validator', category: 'finance', icon: 'wallet', component: 'CreditCardValidator' },
  { slug: 'inflation-calculator', category: 'finance', icon: 'wallet', component: 'InflationCalculator' },
  { slug: 'break-even-calculator', category: 'finance', icon: 'wallet', component: 'BreakEvenCalculator' },
  { slug: 'margin-calculator', category: 'finance', icon: 'wallet', component: 'MarginCalculator' },
  { slug: 'markup-calculator', category: 'finance', icon: 'wallet', component: 'MarkupCalculator' },
  { slug: 'invoice-template-generator', category: 'finance', icon: 'wallet', component: 'InvoiceTemplateGenerator' },
  { slug: 'expense-report-generator', category: 'finance', icon: 'wallet', component: 'ExpenseReportGenerator' },
  { slug: 'budget-variance-analyzer', category: 'finance', icon: 'wallet', component: 'BudgetVarianceAnalyzer' },
  { slug: 'cost-benefit-analyzer', category: 'finance', icon: 'wallet', component: 'CostBenefitAnalyzer' },
  { slug: 'financial-forecast-calculator', category: 'finance', icon: 'wallet', component: 'FinancialForecastCalculator' },
];
