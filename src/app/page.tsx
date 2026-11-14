import Link from "next/link";
import { BlogShell } from "@/components/blog-shell";
import { formatDate, getPosts } from "@/sanity/posts";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { ArrowRight } from "@/components/arrow-right";
import { SiteIcon } from "@/components/site-icon";
import { getProfile, getProjects } from "@/sanity/portfolio";
import { displayProfile, safeExternalUrl } from "@/lib/portfolio";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
    types: { "application/rss+xml": absoluteUrl("/feed.xml") },
  },
};
export default async function Home() {
  const [posts, rawProfile, projects] = await Promise.all([
    getPosts(),
    getProfile(),
    getProjects(),
  ]);
  const profile = displayProfile(rawProfile);
  const github = safeExternalUrl(profile.githubUrl);
  return (
    <BlogShell active="home">
      <section className="personal-intro" aria-labelledby="personal-name">
        <h1 id="personal-name">
          {profile.name}
          <span className="identity-mark" aria-hidden="true">
            .
          </span>
        </h1>
        <div className="personal-prose">
          <p>
            我是 {profile.name}，一名前端开发者。
            <br />
            在代码里探索，在文字中沉淀。
          </p>
          <p>这里记录真实工程中的问题、方案与取舍，也留下一些生活里的思考。</p>
          <p>
            你可以从<Link href="/posts">写作</Link>了解我的思考，在
            <Link href="/projects">项目</Link>里看看实践，也可以读一读
            <Link href="/about">关于我</Link>。
          </p>
          {github && (
            <p className="personal-contact">
              也可以在{" "}
              <a href={github} target="_blank" rel="noreferrer">
                GitHub <ArrowRight />
              </a>{" "}
              找到我。
            </p>
          )}
        </div>
      </section>
      <div className="home-directory" aria-label="内容入口">
        <Link href="/posts">
          <SiteIcon name="writing" />
          <span>写作</span>
          <span className="directory-detail">{posts.length} 篇文章</span>
          <ArrowRight />
        </Link>
        <Link href="/projects">
          <SiteIcon name="projects" />
          <span>项目</span>
          <span className="directory-detail">
            {projects.length ? `${projects.length} 个项目` : "实践与作品"}
          </span>
          <ArrowRight />
        </Link>
      </div>
      <section className="home-section" aria-labelledby="latest-heading">
        <div className="index-heading">
          <h2 id="latest-heading" tabIndex={-1}>
            最近的写作
          </h2>
          <Link href="/posts">
            查看全部 <ArrowRight />
          </Link>
        </div>
        {posts.length ? (
          <ol className="writing-index">
            {posts.slice(0, 5).map((post) => (
              <li key={post._id}>
                <Link href={`/posts/${encodeURIComponent(post.slug)}`}>
                  <SiteIcon name="writing" />
                  <h3>{post.title}</h3>
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  )}
                  <ArrowRight />
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty-state">
            <h3>文章正在准备中</h3>
            <p>这里将记录前端开发中的实践与思考，欢迎下次再来。</p>
          </div>
        )}
      </section>
      <section
        className="home-section home-about"
        aria-labelledby="home-about-heading"
      >
        <div className="index-heading">
          <h2 id="home-about-heading">关于这里</h2>
          <Link href="/about">
            更多关于我 <ArrowRight />
          </Link>
        </div>
        <p>
          写下问题，也写下思考。这个站点以 Web
          前端文章为主，收集实践中值得留下的过程。
        </p>
        <a className="quiet-subscribe" href="/feed.xml">
          <SiteIcon name="rss" />
          通过 RSS 订阅更新
          <ArrowRight />
        </a>
      </section>
    </BlogShell>
  );
}
