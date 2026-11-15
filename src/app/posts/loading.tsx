export default function PostsLoading() {
  return (
    <section className="posts-loading" aria-busy="true">
      <p role="status">正在加载文章…</p>
      <div aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <div className="loading-post" key={item}>
            <span className="loading-line loading-date" />
            <span className="loading-line loading-title" />
            <span className="loading-line" />
          </div>
        ))}
      </div>
    </section>
  );
}
