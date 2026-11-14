import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveSiteUrl, site } from "../src/lib/site";
import { buildSitemap, buildRss, getPostMetadata } from "../src/lib/seo";
import type { Post } from "../src/sanity/posts";

const posts: Post[] = [
  {
    _id: "published",
    slug: "前端 & RSS",
    title: 'React <script> & "Vue"',
    excerpt: "A&B\u0000 <说明>",
    publishedAt: "2026-11-01T12:00:00Z",
    updatedAt: "2026-11-14T12:00:00Z",
  },
  { _id: "drafts.hidden", slug: "draft", title: "不应公开" },
  { _id: "empty", slug: "", title: "没有链接" },
];

test("site URLs use a stable origin and reject credentials and non-web schemes", () => {
  assert.equal(resolveSiteUrl("https://example.com/"), "https://example.com");
  assert.throws(() => resolveSiteUrl("javascript:alert(1)"));
  assert.throws(() => resolveSiteUrl("https://user:password@example.com"));
});
test("sitemap includes public pages and published article URLs with real modified dates", () => {
  const entries = buildSitemap(posts);
  assert.equal(entries.length, 3);
  assert.equal(
    entries[2].url,
    `${site.url}/posts/${encodeURIComponent(posts[0].slug)}`,
  );
  assert.equal(entries[2].lastModified, "2026-11-14T12:00:00.000Z");
  assert.ok(
    entries.every(
      (entry) => !entry.url.includes("studio") && !entry.url.includes("draft"),
    ),
  );
});
test("RSS escapes XML, strips invalid control characters and omits drafts", () => {
  const xml = buildRss(posts);
  assert.match(xml, /<rss version="2.0"/);
  assert.match(xml, /React &lt;script&gt; &amp; &quot;Vue&quot;/);
  assert.match(xml, /A&amp;B &lt;说明&gt;/);
  assert.doesNotMatch(xml, /\u0000|不应公开|没有链接|<script>/);
  assert.equal((xml.match(/<item>/g) || []).length, 1);
  assert.match(xml, /Sat, 14 Nov 2026 12:00:00 GMT/);
  assert.match(xml, /isPermaLink="false">post:published/);
});
test("metadata has canonical URLs and a fallback share card when no cover exists", () => {
  const meta = getPostMetadata(posts[0]);
  assert.equal(
    meta.alternates?.canonical,
    `${site.url}/posts/${encodeURIComponent(posts[0].slug)}`,
  );
  assert.ok(
    meta.twitter &&
      "card" in meta.twitter &&
      meta.twitter.card === "summary_large_image",
  );
  assert.ok(JSON.stringify(meta.openGraph).includes("/og"));
  const cover = getPostMetadata({
    ...posts[0],
    coverImage: {
      _type: "image",
      asset: { _ref: "image-abc123-1200x630-png" },
    },
  });
  assert.ok(JSON.stringify(cover.openGraph).includes("cdn.sanity.io"));
});
