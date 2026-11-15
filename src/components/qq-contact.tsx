"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "./arrow-right";

export function QQContact({
  urls,
}: {
  urls: { web: string; mobile: string; desktop: string };
}) {
  const [href, setHref] = useState(urls.web);
  useEffect(() => {
    setHref(
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        ? urls.mobile
        : urls.desktop,
    );
  }, [urls.mobile, urls.desktop]);
  return (
    <a href={href} aria-label="QQ，尝试打开 QQ 应用">
      QQ <ArrowRight />
    </a>
  );
}
