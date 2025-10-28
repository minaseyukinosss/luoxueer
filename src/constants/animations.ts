/**
 * 动画相关的常量定义
 */

export const ANIMATION_CONFIG = {
  // 粒子动画配置
  PARTICLE: {
    DURATION: 1.5,
    EASE: 'power2.out',
    BASE_MULTIPLIER: 0.05,
    INCREMENT: 0.01,
  },
  
  // 文字入场动画配置
  TEXT_ENTRANCE: {
    GREETING: {
      DURATION: 1,
      STAGGER: 0.2,
      EASE: 'power2.out',
    },
    NAME: {
      DURATION: 1.2,
      DELAY: 0.4,
      EASE: 'back.out(1.7)',
    },
    WISHES: {
      DURATION: 0.8,
      DELAY: 0.8,
      STAGGER: 0.15,
      EASE: 'power2.out',
    },
  },
  
  // 悬停效果配置
  HOVER: {
    DURATION: 0.3,
    EASE: 'power2.out',
    SCALE: 1.05,
    TRANSLATE_Y: -5,
  },
  
  // 波纹效果配置
  RIPPLE: {
    SCALE_FROM: 0,
    SCALE_TO: 4,
    DURATION: 0.8,
    EASE: 'power2.out',
  },
} as const;

export const PARTICLE_POSITIONS = [
  { top: '20%', left: '10%', delay: 0 },
  { top: '40%', right: '15%', delay: 1 },
  { bottom: '30%', left: '20%', delay: 2 },
  { top: '60%', right: '25%', delay: 3 },
  { bottom: '40%', right: '10%', delay: 4 },
] as const;
