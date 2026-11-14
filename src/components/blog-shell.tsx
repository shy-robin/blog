import Link from "next/link";
export function BlogShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: "home" | "posts" | "projects" | "about";
}) {
  return (
    <div className="blog-shell">
      <a className="skip-link" href="#main">
        跳到正文
      </a>
      <header className="site-header">
        <Link className="brand" href="/">
          ShyRobin<span className="brand-dot">.</span>
        </Link>
        <nav aria-label="主导航">
          <Link href="/" aria-current={active === "home" ? "page" : undefined}>
            首页
          </Link>
          <Link
            href="/posts"
            aria-current={active === "posts" ? "page" : undefined}
          >
            文章
          </Link>
          <Link
            href="/projects"
            aria-current={active === "projects" ? "page" : undefined}
          >
            项目
          </Link>
          <Link
            href="/about"
            aria-current={active === "about" ? "page" : undefined}
          >
            关于
          </Link>
        </nav>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <p>ShyRobin · 写下问题，也写下思考。</p>
        <div>
          <a href="/feed.xml">RSS 订阅</a>
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
    </div>
  );
}
