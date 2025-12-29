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
  
  // 面包屑结构化数据
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    [
      { name: t('home'), path: '' },
      { name: t('title') },
    ],
    locale
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(breadcrumbJsonLd) }}
      />
      
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* 页面标题 */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{t('title')}</h1>
            <p className="text-gray-400 text-lg">{t('description')}</p>
          </div>
          
          {/* 文章列表 */}
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-colors"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-semibold text-white mb-3 hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {post.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>•</span>
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  
                  <div className="flex gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">{t('noPosts')}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
