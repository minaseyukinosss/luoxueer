'use client';

import { HeroSection } from './components/HeroSection';
import { SocialSectionCreative } from './components/SocialSectionCreative';
import { UpdatesSection } from './components/UpdatesSection';
import { useAboutData } from './hooks/useAboutData';

export default function AboutPage() {
  const {
    socialStats,
    traitChips,
    heroQuickLinks,
    filterOptions,
    selectedCategory,
    setSelectedCategory,
    totalFollowers,
    filteredUpdates,
    isLive,
    nextEvent,
    handleRefresh,
    formatSyncTime,
    getPlatformColor,
    socialLinks,
  } = useAboutData();

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f8f6f6] dark:bg-[#1a1013]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-20%] top-[-20%] h-80 w-80 rounded-full bg-[#f7d8e4]/40 blur-3xl" />
        <div className="absolute right-[-15%] bottom-[-10%] h-96 w-96 rounded-full bg-[#d2c3ff]/30 blur-3xl" />
      </div>
      <main className="relative z-10 flex flex-1 justify-center px-4 py-10 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="flex w-full max-w-[1200px] flex-col gap-10 md:gap-14">
          <HeroSection
            totalFollowers={totalFollowers}
            socialCount={socialStats.length}
            isLive={isLive}
            nextEvent={nextEvent}
            traitChips={traitChips}
            heroQuickLinks={heroQuickLinks}
          />
          <SocialSectionCreative
            socialStats={socialStats}
            socialLinks={socialLinks}
            handleRefresh={handleRefresh}
            formatSyncTime={formatSyncTime}
            getPlatformColor={getPlatformColor}
          />
          <UpdatesSection
            filteredUpdates={filteredUpdates}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            filterOptions={filterOptions}
          />
        </div>
      </main>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          75% {
            transform: scale(2);
            opacity: 0;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes hero-orbit {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(4deg) scale(1.02);
          }
          100% {
            transform: rotate(-2deg) scale(1);
          }
        }

        @keyframes hero-glow {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.08);
          }
        }

        @keyframes hero-drift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(20px, -10px, 0);
          }
          100% {
            transform: translate3d(-10px, 10px, 0);
          }
        }

        @keyframes hero-sway {
          0% {
            transform: rotate(12deg) translateY(0);
          }
          50% {
            transform: rotate(8deg) translateY(-8px);
          }
          100% {
            transform: rotate(12deg) translateY(4px);
          }
        }

        .animate-ping-slow {
          animation: ping-slow 2.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-hero-orbit {
          animation: hero-orbit 18s ease-in-out infinite alternate;
        }

        .animate-hero-glow {
          animation: hero-glow 6s ease-in-out infinite alternate;
        }

        .hero-light {
          filter: blur(80px);
          animation: hero-drift 14s ease-in-out infinite alternate;
        }

        .hero-ribbon {
          animation: hero-sway 18s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
