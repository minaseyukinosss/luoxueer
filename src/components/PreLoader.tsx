'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function PreLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 防止页面滚动
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      // 进度动画
      gsap.to({}, {
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: function() {
          const prog = Math.round(this.progress() * 100);
          setProgress(prog);
          
          if (progressBarRef.current) {
            gsap.to(progressBarRef.current, {
              width: `${prog}%`,
              duration: 0.3,
              ease: 'power1.out'
            });
          }
        },
        onComplete: () => {
          // 加载完成后的退出动画
          const tl = gsap.timeline({
            onComplete: () => {
              document.body.style.overflow = 'auto';
            }
          });

          // 文字向上消失
          tl.to(textRef.current, {
            y: -50,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut'
          })
          // 整个加载器向上滑出
          .to(loaderRef.current, {
            y: '-100%',
            duration: 0.8,
            ease: 'power3.inOut'
          }, '-=0.3');
        }
      });

      // 文字入场动画
      if (textRef.current) {
        const chars = textRef.current.querySelectorAll('.char');
        gsap.fromTo(chars, 
          {
            y: 100,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: 'power3.out',
            delay: 0.2
          }
        );
      }
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = 'auto';
    };
  }, []);

  const text = 'LUOXUEER';
  
  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      style={{ willChange: 'transform' }}
    >
      {/* 背景网格效果 */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* 主内容 */}
      <div className="relative flex flex-col items-center gap-16">
        {/* 站点名称 */}
        <div 
          ref={textRef}
          className="flex overflow-hidden"
          style={{ willChange: 'transform, opacity' }}
        >
          {text.split('').map((char, i) => (
            <span
              key={i}
              className="char inline-block text-4xl md:text-6xl font-bold text-white tracking-wider"
              style={{ 
                fontFamily: 'var(--font-geist-sans, sans-serif)',
                willChange: 'transform, opacity'
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* 进度条容器 */}
        <div className="w-64 md:w-96">
          {/* 进度条 */}
          <div className="relative h-0.5 bg-white/20 overflow-hidden rounded-full">
            <div
              ref={progressBarRef}
              className="absolute left-0 top-0 h-full bg-white rounded-full"
              style={{ width: '0%', willChange: 'width' }}
            />
          </div>
          
          {/* 进度数字 */}
          <div className="flex justify-between items-center mt-4 text-white/60 text-sm font-mono">
            <span>Loading</span>
            <span ref={counterRef}>{progress}%</span>
          </div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-8 text-white/40 text-xs tracking-[0.3em] font-mono">
        EST. 2025
      </div>
    </div>
  );
}

