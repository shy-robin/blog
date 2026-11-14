export function resolveSiteUrl(value: string) {
  const url = new URL(value);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without credentials",
    );
  }
  return url.origin;
}

export const site = {
  name: "ShyRobin",
  title: "ShyRobin · 前端实践与思考",
  description:
    "ShyRobin 的个人博客，记录 Web 前端工程实践、技术方案与生活思考。",
  url: resolveSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL || "https://blog-tau-coral-10.vercel.app",
  ),
};

export function absoluteUrl(path: string) {
  return new URL(path, `${site.url}/`).toString();
}

export function postUrl(slug: string) {
  return absoluteUrl(`/posts/${encodeURIComponent(slug)}`);
}
