import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { convertPost, articleIndex } from "../scripts/migration/gainmore.mjs";

const post = {
  title: "旧文章",
  slug: "old-post",
  date: "2021-02-18T07:43:11.123Z",
  updated: "2021-03-06T09:26:20.637Z",
  path: "2021/02/18/old-post/",
  permalink: "https://gainmore.gitee.io/2021/02/18/old-post/",
  tags: [{ name: "JS" }],
  categories: [{ name: "随笔" }],
};
const { getAssetRefs } = createRequire(import.meta.url)(
  "@sanity/import/src/assetRefs.js",
);
const wrap = (body) =>
  `<article id="post"><div class="article-meta">主题标题</div>${body}<div class="footer">主题页脚</div><div class="article-meta">更新时间</div></article>`;

test("migration preserves exact original timestamps, stable IDs and metadata", () => {
  const { document } = convertPost(post, wrap("<p>正文</p>"));
  assert.equal(document.publishedAt, post.date);
  assert.equal(document._createdAt, post.date);
  assert.equal(document._updatedAt, post.updated);
  assert.equal(document.legacySource.updatedAt, post.updated);
  assert.deepEqual(document.tags, ["JS", "随笔"]);
  assert.match(document._id, /^drafts\.gainmore-/);
  assert.equal(
    document._id,
    convertPost(post, wrap("<p>改动</p>")).document._id,
  );
  assert.equal(document.body[0].children[0].text, "正文");
  assert.throws(() => convertPost({ ...post, date: "bad-date" }, wrap("正文")));
});

test("migration extracts highlighted code without gutter numbers and preserves line breaks", () => {
  const { document } = convertPost(
    post,
    wrap(
      '<figure class="highlight js"><table><tr><td class="gutter"><pre>1<br>2<br>3</pre></td><td class="code"><pre><span>const x = &lt;tag&gt;;</span><br><br>  next();<br></pre></td></tr></table></figure>',
    ),
  );
  assert.equal(document.body.length, 1);
  assert.equal(document.body[0].language, "javascript");
  assert.equal(document.body[0].code, "const x = <tag>;\n\n  next();\n");
});

test("migration retains nested lists, marks, tables, lazy images and rewrites article links", () => {
  const other = { ...post, slug: "other", path: "2021/03/01/other/" };
  const { document, assets, warnings } = convertPost(
    post,
    wrap(
      '<h2 id="标题">标题</h2><p><strong>粗体</strong><code>x</code><a href="#标题">锚点</a><a href="/2021/03/01/other/">其他</a><a href="javascript:alert(1)">拒绝</a></p><ul><li>父<ol><li>子</li></ol>尾</li></ul><p>前<img src="placeholder.gif" data-src="/images/a.png" alt="插图">后</p><table><tr><th>A</th><th>B</th></tr><tr><td>x|y</td><td>z</td></tr></table>',
    ),
    articleIndex([post, other]),
  );
  const text = document.body[1];
  assert.ok(text.children.some((x) => x.marks.includes("strong")));
  assert.ok(text.children.some((x) => x.marks.includes("code")));
  assert.ok(text.markDefs.some((x) => x.href === `/posts/other`));
  assert.ok(
    text.markDefs.some((x) => x.href === `#heading-${document.body[0]._key}`),
  );
  assert.ok(!text.markDefs.some((x) => x.href.includes("javascript:")));
  const nested = document.body.find((x) => x.level === 2);
  assert.equal(nested.listItem, "number");
  const image = document.body.find((x) => x._type === "image");
  assert.equal(image.alt, "插图");
  assert.equal(
    getAssetRefs(document)[0].path,
    `body[${document.body.indexOf(image)}]`,
  );
  assert.equal(assets[0].url, "https://gainmore.gitee.io/images/a.png");
  assert.ok(document.body.some((x) => x.code?.includes("x\\|y")));
  assert.ok(warnings.some((x) => x.type === "table-as-markdown"));
});

test("missing article body fails instead of importing navigation and scripts never execute", () => {
  assert.throws(() => convertPost(post, "<main>导航</main>"));
  const { document, warnings } = convertPost(
    post,
    wrap(
      '<script>throw new Error("never run")</script><iframe src="https://example.com/demo"></iframe><p>正文</p>',
    ),
  );
  assert.ok(warnings.some((x) => x.type === "interactive-content"));
  assert.equal(document.body.at(-1).children[0].text, "正文");
});

test("continued list numbering, blockquotes and unavailable local images remain visible", () => {
  const { document, warnings } = convertPost(
    post,
    wrap(
      '<blockquote><p>引用</p></blockquote><ol start="4"><li>第四</li><li>第五</li></ol><img src="file:///C:/Typora/image.png" alt="旧截图">',
    ),
  );
  assert.equal(document.body[0].style, "blockquote");
  assert.equal(document.body[1].children[0].text, "4. ");
  assert.equal(document.body[2].children[0].text, "5. ");
  assert.equal(document.body[1].listItem, undefined);
  assert.ok(document.body.at(-1).children[0].text.includes("旧截图"));
  assert.ok(warnings.some((x) => x.type === "unsupported-image"));
});

test("malformed legacy pre containing a nested highlight keeps both code fragments", () => {
  const { document } = convertPost(
    post,
    wrap(
      '<pre><code class="javascript">first();\n<figure class="highlight plain"><table><tr><td class="gutter"><pre>1<br>2</pre></td><td class="code"><pre>second();<br>third();</pre></td></tr></table></figure>\nlast();</code></pre>',
    ),
  );
  assert.equal(document.body[0].language, "javascript");
  assert.equal(document.body[0].code, "first();\nsecond();\nthird();\nlast();");
});
