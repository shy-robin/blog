import { getPosts } from "@/sanity/posts";
import { buildRss } from "@/lib/seo";

export const revalidate = 60;
export async function GET() {
  return new Response(buildRss(await getPosts()), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
