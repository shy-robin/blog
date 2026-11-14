import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GiscusComments } from "../src/components/giscus-comments";
import { getGiscusConfig, giscusAttributes } from "../src/lib/giscus";

const values = {
  repo: "shy-robin/blog",
  repoId: "R_example",
  category: "Announcements",
  categoryId: "DIC_example",
};
test("comments require complete configuration and trim pasted values", () => {
  assert.equal(getGiscusConfig({}), null);
  assert.equal(getGiscusConfig({ ...values, categoryId: "" }), null);
  assert.equal(getGiscusConfig({ ...values, repo: "not-a-repository" }), null);
  assert.deepEqual(
    getGiscusConfig({ ...values, repo: " shy-robin/blog " }),
    values,
  );
});
test("comments use stable article IDs and strict matching independent of URL and title", () => {
  const config = getGiscusConfig(values)!;
  const first = giscusAttributes(config, "article-1");
  const second = giscusAttributes(config, "article-2");
  assert.equal(first["data-term"], "post:article-1");
  assert.notEqual(first["data-term"], second["data-term"]);
  assert.equal(first["data-mapping"], "specific");
  assert.equal(first["data-strict"], "1");
  assert.equal(first["data-lang"], "zh-CN");
  assert.equal(first["data-theme"], "light");
});

test("initial rendering leaves external comments unloaded and offers a GitHub fallback", () => {
  const html = renderToStaticMarkup(
    createElement(GiscusComments, { config: values, postId: "article-1" }),
  );
  assert.match(html, /评论与讨论/);
  assert.match(html, /加载评论/);
  assert.match(html, /https:\/\/github.com\/shy-robin\/blog\/discussions/);
  assert.doesNotMatch(html, /<script|<iframe/);
});
