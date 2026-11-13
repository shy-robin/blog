import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { SanityImage } from "./sanity-image";
import { codeToHtml, bundledLanguages } from "shiki";
import type { PostBody, PostImage, CodeBlock } from "@/sanity/posts";
import { imageUrl, imageDimensions } from "@/sanity/images";
function safeHref(href: unknown): string | undefined {
  return typeof href === "string" &&
    /^(https?:\/\/|mailto:|\/[^/]|#)/i.test(href)
    ? href
    : undefined;
}
const components: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2 id={`heading-${value._key}`}>{children}</h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={`heading-${value._key}`}>{children}</h3>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = safeHref(value?.href);
      return href ? (
        <a href={href} rel={href.startsWith("http") ? "noreferrer" : undefined}>
          {children}
        </a>
      ) : (
        <>{children}</>
      );
    },
  },
};
async function HighlightedCode({ block }: { block: CodeBlock }) {
  const lang =
    block.language && Object.hasOwn(bundledLanguages, block.language)
      ? (block.language as keyof typeof bundledLanguages)
      : "text";
  const html = await codeToHtml(block.code || "", {
    lang,
    theme: "github-light",
  });
  return (
    <figure className="code-block">
      <figcaption>{block.language || "text"}</figcaption>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
function BodyImage({ block }: { block: PostImage }) {
  const url = imageUrl(block);
  if (!url) return null;
  return (
    <figure className="body-image">
      <SanityImage
        key={url}
        src={url}
        {...imageDimensions(block)}
        alt={block.alt || ""}
        sizes="(max-width: 760px) 100vw, 740px"
      />
      {block.alt && <figcaption>{block.alt}</figcaption>}
    </figure>
  );
}
export async function ArticleBody({ body }: { body: PostBody[] }) {
  // Preserve consecutive text blocks so lists retain their structure.
  const groups: Array<PortableTextBlock[] | PostImage | CodeBlock> = [];
  for (const block of body) {
    if (block._type === "block") {
      const last = groups[groups.length - 1];
      if (Array.isArray(last)) last.push(block as PortableTextBlock);
      else groups.push([block as PortableTextBlock]);
    } else if (block._type === "image" || block._type === "codeBlock")
      groups.push(block as PostImage | CodeBlock);
  }
  return (
    <div className="article-body">
      {await Promise.all(
        groups.map(async (group, index) => {
          if (Array.isArray(group))
            return (
              <PortableText key={index} value={group} components={components} />
            );
          if (group._type === "image")
            return <BodyImage key={group._key || index} block={group} />;
          return (
            <div key={group._key || index}>
              {await HighlightedCode({ block: group })}
            </div>
          );
        }),
      )}
    </div>
  );
}
