'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getScrollProgressState } from '@/shared/lib/scroll-progress';

// 注册 ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isProgressVisibleRef = useRef(false);
  const [isProgressVisible, setIsProgressVisible] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
      wheelMultiplier: 1,
      infinite: false,
    });

    lenisRef.current = lenis;

    const updateProgress = () => {
      const state = getScrollProgressState({
        scroll: lenis.scroll,
        limit: lenis.limit,
      });

      progressRef.current?.style.setProperty(
        '--scroll-progress',
        state.progress.toString(),
      );

      if (isProgressVisibleRef.current !== state.isVisible) {
        isProgressVisibleRef.current = state.isVisible;
        setIsProgressVisible(state.isVisible);
      }
    };

    const onScroll = () => {
      updateProgress();
      ScrollTrigger.update();
    };

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    const handleResize = () => {
      lenis.resize();
      updateProgress();
    };

    lenis.on('scroll', onScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    updateProgress();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(tick);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      lenis.destroy();
      lenisRef.current = null;
      isProgressVisibleRef.current = false;
    };
  }, []);

  return (
    <>
      {children}
      <div
        ref={progressRef}
        className="site-scroll-progress"
        data-visible={isProgressVisible}
        aria-hidden="true"
      >
        <div className="site-scroll-progress__bar" />
      </div>
    </>
  );
}
