"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/i18n";
import gsap from "gsap";
import NavLink from "./NavLink";
import { albumList } from "@/data/musicData";
import { ArrowRight, Disc, Play } from "lucide-react";

interface NavbarProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: {
    home: string;
    music: string;
    about: string;
    contact: string;
    connect: string;
    businessEmail: string;
    selectLanguage: string;
    featuredProject: string;
    latestNews: string;
    readMore: string;
    newsDescription: string;
    latestRelease?: string;
    listenNow?: string;
  };
}

export default function Navbar({
  locale,
  setLocale,
  translations,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Refs for animations
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const menuFooterRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const isHome = pathname === "/";
  const featuredAlbum = albumList[0];

  // Navigation Items
  const navItems = [
    { href: "/", label: translations.home || "Home", index: "01" },
    { href: "/musicbox", label: translations.music || "Work", index: "02" },
    { href: "/about", label: translations.about || "About", index: "03" },
  ];

  const locales: Array<{ code: Locale; label: string }> = [
    { code: "zh", label: "CN" },
    { code: "en", label: "EN" },
    { code: "ja", label: "JP" },
  ];

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu Animation timeline setup
  useEffect(() => {
    if (!menuRef.current || !menuLinksRef.current || !menuFooterRef.current)
      return;

    const links = Array.from(menuLinksRef.current.children);
    const footer = menuFooterRef.current;

    gsap.set(menuRef.current, {
      display: "none",
      clipPath: "inset(0 0 100% 0)",
    });
    gsap.set(links, { y: 100, opacity: 0 });
    gsap.set(footer, { y: 20, opacity: 0 });

    const tl = gsap
      .timeline({ paused: true })
      .set(menuRef.current, { display: "flex" })
      .to(menuRef.current, {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.8,
        ease: "power4.inOut",
      })
      .to(
        links,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4",
      )
      .to(
        footer,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.6",
      );

    tl.eventCallback("onReverseComplete", () => {
      if (menuRef.current) {
        gsap.set(menuRef.current, { display: "none" });
      }
    });

    menuTimelineRef.current = tl;

    return () => {
      tl.kill();
      menuTimelineRef.current = null;
    };
  }, []);

  // Play / reverse menu animation based on open state
  useEffect(() => {
    const tl = menuTimelineRef.current;
    if (!tl) return;

    if (isMenuOpen) {
      tl.play();
      document.body.style.overflow = "hidden";
    } else {
      tl.reverse();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Header / Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 h-16 md:h-20 flex items-center justify-between transition-all duration-300 ${
          isScrolled && !isMenuOpen
            ? "bg-background/80 backdrop-blur-md border-b border-border/5"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className={`relative z-50 font-mono text-lg tracking-tighter font-bold transition-colors duration-300 ${
            isMenuOpen
              ? "text-foreground"
              : isHome && !isScrolled
                ? "text-white"
                : "text-foreground"
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          LUOXUEER
        </Link>

        {/* Desktop Navigation (Direct Links) */}
        <nav
          className={`hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 transition-opacity duration-300 ${isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {navItems.slice(0, 3).map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              variant={isHome && !isScrolled ? "light" : "default"}
              showArrow={false}
            />
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-6 relative z-50">
          {/* Language Switcher (Desktop) */}
          <div
            className={`hidden md:flex items-center gap-4 mr-2 transition-opacity duration-300 ${isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            {locales.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={`text-xs font-medium uppercase tracking-wider transition-colors ${
                  locale === lang.code
                    ? isHome && !isScrolled
                      ? "text-white"
                      : "text-foreground"
                    : isHome && !isScrolled
                      ? "text-white/50 hover:text-white"
                      : "text-foreground/50 hover:text-foreground"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Hamburger / Close Button (Mobile & Desktop) */}
          <button
            ref={hamburgerRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group flex items-center focus:outline-none"
            aria-label={isMenuOpen ? "Close" : "Menu"}
          >
            <div
              className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isMenuOpen
                  ? "bg-foreground/10"
                  : isHome && !isScrolled
                    ? "bg-white/20"
                    : "bg-foreground/5"
              }`}
            >
              <div className="w-4 h-3 relative flex flex-col justify-between">
                <span
                  className={`w-full h-px transition-all duration-300 ${
                    isMenuOpen
                      ? "bg-foreground rotate-45 translate-y-[5px]"
                      : isHome && !isScrolled
                        ? "bg-white"
                        : "bg-foreground"
                  }`}
                />
                <span
                  className={`w-full h-px transition-all duration-300 ${
                    isMenuOpen
                      ? "opacity-0"
                      : isHome && !isScrolled
                        ? "bg-white"
                        : "bg-foreground"
                  }`}
                />
                <span
                  className={`w-full h-px transition-all duration-300 ${
                    isMenuOpen
                      ? "bg-foreground -rotate-45 -translate-y-[5px]"
                      : isHome && !isScrolled
                        ? "bg-white"
                        : "bg-foreground"
                  }`}
                />
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* Fullscreen Menu Overlay (Mobile & Desktop) */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 bg-background flex flex-col md:flex-row"
        style={{ display: "none" }}
      >
        {/* Decorative Line */}
        <div className="absolute top-0 left-12 bottom-0 w-px bg-border/10 hidden md:block" />
        <div className="absolute top-0 right-1/3 bottom-0 w-px bg-border/10 hidden md:block" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-24 pt-20 pb-10 relative overflow-hidden">
          {/* Big Nav Links */}
          <div ref={menuLinksRef} className="flex flex-col gap-2 md:gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-baseline gap-4 md:gap-8"
              >
                <span className="text-sm md:text-base font-mono text-muted-foreground/50 font-light group-hover:text-primary transition-colors duration-300 w-6 md:w-8">
                  {item.index}
                </span>
                <span
                  className="text-5xl md:text-[7vw] leading-[0.9] font-bold tracking-tighter text-foreground transition-all duration-300 group-hover:translate-x-4 group-hover:text-foreground/80 font-fjalla"
                  style={{ fontFamily: "var(--font-fjalla-one), sans-serif" }}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Menu Footer */}
          <div
            ref={menuFooterRef}
            className="mt-12 md:mt-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            {/* Language Switcher */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                {translations.selectLanguage}
              </span>
              <div className="flex gap-4">
                {locales.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLocale(lang.code)}
                    className={`text-sm font-medium transition-colors ${
                      locale === lang.code
                        ? "text-foreground underline decoration-2 underline-offset-4"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                {translations.contact}
              </span>
              <a
                href="mailto:923755084@qq.com"
                className="text-sm font-medium hover:underline transition-colors"
              >
                923755084@qq.com
              </a>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                {translations.connect}
              </span>
              <div className="flex gap-4 text-sm font-medium">
                <a
                  href="https://bilibili.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground/70 transition-colors"
                >
                  Bilibili
                </a>
                <a
                  href="https://douyin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground/70 transition-colors"
                >
                  Douyin
                </a>
                <a
                  href="https://weibo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground/70 transition-colors"
                >
                  Weibo
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar / Image Placeholder Area (Desktop Only) */}
        <div className="hidden md:flex w-1/3 bg-foreground/5 border-l border-border/10 flex-col justify-between p-12 relative">
          {featuredAlbum ? (
            <>
              <div className="w-full aspect-[4/5] relative group mt-8 overflow-hidden rounded-lg bg-black/5">
                <Image
                  src={featuredAlbum.img}
                  alt={featuredAlbum.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-black/40 backdrop-blur-md rounded-full p-2 text-white">
                    <Disc className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                  </div>
                </div>
              </div>

              <div className="space-y-6 z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-[1px] bg-primary/50"></span>
                    <span className="text-xs font-mono uppercase tracking-widest text-primary/70">
                      {translations.latestRelease || "Latest Release"}
                    </span>
                  </div>
                  <h4 className="text-3xl font-bold tracking-tight leading-none">
                    {featuredAlbum.name}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 max-w-[90%]">
                    {featuredAlbum.desc}
                  </p>
                </div>
                <Link
                  href="/musicbox"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors group"
                >
                  {translations.listenNow || "Listen Now"}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground/30">
              No featured content
            </div>
          )}
        </div>
      </div>
    </>
  );
}
