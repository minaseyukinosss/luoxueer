'use client';

import { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ParticleSetter, MousePosition } from '@/types/particle';
import { ANIMATION_CONFIG, PARTICLE_POSITIONS } from '@/constants/animations';
import '@/styles/components/home-page.css';

/**
 * 首页组件 - 生日祝福页面
 * 包含粒子动画、文字动画和交互效果
 */
export default function Home() {
  // 本地化功能，当前未使用但保留备用
  // const { t } = useLocale();
  const mainRef = useRef<HTMLDivElement>(null);
  const particleSettersRef = useRef<ParticleSetter[]>([]);

  /**
   * 处理鼠标移动事件，更新粒子位置
   * @param e 鼠标事件对象
   */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const mousePosition: MousePosition = {
      x: e.clientX,
      y: e.clientY,
    };
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    particleSettersRef.current.forEach((setter, index) => {
      const multiplier = ANIMATION_CONFIG.PARTICLE.BASE_MULTIPLIER + index * ANIMATION_CONFIG.PARTICLE.INCREMENT;
      setter.setX((mousePosition.x - centerX) * multiplier);
      setter.setY((mousePosition.y - centerY) * multiplier);
    });
  }, []);

  /**
   * 创建点击波纹效果
   * @param e 鼠标点击事件对象
   */
  const createRipple = useCallback((e: React.MouseEvent) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    
    gsap.fromTo(ripple, 
      { scale: ANIMATION_CONFIG.RIPPLE.SCALE_FROM, opacity: 1 },
      { 
        scale: ANIMATION_CONFIG.RIPPLE.SCALE_TO, 
        opacity: 0, 
        duration: ANIMATION_CONFIG.RIPPLE.DURATION, 
        ease: ANIMATION_CONFIG.RIPPLE.EASE, 
        onComplete: () => ripple.remove() 
      }
    );
  }, []);

  useEffect(() => {
    // 初始化粒子动画setter
    const initializeParticles = () => {
      if (mainRef.current) {
        const particles = mainRef.current.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
          const setX = gsap.quickTo(particle, 'x', { 
            duration: ANIMATION_CONFIG.PARTICLE.DURATION, 
            ease: ANIMATION_CONFIG.PARTICLE.EASE 
          });
          const setY = gsap.quickTo(particle, 'y', { 
            duration: ANIMATION_CONFIG.PARTICLE.DURATION, 
            ease: ANIMATION_CONFIG.PARTICLE.EASE 
          });
          particleSettersRef.current[index] = { setX, setY };
        });
      }
    };

    // 初始化文字入场动画
    const initializeTextAnimations = () => {
      const greetingTexts = document.querySelectorAll('.greeting-container .info-text');
      gsap.fromTo(greetingTexts, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: ANIMATION_CONFIG.TEXT_ENTRANCE.GREETING.DURATION, 
          stagger: ANIMATION_CONFIG.TEXT_ENTRANCE.GREETING.STAGGER, 
          ease: ANIMATION_CONFIG.TEXT_ENTRANCE.GREETING.EASE 
        }
      );
      
      const nameTexts = document.querySelectorAll('.name-container .info-text');
      gsap.fromTo(nameTexts, 
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: ANIMATION_CONFIG.TEXT_ENTRANCE.NAME.DURATION, 
          delay: ANIMATION_CONFIG.TEXT_ENTRANCE.NAME.DELAY, 
          ease: ANIMATION_CONFIG.TEXT_ENTRANCE.NAME.EASE 
        }
      );
      
      const wishesTexts = document.querySelectorAll('.wishes-container .info-text');
      gsap.fromTo(wishesTexts, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: ANIMATION_CONFIG.TEXT_ENTRANCE.WISHES.DURATION, 
          delay: ANIMATION_CONFIG.TEXT_ENTRANCE.WISHES.DELAY, 
          stagger: ANIMATION_CONFIG.TEXT_ENTRANCE.WISHES.STAGGER, 
          ease: ANIMATION_CONFIG.TEXT_ENTRANCE.WISHES.EASE 
        }
      );
    };

    // 移除滚动触发动画，因为现在是一屏展示

    // 初始化悬停效果
    const initializeHoverEffects = () => {
      const allTexts = document.querySelectorAll('.info-text');
      const handleMouseEnter = (text: Element) => {
        gsap.to(text, { 
          scale: ANIMATION_CONFIG.HOVER.SCALE, 
          duration: ANIMATION_CONFIG.HOVER.DURATION, 
          ease: ANIMATION_CONFIG.HOVER.EASE 
        });
      };
      
      const handleMouseLeave = (text: Element) => {
        gsap.to(text, { 
          scale: 1, 
          duration: ANIMATION_CONFIG.HOVER.DURATION, 
          ease: ANIMATION_CONFIG.HOVER.EASE 
        });
      };

      allTexts.forEach((text) => {
        text.addEventListener('mouseenter', () => handleMouseEnter(text));
        text.addEventListener('mouseleave', () => handleMouseLeave(text));
      });

      return { allTexts, handleMouseEnter, handleMouseLeave };
    };

    // 执行初始化
    initializeParticles();
    initializeTextAnimations();
    const hoverEffects = initializeHoverEffects();

    // 清理函数
    return () => {
      hoverEffects.allTexts.forEach((text) => {
        text.removeEventListener('mouseenter', () => hoverEffects.handleMouseEnter(text));
        text.removeEventListener('mouseleave', () => hoverEffects.handleMouseLeave(text));
      });
    };
  }, []);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden font-['Poppins'] bg-gradient-to-br from-[#ecfcff] via-[#a6efff] to-[#a6efff]"
      ref={mainRef} 
      onMouseMove={handleMouseMove} 
      onClick={createRipple}
    >
      <div className="flex flex-col justify-center items-center h-screen mx-[10%] relative z-[2]">
        <div className="flex flex-col justify-center items-center h-[80%] gap-8">
          <div className="absolute w-full h-full pointer-events-none z-[1]">
            {PARTICLE_POSITIONS.map((_, index) => (
              <div key={index} className="particle" />
            ))}
          </div>
          
          <div className="flex flex-col items-center gap-2 page-transition-element">
            <span className="info-text primary">HAPPY<span>WISH</span></span>
            <span className="info-text primary">BIRTHDAY<span>HEALTH</span></span>
          </div>
          
          <div className="flex flex-col items-center my-4 page-transition-element">
            <span className="info-text highlight">LUNA XUEYI<span>SUCCESS</span></span>
          </div>
          
          <div className="flex flex-col items-center gap-3 page-transition-element">
            <span className="info-text secondary">BRIGHT FUTURE<span>WEALTHY</span></span>
            <span className="info-text secondary">HAPPINESS<span>FOREVER</span></span>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-screen h-screen">
        <Image
          src="/images/home/home-portrait.webp"
          alt="Birthday Image"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-full z-[1] bg-gradient-to-t from-black/20 to-black/20"></div>
    </div>
  );
}