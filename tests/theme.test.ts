import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { themeInitScript } from "../src/lib/theme";

function initialize(
  stored: string | null,
  prefersDark: boolean,
  blocked = false,
) {
  const root = {
    dataset: {} as Record<string, string>,
    style: { colorScheme: "" },
  };
  runInNewContext(themeInitScript, {
    document: { documentElement: root },
    localStorage: {
      getItem() {
        if (blocked) throw new Error("Storage unavailable");
        return stored;
      },
    },
    matchMedia: () => ({ matches: prefersDark }),
  });
  return root;
}

test("theme initialization applies an explicit saved choice before rendering", () => {
  assert.equal(initialize("light", true).dataset.theme, "light");
  assert.equal(initialize("dark", false).dataset.theme, "dark");
  assert.equal(initialize("dark", false).style.colorScheme, "dark");
});

test("absent or invalid preferences follow the device scheme", () => {
  assert.equal(initialize(null, true).dataset.theme, "dark");
  assert.equal(initialize(null, false).dataset.theme, "light");
  assert.equal(initialize("unexpected", true).dataset.theme, "dark");
});

test("blocked storage still permits a usable initial theme", () => {
  assert.equal(initialize(null, true, true).dataset.theme, "dark");
  assert.equal(initialize(null, false, true).dataset.theme, "light");
});
