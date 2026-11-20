import Link from "next/link";
import { formatDate, type Post } from "@/sanity/posts";
import { postsUrl } from "@/lib/post-search";
import { PostThumb } from "./post-thumb";
export function PostList({
  posts,
  headingLevel: Heading = "h2",
}: {
  posts: Post[];
  headingLevel?: "h2" | "h3";
}) {
  if (!posts.length)
    return (
      <div className="empty-state">
        <Heading>文章正在准备中</Heading>
        <p>这里将记录前端开发中的实践与思考，欢迎下次再来。</p>
      </div>
    );
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li className="post-row" key={post._id}>
          <div className="post-body">
            <Heading className="post-title">
              <Link href={`/posts/${encodeURIComponent(post.slug)}`}>
                {post.title}
              </Link>
            </Heading>
            {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
            <div className="post-meta">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
              )}
              {!!post.tags?.length && (
                <ul className="post-tags" aria-label="文章标签">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <Link href={postsUrl("", tag)}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <PostThumb seed={post.slug} />
        </li>
      ))}
    </ul>
  );
}
