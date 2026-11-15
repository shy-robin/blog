import assert from "node:assert/strict";
import { test } from "node:test";
import EntryPage from "../src/app/page";

test("the site entry permanently redirects to writing and preserves filters", async () => {
  const cases: [Record<string, string | string[] | undefined>, string][] = [
    [{}, "/posts"],
    [{ q: "前端", tag: "Vuejs" }, "/posts?q=%E5%89%8D%E7%AB%AF&tag=Vuejs"],
    [{ tag: ["CSS", "JavaScript"] }, "/posts?tag=CSS&tag=JavaScript"],
  ];
  for (const [params, destination] of cases) {
    await assert.rejects(
      EntryPage({ searchParams: Promise.resolve(params) }),
      (error: unknown) =>
        error instanceof Error &&
        "digest" in error &&
        error.digest === `NEXT_REDIRECT;replace;${destination};308;`,
    );
  }
});
