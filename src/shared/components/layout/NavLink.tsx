'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

interface NavLinkProps {
  href: string;
  label: string;
  showArrow?: boolean;
  variant?: 'default' | 'light';
}

export default function NavLink({
  href,
  label,
  showArrow = true,
  variant = 'default',
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const linkRef = useRef<HTMLAnchorElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!textWrapperRef.current || !arrowRef.current) return;

    gsap.to(textWrapperRef.current, {
      y: '-50%',
      duration: 0.4,
      ease: 'power2.out',
    });

    gsap.to(arrowRef.current, {
      x: 5,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!textWrapperRef.current || !arrowRef.current) return;

    gsap.to(textWrapperRef.current, {
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    });

    gsap.to(arrowRef.current, {
      x: 0,
      opacity: 0.6,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const baseColorClasses =
    variant === 'light'
      ? isActive
        ? 'text-white'
        : 'text-white/70 hover:text-white'
      : isActive
      ? 'text-foreground'
      : 'text-foreground/60 hover:text-foreground';

  const indicatorColor = variant === 'light' ? 'bg-white' : 'bg-foreground';

  return (
    <Link
      ref={linkRef}
      href={href}
      className={`group relative flex items-center gap-2 overflow-hidden px-4 py-2 text-sm font-medium transition-all duration-300 ${
        baseColorClasses
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 文字容器 - 垂直滚动效果 */}
      <div className="relative h-5 overflow-hidden">
        <div ref={textWrapperRef} className="flex flex-col">
          <span className="block h-5 leading-5">{label}</span>
          <span className="block h-5 leading-5">{label}</span>
        </div>
      </div>

      {/* 箭头图标 */}
      {showArrow && (
        <div
          ref={arrowRef}
          className={`transition-opacity ${
            variant === 'light' ? 'opacity-70 group-hover:opacity-100' : 'opacity-60'
          }`}
          style={{ transform: 'translateX(0px)' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 12L10 8L6 4" />
          </svg>
        </div>
      )}

      {/* 活跃指示器 */}
      {isActive && (
        <span
          className={`absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full transition-all duration-300 ${indicatorColor}`}
        />
      )}
    </Link>
  );
}

