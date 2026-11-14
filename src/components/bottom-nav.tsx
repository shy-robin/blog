"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { DockIcon, type DockIconName } from "./dock-icon";
import { ThemeToggle } from "./theme-toggle";

export type NavPage = "home" | "posts" | "projects" | "about";
const destinations: {
  href: string;
  label: string;
  key: NavPage;
  icon: DockIconName;
}[] = [
  { href: "/", label: "首页", key: "home", icon: "home" },
  { href: "/posts", label: "写作", key: "posts", icon: "writing" },
  { href: "/projects", label: "项目", key: "projects", icon: "projects" },
];

function DockAvatar({ src, name }: { src?: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="dock-avatar" aria-hidden="true">
      <span>{name.trim().slice(0, 1).toUpperCase() || "S"}</span>
      {src && !failed && (
        <Image
          src={src}
          alt=""
          width={28}
          height={28}
          unoptimized
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export function BottomNav({
  active,
  avatarUrl,
  name = "ShyRobin",
}: {
  active?: NavPage;
  avatarUrl?: string | null;
  name?: string;
}) {
  const [preview, setPreview] = useState<number | null>(null);
  const current = destinations.findIndex((item) => item.key === active);
  const index = preview ?? current;
  return (
    <nav className="site-dock" aria-label="主导航">
      <div className="dock-profile">
        <Link
          href="/about"
          aria-label={`关于 ${name}`}
          aria-current={active === "about" ? "page" : undefined}
        >
          <DockAvatar
            key={avatarUrl || "initial"}
            src={avatarUrl}
            name={name}
          />
          <span className="dock-label" aria-hidden="true">
            关于我
          </span>
        </Link>
      </div>
      <span className="dock-separator" aria-hidden="true" />
      <div
        className="dock-links"
        role="group"
        aria-label="页面导航"
        style={{ "--dock-index": Math.max(0, index) } as CSSProperties}
        onMouseLeave={() => setPreview(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setPreview(null);
        }}
      >
        <span
          className="dock-indicator"
          data-visible={index >= 0}
          aria-hidden="true"
        />
        {destinations.map((item, index) => (
          <Link
            key={item.key}
            href={item.href}
            aria-label={item.label}
            aria-current={active === item.key ? "page" : undefined}
            onMouseEnter={() => setPreview(index)}
            onFocus={() => setPreview(index)}
            onClick={() => setPreview(index)}
          >
            <DockIcon name={item.icon} />
            <span className="dock-label" aria-hidden="true">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
      <span className="dock-separator" aria-hidden="true" />
      <div className="dock-theme" role="group" aria-label="显示设置">
        <ThemeToggle />
      </div>
    </nav>
  );
}
