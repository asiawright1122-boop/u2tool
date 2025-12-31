import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getBlogPostContent, getAllBlogSlugs, getAllBlogPostsMeta } from '@/lib/blog';
import { SEO_CONFIG, generateAlternates, generateBreadcrumbJsonLd, jsonLdToString, getCanonicalUrl } from '@/lib/seo';
import { tools } from '@/config/tools';
import { getPostBySlug } from '@/config/blog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props { params: Promise<{ locale: string; slug: string }>; }

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPostContent(slug, locale);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.description,
    alternates: generateAlternates(locale, `/blog/${slug}`),
    openGraph: { title: post.title, description: post.description, type: 'article', siteName: SEO_CONFIG.siteName, publishedTime: post.publishedAt, authors: [post.author], tags: post.tags },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const tTools = await getTranslations({ locale, namespace: 'tools' });
  const post = getBlogPostContent(slug, locale);
  if (!post) notFound();

  const blogPost = getPostBySlug(slug);
  const relatedToolSlugs = blogPost?.relatedTools || [];
  const relatedTools = relatedToolSlugs.map(toolSlug => tools.find(t => t.slug === toolSlug)).filter(Boolean);

  const allPosts = getAllBlogPostsMeta(locale);
  const relatedPosts = allPosts.filter(p => p.slug !== slug && p.tags.some(tag => post.tags.includes(tag))).slice(0, 3);
  const readingTime = Math.max(1, Math.ceil(post.content.length / 500));

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([{ name: t('home'), path: '' }, { name: t('title'), path: '/blog' }, { name: post.title }], locale);
  const articleJsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.description, author: { '@type': 'Person', name: post.author }, datePublished: post.publishedAt, publisher: { '@type': 'Organization', name: SEO_CONFIG.siteName }, mainEntityOfPage: { '@type': 'WebPage', '@id': getCanonicalUrl(locale, `/blog/${slug}`) } };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdToString(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      
      <div className="min-h-screen bg-white dark:bg-black">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {t('backToList')}
            </Link>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => <span key={tag} className="px-3 py-1 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 rounded-full">{tag}</span>)}
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8">{post.title}</h1>
            
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">{post.author.charAt(0)}</div>
                <span className="text-gray-900 dark:text-white font-medium">{post.author}</span>
              </div>
              <span>{new Date(post.publishedAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {readingTime} min
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 bg-white dark:bg-black">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-16 mb-8 first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-16 mb-6">{children}</h2>,
              h3: ({ children }) => <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">{children}</h3>,
              p: ({ children }) => <p className="text-lg text-gray-700 dark:text-zinc-300 leading-8 mb-8">{children}</p>,
              a: ({ href, children }) => <a href={href} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline underline-offset-4" target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>{children}</a>,
              strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
              ul: ({ children }) => <ul className="my-8 space-y-4">{children}</ul>,
              ol: ({ children }) => <ol className="my-8 space-y-4 list-decimal list-inside marker:text-gray-500 dark:marker:text-zinc-500 marker:font-bold">{children}</ol>,
              li: ({ children }) => <li className="text-lg text-gray-700 dark:text-zinc-300 leading-8 pl-2">{children}</li>,
              blockquote: ({ children }) => <blockquote className="my-10 pl-6 border-l-4 border-indigo-500 text-gray-600 dark:text-zinc-400 italic">{children}</blockquote>,
              code: ({ className, children }) => {
                if (className?.includes('language-')) return <code className="text-sm text-gray-700 dark:text-zinc-300">{children}</code>;
                return <code className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 rounded text-sm font-mono">{children}</code>;
              },
              pre: ({ children }) => <pre className="my-10 p-6 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-x-auto">{children}</pre>,
              table: ({ children }) => <div className="my-10 overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-800"><table className="w-full">{children}</table></div>,
              thead: ({ children }) => <thead className="bg-gray-100 dark:bg-zinc-900">{children}</thead>,
              th: ({ children }) => <th className="px-6 py-4 text-left text-gray-900 dark:text-white font-bold">{children}</th>,
              td: ({ children }) => <td className="px-6 py-4 text-gray-700 dark:text-zinc-300 border-t border-gray-200 dark:border-zinc-800">{children}</td>,
              hr: () => <hr className="my-16 border-gray-200 dark:border-zinc-800" />,
            }}
          >
            {post.content}
          </ReactMarkdown>

          {/* Related Tools - 大卡片横向排列 */}
          {relatedTools.length > 0 && (
            <div className="mt-20 pt-12 border-t border-gray-200 dark:border-zinc-800">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="text-3xl">🛠️</span>
                {t('relatedTools')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTools.map((tool) => tool && (
                  <Link 
                    key={tool.slug} 
                    href={`/tools/${tool.slug}`}
                    className="group relative flex flex-col items-center p-8 bg-gradient-to-br from-gray-100 dark:from-zinc-900 to-gray-50 dark:to-zinc-900/50 hover:from-indigo-100/50 dark:hover:from-indigo-950/50 hover:to-purple-100/30 dark:hover:to-purple-950/30 border border-gray-200 dark:border-zinc-800 hover:border-indigo-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
                  >
                    <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">{tool.icon}</span>
                    </div>
                    <span className="text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-semibold text-center">
                      {tTools(`${tool.slug}.name`)}
                    </span>
                    <span className="mt-2 text-sm text-gray-500 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-400 transition-colors text-center line-clamp-2">
                      {tTools(`${tool.slug}.description`)}
                    </span>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Share */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => <span key={tag} className="px-4 py-2 text-sm text-gray-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-900 rounded-full">#{tag}</span>)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-zinc-500 text-sm mr-2">{t('share')}</span>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(getCanonicalUrl(locale, `/blog/${slug}`))}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getCanonicalUrl(locale, `/blog/${slug}`))}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-12">{t('relatedPosts')}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                    <article className="h-full flex flex-col bg-white dark:bg-zinc-900/50 rounded-2xl border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 p-6 transition-all duration-300 hover:-translate-y-1">
                      <div className="flex gap-2 mb-4">
                        {p.tags.slice(0, 2).map(tag => <span key={tag} className="text-xs text-indigo-600 dark:text-indigo-400">{tag}</span>)}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">{p.title}</h3>
                      <p className="text-gray-500 dark:text-zinc-500 text-sm line-clamp-2 flex-1">{p.description}</p>
                      <time className="text-xs text-gray-400 dark:text-zinc-600 mt-4">{new Date(p.publishedAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
