const WEIBO_REQUEST_HEADERS = {
  Accept: "application/json, text/plain, */*",
  Referer: "https://weibo.com/",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  "X-Requested-With": "XMLHttpRequest",
} satisfies HeadersInit;

const ALLOWED_WEIBO_AVATAR_HOSTS = ["sinaimg.cn", "wbimg.cn"];

export const getWeiboRequestHeaders = (): HeadersInit => {
  const cookie = process.env.WEIBO_COOKIE;

  if (!cookie) {
    return WEIBO_REQUEST_HEADERS;
  }

  return {
    ...WEIBO_REQUEST_HEADERS,
    Cookie: cookie,
  };
};

export const isAllowedWeiboAvatarUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;

    const hostname = url.hostname.toLowerCase();
    return ALLOWED_WEIBO_AVATAR_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
};

export const toWeiboAvatarProxyUrl = (avatarUrl: string): string => {
  const trimmed = avatarUrl.trim();
  if (!trimmed || !isAllowedWeiboAvatarUrl(trimmed)) {
    return "";
  }

  return `/api/weibo/avatar?url=${encodeURIComponent(trimmed)}`;
};
