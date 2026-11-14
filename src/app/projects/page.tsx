import Link from "next/link";
import { BlogShell } from "@/components/blog-shell";
import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/sanity/portfolio";
import { getPageMetadata } from "@/lib/seo";

export const revalidate = 60;
export const metadata = getPageMetadata(
  "项目",
  "/projects",
  "ShyRobin 的项目实践，记录技术选型、个人贡献与解决的问题。",
);

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <BlogShell active="projects">
      <section className="page-intro">
        <p className="eyebrow">BUILT WITH INTENT</p>
        <h1>
          项目<span className="article-count">{projects.length}</span>
        </h1>
        <p>把思考变成可以使用的东西，记录实现过程中的选择与收获。</p>
      </section>
      {projects.length ? (
        <div className="project-list">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <section className="empty-state portfolio-empty">
          <h2>项目正在整理中</h2>
          <p>项目介绍与实践记录会陆续放在这里。</p>
          <a
            className="text-link"
            href="https://github.com/shy-robin"
            target="_blank"
            rel="noreferrer"
          >
            先看看 GitHub ↗
          </a>
        </section>
      )}
      <div className="portfolio-bottom">
        <p>关于这些实践中的思考，也会写成文章。</p>
        <Link href="/posts">阅读文章 →</Link>
      </div>
    </BlogShell>
  );
}
