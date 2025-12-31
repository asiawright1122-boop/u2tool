import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllBlogPostsMeta } from '@/lib/blog';
import { SEO_CONFIG, generateAlternates, generateBreadcrumbJsonLd, jsonLdToString } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  
  return {
    title: t('title'),
    description: t('description'),
    alternates: generateAlternates(locale, '/blog'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      siteName: SEO_CONFIG.siteName,
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const posts = getAllBlogPostsMeta(locale);
  
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    [{ name: t('home'), path: '' }, { name: t('title') }],
    locale
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(breadcrumbJsonLd) }}
      />
      
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        {/* Header - 缩小间距 */}
        <header className="bg-gradient-to-r from-blue-100 dark:from-blue-600/20 via-purple-50 dark:via-purple-600/10 to-transparent border-b border-gray-200 dark:border-white/5">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('title')}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl">
              {t('description')}
            </p>
          </div>
        </header>

        {/* Posts List - 缩小间距 */}
        <main className="max-w-5xl mx-auto px-6 py-6 bg-white dark:bg-[#121212]">
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post.slug} className="group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      {post.title}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(post.publishedAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {post.author}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
                      {post.description}
                    </p>
                    
                    <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium text-sm">
                      {t('readMore')}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                  
                  <div className="mt-6 border-b border-gray-200 dark:border-gray-800/50" />
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base">{t('noPosts')}</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
