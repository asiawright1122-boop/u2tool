import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { tools, getPopularTools } from '@/config/tools';
import PopularToolsCarousel from '@/components/PopularToolsCarousel';
import RandomToolButton from '@/components/RandomToolButton';
import { 
  SEO_CONFIG, 
  generateAlternates, 
  generateWebSiteJsonLd,
  generateOrganizationJsonLd,
  generateFAQJsonLd,
  getKeywords,
  getHomepageFAQs,
  jsonLdToString 
} from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  
  const title = t('tagline');
  const description = t('description');
  const keywords = getKeywords(locale);
  
  return {
    title,
    description,
    // 关键词（针对百度等搜索引擎）
    keywords: keywords.join(', '),
    // Open Graph 标签
    openGraph: {
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      url: `/${locale}`,
      siteName: SEO_CONFIG.siteName,
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${SEO_CONFIG.siteUrl}/api/og?title=${encodeURIComponent(SEO_CONFIG.siteName)}&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: SEO_CONFIG.siteName,
        },
      ],
    },
    // Twitter Card 标签
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      site: SEO_CONFIG.twitterHandle,
      images: [`${SEO_CONFIG.siteUrl}/api/og?title=${encodeURIComponent(SEO_CONFIG.siteName)}&locale=${locale}`],
    },
    // hreflang alternates
    alternates: generateAlternates(locale, ''),
  };
}

// WebSite + Organization + FAQ JSON-LD 结构化数据组件
function StructuredData({ locale }: { locale: string }) {
  const webSiteJsonLd = generateWebSiteJsonLd(locale);
  const organizationJsonLd = generateOrganizationJsonLd(locale);
  const faqs = getHomepageFAQs(locale);
  const faqJsonLd = generateFAQJsonLd(faqs);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(faqJsonLd) }}
      />
    </>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const popularTools = getPopularTools();

  return (
    <div className="min-h-screen">
      {/* WebSite + Organization JSON-LD 结构化数据 */}
      <StructuredData locale={locale} />
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t('home.hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools" className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
              {t('home.hero.cta')}
            </Link>
            <RandomToolButton 
              tools={popularTools.slice(0, 20)} 
              rotateInterval={3000}
              className="btn-secondary text-lg px-8 py-4 rounded-xl border-2 border-gray-700 hover:border-gray-600"
            />
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">{tools.length}+</div>
              <div className="text-sm text-gray-300 mt-1">{t('home.stats.tools')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">0</div>
              <div className="text-sm text-gray-300 mt-1">{t('home.stats.upload')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">100%</div>
              <div className="text-sm text-gray-300 mt-1">{t('home.stats.free')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('home.popular')}</h2>
              <p className="text-gray-300">{t('home.popularDesc')}</p>
            </div>
            <Link href="/tools" className="hidden md:flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
              {t('nav.viewAllTools')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <PopularToolsCarousel 
            tools={popularTools} 
            displayCount={12} 
            rotateInterval={10000} 
          />
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/tools" className="btn-secondary px-6 py-3 rounded-lg">
              {t('nav.viewAllTools')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-20 pt-0 px-4 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">{t('home.features.title')}</h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">{t('home.features.subtitle')}</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-2xl hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.fast.title')}</h3>
              <p className="text-gray-300">{t('home.features.fast.desc')}</p>
            </div>
            
            <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-2xl hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.secure.title')}</h3>
              <p className="text-gray-300">{t('home.features.secure.desc')}</p>
            </div>
            
            <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-2xl hover:border-green-500/30 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.i18n.title')}</h3>
              <p className="text-gray-300">{t('home.features.i18n.desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
