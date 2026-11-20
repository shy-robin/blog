"use client";

import { useRef } from "react";
import {
  ReadingRing,
  scrollToTop,
  useReadingProgress,
} from "./article-reading";

export function ArticleRailTools() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useReadingProgress(root);

  return (
    <div className="article-rail-tools" ref={root}>
      <p className="article-rail-progress">
        <ReadingRing progress={progress} />
        <span>阅读进度 {progress}%</span>
      </p>
      <button type="button" onClick={scrollToTop}>
        <svg
          width="18"
          height="18"
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
  );
}
