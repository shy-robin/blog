import type { Metadata } from "next";
import { BlogShell } from "@/components/blog-shell";
import { SanityImage } from "@/components/sanity-image";
import { getProfile } from "@/sanity/portfolio";
import { displayProfile, contactEmailUrl, profileInfo } from "@/lib/portfolio";
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
  const email = contactEmailUrl(profile.email);
  const qq = profile.qq?.trim();
  const wechat = profile.wechat?.trim();
  const basicInfo = profileInfo(profile);
  const avatarFallback = (
    <span className="profile-initial" aria-hidden="true">
      {profile.name.slice(0, 1).toUpperCase()}
      <span className="brand-dot">.</span>
    </span>
  );
  const paragraphs =
    profile.bio
      ?.split(/\n\s*\n/)
      .map((text) => text.trim())
      .filter(Boolean) || [];
  return (
    <BlogShell active="about" className="about-shell">
      <div className="about-layout">
        <aside className="about-identity" aria-label="个人信息">
          <div className="profile-avatar">
            {avatar ? (
              <SanityImage
                src={avatar}
                alt={profile.avatar?.alt || `${profile.name} 的头像`}
                {...imageDimensions(profile.avatar)}
                sizes="(max-width: 520px) 80px, 96px"
                priority
                fallback={avatarFallback}
              />
            ) : (
              avatarFallback
            )}
          </div>
          <h1>
            {profile.name}
            <span className="brand-dot">.</span>
          </h1>
          <p className="about-headline">{profile.intro}</p>
          <section
            className="about-basic-info"
            aria-labelledby="basic-info-heading"
          >
            <h2 id="basic-info-heading">基本信息</h2>
            <dl>
              {basicInfo.map((item) => (
                <div key={item._key}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
          {(email || qq || wechat) && (
            <section
              className="about-contact"
              aria-labelledby="contact-heading"
            >
              <h2 id="contact-heading">联系方式</h2>
              <dl className="about-contact-list">
                {email && (
                  <div>
                    <dt>邮箱</dt>
                    <dd>
                      <a href={email}>{profile.email}</a>
                    </dd>
                  </div>
                )}
                {qq && (
                  <div>
                    <dt>扣扣</dt>
                    <dd>{qq}</dd>
                  </div>
                )}
                {wechat && (
                  <div>
                    <dt>微信</dt>
                    <dd>{wechat}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}
        </aside>
        <div className="about-reading">
          {!!paragraphs.length && (
            <section className="about-section">
              <h2>关于</h2>
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
            </div>
          </section>
        </div>
      </div>
    </BlogShell>
  );
}
