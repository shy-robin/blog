"use client";

import Image from "next/image";
import { useState } from "react";
import type { ReactNode } from "react";

export function SanityImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  fallback,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  fallback?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      fallback ?? (
        <div
          className="image-unavailable"
          role="img"
          aria-label={alt || "图片暂时无法加载"}
        >
          <p>{alt || "文章图片"}</p>
          <span>图片暂时无法加载</span>
        </div>
      )
    );
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
