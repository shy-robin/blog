"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="status-page">
      <p className="eyebrow">SHYROBIN</p>
      <h1>文章暂时无法加载</h1>
      <p>请检查网络连接，稍后重试。</p>
      <button onClick={reset}>重新加载</button>
    </main>
  );
}
