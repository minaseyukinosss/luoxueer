import { getWeiboRequestHeaders, isAllowedWeiboAvatarUrl } from "@/shared/lib/weibo";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url")?.trim();

  if (!url || !isAllowedWeiboAvatarUrl(url)) {
    return new Response("Invalid avatar url", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: getWeiboRequestHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      return new Response("Avatar fetch failed", { status: response.status });
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response("Avatar fetch failed", { status: 502 });
  }
}
