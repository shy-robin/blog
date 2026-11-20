import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { SanityImage } from "@/components/sanity-image";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";
import { BackArrow } from "@/components/back-arrow";
import { ArticleTocNav } from "@/components/article-toc-nav";
import { ArticleRailTools } from "@/components/article-rail-tools";
import { ArticleMobileToc } from "@/components/article-mobile-toc";
import { PreviewBanner } from "@/components/preview-banner";
import { getPost, getHeadings, formatDate } from "@/sanity/posts";
import { imageUrl, imageDimensions } from "@/sanity/images";
import { postsUrl } from "@/lib/post-search";
import { Comments } from "@/components/comments";
import { getPostMetadata } from "@/lib/seo";
import { getReadingStats } from "@/lib/reading-stats";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const draft = (await draftMode()).isEnabled;
  const post = await getPost(slug, draft);
  if (!post) notFound();
  const metadata = getPostMetadata(post);
  return draft
    ? { ...metadata, robots: { index: false, follow: false } }
    : metadata;
}
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const draft = (await draftMode()).isEnabled;
  const post = await getPost(slug, draft);
  if (!post) notFound();
  const headings = getHeadings(post.body);
  const stats = getReadingStats(post.body);
  const cover = imageUrl(post.coverImage);
  return (
    <>
      {draft && <PreviewBanner />}
      <article className="article">
        <header className="article-header">
          <Link className="back-link" href="/posts">
            <BackArrow />
            所有文章
          </Link>
          <h1>{post.title}</h1>
          <div className="article-meta">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}
            <span>约 {stats.minutes} 分钟阅读</span>
            <span>{stats.words.toLocaleString("zh-CN")} 字</span>
            {!!post.tags?.length && (
              <ul className="article-tags" aria-label="文章标签">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Link href={postsUrl("", tag)}>{tag}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {post.excerpt && <p className="article-summary">{post.excerpt}</p>}
        </header>
        {cover && (
          <div className="article-cover">
            <SanityImage
              key={cover}
              src={cover}
              alt={post.coverImage?.alt || ""}
              {...imageDimensions(post.coverImage)}
              priority
              sizes="(max-width: 1000px) 100vw, 1000px"
            />
          </div>
        )}
        <aside className="article-rail">
          <Link className="back-link" href="/posts">
            <BackArrow />
            所有文章
          </Link>
          {!!headings.length && <ArticleTocNav headings={headings} />}
          <ArticleRailTools />
        </aside>
        <div className="article-layout">
          {!!headings.length && (
            <ArticleMobileToc title={post.title} headings={headings} />
          )}
          <ArticleBody body={post.body || []} />
        </div>
        <div className="article-end">
          <span>感谢阅读</span>
          <Link href="/posts">继续浏览文章 →</Link>
        </div>
        <Comments postId={post._id} />
      </article>
    </>
  );
}
