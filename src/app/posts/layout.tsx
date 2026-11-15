import { BlogShell } from "@/components/blog-shell";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BlogShell active="posts">{children}</BlogShell>;
}
