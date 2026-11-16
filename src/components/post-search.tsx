"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { postsUrl, searchValue } from "@/lib/post-search";

export function PostSearch({ query, tag }: { query: string; tag: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const composing = useRef(false);
  const submitted = useRef<string | null>(null);
  const previousTag = useRef(tag);
  const [pending, startTransition] = useTransition();

  function cancel() {
    clearTimeout(timer.current);
  }
  function search(value: string) {
    cancel();
    const next = searchValue(value);
    if (
      next === query &&
      (submitted.current === null || submitted.current === next)
    )
      return;
    submitted.current = next;
    startTransition(() =>
      router.replace(postsUrl(next, tag), { scroll: false }),
    );
  }
  function schedule(value: string) {
    cancel();
    if (!composing.current)
      timer.current = setTimeout(() => search(value), 350);
  }

  useEffect(() => {
    // Own responses must not overwrite newer text typed while a request ran.
    // External navigation (clear filters, tag changes, back/forward) resyncs it.
    if (previousTag.current !== tag || submitted.current !== query) {
      clearTimeout(timer.current);
      if (input.current) input.current.value = query;
      submitted.current = null;
    }
    previousTag.current = tag;
  }, [query, tag]);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <form
      className="post-search"
      role="search"
      action="/posts"
      method="get"
      aria-busy={pending}
      onSubmit={(event) => {
        event.preventDefault();
        if (!composing.current) search(input.current?.value || "");
      }}
    >
      <label htmlFor="post-query" className="sr-only">
        搜索文章标题、摘要、标签或正文
      </label>
      <input
        ref={input}
        id="post-query"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="搜索标题、摘要、标签或正文"
        maxLength={120}
        enterKeyHint="search"
        onChange={(event) => schedule(event.currentTarget.value)}
        onCompositionStart={() => {
          composing.current = true;
          cancel();
        }}
        onCompositionEnd={(event) => {
          composing.current = false;
          schedule(event.currentTarget.value);
        }}
      />
      {tag && <input type="hidden" name="tag" value={tag} />}
      <span className="sr-only" role="status">
        {pending ? "正在搜索…" : ""}
      </span>
    </form>
  );
}
