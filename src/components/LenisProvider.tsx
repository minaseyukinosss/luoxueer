'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册 ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 初始化 Lenis
    const lenis = new Lenis({
      duration: 1.2,          // 滚动持续时间
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 缓动函数
      orientation: 'vertical', // 垂直滚动
      gestureOrientation: 'vertical', // 手势方向
      smoothWheel: true,      // 平滑鼠标滚轮
      touchMultiplier: 2,     // 触摸灵敏度
      wheelMultiplier: 1,     // 滚轮灵敏度
      infinite: false,        // 不启用无限滚动
    });

    lenisRef.current = lenis;

    // 与 GSAP ScrollTrigger 同步
    lenis.on('scroll', ScrollTrigger.update);

    // RAF 循环
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // GSAP ticker 同步（推荐方式）
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 清理
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return <>{children}</>;
}

