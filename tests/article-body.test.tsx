import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ArticleBody } from "../src/components/article-body";
import { imageUrl, imageDimensions } from "../src/sanity/images";
import type { PostBody } from "../src/sanity/posts";

test("renders headings, consecutive list items, safe links and escaped code", async () => {
  const text = (key: string, content: string) => ({
    _key: key,
    _type: "span" as const,
    text: content,
    marks: [],
  });
  const body: PostBody[] = [
    {
      _type: "block",
      _key: "heading",
      style: "h2",
      markDefs: [],
      children: [text("h", "工程实践")],
    },
    ...["one", "two"].map((key) => ({
      _type: "block" as const,
      _key: key,
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [text(key, key)],
    })),
    {
      _type: "block",
      _key: "unsafe",
      style: "normal",
      markDefs: [{ _type: "link", _key: "bad", href: "javascript:alert(1)" }],
      children: [{ ...text("bad", "不安全链接"), marks: ["bad"] }],
    },
    {
      _type: "codeBlock",
      _key: "code",
      language: "typescript",
      code: 'const x = "<script>alert(1)</script>";',
    },
    {
      _type: "codeBlock",
      _key: "unknown",
      language: "constructor",
      code: "<script>unknown()</script>",
    },
  ];
  const html = renderToStaticMarkup(await ArticleBody({ body }));
  assert.match(html, /id="heading-heading"/);
  assert.equal((html.match(/<ul>/g) || []).length, 1);
  assert.equal((html.match(/<li>/g) || []).length, 2);
  assert.doesNotMatch(html, /href="javascript:/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /class="shiki/);
  assert.match(html, /--shiki-dark/);
  assert.match(html, /--shiki-light/);
  assert.match(html, /(?:&lt;|&#x3C;)script/);
});

test("validates asset references and preserves real image dimensions", () => {
  const image = { asset: { _ref: "image-abc123-1898x1128-png" } };
  assert.match(imageUrl(image) || "", /abc123-1898x1128\.png\?w=1400/);
  assert.deepEqual(imageDimensions(image), { width: 1898, height: 1128 });
  assert.equal(imageUrl({ asset: { _ref: "../../bad" } }), null);
});
