import { SanityImage } from "./sanity-image";
import { imageUrl, imageDimensions } from "@/sanity/images";
import { projectLinks, type Project } from "@/lib/portfolio";

export function ProjectCard({ project }: { project: Project }) {
  const image = imageUrl(project.coverImage, 1200);
  const links = projectLinks(project);
  const contributions =
    project.contributions
      ?.split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean) || [];
  return (
    <article
      className={`project-card${image ? " project-card-with-image" : ""}`}
    >
      {image && (
        <div className="project-image">
          <SanityImage
            src={image}
            alt={project.coverImage?.alt || `${project.title} 项目截图`}
            {...imageDimensions(project.coverImage)}
            sizes="(max-width: 800px) 100vw, 380px"
          />
        </div>
      )}
      <div className="project-content">
        <h2>{project.title}</h2>
        <p className="project-summary">{project.summary}</p>
        {!!project.technologies?.length && (
          <ul className="tags" aria-label="技术栈">
            {Array.from(new Set(project.technologies)).map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        )}
        {project.role && (
          <p className="project-role">
            <span>我的职责</span>
            {project.role}
          </p>
        )}
        {!!contributions.length && (
          <ul className="project-contributions">
            {contributions.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        )}
        {!!links.length && (
          <div className="project-links">
            {links.map((link) => (
              <a
                href={link.href}
                key={link.label}
                target="_blank"
                rel="noreferrer"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
