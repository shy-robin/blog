import type { Post } from "@/sanity/posts";

export function searchValue(value?: string | string[]) {
  return (Array.isArray(value) ? value[0] || "" : value || "")
    .trim()
    .slice(0, 120);
}

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("zh-CN");
}

export function filterPosts(posts: Post[], query: string, tag: string) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return posts.filter((post) => {
    if (tag && !post.tags?.includes(tag)) return false;
    const text = normalize(
      [post.title, post.excerpt || "", ...(post.tags || [])].join(" "),
    );
    return terms.every((term) => text.includes(term));
  });
}

export function getTagCounts(posts: Pick<Post, "tags">[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of new Set(post.tags || [])) {
      if (tag.trim()) counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return Array.from(counts, ([name, count]) => ({ name, count })).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"),
  );
}

export function postsUrl(query = "", tag = "", page = 1) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (tag) params.set("tag", tag);
  if (page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return suffix ? `/posts?${suffix}` : "/posts";
}
