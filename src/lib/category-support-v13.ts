import type { CategorySupportContent } from './category-support';

type V13Category = 'finance' | 'generators' | 'lifestyle';
type V13Locale = 'en';

export const v13PriorityClusters: Array<{ category: V13Category; locale: V13Locale }> = [
  { locale: 'en', category: 'finance' },
  { locale: 'en', category: 'generators' },
  { locale: 'en', category: 'lifestyle' },
];

export const v13SupportContent: Record<V13Locale, Record<V13Category, CategorySupportContent>> = {
  en: {
    finance: {
      eyebrow: 'For practical money planning',
      title: 'Finance tools for fees, investing, debt payoff, and cash-flow decisions',
      intro:
        'The finance category now connects high-intent calculators with everyday money workflows: estimating marketplace fees, sizing trades, checking debt payoff order, planning savings, and reviewing international payment data without uploading private documents.',
      highlightsTitle: 'What this category is strongest for',
      highlights: [
        'Compare stock profit, CAGR, dividend yield, market cap, and position size before you act.',
        'Estimate PayPal, Etsy, freelance, loan, savings, and debt payoff scenarios in one browser workflow.',
        'Validate payment identifiers and prepare finance documents while keeping the final decision with your own records and advisors.',
      ],
      workflowsTitle: 'Suggested workflows',
      workflows: [
        {
          title: 'Investment and trading checks',
          description: 'Review return, income, valuation, and risk-size assumptions before recording a trade idea.',
          toolSlugs: ['stock-profit-calculator', 'cagr-calculator', 'position-size-calculator'],
        },
        {
          title: 'Business fees and freelance pricing',
          description: 'Estimate platform fees, required rates, and profit margins before publishing a price or invoice.',
          toolSlugs: ['paypal-fee-calculator', 'etsy-fee-calculator', 'freelance-rate-calculator'],
        },
        {
          title: 'Debt, savings, and payment data',
          description: 'Plan payoff order, project savings targets, and check financial identifiers before sharing payment details.',
          toolSlugs: ['debt-snowball-calculator', 'savings-goal-calculator', 'iban-validator'],
        },
      ],
      noteTitle: 'Trust boundary',
      note:
        'These tools calculate scenarios and validation clues locally in the browser. They do not provide financial advice, move money, or verify accounts with a bank.',
    },
    generators: {
      eyebrow: 'For copy, metadata, and creator workflows',
      title: 'Generator tools for SEO snippets, social posts, video metadata, and campaign drafts',
      intro:
        'The generator category is most useful when it turns a blank page into structured options: SEO titles, meta descriptions, YouTube metadata, email copy, captions, product descriptions, and FAQs that teams can review before publishing.',
      highlightsTitle: 'What this category helps generate',
      highlights: [
        'Create SEO titles, meta descriptions, blog titles, and FAQ drafts with visible structure and copy actions.',
        'Prepare YouTube titles, descriptions, tags, and social captions without connecting to social platforms.',
        'Draft product, email, and campaign copy from concrete inputs while keeping final review with the user.',
      ],
      workflowsTitle: 'Suggested workflows',
      workflows: [
        {
          title: 'Search snippet drafting',
          description: 'Move from page topic to title, meta description, and FAQ candidates that can be reviewed for accuracy.',
          toolSlugs: ['seo-title-generator', 'meta-description-generator', 'faq-generator'],
        },
        {
          title: 'Video and creator metadata',
          description: 'Draft titles, descriptions, and tags for creator planning without posting or using live platform data.',
          toolSlugs: ['youtube-title-generator', 'youtube-description-generator', 'youtube-tags-generator'],
        },
        {
          title: 'Campaign and product copy',
          description: 'Generate subject lines, preview text, and product descriptions for human editing before launch.',
          toolSlugs: ['email-subject-line-generator', 'email-preview-text-generator', 'product-description-generator'],
        },
      ],
      noteTitle: 'Publishing boundary',
      note:
        'Generator tools create local drafts and copy-ready variants. They do not guarantee ranking, send email, post to social networks, or replace factual review.',
    },
    lifestyle: {
      eyebrow: 'For personal planning and repeatable habits',
      title: 'Lifestyle tools for calories, macros, sleep, hydration, training, and everyday cost checks',
      intro:
        'The lifestyle category supports practical self-management: nutrition targets, calorie deficits, macro splits, strength estimates, sleep windows, hydration planning, pace checks, and household cost calculators that stay in the browser.',
      highlightsTitle: 'What this category can support',
      highlights: [
        'Estimate calorie intake, calorie deficit, macro targets, water intake, and sleep timing for planning.',
        'Check training numbers such as one-rep max and pace before logging workouts elsewhere.',
        'Review everyday fuel, electricity, and carbon footprint estimates without turning them into professional advice.',
      ],
      workflowsTitle: 'Suggested workflows',
      workflows: [
        {
          title: 'Nutrition planning',
          description: 'Estimate daily calories, planned deficit, and macro ranges before checking them against your own routine.',
          toolSlugs: ['calorie-calculator', 'calorie-deficit-calculator', 'macro-calculator'],
        },
        {
          title: 'Training and recovery',
          description: 'Plan lifting targets, pace, sleep windows, and hydration reminders around a workout schedule.',
          toolSlugs: ['one-rep-max-calculator', 'pace-calculator', 'sleep-calculator'],
        },
        {
          title: 'Daily cost and footprint estimates',
          description: 'Model household or travel estimates for fuel, electricity, and carbon footprint planning.',
          toolSlugs: ['fuel-cost-calculator', 'electricity-cost-calculator', 'carbon-footprint-calculator'],
        },
      ],
      noteTitle: 'Health boundary',
      note:
        'Lifestyle calculators are planning aids only. They do not diagnose conditions, prescribe diets, or replace medical, nutrition, or coaching advice.',
    },
  },
};
