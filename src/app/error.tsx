"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="status-page">
      <h1>文章暂时无法加载</h1>
      <p>这次没能载入文章。你可以重新加载，或稍后再来阅读。</p>
      <button onClick={reset}>重新加载</button>
      <p>
        <Link className="text-link" href="/about">
          先了解作者
        </Link>
      </p>
    </main>
  );
}
