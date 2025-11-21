'use client';

import { useLocale } from './LocaleProvider';
import Footer from './Footer';

export default function FooterWrapper() {
  const { locale, t } = useLocale();

  return (
    <Footer 
      locale={locale} 
      translations={t} 
    />
  );
}

