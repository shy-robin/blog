import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { studioStructure } from "./src/sanity/structure";

export default defineConfig({
  name: "blog",
  title: "ShyRobin 博客管理",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "e4fd09lc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: studioStructure,
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => template.schemaType !== "profile"),
  },
  document: {
    actions: (actions, context) =>
      context.schemaType === "profile"
        ? actions.filter((action) => action.action !== "duplicate")
        : actions,
  },
});
