import assert from "node:assert/strict";
import { test } from "node:test";
import { getTagCounts, postsUrl, searchValue } from "../src/lib/post-search";
import type { Post } from "../src/sanity/posts";

const posts: Post[] = [
  {
    _id: "1",
    slug: "react",
    title: "React 性能实践",
    excerpt: "减少重复渲染",
    tags: ["React", "性能", "React"],
  },
  {
    _id: "2",
    slug: "build",
    title: "构建优化",
    excerpt: "Webpack 缓存实践",
    tags: ["工程化", "性能"],
  },
  { _id: "3", slug: "notes", title: "开发随笔" },
];

test("tag counts count articles rather than repeated tags", () => {
  assert.equal(
    getTagCounts(posts).find((tag) => tag.name === "React")?.count,
    1,
  );
  assert.equal(
    getTagCounts(posts).find((tag) => tag.name === "性能")?.count,
    2,
  );
});

test("query values and links support Chinese and reserved URL characters", () => {
  assert.equal(searchValue([" React ", "ignored"]), "React");
  assert.equal(searchValue(undefined), "");
  assert.equal(searchValue("x".repeat(200)).length, 120);
  assert.equal(postsUrl(), "/posts");
  const url = new URL(
    postsUrl("React & Vue", "前端/C++"),
    "https://example.com",
  );
  assert.equal(url.searchParams.get("q"), "React & Vue");
  assert.equal(url.searchParams.get("tag"), "前端/C++");
});
