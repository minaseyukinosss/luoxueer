'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/i18n';

interface NavbarProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: {
    home: string;
    music: string;
    about: string;
  };
}

export default function Navbar({ locale, setLocale, translations }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const pathname = usePathname();

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
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-lg border-b border-foreground/10 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="font-mono text-xl md:text-2xl font-bold tracking-tight hover:opacity-70 transition-opacity"
            >
              Luoxueer
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 relative">
              {/* Nav Links */}
              <div className="flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-foreground'
                        : 'text-foreground/60 hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    
                    {/* Active indicator - Clean underline */}
                    {isActive(item.href) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-foreground rounded-full transition-all duration-300" />
                    )}
                  </Link>
                ))}
              </div>

              {/* Language Switcher - Globe Icon Dropdown */}
              <div className="relative pl-6 border-l border-foreground/10 language-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLangDropdownOpen(!isLangDropdownOpen);
                  }}
                  className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-foreground/5 transition-all duration-200"
                  aria-label="选择语言"
                >
                  {/* Globe Icon SVG */}
                  <svg 
                    className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" 
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
                  <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground transition-colors uppercase">
                    {locale}
                  </span>

                  {/* Dropdown Arrow */}
                  <svg
                    className={`w-3.5 h-3.5 text-foreground/50 transition-transform duration-200 ${
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
                  className={`absolute right-0 mt-2 w-48 bg-background border border-foreground/10 rounded-xl shadow-xl overflow-hidden transition-all duration-200 origin-top ${
                    isLangDropdownOpen
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  {locales.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-150 ${
                        locale === lang.code
                          ? 'bg-foreground/10 text-foreground'
                          : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium">{lang.label}</span>
                        <span className="text-xs text-foreground/40 uppercase font-mono">{lang.code}</span>
                      </div>
                      {locale === lang.code && (
                        <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
              className="md:hidden p-2 rounded-lg hover:bg-foreground/5 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-foreground transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-foreground transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-foreground transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/95 backdrop-blur-lg"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div className="relative h-full flex flex-col justify-center items-center gap-8 px-8">
          {/* Nav Links */}
          <div className="flex flex-col items-center gap-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative text-3xl font-bold transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-foreground scale-110'
                      : 'text-foreground/60 hover:text-foreground hover:scale-105'
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                  }}
                >
                  {item.label}
                  
                  {/* Active indicator - Mobile */}
                  {isActive(item.href) && (
                    <span className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-foreground rounded-full transition-all duration-300" />
                  )}
                </Link>
              ))}
          </div>

          {/* Language Switcher - Mobile Globe */}
          <div className="w-full max-w-xs pt-6">
            <div className="flex items-center gap-2 mb-3 px-2">
              <svg className="w-4 h-4 text-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="text-xs font-medium text-foreground/40 uppercase tracking-wider">Language</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {locales.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                    locale === lang.code
                      ? 'bg-foreground text-background'
                      : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${(navItems.length + index) * 50}ms` : '0ms',
                  }}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-medium text-sm">{lang.label}</span>
                    <span className="text-xs opacity-60 uppercase font-mono">{lang.code}</span>
                  </div>
                  {locale === lang.code && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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

