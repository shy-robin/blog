import Link from "next/link";
import { BlogShell } from "@/components/blog-shell";
import { PostList } from "@/components/post-list";
import { getPosts } from "@/sanity/posts";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
    types: { "application/rss+xml": absoluteUrl("/feed.xml") },
  },
};
export default async function Home() {
  const posts = await getPosts();
  return (
    <BlogShell>
      <section className="home-intro">
        <p className="eyebrow">SHYROBIN / WEB DEVELOPMENT</p>
        <h1>
          在代码里探索，
          <br />
          在文字中沉淀<span>。</span>
        </h1>
        <p className="intro-description">
          我是
          ShyRobin，一名前端开发者。这里记录真实工程中的问题、方案与取舍，也留下一些生活里的思考。
        </p>
        <Link className="text-link" href="/posts">
          浏览所有文章 <span aria-hidden="true">→</span>
        </Link>
      </section>
      <section aria-labelledby="latest-heading">
        <div className="section-heading">
          <h2 id="latest-heading">最新文章</h2>
          <Link href="/posts">全部文章 ↗</Link>
        </div>
        <PostList posts={posts.slice(0, 5)} />
      </section>
    </BlogShell>
  );
}
