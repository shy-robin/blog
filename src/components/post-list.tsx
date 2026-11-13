import Link from "next/link";
import { formatDate, type Post } from "@/sanity/posts";
export function PostList({ posts }: { posts: Post[] }) {
  if (!posts.length)
    return (
      <div className="empty-state">
        <h2>文章正在准备中</h2>
        <p>这里将记录前端开发中的实践与思考，欢迎下次再来。</p>
      </div>
    );
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-row" key={post._id}>
          <div className="post-date">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}
          </div>
          <div>
            <h2>
              <Link href={`/posts/${encodeURIComponent(post.slug)}`}>
                {post.title}
              </Link>
            </h2>
            {post.excerpt && <p>{post.excerpt}</p>}
            {!!post.tags?.length && (
              <ul className="tags" aria-label="文章标签">
                {post.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}
          </div>
          <Link
            className="read-link"
            href={`/posts/${encodeURIComponent(post.slug)}`}
            aria-label={`阅读：${post.title}`}
          >
            ↗
          </Link>
        </article>
      ))}
    </div>
  );
}
