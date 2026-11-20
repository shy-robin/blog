"use client";

import { useRef } from "react";
import {
  ReadingRing,
  scrollToTop,
  useActiveHeadingId,
  useReadingProgress,
} from "./article-reading";

export function ArticleMobileToc({
  title,
  headings,
}: {
  title: string;
  headings: { id: string; text: string; level?: string }[];
}) {
  const root = useRef<HTMLDetailsElement>(null);
  const activeId = useActiveHeadingId(headings);
  const progress = useReadingProgress(root);

  function close() {
    if (root.current) root.current.open = false;
  }

  return (
    <details className="article-toc" ref={root}>
      <summary>
        <ReadingRing progress={progress} />
        <span className="article-toc-current">{title}</span>
        <svg
          className="article-toc-chevron"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <nav aria-label="文章目录">
        <ol>
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={heading.level === "h3" ? "toc-nested" : ""}
            >
              <a
                href={`#${heading.id}`}
                aria-current={activeId === heading.id ? "location" : undefined}
                onClick={close}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="article-toc-footer">
        <button type="button" onClick={scrollToTop}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
          顶部
        </button>
      </div>
    </details>
  );
}
