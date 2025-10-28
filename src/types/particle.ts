/**
 * 粒子动画相关的类型定义
 */

export interface ParticleSetter {
  setX: (value: number) => void;
  setY: (value: number) => void;
}

export interface ParticleConfig {
  duration: number;
  ease: string;
  multiplier: number;
}

export interface MousePosition {
  x: number;
  y: number;
}
