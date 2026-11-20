export default function PostsLoading() {
  return (
    <section className="posts-loading" aria-busy="true">
      <p role="status">正在加载文章…</p>
      <div className="posts-loading-list" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => (
          <div className="loading-post" key={item}>
            <div className="loading-body">
              <span className="loading-line loading-title" />
              <span className="loading-line loading-excerpt" />
              <div className="loading-meta">
                <span className="loading-line loading-date" />
                <span className="loading-line loading-tag" />
              </div>
            </div>
            <span className="loading-line loading-thumb" />
          </div>
        ))}
      </div>
    </section>
  );
}
