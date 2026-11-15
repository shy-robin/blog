import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { SanityImage } from "../src/components/sanity-image";
import { ImageConfigContext } from "next/dist/shared/lib/image-config-context.shared-runtime";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import nextConfig from "../next.config";

test("article images and responsive candidates load through the blog origin", () => {
  const src =
    "https://cdn.sanity.io/images/e4fd09lc/production/abc123-1200x800.png?w=1400&fit=max&auto=format";
  const html = renderToStaticMarkup(
    <ImageConfigContext.Provider
      value={{ ...imageConfigDefault, ...nextConfig.images }}
    >
      <SanityImage
        src={src}
        alt="示例文章图片"
        width={1200}
        height={800}
        sizes="(max-width: 760px) 100vw, 740px"
      />
    </ImageConfigContext.Provider>,
  );
  const imageSrc = html.match(/<img\b[^>]*\bsrc="([^"]+)"/)?.[1];
  assert.ok(imageSrc);
  assert.ok(imageSrc.startsWith("/_next/image?"));
  const optimized = new URL(
    imageSrc.replace(/&amp;/g, "&"),
    "https://www.shyrobin.top",
  );
  assert.equal(optimized.searchParams.get("url"), src);
  const candidates = html.match(/srcSet="([^"]+)"/)?.[1];
  assert.ok(candidates);
  for (const candidate of candidates.split(", "))
    assert.ok(candidate.startsWith("/_next/image?"));
  assert.match(html, /width="1200"/);
  assert.match(html, /height="800"/);
  assert.match(html, /alt="示例文章图片"/);
});
