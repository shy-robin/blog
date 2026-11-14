import "server-only";
import { cache } from "react";
import { createClient } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";

export type PostImage = {
  _type: "image";
  _key?: string;
  alt?: string;
  asset?: { _ref?: string };
};
export type CodeBlock = {
  _type: "codeBlock";
  _key: string;
  language?: string;
  code?: string;
};
export type PostBody = PortableTextBlock | PostImage | CodeBlock;
export type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
  coverImage?: PostImage;
  body?: PostBody[];
};
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "e4fd09lc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-02-19",
  perspective: "published",
  useCdn: false,
  timeout: 15000,
});
const options = { next: { revalidate: 60, tags: ["posts"] } };
const fields = `_id,title,"slug":slug.current,excerpt,publishedAt,"updatedAt":_updatedAt,tags,coverImage`;
export const getPosts = cache(
  async (): Promise<Post[]> =>
    client.fetch(
      `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc, _createdAt desc){${fields}}`,
      {},
      options,
    ),
);
export const getPost = cache(
  async (slug: string): Promise<Post | null> =>
    client.fetch(
      `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]{${fields},body}`,
      { slug },
      options,
    ),
);
export function formatDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}
export function getHeadings(body: PostBody[] = []) {
  return body.flatMap((block) => {
    if (
      block._type !== "block" ||
      !("style" in block) ||
      !["h2", "h3"].includes(block.style || "")
    )
      return [];
    const text = block.children
      .map((child) => ("text" in child ? child.text : ""))
      .join("");
    return text
      ? [{ id: `heading-${block._key}`, text, level: block.style }]
      : [];
  });
}
