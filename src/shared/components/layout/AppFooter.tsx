'use client';

import { useLocale } from '@/shared/components/providers/LocaleProvider';
import Footer from './Footer';

export default function AppFooter() {
  const { t } = useLocale();

  return <Footer translations={t} />;
}
