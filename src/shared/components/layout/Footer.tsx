import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SOCIAL_LINKS } from "@/features/about/constants";

type FooterProps = {
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
};

export default function Footer({ translations }: FooterProps) {
  const navLinks = [
    { href: '/', label: translations.home, meta: 'Start here' },
    { href: '/musicbox', label: translations.music, meta: 'Songs & releases' },
    { href: '/about', label: translations.about, meta: 'Profile & updates' },
  ];

  const socialLinks = [
    { label: 'Bilibili', href: SOCIAL_LINKS.Bilibili },
    { label: 'Douyin', href: SOCIAL_LINKS.Douyin },
    { label: 'Weibo', href: SOCIAL_LINKS.Weibo },
  ];

  const bgColor = 'var(--background-light)';

  return (
    <footer
      className="relative w-full overflow-hidden text-foreground border-t border-foreground/10"
      style={{
        backgroundColor: bgColor,
        color: 'var(--foreground)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 18% 12%, rgba(141, 212, 232, 0.24), transparent 34%), radial-gradient(circle at 78% 22%, rgba(245, 152, 180, 0.18), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.72), rgba(248,246,246,0.96))',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

      {/* Upper Section: Split View */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 min-h-[400px]">
        {/* Left: Brand / Logo Area */}
        <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-foreground/10 flex items-center justify-center p-10 md:p-20 relative overflow-hidden">
          <div className="relative z-10 w-full">
            <div className="mb-8 flex items-center justify-between gap-6 text-xs font-mono uppercase tracking-[0.28em] text-foreground/36">
              <span>{translations.slogan}</span>
              <span className="hidden sm:inline">Music / Dream / Daily</span>
            </div>
            <h2 className="font-fjalla text-[clamp(4rem,15vw,12rem)] leading-none opacity-90 tracking-tighter">
              Luoxueer
            </h2>
          </div>

          <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_var(--brand-sky)_0%,_transparent_68%)] opacity-45 pointer-events-none" />
          <div className="absolute bottom-8 left-10 h-16 w-16 rounded-full border border-foreground/10 opacity-60" />
        </div>

        {/* Right: Navigation List */}
        <div className="lg:col-span-4 flex flex-col">
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex-1 flex items-center justify-between gap-8 px-8 md:px-12 border-b border-foreground/10 last:border-b-0 hover:bg-white/55 transition-colors group"
            >
              <span className="flex items-baseline gap-5">
                <span className="font-mono text-xs text-foreground/34 pt-1 group-hover:text-foreground/58 transition-colors">
                  0{index + 1}.
                </span>
                <span>
                  <span className="block text-2xl md:text-3xl font-medium tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                    {link.label}
                  </span>
                  <span className="mt-2 block text-xs font-mono uppercase tracking-[0.18em] text-foreground/34">
                    {link.meta}
                  </span>
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-foreground/28 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Section: 3-Column Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-foreground/10">
        
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
              className="group inline-flex items-center gap-2 text-sm text-foreground/72 hover:text-foreground transition-colors"
            >
              923755084@qq.com
              <ArrowUpRight className="h-3.5 w-3.5 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
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
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 text-sm text-foreground/72 hover:text-foreground transition-all duration-300"
              >
                <span className="relative inline-block group-hover:translate-x-1 transition-transform duration-300">
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-45" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Col 3: Others / Copyright */}
        <div className="p-8 md:p-10 flex flex-col justify-between min-h-[200px]">
          <span className="flex items-center gap-2 text-xs font-mono text-foreground/40 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/40"></span>
            {translations.others}
          </span>
          <div className="mt-auto">
            <p className="mb-4 text-sm leading-6 text-foreground/56">
              {translations.description}
            </p>
            <div className="text-xs text-foreground/42 font-mono">
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
}
