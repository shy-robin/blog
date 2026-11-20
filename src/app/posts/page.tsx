import type { Metadata } from "next";
import Link from "next/link";
import { PostList } from "@/components/post-list";
import { PostTagFilters } from "@/components/post-tag-filters";
import { PostSearch } from "@/components/post-search";
import { getPostsPage } from "@/sanity/posts";
import { getTagCounts, postsUrl, searchValue } from "@/lib/post-search";
import { redirect } from "next/navigation";
import { POSTS_PER_PAGE, pageValue } from "@/lib/post-pagination";
import { site, absoluteUrl } from "@/lib/site";
type Props = {
  searchParams: Promise<{
    q?: string | string[];
    tag?: string | string[];
    page?: string | string[];
  }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const filtered = Boolean(searchValue(params.q) || searchValue(params.tag));
  const page = pageValue(params.page);
  const canonical = absoluteUrl(postsUrl("", "", page));
  const title = page > 1 ? `文章 · 第 ${page} 页` : "文章";
  const description = "Web 前端开发的工程实践、技术方案与问题复盘。";
  return {
    title,
    description,
    alternates: {
      canonical,
      types: { "application/rss+xml": absoluteUrl("/feed.xml") },
    },
    robots: filtered
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      title: `${title} | ${site.name}`,
      description,
      url: canonical,
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
  const params = await searchParams;
  const query = searchValue(params.q);
  const tag = searchValue(params.tag);
  const page = pageValue(params.page);
  const { posts, total, matched, tagSets } = await getPostsPage(
    query,
    tag,
    page,
  );
  const pages = Math.max(1, Math.ceil(matched / POSTS_PER_PAGE));
  if (page > pages) redirect(postsUrl(query, tag, pages));
  const tags = getTagCounts(tagSets);
  const hasFilters = Boolean(query || tag);
  return (
    <div className="posts-column">
      <section className="page-intro">
        <h1>
          文章<span className="article-count">{total}</span>
        </h1>
      </section>
      <section className="post-discovery" aria-label="查找文章">
        <PostSearch query={query} tag={tag} />
        <PostTagFilters tags={tags} total={total} query={query} tag={tag} />
        {hasFilters && (
          <div className="search-summary">
            <p>
              找到 {matched} 篇文章{query && <> · 关键词「{query}」</>}
              {tag && <> · 标签「{tag}」</>}
            </p>
            <Link href="/posts">清除筛选</Link>
          </div>
        )}
      </section>
      {hasFilters && !matched ? (
        <section className="empty-state">
          <h2>未找到匹配的文章</h2>
        </section>
      ) : (
        <PostList posts={posts} />
      )}
      {matched > 0 && (
        <div className="pagination-section">
          <p className="pagination-summary">共 {matched} 篇</p>
          {pages > 1 && (
            <nav className="pagination" aria-label="文章分页">
              {page > 1 ? (
                <Link
                  prefetch={false}
                  className="pagination-button"
                  href={postsUrl(query, tag, page - 1)}
                  rel="prev"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m15 6-6 6 6 6" />
                  </svg>
                  <span className="sr-only">上一页</span>
                </Link>
              ) : (
                <span className="pagination-button" aria-disabled="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m15 6-6 6 6 6" />
                  </svg>
                  <span className="sr-only">上一页</span>
                </span>
              )}
              <form className="pagination-jump" action="/posts" method="get">
                {query && <input type="hidden" name="q" value={query} />}
                {tag && <input type="hidden" name="tag" value={tag} />}
                <label htmlFor="pagination-page" className="sr-only">
                  跳转到页码
                </label>
                <input
                  key={page}
                  id="pagination-page"
                  name="page"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={pages}
                  defaultValue={page}
                />
                <span aria-hidden="true">/ {pages}</span>
              </form>
              {page < pages ? (
                <Link
                  prefetch={false}
                  className="pagination-button"
                  href={postsUrl(query, tag, page + 1)}
                  rel="next"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                  <span className="sr-only">下一页</span>
                </Link>
              ) : (
                <span className="pagination-button" aria-disabled="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                  <span className="sr-only">下一页</span>
                </span>
              )}
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
