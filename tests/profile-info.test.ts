import assert from "node:assert/strict";
import { test } from "node:test";
import { profileAge, profileInfo } from "../src/lib/portfolio";

test("age updates on the birthday in Shanghai time", () => {
  assert.equal(profileAge("1990-06-15", new Date("2026-06-14T15:59:59Z")), 35);
  assert.equal(profileAge("1990-06-15", new Date("2026-06-14T16:00:00Z")), 36);
  assert.equal(profileAge("1990-06-15", new Date("2026-06-16T00:00:00Z")), 36);
});

test("missing, invalid and future birthdays never produce a public age", () => {
  const now = new Date("2026-01-01T00:00:00Z");
  for (const value of [undefined, "", "invalid", "1990-02-30", "2100-01-01"]) {
    assert.equal(profileAge(value, now), undefined);
  }
});

test("profile rows use supplied data, omit city and avoid duplicate fields", () => {
  const info = profileInfo(
    {
      name: "示例作者",
      location: "示例城市",
      gender: "示例性别",
      birthDate: "1990-06-15",
      hometown: "示例籍贯",
      school: "示例学校",
      occupation: "示例职业",
      basicInfo: [
        { _key: "city", label: "所在城市", value: "不应显示" },
        { _key: "age", label: "年龄", value: "旧年龄" },
      ],
    },
    new Date("2026-06-16T00:00:00Z"),
  );
  assert.deepEqual(
    info.map((item) => item.label),
    ["称呼", "性别", "年龄", "籍贯", "学校", "职业"],
  );
  assert.equal(info.find((item) => item.label === "年龄")?.value, "36 岁");
  assert.ok(!JSON.stringify(info).includes("1990-06-15"));
  assert.ok(!JSON.stringify(info).includes("不应显示"));
  assert.deepEqual(profileInfo({}), []);
});
