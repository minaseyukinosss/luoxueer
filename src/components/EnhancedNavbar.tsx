'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/i18n';
import NavLink from './NavLink';
import gsap from 'gsap';

interface NavbarProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: {
    home: string;
    music: string;
    about: string;
  };
}

export default function EnhancedNavbar({ locale, setLocale, translations }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  const locales: Array<{ code: Locale; label: string; shortLabel: string; flag: string }> = [
    { code: 'zh', label: '中文', shortLabel: '中', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', shortLabel: '日', flag: '🇯🇵' },
    { code: 'en', label: 'English', shortLabel: 'EN', flag: '🇬🇧' },
  ];

  const navItems = [
    { href: '/', label: translations.home },
    { href: '/musicbox', label: translations.music },
    { href: '/about', label: translations.about },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-dropdown')) {
        setIsLangDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    // 导航栏初始动画
    if (navRef.current && logoRef.current) {
      const tl = gsap.timeline({ delay: 0.5 });
      tl.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }).from(
        logoRef.current,
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        },
        '-=0.4'
      );
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogoHover = (isHovering: boolean) => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        scale: isHovering ? 1.05 : 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'border-b border-foreground/10 bg-background/80 shadow-sm backdrop-blur-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <Link
              ref={logoRef}
              href="/"
              className="font-mono text-xl font-bold tracking-tight transition-opacity hover:opacity-70 md:text-2xl"
              onMouseEnter={() => handleLogoHover(true)}
              onMouseLeave={() => handleLogoHover(false)}
            >
              Luoxueer
            </Link>

            {/* Desktop Navigation */}
            <div className="relative hidden items-center gap-8 md:flex">
              {/* Nav Links */}
              <div className="flex items-center gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                  />
                ))}
              </div>

              {/* Language Switcher - Globe Icon Dropdown */}
              <div className="language-dropdown relative border-l border-foreground/10 pl-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLangDropdownOpen(!isLangDropdownOpen);
                  }}
                  className="group flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-foreground/5"
                  aria-label="选择语言"
                >
                  {/* Globe Icon SVG */}
                  <svg
                    className="h-5 w-5 text-foreground/70 transition-colors group-hover:text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>

                  {/* Current Language Code */}
                  <span className="text-xs font-medium uppercase text-foreground/70 transition-colors group-hover:text-foreground">
                    {locale}
                  </span>

                  {/* Dropdown Arrow */}
                  <svg
                    className={`h-3.5 w-3.5 text-foreground/50 transition-transform duration-200 ${
                      isLangDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-48 origin-top overflow-hidden rounded-xl border border-foreground/10 bg-background shadow-xl transition-all duration-200 ${
                    isLangDropdownOpen ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
                  }`}
                >
                  {locales.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-all duration-150 ${
                        locale === lang.code
                          ? 'bg-foreground/10 text-foreground'
                          : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <div className="flex flex-1 items-center justify-between">
                        <span className="font-medium">{lang.label}</span>
                        <span className="font-mono text-xs uppercase text-foreground/40">{lang.code}</span>
                      </div>
                      {locale === lang.code && (
                        <svg className="h-4 w-4 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 transition-colors hover:bg-foreground/5 md:hidden"
              aria-label="Toggle menu"
            >
              <div className="flex h-4 w-5 flex-col justify-between">
                <span
                  className={`h-0.5 w-full bg-foreground transition-all duration-300 ${
                    isMobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-foreground transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-foreground transition-all duration-300 ${
                    isMobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/95 backdrop-blur-lg"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div className="relative flex h-full flex-col items-center justify-center gap-8 px-8">
          {/* Nav Links */}
          <div className="flex flex-col items-center gap-4">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative text-3xl font-bold transition-all duration-300 ${
                  pathname === item.href
                    ? 'scale-110 text-foreground'
                    : 'text-foreground/60 hover:scale-105 hover:text-foreground'
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                }}
              >
                {item.label}

                {/* Active indicator - Mobile */}
                {pathname === item.href && (
                  <span className="absolute -left-8 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-foreground transition-all duration-300" />
                )}
              </Link>
            ))}
          </div>

          {/* Language Switcher - Mobile Globe */}
          <div className="w-full max-w-xs pt-6">
            <div className="mb-3 flex items-center gap-2 px-2">
              <svg className="h-4 w-4 text-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              <span className="text-xs font-medium uppercase tracking-wider text-foreground/40">Language</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {locales.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 ${
                    locale === lang.code
                      ? 'bg-foreground text-background'
                      : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${(navItems.length + index) * 50}ms` : '0ms',
                  }}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-sm font-medium">{lang.label}</span>
                    <span className="font-mono text-xs uppercase opacity-60">{lang.code}</span>
                  </div>
                  {locale === lang.code && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

