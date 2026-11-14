import assert from "node:assert/strict";
import { test } from "node:test";
import type { Source } from "sanity";
import {
  createStructureBuilder,
  type DocumentNode,
  type ListItem,
} from "sanity/structure";
import { studioStructure } from "../src/sanity/structure";

test("Studio navigation serializes with Chinese labels and stable IDs", () => {
  // Use Sanity's real serializers; only the schema lookup is a local fixture.
  const source = {
    schema: {
      get: (name: string) => ({
        name,
        title: name,
        type: { name: "document" },
      }),
    },
    templates: [],
  } as unknown as Source;
  const S = createStructureBuilder({ source, perspectiveStack: ["published"] });
  const root = studioStructure(S).serialize();
  assert.equal(root.id, "blog");
  assert.equal(root.title, "博客管理");
  const items = root.items.filter(
    (item): item is ListItem => item.type === "listItem",
  );
  assert.deepEqual(
    items.map((item) => item.id),
    ["post", "project", "profile"],
  );
  assert.deepEqual(
    items.map((item) => item.title),
    ["文章", "项目", "个人资料"],
  );
  const editor = items.find((item) => item.id === "profile")
    ?.child as DocumentNode;
  assert.equal(editor.type, "document");
  assert.equal(editor.options.id, "profile");
  assert.equal(editor.options.type, "profile");
});
