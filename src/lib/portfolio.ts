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
  basicInfo?: { _key: string; label: string; value: string }[];
  gender?: string;
  birthDate?: string;
  hometown?: string;
  school?: string;
  occupation?: string;
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

export function profileAge(birthDate?: string, now = new Date()) {
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return undefined;
  const birthday = new Date(`${birthDate}T00:00:00Z`);
  if (
    Number.isNaN(birthday.getTime()) ||
    birthday.toISOString().slice(0, 10) !== birthDate
  )
    return undefined;
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) =>
    Number(parts.find((item) => item.type === type)?.value);
  const [year, month, day] = birthDate.split("-").map(Number);
  const age =
    part("year") -
    year -
    (part("month") < month || (part("month") === month && part("day") < day)
      ? 1
      : 0);
  return age >= 0 ? age : undefined;
}

export function profileInfo(profile: Profile, now = new Date()) {
  const age = profileAge(profile.birthDate, now);
  const details = [
    { _key: "gender", label: "性别", value: profile.gender?.trim() },
    {
      _key: "age",
      label: "年龄",
      value: age === undefined ? undefined : `${age} 岁`,
    },
    { _key: "hometown", label: "籍贯", value: profile.hometown?.trim() },
    { _key: "school", label: "学校", value: profile.school?.trim() },
    { _key: "occupation", label: "职业", value: profile.occupation?.trim() },
  ].filter((item): item is { _key: string; label: string; value: string } =>
    Boolean(item.value),
  );
  const provided = (profile.basicInfo || []).filter(
    (item) =>
      item.label?.trim() &&
      item.value?.trim() &&
      !["城市", "所在城市"].includes(item.label.trim()) &&
      !details.some((detail) => detail.label === item.label.trim()),
  );
  const name = profile.name?.trim();
  return [
    ...(provided.length
      ? provided
      : name
        ? [{ _key: "display-name", label: "称呼", value: name }]
        : []),
    ...details,
  ];
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
  // Preserve the address separator for native mail handlers; escape query and
  // fragment delimiters so an address cannot inject extra mail headers.
  return `mailto:${encodeURIComponent(email).replace(/%40/g, "@")}`;
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
