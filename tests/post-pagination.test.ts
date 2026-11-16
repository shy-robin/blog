import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluate, parse } from "groq-js";
import {
  pageValue,
  pageNumbers,
  postPageQueries,
} from "../src/lib/post-pagination";
import { postsUrl } from "../src/lib/post-search";

const dataset = Array.from({ length: 25 }, (_, i) => ({
  _id: `post-${String(i).padStart(2, "0")}`,
  _type: "post",
  title: `React 性能 ${i}`,
  excerpt: "缓存 C++ 实践",
  tags: ["性能", "React"],
  slug: { current: `post-${i}` },
  publishedAt: "2021-01-01T00:00:00Z",
  ...(i === 0
    ? {
        body: [
          {
            _type: "block",
            _key: "b1",
            style: "normal",
            children: [{ _type: "span", _key: "s1", text: "正文独有词" }],
          },
          {
            _type: "codeBlock",
            _key: "c1",
            language: "typescript",
            code: "const NEEDLE_CODE = 42",
          },
          { _type: "codeBlock", _key: "c2", language: "typescript" },
          { _type: "image", _key: "i1", alt: "图片描述独有词" },
        ],
      }
    : {}),
  ...(i === 1
    ? { body: [{ _type: "image", _key: "i2", alt: "另一张图片" }] }
    : {}),
}));

async function run(query: string, params: Record<string, string | number>) {
  return (
    await evaluate(parse(query, { params }), {
      dataset: [...dataset, { ...dataset[0], _id: "drafts.hidden" }],
      params,
    })
  ).get();
}

test("Sanity queries return bounded, stable pages and independent total counts", async () => {
  const pages = [];
  for (const page of [1, 2, 3]) {
    const queries = postPageQueries("", "", page);
    const items = await run(queries.items, queries.params);
    pages.push(items);
  }
  assert.deepEqual(
    pages.map((items) => items.length),
    [12, 12, 1],
  );
  assert.equal(new Set(pages.flat().map((item) => item._id)).size, 25);
  const queries = postPageQueries("", "", 2);
  const stats = await run(queries.stats, queries.params);
  assert.equal(stats.total, 25);
  assert.equal(stats.matched, 25);
});

test("server filtering preserves literal punctuation, case, width and AND search", async () => {
  for (const [query, tag, expected] of [
    ["ｒｅａｃｔ C++", "性能", 12],
    ["缓存 实践", "React", 12],
    ["React", "未知", 0],
    ['\" || true', "", 0],
    ["不存在", "", 0],
  ] as const) {
    const queries = postPageQueries(query, tag, 1);
    assert.equal((await run(queries.items, queries.params)).length, expected);
  }
});

test("full-text search covers body prose and code blocks but not image alt", async () => {
  for (const [query, expected] of [
    ["正文独有词", 1],
    ["needle_code", 1],
    ["正文独有词 needle_code", 1],
    ["图片描述独有词", 0],
    ["另一张图片", 0],
  ] as const) {
    const queries = postPageQueries(query, "", 1);
    const items = await run(queries.items, queries.params);
    assert.equal(items.length, expected);
    const stats = await run(queries.stats, queries.params);
    assert.equal(stats.matched, expected);
  }
  const queries = postPageQueries("正文独有词", "", 1);
  const items = await run(queries.items, queries.params);
  assert.equal(items[0]._id, "post-00");
});

test("page URLs preserve filters; invalid pages are safe and page numbers stay compact", () => {
  for (const value of [
    undefined,
    "0",
    "-1",
    "1.5",
    "NaN",
    "9999999999999999999",
  ])
    assert.equal(pageValue(value), 1);
  assert.equal(pageValue(["3", "4"]), 3);
  assert.equal(postsUrl("", "", 1), "/posts");
  const url = new URL(
    postsUrl("React & Vue", "前端/C++", 3),
    "https://example.com",
  );
  assert.equal(url.searchParams.get("page"), "3");
  assert.equal(url.searchParams.get("q"), "React & Vue");
  assert.equal(url.searchParams.get("tag"), "前端/C++");
  assert.deepEqual(pageNumbers(5, 20), [1, 4, 5, 6, 20]);
});
