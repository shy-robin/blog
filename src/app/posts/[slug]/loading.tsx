const paragraphs = [
  [100, 96, 58],
  [100, 100, 92, 40],
  [100, 94, 70],
  [100, 98, 100, 46],
  [100, 90],
];

export default function PostLoading() {
  return (
    <article className="article article-loading" aria-busy="true">
      <p role="status" className="sr-only">
        正在加载文章
      </p>
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
        {paragraphs.map((lines, index) => (
          <div className="loading-paragraph" key={index}>
            {lines.map((width, line) => (
              <span
                className="loading-line"
                key={line}
                style={{ width: `${width}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </article>
  );
}
