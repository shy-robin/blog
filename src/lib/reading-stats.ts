const CJK = /[\u3400-\u9fff\uf900-\ufaff]/g;
const LATIN_WORD = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;
const CHARS_PER_MINUTE = 300;

export function countWords(text: string) {
  const cjk = text.match(CJK)?.length ?? 0;
  const latin = text.replace(CJK, " ").match(LATIN_WORD)?.length ?? 0;
  return cjk + latin;
}

export function getReadingStats(
  body: readonly { _type: string; children?: unknown }[] = [],
) {
  const text = body
    .flatMap((block) =>
      block._type === "block" && Array.isArray(block.children)
        ? block.children.map((child: unknown) => {
            const value = (child as { text?: unknown } | null)?.text;
            return typeof value === "string" ? value : "";
          })
        : [],
    )
    .join(" ");
  const words = countWords(text);
  return {
    words,
    minutes: Math.max(1, Math.ceil(words / CHARS_PER_MINUTE)),
  };
}
