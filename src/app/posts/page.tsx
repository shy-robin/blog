import type { Metadata } from "next";
import Link from "next/link";
import { BlogShell } from "@/components/blog-shell";
import { PostList } from "@/components/post-list";
import { getPosts } from "@/sanity/posts";
import {
  filterPosts,
  getTagCounts,
  postsUrl,
  searchValue,
} from "@/lib/post-search";
import { site, absoluteUrl } from "@/lib/site";
type Props = {
  searchParams: Promise<{ q?: string | string[]; tag?: string | string[] }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const filtered = Boolean(searchValue(params.q) || searchValue(params.tag));
  const title = "文章";
  const description = "Web 前端开发的工程实践、技术方案与问题复盘。";
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl("/posts"),
      types: { "application/rss+xml": absoluteUrl("/feed.xml") },
    },
    robots: filtered
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      title: `${title} | ${site.name}`,
      description,
      url: absoluteUrl("/posts"),
      siteName: site.name,
      locale: "zh_CN",
      images: [absoluteUrl("/og")],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [absoluteUrl("/og")],
    },
  };
}

export default async function PostsPage({ searchParams }: Props) {
  const [posts, params] = await Promise.all([getPosts(), searchParams]);
  const query = searchValue(params.q);
  const tag = searchValue(params.tag);
  const filtered = filterPosts(posts, query, tag);
  const tags = getTagCounts(posts);
  const hasFilters = Boolean(query || tag);
  return (
    <BlogShell>
      <section className="page-intro">
        <p className="eyebrow">NOTES ON THE WEB</p>
        <h1>
          文章<span className="article-count">{posts.length}</span>
        </h1>
        <p>从具体问题出发，记录分析过程与实践经验。</p>
      </section>
      <section className="post-discovery" aria-label="查找文章">
        <form
          action="/posts"
          method="get"
          className="post-search"
          role="search"
        >
          <label htmlFor="post-query" className="sr-only">
            搜索文章标题、摘要或标签
          </label>
          <input
            key={`${query}:${tag}`}
            id="post-query"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="搜索标题、摘要或标签"
            maxLength={120}
          />
          {tag && <input type="hidden" name="tag" value={tag} />}
          <button type="submit">搜索</button>
        </form>
        <nav className="tag-filters" aria-label="按标签筛选文章">
          <Link href={postsUrl(query)} aria-current={!tag ? "page" : undefined}>
            全部 <span>{posts.length}</span>
          </Link>
          {tags.map((item) => (
            <Link
              key={item.name}
              href={postsUrl(query, item.name)}
              aria-current={tag === item.name ? "page" : undefined}
            >
              {item.name} <span>{item.count}</span>
            </Link>
          ))}
        </nav>
        {hasFilters && (
          <div className="search-summary">
            <p>
              找到 {filtered.length} 篇文章{query && <> · 关键词「{query}」</>}
              {tag && <> · 标签「{tag}」</>}
            </p>
            <Link href="/posts">清除筛选</Link>
          </div>
        )}
      </section>
      {hasFilters && !filtered.length ? (
        <section className="empty-state">
          <h2>没有找到匹配的文章</h2>
          <p>试试更短的关键词，或清除标签筛选。</p>
          <Link className="text-link" href="/posts">
            查看全部文章 →
          </Link>
        </section>
      ) : (
        <PostList posts={filtered} />
      )}
    </BlogShell>
  );
}
