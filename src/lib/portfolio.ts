import type { PostImage } from "@/sanity/posts";

export type Experience = {
  _key: string;
  organization?: string;
  role: string;
  period?: string;
  summary?: string;
};
export type Profile = {
  name?: string;
  intro?: string;
  bio?: string;
  avatar?: PostImage;
  location?: string;
  githubUrl?: string;
  email?: string;
  qq?: string;
  wechat?: string;
  wechatQrCode?: PostImage;
  interests?: string[];
  experiences?: Experience[];
};
export type Project = {
  _id: string;
  title: string;
  summary: string;
  coverImage?: PostImage;
  role?: string;
  contributions?: string;
  technologies?: string[];
  demoUrl?: string;
  sourceUrl?: string;
};

export function displayProfile(profile: Profile | null) {
  return {
    ...profile,
    name: profile?.name?.trim() || "ShyRobin",
    intro: profile?.intro?.trim() || "记录 Web 前端开发的实践与思考。",
    githubUrl: profile?.githubUrl,
    interests: profile?.interests || [],
    experiences: profile?.experiences || [],
  };
}

export function safeExternalUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value.trim());
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

export function contactEmailUrl(email?: string) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return undefined;
  return `mailto:${encodeURIComponent(email)}`;
}

export function qqContactUrls(value?: string) {
  const account = value?.trim();
  if (!account || !/^[1-9]\d{4,11}$/.test(account)) return undefined;
  return {
    web: `https://wpa.qq.com/msgrd?v=3&uin=${account}&site=qq&menu=yes`,
    mobile: `mqqwpa://im/chat?chat_type=wpa&uin=${account}&version=1&src_type=web`,
    desktop: `tencent://message/?uin=${account}&Site=&Menu=yes`,
  };
}

export function projectLinks(project: Pick<Project, "demoUrl" | "sourceUrl">) {
  return [
    { label: "在线演示", href: safeExternalUrl(project.demoUrl) },
    { label: "源码", href: safeExternalUrl(project.sourceUrl) },
  ].filter((link): link is { label: string; href: string } =>
    Boolean(link.href),
  );
}

export function contentCacheTag(type?: string) {
  switch (type) {
    case "post":
      return "posts";
    case "project":
      return "projects";
    case "profile":
      return "profile";
    default:
      return null;
  }
}
