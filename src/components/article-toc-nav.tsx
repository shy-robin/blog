"use client";

import { useEffect, useRef } from "react";
import { useActiveHeadingId } from "./article-reading";

export function ArticleTocNav({
  headings,
}: {
  headings: { id: string; text: string; level?: string }[];
}) {
  const listRef = useRef<HTMLElement>(null);
  const activeId = useActiveHeadingId(headings);

  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLAnchorElement>(
      'a[aria-current="location"]',
    );
    if (!list || !item) return;
    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight)
      list.scrollTop = bottom - list.clientHeight;
  }, [activeId]);

  return (
    <nav ref={listRef} aria-label="文章目录">
      <p className="article-rail-label">本文目录</p>
      <ol>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === "h3" ? "toc-nested" : ""}
          >
            <a
              href={`#${heading.id}`}
              aria-current={activeId === heading.id ? "location" : undefined}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
