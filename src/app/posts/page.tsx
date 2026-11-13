import type { Metadata } from "next";
import { BlogShell } from "@/components/blog-shell";
import { PostList } from "@/components/post-list";
import { getPosts } from "@/sanity/posts";
export const metadata: Metadata = {
  title: "文章",
  description: "Web 前端开发的工程实践、技术方案与问题复盘。",
};
export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <BlogShell>
      <section className="page-intro">
        <p className="eyebrow">NOTES ON THE WEB</p>
        <h1>
          文章<span className="article-count">{posts.length}</span>
        </h1>
        <p>从具体问题出发，记录分析过程与实践经验。</p>
      </section>
      <PostList posts={posts} />
    </BlogShell>
  );
}
