export default function PostLoading() {
  return (
    <article className="article article-loading" aria-busy="true">
      <p role="status">正在加载文章…</p>
      <header className="article-header" aria-hidden="true">
        <span className="loading-line loading-back" />
        <span className="loading-line loading-article-title" />
        <span className="loading-line loading-article-title loading-article-title-short" />
        <div className="loading-meta">
          <span className="loading-line loading-date" />
        </div>
        <span className="loading-line loading-article-summary" />
      </header>
      <div className="loading-article-body" aria-hidden="true">
        <span className="loading-line" />
        <span className="loading-line" />
        <span className="loading-line loading-article-short" />
        <span className="loading-line" />
        <span className="loading-line loading-article-short" />
      </div>
    </article>
  );
}
