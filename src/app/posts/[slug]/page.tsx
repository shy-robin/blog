import type { Metadata } from "next";
import Link from "next/link";
import { SanityImage } from "@/components/sanity-image";
import { notFound } from "next/navigation";
import { BlogShell } from "@/components/blog-shell";
import { ArticleBody } from "@/components/article-body";
import { getPost, getPosts, getHeadings, formatDate } from "@/sanity/posts";
import { imageUrl, imageDimensions } from "@/sanity/images";
type Props = { params: Promise<{ slug: string }> };
export const revalidate = 60;
export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
    },
  };
}
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const headings = getHeadings(post.body);
  const cover = imageUrl(post.coverImage);
  return (
    <BlogShell>
      <article className="article">
        <header className="article-header">
          <Link className="back-link" href="/posts">
            ← 所有文章
          </Link>
          <h1>{post.title}</h1>
          <div className="article-meta">
            <span>ShyRobin</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}
          </div>
          {post.excerpt && <p className="article-summary">{post.excerpt}</p>}
          {!!post.tags?.length && (
            <ul className="tags" aria-label="文章标签">
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
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
        <div className="article-layout">
          <ArticleBody body={post.body || []} />
          {!!headings.length && (
            <aside className="article-toc">
              <nav aria-label="文章目录">
                <p>本文目录</p>
                <ul>
                  {headings.map((heading) => (
                    <li
                      key={heading.id}
                      className={heading.level === "h3" ? "toc-nested" : ""}
                    >
                      <a href={`#${heading.id}`}>{heading.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>
        <div className="article-end">
          <span>感谢阅读</span>
          <Link href="/posts">继续浏览文章 →</Link>
        </div>
      </article>
    </BlogShell>
  );
}
