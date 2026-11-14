import { getPosts } from "@/sanity/posts";
import { buildSitemap } from "@/lib/seo";

export const revalidate = 60;
export default async function sitemap() {
  return buildSitemap(await getPosts());
}
