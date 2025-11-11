'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册 GSAP 插件
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'reveal';
  delay?: number;
  duration?: number;
  className?: string;
  stagger?: number; // 用于子元素依次动画
}

export default function AnimatedSection({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
  className = '',
  stagger = 0,
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const animateIfTargets = (
        targets: gsap.TweenTarget,
        vars: gsap.TweenVars
      ) => {
        const parsed = gsap.utils.toArray(targets);
        if (!parsed.length) {
          return;
        }
        gsap.from(parsed, vars);
      };

      const animationProps: gsap.TweenVars = {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse',
        },
        duration,
        ease: 'power3.out',
        delay,
      };

      switch (animation) {
        case 'fadeUp':
          animateIfTargets(element, {
            ...animationProps,
            y: 60,
            opacity: 0,
          });
          break;

        case 'fadeIn':
          animateIfTargets(element, {
            ...animationProps,
            opacity: 0,
          });
          break;

        case 'slideLeft':
          animateIfTargets(element, {
            ...animationProps,
            x: 100,
            opacity: 0,
          });
          break;

        case 'slideRight':
          animateIfTargets(element, {
            ...animationProps,
            x: -100,
            opacity: 0,
          });
          break;

        case 'scale':
          animateIfTargets(element, {
            ...animationProps,
            scale: 0.9,
            opacity: 0,
          });
          break;

        case 'reveal':
          animateIfTargets(element, {
            ...animationProps,
            clipPath: 'inset(0% 100% 0% 0%)',
          });
          break;
      }

      // 如果有 stagger，对子元素应用交错动画
      if (stagger > 0) {
        const childElements = Array.from(element.children);
        if (childElements.length > 0) {
          animateIfTargets(childElements, {
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            y: 40,
            opacity: 0,
            duration: duration * 0.8,
            stagger,
            ease: 'power3.out',
            delay,
          });
        }
      }
    }, element);

    return () => ctx.revert();
  }, [animation, delay, duration, stagger]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
}

