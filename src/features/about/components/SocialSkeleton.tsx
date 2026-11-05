export const SocialSkeleton = ({ className = '' }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`block animate-pulse rounded-md bg-[#e6d4de]/70 motion-reduce:animate-none dark:bg-white/10 ${className}`}
  />
);
