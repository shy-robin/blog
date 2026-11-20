import assert from "node:assert/strict";
import { test } from "node:test";
import { countWords, getReadingStats } from "../src/lib/reading-stats";

test("countWords counts CJK characters and Latin words", () => {
  assert.equal(countWords("示例文本"), 4);
  assert.equal(countWords("hello world"), 2);
  assert.equal(countWords("中文 and English，标点。"), 6);
  assert.equal(countWords(""), 0);
});

test("getReadingStats reads only text blocks and rounds minutes up", () => {
  const body = [
    {
      _type: "block",
      children: [{ text: "一二三" }, { text: "four" }],
    },
    { _type: "codeBlock", code: "const ignored = 1;" },
    { _type: "block", children: [{ text: "五" }] },
  ];
  assert.deepEqual(getReadingStats(body), { words: 5, minutes: 1 });
  assert.deepEqual(getReadingStats([]), { words: 0, minutes: 1 });
  const long = [{ _type: "block", children: [{ text: "字".repeat(901) }] }];
  assert.deepEqual(getReadingStats(long), { words: 901, minutes: 4 });
});
