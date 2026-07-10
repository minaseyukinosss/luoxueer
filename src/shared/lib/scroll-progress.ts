export interface ScrollProgressMetrics {
  scroll: number;
  limit: number;
}

export interface ScrollProgressState {
  isVisible: boolean;
  progress: number;
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const toFiniteNumber = (value: number) => {
  return Number.isFinite(value) ? value : 0;
};

export function getScrollProgressState({
  scroll,
  limit,
}: ScrollProgressMetrics): ScrollProgressState {
  const safeLimit = Math.max(0, toFiniteNumber(limit));

  if (safeLimit <= 0) {
    return {
      isVisible: false,
      progress: 0,
    };
  }

  return {
    isVisible: true,
    progress: clamp(toFiniteNumber(scroll) / safeLimit, 0, 1),
  };
}
