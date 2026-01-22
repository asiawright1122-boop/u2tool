
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'footer' });

  return {
    title: t('privacy'),
  };
}

export default async function PrivacyPage({
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
        {t('footer.privacy')}
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Last updated: {new Date().toLocaleDateString(locale)}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">1. Introduction</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to u2tool. We respect your privacy and are committed to protecting your personal data.
            This Privacy Policy explains how we look after your personal data when you visit our website
            and tells you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">2. Data We Collect</h2>
          <p className="text-gray-600 dark:text-gray-400">
            u2tool is designed to be privacy-first. Most of our tools run entirely client-side in your browser,
            meaning your data (such as images you convert or JSON you format) is NOT sent to our servers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">3. Cookies</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We use essential cookies to maintain your session and preferences (such as language selection and dark mode).
            We may also use third-party analytics services to understand how our site is used.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">4. Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-400">
            If you have any questions about this privacy policy, please contact us.
          </p>
        </section>
      </div>
    </div>
  );
}
