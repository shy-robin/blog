import Link from "next/link";
import { SiteIcon } from "./site-icon";
import { BottomNav, type NavPage } from "./bottom-nav";
import { getProfile } from "@/sanity/portfolio";
import { displayProfile } from "@/lib/portfolio";
import { imageUrl } from "@/sanity/images";

export async function BlogShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: NavPage;
}) {
  // Navigation should remain usable if the optional profile cannot be loaded.
  const profile = displayProfile(await getProfile().catch(() => null));
  const avatarUrl = imageUrl(profile.avatar, 80);
  return (
    <div className="blog-shell">
      <a className="skip-link" href="#main">
        跳到正文
      </a>
      <header className="site-header">
        <Link className="brand" href="/posts">
          ShyRobin<span className="brand-dot">.</span>
        </Link>
        <Link className="header-index" href="/posts">
          文章索引
        </Link>
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="footer-topline">
          <p>在代码里探索，在文字中沉淀。</p>
          <a href="/feed.xml">
            <SiteIcon name="rss" /> RSS 订阅
          </a>
        </div>
        <p className="footer-signature">ShyRobin · 个人写作与项目记录</p>
        <div>
          <a
            href="https://beian.miit.gov.cn/#/Integrated/index"
            target="_blank"
            rel="noreferrer"
          >
            京ICP备2024096758号-1
          </a>
          <a
            href="https://beian.mps.gov.cn/#/query/webSearch?code=11011402054462"
            target="_blank"
            rel="noreferrer"
          >
            京公网安备11011402054462
          </a>
        </div>
      </footer>
      <BottomNav active={active} avatarUrl={avatarUrl} name={profile.name} />
    </div>
  );
}
