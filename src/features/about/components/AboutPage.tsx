"use client";

import { HeroSection } from "@/features/about/components/HeroSection";
import { SocialSectionCreative } from "@/features/about/components/SocialSectionCreative";
import { UpdatesSection } from "@/features/about/components/UpdatesSection";
import { useAboutData } from "@/features/about/hooks/useAboutData";
import "@/features/about/styles/social-orbit.css";

export default function AboutPage() {
  const {
    socialStats,
    traitChips,
    heroQuickLinks,
    totalFollowers,
    isTotalFollowersLoading,
    updates,
    isLive,
    handleRefresh,
    formatSyncTime,
    socialLinks,
  } = useAboutData();

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#f8f6f6] dark:bg-[#1a1013]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-20%] top-[-20%] h-80 w-80 rounded-full bg-[#f7d8e4]/40 blur-3xl" />
        <div className="absolute right-[-15%] bottom-[-10%] h-96 w-96 rounded-full bg-[#d2c3ff]/30 blur-3xl" />
      </div>
      <main className="relative z-10 flex flex-1 justify-center px-4 pt-10 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="flex w-full max-w-[1200px] flex-col gap-10 md:gap-14">
          <HeroSection
            totalFollowers={totalFollowers}
            totalFollowersLoading={isTotalFollowersLoading}
            socialCount={socialStats.length}
            isLive={isLive}
            traitChips={traitChips}
            heroQuickLinks={heroQuickLinks}
          />
          <SocialSectionCreative
            socialStats={socialStats}
            socialLinks={socialLinks}
            handleRefresh={handleRefresh}
            formatSyncTime={formatSyncTime}
          />
          <UpdatesSection updates={updates} />
        </div>
      </main>
    </div>
  );
}
