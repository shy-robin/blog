"use client";

import { useEffect, useRef, useState } from "react";

export function ArticleTocNav({
  headings,
}: {
  headings: { id: string; text: string; level?: string }[];
}) {
  const [activeId, setActiveId] = useState(headings[0]?.id);
  const listRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = window.innerHeight * 0.35;
      let current = headings[0]?.id;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top > marker) break;
        current = heading.id;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

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
