'use client';

import { useLocale } from '@/components/LocaleProvider';

export default function AboutPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-sans text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          {t.about}
        </h1>
        <p className="text-foreground/60 text-lg max-w-2xl">
          {t.description}
        </p>
      </div>
    </div>
  );
}

