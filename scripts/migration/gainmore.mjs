import { JSDOM } from "jsdom";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const origin = "https://gainmore.gitee.io";
const hash = (value) =>
  createHash("sha256").update(value).digest("hex").slice(0, 24);
const headingKey = (id) => `h${hash(id)}`;
const plain = (node) => {
  if (node.nodeType === 3) return node.textContent;
  if (node.nodeName === "BR") return "\n";
  return Array.from(node.childNodes, plain).join("");
};
const normalizedPath = (value) =>
  decodeURI(value)
    .replace(/index\.html$/, "")
    .replace(/\/?$/, "/");
export function articleIndex(posts) {
  return new Map(
    posts
      .filter((x) => x.title?.trim())
      .map((x) => [normalizedPath(`/${x.path}`), x.slug]),
  );
}

export function convertPost(post, html, index = articleIndex([post])) {
  for (const field of ["date", "updated"]) {
    if (
      typeof post[field] !== "string" ||
      !Number.isFinite(Date.parse(post[field]))
    )
      throw new Error(`Invalid ${field}: ${post.path}`);
  }
  const dom = new JSDOM(html);
  try {
    const article = dom.window.document.querySelector("article#post");
    if (!article) throw new Error(`Missing article#post: ${post.path}`);
    for (const node of Array.from(article.children)) {
      if (node.matches(".article-meta, .footer")) node.remove();
    }
    const body = [],
      assets = [],
      warnings = [];
    let counter = 0;
    const key = () => `b${counter++}`;
    const warn = (type, detail) =>
      warnings.push({ type, detail, article: post.path });
    function href(value) {
      if (!value || !/^(https?:|mailto:|\/|#|\.?\.?\/)/i.test(value))
        return undefined;
      if (value.startsWith("#"))
        return `#heading-${headingKey(decodeURIComponent(value.slice(1)))}`;
      const url = new URL(value, post.permalink || `${origin}/${post.path}`);
      if (url.username || url.password) return undefined;
      if (["gainmore.gitee.io", "gainmore.github.io"].includes(url.hostname)) {
        const slug = index.get(normalizedPath(url.pathname));
        if (slug)
          return `/posts/${encodeURIComponent(slug)}${url.hash ? `#heading-${headingKey(decodeURIComponent(url.hash.slice(1)))}` : ""}`;
      }
      return url.href;
    }
    function textBlock(nodes, style = "normal", list = {}) {
      const result = {
        _type: "block",
        _key: key(),
        style,
        children: [],
        markDefs: [],
        ...list,
      };
      function inline(node, marks = []) {
        if (node.nodeType === 3 || node.nodeName === "BR") {
          const text =
            node.nodeName === "BR"
              ? "\n"
              : node.textContent.replace(/\s+/g, " ");
          const last = result.children.at(-1);
          if (last && JSON.stringify(last.marks) === JSON.stringify(marks))
            last.text += text;
          else
            result.children.push({ _type: "span", _key: key(), text, marks });
          return;
        }
        if (
          node.nodeType !== 1 ||
          node.matches("script,style,iframe,img,ul,ol,.headerlink")
        )
          return;
        const decorator = {
          STRONG: "strong",
          B: "strong",
          EM: "em",
          I: "em",
          CODE: "code",
          S: "strike-through",
          DEL: "strike-through",
          U: "underline",
        }[node.nodeName];
        let next = decorator ? [...marks, decorator] : marks;
        if (node.nodeName === "A") {
          const value = href(node.getAttribute("href"));
          if (value) {
            const id = key();
            result.markDefs.push({ _type: "link", _key: id, href: value });
            next = [...next, id];
          }
        }
        for (const child of node.childNodes) inline(child, next);
      }
      for (const node of nodes) inline(node);
      if (result.children.some((x) => x.text.trim())) body.push(result);
      return result;
    }
    function image(node) {
      const src =
        node.getAttribute("data-src") ||
        node.getAttribute("data-original") ||
        node.getAttribute("src");
      if (!src) return;
      const url = new URL(src, post.permalink || `${origin}/${post.path}`);
      if (!["https:", "http:"].includes(url.protocol)) {
        warn("unsupported-image", src);
        textBlock([
          dom.window.document.createTextNode(
            `原文图片（旧电脑本地文件，暂未恢复）：${node.getAttribute("alt") || src}`,
          ),
        ]);
        return;
      }
      const image = {
        _type: "image",
        _key: key(),
        alt: node.getAttribute("alt") || "",
        _sanityAsset: `image@${url.href}`,
      };
      body.push(image);
      assets.push({ url: url.href, article: post.path, key: image._key });
    }
    function flow(nodes, style = "normal", list = {}) {
      let run = [];
      const flush = () => {
        if (run.length) textBlock(run, style, list);
        run = [];
      };
      for (const node of nodes) {
        if (
          node.nodeType === 1 &&
          node.matches(
            "img,figure,pre,table,ul,ol,p,div,blockquote,h1,h2,h3,h4,h5,h6,iframe,script,audio,video",
          )
        ) {
          flush();
          walk(node, list, style);
        } else if (node.nodeType === 1 && node.querySelector("img")) {
          flush();
          flow(node.childNodes, style, list);
        } else run.push(node);
      }
      flush();
    }
    function walk(node, list = {}, inheritedStyle = "normal") {
      if (node.nodeType !== 1) {
        flow([node], "normal", list);
        return;
      }
      const tag = node.nodeName;
      if (node.matches(".headerlink,style,noscript")) return;
      if (node.matches("script,iframe,audio,video")) {
        warn("interactive-content", tag);
        const source =
          node.getAttribute("src") ||
          node.querySelector("source")?.getAttribute("src");
        if (source) {
          const a = dom.window.document.createElement("a");
          a.href = new URL(source, post.permalink).href;
          a.textContent = `原文媒体：${a.href}`;
          textBlock([a]);
        }
        return;
      }
      if (tag === "IMG") {
        image(node);
        return;
      }
      if (node.matches("figure.highlight,pre")) {
        const code = (
          tag === "PRE"
            ? node.querySelector(":scope > code") || node
            : node.querySelector("td.code pre") ||
              node.querySelector("pre") ||
              node
        ).cloneNode(true);
        for (const gutter of code.querySelectorAll(".gutter")) gutter.remove();
        let language =
          Array.from(node.classList).find((x) => x !== "highlight") ||
          Array.from(code.classList).find((x) => x !== "highlight") ||
          "text";
        if (language.startsWith("language-")) language = language.slice(9);
        language =
          { js: "javascript", py: "python", bash: "bash", plain: "text" }[
            language
          ] || language;
        body.push({
          _type: "codeBlock",
          _key: key(),
          language,
          code: plain(code),
        });
        return;
      }
      if (tag === "TABLE") {
        const rows = Array.from(node.querySelectorAll("tr"), (row) =>
          Array.from(row.children, (cell) =>
            plain(cell).trim().replace(/\|/g, "\\|").replace(/\n/g, "<br>"),
          ),
        );
        if (rows.length) {
          const width = Math.max(...rows.map((x) => x.length));
          const line = (row) =>
            `| ${Array.from({ length: width }, (_, i) => row[i] || "").join(" | ")} |`;
          body.push({
            _type: "codeBlock",
            _key: key(),
            language: "markdown",
            code: [
              line(rows[0]),
              line(Array(width).fill("---")),
              ...rows.slice(1).map(line),
            ].join("\n"),
          });
          warn("table-as-markdown", `${rows.length} rows`);
        }
        return;
      }
      if (tag === "UL" || tag === "OL") {
        const start = Number.parseInt(node.getAttribute("start") || "1", 10);
        let ordinal = Number.isFinite(start) ? start : 1;
        const literalNumbers = tag === "OL" && ordinal !== 1;
        for (const child of node.children) {
          if (child.nodeName === "LI") {
            const first = body.length;
            flow(child.childNodes, "normal", {
              listItem: tag === "OL" ? "number" : "bullet",
              level: (list.level || 0) + 1,
            });
            if (literalNumbers) {
              const block = body[first];
              if (block?._type === "block") {
                delete block.listItem;
                delete block.level;
                block.children.unshift({
                  _type: "span",
                  _key: key(),
                  text: `${ordinal}. `,
                  marks: [],
                });
              }
              ordinal++;
            }
          }
        }
        if (literalNumbers)
          warn(
            "ordered-list-start",
            `${start} (preserved as explicit text numbering)`,
          );
        return;
      }
      if (/^H[1-6]$/.test(tag)) {
        const style = `h${Math.min(4, Math.max(2, Number(tag[1])))}`;
        const block = textBlock(node.childNodes, style);
        if (node.id) block._key = headingKey(node.id);
        return;
      }
      if (tag === "BLOCKQUOTE") {
        flow(node.childNodes, "blockquote", list);
        return;
      }
      flow(node.childNodes, inheritedStyle, list);
    }
    flow(article.childNodes);
    if (!body.length) throw new Error(`Empty article: ${post.path}`);
    const original = article.cloneNode(true);
    for (const extra of original.querySelectorAll(
      ".gutter,.headerlink,script,style,noscript",
    ))
      extra.remove();
    const expectedText = original.textContent.replace(/\s/g, "");
    const actualText = body
      .map(
        (block) =>
          block.code ||
          block.children?.map((span) => span.text || "").join("") ||
          "",
      )
      .join("")
      .replace(/\s/g, "");
    let matched = 0;
    for (const character of actualText)
      if (character === expectedText[matched]) matched++;
    if (matched !== expectedText.length)
      throw new Error(
        `Body text lost or reordered: ${post.path} near ${expectedText.slice(matched, matched + 40)}`,
      );
    const document = {
      _id: `drafts.gainmore-${hash(post.path)}`,
      _type: "post",
      _createdAt: post.date,
      _updatedAt: post.updated,
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.excerpt || "",
      publishedAt: post.date,
      tags: [
        ...new Set(
          [...(post.tags || []), ...(post.categories || [])].map((x) => x.name),
        ),
      ],
      body,
      legacySource: {
        _type: "object",
        url: post.permalink || `${origin}/${post.path}`,
        path: post.path,
        publishedAt: post.date,
        updatedAt: post.updated,
      },
    };
    return { document, assets, warnings };
  } finally {
    dom.window.close();
  }
}

export async function buildExport(sourceDir, outputDir) {
  const source = path.resolve(sourceDir),
    output = path.resolve(outputDir);
  const data = JSON.parse(
    await readFile(path.join(source, "content.json"), "utf8"),
  );
  const posts = data.posts.filter((x) => x.title?.trim());
  if (posts.length !== 84)
    throw new Error(
      `Expected 84 articles, found ${posts.length}; review source inventory first`,
    );
  const documents = [],
    assets = [],
    warnings = [];
  await mkdir(path.join(output, "source-html"), { recursive: true });
  for (const post of posts) {
    const file = path.resolve(source, post.path, "index.html");
    if (!file.startsWith(`${source}${path.sep}`))
      throw new Error("Source path escapes repository");
    const converted = convertPost(
      post,
      await readFile(file, "utf8"),
      articleIndex(posts),
    );
    documents.push(converted.document);
    assets.push(...converted.assets);
    warnings.push(...converted.warnings);
    await copyFile(
      file,
      path.join(output, "source-html", `${converted.document._id}.html`),
    );
  }
  if (
    new Set(documents.map((x) => x._id)).size !== posts.length ||
    new Set(documents.map((x) => x.slug.current)).size !== posts.length
  )
    throw new Error("Duplicate document IDs or slugs");
  for (let i = 0; i < posts.length; i++)
    if (
      documents[i].publishedAt !== posts[i].date ||
      documents[i].legacySource.updatedAt !== posts[i].updated
    )
      throw new Error("Timestamp mismatch");
  const report = {
    count: documents.length,
    skipped: data.posts.filter((x) => !x.title?.trim()).map((x) => x.path),
    imageOccurrences: assets.length,
    textIntegrityChecked: documents.length,
    uniqueImages: new Set(assets.map((x) => x.url)).size,
    warnings,
    articles: documents.map((x) => ({
      id: x._id,
      title: x.title,
      publishedAt: x.publishedAt,
      updatedAt: x.legacySource.updatedAt,
      blocks: x.body.length,
    })),
  };
  await writeFile(
    path.join(output, "posts-source.ndjson"),
    documents.map((x) => JSON.stringify(x)).join("\n") + "\n",
  );
  await writeFile(
    path.join(output, "assets.json"),
    JSON.stringify(assets, null, 2),
  );
  await writeFile(
    path.join(output, "report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify({
      count: report.count,
      uniqueImages: report.uniqueImages,
      warnings: warnings.length,
      output,
    }),
  );
  return report;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (!process.argv[2])
    throw new Error(
      "Usage: node scripts/migration/gainmore.mjs /path/to/gainmore [output-dir]",
    );
  await buildExport(
    process.argv[2],
    process.argv[3] || "migration-output/gainmore",
  );
}
