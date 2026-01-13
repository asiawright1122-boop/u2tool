/**
 * GEO 优化的工具 FAQ 配置 - 第二十六批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_26: ToolSpecificFAQ[] = [
  // Invoice Generator
  {
    slug: 'invoice-generator',
    faqs: {
      en: [
        { question: 'How do I create an invoice?', answer: 'Enter business info, client details, line items with prices. We generate professional PDF invoice to download.' },
        { question: 'What information should an invoice include?', answer: 'Invoice number, date, due date, your info, client info, itemized services/products, totals, payment terms.' },
        { question: 'Can I customize the invoice template?', answer: 'Yes, add logo, choose colors, adjust layout. Save templates for consistent branding.' },
      ],
      zh: [
        { question: '如何创建发票？', answer: '输入商业信息、客户详情、带价格的项目。我们生成专业的 PDF 发票供下载。' },
        { question: '发票应该包含哪些信息？', answer: '发票号、日期、到期日、您的信息、客户信息、逐项服务/产品、总计、付款条款。' },
        { question: '可以自定义发票模板吗？', answer: '是的，添加 Logo、选择颜色、调整布局。保存模板以保持一致的品牌形象。' },
      ],
    },
  },

  // Receipt Generator
  {
    slug: 'receipt-generator',
    faqs: {
      en: [
        { question: 'How do I create a receipt?', answer: 'Enter transaction details, items, amounts, payment method. Generate printable receipt instantly.' },
        { question: 'What is the difference between invoice and receipt?', answer: 'Invoice: request for payment (before). Receipt: proof of payment (after). Both document transactions.' },
        { question: 'Can I create receipts for cash payments?', answer: 'Yes, receipts work for any payment method: cash, card, check, transfer. Document all transactions.' },
      ],
      zh: [
        { question: '如何创建收据？', answer: '输入交易详情、项目、金额、付款方式。立即生成可打印的收据。' },
        { question: '发票和收据有什么区别？', answer: '发票：付款请求（之前）。收据：付款证明（之后）。两者都记录交易。' },
        { question: '可以为现金付款创建收据吗？', answer: '是的，收据适用于任何付款方式：现金、卡、支票、转账。记录所有交易。' },
      ],
    },
  },

  // Business Card Generator
  {
    slug: 'business-card-generator',
    faqs: {
      en: [
        { question: 'How do I design a business card?', answer: 'Enter name, title, contact info. Choose template, customize colors and fonts. Download print-ready PDF.' },
        { question: 'What size should a business card be?', answer: 'Standard: 3.5 × 2 inches (US) or 85 × 55 mm (EU). We provide correct dimensions for printing.' },
        { question: 'What information should be on a business card?', answer: 'Name, title, company, phone, email, website. Optional: address, social media, QR code.' },
      ],
      zh: [
        { question: '如何设计名片？', answer: '输入姓名、职位、联系信息。选择模板，自定义颜色和字体。下载可打印的 PDF。' },
        { question: '名片应该是什么尺寸？', answer: '标准：3.5 × 2 英寸（美国）或 85 × 55 毫米（欧洲）。我们提供正确的打印尺寸。' },
        { question: '名片上应该有什么信息？', answer: '姓名、职位、公司、电话、电子邮件、网站。可选：地址、社交媒体、二维码。' },
      ],
    },
  },

  // Resume Builder
  {
    slug: 'resume-builder',
    faqs: {
      en: [
        { question: 'How do I create a resume?', answer: 'Enter personal info, work experience, education, skills. Choose template. Download as PDF or Word.' },
        { question: 'What sections should a resume have?', answer: 'Contact info, summary/objective, work experience, education, skills. Optional: certifications, projects, languages.' },
        { question: 'How long should a resume be?', answer: 'Entry level: 1 page. Experienced: 1-2 pages. Executive: 2-3 pages. Quality over quantity.' },
      ],
      zh: [
        { question: '如何创建简历？', answer: '输入个人信息、工作经验、教育、技能。选择模板。下载为 PDF 或 Word。' },
        { question: '简历应该有哪些部分？', answer: '联系信息、摘要/目标、工作经验、教育、技能。可选：证书、项目、语言。' },
        { question: '简历应该多长？', answer: '入门级：1 页。有经验：1-2 页。高管：2-3 页。质量重于数量。' },
      ],
    },
  },

  // Cover Letter Generator
  {
    slug: 'cover-letter-generator',
    faqs: {
      en: [
        { question: 'How do I write a cover letter?', answer: 'Enter job details, your experience, why you\'re interested. We generate personalized cover letter.' },
        { question: 'What should a cover letter include?', answer: 'Opening hook, why this company, relevant experience, specific achievements, call to action, professional closing.' },
        { question: 'How long should a cover letter be?', answer: '3-4 paragraphs, under 1 page. Be concise and specific. Hiring managers skim quickly.' },
      ],
      zh: [
        { question: '如何写求职信？', answer: '输入职位详情、您的经验、为什么感兴趣。我们生成个性化的求职信。' },
        { question: '求职信应该包含什么？', answer: '开头吸引点、为什么选择这家公司、相关经验、具体成就、行动号召、专业结尾。' },
        { question: '求职信应该多长？', answer: '3-4 段，不超过 1 页。简洁具体。招聘经理快速浏览。' },
      ],
    },
  },

  // Signature Generator
  {
    slug: 'signature-generator',
    faqs: {
      en: [
        { question: 'How do I create a digital signature?', answer: 'Draw with mouse/touch, type your name and choose font, or upload image. Download as PNG with transparency.' },
        { question: 'Is a digital signature legally valid?', answer: 'Depends on jurisdiction and document type. Many countries accept digital signatures. Check local laws.' },
        { question: 'What format should I save my signature?', answer: 'PNG with transparent background for documents. SVG for scalability. We provide multiple formats.' },
      ],
      zh: [
        { question: '如何创建数字签名？', answer: '用鼠标/触摸绘制，输入您的名字并选择字体，或上传图像。下载带透明度的 PNG。' },
        { question: '数字签名在法律上有效吗？', answer: '取决于司法管辖区和文档类型。许多国家接受数字签名。检查当地法律。' },
        { question: '我应该以什么格式保存签名？', answer: '用于文档的透明背景 PNG。用于可缩放性的 SVG。我们提供多种格式。' },
      ],
    },
  },

  // Email Signature Generator
  {
    slug: 'email-signature-generator',
    faqs: {
      en: [
        { question: 'How do I create an email signature?', answer: 'Enter name, title, contact info, social links. Choose design. Copy HTML or image for your email client.' },
        { question: 'What should an email signature include?', answer: 'Name, title, company, phone, email. Optional: photo, logo, social icons, legal disclaimer.' },
        { question: 'How do I add signature to Gmail/Outlook?', answer: 'Copy generated HTML. Go to email settings > signature. Paste HTML. We provide step-by-step guides.' },
      ],
      zh: [
        { question: '如何创建电子邮件签名？', answer: '输入姓名、职位、联系信息、社交链接。选择设计。复制 HTML 或图像到您的邮件客户端。' },
        { question: '电子邮件签名应该包含什么？', answer: '姓名、职位、公司、电话、电子邮件。可选：照片、Logo、社交图标、法律免责声明。' },
        { question: '如何将签名添加到 Gmail/Outlook？', answer: '复制生成的 HTML。转到邮件设置 > 签名。粘贴 HTML。我们提供分步指南。' },
      ],
    },
  },

  // Privacy Policy Generator
  {
    slug: 'privacy-policy-generator',
    faqs: {
      en: [
        { question: 'Why do I need a privacy policy?', answer: 'Required by law (GDPR, CCPA) if you collect any user data. Builds trust. Required by app stores and ad networks.' },
        { question: 'What should a privacy policy include?', answer: 'Data collected, how it\'s used, third-party sharing, cookies, user rights, contact info, update date.' },
        { question: 'Is the generated policy legally compliant?', answer: 'Our templates follow GDPR/CCPA guidelines. For complex cases, consult a lawyer. Customize for your specific use.' },
      ],
      zh: [
        { question: '为什么我需要隐私政策？', answer: '如果您收集任何用户数据，法律要求（GDPR、CCPA）。建立信任。应用商店和广告网络要求。' },
        { question: '隐私政策应该包含什么？', answer: '收集的数据、如何使用、第三方共享、Cookie、用户权利、联系信息、更新日期。' },
        { question: '生成的政策在法律上合规吗？', answer: '我们的模板遵循 GDPR/CCPA 指南。对于复杂情况，请咨询律师。根据您的具体用途自定义。' },
      ],
    },
  },

  // Terms of Service Generator
  {
    slug: 'terms-generator',
    faqs: {
      en: [
        { question: 'Why do I need terms of service?', answer: 'Protects your business legally. Defines user responsibilities. Limits liability. Required for most online services.' },
        { question: 'What should terms of service include?', answer: 'Acceptance, user obligations, prohibited uses, intellectual property, disclaimers, limitation of liability, termination.' },
        { question: 'How often should I update terms?', answer: 'When services change significantly, laws change, or annually. Notify users of material changes.' },
      ],
      zh: [
        { question: '为什么我需要服务条款？', answer: '在法律上保护您的业务。定义用户责任。限制责任。大多数在线服务都需要。' },
        { question: '服务条款应该包含什么？', answer: '接受条款、用户义务、禁止用途、知识产权、免责声明、责任限制、终止。' },
        { question: '我应该多久更新一次条款？', answer: '当服务发生重大变化、法律变化或每年更新。通知用户重大变更。' },
      ],
    },
  },

  // Cookie Policy Generator
  {
    slug: 'cookie-policy-generator',
    faqs: {
      en: [
        { question: 'Why do I need a cookie policy?', answer: 'GDPR and ePrivacy Directive require disclosure of cookie use. Users must consent to non-essential cookies.' },
        { question: 'What types of cookies should I disclose?', answer: 'Essential (required), functional (preferences), analytics (tracking), advertising (targeting). List each type.' },
        { question: 'Do I need a cookie consent banner?', answer: 'Yes, in EU and many other regions. Must allow users to accept/reject non-essential cookies before they\'re set.' },
      ],
      zh: [
        { question: '为什么我需要 Cookie 政策？', answer: 'GDPR 和 ePrivacy 指令要求披露 Cookie 使用。用户必须同意非必要 Cookie。' },
        { question: '我应该披露哪些类型的 Cookie？', answer: '必要的（必需）、功能性的（偏好）、分析性的（跟踪）、广告性的（定向）。列出每种类型。' },
        { question: '我需要 Cookie 同意横幅吗？', answer: '是的，在欧盟和许多其他地区。必须允许用户在设置非必要 Cookie 之前接受/拒绝。' },
      ],
    },
  },
];
