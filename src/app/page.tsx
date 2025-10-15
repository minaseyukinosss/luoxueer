'use client';

import { useLocale } from '@/components/LocaleProvider';

export default function Home() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start justify-center min-h-[calc(100vh-12rem)]">
          <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            {t.welcome}
          </h1>
          <p className="text-foreground/60 text-xl md:text-2xl max-w-2xl mb-12">
            {t.description}
          </p>
          
          <div className="flex gap-4 flex-wrap">
            <a
              href="/music"
              className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {t.music}
            </a>
            <a
              href="/about"
              className="px-6 py-3 border border-foreground/20 rounded-lg font-medium hover:bg-foreground/5 transition-colors"
            >
              {t.about}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
