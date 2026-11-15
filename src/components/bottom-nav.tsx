"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { DockIcon, type DockIconName } from "./dock-icon";
import { ThemeToggle } from "./theme-toggle";
import { playNavigationSound } from "@/lib/navigation-sound";

export type NavPage = "posts" | "projects" | "about";
const destinations: {
  href: string;
  label: string;
  key: NavPage;
  icon: DockIconName;
}[] = [
  { href: "/posts", label: "文章", key: "posts", icon: "writing" },
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
  return (
    <nav className="site-dock" aria-label="主导航">
      <div className="dock-profile">
        <Link
          href="/about"
          aria-label="关于"
          aria-current={active === "about" ? "page" : undefined}
          onNavigate={() => {
            if (active !== "about") playNavigationSound();
          }}
        >
          <DockAvatar
            key={avatarUrl || "initial"}
            src={avatarUrl}
            name={name}
          />
          <span className="dock-label" aria-hidden="true">
            关于
          </span>
        </Link>
      </div>
      <span className="dock-separator" aria-hidden="true" />
      <div className="dock-links" role="group" aria-label="页面导航">
        {destinations.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            prefetch={item.key === "posts" ? true : undefined}
            aria-label={item.label}
            aria-current={active === item.key ? "page" : undefined}
            onNavigate={() => {
              if (active !== item.key) playNavigationSound();
            }}
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
