import Link from "next/link";
export default function NotFound() {
  return (
    <main className="status-page">
      <h1>没有找到这篇内容</h1>
      <p>链接可能已变更，或文章尚未发布。</p>
      <Link href="/posts">浏览所有文章 →</Link>
    </main>
  );
}
