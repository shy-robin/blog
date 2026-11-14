"use client";

import { useEffect, useRef, useState } from "react";
import { giscusAttributes, type GiscusConfig } from "@/lib/giscus";

export function GiscusComments({
  config,
  postId,
}: {
  config: GiscusConfig;
  postId: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!visible || !container) return;
    let active = true;
    let frame: HTMLIFrameElement | null = null;
    setStatus("loading");
    const timer = window.setTimeout(() => {
      if (active) setStatus("error");
    }, 25000);
    const observer = new MutationObserver(() => {
      const nextFrame = container.querySelector("iframe");
      if (!nextFrame || nextFrame === frame) return;
      frame = nextFrame;
      frame.title = "文章评论（Giscus）";
      frame.onload = () => {
        if (!active) return;
        window.clearTimeout(timer);
        setStatus("ready");
      };
    });
    observer.observe(container, { childList: true, subtree: true });
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    for (const [name, value] of Object.entries(
      giscusAttributes(config, postId),
    ))
      script.setAttribute(name, value);
    script.onerror = () => {
      if (active) {
        window.clearTimeout(timer);
        setStatus("error");
      }
    };
    container.appendChild(script);
    return () => {
      active = false;
      window.clearTimeout(timer);
      observer.disconnect();
      if (frame) frame.onload = null;
      script.onerror = null;
      container.replaceChildren();
    };
  }, [config, postId, visible, attempt]);

  return (
    <section
      ref={sectionRef}
      className="comments-section"
      aria-labelledby="comments-heading"
    >
      <div className="comments-heading">
        <h2 id="comments-heading">评论与讨论</h2>
        <p>欢迎交流。发表评论需要登录 GitHub。</p>
      </div>
      <div aria-live="polite">
        {!visible ? (
          <button className="comments-action" onClick={() => setVisible(true)}>
            加载评论
          </button>
        ) : status === "loading" ? (
          <p className="comments-status">正在加载评论…</p>
        ) : null}
        {visible && status === "error" && (
          <div className="comments-error">
            <p>评论暂时无法加载，请稍后重试。</p>
            <button
              className="comments-action"
              onClick={() => setAttempt((value) => value + 1)}
            >
              重新加载
            </button>
          </div>
        )}
      </div>
      <div ref={containerRef} className="giscus" hidden={status === "error"} />
      <a
        className="comments-fallback"
        href={`https://github.com/${config.repo}/discussions`}
        target="_blank"
        rel="noreferrer"
      >
        在 GitHub 查看讨论 ↗
      </a>
    </section>
  );
}
