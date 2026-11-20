"use client";

import { useEffect, useRef, useState } from "react";

export function ArticleRailTools() {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const body = root.current
      ?.closest("article")
      ?.querySelector(".article-layout");
    if (!body) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = body.getBoundingClientRect().top + window.scrollY;
      const reading = window.scrollY + window.innerHeight * 0.5 - top;
      const value = (reading / body.clientHeight) * 100;
      setProgress(Math.round(Math.min(100, Math.max(0, value))));
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
  }, []);

  function toTop() {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <div className="article-rail-tools" ref={root}>
      <p className="article-rail-progress">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2.2"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="9" className="progress-track" />
          <circle
            cx="12"
            cy="12"
            r="9"
            className="progress-fill"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100 - progress}
            transform="rotate(-90 12 12)"
          />
        </svg>
        <span>阅读进度 {progress}%</span>
      </p>
      <button type="button" onClick={toTop}>
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
