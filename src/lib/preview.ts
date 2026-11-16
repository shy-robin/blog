import { timingSafeEqual } from "node:crypto";

export function secretsEqual(
  provided: string | null | undefined,
  expected: string | null | undefined,
): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // 长度不等也做一次比较，保持耗时与等长分支一致
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function previewSlug(value: string | null | undefined): string | null {
  const slug = value?.trim() || "";
  if (!slug || slug.length > 96 || /[/\\]/.test(slug)) return null;
  for (const char of slug) {
    const code = char.codePointAt(0) || 0;
    if (code < 32 || code === 127) return null;
  }
  return slug;
}
