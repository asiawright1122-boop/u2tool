
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'footer' });

  return {
    title: t('terms'),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {t('footer.terms')}
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Last updated: {new Date().toLocaleDateString(locale)}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">1. Agreement to Terms</h2>
          <p className="text-gray-600 dark:text-gray-400">
            By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">2. Use License</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Our tools are free to use for personal and commercial purposes. You may not reverse engineer,
            attempt to extract the source code, or use our tools for any illegal activities.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">3. Disclaimer</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The materials on u2tool are provided on an 'as is' basis. We make no warranties, expressed or implied,
            and hereby disclaim and negate all other warranties including, without limitation, implied warranties
            or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">4. Limitations</h2>
          <p className="text-gray-600 dark:text-gray-400">
            In no event shall u2tool or its suppliers be liable for any damages (including, without limitation,
            damages for loss of data or profit, or due to business interruption) arising out of the use or
            inability to use the materials on u2tool.
          </p>
        </section>
      </div>
    </div>
  );
}
