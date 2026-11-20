"use client";

import { useEffect, useState, type RefObject } from "react";

export function useActiveHeadingId(headings: { id: string }[]) {
  const [activeId, setActiveId] = useState(headings[0]?.id);

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

  return activeId;
}

export function useReadingProgress(root: RefObject<HTMLElement | null>) {
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
  }, [root]);

  return progress;
}

export function scrollToTop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

export function ReadingRing({ progress }: { progress: number }) {
  return (
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
  );
}
