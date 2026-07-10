export interface UpdateShowcaseMetrics {
  itemCount: number;
  sectionTop: number;
  sectionHeight: number;
  viewportHeight: number;
}

export interface UpdateShowcaseState {
  activeIndex: number;
  progress: number;
}

export interface UpdateTargetProgressOptions {
  index: number;
  itemCount: number;
}

export interface LockedUpdateIndexOptions {
  currentScrollY: number;
  expiresAt: number;
  index: number;
  itemCount: number;
  now: number;
  targetScrollY: number;
  tolerance?: number;
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

export function getUpdateTargetProgress({
  index,
  itemCount,
}: UpdateTargetProgressOptions): number {
  const safeItemCount = Math.max(0, Math.floor(itemCount));

  if (safeItemCount <= 1) {
    return 0;
  }

  const safeIndex = clamp(Math.floor(index), 0, safeItemCount - 1);
  return safeIndex / (safeItemCount - 1);
}

export function getLockedUpdateIndex({
  currentScrollY,
  expiresAt,
  index,
  itemCount,
  now,
  targetScrollY,
  tolerance = 24,
}: LockedUpdateIndexOptions): number | null {
  const safeItemCount = Math.max(0, Math.floor(itemCount));

  if (safeItemCount <= 0 || now >= expiresAt) {
    return null;
  }

  if (Math.abs(currentScrollY - targetScrollY) <= tolerance) {
    return null;
  }

  return clamp(Math.floor(index), 0, safeItemCount - 1);
}

export function getUpdateShowcaseState({
  itemCount,
  sectionTop,
  sectionHeight,
  viewportHeight,
}: UpdateShowcaseMetrics): UpdateShowcaseState {
  const safeItemCount = Math.max(0, Math.floor(itemCount));

  if (safeItemCount <= 1) {
    return {
      activeIndex: 0,
      progress: 0,
    };
  }

  const scrollRange = Math.max(1, sectionHeight - viewportHeight);
  const progress = clamp(-sectionTop / scrollRange, 0, 1);
  const activeIndex = clamp(Math.round(progress * (safeItemCount - 1)), 0, safeItemCount - 1);

  return {
    activeIndex,
    progress,
  };
}
