const fs = require("node:fs");
const path = require("node:path");
const { getCliClient } = require("sanity/cli");
const sanityImport = require("@sanity/import");

async function main() {
  const client = getCliClient({
    projectId: "e4fd09lc",
    dataset: "production",
    apiVersion: "2025-02-19",
    useCdn: false,
  }).withConfig({ perspective: "raw", timeout: 60000 });
  if (!client.config().token)
    throw new Error(
      "Run npx sanity login, then npm run migrate:gainmore:import",
    );
  const output = path.resolve("migration-output/gainmore");
  const documents = fs
    .readFileSync(path.join(output, "posts.ndjson"), "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  if (
    documents.length !== 84 ||
    documents.some(
      (doc) =>
        doc._type !== "post" ||
        !/^drafts\.gainmore-[a-f0-9]{24}$/.test(doc._id) ||
        doc.publishedAt !== doc.legacySource.publishedAt,
    )
  )
    throw new Error("Invalid migration inventory or timestamps");
  const ids = documents.flatMap((doc) => [
    doc._id,
    doc._id.replace(/^drafts\./, ""),
  ]);
  const before = await client.fetch("*[_id in $ids]{_id,publishedAt}", { ids });
  const conflicts = await client.fetch(
    '*[_type == "post" && slug.current in $slugs && !(_id in $ids)]{_id,title}',
    { slugs: documents.map((doc) => doc.slug.current), ids },
  );
  if (conflicts.length)
    throw new Error(
      `Existing slugs conflict: ${conflicts.map((doc) => doc.title).join(", ")}`,
    );
  fs.writeFileSync(
    path.join(output, "before-import.json"),
    JSON.stringify(before, null, 2),
  );
  const existing = new Set(before.map((doc) => doc._id));
  const pending = documents.filter(
    (doc) =>
      !existing.has(doc._id) && !existing.has(doc._id.replace(/^drafts\./, "")),
  );
  console.log(
    `Importing ${pending.length} new drafts; preserving ${documents.length - pending.length} existing articles.`,
  );
  if (pending.length) {
    const result = await sanityImport(pending, {
      client,
      operation: "createIfNotExists",
      assetConcurrency: 4,
      allowFailingAssets: false,
      onProgress: ({ step, current, total }) => {
        if (current === total || (current && current % 25 === 0))
          console.log(`${step}: ${current}/${total}`);
      },
    });
    fs.writeFileSync(
      path.join(output, "import-result.json"),
      JSON.stringify(result, null, 2),
    );
  }
  const after = await client.fetch(
    '*[_id in $ids]{_id,publishedAt,legacySource,"imageCount":count(body[_type == "image" && defined(asset._ref)]),"blocks":count(body)}',
    { ids },
  );
  const map = new Map(after.map((doc) => [doc._id, doc]));
  for (const expected of pending) {
    const actual = map.get(expected._id);
    if (
      !actual ||
      actual.publishedAt !== expected.publishedAt ||
      actual.legacySource.updatedAt !== expected.legacySource.updatedAt ||
      actual.blocks !== expected.body.length ||
      actual.imageCount !==
        expected.body.filter((block) => block._type === "image").length
    )
      throw new Error(`Import verification failed: ${expected.title}`);
  }
  fs.writeFileSync(
    path.join(output, "after-import.json"),
    JSON.stringify(after, null, 2),
  );
  console.log(
    JSON.stringify({
      verifiedArticles: after.length,
      newDrafts: pending.length,
      allNewPublicationDatesMatch: true,
    }),
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
