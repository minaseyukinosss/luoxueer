export const SOCIAL_STATS_CACHE_SECONDS = 60;

export const SOCIAL_STATS_CACHE_HEADERS = {
  "Cache-Control": `public, s-maxage=${SOCIAL_STATS_CACHE_SECONDS}, stale-while-revalidate=300`,
} satisfies HeadersInit;

export const FALLBACK_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
  "X-Data-Source": "fallback",
} satisfies HeadersInit;
