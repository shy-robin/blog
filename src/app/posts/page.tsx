import type { Metadata } from "next";
import Link from "next/link";
import { PostList } from "@/components/post-list";
import { PostTagFilters } from "@/components/post-tag-filters";
import { PostSearch } from "@/components/post-search";
import { getPostsPage } from "@/sanity/posts";
import { getTagCounts, postsUrl, searchValue } from "@/lib/post-search";
import { redirect } from "next/navigation";
import { POSTS_PER_PAGE, pageNumbers, pageValue } from "@/lib/post-pagination";
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
    <>
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
          <h2>没有找到匹配的文章</h2>
          <p>试试更短的关键词，或清除标签筛选。</p>
          <Link className="text-link" href="/posts">
            查看全部文章 →
          </Link>
        </section>
      ) : (
        <PostList posts={posts} />
      )}
      {matched > 0 && (
        <div className="pagination-section">
          <p className="pagination-summary">
            共 {matched} 篇 · 第 {(page - 1) * POSTS_PER_PAGE + 1}–
            {Math.min(page * POSTS_PER_PAGE, matched)} 篇
          </p>
          {pages > 1 && (
            <nav className="pagination" aria-label="文章分页">
              {page > 1 ? (
                <Link
                  prefetch={false}
                  href={postsUrl(query, tag, page - 1)}
                  rel="prev"
                >
                  上一页
                </Link>
              ) : (
                <span aria-disabled="true">上一页</span>
              )}
              <div className="pagination-numbers">
                {pageNumbers(page, pages).map((number, index, numbers) => (
                  <span className="pagination-item" key={number}>
                    {index > 0 && number - numbers[index - 1] > 1 && (
                      <span className="pagination-ellipsis" aria-hidden="true">
                        …
                      </span>
                    )}
                    <Link
                      prefetch={false}
                      href={postsUrl(query, tag, number)}
                      aria-label={`第 ${number} 页`}
                      aria-current={number === page ? "page" : undefined}
                    >
                      {number}
                    </Link>
                  </span>
                ))}
              </div>
              {page < pages ? (
                <Link
                  prefetch={false}
                  href={postsUrl(query, tag, page + 1)}
                  rel="next"
                >
                  下一页
                </Link>
              ) : (
                <span aria-disabled="true">下一页</span>
              )}
            </nav>
          )}
        </div>
      )}
    </>
  );
}
