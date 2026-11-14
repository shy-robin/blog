import Link from "next/link";
import { SiteIcon, type SiteIconName } from "./site-icon";
import { ThemeToggle } from "./theme-toggle";

const destinations: {
  href: string;
  label: string;
  key: "home" | "posts" | "projects" | "about";
  icon: SiteIconName;
}[] = [
  { href: "/", label: "首页", key: "home", icon: "home" },
  { href: "/posts", label: "写作", key: "posts", icon: "writing" },
  { href: "/projects", label: "项目", key: "projects", icon: "projects" },
  { href: "/about", label: "关于", key: "about", icon: "about" },
];
export function BlogShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: "home" | "posts" | "projects" | "about";
}) {
  return (
    <div className={`blog-shell${active === "home" ? " blog-shell-home" : ""}`}>
      <a className="skip-link" href="#main">
        跳到正文
      </a>
      {active !== "home" && (
        <header className="site-header">
          <Link className="brand" href="/">
            ShyRobin<span className="brand-dot">.</span>
          </Link>
          <Link className="header-index" href="/posts">
            文章索引
          </Link>
        </header>
      )}
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
      <nav className="site-dock" aria-label="主导航">
        {destinations.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active === item.key ? "page" : undefined}
          >
            <SiteIcon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
        <div className="dock-theme">
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
