'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

// 与PreLoader保持一致的音符
const NOTE_SYMBOLS = [
  { symbol: '♪', color: '#f598b4' },
  { symbol: '♫', color: '#8dd4e8' },
  { symbol: '♬', color: '#fab4d5' },
  { symbol: '♩', color: '#7bc4e0' },
];

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // 只在路由真正变化时执行动画
    if (prevPathname.current !== pathname) {
      const container = containerRef.current;
      const bgOverlay = bgOverlayRef.current;
      const content = contentRef.current;

      if (!container || !bgOverlay || !content) return;

      // 禁用导航交互，防止动画期间点击
      container.style.pointerEvents = 'auto';

      // 创建中心标题
      const titleElement = document.createElement('div');
      titleElement.textContent = 'LUOXUEER';
      titleElement.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: clamp(28px, 8vw, 48px);
        font-weight: bold;
        font-family: var(--font-geist-sans, sans-serif);
        background: linear-gradient(135deg, #f598b4 0%, #c388d9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        opacity: 0;
        pointer-events: none;
        z-index: 3;
        letter-spacing: 0.05em;
      `;
      container.appendChild(titleElement);

      // 创建轻盈的音符
      const noteElements: HTMLDivElement[] = [];
      const noteCount = 15;

      for (let i = 0; i < noteCount; i++) {
        const noteConfig = NOTE_SYMBOLS[i % NOTE_SYMBOLS.length];
        const note = document.createElement('div');
        note.textContent = noteConfig.symbol;
        note.style.cssText = `
          position: absolute;
          left: 50%;
          top: 50%;
          font-size: ${28 + Math.random() * 12}px;
          color: ${noteConfig.color};
          opacity: 0;
          pointer-events: none;
          filter: drop-shadow(0 2px 6px rgba(141, 212, 232, 0.3));
          z-index: 2;
        `;
        container.appendChild(note);
        noteElements.push(note);
      }

      // 创建时间线 - 总时长约1.2秒
      const tl = gsap.timeline({
        onComplete: () => {
          // 清理元素
          titleElement.remove();
          noteElements.forEach(note => note.remove());
          // 重置背景
          gsap.set(bgOverlay, { opacity: 0 });
          container.style.pointerEvents = 'none';
        }
      });

      // 页面内容快速淡出
      tl.to(content, {
        opacity: 0,
        scale: 0.97,
        duration: 0.25,
        ease: 'power2.in',
      })
      // 淡蓝背景快速扩散
      .fromTo(bgOverlay, {
        opacity: 0,
      }, {
        opacity: 0.92,
        duration: 0.35,
        ease: 'power2.out',
      }, '-=0.1')
      // 标题淡入
      .to(titleElement, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, '-=0.2')
      // 音符从中心轻盈扩散
      .to(noteElements, {
        opacity: 0.85,
        x: () => (Math.random() - 0.5) * 700, // 中等扩散范围
        y: () => (Math.random() - 0.5) * 700,
        rotation: () => (Math.random() - 0.5) * 360,
        scale: 1.3,
        duration: 0.7,
        stagger: 0.025,
        ease: 'power2.out',
      }, '-=0.25')
      // 标题和音符一起淡出
      .to([titleElement, ...noteElements], {
        opacity: 0,
        scale: 1.6,
        duration: 0.3,
        stagger: 0.015,
        ease: 'power2.in',
      }, '-=0.3')
      // 背景淡出
      .to(bgOverlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      }, '-=0.25')
      // 新页面内容淡入
      .fromTo(
        content,
        {
          opacity: 0,
          scale: 0.97,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: 'power2.out',
        },
        '-=0.2'
      );

      prevPathname.current = pathname;
    }
  }, [pathname]);

  return (
    <>
      {/* 淡蓝渐变背景层 */}
      <div
        ref={bgOverlayRef}
        className="pointer-events-none fixed inset-0 z-[99]"
        style={{
          background: 'linear-gradient(135deg, #e8f4f8 0%, #f0f8fb 40%, #d8f0f5 70%, #c8e8f0 100%)',
          opacity: 0,
          willChange: 'opacity',
        }}
      />

      {/* 音符容器 */}
      <div
        ref={containerRef}
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{
          willChange: 'transform',
          overflow: 'hidden',
        }}
      />

      {/* 页面内容 */}
      <div ref={contentRef}>{children}</div>
    </>
  );
}
