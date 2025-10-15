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
      }}
    />
  );
}

