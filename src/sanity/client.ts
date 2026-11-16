import "server-only";
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "e4fd09lc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-02-19",
  perspective: "published",
  useCdn: false,
  timeout: 15000,
});

export function previewClient() {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) throw new Error("SANITY_API_READ_TOKEN 未配置，无法预览草稿");
  return client.withConfig({
    token,
    perspective: "previewDrafts",
    useCdn: false,
  });
}
