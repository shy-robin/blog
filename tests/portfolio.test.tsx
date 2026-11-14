import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  displayProfile,
  projectLinks,
  safeExternalUrl,
  contactEmailUrl,
  contentCacheTag,
} from "../src/lib/portfolio";
import { ProjectCard } from "../src/components/project-card";

test("an empty profile uses known public identity without inventing career or contact data", () => {
  const profile = displayProfile(null);
  assert.equal(profile.name, "ShyRobin");
  assert.equal(profile.githubUrl, "https://github.com/shy-robin");
  assert.equal(profile.email, undefined);
  assert.deepEqual(profile.experiences, []);
  assert.deepEqual(profile.interests, []);
  assert.equal(
    displayProfile({ name: " 自定义名字 ", intro: "个人介绍" }).name,
    "自定义名字",
  );
  assert.equal(displayProfile({ name: "自定义名字" }).githubUrl, undefined);
});
test("external links reject script schemes and embedded credentials", () => {
  assert.equal(safeExternalUrl("javascript:alert(1)"), undefined);
  assert.equal(safeExternalUrl("https://user:secret@example.com"), undefined);
  assert.equal(
    safeExternalUrl("https://example.com/demo"),
    "https://example.com/demo",
  );
  assert.equal(
    contactEmailUrl("hello@example.com"),
    "mailto:hello%40example.com",
  );
  assert.equal(
    contactEmailUrl("hello@example.com\r\nBcc:test@example.com"),
    undefined,
  );
  assert.deepEqual(
    projectLinks({
      demoUrl: "javascript:alert(1)",
      sourceUrl: "https://github.com/shy-robin/blog",
    }),
    [{ label: "源码", href: "https://github.com/shy-robin/blog" }],
  );
});
test("project cards show provided contributions, escape content and omit absent links", () => {
  const html = renderToStaticMarkup(
    <ProjectCard
      project={{
        _id: "test",
        title: "真实项目",
        summary: "<script>不能执行</script>",
        role: "前端开发",
        contributions: "搭建页面\n优化构建",
        technologies: ["React", "React", "TypeScript"],
      }}
    />,
  );
  assert.match(html, /真实项目/);
  assert.match(html, /搭建页面/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>|href=/);
  assert.equal((html.match(/>React</g) || []).length, 1);
});
test("publishing routes invalidate their own caches and preserve article behavior", () => {
  assert.equal(contentCacheTag("post"), "posts");
  assert.equal(contentCacheTag("project"), "projects");
  assert.equal(contentCacheTag("profile"), "profile");
  assert.equal(contentCacheTag("unknown"), null);
  assert.equal(contentCacheTag(undefined), null);
});
