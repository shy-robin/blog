import Link from "next/link";
import type { Metadata } from "next";
import { BlogShell } from "@/components/blog-shell";
import { SanityImage } from "@/components/sanity-image";
import { getProfile } from "@/sanity/portfolio";
import {
  displayProfile,
  safeExternalUrl,
  contactEmailUrl,
} from "@/lib/portfolio";
import { imageUrl, imageDimensions } from "@/sanity/images";
import { getPageMetadata } from "@/lib/seo";

export const revalidate = 60;
export async function generateMetadata(): Promise<Metadata> {
  const profile = displayProfile(await getProfile());
  return getPageMetadata(
    "关于",
    "/about",
    `${profile.name} · ${profile.intro}`,
  );
}

export default async function AboutPage() {
  const profile = displayProfile(await getProfile());
  const avatar = imageUrl(profile.avatar, 400);
  const github = safeExternalUrl(profile.githubUrl);
  const email = contactEmailUrl(profile.email);
  const paragraphs =
    profile.bio
      ?.split(/\n\s*\n/)
      .map((text) => text.trim())
      .filter(Boolean) || [];
  return (
    <BlogShell active="about">
      <section className="about-intro">
        <div>
          <h1>
            你好，我是
            <br />
            <span>{profile.name}</span>。
          </h1>
          <p className="about-headline">{profile.intro}</p>
          {profile.location && (
            <p className="about-location">{profile.location}</p>
          )}
        </div>
        <div className="profile-avatar">
          {avatar ? (
            <SanityImage
              src={avatar}
              alt={profile.avatar?.alt || `${profile.name} 的头像`}
              {...imageDimensions(profile.avatar)}
              sizes="(max-width: 520px) 100px, 160px"
              priority
            />
          ) : (
            <span aria-hidden="true">
              {profile.name.slice(0, 1).toUpperCase()}
              <span className="brand-dot">.</span>
            </span>
          )}
        </div>
      </section>
      <div className="about-sections">
        {!!paragraphs.length && (
          <section className="about-section">
            <h2>关于我</h2>
            <div className="about-copy">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
        )}
        {!!profile.interests.length && (
          <section className="about-section">
            <h2>关注方向</h2>
            <ul className="interest-tags">
              {Array.from(new Set(profile.interests)).map((interest) => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>
          </section>
        )}
        {!!profile.experiences.length && (
          <section className="about-section">
            <h2>技术经历</h2>
            <ol className="experience-list">
              {profile.experiences.map((item) => (
                <li key={item._key}>
                  {item.period && (
                    <p className="experience-period">{item.period}</p>
                  )}
                  <h3>{item.role}</h3>
                  {item.organization && (
                    <p className="experience-organization">
                      {item.organization}
                    </p>
                  )}
                  {item.summary && (
                    <p className="experience-summary">{item.summary}</p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
        <section className="about-section">
          <h2>关于这个博客</h2>
          <div className="about-copy">
            <p>
              这里以 Web
              前端文章为主，记录真实工程中的问题、分析过程与方案取舍，也保留一些生活里的思考。
            </p>
            <div className="about-actions">
              <Link href="/posts">阅读文章 →</Link>
              <Link href="/projects">看看项目 →</Link>
            </div>
          </div>
        </section>
        {(github || email) && (
          <section className="about-section">
            <h2>保持联系</h2>
            <div className="about-actions">
              {github && (
                <a href={github} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              )}
              {email && <a href={email}>{profile.email}</a>}
            </div>
          </section>
        )}
      </div>
    </BlogShell>
  );
}
