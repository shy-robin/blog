import type { Metadata, MetadataRoute } from "next";
import type { Post } from "@/sanity/posts";
import { imageUrl } from "@/sanity/images";
import { site, absoluteUrl, postUrl } from "./site";

function publicPosts(posts: Post[]) {
  return posts.filter(
    (post) =>
      post.slug.trim() &&
      !post._id.startsWith("drafts.") &&
      !post._id.startsWith("versions."),
  );
}

function validDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return undefined;
  return new Date(value).toISOString();
}

export function buildSitemap(posts: Post[]): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/posts"), changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/projects"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    ...publicPosts(posts).map((post) => ({
      url: postUrl(post.slug),
      lastModified: validDate(post.updatedAt) || validDate(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

function escapeXml(value: string) {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildRss(posts: Post[]) {
  const entries = publicPosts(posts).slice(0, 50);
  const dates = entries.flatMap((post) => {
    const date = validDate(post.updatedAt) || validDate(post.publishedAt);
    return date ? [Date.parse(date)] : [];
  });
  const lastBuild = dates.length
    ? `<lastBuildDate>${new Date(Math.max(...dates)).toUTCString()}</lastBuildDate>`
    : "";
  const items = entries
    .map((post) => {
      const date = validDate(post.publishedAt) || validDate(post.updatedAt);
      return `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl(post.slug))}</link>
      <guid isPermaLink="false">${escapeXml(`post:${post._id}`)}</guid>
      <description>${escapeXml(post.excerpt || "")}</description>
      ${date ? `<pubDate>${new Date(date).toUTCString()}</pubDate>` : ""}
      ${(post.tags || []).map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}
    </item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${escapeXml(absoluteUrl("/posts"))}</link>
    <description>${escapeXml(site.description)}</description>
    <language>zh-CN</language>
    <atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
    ${lastBuild}
    ${items}
  </channel>
</rss>`;
}

export function getPostMetadata(post: Post): Metadata {
  const canonical = postUrl(post.slug);
  const description =
    post.excerpt?.trim() || `${post.title} · ${site.description}`;
  const cover = imageUrl(post.coverImage, 1200);
  // Use JPEG for broad compatibility with social preview crawlers.
  const image = new URL(cover || absoluteUrl("/og"));
  if (cover) {
    image.searchParams.delete("auto");
    image.searchParams.set("fm", "jpg");
  }
  const images = [
    { url: image.toString(), alt: post.coverImage?.alt || post.title },
  ];
  return {
    title: post.title,
    description,
    alternates: {
      canonical,
      types: { "application/rss+xml": absoluteUrl("/feed.xml") },
    },
    authors: [{ name: site.name, url: site.url }],
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: canonical,
      siteName: site.name,
      locale: "zh_CN",
      images,
      publishedTime: validDate(post.publishedAt),
      modifiedTime: validDate(post.updatedAt),
      authors: [site.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images,
    },
  };
}

export function getPageMetadata(
  title: string,
  path: string,
  description: string,
): Metadata {
  const url = absoluteUrl(path);
  const images = [
    {
      url: absoluteUrl("/og"),
      width: 1200,
      height: 630,
      alt: `${title} | ${site.name}`,
    },
  ];
  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": absoluteUrl("/feed.xml") },
    },
    openGraph: {
      type: "website",
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: "zh_CN",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images,
    },
  };
}
