import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { previewSlug, secretsEqual } from "../src/lib/preview";
import { GET } from "../src/app/api/draft-mode/enable/route";

test("secretsEqual compares timing-safely and rejects missing values", () => {
  assert.equal(secretsEqual("abc123", "abc123"), true);
  assert.equal(secretsEqual("abc123", "abc124"), false);
  assert.equal(secretsEqual("abc", "abc123"), false);
  assert.equal(secretsEqual("", "abc"), false);
  assert.equal(secretsEqual(null, "abc"), false);
  assert.equal(secretsEqual(undefined, undefined), false);
  assert.equal(secretsEqual("密钥🔑", "密钥🔑"), true);
  assert.equal(secretsEqual("密钥", "秘密"), false);
});

test("previewSlug accepts Chinese and reserved characters, rejects unsafe paths", () => {
  assert.equal(previewSlug("我的文章"), "我的文章");
  assert.equal(previewSlug("react & vue"), "react & vue");
  assert.equal(previewSlug("  post-1  "), "post-1");
  assert.equal(previewSlug("x".repeat(96)), "x".repeat(96));
  assert.equal(previewSlug(""), null);
  assert.equal(previewSlug(null), null);
  assert.equal(previewSlug(undefined), null);
  assert.equal(previewSlug("a/b"), null);
  assert.equal(previewSlug("a\\b"), null);
  assert.equal(previewSlug("a\nb"), null);
  assert.equal(previewSlug("x".repeat(97)), null);
});

function enableRequest(query: string) {
  return new NextRequest(`https://example.com/api/draft-mode/enable?${query}`);
}

test("enable route rejects unconfigured, wrong secret and invalid slug before draft mode", async () => {
  const previous = process.env.SANITY_PREVIEW_SECRET;
  try {
    delete process.env.SANITY_PREVIEW_SECRET;
    assert.equal(
      (await GET(enableRequest("secret=x&slug=post-1"))).status,
      503,
    );
    process.env.SANITY_PREVIEW_SECRET = "expected-secret";
    assert.equal(
      (await GET(enableRequest("secret=wrong&slug=post-1"))).status,
      401,
    );
    assert.equal(
      (await GET(enableRequest("secret=expected-secret&slug=a/b"))).status,
      400,
    );
    assert.equal(
      (await GET(enableRequest("secret=expected-secret"))).status,
      400,
    );
  } finally {
    if (previous === undefined) delete process.env.SANITY_PREVIEW_SECRET;
    else process.env.SANITY_PREVIEW_SECRET = previous;
  }
});
