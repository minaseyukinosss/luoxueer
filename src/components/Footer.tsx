import React, { useRef } from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';

interface FooterProps {
  locale: Locale;
  translations: {
    home: string;
    music: string;
    about: string;
    contact: string;
    social: string;
    slogan: string;
    rights: string;
    description: string;
    businessEmail: string;
    connect: string;
    others: string;
  };
}

const Footer: React.FC<FooterProps> = ({ translations }) => {
  const footerRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: '/', label: translations.home },
    { href: '/about', label: translations.about },
    { href: '/musicbox', label: translations.music },
  ];

  // 使用 CSS 变量中的 --brand-cream 或 --background-light
  const bgColor = 'var(--background-light)'; 

  return (
    <footer
      ref={footerRef}
      className="relative w-full text-foreground border-t border-foreground/10"
      style={{
        backgroundColor: bgColor,
        color: 'var(--foreground)',
      }}
    >
      {/* Upper Section: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[400px]">
        {/* Left: Brand / Logo Area */}
        <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-foreground/10 flex items-center justify-center p-12 md:p-20 relative overflow-hidden">
           {/* Huge Logo / Center Element */}
           <div className="relative z-10">
             <h1 className="font-fjalla text-[clamp(4rem,15vw,12rem)] leading-none opacity-90 tracking-tighter">
                Luoxueer
             </h1>
           </div>
           
           {/* Decorative background element if needed */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--brand-sky)_0%,_transparent_70%)] opacity-20 pointer-events-none"></div>
        </div>

        {/* Right: Navigation List */}
        <div className="lg:col-span-4 flex flex-col">
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex-1 flex items-center px-8 md:px-12 border-b border-foreground/10 last:border-b-0 hover:bg-foreground/5 transition-colors group"
            >
              <span className="font-mono text-xs text-foreground/40 mr-6 pt-1 group-hover:text-foreground/60 transition-colors">
                0{index + 1}.
              </span>
              <span className="text-2xl md:text-3xl font-medium tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Section: 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-foreground/10">
        
        {/* Col 1: Contact Info */}
        <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-foreground/10 flex flex-col justify-between min-h-[200px]">
          <span className="flex items-center gap-2 text-xs font-mono text-foreground/40 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/40"></span>
            {translations.contact}
          </span>
          <div className="mt-auto">
            <p className="text-sm text-foreground/60 mb-2">
              {translations.businessEmail}
            </p>
            <a 
              href="mailto:923755084@qq.com" 
              className="text-sm text-foreground/70 hover:text-foreground transition-colors block"
            >
              923755084@qq.com
            </a>
          </div>
        </div>

        {/* Col 2: Connect / Socials */}
        <div className="p-8 md:p-10 border-b md:border-b-0 lg:border-r border-foreground/10 flex flex-col justify-between min-h-[200px]">
          <span className="flex items-center gap-2 text-xs font-mono text-foreground/40 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/40"></span>
            {translations.connect}
          </span>
          <div className="mt-auto flex flex-col gap-2">
             <a 
               href="https://bilibili.com" 
               target="_blank" 
               rel="noopener noreferrer"
               className="group text-sm text-foreground/70 hover:text-foreground transition-all duration-300 inline-block"
             >
               <span className="relative inline-block group-hover:translate-x-1 transition-transform duration-300">
                 Bilibili
                 <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300"></span>
               </span>
             </a>
             <a 
               href="https://douyin.com" 
               target="_blank" 
               rel="noopener noreferrer"
               className="group text-sm text-foreground/70 hover:text-foreground transition-all duration-300 inline-block"
             >
               <span className="relative inline-block group-hover:translate-x-1 transition-transform duration-300">
                 Douyin
                 <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300"></span>
               </span>
             </a>
             <a 
               href="https://weibo.com" 
               target="_blank" 
               rel="noopener noreferrer"
               className="group text-sm text-foreground/70 hover:text-foreground transition-all duration-300 inline-block"
             >
               <span className="relative inline-block group-hover:translate-x-1 transition-transform duration-300">
                 Weibo
                 <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300"></span>
               </span>
             </a>
          </div>
        </div>

        {/* Col 3: Others / Copyright */}
        <div className="p-8 md:p-10 flex flex-col justify-between min-h-[200px]">
          <span className="flex items-center gap-2 text-xs font-mono text-foreground/40 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/40"></span>
            {translations.others}
          </span>
          <div className="mt-auto">
            <div className="text-xs text-foreground/40 font-mono">
              {new Date().getFullYear()} Made By{' '}
              <a 
                href="https://space.bilibili.com/44158364" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative inline-block text-foreground/60 hover:text-foreground transition-all duration-300 underline decoration-foreground/30 hover:decoration-foreground/60 underline-offset-2"
              >
                五月的祈
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
