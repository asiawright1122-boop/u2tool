<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'FAQ 生成器',
      subtitle: '基于行业模板快速生成结构化 FAQ，支持 Markdown 和 JSON-LD 导出',
      topic: '产品/服务主题',
      topicPlaceholder: '例如：在线学习平台',
      industry: '行业模板',
      ecommerce: '电商购物',
      saas: 'SaaS 软件',
      restaurant: '餐饮服务',
      education: '教育培训',
      medical: '医疗健康',
      general: '通用',
      audience: '受众类型',
      consumer: '普通消费者',
      business: '企业客户',
      technical: '技术用户',
      count: 'FAQ 数量',
      generate: '生成 FAQ',
      exportMd: '导出 Markdown',
      exportJson: '导出 JSON-LD',
      copy: '复制',
      copied: '✓ 已复制',
      copyQA: '复制',
      question: '问题',
      answer: '答案',
      placeholderText: '填写主题和行业后点击生成，将自动输出结构化 FAQ 列表。',
      disclaimer: '生成内容仅供参考，请根据实际业务情况修改完善。',
    },
    en: {
      title: 'FAQ Generator',
      subtitle: 'Generate structured FAQs from industry templates with Markdown and JSON-LD export',
      topic: 'Product / Service Topic',
      topicPlaceholder: 'e.g. Online Learning Platform',
      industry: 'Industry Template',
      ecommerce: 'E-commerce',
      saas: 'SaaS Software',
      restaurant: 'Restaurant',
      education: 'Education',
      medical: 'Healthcare',
      general: 'General',
      audience: 'Audience Type',
      consumer: 'Consumer',
      business: 'Business',
      technical: 'Technical',
      count: 'FAQ Count',
      generate: 'Generate FAQ',
      exportMd: 'Export Markdown',
      exportJson: 'Export JSON-LD',
      copy: 'Copy',
      copied: '✓ Copied',
      copyQA: 'Copy',
      question: 'Question',
      answer: 'Answer',
      placeholderText: 'Enter a topic and industry, then click Generate to create a structured FAQ list.',
      disclaimer: 'Generated content is for reference only. Please review and adjust for your actual business.',
    },
    es: {
      title: 'Generador de FAQ',
      subtitle: 'Genera preguntas frecuentes estructuradas con exportación a Markdown y JSON-LD',
      topic: 'Tema del Producto / Servicio',
      topicPlaceholder: 'ej. Plataforma de Aprendizaje en Línea',
      industry: 'Plantilla de Industria',
      ecommerce: 'Comercio Electrónico',
      saas: 'Software SaaS',
      restaurant: 'Restaurante',
      education: 'Educación',
      medical: 'Salud',
      general: 'General',
      audience: 'Tipo de Audiencia',
      consumer: 'Consumidor',
      business: 'Empresas',
      technical: 'Técnico',
      count: 'Cantidad de FAQ',
      generate: 'Generar FAQ',
      exportMd: 'Exportar Markdown',
      exportJson: 'Exportar JSON-LD',
      copy: 'Copiar',
      copied: '✓ Copiado',
      copyQA: 'Copiar',
      question: 'Pregunta',
      answer: 'Respuesta',
      placeholderText: 'Ingresa un tema e industria, luego haz clic en Generar.',
      disclaimer: 'El contenido generado es solo de referencia. Revísalo y ajústalo.',
    },
    pt: {
      title: 'Gerador de FAQ',
      subtitle: 'Gere perguntas frequentes estruturadas com exportação para Markdown e JSON-LD',
      topic: 'Tema do Produto / Serviço',
      topicPlaceholder: 'ex. Plataforma de Aprendizado Online',
      industry: 'Modelo de Indústria',
      ecommerce: 'E-commerce',
      saas: 'Software SaaS',
      restaurant: 'Restaurante',
      education: 'Educação',
      medical: 'Saúde',
      general: 'Geral',
      audience: 'Tipo de Público',
      consumer: 'Consumidor',
      business: 'Empresas',
      technical: 'Técnico',
      count: 'Quantidade de FAQ',
      generate: 'Gerar FAQ',
      exportMd: 'Exportar Markdown',
      exportJson: 'Exportar JSON-LD',
      copy: 'Copiar',
      copied: '✓ Copiado',
      copyQA: 'Copiar',
      question: 'Pergunta',
      answer: 'Resposta',
      placeholderText: 'Insira um tema e indústria, depois clique em Gerar.',
      disclaimer: 'Conteúdo gerado é apenas referência. Revise e ajuste conforme necessário.',
    },
    ja: {
      title: 'FAQ ジェネレーター',
      subtitle: '業界テンプレートから構造化 FAQ を生成し、Markdown・JSON-LD でエクスポート',
      topic: '商品・サービスのテーマ',
      topicPlaceholder: '例：オンライン学習プラットフォーム',
      industry: '業界テンプレート',
      ecommerce: 'EC・通販',
      saas: 'SaaS ソフトウェア',
      restaurant: '飲食店',
      education: '教育・研修',
      medical: '医療・ヘルスケア',
      general: '一般',
      audience: '対象ユーザー',
      consumer: '一般消費者',
      business: '法人顧客',
      technical: 'テクニカルユーザー',
      count: 'FAQ 数',
      generate: 'FAQ を生成',
      exportMd: 'Markdown でエクスポート',
      exportJson: 'JSON-LD でエクスポート',
      copy: 'コピー',
      copied: '✓ コピー済み',
      copyQA: 'コピー',
      question: '質問',
      answer: '回答',
      placeholderText: 'テーマと業界を入力して「FAQ を生成」をクリックしてください。',
      disclaimer: '生成内容はあくまで参考です。実際の業務に合わせてご調整ください。',
    },
    fr: {
      title: 'Générateur de FAQ',
      subtitle: 'Générez des FAQ structurées à partir de modèles sectoriels avec export Markdown et JSON-LD',
      topic: 'Sujet du Produit / Service',
      topicPlaceholder: 'ex. Plateforme d\'apprentissage en ligne',
      industry: 'Modèle Sectoriel',
      ecommerce: 'E-commerce',
      saas: 'Logiciel SaaS',
      restaurant: 'Restauration',
      education: 'Éducation',
      medical: 'Santé',
      general: 'Général',
      audience: 'Type d\'Audience',
      consumer: 'Consommateur',
      business: 'Entreprises',
      technical: 'Technique',
      count: 'Nombre de FAQ',
      generate: 'Générer FAQ',
      exportMd: 'Exporter Markdown',
      exportJson: 'Exporter JSON-LD',
      copy: 'Copier',
      copied: '✓ Copié',
      copyQA: 'Copier',
      question: 'Question',
      answer: 'Réponse',
      placeholderText: 'Saisissez un sujet et une industrie, puis cliquez sur Générer.',
      disclaimer: 'Le contenu généré est indicatif. Adaptez-le à votre activité réelle.',
    },
    de: {
      title: 'FAQ-Generator',
      subtitle: 'Erstellen Sie strukturierte FAQs aus Branchenvorlagen mit Markdown- und JSON-LD-Export',
      topic: 'Produkt- / Servicethema',
      topicPlaceholder: 'z.B. Online-Lernplattform',
      industry: 'Branchenvorlage',
      ecommerce: 'E-Commerce',
      saas: 'SaaS-Software',
      restaurant: 'Restaurant',
      education: 'Bildung',
      medical: 'Gesundheit',
      general: 'Allgemein',
      audience: 'Zielgruppe',
      consumer: 'Verbraucher',
      business: 'Unternehmen',
      technical: 'Technisch',
      count: 'FAQ-Anzahl',
      generate: 'FAQ Generieren',
      exportMd: 'Markdown Exportieren',
      exportJson: 'JSON-LD Exportieren',
      copy: 'Kopieren',
      copied: '✓ Kopiert',
      copyQA: 'Kopieren',
      question: 'Frage',
      answer: 'Antwort',
      placeholderText: 'Geben Sie Thema und Branche ein und klicken Sie auf Generieren.',
      disclaimer: 'Generierter Inhalt ist nur eine Referenz. Bitte überarbeiten.',
    },
    ar: {
      title: 'مولّد الأسئلة الشائعة (FAQ)',
      subtitle: 'أنشئ قوائم أسئلة شائعة منظمة بناءً على قوالب قطاعية مع تصدير Markdown وJSON-LD',
      topic: 'موضوع المنتج / الخدمة',
      topicPlaceholder: 'مثال: منصة التعلم الإلكتروني',
      industry: 'قالب القطاع',
      ecommerce: 'التجارة الإلكترونية',
      saas: 'برمجيات SaaS',
      restaurant: 'المطاعم',
      education: 'التعليم',
      medical: 'الرعاية الصحية',
      general: 'عام',
      audience: 'نوع الجمهور',
      consumer: 'مستهلك عادي',
      business: 'عملاء الأعمال',
      technical: 'مستخدم تقني',
      count: 'عدد الأسئلة',
      generate: 'توليد FAQ',
      exportMd: 'تصدير Markdown',
      exportJson: 'تصدير JSON-LD',
      copy: 'نسخ',
      copied: '✓ تم النسخ',
      copyQA: 'نسخ',
      question: 'السؤال',
      answer: 'الإجابة',
      placeholderText: 'أدخل الموضوع والقطاع ثم اضغط على توليد.',
      disclaimer: 'المحتوى المولّد للاسترشاد فقط. يرجى مراجعته وتعديله.',
    },
    ko: {
      title: 'FAQ 생성기',
      subtitle: '업계 템플릿 기반 구조화된 FAQ를 생성하고 Markdown 및 JSON-LD로 내보내기',
      topic: '제품/서비스 주제',
      topicPlaceholder: '예: 온라인 학습 플랫폼',
      industry: '업계 템플릿',
      ecommerce: '이커머스',
      saas: 'SaaS 소프트웨어',
      restaurant: '음식점',
      education: '교육',
      medical: '의료/헬스케어',
      general: '일반',
      audience: '대상 유형',
      consumer: '일반 소비자',
      business: '기업 고객',
      technical: '기술 사용자',
      count: 'FAQ 개수',
      generate: 'FAQ 생성',
      exportMd: 'Markdown 내보내기',
      exportJson: 'JSON-LD 내보내기',
      copy: '복사',
      copied: '✓ 복사됨',
      copyQA: '복사',
      question: '질문',
      answer: '답변',
      placeholderText: '주제와 업계를 입력하고 생성 버튼을 클릭하세요.',
      disclaimer: '생성된 내용은 참고용입니다. 실제 비즈니스에 맞게 수정하세요.',
    },
    ru: {
      title: 'Генератор FAQ',
      subtitle: 'Создавайте структурированные FAQ на основе отраслевых шаблонов с экспортом в Markdown и JSON-LD',
      topic: 'Тема Продукта / Услуги',
      topicPlaceholder: 'напр. Онлайн-платформа обучения',
      industry: 'Отраслевой Шаблон',
      ecommerce: 'Электронная Коммерция',
      saas: 'SaaS-Программное Обеспечение',
      restaurant: 'Ресторан',
      education: 'Образование',
      medical: 'Здравоохранение',
      general: 'Общее',
      audience: 'Тип Аудитории',
      consumer: 'Потребитель',
      business: 'Бизнес',
      technical: 'Технический',
      count: 'Количество FAQ',
      generate: 'Сгенерировать FAQ',
      exportMd: 'Экспорт Markdown',
      exportJson: 'Экспорт JSON-LD',
      copy: 'Копировать',
      copied: '✓ Скопировано',
      copyQA: 'Копировать',
      question: 'Вопрос',
      answer: 'Ответ',
      placeholderText: 'Введите тему и отрасль, затем нажмите «Сгенерировать».',
      disclaimer: 'Сгенерированный контент носит справочный характер. Адаптируйте под реальный бизнес.',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let topic = $state('');
  let industry = $state('general');
  let audience = $state('consumer');
  let count = $state(10);

  interface FAQ { q: string; a: string; }
  let faqs = $state<FAQ[]>([]);
  let copiedIdx = $state(-1);
  let copiedExport = $state('');

  const TEMPLATES: Record<string, (topic: string, audience: string) => FAQ[]> = {
    ecommerce: (t, a) => [
      { q: `What payment methods does ${t} accept?`, a: `${t} accepts all major credit cards, PayPal, Apple Pay, and Google Pay for a seamless checkout experience.` },
      { q: `How long does shipping take for ${t} orders?`, a: `Standard shipping typically takes 3-7 business days. Express shipping options are available at checkout.` },
      { q: `What is the return policy for ${t}?`, a: `We offer a hassle-free 30-day return policy. Items must be in their original condition with all tags attached.` },
      { q: `Is my payment information secure on ${t}?`, a: `Yes, ${t} uses industry-standard SSL encryption and is PCI-DSS compliant to protect your payment data.` },
      { q: `Can I track my ${t} order?`, a: `Absolutely! Once your order ships, you'll receive a tracking number via email to monitor your delivery in real time.` },
      { q: `Does ${t} ship internationally?`, a: `Yes, we ship to over 50 countries. International shipping times and fees vary by destination.` },
      { q: `How do I cancel or modify my ${t} order?`, a: `Orders can be modified or canceled within 24 hours of placement by contacting our support team.` },
      { q: `Are the products on ${t} authentic?`, a: `All products on ${t} are sourced directly from authorized manufacturers and verified for authenticity.` },
      { q: `Does ${t} offer discounts or loyalty programs?`, a: `Yes! Sign up for our newsletter to receive exclusive discounts, and join our loyalty program to earn points on every purchase.` },
      { q: `How do I contact ${t} customer support?`, a: `Our support team is available 24/7 via live chat, email, and phone. Average response time is under 2 hours.` },
      { q: `Can I use multiple discount codes on ${t}?`, a: `Currently, only one discount code can be applied per order. However, you can combine a code with loyalty points.` },
      { q: `How do I leave a product review on ${t}?`, a: `After receiving your order, you'll get an email inviting you to leave a review. You can also visit the product page directly.` },
      { q: `Does ${t} have a mobile app?`, a: `Yes, the ${t} app is available on both iOS and Android for a streamlined shopping experience.` },
      { q: `What happens if my ${t} order arrives damaged?`, a: `Contact our support team within 48 hours with photos of the damage and we'll arrange a replacement or full refund.` },
      { q: `Does ${t} offer gift wrapping?`, a: `Yes, gift wrapping and personalized messages are available at checkout for a small additional fee.` },
    ],
    saas: (t, a) => [
      { q: `What is ${t} and who is it for?`, a: `${t} is a cloud-based platform designed for ${a === 'business' ? 'businesses and teams' : 'professionals'} who need to streamline workflows and boost productivity.` },
      { q: `How do I get started with ${t}?`, a: `Sign up for a free trial at our website — no credit card required. You can be up and running in under 5 minutes.` },
      { q: `What pricing plans does ${t} offer?`, a: `${t} offers Starter, Professional, and Enterprise plans. All plans include core features, with advanced capabilities in higher tiers.` },
      { q: `Is there a free trial for ${t}?`, a: `Yes! We offer a 14-day free trial with full access to all Professional features. No credit card needed.` },
      { q: `How does ${t} handle data security?`, a: `${t} uses AES-256 encryption, SOC 2 Type II compliance, and regular third-party security audits to keep your data safe.` },
      { q: `Can I integrate ${t} with other tools?`, a: `${t} integrates with 100+ popular tools including Slack, Zapier, Salesforce, Google Workspace, and many more.` },
      { q: `Does ${t} offer an API?`, a: `Yes, ${t} provides a RESTful API with comprehensive documentation for developers who need custom integrations.` },
      { q: `How do I cancel my ${t} subscription?`, a: `You can cancel anytime from your account dashboard. Your access continues until the end of your billing period.` },
      { q: `Does ${t} offer onboarding support?`, a: `Yes, all plans include onboarding resources, and Professional and Enterprise plans include dedicated onboarding sessions.` },
      { q: `What happens to my data if I cancel ${t}?`, a: `Your data is retained for 30 days after cancellation, during which you can export everything. After that, it is permanently deleted.` },
      { q: `Does ${t} support multiple users?`, a: `Yes, ${t} supports multiple users with role-based access control, allowing fine-grained permission management.` },
      { q: `Is ${t} available on mobile?`, a: `${t} is fully responsive and available as a native app on iOS and Android for on-the-go access.` },
      { q: `What SLA does ${t} guarantee?`, a: `${t} guarantees 99.9% uptime SLA for all paid plans, with real-time status monitoring at status.${t.toLowerCase().replace(/\s+/g,'')}.com.` },
      { q: `Can I switch plans on ${t}?`, a: `You can upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades apply at the next renewal.` },
      { q: `Does ${t} offer educational or non-profit discounts?`, a: `Yes, we offer special pricing for qualified educational institutions and non-profit organizations. Contact our sales team.` },
    ],
    restaurant: (t, a) => [
      { q: `Does ${t} take reservations?`, a: `Yes, ${t} accepts reservations online, by phone, or via our app. Walk-ins are also welcome based on availability.` },
      { q: `Does ${t} offer vegetarian or vegan options?`, a: `Absolutely! ${t} has a dedicated plant-based section on our menu with multiple vegetarian and vegan dishes.` },
      { q: `Does ${t} cater to dietary restrictions and allergies?`, a: `Yes, please inform your server of any dietary restrictions. Our kitchen team can accommodate most common allergies.` },
      { q: `Does ${t} offer delivery or takeout?`, a: `${t} offers both delivery and takeout. Order through our website, app, or popular delivery platforms.` },
      { q: `What are ${t}'s hours of operation?`, a: `${t} is open Monday-Friday 11am-10pm, and Saturday-Sunday 10am-11pm. Hours may vary on holidays.` },
      { q: `Does ${t} have parking available?`, a: `Yes, free parking is available in our private lot adjacent to the restaurant for up to 2 hours.` },
      { q: `Can ${t} host private events?`, a: `Yes! ${t} offers private dining rooms and event spaces for parties of up to 100 guests. Contact us to plan your event.` },
      { q: `Does ${t} have a kids' menu?`, a: `Yes, ${t} offers a dedicated children's menu with smaller portions and kid-friendly options.` },
      { q: `What payment methods does ${t} accept?`, a: `${t} accepts all major credit cards, cash, and mobile payment options including Apple Pay and Google Pay.` },
      { q: `Does ${t} offer gift cards?`, a: `Yes, ${t} gift cards are available for purchase in-store and online, making a perfect gift for food lovers.` },
      { q: `Is ${t} wheelchair accessible?`, a: `Yes, ${t} is fully wheelchair accessible with dedicated parking, ramps, and accessible restrooms.` },
      { q: `Does ${t} offer catering services?`, a: `Yes, ${t} provides full-service catering for corporate events, weddings, and private parties. Contact us for a custom quote.` },
      { q: `Does ${t} have a loyalty program?`, a: `Yes! Join our rewards program to earn points on every visit and redeem them for free meals and exclusive perks.` },
      { q: `Can I see ${t}'s nutritional information?`, a: `Nutritional information for all menu items is available on our website and upon request from your server.` },
      { q: `Does ${t} source ingredients locally?`, a: `${t} is committed to local sourcing, partnering with regional farms to bring the freshest seasonal ingredients to your plate.` },
    ],
    education: (t, a) => [
      { q: `What courses does ${t} offer?`, a: `${t} offers a wide range of courses across technology, business, creative arts, and personal development — with new content added monthly.` },
      { q: `How do I enroll in a course on ${t}?`, a: `Simply create a free account, browse our catalog, and click Enroll. Some courses are free; others require a subscription or one-time purchase.` },
      { q: `Are ${t} certificates recognized by employers?`, a: `${t} certificates are widely recognized and valued by employers across industries. Many partners list ${t} as a preferred training provider.` },
      { q: `Does ${t} offer self-paced learning?`, a: `Yes, most ${t} courses are self-paced, allowing you to learn at your own schedule from any device.` },
      { q: `Does ${t} offer live classes or mentoring?`, a: `${t} offers both recorded courses and live cohort-based programs with expert instructors and peer interaction.` },
      { q: `What is the refund policy for ${t} courses?`, a: `${t} offers a 30-day money-back guarantee on all paid courses if you are not satisfied with the content.` },
      { q: `Can I access ${t} courses offline?`, a: `Yes, the ${t} mobile app allows you to download lessons for offline viewing — perfect for learning on the go.` },
      { q: `Does ${t} offer team or corporate plans?`, a: `Yes, ${t} for Teams provides centralized billing, admin dashboards, and custom learning paths for organizations.` },
      { q: `Are ${t} courses updated regularly?`, a: `Yes, all ${t} courses are reviewed and updated at least annually to keep pace with industry changes.` },
      { q: `Does ${t} offer financial aid?`, a: `Yes, ${t} offers need-based financial aid and scholarships. Apply through our financial aid program on the website.` },
      { q: `Can I get a certificate from ${t}?`, a: `Yes, completing a course on ${t} earns you a shareable certificate you can add to LinkedIn and your resume.` },
      { q: `How long do ${t} courses take to complete?`, a: `Course lengths vary from quick 2-hour workshops to comprehensive 40+ hour programs. Each course shows its estimated duration.` },
      { q: `Does ${t} offer language options?`, a: `Many ${t} courses are available with subtitles in 10+ languages, and a growing library is fully localized.` },
      { q: `Is there a community for ${t} learners?`, a: `Yes, ${t} has an active community forum where learners can ask questions, share projects, and connect with peers.` },
      { q: `How do I contact ${t} support?`, a: `Reach ${t} support via in-app chat, email, or our help center. Response time is typically under 4 hours.` },
    ],
    medical: (t, a) => [
      { q: `What services does ${t} provide?`, a: `${t} provides comprehensive healthcare services including primary care, specialist consultations, diagnostics, and preventive health programs.` },
      { q: `How do I book an appointment at ${t}?`, a: `Book online through our patient portal, call our appointment line, or use our mobile app — 24/7 booking available.` },
      { q: `Does ${t} accept my insurance?`, a: `${t} works with most major insurance providers. Please contact our billing team to verify your specific plan coverage.` },
      { q: `Does ${t} offer telehealth consultations?`, a: `Yes, ${t} offers secure video consultations with licensed healthcare providers for most non-emergency needs.` },
      { q: `How do I access my medical records at ${t}?`, a: `Your medical records are available through the ${t} patient portal, available online and via our mobile app.` },
      { q: `What should I bring to my first appointment at ${t}?`, a: `Please bring a valid photo ID, your insurance card, a list of current medications, and any relevant medical history documents.` },
      { q: `Does ${t} offer emergency care?`, a: `For emergencies, please call 911. ${t} offers urgent care services for non-life-threatening conditions during regular hours.` },
      { q: `How does ${t} protect my health information?`, a: `${t} is fully HIPAA-compliant and uses advanced encryption to protect all patient data and communications.` },
      { q: `Can I get a prescription refill from ${t}?`, a: `Yes, prescription refills can be requested through the patient portal or by contacting your provider's office directly.` },
      { q: `Does ${t} offer preventive care and screenings?`, a: `Yes, ${t} provides routine screenings, vaccinations, and wellness exams — many covered at no cost with insurance.` },
      { q: `What languages does ${t} support?`, a: `${t} offers interpretation services in 30+ languages. Please notify us when booking so we can arrange assistance.` },
      { q: `How do I pay my bill from ${t}?`, a: `Bills can be paid online via the patient portal, by mail, or by phone. We also offer payment plans for larger amounts.` },
      { q: `Does ${t} have after-hours care?`, a: `${t} has an after-hours nurse line available 24/7. For urgent needs outside regular hours, visit our urgent care center.` },
      { q: `How long are wait times at ${t}?`, a: `Average wait times are under 15 minutes for scheduled appointments. Walk-in urgent care times are posted in real time on our website.` },
      { q: `Does ${t} offer pediatric care?`, a: `Yes, ${t} has board-certified pediatricians and a dedicated children's wing for patients from birth through age 18.` },
    ],
    general: (t, a) => [
      { q: `What is ${t}?`, a: `${t} is a comprehensive solution designed to meet the needs of ${a === 'business' ? 'businesses and organizations' : 'individuals'} looking for reliable and high-quality services.` },
      { q: `How do I get started with ${t}?`, a: `Getting started is easy. Visit our website, create an account, and follow the guided setup process. Our team is available to help at every step.` },
      { q: `What are the pricing options for ${t}?`, a: `${t} offers flexible pricing plans to suit different needs and budgets. Visit our pricing page for detailed information or contact us for a custom quote.` },
      { q: `Is there a free trial available for ${t}?`, a: `Yes, ${t} offers a free trial period so you can explore all features before committing. No credit card required to start.` },
      { q: `How secure is ${t}?`, a: `${t} employs industry-leading security measures including encryption, regular audits, and compliance with relevant regulations to keep your data safe.` },
      { q: `How do I contact ${t} support?`, a: `Our support team is available via email, live chat, and phone. Visit our contact page for hours and contact details.` },
      { q: `Can I cancel my ${t} subscription anytime?`, a: `Yes, you can cancel your subscription at any time without any long-term commitments or cancellation fees.` },
      { q: `Does ${t} offer refunds?`, a: `${t} offers a satisfaction guarantee. If you're not happy within the first 30 days, contact us for a full refund.` },
      { q: `Is ${t} available on mobile devices?`, a: `Yes, ${t} is fully optimized for mobile use and available as a native app on iOS and Android.` },
      { q: `Does ${t} integrate with other tools?`, a: `${t} integrates with a wide range of popular tools and platforms. Check our integrations page for the full list.` },
      { q: `What languages does ${t} support?`, a: `${t} is available in multiple languages. The interface and support are localized to serve a global audience.` },
      { q: `How often does ${t} release updates?`, a: `${t} releases regular updates to improve features, performance, and security. Major updates are announced via email and in-app notifications.` },
      { q: `Does ${t} have an API?`, a: `Yes, ${t} provides an API for developers who want to integrate or extend functionality. Documentation is available in our developer center.` },
      { q: `Can I export my data from ${t}?`, a: `Yes, ${t} allows you to export your data in common formats at any time, ensuring you always have full control over your information.` },
      { q: `Does ${t} offer training or onboarding?`, a: `Yes, ${t} provides onboarding resources including tutorials, webinars, and documentation to help you get the most out of our platform.` },
    ],
  };

  function generate() {
    const t = topic.trim();
    if (!t) return;
    const template = TEMPLATES[industry] || TEMPLATES['general'];
    const allFaqs = template(t, audience);
    faqs = allFaqs.slice(0, count);
  }

  function copyQA(idx: number) {
    const faq = faqs[idx];
    if (!faq) return;
    navigator.clipboard.writeText(`Q: ${faq.q}\nA: ${faq.a}`).then(() => {
      copiedIdx = idx;
      setTimeout(() => (copiedIdx = -1), 1800);
    });
  }

  function exportMarkdown() {
    let md = `# ${topic} — FAQ\n\n`;
    faqs.forEach((faq, i) => {
      md += `## ${i + 1}. ${faq.q}\n\n${faq.a}\n\n`;
    });
    download(md, `${topic.replace(/\s+/g, '_')}_faq.md`, 'text/markdown');
    copiedExport = 'md';
    setTimeout(() => (copiedExport = ''), 2000);
  }

  function exportJsonLd() {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    };
    download(JSON.stringify(schema, null, 2), `${topic.replace(/\s+/g, '_')}_faq.json`, 'application/json');
    copiedExport = 'json';
    setTimeout(() => (copiedExport = ''), 2000);
  }

  function download(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<div class="tool-theme-shell p-6 rounded-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-stone-950 font-black text-lg">
      ❓
    </div>
    <div>
      <h2 class="font-extrabold text-lg text-emerald-700 dark:bg-gradient-to-r dark:from-emerald-300 dark:via-emerald-100 dark:to-emerald-400 dark:bg-clip-text dark:text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left: Inputs -->
    <div class="md:col-span-4 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.topic} <span class="text-emerald-400">*</span></span>
        <input
          type="text"
          bind:value={topic}
          placeholder={l.topicPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors"
        />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.industry}</span>
        <select
          bind:value={industry}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-200 cursor-pointer focus:border-emerald-500 focus:outline-none transition-colors"
        >
          {#each ['ecommerce','saas','restaurant','education','medical','general'] as ind}
            <option value={ind}>{(l as any)[ind]}</option>
          {/each}
        </select>
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.audience}</span>
        <select
          bind:value={audience}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-200 cursor-pointer focus:border-emerald-500 focus:outline-none transition-colors"
        >
          {#each ['consumer','business','technical'] as aud}
            <option value={aud}>{(l as any)[aud]}</option>
          {/each}
        </select>
      </label>

      <div>
        <span class="text-xs text-stone-400 mb-1.5 block">{l.count}</span>
        <div class="flex gap-2">
          {#each [5, 10, 15] as n}
            <button
              type="button"
              onclick={() => (count = n)}
              class="flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all {count === n ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
            >
              {n}
            </button>
          {/each}
        </div>
      </div>

      <button
        type="button"
        onclick={generate}
        class="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-lg"
      >
        ✨ {l.generate}
      </button>

      {#if faqs.length > 0}
        <div class="flex gap-2">
          <button
            type="button"
            onclick={exportMarkdown}
            class="flex-1 py-2 text-xs font-semibold rounded-lg border transition-all {copiedExport === 'md' ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
          >
            📄 {l.exportMd}
          </button>
          <button
            type="button"
            onclick={exportJsonLd}
            class="flex-1 py-2 text-xs font-semibold rounded-lg border transition-all {copiedExport === 'json' ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
          >
            🔗 {l.exportJson}
          </button>
        </div>
      {/if}
    </div>

    <!-- Right: FAQ List -->
    <div class="md:col-span-8 space-y-3">
      {#if faqs.length > 0}
        {#each faqs as faq, i}
          <div class="bg-stone-900 border border-stone-800 rounded-xl p-4">
            <div class="flex items-start justify-between gap-2 mb-1">
              <p class="text-sm font-semibold text-emerald-300 leading-snug flex-1">
                <span class="text-stone-600 mr-1">{i + 1}.</span> {faq.q}
              </p>
              <button
                type="button"
                onclick={() => copyQA(i)}
                class="text-xxs text-stone-500 hover:text-emerald-400 border border-stone-800 hover:border-emerald-700 rounded px-2 py-0.5 transition-all shrink-0"
              >
                {copiedIdx === i ? l.copied : l.copyQA}
              </button>
            </div>
            <p class="text-xs text-stone-400 leading-relaxed">{faq.a}</p>
          </div>
        {/each}
      {:else}
        <div class="h-full flex flex-col items-center justify-center text-center p-8 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[300px]">
          <div class="text-4xl mb-3">❓</div>
          <p class="text-xs text-stone-400 max-w-xs leading-relaxed">{l.placeholderText}</p>
        </div>
      {/if}
    </div>
  </div>

  <p class="text-xxs text-stone-600 text-center mt-4">{l.disclaimer}</p>
</div>

<style>
  .text-xxs { font-size: 0.65rem; }
</style>
