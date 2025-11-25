'use client';

import { useLocale } from './LocaleProvider';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const { locale, setLocale, t } = useLocale();

  return (
    <Navbar
      locale={locale}
      setLocale={setLocale}
      translations={{
        home: t.home,
        music: t.music,
        about: t.about,
        contact: t.contact,
        connect: t.connect,
        businessEmail: t.businessEmail,
        selectLanguage: t.selectLanguage,
        featuredProject: t.featuredProject,
        latestNews: t.latestNews,
        readMore: t.readMore,
        newsDescription: t.newsDescription,
        latestRelease: t.latestRelease,
        listenNow: t.listenNow,
      }}
    />
  );
}
