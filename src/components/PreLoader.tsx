'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const NOTE_SYMBOLS = [
  { symbol: '♪', color: '#f598b4', rotate: -8 },
  { symbol: '♫', color: '#f7a8cf', rotate: -4 },
  { symbol: '♬', color: '#d89cd9', rotate: 2 },
  { symbol: '♩', color: '#8dd4e8', rotate: -6 },
];

export default function PreLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const notesContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 防止页面滚动
    document.body.style.overflow = 'hidden';
    
    // 隐藏页面内容直到加载完成
    const mainContent = document.querySelector('main');
    const navbar = document.querySelector('nav');
    if (mainContent) (mainContent as HTMLElement).style.opacity = '0';
    if (navbar) (navbar as HTMLElement).style.opacity = '0';

    const ctx = gsap.context(() => {
      // 获取已渲染的音符元素
      const noteElements = notesContainerRef.current
        ? Array.from(notesContainerRef.current.querySelectorAll('.music-note'))
        : [];
      
      if (noteElements.length > 0) {
        if (progressBarRef.current) {
          gsap.set(progressBarRef.current, { width: '0%' });
        }
        // 音符跳动动画（循环）
        const bounceAnim = gsap.to(noteElements, {
          y: -20,
          duration: 0.6,
          stagger: 0.15,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });

        // 音符旋转（循环）
        const rotateAnim = gsap.to(noteElements, {
          rotation: 15,
          duration: 0.8,
          stagger: 0.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });

        // 进度动画
        gsap.to({}, {
          duration: 1.6,
          ease: 'power4.out',
          onUpdate: function() {
            const prog = Math.round(this.progress() * 100);
            setProgress(prog);
            if (progressBarRef.current) {
              gsap.set(progressBarRef.current, { width: `${prog}%` });
            }
          },
          onComplete: () => {
            // 先杀掉循环动画，确保流畅过渡
            bounceAnim.kill();
            rotateAnim.kill();

            // 加载完成后的退出动画
            const tl = gsap.timeline({
              onComplete: () => {
                document.body.style.overflow = 'auto';
                setIsVisible(false); // 完全移除PreLoader
              }
            });

            // 音符飞散
            tl.to(noteElements as gsap.TweenTarget, {
              y: -100,
              x: (i) => (i - 1.5) * 80,
              opacity: 0,
              rotation: 360,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.in',
              overwrite: 'auto',
              onStart: () => {
                // 音符开始飞散时，开始显示页面内容
                const mainContent = document.querySelector('main');
                const navbar = document.querySelector('nav');
                if (mainContent) {
                  gsap.to(mainContent, {
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out'
                  });
                }
                if (navbar) {
                  gsap.to(navbar, {
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out'
                  });
                }
              }
            })
            // 整个加载器淡出
            .to(loaderRef.current, {
              opacity: 0,
              duration: 0.5,
              ease: 'power2.inOut'
            }, '-=0.3')
            // 向上滑出
            .to(loaderRef.current, {
              y: '-100%',
              duration: 0.6,
              ease: 'power3.inOut'
            }, '-=0.3');
          }
        });
      }

      // 标题淡入
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 }
        );
      }
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = 'auto';
    };
  }, []);

  // 完全移除后不渲染
  if (!isVisible) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #e8f4f8 0%, #f0f8fb 30%, #f5fbfd 60%, #ffffff 100%)',
        willChange: 'transform, opacity'
      }}
    >
      {/* 背景装饰 - 彩色圆点 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 粉色圆点 */}
        <div className="absolute top-[15%] left-[10%] w-3 h-3 rounded-full bg-[#f598b4] opacity-40 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[25%] right-[15%] w-2 h-2 rounded-full bg-[#f598b4] opacity-50 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[30%] left-[20%] w-2.5 h-2.5 rounded-full bg-[#ffc1e0] opacity-45 animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-[20%] right-[25%] w-3 h-3 rounded-full bg-[#f598b4] opacity-40 animate-float" style={{ animationDelay: '1.5s' }} />
        
        {/* 蓝色圆点 */}
        <div className="absolute top-[20%] right-[20%] w-2 h-2 rounded-full bg-[#8dd4e8] opacity-50 animate-float" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-[40%] left-[15%] w-3 h-3 rounded-full bg-[#6ec9de] opacity-45 animate-float" style={{ animationDelay: '0.8s' }} />
        <div className="absolute bottom-[25%] right-[10%] w-2.5 h-2.5 rounded-full bg-[#8dd4e8] opacity-50 animate-float" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-[40%] left-[25%] w-2 h-2 rounded-full bg-[#6ec9de] opacity-40 animate-float" style={{ animationDelay: '0.6s' }} />
      </div>

      {/* 主内容 */}
      <div className="relative flex flex-col items-center gap-12">
        {/* 跳动的音符 - 直接渲染避免闪现 */}
        <div 
          ref={notesContainerRef}
          className="flex items-center justify-center"
          style={{ willChange: 'transform' }}
        >
          {NOTE_SYMBOLS.map((note, i) => (
            <span
              key={i}
              className="music-note"
              style={{
                fontSize: '40px',
                color: note.color,
                margin: '0 10px',
                filter: 'drop-shadow(0 2px 8px rgba(245, 152, 180, 0.3))',
                display: 'inline-block',
                transform: `rotate(${note.rotate}deg)`
              }}
              aria-hidden="true"
            >
              {note.symbol}
            </span>
          ))}
        </div>

        {/* 标题 - 设置初始不可见避免闪现 */}
        <div 
          ref={titleRef}
          className="text-center"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{
            fontFamily: 'var(--font-geist-sans, sans-serif)',
            background: 'linear-gradient(135deg, #f598b4 0%, #c388d9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            LUOXUEER
          </h1>
          <p className="text-[#b6a3b1] text-sm tracking-[0.3em]">罗雪儿</p>
        </div>

        {/* 加载进度 */}
        <div className="w-64 md:w-80">
          {/* 进度条 */}
          <div className="relative h-1 bg-gradient-to-r from-[#8dd4e8]/20 to-[#f598b4]/20 overflow-hidden rounded-full">
            <div
              ref={progressBarRef}
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ 
                width: '0%',
                background: 'linear-gradient(90deg, #8dd4e8 0%, #f598b4 100%)',
                boxShadow: '0 0 10px rgba(245, 152, 180, 0.4)'
              }}
            />
          </div>
          
          {/* 进度数字 */}
          <div className="flex justify-between items-center mt-3 text-[#b6a3b1] text-xs font-mono">
            <span className="uppercase tracking-wider">Loading</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-8 text-[#b6a3b1]/60 text-xs tracking-[0.3em]">
        ♪ MUSIC & DREAMS ♪
      </div>
    </div>
  );
}

