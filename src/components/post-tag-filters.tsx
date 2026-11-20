"use client";

import { useState } from "react";
import Link from "next/link";
import { postsUrl } from "@/lib/post-search";

export function PostTagFilters({
  tags,
  total,
  query,
  tag,
}: {
  tags: { name: string; count: number }[];
  total: number;
  query: string;
  tag: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = tags.filter(
    (item, index) => expanded || index < 5 || item.name === tag,
  );
  const hiddenCount = tags.length - visible.length;

  return (
    <nav className="tag-filters" aria-label="按标签筛选文章">
      <Link href={postsUrl(query)} aria-current={!tag ? "page" : undefined}>
        全部 <span>{total}</span>
      </Link>
      {tags.map((item) => (
        <Link
          key={item.name}
          href={postsUrl(query, item.name)}
          hidden={!visible.includes(item)}
          prefetch={false}
          aria-current={tag === item.name ? "page" : undefined}
        >
          {item.name} <span>{item.count}</span>
        </Link>
      ))}
      {tags.length > 5 && (
        <button
          type="button"
          className="tag-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
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
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className="sr-only">
            {expanded ? "收起标签" : `展开全部标签，还有 ${hiddenCount} 个`}
          </span>
        </button>
      )}
    </nav>
  );
}
